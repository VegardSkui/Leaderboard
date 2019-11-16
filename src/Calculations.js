export const defaultRank = 1000
export const kFactor = 16

/**
 * Provides ranking calculation functions
 */
export default class Calculations {
    /**
     * Calculates the probability of a player winning against an opponent given
     * their current ranks
     * @param {number} playerRank - The current rank of the player
     * @param {number} opponentRank - The current rank of the opponent
     * @returns {number} The probability, a number in the range [0, 1]
     */
    static winProbability(playerRank, opponentRank) {
        return 1.0 / (10.0 ** ((opponentRank - playerRank) / 400.0) + 1.0)
    }

    /**
     * Calculates the new ranks for the winner and looser of a game given their
     * current ranks
     * @param {number} currentWinnerRank - The current rank of the winner
     * @param {number} currentLooserRank - The current rank of the looser
     * @returns {Array} An array with the new rank of the winner on index 0 and the new rank of the looser on index 1
     */
    static newRanks(currentWinnerRank, currentLooserRank) {
        let winnerRank = currentWinnerRank + kFactor * (1.0 - this.winProbability(currentWinnerRank, currentLooserRank))
        let looserRank = currentLooserRank + kFactor * (0.0 - this.winProbability(currentLooserRank, currentWinnerRank))
        return [winnerRank, looserRank]
    }
}
