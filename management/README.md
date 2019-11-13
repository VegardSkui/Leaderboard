# Revolve Ping-Pong Management

Run `python3 calculate_standings.py` to calculate the current standings using the data in `games.csv`.

Run `python3 dump_games.py` to dump all game records from the database to `games.csv`. This will remove the games from the database.

Run `python3 update_database.py` to update the player data on the server with the data calculated from `games.csv`. This deletes all current player records from the database, so remember to dump all games first!

---

Scripts interacting with the remote database requires the Firebase Admin SDK:
```
pip3 install --upgrade firebase-admin
```
The credentials should be placed in `serviceAccount.json`.
