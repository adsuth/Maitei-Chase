/******************************************
*     Methods for Updating Display
******************************************/

/******************************************
*     Showing Answers
******************************************/
/**
 * Adds player's choice baby-blue to the answer chosen by the player.
 * @param {String} slot "a", "b", or "c"; the slot of the answer
 */
function hth_showPlayerAnswer( slot ) {
  if ( !ROUND_STATE.buzzersOut)     { return }
  if ( !ROUND_STATE.playerBuzzed )  { return }
  if ( !ROUND_STATE.answersShown )  { return }

  if ( ROUND_STATE.playerAnswered ) { return }
  
  if ( ROUND_STATE.playerTimedOut ) { 

    ROUND_STATE.playerAnswered = true
    return sa_updateSuggestedAction(
      KEY_BINDS.showCorrectAnswer
    )
  }
  
  document.getElementById(`slot_${slot}`)
    .classList.add( "player_choice" )

  sfx_playSFX( playerAnswer )
  ROUND_STATE.playerAnswered = true

  sa_updateSuggestedAction(
    KEY_BINDS.showCorrectAnswer
  )

}

/**
 * Adds green background to the correct answer
 */
function hth_showCorrectAnswer() {
  if ( !ROUND_STATE.answersShown )       { return }
  if ( !ROUND_STATE.buzzersOut)          { return }
  if ( !ROUND_STATE.playerBuzzed )       { return }
  if ( !ROUND_STATE.chaserBuzzed )       { return }
  
  if ( ROUND_STATE.correctAnswerShown ) { return }
  if ( !ROUND_STATE.playerAnswered && !ROUND_STATE.playerTimedOut ) { return }

  let slot = hth_getCorrectAnswerSlot( QUESTION.answer )
  document.getElementById(`slot_${slot}`)
  .classList.add( "correct_choice" )
  
  ROUND_STATE.playerCorrect = hth_checkIfPlayerWasCorrect()

  

  sfx_playSFX( correctAnswer )
  if ( !ROUND_STATE.playerCorrect && !ROUND_STATE.chaserTimedOut )
  {
    sfx_stopBGM( theme )
    sfx_playBGM( chaserReveal, bgm )
  }
  else
  {
    sfx_stopAllBGM( bgm )
  }

  ROUND_STATE.correctAnswerShown = true

  if ( ROUND_STATE.playerCorrect )
  {

    if ( GAME_STATE.playerPosition + 1 === BOARD_STEPS )
    {
      hth_showNext()
    }

    sa_updateSuggestedAction(
      KEY_BINDS.showNext,
    )
  }
  else
  {

    // for suggested action; just ignore
    if ( !ROUND_STATE.chaserTimedOut )
    {
      sa_updateSuggestedAction(
        KEY_BINDS.showChaserSlotA,
        KEY_BINDS.showChaserSlotB,
        KEY_BINDS.showChaserSlotC,
      )
    }
    else
    {
      ROUND_STATE.roundOver = true
      if ( !GAME_STATE.gameOver )
      {
        sa_updateSuggestedAction( KEY_BINDS.showNext )
      }
    }

  }

}

/**
 * Adds chaser's red border class to the answer chosen by the chaser.
 * @param {String} slot "a", "b", or "c"; the slot of the answer
 */
function hth_showChaserAnswer( slot ) {
  if ( !ROUND_STATE.answersShown )       { return }
  if ( !ROUND_STATE.correctAnswerShown ) { return }
  if ( !ROUND_STATE.buzzersOut)          { return }
  if ( !ROUND_STATE.playerBuzzed )       { return }
  if ( !ROUND_STATE.chaserBuzzed )       { return }

  if ( ROUND_STATE.playerCorrect && !ROUND_STATE.playerMoved ) { return }

  if ( ROUND_STATE.chaserAnswered )       { return }

  if ( !ROUND_STATE.correctAnswerShown ) { return }

  if ( ROUND_STATE.chaserTimedOut ) {
    // for suggested action; just ignore
    ROUND_STATE.chaserAnswered = true
    sa_updateSuggestedAction( KEY_BINDS.showNext )
    return
  }

  document.getElementById(`slot_${slot}`)
  .classList.add( "chaser_choice" )

  sfx_playSFX( chaserAnswer )
  sfx_stopAllBGM( bgm )

  ROUND_STATE.chaserAnswered = true
  ROUND_STATE.roundOver = true

  ROUND_STATE.chaserCorrect = hth_checkIfChaserWasCorrect()

  if ( ROUND_STATE.chaserCorrect && GAME_STATE.chaserPosition + 1 === GAME_STATE.playerPosition )
  {
    hth_showNext()
  }

  sa_updateSuggestedAction(
    KEY_BINDS.showNext,
  )
  
}


