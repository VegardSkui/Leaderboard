import operator
from calculations import get_players

players = get_players()

# Print the current standings
sorted_players = sorted(players.items(), key=operator.itemgetter(1), reverse=True)
longest_name_length = max(map(lambda p: len(p), players.keys()))
next_standing = 1
for player in sorted_players:
    standing = str(next_standing)
    name = player[0]
    rank = str(round(player[1], 1))
    print(f"{standing.rjust(3)}. {name.rjust(longest_name_length)} ({rank.rjust(6)})")
    next_standing += 1
