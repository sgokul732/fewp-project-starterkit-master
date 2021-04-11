# The Project – Starter Kit

This Starter Kit will give you a boilerplate for getting your Project up and running. Within this Starter Kit there is an example of implementing Postgres as
as your database, a fresh `create-react-app` project folder to build the React portion of your project, `composer` scripts to help you deploy 
the Project on Heroku, and a few `composer` libraries to help you with handling requests.

### Disclaimer

By using this Starter Kit, you commit to using Heroku and Postgres as your hosting environment/database for this Project. I can only help students who use this 
Starter Kit if they are following this path. If you choose to utilize a different hosting environment, you may not use this Starter Kit. Everything in this
Starter Kit is written for this path, including scripts used within the Starter Kit itself.

### What This Starter Kit Does

* Includes React app. Normally you would have to run `npx create-react-app ./` to accomplish this.
* Includes a database implementation, in the `public/data.php` file, giving you examples to work from.
* A set of composer libraries that make it easier to read from .env files, and work with the database. 

### Getting Started

* Make sure you have created a Heroku account. No credit card is required for anything that we are doing.
* Make sure you have Node.js v10+, npm v7+ and Heroku CLI installed on your computer.
* Copy `.env.example` to `.env`. Change the `REACT_APP_URL` and `DATABASE_URL` to match your Heroku settings ([Tutorial, with examples on where to find this information](https://www.youtube.com/watch?v=Yejm3x-46Tc))
* Read the "Available Commands" section below, and run the Setup command.

### Available Commands

* Setup (only needs to be done once):
    * Part A: 
        * Run `composer run setup`, which will automatically:
            * Run `composer install` to install PHP libraries used to read .env files, work with the database
            * Run `heroku login`
                * You will be prompted to login to your Heroku account
                * Once you are logged in, proceed to Part B below

    * Part B: 
        * Think of a unique name for your app, then run `heroku apps:create <name-of-my-app>`. This will create the app and add a remote to your repository for Heroku. You can also create this app from the Heroku web dashboard, but just remember that you will need to manually add the remote 
        (`heroku git:remote -a <name-of-my-app>`) afterwards.

* Local Development: 
    * Run `npm run start`

* Deploy: 
    * Run `composer run deploy`, which will automatically:
        * Runs `npm run build`
        * Runs `git add .`
        * Runs `git commit -m'Application update'`
        * Runs `git push -f heroku master`

### The Files (in no particular order)

* ./: A React application created by `create-react-app`. This is where you will spend the majority of your time writing your map-based application.
Most of the files in this directory are based on the original directory structure. For more information, [check this out](https://github.com/facebook/create-react-app).

* ./build/: When we run `npm run build` or `composer run deploy`, this folder is populated with the latest version of our React application.

* ./.env: Your application will get its environment-related information from here. In this case, it is largely to save our Heroku connection information. A library
called `dotenv` is used to read these environment variables into memory. You won't see this file until you complete "Getting Started" above.

* ./.env.blank: Because .env usually contains sensitive information, you don't include it in your repository. However, you can include a blank one so future 
developers know which fields are important to fill out.

* ./public/data.php: Handles interaction between the database and front-end application (React). This file is copied to `build` before deployment via `npm run build`.

* ./composer.json: Libraries needed for our application to run. Composer manages these libraries for us, and stores them in `vendor/`. 

* ./composer.lock: composer.json is human-readable, but not necessarily efficient to work through each time dependancies are built for your application. composer.lock contains much more information about the dependancies of the libraries you are using, making it easier for composer to calcuate what it needs to do. You won't see this file until you run the Setup command in "Available Commands."

* ./vendor/: Where composer keeps its dependancies/libraries. You won't see this directory until you run the Setup command in "Available Commands."

* ./Procfile: Tells Heroku where to serve files from. In this case, `build/`.


### Troubleshooting

* PHP
    * `heroku logs` can give you feedback on errors
    * You can log errors ( like console.log() ) by using error_log()

* Postgres
    * `heroku pg:psql` allows you to interactively query the database
    