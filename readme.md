# Damnatio
## A Node.js app to create a series of interactive graphs exploring the death penalty in the United States

### Installation

1. `cd` into an appropriate directory, like `~/Documents/code`.
2. Run `git clone git@github.com:jswest/damnatio.git`. If it asks you for your password, that's just Git being Git.
3. `cd` into the directory GitHub just created. It should be called `damnatio`.
4. This is a Node.js app, so you'll need to have node installed. Check if you do. Type `which node`. If Terminal gives you the location of node, then you can proceed to step 9; if it gives you nothing, then continue with step 5.
5. Now we're going to install Node Version Manager. Type `curl https://raw.githubusercontent.com/creationix/nvm/v0.6.1/install.sh | sh` and enter your password when prompted.
6. Type `which nvm`. If you get nothing, close and reopen terminal. If you get the location of NVM, you should be good to go.
7. If that worked, type `nvm install 0.10`, which will install the most recent version of Node.js.
8. Still in the damnatio project directory, type `nvm use 0.10`.
9. Type `npm install`. This installs all the necessary dependencies for the project.
10. Type `node server.js`. This boots up the server.
11. In your browser, navigate to `http://localhost:5000`. You should be seeing the project now.
