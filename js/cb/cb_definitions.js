const cash    = document.getElementById("cb_cash")
const time    = document.getElementById("cb_timer")

const cb_bgm = document.getElementById("bgm")
const theme   = document.getElementById("theme")
const klaxon = document.getElementById( "klaxon" )
const correct = document.getElementById("correct")

const CASH_INCREMENT = 250  // 250 == £2.50
const CASH_ROLLING_INTERVAL_TIME = 25
const CASH_ROLLING_MAX_LOOPS = 20

var CB_THEME_STARTUP_TIMEOUT = null

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

      if ( !TIMER.started ) {
        CB_THEME_STARTUP_TIMEOUT = setTimeout( TIMER.toggle, 1500 )
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
      theme.currentTime -= TIMER_INCREMENT
      TIMER.addTime( TIMER_INCREMENT )
    }
  },
  removeTime: {
    keys: [ "-" ],
    description: "Removes 10 seconds from the clock. ",
    action: () => {
      if ( STATE.gameOver ) { return }     
      theme.currentTime += TIMER_INCREMENT
      TIMER.removeTime( TIMER_INCREMENT )
    } 
  },
}
