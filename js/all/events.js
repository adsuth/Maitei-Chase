/******************************************
*     Events (keybinds)
******************************************/

document.addEventListener("keydown", function (ev) {
  if ( MODAL_SHOWN ) { return }
  
  // Check for keybinding 
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