/******************************************
*     Events
******************************************/
$( document ).ready( () => {
  document.getElementsByTagName( "body" )[0]
    .style.display = ""
})

/******************************************
*     Page Navigation Buttons
******************************************/

prevPage.addEventListener( "click", () => {
  window.location.href = "fc.html"
} )
nextPage.addEventListener( "click", () => {
  window.location.href = "hth.html"
} )