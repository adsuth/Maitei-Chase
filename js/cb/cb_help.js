/******************************************
*     Events for Modal
******************************************/
// opening the help modal
document.getElementById( "help_modal_button" )
  .addEventListener( "click", help_fadeInHelpModal )

// closing the help modal
document.getElementById( "help_modal_close" )
  .addEventListener( "click", help_fadeOutHelpModal )