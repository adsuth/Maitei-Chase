/******************************************
*  Suggested Action (if removed, will do nothing)
******************************************/
function sa_updateSuggestedAction( ...bindings )
{
  let suggested = document.getElementById( "suggested_action" )
  
  if ( suggested )
  {
    suggested.innerText = ""
    for ( let binding of bindings )
    {
      suggested.appendChild( sa_createSuggestedSpan( binding ) )
      if ( binding !== bindings[ bindings.length - 1 ] )
      {
        suggested.innerHTML += ",&nbsp;"
      }
    }
  }
}

function sa_createSuggestedSpan( binding )
{
  let span = document.createElement( "span" )
  span.title = binding.description
  span.innerText = binding.keys.filter( key => key !== " " ).join(", ")
  return span
}