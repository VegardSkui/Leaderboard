# Leaderboard

<img alt="Medal Icon" src="icon.svg" width="100">

A leaderboard webapp that uses ELO rating to determine the current rankings. Can be used for any games where a match results in a single winner and a single looser.

---

Run `npm run deploy` to build the scripts and stylesheet for production, and deploy the site to the web.

Run `firebase emulators:start` to run the site and database locally.

Run `npm start` to start the webpack development server, and open the page in the default browser.

## Setup

This guide assumes you have cloned this Git repository, and have `npm` and the [Firebase CLI](https://firebase.google.com/docs/cli/) installed.

1. Add a new project on [Firebase](https://console.firebase.google.com/)
4. Provision Cloud Firestore by going to the Database tab in the Firebase Web Console and pressing Create database
2. Run `firebase use YOUR_PROJECT_ID` to set your newly created Firebase project
3. Run `npm install` to install dependencies
4. Copy `.env.example` to `.env.deploy` and set your environment variables (`.env` is used during local development)
5. Run `npm run deploy` to build and deploy

## Database Layout

The project uses a Firebase Firestore database as it's live backend.

### games

The `games` collection provides temporary storage of the latest games entered into the system until they're downloaded locally by the management scripts.

| Field  | Description               |
| ------ | ------------------------- |
| winner | Name of the winner        |
| looser | Name of the looser        |
| date   | When the game was entered |

### players

The `players` collection stores the current data for each player.

| Field  | Description         |
| ------ | ------------------- |
| rank   | Current ELO rating  |
| wins   | Count of games won  |
| losses | Count of games lost |
