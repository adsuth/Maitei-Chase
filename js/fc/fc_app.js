/******************************************
*     Main
******************************************/

/******************************************
*     State
******************************************/
function getDefaultState()
{
  return {
    playerScore: 0,
    chaserScore: 0,
    isPlayerRound: true,
    isChaserRound: false,
    fc_gameOver: false,
  }
}

function resetGame()
{
  TIMER.reset()
  sfx_stopAllBGM( bgm )

  STATE = getDefaultState()
  
  TIMER.timerEndCallback = startChaserRound
  
  steps.innerHTML = ""
  steps.className = ""
  
  fc_initApp()
}

function startChaserRound()
{
  TIMER.reset()
  sfx_stopAllBGM( bgm )
  sfx_playSFX( klaxon )

  STATE.isPlayerRound = false
  STATE.isChaserRound = true

  setStateHint( `Chaser Round Unstarted. Press ${ formatKeyBindList( KEY_BINDS.toggleTimer.keys ) } to begin` )

  TIMER.timerEndCallback = fc_gameOver

  return fc_initApp()
}

/******************************************
*     Game Over State
******************************************/
function fc_gameOver( winner = "player" )
{
  if ( STATE.fc_gameOver ) { return }
  STATE.isPlayerRound = false
  STATE.isChaserRound = false

  STATE.fc_gameOver = true
  
  sfx_stopAllBGM( bgm )
  
  TIMER.stop()
  timer.classList.remove( "anim_timer_pulse" )

  if ( winner == "chaser" )
  {
    sfx_playBGM( chaserCatch, bgm )
    playAnimation(
      steps,
      "anim_chaser_caught_players"
    )
    setStateHint( `Chaser wins! Press ${ formatKeyBindList( KEY_BINDS.resetGame.keys ) } to reset the game.` )
  }
  else if ( winner == "player" )
  {
    sfx_playBGM( playerWin, bgm )
    playAnimation(
      steps,
      "anim_players_win"
    )
    setStateHint( `Players win! Press ${ formatKeyBindList( KEY_BINDS.resetGame.keys ) } to reset the game.` )
  }


}

/******************************************
*     Hints on Current State
******************************************/
function getStateHint()
{
  if ( !TIMER.started && STATE.isPlayerRound )
  {
    setStateHint( `Player Round Unstarted. Press ${ formatKeyBindList( KEY_BINDS.toggleTimer.keys ) } to begin`)
  }
  else if ( TIMER.started && TIMER.running && STATE.isPlayerRound )
  {
    setStateHint( `Player Round Ongoing. Press ${ formatKeyBindList( KEY_BINDS.toggleTimer.keys ) } to pause` )
  }
  else if ( TIMER.started && !TIMER.running && STATE.isPlayerRound )
  {
    setStateHint( `Player Round Paused. Press ${ formatKeyBindList( KEY_BINDS.toggleTimer.keys ) } to unpause` )
  }
  else if ( !TIMER.started && STATE.isChaserRound )
  {
    setStateHint( `Chaser Round Unstarted. Press ${ formatKeyBindList( KEY_BINDS.toggleTimer.keys ) } to begin` )
  }
  else if ( TIMER.started && !TIMER.running && STATE.isChaserRound )
  {
    setStateHint( `Chaser Round Paused. Press ${ formatKeyBindList( KEY_BINDS.toggleTimer.keys ) } to unpause` )
  }
  else if ( TIMER.started && TIMER.running && STATE.isChaserRound )
  {
    setStateHint( `Chaser Round Ongoing. Press ${ formatKeyBindList( KEY_BINDS.toggleTimer.keys ) } to pause` )
  }
  else if ( TIMER.fc_gameOver && !STATE.isPlayerRound && !STATE.isChaserRound )
  {
    setStateHint( `Game Ended. Press ${ formatKeyBindList( KEY_BINDS.resetGame.keys ) } to start new` )
  }
}

function setStateHint( hint )
{
  if ( !stateHint ) { return }
  stateHint.innerText = hint
}

function formatKeyBindList( keys )
{
  return keys.filter( key => { if ( key !== " " ) { return key } } ).join(", ")
}

/******************************************
*     Steps
******************************************/

// Player's Steps
function addStep() {
  addStepToSteps()

  playAnimation(
    steps.children[STATE.playerScore - 1],
    "anim_player_gain_step"
  )

  if ( STATE.playerScore > 1 ) { 
    playAnimation(
      steps.children[STATE.playerScore - 2],
      "anim_player_previous_step"
    )
  }
}

function addStepToSteps()
{
  STATE.playerScore++;
  steps.appendChild( createStepNode() )
}

function createStepNode()
{
  let step = document.createElement( "li" )
  step.appendChild(
    document.createTextNode( STATE.playerScore )
  )
  step.classList.add( "fc_step" )
  return step
}

function removeStep() {
  if ( STATE.playerScore <= 1 ) { return console.warn("Player's score will deplete below 1! ") }

  STATE.playerScore--
  
  playAnimation(
    steps.children[STATE.playerScore - 1],
    "anim_player_back_step"
  )
  
  steps.removeChild( steps.lastChild )

}

// Chaser's Steps
function chaser_addStep() {
  if ( !TIMER.running ) { return }

  if (STATE.chaserScore > STATE.playerScore) {
    return console.warn( "Chaser's score will exceed the player's score!" )
  } 

  STATE.chaserScore++

  playAnimation(
    steps.children[STATE.chaserScore - 1],
    "anim_chaser_gain_step"
  )
  if ( STATE.chaserScore > 1 ) {
    playAnimation(
      steps.children[STATE.chaserScore - 2],
      "anim_chaser_previous_step"
    )
  }

  // check for gameover
  if (STATE.chaserScore == STATE.playerScore) {
    fc_gameOver( "chaser" )
  }
}

function chaser_removeStep() {

  if (STATE.chaserScore >= STATE.playerScore) {
    return console.warn("Chaser's score will deplete past 0!")
  }  
  
  if ( STATE.chaserScore == 0 ) { return addStep() }
  STATE.chaserScore--

  playAnimation(
    steps.children[STATE.chaserScore],
    "anim_chaser_previous_step_pushback"
  )
  if ( STATE.chaserScore >= 1 )
  {
    playAnimation(
      steps.children[STATE.chaserScore - 1],
      "anim_chaser_gain_step"
    )
  }
      
}

function playAnimation( element, animClass )
{
  for ( let cssClass of element.classList )
  {
    if ( cssClass.includes( "anim_" ) )
    {
      element.classList.remove( cssClass )
    }
  }
  element.classList.add( animClass )
}

/******************************************
 *     Entry Point
 ******************************************/
function fc_initApp()
{
  timer.classList.remove( "anim_timer_pulse" )

  if ( steps.children.length < 1 ) { addStepToSteps() }

  if ( !GET_STATE_HINT_PROCESS )
  {
    GET_STATE_HINT_PROCESS = setInterval( () => {
      getStateHint()
    }, 2000 )
  }

}

TIMER.timerEndCallback = startChaserRound
STATE = getDefaultState()

sfx_setVolume( bgm, BGM_VOLUME )
sfx_setVolume( sfx, SFX_VOLUME )

fc_initApp()