/******************************************
*     Cashbuilder Main
******************************************/

function cb_getDefaultState()
{
  return {
    totalCash: 0,
  }
}

function cb_timeUp()
{
  // sfx_stopAllBGM( cb_bgm )
  sfx_playSFX( klaxon )
  sfx_stopBGM( theme )
  STATE.gameOver = true
}

function cb_addCash()
{
  if ( CASH_ROLLING_INTERVAL ) { return }

  let loops = 0
  let cashVisual = STATE.totalCash
  
  CASH_ROLLING_INTERVAL = setInterval( () => {
    
    loops++
    cashVisual += CASH_INCREMENT / CASH_ROLLING_MAX_LOOPS
    cb_updateCash( ( cashVisual / 100).toFixed(2) )

    if ( loops == CASH_ROLLING_MAX_LOOPS ) {
      clearInterval( CASH_ROLLING_INTERVAL )
      CASH_ROLLING_INTERVAL = null
    }
    
  }, CASH_ROLLING_INTERVAL_TIME )

  STATE.totalCash += 250
  timeLog = TIMER.getTime()
  cb_setPrizeAmount()

}

function cb_updateCash( amount = 0.00 )
{
  cash.innerHTML = `£${ amount }`
}

function cb_removeCash()
{
  if ( STATE.totalCash <= 0 ) { return console.warn( "Cash cannot go below £0!" )} 
  STATE.totalCash -= 250
  cb_updateCash( ( STATE.totalCash / 100 ).toFixed(2) )

  cb_setPrizeAmount()
}

function cb_setPrizeAmount()
{
  let prizeAmount = parseInt(STATE.totalCash) / 100
  sessionStorage.setItem("CASH_BUILDER_AMOUNT", prizeAmount.toFixed(2) )
}

function cb_init()
{
  STATE = cb_getDefaultState()

  timeLog = TIMER.getMaxTime()
  TIMER.reset()
  TIMER.updateDisplay()
  
  cb_updateCash( amount = 0 )
  TIMER.timerEndCallback = cb_timeUp
  cb_setPrizeAmount()

  timer.classList.remove( "anim_timer_pulse" )

  sa_updateSuggestedAction( KEY_BINDS.ToggleTimer )
}

sfx_setVolume( bgm, BGM_VOLUME )
sfx_setVolume( sfx, SFX_VOLUME )

timeLog = TIMER.getMaxTime()

cb_init()