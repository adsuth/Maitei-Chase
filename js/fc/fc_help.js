/******************************************
*  Help (for the help modal)
******************************************/

function help_showHelpButton()
{
  document.getElementById( "help_button" )
    .style.display = "flex"
}

/******************************************
*     Events for Modal
******************************************/
// opening the help modal
document.getElementById( "help_modal_button" )
  .addEventListener( "click", help_fadeInHelpModal )

// closing the help modal
document.getElementById( "help_modal_close" )
  .addEventListener( "click", help_fadeOutHelpModal )

  

function help_populateKeybindList()
{
  let list = document.getElementById( "key_bindings_list" )
  for ( let binding in KEY_BINDS )
  {
    list.innerHTML += 
      help_createKeybindListItem( binding, KEY_BINDS[ binding ] )
  }
}

function help_createKeybindListItem( name, bind )
{
  return (
  `<li class="key_bindings_list_item">
      <p>Name: ${ name }</p>
      <p>Keys: ${ bind?.keys || "" }</p>
      <p>Description: ${ bind?.description || "No description given. " }</p>
  </li>`
  )
}

/******************************************
*     Fading Modal
******************************************/
function help_fadeInHelpModal()
{
  MODAL_SHOWN = true
  $("#help_modal_container").css( { display: "flex" } )
  $("#help_modal_container").fadeIn( FADE_DURATION )
}
function help_fadeOutHelpModal()
{
  MODAL_SHOWN = false
  $("#help_modal_container").fadeOut( FADE_DURATION )
}

/******************************************
*     Populate List
******************************************/
help_populateKeybindList()

/******************************************
*     Events for Modal
******************************************/
// opening the help modal
document.getElementById( "help_modal_button" )
  .addEventListener( "click", () => {
    MODAL_OPEN = true
    sfx_pauseBGM( finalOST )

    TIMER.stop()
    timer.classList.remove( "anim_timer_pulse" )

    help_fadeInHelpModal()
  } )

// closing the help modal
document.getElementById( "help_modal_close" )
  .addEventListener( "click", () => {
    MODAL_OPEN = false
    help_fadeOutHelpModal()
  } )