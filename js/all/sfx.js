/******************************************
*     SFX, BGM and Fanfares
******************************************/

function sfx_playSFX( tag )
{
  if ( tag.tagName !== "AUDIO" && tag.children.length > 0 )
  {
    for ( let element of tag.children )
    {
      if ( element.paused ) { 
        element.play()
        return true
      }
    }
    return false
  }
  
  tag.play()
  return true
}

function sfx_playBGM( tag, bgmContainer )
{
  if ( !bgmContainer ) { 
    console.warn( "No root BGM container given!" ) 
    return false
  }
  for ( let el of bgmContainer.children )
  {
    if ( !el.paused && el.currentTime > 0 ) { return false }
  }

  tag.play()
  return true
}
function sfx_pauseBGM( tag )
{
  tag.pause()
}

function sfx_stopBGM( tag )
{
  tag.pause()
  tag.currentTime = 0
}

// to make them less deafening
function sfx_setVolume( container, newVolume )
{
  for ( let tag of container.children )
  {
    if ( tag?.children.length > 0 )
    {
      for ( let el of tag.children )
      {
        el.volume = newVolume
      }
    }
    else
    {
      tag.volume = newVolume
    }
  }
}


function sfx_stopAllBGM( bgmContainer )
{
  if ( !bgmContainer ) {
    console.warn( "Root BGM container given!" )
    return false
  }
  for ( let tag of bgmContainer.children )
  {
    sfx_stopBGM( tag )
  }
  return true
}

function sfx_toggleSounds()
{
  if ( IS_MUTED )
  {
    sfx_unmuteSounds()
  }
  else
  {
    sfx_muteSounds()
  }
}

function sfx_muteSounds()
{
  if ( IS_MUTED ) { return }
  IS_MUTED = true

  
  for ( let element of sfx.children )
  {
    if ( element?.children.length > 0 )
    {
      console.log( "???" )
      for ( let tag of element.children )
      {
        tag.volume = 0
      } 
    }
    else
    {
      element.volume = 0
    }
  }
  for ( let element of bgm.children )
  {
    if ( element?.children.length > 0 )
    {
      for ( let tag of element.children )
      {
        tag.volume = 0
      } 
    }
    else
    {
      element.volume = 0
    }
  }
}

function sfx_unmuteSounds()
{
  if ( !IS_MUTED ) { return }
  IS_MUTED = false

  for ( let element of sfx.children )
  {
    if ( element?.children.length > 0 )
    {
      for ( let tag of element.children )
      {
        tag.volume = SFX_VOLUME
      } 
    }
    else
    {
      element.volume = BGM_VOLUME
    }
  }
  for ( let element of bgm.children )
  {
    if ( element?.children.length > 0 )
    {
      for ( let tag of element.children )
      {
        tag.volume = BGM_VOLUME
      } 
    }
    else
    {
      element.volume = BGM_VOLUME
    }
  }
  
}

function initSounds()
{
  sfx_volume.value = localStorage.getItem( "SFX_VOLUME" ) ?? SFX_VOLUME
  bgm_volume.value = localStorage.getItem( "BGM_VOLUME" ) ?? BGM_VOLUME
}

sfx_volume.addEventListener( "change", ev => {
  SFX_VOLUME = ev.target.value
  localStorage.setItem( "SFX_VOLUME", SFX_VOLUME )
  sfx_setVolume( sfx, SFX_VOLUME )
} )

bgm_volume.addEventListener( "change", ev => {
  BGM_VOLUME = ev.target.value 
  localStorage.setItem( "BGM_VOLUME", BGM_VOLUME )
  sfx_setVolume( bgm, BGM_VOLUME )
} )

sfx_volume.addEventListener( "focus", ev => { ev.target.blur() } )
bgm_volume.addEventListener( "focus", ev => { ev.target.blur() } )

initSounds()