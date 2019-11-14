import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from calculations import get_players

cred = credentials.Certificate("serviceAccount.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

players_ref = db.collection("players")

# Create a new batch of database operations
batch = db.batch()

# Delete all current player records
for doc in players_ref.stream():
    doc_ref = players_ref.document(doc.id)
    batch.delete(doc_ref)

# Create new player records
for (name, data) in get_players().items():
    doc_ref = players_ref.document(name)
    batch.set(doc_ref, data)

# Commit the batch
batch.commit()
