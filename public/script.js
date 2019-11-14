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
        Promise.all([updateWinner, updateLooser]).then(updateTable)
    })
}

/**
 * Updates the table of players with the latest data from the database
 */
function updateTable() {
    db.collection("players").orderBy("rank", "desc").get().then(querySnapshot => {
        const table = document.getElementById("table-body")

        // Reset the table
        table.innerHTML = ""

        // Add a new table row for each player
        let total = 0
        let nextStanding = 1
        querySnapshot.forEach(doc => {
            let row = document.createElement("tr")
            if (nextStanding % 2 == 0) {
                row.classList.add("bg-gray-100")
            }

            let standing = document.createElement("td")
            standing.textContent = nextStanding++
            standing.classList.add("border", "px-4", "py-2")

            let name = document.createElement("td")
            name.textContent = doc.id
            name.classList.add("border", "px-4", "py-2")
            name.title = doc.data().rank

            let wins = document.createElement("td")
            wins.textContent = doc.data().wins
            wins.classList.add("border", "px-4", "py-2")

            let losses = document.createElement("td")
            losses.textContent = doc.data().losses
            losses.classList.add("border", "px-4", "py-2")

            row.appendChild(standing)
            row.appendChild(name)
            row.appendChild(wins)
            row.appendChild(losses)
            table.appendChild(row)

            total += doc.data().wins
        })

        // Update the count of total games played
        document.getElementById("total").textContent = total
    })
}

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

// Give winner field focus and do initial table update on load
document.getElementById("winner").focus()
updateTable()
