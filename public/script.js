const db = firebase.firestore()

// Connect to the emulator if on localhost
if (location.hostname === "localhost") {
    db.settings({
        host: "localhost:8080",
        ssl: false
    })
}

const defaultRank = 1000
const kFactor = 16

/**
 * Calculates the probability of a player winning against an opponent using
 * their current ranks
 * @param {number} playerRank - The current rank of the player
 * @param {number} opponentRank - The current rank of the opponent
 * @returns {number} The probability, a number in the range [0, 1]
 */
function winProbability(playerRank, opponentRank) {
    return 1.0 / (10.0 ** ((opponentRank - playerRank) / 400.0) + 1.0)
}

/**
 * Calculates the new ranks for the winner and looser of a game using their
 * current ranks
 * @param {number} currentWinnerRank - The current rank of the winner
 * @param {number} currentLooserRank - The current rank of the looser
 * @returns {Array} An array with the new rank of the winner on index 0 and the new rank of the looser on index 1
 */
function newRanks(currentWinnerRank, currentLooserRank) {
    let winnerRank = currentWinnerRank + kFactor * (1.0 - winProbability(currentWinnerRank, currentLooserRank))
    let looserRank = currentLooserRank + kFactor * (0.0 - winProbability(currentLooserRank, currentWinnerRank))
    return [winnerRank, looserRank]
}

/**
 * Adds a new game to the database with the specified winner and looser, will
 * also update the player records and the table
 * @param {string} Username of the winner
 * @param {string} Username of the looser
 */
function addGame(winner, looser) {
    const winnerDoc = db.collection("players").doc(winner)
    const looserDoc = db.collection("players").doc(looser)

    // Get the records for the winner and looser
    getWinner = winnerDoc.get()
    getLooser = looserDoc.get()

    // Store a record of the game itself
    db.collection("games").add({
        winner: winner,
        looser: looser,
        date: new Date()
    })

    Promise.all([getWinner, getLooser]).then(data => {
        // Get the existing data for the winner/looser, or use default data
        let winner = data[0].exists ? data[0].data() : { rank: defaultRank, wins: 0, losses: 0 }
        let looser = data[1].exists ? data[1].data() : { rank: defaultRank, wins: 0, losses: 0 }

        // Calculate the updated ranks for the players
        let ranks = newRanks(winner["rank"], looser["rank"])
        winner["rank"] = ranks[0]
        looser["rank"] = ranks[1]

        // Update wins and losses
        winner["wins"]++
        looser["losses"]++

        // Store the updated ranks
        updateWinner = winnerDoc.set(winner)
        updateLooser = looserDoc.set(looser)

        // Update the table when the results have been stored
        Promise.all([updateWinner, updateLooser]).then(playersTable.update())
    })
}

/**
 * Manages the table that displays current player stats
 */
class PlayersTable {
    /**
     * Find the provided table by id and does an initial reset
     * @param {string} id - The id of the table to be managed
     */
    constructor(id) {
        this.tableHeader = document.getElementById(id).querySelector("thead")
        this.tableBody = document.getElementById(id).querySelector("tbody")
        this.probabilityColumnIsActive = false
        this.reset()
    }

    /**
     * Adds a new row in the table for a player
     * @param {string} name - The name of the player
     * @param {number} rank - The current rank of the player
     * @param {number} wins - The number of wins for the player
     * @param {number} losses - The number of losses for the player
     */
    addPlayer(name, rank, wins, losses) {
        let row = document.createElement("tr")
        if (this.nextStanding % 2 == 0)
            row.classList.add("bg-gray-100")

        let cells = []

        let standingCell = document.createElement("td")
        standingCell.textContent = this.nextStanding++
        cells.push(standingCell)

        let nameCell = document.createElement("td")
        nameCell.textContent = name
        nameCell.title = rank
        cells.push(nameCell)

        let winsCell = document.createElement("td")
        winsCell.textContent = wins
        cells.push(winsCell)

        let lossesCell = document.createElement("td")
        lossesCell.textContent = losses
        cells.push(lossesCell)

        let probabilityCell = document.createElement("td")
        probabilityCell.hidden = true
        cells.push(probabilityCell)

        // Add the basic styling classes to each cell
        cells.forEach(cell => cell.classList.add("border", "px-4", "py-2"))

        // Append each cell to the row
        cells.forEach(cell => row.appendChild(cell))

        // Display the win probabilities for a player when their row is clicked
        row.onclick = _ => this.displayWinProbabilities(name)

        this.tableBody.appendChild(row)
    }

