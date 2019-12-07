import Calculations from "./Calculations"
import Player from "./Player"
import PlayersTable from "./PlayersTable"

/**
 * Manages the whole application
 */
export default class Leaderboard {
    /**
     * Initializes a new Leaderboard instance using the provided
     * firestore connection
     * @param {object} db - The firestore connection
     */
    constructor(db) {
        this.db = db
        this.playersTable = new PlayersTable("players")

        // Set the document title
        document.getElementById("title").textContent = document.title = process.env.APP_NAME

        // Give the winner field focus, and do the initial table update
        document.getElementById("winner").focus()
        this.update()

        // Toggle the probability column if not focused on an input (in the body)
        // and releasing the W key while holding down both alt and shift
        document.addEventListener("keyup", e => {
            if (e.target.tagName == "BODY" && e.altKey && e.shiftKey && e.code == "KeyW")
                this.playersTable.toggleProbabilityColumn()
        })

        // Setup a listener for when the add game form is submitted
        document.getElementById("add-game-form").onsubmit = e => {
            // Don't reload the page
            e.preventDefault()

            const winnerInput = document.getElementById("winner")
            const looserInput = document.getElementById("looser")

            // Add the game
            this.addGame(winnerInput.value.trim(), looserInput.value.trim())

            // Clear the inputs
            winnerInput.value = ""
            looserInput.value = ""

            // Give focus to the winner field
            winnerInput.focus()
        }
    }

    /**
     * Adds a new game to the database with the specified winner and looser,
     * will also update the player records and the table
     * @param {string} - Name of the winner
     * @param {string} - Name of the looser
     */
    addGame(winner, looser) {
        const winnerDoc = this.db.collection("players").doc(winner)
        const looserDoc = this.db.collection("players").doc(looser)

        // Get the records for the winner and looser
        let getWinner = winnerDoc.get()
        let getLooser = looserDoc.get()

        // Store a record of the game itself
        this.db.collection("games").add({
            winner: winner,
            looser: looser,
            date: new Date()
        })

        Promise.all([getWinner, getLooser]).then(data => {
            // Get the existing data for the winner/looser, or use default data
            let winner = Player.initFromRecord(data[0])
            let looser = Player.initFromRecord(data[1])

            // Calculate the updated ranks for the players
            let ranks = Calculations.newRanks(winner.rank, looser.rank)
            winner.rank = ranks[0]
            looser.rank = ranks[1]

            // Update wins and losses
            winner.wins++
            looser.losses++

            // Store the updated players
            let updateWinner = winnerDoc.set(winner.toRecord())
            let updateLooser = looserDoc.set(looser.toRecord())

            // Update when the results have been stored
            Promise.all([updateWinner, updateLooser]).then(this.update())
        })
    }

    /**
     * Update the data on the page using the latest data from the database
     */
    update() {
        this.db.collection("players").orderBy("rank", "desc").get().then(querySnapshot => {
            // Construct an array of all the players
            let players = []
            querySnapshot.forEach(doc => players.push(new Player(doc.id, doc.data().rank, doc.data().wins, doc.data().losses)))

            // Update the players table
            this.playersTable.update(players)

            // Update the count of total games played
            let total = players.reduce((total, player) => total + player.wins, 0)
            document.getElementById("total").textContent = total
        })
    }
}
