/******************************************
*     Main
******************************************/
function hth_getQuestion() {
  if ( QUESTION_SET.length <= 0 )
  {
    alert( "No more questions!" )
    return console.warn( "Reached the end of the questions!" )
  }

  QUESTION = QUESTION_SET.shift()
  sessionStorage.setItem( "QUESTIONS", JSON.stringify( QUESTION_SET ) )
}

/**
 * Retrieves locally stored CSV of questions.
 * Change path in ./definitions.js 
 * 
 * Gameloop begins within this method.
 * If this fails, the program will not start.
 */
function hth_getCSV() {
  
  if ( sessionStorage.getItem( "QUESTIONS" ) )
  {
    QUESTION_SET = JSON.parse( sessionStorage.getItem( "QUESTIONS" ) )
  }
  if ( QUESTION_SET.length > 0 ) { return hth_nextQuestion( true ) }

  d3.csv( QUESTIONS_CSV_PATH, ( data ) => {
    return {
      question: data.question, 
      a: data.a,
      b: data.b,
      c: data.c,
      answer: data.answer,
    }
  }, ( error, rows ) => {
    if ( error ){ return console.error( error.message ) }

    for ( let entry of rows )
    {
      if ( Math.random() < .5 )
      {
        QUESTION_SET.push( entry )
      }
      else
      {
        QUESTION_SET.unshift( entry )
      }

    }

    
    sessionStorage.setItem( "QUESTIONS", JSON.stringify( QUESTION_SET ) )
    hth_nextQuestion( true )
  })
}

function hth_getCorrectAnswerSlot( answer )
{
  for ( let slot of answerFields )
  {
    if ( slot.innerText == QUESTION.answer )
    {
      return slot.id[ slot.id.length - 1 ]
    }
  }
}

function hth_getDefaultRoundState() 
{
  return {
    playerAnswered: false,
    chaserAnswered: false,
    correctAnswerShown: false,

    playerBuzzed: false,
    chaserBuzzed: false,
    buzzersOut: true,

    playerTimedOut: false,
    chaserTimedOut: false,

    roundOver: false,

    playerCorrect: false,
    chaserCorrect: false,

    playerMoved: false,
    chaserMoved: false,

    answersShown: false,
    questionShown: false
  }
}

function hth_getDefaultGameState() 
{
  return {
    prizeAmount: sessionStorage.getItem("CASH_BUILDER_AMOUNT" ) ?? 0,
    playerPosition: 2,
    chaserPosition: -1,
    hth_gameOver: false,
  }
}

function hth_resetRoundState()
{
  hth_clearClassesOnAnswerFields()

  clearTimeout( BUZZ_IN_TIMER )
  BUZZ_IN_TIMER = null
  
  hth_fadeOutAnswerFields()
  hth_fadeOutQuestion()
  hth_fadeOutBuzzIns()
  
  ROUND_STATE = hth_getDefaultRoundState()
}

function hth_nextQuestion( isFirstQuestion = false )
{
  if ( GAME_STATE.gameOver ) { return }
  
  if ( isFirstQuestion )
  {
    hth_hideAnswerFields()
    hth_hideQuestion()
    hth_hideBuzzIns()
    hth_clearAnswerTextFields()
  }

  // for suggested action; just ignore
  sa_updateSuggestedAction( KEY_BINDS.showNext )
  hth_resetRoundState()

  // prevent seeing new Q as old Q is fading out
  window.setTimeout( () => {
    hth_getQuestion()
    hth_setTextFields()
  }, FADE_DURATION )
}

function hth_setPrizeAmount( ev )
{
  let newValue = ev.value
  newValue = newValue.replace( /[^0-9.]/g, "" )
  
  if ( parseFloat(newValue) *100 > MAX_CASH_PRIZE ) { newValue = MAX_CASH_PRIZE /100 }
  if ( isNaN( parseFloat(newValue) )  ) { newValue = GAME_STATE.prizeAmount }

  newValue = parseFloat( newValue ).toFixed(2)

  GAME_STATE.prizeAmount = newValue
  ev.value = "£" + newValue
  ev.blur()
}

/******************************************
*     Settings Modal Stuff
******************************************/
function hth_applySettings()
{
  playerName.innerText = PLAYER
  chaserName.innerText = CHASER
  
  playerNameInput.value = PLAYER
  chaserNameInput.value = CHASER
}

function hth_setSettings()
{
  CHASER = chaserNameInput.value
  PLAYER = playerNameInput.value
  hth_applySettings()
}