    /**
     * Displays the probability of the provided player to win against each of
     * the other players
     * @param {string} name - Name of the player
     */
    displayWinProbabilities(name) {
        // Return if the win probability display isn't active
        if (!this.probabilityColumnIsActive)
            return

        let playerRow = this.getRow(name)

        // The rank is stored in the title attribute of the name cell
        let playerRank = playerRow.querySelectorAll("td")[1].title

        this.tableBody.querySelectorAll("tr").forEach(row => {
            // Show the probability cell
            let probabilityCell = row.querySelectorAll("td")[4]
            probabilityCell.hidden = false

            // Calculate the probability of beating the player in this row
            let rank = row.querySelectorAll("td")[1].title
            let percentage = (winProbability(playerRank, rank) * 100).toFixed(1) + " %"

            // Don't show a probability if this row is the player
            if (row == playerRow)
                percentage = ""

            probabilityCell.textContent = percentage
        })
    }

    /**
     * Gets the table row representing the specified player
     * @param {string} name - Name of the player
     * @returns {HTMLTableRowElement} - The row representing the player
     */
    getRow(name) {
        return Array.from(this.tableBody.querySelectorAll("tr")).find(row => {
            // The name is always in the second column
            return row.querySelectorAll("td")[1].textContent == name
        })
    }

    /**
     * Resets the table, removes all players
     */
    reset() {
        this.tableBody.innerHTML = ""
        this.nextStanding = 1
    }

    /**
     * Toggles the win probabilty column
     */
    toggleProbabilityColumn() {
        // Hide/show the probability header
        this.tableHeader.querySelector("th:nth-child(5)").hidden = this.probabilityColumnIsActive

        // Hide/show each probability cell
        this.tableBody.querySelectorAll("td:nth-child(5)").forEach(probabilityCell => {
            probabilityCell.hidden = this.probabilityColumnIsActive
        })

        this.probabilityColumnIsActive = !this.probabilityColumnIsActive
    }

    /**
     * Updates the table with the latest data from the database, also updates
     * the count of total games played
     */
    update() {
        db.collection("players").orderBy("rank", "desc").get().then(querySnapshot => {
            this.reset()

            // Add a new table row for each player
            let total = 0
            querySnapshot.forEach(doc => {
                playersTable.addPlayer(doc.id, doc.data().rank, doc.data().wins, doc.data().losses)

                total += doc.data().wins
            })

            // Update the count of total games played
            document.getElementById("total").textContent = total
        })
    }
}

// Toggle the probability column if not focused on an input (in the body) and
// pressing the W key while holding down both control and shift
document.addEventListener("keypress", e => {
    if (e.target.tagName == "BODY" && e.shiftKey && e.ctrlKey && e.code == "KeyW")
        playersTable.toggleProbabilityColumn()
})

document.getElementById("add-game-form").onsubmit = e => {
    // Don't reload the page
    e.preventDefault()

    const winnerInput = document.getElementById("winner")
    const looserInput = document.getElementById("looser")

    // Add the game
    addGame(winnerInput.value.trim(), looserInput.value.trim())

    // Clear the inputs
    winnerInput.value = ""
    looserInput.value = ""

    // Give focus to the winner field
    winnerInput.focus()
}

const playersTable = new PlayersTable("players")

// Give winner field focus and do initial table update on load
document.getElementById("winner").focus()
playersTable.update()
