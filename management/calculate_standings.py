import operator
from calculations import get_players

players = get_players()

# Sort the players by rank
sorted_players = sorted(players.items(), key=lambda x: x[1]["rank"], reverse=True)

# Get the length of the longest name
longest_name_length = max(map(lambda p: len(p), players.keys()))

# Print the players by rank, and count the total amount of games played
next_standing = 1
total = 0
for player in sorted_players:
    standing = str(next_standing)
    name = player[0]
    rank = str(round(player[1]["rank"], 1))
    wins = str(player[1]["wins"])
    losses = str(player[1]["losses"])

    print(f"{standing.rjust(3)}. {name.rjust(longest_name_length)} ({rank.rjust(6)}) ({wins.rjust(3)} wins, {losses.rjust(3)} losses)")

    next_standing += 1
    total += player[1]["wins"]
print(f"{total} games have been played")