/******************************************
*     Checks
******************************************/
function hth_checkIfPlayerWasCorrect()
{
  for ( let tag of answerFields )
  {
    if (
      tag.classList.value.includes( "player_choice" ) &&
      tag.classList.value.includes( "correct_choice" ) 
    ){
      return true
    }
  }
  return false
}
function hth_checkIfChaserWasCorrect()
{
  for ( let tag of answerFields )
  {
    if (
      tag.classList.value.includes( "chaser_choice" ) &&
      tag.classList.value.includes( "correct_choice" ) 
    ){
      return true
    }
  }
  return false
}

/******************************************
*     Buzz In
******************************************/
function hth_startBuzzInTimer()
{
  if ( ROUND_STATE.playerBuzzed ) { return }
  if ( ROUND_STATE.chaserBuzzed ) { return }

  BUZZ_IN_TIMER = setTimeout( () => {
    if ( !ROUND_STATE.chaserBuzzed || !ROUND_STATE.playerBuzzed )
    {
      sfx_playSFX( timeUp )
    }
    sfx_stopBGM( buzzCountdown )

    hth_fadeOutBuzzIns()
    
    if ( !ROUND_STATE.chaserBuzzed )
    {
      ROUND_STATE.chaserBuzzed = true
      ROUND_STATE.chaserTimedOut = true
      sa_updateSuggestedAction(
        KEY_BINDS.showPlayerSlotA,
        KEY_BINDS.showPlayerSlotB,
        KEY_BINDS.showPlayerSlotC
      )
    }
    if ( !ROUND_STATE.playerBuzzed )
    {
      ROUND_STATE.playerBuzzed = true
      ROUND_STATE.playerTimedOut = true
      sa_updateSuggestedAction( KEY_BINDS.showCorrectAnswer )
    }

    clearTimeout( BUZZ_IN_TIMER )
    BUZZ_IN_TIMER = null

  }, BUZZ_IN_DURATION )
}

/******************************************
*     Board
******************************************/
function hth_checkBoardPositions()
{
  if ( GAME_STATE.playerPosition >= BOARD_STEPS )
  {
    hth_gameOver( "player" )
  }
  else if ( GAME_STATE.playerPosition === GAME_STATE.chaserPosition )
  {
    hth_gameOver( "chaser" )
  }
  else
  {
    hth_updateBoard()
  }
}

function hth_setPlayerBoardPosition( ev )
{
  let step = parseInt( ev.target.getAttribute( "data-step" ) )
  if ( isNaN( step ) ) { return }

  if ( step <= GAME_STATE.chaserPosition ) { return }  

  GAME_STATE.playerPosition = step
  hth_checkBoardPositions()
}

function hth_setChaserBoardPosition( ev )
{
  let step = parseInt( ev.target.getAttribute( "data-step" ) )
 
  if ( isNaN( step ) ) { return }

  if ( step >= GAME_STATE.playerPosition ) { return }  
  if ( step == GAME_STATE.chaserPosition ) {
    GAME_STATE.chaserPosition = -1
    return hth_checkBoardPositions()

  }

  GAME_STATE.chaserPosition = step
  hth_checkBoardPositions()
}

function hth_gameOver( winner = "chaser" )
{
  if ( winner === "chaser" )
  {
    hth_chaserVictory()
  }
  else
  {
    hth_playerVictory()
  }
}

function hth_chaserVictory()
{
  sfx_stopAllBGM( bgm )
  sfx_playBGM( chaserVictoryFanfare, bgm )

  for ( let step of board.children )
  {
    step.classList.add( "anim_chaser_victory" )
    step.innerHTML = ""

    if ( step.getAttribute( "data-step" ) == GAME_STATE.chaserPosition )
    {
      step.innerHTML = `<div class="chaser_triangle"></div>`
    } 
  }

  GAME_STATE.gameOver = true
  sa_updateSuggestedAction(
    KEY_BINDS.resetGame
  )
}

function hth_playerVictory()
{
  sfx_stopAllBGM( bgm )
  sfx_playBGM( playerVictoryFanfare, bgm )

  for ( let step of board.children )
  {
    step.innerHTML = ""
    step.classList.add( "anim_player_victory" )
  }

  GAME_STATE.gameOver = true
  sa_updateSuggestedAction(
    KEY_BINDS.resetGame
  )
}


/**
 * MAIN
 * Entry point.
 * Gameloop begins here. Getting CSV is asynchronous, so
 * you have to call the first question within the hth_getCSV()
 * method.
 */
function hth_initApp()
{
  hth_applySettings()
  sfx_stopAllBGM( bgm )
  
  ROUND_STATE = hth_getDefaultRoundState()
  GAME_STATE = hth_getDefaultGameState()

  hth_updateBoard()

  hth_getCSV()
}


sfx_setVolume( bgm, BGM_VOLUME )
sfx_setVolume( sfx, SFX_VOLUME )

hth_initApp()