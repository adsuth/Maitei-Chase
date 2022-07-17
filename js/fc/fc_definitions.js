/******************************************
 *     Definitions
 ******************************************/
const steps = document.getElementById("fc_step_container")
const timer = document.getElementById("fc_timer")

const stateHint = document.getElementById("state_hint")

const klaxon      = document.getElementById("klaxon")
const finalOST    = document.getElementById("finalOST")
const playerWin   = document.getElementById("playerWin")
const chaserCatch = document.getElementById("chaserCatch")
const chaserEnter = document.getElementById("chaserEnter")
const chaseBegin  = document.getElementById("chaseBegin")

const chaserStep  = document.getElementById("chaserStep")
const playerStep  = document.getElementById("playerStep")
const stopClock   = document.getElementById("stopClock")
const pushback    = document.getElementById("pushback")

const bgm = document.getElementById("bgm")

FADE_DURATION = 500
var MODAL_OPEN = false

var GET_STATE_HINT_PROCESS = null

/******************************************
*     Timer
******************************************/
TIMER = new Timer( "fc_timer", {
  interval: 10,
  mins: 2,
  secs: 0,
  timerEndCallback: null
} )

/******************************************
*     Global Overrides
******************************************/
var STATE = {}

/******************************************
 *     Keybinds
 ******************************************/
KEY_BINDS = {
  /******************************************
  *     Step Actions
  ******************************************/
  // player steps
  addPlayerStep: {
    keys: ["ArrowRight"],
    description: "Adds a new step when a player answers correctly",
    action: () => { 
      if ( !STATE.isPlayerRound ) { return }
      if ( TIMER.running ) {
        sfx_playSFX( playerStep )
        return addStep() 
      } 
    }
  },
  removePlayerStep: {
    keys: [ "ArrowLeft" ],
    description: "Removes a step from the player",
    action: () => {
      if ( STATE.isChaserRound ) { return }
      removeStep()
    }
  },
  silentlyAddStep: {
    keys: [ "ArrowUp" ],
    description: "Adds Player or Chaser Step quietly depending on round. ",
    action: () => {
      if ( STATE.isPlayerRound ){
        addStep()
      }
      else {
        chaser_addStep()
      }
    }
    },

  // chaser steps
  addChaserStep: {
    keys: [ "ArrowRight" ],
    description: "Adds a step for the Chaser",
    action: () => {
      if ( !STATE.isChaserRound ) { return }
      if ( !TIMER.running) { return }
      sfx_playSFX( chaserStep )
      chaser_addStep()
    }
  },
  removeChaserStep: {
    keys: [ "ArrowLeft" ],
    description: "Removes a step for the Chaser",
    action: () => {
      if ( !STATE.isChaserRound ) { return }
      if ( TIMER.running ) { return }

      sfx_playSFX( pushback )
      chaser_removeStep()
    }
  },

  /******************************************
  *     Timer Actions
  ******************************************/
  toggleTimer: {
    keys: [ " ", "Space" ],
    description: "Toggles the timer; turns on or off",
    action: () => { 
      if ( STATE.hth_gameOver ) { return }
      // returns true if playing, false if stopped
      timer.classList.toggle( "anim_timer_pulse" )
      if ( TIMER.toggle() ) { return sfx_playBGM( finalOST, bgm ) }
      else { sfx_playSFX( stopClock ); return sfx_pauseBGM( finalOST ) }
    }
  },
  resetTimer: {
    keys: [ "r" ],
    description: "Reset the timer",
    action: () => {
      if ( STATE.hth_gameOver ) { return }
      timer.classList.remove( "anim_timer_pulse" )
      TIMER.reset()
      sfx_stopBGM( finalOST )
      return 
    }
  },

  // altering clock
  addTime: {
    keys: [ "+" ],
    description: "Grants an additional 10 seconds to the clock. ",
    action: () => {
      if ( STATE.hth_gameOver ) { return }
      TIMER.addTime( 10 )
    }
  },
  removeTime: {
    keys: [ "-" ],
    description: "Removes 10 seconds from the clock. ",
    action: () => {
    if ( STATE.hth_gameOver ) { return }     
        TIMER.removeTime( 10 )
      }
    },
  
  /******************************************
  *     SFX
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

  /******************************************
  *     Game State Options
  ******************************************/
  resetGame: {
  keys: [ "Escape" ],
  description: "Resets everything. ",
  action: () => resetGame()
  },
  skipRound: {
  keys: [ "Enter" ],
  description: "Skips current round. ",
  action: () => {
    sfx_stopAllBGM( bgm )
    TIMER.timerEndCallback()
    }
  },

}