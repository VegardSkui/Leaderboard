import * as firebase from "firebase/app"
import "firebase/firestore"
import RevolvePingPong from "./RevolvePingPong"

// Load stylesheet
import "./main.css"

// Initialize Firebase
firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    appId: process.env.FIREBASE_APP_ID,
    authDomain: process.env.FIREBASE_PROJECT_ID + ".firebaseapp.com",
    databaseURL: "https://" + process.env.FIREBASE_PROJECT_ID + ".firebaseio.com",
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_PROJECT_ID + "appspot.com"
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
new RevolvePingPong(db)
