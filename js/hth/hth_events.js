/******************************************
*     Events
******************************************/
$( document ).ready( () => {
  document.getElementsByTagName( "body" )[0]
    .style.display = ""
})

document.addEventListener("keydown", function (ev) {
  if ( MODAL_SHOWN ) { return }
  if ( document.getElementsByClassName( "step_cash_input" )[0] == document.activeElement )
  {
    return
  }
  
  // Check for keybinding (see ./definitions.js )
  for ( let binding in KEY_BINDS )
  {
    let bind = KEY_BINDS[ binding ]

    // if it exists, perform its function
    if ( bind.keys.includes( ev.key ) )
    {
      bind.action()
    }
  }
})

for ( let step of board.children )
{
  step.addEventListener( "click", ev => {
    if ( ev.target.tagName === "INPUT" ) { return }
    if ( GAME_STATE.hth_gameOver ) { return }

    if ( ev.button == 0 && ev.altKey )
    {
      hth_setChaserBoardPosition( ev )
    }
    else if ( ev.button == 0 && !ev.altKey )
    {
      hth_setPlayerBoardPosition( ev )
    }
  })
}

/******************************************
*     Fading Modal
******************************************/
function fadeInSettingsModal()
{
  if ( MODAL_SHOWN ) { return }
  MODAL_SHOWN = true
  $("#settings_modal_container").css( { display: "flex" } )
  $("#settings_modal_container").fadeIn( FADE_DURATION )
}
function fadeOutSettingsModal()
{
  MODAL_SHOWN = false
  $("#settings_modal_container").fadeOut( FADE_DURATION )
}

/******************************************
*     Events for Modal
******************************************/
// opening the settings modal
document.getElementById( "settings_modal_button" )
  .addEventListener( "click", fadeInSettingsModal )

// closing the settings modal
document.getElementById( "settings_modal_close" )
  .addEventListener( "click", () =>{
    hth_setSettings()
    fadeOutSettingsModal()
  } )


/******************************************
*     Page Navigation Buttons
******************************************/
prevPage.addEventListener( "click", () => {
  window.location.href = "cb.html"
} )
nextPage.addEventListener( "click", () => {
  window.location.href = "fc.html"
} )