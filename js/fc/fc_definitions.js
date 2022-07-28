/******************************************
 *     Definitions
 ******************************************/
const steps = document.getElementById("fc_step_container")
const timer = document.getElementById("fc_timer")

const stateHint = document.getElementById("state_hint")

const klaxon      = document.getElementById("klaxon")
const klaxon_end  = document.getElementById("klaxon_final")
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
const BGM_TIMING_OFFSET = 0

var BGM_TIME_OFFSET_APPLIED = true

var MODAL_OPEN = false

var GET_STATE_HINT_PROCESS = null

var KLAXON_PLAYER_WIN_TIMEOUT = null

// var FC_THEME_STARTUP_TIMEOUT = null

/******************************************
*     Timer
******************************************/
TIMER = new Timer( "fc_timer", {
  interval: 10,
  mins: 2,
  secs: 0,
  timerEndCallback: null,
  delayed: true,
  delayCallback: () => {
    if ( TIMER.delayTimeout || TIMER.delayFinished ) { return }
    
    console.log(  "akgkaguew")
    TIMER.delayFinished = false
    sfx_playBGM( finalOST, bgm )
     
    TIMER.delayTimeout = setTimeout( () => {
      console.log(  "fin")
  
      clearTimeout( TIMER.delayTimeout )
      TIMER.delayTimeout = null
      TIMER.delayFinished = true
  
      TIMER.toggle()
    }, BGM_TIMING_OFFSET )
  }
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
    description: "Adds Player step quietly, regardless of whether the timer is running. ",
    action: () => {
      addStep()
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
      if ( STATE.gameOver ) { return }
      if ( TIMER.delayed && TIMER.delayFinished === false ) { return }

      console.log ( TIMER.running )
      
      TIMER.toggle()
      timer.classList.toggle( "anim_timer_pulse" )

      if ( TIMER.running ) { sfx_playBGM( finalOST, bgm ) } 
      else if ( TIMER.delayed && TIMER.delayFinished === false ) { sfx_playBGM( finalOST, bgm ) }
      else if ( !TIMER.running ) { sfx_pauseBGM( finalOST, bgm ) }
      
    }
  },

  // altering clock
  addTime: {
    keys: [ "+" ],
    description: "Grants an additional 10 seconds to the clock. ",
    action: () => {
      if ( STATE.gameOver ) { return }
      if ( TIMER.delayFinished == false ) { return }
      
      TIMER.addTime( TIMER_INCREMENT )
      finalOST.currentTime = TIMER.getElapsedTime()
    }
  },
  removeTime: {
    keys: [ "-" ],
    description: "Removes 10 seconds from the clock. ",
    action: () => {
      if ( STATE.gameOver ) { return }     
      if ( TIMER.delayFinished == false ) { return }

      TIMER.removeTime( TIMER_INCREMENT )
      finalOST.currentTime = TIMER.getElapsedTime()
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
  action: () => {
    TIMER.reset()
    resetGame()
  }
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