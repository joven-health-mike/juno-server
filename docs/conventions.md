# Conventions

**Place commonly used commands in the Makefile**

The Makefile helps automate and document common commands and tasks. Making it easier for multiple developers to work on the project. This file should not be treated as a script. Only commands that you would physically type into the command line should be placed here.

**Do not use `index.js` files.**

It's tempting to use files named `index.js` to simplify the path needed when importing files, this practice should be avoided. As a project grows it can become difficult to differentate working on multiple files all called `index.js`. It's much more clear to have files that are named appropriately, such as `log.js` and `server.js`, when dealing with large amounts of files.

**Develop towards a single IDE**

All developers should use the same development environment to reduce the development complexity. This project is currently targetting vscode.

## Roles of files
* schema = define data storage
* model = database queries
* middleware = express middleware (controller), handle user input
* router = direct api requests to middleware
* service = functionality not related to a model, view, or controller.  For example interacting with an external API or calendar methods
* utility = Methods that are useful anywhere in the application

