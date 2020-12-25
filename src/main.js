import firebase from "firebase/app"
import "firebase/firestore"
import Leaderboard from "./Leaderboard"

// Load stylesheet
import "./main.css"

// Initialize Firebase
firebase.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
})

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
new Leaderboard(db)
