var container = document.querySelector("#horizontal-container")
var innerContainer = document.querySelector("#horizontal-inner-container")

function scrollProgress() {
    var pageWidth = innerContainer.scrollWidth - document.documentElement.clientWidth
  
	  var scrollStatePercentage = (container.scrollTop / pageWidth) * 100
	  document.querySelector("#tracker").style.width = scrollStatePercentage + "%"
    console.log(scrollStatePercentage)
	}
container.addEventListener("scroll", function() {
  setTimeout(scrollProgress(), 500)
})