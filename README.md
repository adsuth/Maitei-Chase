# Github Pages
**The site doesn't have an `index.html`, so you'll be taken to this README if you try visit it.**

Go to one of the following:
- [Cashbuilder](https://adamandom.github.io/Maitei-Chase/cb.html)
- [Head to Head](https://adamandom.github.io/Maitei-Chase/hth.html)
- [Final Chase](https://adamandom.github.io/Maitei-Chase/fc.html)

# Set Up
Here are the steps required to set the app up:
- Set the names of the Player and Chaser in `./js/all/definitions.js`
- Set the directory of the Questions CSV in `./js/all/definitions.js`
- If you'd like to remove "Suggested Actions" and "Help Modal", comment/ delete the relevant tags within `./index.html`
- If you'd like to remove SFX and BGM, comment/ delete the relevant tags in each page's `.html` file

# Key Bindings
This site makes extensive use of keybinds. They have been implemented in a way such that changing them is relatively pain-free.

To change keybindings **for a specific page**, visit its `definitions.js` file (exact paths are shown in each section)

*Note: Bindings marked under "All" still have to be changed for each respective file.*

## Example of a keybind:
```
showPlayerSlotA: {
  keys: ["1"],
  description: "This is what it does"
  action: () => showPlayerAnswer( "a" )
}
```

| Property | What is does |
| ---------- | ------ |
| `keys`| The key(s) that activate the binding. See [this site](https://www.toptal.com/developers/keycode) to find the names of keys like Enter, Space, etc. |
| `description`| A short description of what the binding does. This is shown in the "Suggest Action" and keybinds list. |
| `action`| The method that is called. This is given as an anonymous function. As a result, you *could* chain multiple different methods as one bind. |

## All

### Game State
| Key Bind | Action | Notes |
| --- | --- | --- |
| Escape | Reset Game | Resets everything, as though page was refreshed |
| Enter | Skips Current Round | **Only in Final Chase.** Skipping during the Chaser's round will instantly go to Game Over (with Players winning) |

### Timer
| Key Bind | Action | Notes |
| --- | --- | --- |
| Space | Toggle Timer |  |
| + | Add Time | Adds **10 seconds** to the timer |
| - | Remove Time | Removes **10 seconds** from the timer |
| r | Reset Timer |  |

### Sounds
| Key Bind | Action | Notes |
| --- | --- | --- |
| q | Chaser Reveal Fanfare |  |
| w | Chase Begins Fanfare |  |
| e | Toggles BGM theme | Exclusive to Head to Head |

---

## Cashbuilder
For a list of all bindings, see `./js/cb/cb_definitions.js`. 

| Key Bind | Action | Notes |
| --- | --- | --- |
| ArrowRight | Add Cash | Adds **£2.50** to total cash (change in `cb_definitions.js`)|
| ArrowLeft | Remove Cash | Removes **£2.50** from total cash (change in `cb_definitions.js`) |
| Escape | Reset Game | Resets the state of the game entirely. |

---

## Head to Head
For a list of all bindings, see `./js/hth/hth_definitions.js`.

| Key Bind | Action | Notes |
| --- | --- | --- |
| Enter, Space, ArrowUp | Show Next | Reveals the question, answers, hides all at the end (context specific) |
| 4, 6 | Player/Chaser Buzz In | Buzzes respective player in, starts timer (or ends if both have buzzed) |
| 1, 2, 3 | Player Choice | Highlights A, B, or C as Player's choice of answer slot respectively |
| 5, c | Correct Choice | Highlights whichever slot holds the correct answer |
| 7, 8, 9 | Chaser Choice | Highlights A, B, or C as Chaser's choice of answer slot respectively |

---

## Final Chase
For a list of all bindings, see `./js/fc/fc_definitions.js`.

### Player Round
In the Player Round, in addition to the common keybinds, you have the following binds available: 
| Key Bind | Action | Notes |
| --- | --- | --- |
| ArrowRight | Add Player Step | Only works **when timer is running** |
| ArrowLeft | Remove Player Step |  |
---
### Chaser Round
| Key Bind | Action | Notes |
| --- | --- | --- |
| ArrowRight | Add Chaser Step | Only works **when timer is running** |
| ArrowLeft | Remove Chaser Step | Only works **when timer is stopped**. Adds a Player step if Chaser is off the board. |


# Cash Builder
## Game Flow
This round has the Player rack up a prize pool that they will play for in future rounds. Each correct answer is worth a fixed amount of money (see `./js/cb/cb_definitions.js` if you'd like to change it).

1. Clock is started
2. As a player answer questions correctly, add money to the prize pool
3. When the clock ends, game ends with the current amount being saved to session storage.

Adding or removing money after the game has ended **will be saved**.

# Head to Head
## Game Flow
This round has the player compete head to head against the Chaser to take the prize money earned in the *Cash Builder* through to the *Final Chase*.

1. Reveal the question
2. Reveal the answers
3. Allow players to buzz in
   - Start a 5 second timer
   - If the Player or Chaser doesn't buzz within timer, they forfeit their choice of answer for the round
4. Reveal the Player's answer
5. Reveal the Correct answer
   - Player moves a step forward if they are correct
6. Reveal the Chaser's answer
   - Chaser moves a step forward if they are correct
7. Repeat until either:
   - The Player has reached the end of the board (Player Wins)
   - The Chaser has reached the same step as the Player (Chaser Wins) 

## CSV Format
**Make sure you set the path of the CSV file in `./js/definitions.js`**.

The app will only be able to parse CSV files. TSV will not work. 
Below is an example of CSV of the appropriate formatting:

`Question,answerA,answerB,answerC,correctAnswer`

## The Board
The board has **click events** that you can use to change the position of the player and the chaser.

*You cannot put the Player over or before the Chaser.*

*You cannot put the Chaser over or after the Player.*

| Click Type | What is does |
| ---------- | ------ |
| `LeftMouse`| Move player to selected step |
| `ALT` + `LeftMouse`| Moves Chaser to selected step |

*ALT-Clicking the Chaser's current position will place them off the board (their step will be -1)*

## Additional Events
In addition to keybinds, the Head to Head page has extra events and menus compared to other pages.
### Settings
Clicking the "..." icon will open a modal that will allow to adjust settings; mainly changing the names of the Player and Chaser for their buzz-ins.

### Cash Amount
The cash amount is **carried over from the last timed out Cashbuilder**, but it can also be changed by clicking on the amount and entering in a new amount.

**Notes:**
- There is a MAX prize value of £100 (see `./js/hth/hth_definitions.js` @ line 64)
- The input will sort out any non-number values on its own.

# Final Chase
This round is the final showdown. It involves two time-centric rounds; the Players' then the Chaser's. During the Player's round, every correct answer will give them an additional step. Then, during the next round, the Chaser will attempt to "catch" the Players by achieving the same score as them. 

## Game Flow
The Final Chase forces a strict game flow with three major states:
1. Player Round
   - Correct answers add step  
2. Chaser Round
   - Correct answers move the Chaser closer to Players
   - Incorrect answers offer a chance at a Pushback (sending Chaser back a step) should the players get the question correct
3. Game End
   - Players win if time runs out
   - Chaser wins if they catch the Players

Certain bindings will be blocked in different states.

Players will answer questions for 2 minutes (variable in `./js/fc/fc_definitions.js`).

The Chaser Round is much the same, although this round will lead to the endgame state.

**If the Chaser achieves a score equal to that of the Players, the Chaser will win.**

**If the Chaser runs out of time, the players will win.**

# Extras
## Suggested Action
Exclusive to the *Cash Builder* and *Head to Head*.

Shows a list of all context specific Suggested Actions. For example, it will recommend pressing the key to start the timer a timer round is unstarted.

## Hint
Exclusive to the *Final Chase*.

Shows a hint to the current state of the game and what to do to proceed.
