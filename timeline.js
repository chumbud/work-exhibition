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

let submittedWorks = []
const workList = document.querySelector("#horizontal-inner-container")

fetch('json/entries.json')
  .then(jsonData => {
    let count = 1
    submittedWorks = jsonData
    submittedWorks.forEach(piece => {
      const section = document.createElement("section")
      section.setAttribute("id", count)
      section.classList.add("workspace");
      count++;

      section.innerHTML = "<div class='workspace-container'><grid class='workspace-grid'><div class='workspace-frame'><img src='./assets/user/" + piece.img + "'><h2>" + piece.date + "</h2></div><div class='workspace-sidebar'><p>" + piece.description + "</p><h3>" + piece.author + "</h3><div class='links'></div></div></grid></div>"
      workList.appendChild(section)
    })
  })
