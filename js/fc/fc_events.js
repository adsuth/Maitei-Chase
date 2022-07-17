/******************************************
*     Events (keybinds)
******************************************/

document.addEventListener("keydown", function (ev) {
  if ( MODAL_OPEN ) { return }
  
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

/******************************************
*     Page Navigation Buttons
******************************************/
prevPage.addEventListener( "click", () => {
  window.location.href = "hth.html"
} )
nextPage.addEventListener( "click", () => {
  window.location.href = "cb.html"
} )