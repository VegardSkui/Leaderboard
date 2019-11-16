import Calculations from "./Calculations"

/**
 * Manages the table that displays current player stats
 */
export default class PlayersTable {
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
     * @param {Player} player - The player
     */
    addPlayer(player) {
        let row = document.createElement("tr")
        if (this.nextStanding % 2 == 0)
            row.classList.add("bg-gray-100")

        let cells = []

        let standingCell = document.createElement("td")
        standingCell.textContent = this.nextStanding++
        cells.push(standingCell)

        let nameCell = document.createElement("td")
        nameCell.textContent = player.name
        nameCell.title = player.rank
        cells.push(nameCell)

        let winsCell = document.createElement("td")
        winsCell.textContent = player.wins
        cells.push(winsCell)

        let lossesCell = document.createElement("td")
        lossesCell.textContent = player.losses
        cells.push(lossesCell)

        let probabilityCell = document.createElement("td")
        probabilityCell.hidden = true
        cells.push(probabilityCell)

        // Add the basic styling classes to each cell
        cells.forEach(cell => cell.classList.add("border", "px-4", "py-2"))

        // Append each cell to the row
        cells.forEach(cell => row.appendChild(cell))

        // Display the win probabilities for a player when their row is clicked
        row.onclick = _ => this.displayWinProbabilities(player.name)

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
            let percentage = (Calculations.winProbability(playerRank, rank) * 100).toFixed(1) + " %"

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
     * @param {array} players - A sorted array of players to be displayed
     */
    update(players) {
        this.reset()

        // Add a new table row for each player
        players.forEach(player => this.addPlayer(player))
    }
}
