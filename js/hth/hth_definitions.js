/******************************************
*     Definitions
******************************************/
// This file contains global variables, elements, etc

// SFX Tags
const sfx = document.getElementById("sfx")

const chaserAnswer  = document.getElementById( "chaserAnswer" )
const chaserBuzz    = document.getElementById( "chaserBuzz" )
const correctAnswer = document.getElementById( "correctAnswer" )
const playerAnswer  = document.getElementById( "playerAnswer" )
const playerBuzz    = document.getElementById( "playerBuzz" )
const questionShown = document.getElementById( "questionShown" )
const timeUp        = document.getElementById( "timeUp" )

// BGM Tags
const bgm = document.getElementById( "bgm" )

const buzzCountdown = document.getElementById( "buzzCountdown" )

const chaserVictoryFanfare = document.getElementById( "chaserVictory" )
const playerVictoryFanfare = document.getElementById( "playerVictory" )

const chaserReveal = document.getElementById( "chaserReveal" )
const chaseBegin = document.getElementById( "theChaseIsOn" )
const chaserEnter = document.getElementById( "chaserWalk" )
const theme = document.getElementById( "theme" )

// Elements
const question = document.getElementById("question")
const answerFields =
  document.getElementById("answer_field_container").children
const slotA = document.getElementById("slot_a")
const slotB = document.getElementById("slot_b")
const slotC = document.getElementById("slot_c")

const board = document.getElementById("board")


const playerName = document.getElementById("playerName")
const chaserName = document.getElementById("chaserName")

const chaserNameInput = document.getElementById("settings_chaser_name")
const playerNameInput = document.getElementById("settings_player_name")

// Buzz In Timer
var BUZZ_IN_TIMER = null
const BGM_VOLUME = 0.5

// Global Variables
var GAME_STATE  = {}
var ROUND_STATE  = {}
var QUESTION     = {}
var QUESTION_SET = []  // randomised on retrieval

const BUZZ_IN_DURATION = 5000
FADE_DURATION = 350

const MAX_CASH_PRIZE = 10000 // £100
const BOARD_STEPS = board.children.length

/**
 * keys Bindings.
 * The idea here is that you can change the key here without
 * having to go change a bunch of stuff in other files as
 * bindings defined here will automatically work on the site.
 * 
 * showPlayerSlotA: {
 *   keys: ["1"],
 *   description: "This is what it does. ",
 *   action: () => hth_showPlayerAnswer( "a" ),
 * },
 * 
 * key         >> which key to press to activate bind
 * description >> (optional) what it does
 * action      >> the function to be run
 * 
 */
KEY_BINDS = {
  /******************************************
  *     Player Slot Reveals
  ******************************************/
  showPlayerSlotA: {
    keys: ["1"],
    description: "Player selected slot a",
    action: () => hth_showPlayerAnswer( "a" )
  },
  showPlayerSlotB: {
    keys: ["2"],
    description: "Player selected slot b",
    action: () => hth_showPlayerAnswer( "b" )
  },
  showPlayerSlotC: {
    keys: ["3"],
    description: "Player selected slot c",
    action: () => hth_showPlayerAnswer( "c" )
  },

  /******************************************
  *     Chaser Slot Reveals
  ******************************************/
  showChaserSlotA: {
    keys: ["7"],
    description: "Chaser selected slot a",
    action: () => hth_showChaserAnswer( "a" )
  },
  showChaserSlotB: {
    keys: ["8"],
    description: "Chaser selected slot b",
    action: () => hth_showChaserAnswer( "b" )
  },
  showChaserSlotC: {
    keys: ["9"],
    description: "Chaser selected slot c",
    action: () => hth_showChaserAnswer( "c" )
  },

  /******************************************
  *     Question and Answer Visuals
  ******************************************/
  showNext: {
    keys: [" ", "Space", "ArrowUp", "Enter"],
    description: "Shows question then answers on subsequent press",
    action: () => {
      hth_showNext()
    }
  },
  showCorrectAnswer: {
    keys: ["5", "c"],
    description: "Reveal the correct answer. ",
    action: () => hth_showCorrectAnswer()
  },
  uncheckAnswerFields: {
    keys: ["ArrowDown", "r"],
    description: "Undo all answer reveals",
    action: () => {
      if ( GAME_STATE.hth_gameOver ) { return }
      hth_uncheckAnswerFields()
    }
  },

  /******************************************
  *     Buzz ins
  ******************************************/
  playerBuzzIn: {
    keys: ["4"],
    description: "Player answer buzzes in",
    action: () => hth_buzzInPlayer()
  },
  chaserBuzzIn: {
    keys: ["6"],
    description: "Chaser answer buzzes in",
    action: () => hth_buzzInChaser()
  },

  /******************************************
  *     Game
  ******************************************/
  resetGame: {
    keys: [ "Escape" ],
    description: "Resets the entire game including the board, player names, questions...",
    action: () => hth_initApp()
  },

  /******************************************
  *     Sounds
  ******************************************/
  playChaserRevealFanfare: {
    keys: [ "q" ],
    description: "Plays the Chaser reveal SFX",
    action: () => sfx_playSFX( chaserEnter )
  },
  playChaseBeginFanfare: {
    keys: [ "w" ],
    description: "Plays the Chase beginning fanfare ",
    action: () => sfx_playSFX( chaseBegin )
  },
  toggleMusic: {
    keys: [ "e" ],
    description: "Toggle the background music. Stops and starts. Does NOT pause or mute. ",
    action: () => {
      if ( !sfx_playBGM( theme, bgm ) )
      {
        sfx_stopBGM( theme )
      }
    }
  },
  muteSounds: {
    keys: [ "m" ],
    description: "Mutes all game sounds, music, etc. ",
    action: () => sfx_toggleSounds()      
  },
}

