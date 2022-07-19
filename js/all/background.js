/******************************************
*     Background Set Up
******************************************/
const bg_container = document.getElementById( "bg_container" )

const NUMBER_OF_ROWS = 8
const NUMBER_OF_COLS = 10

// Make false to disable background for potential performance issues
const BACKGROUND_ENABLED = true

/**
 * Adds elements to background container
 */
function bg_setup()
{
  for ( let i = 0; i < NUMBER_OF_ROWS; i++ )
  {
    let row = document.createElement( "div" )
    row.className = "bg_row"
    
    for ( let j = 0; j < NUMBER_OF_COLS; j++ )
    {
      let col = document.createElement( "div" )
      col.className = "bg_col"
      row.append( col )
    }

    bg_container.appendChild( row )
  }
}

function bg_init()
{
  let bg_rows = document.getElementsByClassName( "bg_row" )
  for ( let row of bg_rows )
  {
    for ( let col of row.children )
    {
      let duration = Math.floor( Math.random() * 10000 ) + 2000

      let rotation = Math.floor( Math.random() * 15 )
      let blur = Math.random()

      if ( Math.random() > 0.5 ) { rotation -= rotation*2 }

      col.style.animationDuration = `${duration}ms`
      col.style.filter = `hue-rotate( ${rotation}deg )`

      col.classList.add( "anim_bg_pulse" )
    }
  }
}


if ( BACKGROUND_ENABLED )
{
  bg_setup()
  bg_init()
}