default_rank = 1000
k_factor = 16

def win_probability(player, opponent):
    return 1.0 / (10.0 ** ((opponent - player) / 400.0) + 1.0)

def calc_new_ranks(winner, looser):
    winner_rank = winner + k_factor * (1.0 - win_probability(winner, looser))
    looser_rank = looser + k_factor * (0.0 - win_probability(looser, winner))
    return winner_rank, looser_rank

def get_players():
    with open("games.csv", "r") as f:
        games = list(map(lambda x: x.strip().split(","), f.readlines()))[1:]

    # Calculate the current rank for each of the players
    players = {}
    for game in games:
        winner = players[game[1]] if game[1] in players else default_rank
        looser = players[game[2]] if game[2] in players else default_rank
        players[game[1]], players[game[2]] = calc_new_ranks(winner, looser)

    return players