/******************************************
*     Updating Text Fields
******************************************/
function hth_setTextFields()
{
  window.setTimeout( () => {
    question.innerText  = QUESTION.question
    slotA.innerText = QUESTION.a
    slotB.innerText = QUESTION.b
    slotC.innerText = QUESTION.c
  }, FADE_DURATION )

  QUESTION_LOADED = true
}

function hth_clearAnswerTextFields()
{
  slotA.innerText     = "\ "
  slotB.innerText     = "\ "
  slotC.innerText     = "\ "
}

function hth_clearClassesOnAnswerFields()
{
  for ( let slot of answerFields )
  {
    slot.className = "answer_field"
  }

  ROUND_STATE.chaserAnswered = false
  ROUND_STATE.playerAnswered = false
}

function hth_uncheckAnswerFields()
{
  hth_clearClassesOnAnswerFields()
}

function hth_fadeInAnswerFields()
{
  if ( ROUND_STATE.answersShown ) { return }
  ROUND_STATE.answersShown = true

  $( "#answer_field_container" ).animate( 
    {
      height: "3em",
      display: "flex",
      opacity: 1
    },
    FADE_DURATION,
    "linear"
  ) 

}

function hth_fadeOutAnswerFields()
{
  if ( !ROUND_STATE.answersShown ) { return }
  ROUND_STATE.answersShown = false
  
  $( "#answer_field_container" ).animate( 
    {
      height: "0em",
      display: "hidden",
      opacity: 0
    },
    FADE_DURATION - 100,
    "easeOutCubic"
  ) 
}

function hth_hideAnswerFields()
{
  if ( ROUND_STATE.answersShown ) { return }
  ROUND_STATE.answersShown = true

  $( "#answer_field_container" ).animate( 
    {
      height: "0em",
      display: "hidden",
      opacity: 0
    },
    0,
    "easeOutCubic"
  ) 
}


/******************************************
*     Question
******************************************/
function hth_fadeInQuestion()
{
  $("#question_container")
    .animate({
      opacity: 1
    },
    FADE_DURATION
  )
  sfx_playSFX( questionShown )
}

function hth_fadeOutQuestion()
{
  $("#question_container")
    .animate({
      opacity: 0
    },
    FADE_DURATION
  )
}

function hth_hideQuestion()
{
  $("#question_container")
    .animate({
      opacity: 0
    },
    0
  )
}   

/******************************************
*     Player and Chaser Buzz Ins
******************************************/

function hth_buzzInPlayer()
{
  if ( !ROUND_STATE.answersShown ) { return }
  if ( ROUND_STATE.playerBuzzed ) { return }

  if ( !ROUND_STATE.questionShown ) { return }
  
  if ( ROUND_STATE.playerAnswered ) { return }
  if ( ROUND_STATE.chaserAnswered ) { return }
  $("#playerName").animate( { 
    opacity: 1
  }, 0
  )

  hth_startBuzzInTimer()

  sfx_playSFX( playerBuzz )
  // for bgm; just ignore
  sfx_stopBGM( theme )
  sfx_playBGM( buzzCountdown, bgm )
  
  ROUND_STATE.playerBuzzed = true
  ROUND_STATE.buzzersOut = false
  
  if ( ROUND_STATE.playerBuzzed && ROUND_STATE.chaserBuzzed )
  {
    sfx_stopAllBGM( bgm )
    sfx_playBGM( theme, bgm )
    hth_fadeOutBuzzIns()
  }

  // for suggested action; just ignore
  if ( ROUND_STATE.chaserBuzzed )
  {
    sa_updateSuggestedAction(
      KEY_BINDS.showPlayerSlotA,
      KEY_BINDS.showPlayerSlotB,
      KEY_BINDS.showPlayerSlotC,
    )
  }
  else
  {
    sa_updateSuggestedAction( KEY_BINDS.chaserBuzzIn )
  }
}
function hth_buzzInChaser()
{
  if ( !ROUND_STATE.answersShown ) { return }
  if ( ROUND_STATE.chaserBuzzed ) { return }
  if ( !ROUND_STATE.questionShown ) { return }
  if ( ROUND_STATE.playerAnswered ) { return }
  if ( ROUND_STATE.chaserAnswered ) { return }

  $("#chaserName").animate( {
    opacity: 1,
  }, 0
  )

  hth_startBuzzInTimer()
  sfx_playSFX( chaserBuzz )

  // for bgm; just ignore
  sfx_stopBGM( theme )
  sfx_playBGM( buzzCountdown, bgm )
  
  ROUND_STATE.chaserBuzzed = true
  ROUND_STATE.buzzersOut = false
  
  if ( ROUND_STATE.playerBuzzed && ROUND_STATE.chaserBuzzed )
  {
    sfx_stopAllBGM( bgm )
    sfx_playBGM( theme, bgm )
    hth_fadeOutBuzzIns()
  }

  // for suggested action; just ignore
  if ( ROUND_STATE.playerBuzzed )
  {
    sa_updateSuggestedAction(
      KEY_BINDS.showPlayerSlotA,
      KEY_BINDS.showPlayerSlotB,
      KEY_BINDS.showPlayerSlotC,
    )
  }
  else
  {
    sa_updateSuggestedAction( KEY_BINDS.playerBuzzIn )
  }
}

