import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

games_ref = db.collection("games")
docs = games_ref.order_by("date").stream()

with open("games.csv", "a") as f:
    # Retrieve all games in the database and save to a local csv file
    for doc in docs:
        data = doc.to_dict()
        date = data["date"].isoformat(timespec="seconds")
        winner = data["winner"]
        looser = data["looser"]
        f.write(f"{date},{winner},{looser}\n")

        # Remove the document from the database
        games_ref.document(doc.id).delete()
