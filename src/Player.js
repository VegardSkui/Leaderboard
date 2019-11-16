import { defaultRank } from "./Calculations"

/**
 * Stores data about a player
 */
export default class Player {
    /**
     * Constructs a new player object using the specified data
     * @param {string} name - Name of the player
     * @param {number} rank - Current rank of the player
     * @param {number} wins - Current number of wins
     * @param {number} losses - Current number of losses
     */
    constructor(name, rank, wins, losses) {
        this.name = name
        this.rank = rank
        this.wins = wins
        this.losses = losses
    }

    /**
     * Converts the player to a dictionary ready to be stores in Firestore
     * @returns {Object}
     */
    toRecord() {
        return {
            rank: this.rank,
            wins: this.wins,
            losses: this.losses
        }
    }

    /**
     * Create a new Player using a database record, or a player with default
     * values if the record doesn't exist
     * @param {Object} record - Firestore document
     * @returns {Player}
     */
    static initFromRecord(record) {
        if (record.exists)
            return new Player(record.id, record.data().rank, record.data().wins, record.data().losses)
        return this.initWithDefaults(record.id)
    }

    /**
     * Creates a new Player using default values
     * @param {string} name - Name of the player
     * @returns {Player}
     */
    static initWithDefaults(name) {
        return new Player(name, defaultRank, 0, 0)
    }
}
