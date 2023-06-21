# WEBSWEEPER

The game is hosted on Github Pages and you can play it here: https://u-steen.github.io/websweeper/

This is a Minesweeper game created to run in browser. When you get into the game, you can select the difficulty.

In minesweeper you have to click all the cells, avoiding the cells with bombs. When you click a cell one of 3 things can happen.

- A number is revealed -> there are this many bombs in the grid surrounding the cell.
- A area of empty cells is revealed -> this means there are no bombs there and it reveales all the cells having no bombs nearby.
- You lose -> this means you click a bomb.

The difficulty impacts how many tiles are generated, but also the procentage of bombs generated.

| Difficulty | Grid size | % of bombs |
| ---------- | --------- | ---------- |
| Easy       | 10 cells  | 10%        |
| Medium     | 15 cells  | 15%        |
| Hard       | 25 cells  | 20%        |

## FEATURES

- Puzzle generation
- 3 Difficulty levels
- NEW: Timer
