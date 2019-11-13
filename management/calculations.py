default_rank = 1000
k_factor = 16

def win_probability(player, opponent):
    return 1.0 / (10.0 ** ((opponent - player) / 400.0) + 1.0)

def calc_new_ranks(winner, looser):
    winner_rank = winner + k_factor * (1.0 - win_probability(winner, looser))
    looser_rank = looser + k_factor * (0.0 - win_probability(looser, winner))
    return winner_rank, looser_rank

def get_players():
    # Read all games from games.csv
    with open("games.csv", "r") as f:
        games = list(map(lambda x: x.strip().split(","), f.readlines()))[1:]

    players = {}

    def get_player(name):
        """Gets or creates a new player in the player dict by name"""
        if name not in players:
            players[name] = {
                "rank": default_rank,
                "wins": 0,
                "losses": 0
            }
        return players[name]

    # Calculate the final rank and win/loss count for each player after all games
    for game in games:
        winner = get_player(game[1])
        looser = get_player(game[2])

        winner["rank"], looser["rank"] = calc_new_ranks(winner["rank"], looser["rank"])

        winner["wins"] += 1
        looser["losses"] += 1

    return players
