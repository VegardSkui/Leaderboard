import RevolvePingPong from "./RevolvePingPong"

const db = firebase.firestore()

// Connect to the emulator if not in production and on localhost
if (process.env.NODE_ENV !== "production") {
    if (location.hostname === "localhost") {
        db.settings({
            host: "localhost:8080",
            ssl: false
        })
    }
}

// Kickoff
new RevolvePingPong(db)
