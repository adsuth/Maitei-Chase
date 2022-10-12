const cash    = document.getElementById("cb_cash")
const timer    = document.getElementById("cb_timer")

const cb_bgm = document.getElementById("bgm")
const theme   = document.getElementById("theme")
const klaxon = document.getElementById( "klaxon" )
const correct = document.getElementById("correct")

const CASH_INCREMENT = 250  // 250 == £2.50
const CASH_ROLLING_INTERVAL_TIME = 25
const CASH_ROLLING_MAX_LOOPS = 20

var CB_THEME_STARTUP_TIMEOUT = null
const BGM_TIMING_OFFSET = 1805
var BGM_OFFSET = false

var CASH_ROLLING_INTERVAL = null
var STATE = {}

FADE_DURATION = 500

TIMER = new Timer( "cb_timer", {
  interval: 10,
  mins: 1,
  secs: 0,
  timerEndCallback: null
})

KEY_BINDS = {
  /******************************************
  *     Cashbuilder
  ******************************************/
  AddCash: {
    keys: [ "ArrowRight" ],
    description: `Adds £${(CASH_INCREMENT/ 100).toFixed(2)} to cash total. `,
    action: () => {
      if ( !CASH_ROLLING_INTERVAL ) { sfx_playSFX( correct ) }
      cb_addCash()
    }
  },
  RemoveCash: {
    keys: [ "ArrowLeft" ],
    description: `Removes £${(CASH_INCREMENT/ 100).toFixed(2)} from cash total. `,
    action: () => cb_removeCash()
  },
  ResetGame: {
    keys: [ "Escape" ],
    description: `Resets the game; timer, cash, etc. `,
    action: () => {
      sfx_stopAllBGM( cb_bgm )
      
      if ( CB_THEME_STARTUP_TIMEOUT ) { 
        clearTimeout( CB_THEME_STARTUP_TIMEOUT ) 
        CB_THEME_STARTUP_TIMEOUT = null
      }

      cb_init()
    }
  },

  /******************************************
  *     Timer
  ******************************************/
  ToggleTimer: {
    keys: [ " ", "Space", "Enter" ],
    description: `Toggles timer. Pauses if playing, playing if paused. `,
    action: () => {
      if ( STATE.gameOver ) { return }
      
      sfx_playBGM( theme, cb_bgm )
      
      timer.classList.toggle( "anim_timer_pulse" )
      
      if ( !TIMER.started && !CB_THEME_STARTUP_TIMEOUT ) {
        CB_THEME_STARTUP_TIMEOUT = setTimeout( () => {
          TIMER.toggle()
          BGM_OFFSET = true
          clearTimeout( CB_THEME_STARTUP_TIMEOUT )
          CB_THEME_STARTUP_TIMEOUT = null

        }, BGM_TIMING_OFFSET )
        return
      }
      
      TIMER.toggle()

      if ( TIMER.running ) { sfx_playBGM( theme, cb_bgm ) } 
      else { sfx_pauseBGM( theme ) } 
      sa_updateSuggestedAction( 
        KEY_BINDS.AddCash,  
        KEY_BINDS.ToggleTimer, 
      )

    }
  },
  ResetTimer: {
    keys: [ "r" ],
    description: `Resets the timer. `,
    action: () => {
      if ( STATE.gameOver ) { return }

      if ( CB_THEME_STARTUP_TIMEOUT ) { 
        clearTimeout( CB_THEME_STARTUP_TIMEOUT ) 
        CB_THEME_STARTUP_TIMEOUT = null
      }

      TIMER.reset()
      sfx_stopAllBGM( cb_bgm ) 
    }
  },
  // altering clock
  addTime: {
    keys: [ "+" ],
    description: "Grants an additional 10 seconds to the clock. ",
    action: () => {
      if ( STATE.gameOver ) { return }
      if ( CB_THEME_STARTUP_TIMEOUT ) { return }

      TIMER.addTime( TIMER_INCREMENT )
      theme.currentTime = TIMER.getElapsedTime()
    
    }
  },
  removeTime: {
    keys: [ "-" ],
    description: "Removes 10 seconds from the clock. ",
    action: () => {
      if ( STATE.gameOver ) { return }     
      if ( CB_THEME_STARTUP_TIMEOUT ) { return }
      
      TIMER.removeTime( TIMER_INCREMENT )
      theme.currentTime = TIMER.getElapsedTime()
      
    } 
  },
  resetTimeLog: {
    keys: [ "t" ],
    description: "Reset timer back to the saved time log. ",
    action: () => {
      TIMER.setTime( timeLog )
      if ( TIMER.running )
      {
        timer.classList.remove( "anim_timer_pulse" )
        TIMER.stop()
      }

      theme.currentTime = TIMER.getElapsedTime()

      if ( STATE.cb_gameOver ) { return }
      if ( TIMER.delayed && TIMER.delayFinished === false ) { return }
      

      sfx_pauseBGM( theme, bgm ) 
    }
  }
}
