# 🏓 Revolve Ping-Pong

Run `npm run deploy` to build the scripts and stylesheet for production, and deploy the site to the web.

Run `firebase emulators:start` to run the site and database locally.

Run `npm start` to start the webpack development server, and open the page in the default browser.

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
