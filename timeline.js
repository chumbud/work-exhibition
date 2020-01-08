var container = document.querySelector("#horizontal-container");
var innerContainer = document.querySelector("#horizontal-inner-container");
var about = document.querySelector("a[href^='#about'");
const end = document.querySelector("a[href^='#end'");

console.log(innerContainer.scrollWidth)
console.log(document.documentElement.clientWidth)
console.log(container.scrollTop)

function scrollProgress() {
  var pageWidth =
    innerContainer.scrollWidth - document.documentElement.clientWidth;
  
  var scrollStatePercentage = (container.scrollTop / pageWidth) * 100;
  document.querySelector("#tracker").style.width = "calc(" + scrollStatePercentage + "% - 2rem)";
  
  var per = (document.querySelector("#timeline").offsetWidth - 32) / 10;
  var number = Math.floor((document.querySelector("#tracker").offsetWidth) / per);
  
  console.log("---")
  console.log((document.querySelector("#timeline").offsetWidth - 32) + "/" + count + "=" + (((document.querySelector("#timeline").offsetWidth)-32) / count))
  
  console.log(number)
  console.log((document.querySelector("#tracker").offsetWidth) + "/" + per + " = " + ((document.querySelector("#tracker").offsetWidth) / per))
  
  document.querySelectorAll(".line").forEach(line => {
    line.classList.remove("current");
  });
  if (number >= 1 && number < count)
    document
      .querySelector("a[href^='#" + number + "'")
      .classList.add("current");
  else if(number == 0) about.classList.add("current");
  else if(number == count) end.classList.add("current");
}

container.addEventListener("scroll", function() {
  scrollProgress();
});

let count = 1;
let submittedWorks = [];
const workList = document.querySelector("#horizontal-inner-container");
const timeline = document.querySelector("#timeline");

fetch("json/entries.json")
  .then(worksResponse => worksResponse.json())
  .then(jsonData => {
    submittedWorks = jsonData;
    submittedWorks.forEach(piece => {
      //create section
      const section = document.createElement("section");
      section.setAttribute("id", count);
      section.classList.add("workspace");

      //section content + append
      section.innerHTML =
        "<div class='workspace-container'><grid class='workspace-grid'><div class='workspace-frame'><img src='./assets/user/" +
        piece.img +
        "'><h2>" +
        piece.date +
        "</h2></div><div class='workspace-sidebar'><p>" +
        piece.description +
        "</p><h3>" +
        piece.author +
        "</h3><div class='links'></div></div></grid></div>";
      workList.insertBefore(section, document.querySelector("#end"));

      let links = section.querySelector(".links");
      piece.links.forEach(l => {
        let link = document.createElement("a");
        link.target = "_blank";
        link.href = l.url;
        link.innerHTML = l.vendor;

        links.appendChild(link);
      });

      //add line to timeline
      const line = document.createElement("a");
      line.classList.add("line");
      line.href = "#" + count;
      line.innerHTML = "<img src='/assets/user/" + piece.img + "'>";
      timeline.insertBefore(line, end);

      count++;
    });
  });
