# Messaging App (Backend)

The messaging web app allows users to send and receive real-time messages. It focuses on essential features, including authorization and sending messages to individuals. This project is responsible for handling requests from the frontend.

Frontend repo: https://github.com/kristenmazza/messaging-app-frontend

Live demo: https://km-messaging-app.netlify.app/ :point_left:

## Technology Used

- Express.js/Node.js
- MongoDB & Mongoose
- TypeScript
- Jest/Supertest/Mongodb-memory-server

## Getting Started

1. This project uses MongoDB for the database. See the relevant documentation for setup.
2. Run `npm install` to install the necessary dependencies.
3. Configure your database connection in the `.env` file by adding the following variable:
   - `MONGODB_URI=Your MongoDB connection string`
4. Add additional variables in the `.env` file for authentication purposes:
   - `ACCESS_TOKEN_SECRET=Generated access token`
   - `REFRESH_TOKEN_SECRET=Generated refresh token`
5. Use `npm run dev` to start the server in development mode.

## Deployment to Fly.io

The Express.js backend is deployed as a Fly VM to Fly.io. The definition for the deployment is in [fly.toml](./fly.toml) and it references the [Dockerfile](./Dockerfile).

The Fly.io command line interface is called `fly`. Install it with Homebrew package `flyctl`:

    brew install flyctl

To deploy change to Fly.io:

    fly deploy

Be sure to include your `MONGODB_URI` as a secret within your Fly.io settings.