function hth_fadeOutBuzzIns()
{
  $("#playerName").animate( {
    opacity: 0
  }, FADE_DURATION * 2
  )

  $("#chaserName").animate( {
    opacity: 0
  },
    FADE_DURATION * 2
  )
  ROUND_STATE.buzzersOut = true
}

function hth_hideBuzzIns()
{
  $("#playerName").animate( {
    opacity: 0
  }, 0
  )

  $("#chaserName").animate( {
    opacity: 0
  }, 0
  )
  ROUND_STATE.buzzersOut = true
}

/**
 * Proceed to next game ROUND_STATE.
 * Show Q -> Show As -> ... -> Next Question
 * Next Q only shown after CHASER's answer revealed
 */
function hth_showNext()
{
  if ( !ROUND_STATE.questionShown )
  {
    sfx_playBGM( theme, bgm )
    hth_fadeInQuestion()
    ROUND_STATE.questionShown = true
  }
  else if ( ROUND_STATE.questionShown && !ROUND_STATE.answersShown )
  {
    hth_fadeInAnswerFields()
    ROUND_STATE.answersShown = true

    // for suggested action; just ignore
    sa_updateSuggestedAction(
      KEY_BINDS.playerBuzzIn,
      KEY_BINDS.chaserBuzzIn
    )
  }
  else if ( ROUND_STATE.correctAnswerShown && ROUND_STATE.playerCorrect && !ROUND_STATE.playerMoved )
  {
    ROUND_STATE.playerMoved = true
    GAME_STATE.playerPosition++

    hth_checkBoardPositions()

    if ( GAME_STATE.playerPosition !== BOARD_STEPS )
    {
      sfx_playSFX( playerMove )
    }

    // for suggested action; just ignore
    if ( !ROUND_STATE.chaserTimedOut )
    {
      sa_updateSuggestedAction(
        KEY_BINDS.showChaserSlotA,
        KEY_BINDS.showChaserSlotB,
        KEY_BINDS.showChaserSlotC,
      )
    }
    else
    {
      ROUND_STATE.roundOver = true
      if ( !GAME_STATE.gameOver )
      {
        sa_updateSuggestedAction( KEY_BINDS.showNext )
      }
    }

  }
  else if ( ROUND_STATE.chaserAnswered && ROUND_STATE.chaserCorrect && !ROUND_STATE.chaserMoved )
  {
    ROUND_STATE.chaserMoved = true

    GAME_STATE.chaserPosition++
    hth_checkBoardPositions()

    sfx_playSFX( chaserMove )

    ROUND_STATE.roundOver = true
    // for suggested action; just ignore
    sa_updateSuggestedAction( KEY_BINDS.showNext )

  }

  else if ( ROUND_STATE.roundOver ){
    hth_nextQuestion()
  }
  else if ( !ROUND_STATE.playerAnswered && ROUND_STATE.playerBuzzed && ROUND_STATE.chaserBuzzed )
  {
    hth_fadeOutBuzzIns()

    // for suggested action; just ignore
    sa_updateSuggestedAction(
      KEY_BINDS.showPlayerSlotA,
      KEY_BINDS.showPlayerSlotB,
      KEY_BINDS.showPlayerSlotC,
    )
  }

}

/******************************************
*     Board
******************************************/
function hth_updateBoard()
{
  for ( let i = 0; i < board.children.length; i++ )
  {
    let step = board.children[ i ]

    step.classList.remove( "prev_chaser" )
    step.classList.remove( "board_chaser" )
    step.classList.remove( "board_player" )

    step.classList.remove( "anim_chaser_victory" )
    step.classList.remove( "anim_player_victory" )
    
    step.innerHTML = ""

    if ( i < GAME_STATE.chaserPosition )
    {
      step.classList.add( "prev_chaser" )
    }
    if ( i == GAME_STATE.playerPosition )
    {
      step.classList.add( "board_player" )
      step.innerHTML = `<input class="step_cash_input" value="£${GAME_STATE.prizeAmount}" onchange="hth_setPrizeAmount(this)"></input>`
    }
    if ( i == GAME_STATE.chaserPosition )
    {
      step.classList.add( "board_chaser" )
      step.innerHTML = `<div class="chaser_triangle"></div>`
    }
    
  }

}

/******************************************
*     Skipping Inputs ( if they timeout )
******************************************/
function hth_skipPlayerChoice()
{
  sa_updateSuggestedAction(
    KEY_BINDS.showCorrectAnswer
  )
}

function hth_skipChaserChoice()
{
  sa_updateSuggestedAction( 
    KEY_BINDS.showCorrectAnswer 
  )
}