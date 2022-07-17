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
  sfx_stopAllBGM( cb_bgm )
  sfx_playSFX( klaxon )
  CB_STATE.hth_gameOver = true
}

function cb_addCash()
{
  if ( CASH_ROLLING_INTERVAL ) { return }

  let loops = 0
  let cashVisual = CB_STATE.totalCash
  
  CASH_ROLLING_INTERVAL = setInterval( () => {
    
    loops++
    cashVisual += CASH_INCREMENT / CASH_ROLLING_MAX_LOOPS
    cb_updateCash( ( cashVisual / 100).toFixed(2) )

    if ( loops == CASH_ROLLING_MAX_LOOPS ) {
      clearInterval( CASH_ROLLING_INTERVAL )
      CASH_ROLLING_INTERVAL = null
    }
    
  }, CASH_ROLLING_INTERVAL_TIME )

  CB_STATE.totalCash += 250
  cb_setPrizeAmount()

}

function cb_updateCash( amount = 0.00 )
{
  cash.innerHTML = `£${ amount }`
}

function cb_removeCash()
{
  if ( CB_STATE.totalCash <= 0 ) { return console.warn( "Cash cannot go below £0!" )} 
  CB_STATE.totalCash -= 250
  cb_updateCash( ( CB_STATE.totalCash / 100 ).toFixed(2) )

  cb_setPrizeAmount()
}

function cb_setPrizeAmount()
{
  let prizeAmount = parseInt(CB_STATE.totalCash) / 100
  sessionStorage.setItem("CASH_BUILDER_AMOUNT", prizeAmount.toFixed(2) )
}

function cb_init()
{
  CB_STATE = cb_getDefaultState()

  TIMER.reset()
  cb_updateCash( amount = 0 )
  TIMER.timerEndCallback = cb_timeUp

  sa_updateSuggestedAction( KEY_BINDS.ToggleTimer )
}

sfx_initBGM( cb_bgm )
cb_init()