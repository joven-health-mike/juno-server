# Import all variables in the local .env file, if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

default: menu
menu:
	@echo "\nAvailable Commands:\n"
	@echo "🚧  build          \t build project for distribution"
	@echo "✅  check          \t run all static analysis tools"
	@echo "🐳  docker-start   \t build and run in a production environment"
	@echo "🏗   install        \t install project dependencies"
	@echo "🚀  start          \t start the service"
	@echo "🧪  test           \t run all tests"
	@echo "\n\nSee the \"Makefile\" or use command \"make list\" for a complete list of commands.\n"

.PHONY: list
list:
	@echo $(MAKEFILE_LIST)
	@echo "\n🧭  List of all available make commands:\n"
	@$(MAKE) -pRrq -f $(lastword Makefile) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'
	@echo ""

build: install-nvm db-build
	@echo "\n🏗  Building project for distribution"
	@source $(HOME)/.nvm/nvm.sh ; nvm exec --silent \
	npm run-script build
	@echo "🎉  Finished build, distribution files can be found in the ./build folder\n"

build-start:
	@$(MAKE) build
	@echo "\n🚀  Starting Service using files in ./build"
	@source $(HOME)/.nvm/nvm.sh ; nvm exec --silent node ./build/src/index.js

check: install-nvm
	@echo "\n✅  Running all static analysis tools\n"
	@source $(HOME)/.nvm/nvm.sh ; nvm exec --silent npm run-script eslint
	@echo "\n✅  Checking for outdated dependencies\n"
	@-source $(HOME)/.nvm/nvm.sh ; nvm exec --silent npm outdated
	@echo "\n✅  Validating Caddy configuration\n"
	@caddy validate --config caddy.json 2>/dev/null | grep -q "Valid configuration" || echo "\n🚨  The \"caddy.json\" file is invalid, to see the validation errors run \"caddy validate --config caddy.json\"\n"
	@echo "\n✅  Checking for newer node.js versions. Review the list for newer versions.\n"
	@source $(HOME)/.nvm/nvm.sh ; nvm ls-remote v18
	@echo "\n🎉  Done. Review the output for warnings and errors.\n"

db-build:
	@echo "\n🚀  Building Prisma database artifacts."
	@source $(HOME)/.nvm/nvm.sh ; nvm exec --silent npm run-script prisma:generate

db-ui:
	@echo "\n🚀  Launching Prisma Studio."
	@npx prisma studio

docker-build:
	@echo "\n🐳  Building a new docker image called \"create-node-app:latest\".\n"
	NPMRC=$$(cat ~/.npmrc) docker image build --secret id=npmrc,env=NPMRC -t create-node-app:latest .

docker-db:
	@echo "\n🐳  Starting a PostgreSQL database in a docker container called \"postgres\".\n"
	@docker stop postgres &>/dev/null || true && docker rm postgres &>/dev/null || true
	@mkdir -p $(PWD)/.docker && docker run --name postgres -p 5555:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=create-node-app -v $(PWD)/.docker/postgres:/var/lib/postgresql/data/ -d postgres

docker-db-psql:
	@echo "\n🐳  Connecting to the PostgreSQL database command line.\n"
	@docker exec -it postgres psql postgresql://postgres:postgres@localhost:5432/create-node-app

docker-db-stop:
	@echo "\n🐳  Starting a PostgreSQL database in a docker container called \"postgres\".\n"
	@docker container stop postgres

docker-build-no-cache:
	@echo "\n🐳  Building a new docker image from scratch called \"create-node-app:latest\".\n"
	docker build --no-cache --progress=plain -t create-node-app:latest .

docker-scan:
	$(MAKE) docker-build
	@echo "\n🐳  Scanning docker \"create-node-app:latest\" with Snyk.\n"
	docker scan create-node-app:latest

docker-logs:
	@echo "\n🐳  Streaming docker container logs from \"create-node-app\". (CTRL+C to Quit)\n"
	@source $(HOME)/.nvm/nvm.sh ; docker logs -f create-node-app | ./node_modules/.bin/pino-pretty

docker-shell:
	@echo "\n🐳  Starting a shell in the local docker container \"create-node-app\". (Enter command \"exit\" to Quit)\n"
	@docker run -it create-node-app /bin/sh

docker-start:
	@$(MAKE) docker-build
	@$(MAKE) docker-stop
	@echo "🐳  Starting the server in a docker container on port \"8080\" in \"production\" mode called \"create-node-app\""
	@docker run -d --env NODE_ENV=production --env PORT=8080 -p 8080:8080 --name create-node-app create-node-app:latest 2>&1 >/dev/null
	@$(MAKE) docker-logs

docker-stop:
	@echo "\n🐳  Stopping and removing the create-node-app container\n"
	@docker stop create-node-app 2>&1 >/dev/null || true
	@docker rm create-node-app 2>&1 >/dev/null || true

install: install-nvm
	@echo "\n🏗  Install VSCode extensions\n"
	@code --install-extension dbaeumer.vscode-eslint@2.2.2
	@echo "\n🏗  Installing node and dependencies\n"
	@source $(HOME)/.nvm/nvm.sh ; nvm install ; nvm exec npm install

install-caddy: install-homebrew
ifeq (, ${shell command -v caddy})
	@echo "\n🦫 Install caddy using homebrew, see https://caddyserver.com\n"
	@brew update && brew install caddy
endif

install-homebrew:
ifeq (, ${shell command -v brew})
	@echo "\n🍺  Installing homebrew, see https://brew.sh\n"
	@/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
endif

install-nvm:
ifneq (, ${shell command -v nvm})
	@echo "\n🌮  Installing nvm, see https://github.com/nvm-sh/nvm\n"
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
endif

install-tfenv:
ifneq (, ${shell command -v tfenv})
	@echo "\n🌮  Installing tfenv, see https://github.com/tfutils/tfenv\n"
	@brew update && brew install tfenv
endif

start: install-nvm
	@echo "\n🚀  Starting Service"
	@source $(HOME)/.nvm/nvm.sh ; nvm exec --silent npm start --quiet | ./node_modules/.bin/pino-pretty

start-proxy: install-caddy
ifneq (200,${shell curl -s -o /dev/null -w "%{http_code}" http://localhost:2019/config/})
	@echo "\n🔑  Starting a proxy from https://localhost to http://localhost:8080"
	caddy start --config caddy.json
else
	@echo "\n🔑  A proxy from https://localhost to http://localhost:8080 is already running.\n"
endif

stop-proxy: install-caddy
ifeq (200,${shell curl -s -o /dev/null -w "%{http_code}" http://localhost:2019/config/})
	@echo "\n🔑  Stopping the proxy from https://localhost to http://localhost:8080"
	caddy stop --config caddy.json
else
	@echo "\n🔑  The proxy from https://localhost to http://localhost:8080 is not running.\n"
endif

test: install-nvm
	@echo "\n🧪  Running all unit tests"
	@source $(HOME)/.nvm/nvm.sh ; nvm exec --silent \
	npm test --quiet

uninstall-nvm:
ifneq (, ${shell command -v nvm})
	@echo "\n🌮  Uninstalling nvm, see https://github.com/nvm-sh/nvm\n"
	rm -rf "$NVM_DIR"
	@echo "\n🚨  You will need to manually remove any references to NVM in your ~/.bashrc or other shell resource config files.\n"
endif
