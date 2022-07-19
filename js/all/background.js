/******************************************
*     Background Set Up
******************************************/
const bg_container = document.getElementById( "bg_container" )
const bg_rows = document.getElementsByClassName( "bg_row" )

function bg_init()
{
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

function bg_main()
{
  bg_init()
}

bg_main()