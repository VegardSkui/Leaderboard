import RevolvePingPong from "./RevolvePingPong"

const db = firebase.firestore()

// Connect to the emulator if on localhost
if (location.hostname === "localhost") {
    db.settings({
        host: "localhost:8080",
        ssl: false
    })
}

// Kickoff
new RevolvePingPong(db)
