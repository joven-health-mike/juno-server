# Import all variables in the local .env file, if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

default: menu
menu:
	@echo "\n\tAvailable Commands:\n"
	@echo "\t🚧  build          \t build project for distribution"
	@echo "\t✅  check          \t run all static analysis tools"
	@echo "\t🐳  docker-start   \t build and run in a production environment"
	@echo "\t🏗   install       \t install project dependencies"
	@echo "\t🚀  start          \t start the service"
	@echo "\t🧪  test           \t run all tests"
	@echo "\n\n\tSee the \"Makefile\" or use command \"make list\" for a complete list of commands.\n"

.PHONY: list
list:
	@echo $(MAKEFILE_LIST)
	@echo "\n🗺️  List of all available make commands:\n"
	@$(MAKE) -pRrq -f $(lastword Makefile) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'
	@echo ""

build: install-nvm
	@echo "\n🏗️  Building project for distribution"
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
	@source $(HOME)/.nvm/nvm.sh ; nvm exec --silent npm run-script prettier
	@echo "\n✅  Checking for outdated dependencies\n"
	@-source $(HOME)/.nvm/nvm.sh ; nvm exec --silent npm outdated
	@echo "\n✅  Checking for newer node.js versions\n"
	@nvm ls-remote v18
	@echo "\n🎉  Done.\n"

docker-build:
	@echo "\n🐳  Building a new docker image called \"create-node-app:latest\"\n"
	NPMRC=$$(cat ~/.npmrc) docker image build --secret id=npmrc,env=NPMRC -t create-node-app:latest .

docker-build-no-cache:
	@echo "\n🐳  Building a new docker image from scratch called \"create-node-app:latest\"\n"
	docker build --no-cache --progress=plain -t create-node-app:latest .

docker-scan:
	$(MAKE) docker-build
	@echo "\n🐳  Scanning docker \"create-node-app:latest\" with Snyk\n"
	docker scan create-node-app:latest

docker-logs:
	@echo "\n🐳  Streaming docker container logs from \"create-node-app\" (CTRL+C to Quit)\n"
	@source $(HOME)/.nvm/nvm.sh ; docker logs -f create-node-app | ./node_modules/.bin/pino-pretty

docker-shell:
	@echo "\n🐳  Starting a shell in the local docker container \"create-node-app\" (Enter command \"exit\" to Quit)\n"
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

install-nvm:
ifneq (, ${shell command -v nvm})
	@echo "\n🌮  Installing nvm, see https://github.com/nvm-sh/nvm\n"
	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
endif

start: install-nvm
	@echo "\n🚀  Starting Service"
	@source $(HOME)/.nvm/nvm.sh ; nvm exec --silent npm start --quiet | ./node_modules/.bin/pino-pretty

test: install-nvm
	@echo "\n🧪  Running all unit tests"
	@source $(HOME)/.nvm/nvm.sh ; nvm exec --silent \
	npm test --quiet

uninstall-nvm:
ifneq (, ${shell command -v nvm})
	@echo "\n🌮  Uninstalling nvm, see https://github.com/nvm-sh/nvm\n"
	rm -rf "$NVM_DIR"
	@echo "\n⚠️  You will need to manually remove any references to NVM in your ~/.bashrc or other shell resource config files.\n"
endif
