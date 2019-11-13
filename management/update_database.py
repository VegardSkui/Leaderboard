import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from calculations import get_players

cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

players_ref = db.collection("players")

# Delete all current player records
for doc in players_ref.stream():
    players_ref.document(doc.id).delete()

# Create new player records
for (name, data) in get_players().items():
    players_ref.document(name).set(data)
