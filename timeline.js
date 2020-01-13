var container = document.querySelector("#horizontal-container");
var innerContainer = document.querySelector("#horizontal-inner-container");
var about = document.querySelector("a[href^='#about'");
const end = document.querySelector("a[href^='#end'");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec"
];

let count = 1;
let prevDecade;
let submittedWorks = [];
const workList = document.querySelector("#horizontal-inner-container");
const timeline = document.querySelector("#timeline");

fetch("json/35-entries.json")
  .then(worksResponse => worksResponse.json())
  .then(jsonData => {
    submittedWorks = jsonData;
    submittedWorks.sort(function(a, b) {
      return (
        new Date(months[a.month - 1] + " " + a.day + " " + a.year) -
        new Date(months[b.month - 1] + " " + b.day + " " + b.year)
      );
    });
    submittedWorks.forEach(piece => {
      //create section
      const section = document.createElement("section");
      section.setAttribute("id", count);
      section.classList.add("workspace");

      let contentInsert;
      let contentUrl;
      if (piece.img) {
        contentInsert =
          "<div class='workspace-container'><grid class='workspace-grid'><div class='workspace-frame'>" +
          "<figure class='progressive'><img class='progressive__img progressive--not-loaded' data-progressive='" +
          piece.img + ".jpg' src='sd" + piece.img + ".jpg'></figure>";
        contentUrl = "<img src='./assets/user/" + piece.img + ".jpg'>";
      } else if (piece.video) {
        contentInsert =
          "<div class='workspace-container'><grid class='workspace-grid with-video'><div class='workspace-frame'>" +
          piece.video;
        contentUrl =
          "<p class='play-button'>⯈</p> <img src='./assets/user/" + piece.video_thumb + "'>";
      }

      //section content + append
      section.innerHTML =
        contentInsert +
        "'><h2>" +
        piece.time +
        " · " +
        months[piece.month - 1] +
        "." +
        piece.day +
        "." +
        piece.year +
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
      line.innerHTML = contentUrl;

      let decade = Math.floor((piece.year - 1900) / 10) * 10;
      if (prevDecade != decade) {
        line.innerHTML = line.innerHTML + "<p>" + decade + "'s</p>";
        prevDecade = decade;
      }

      timeline.insertBefore(line, end);

      count++;
    });
  });
container.addEventListener("scroll", function() {
  scrollProgress();
});

document.querySelector("#timeline").addEventListener("click", function(event) {
  if (event.target.className == "line") {
    event.preventDefault();
    document
      .getElementById(event.target.getAttribute("href").substring(1))
      .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }
});

function scrollProgress() {
  var pageWidth =
    innerContainer.scrollWidth - document.documentElement.clientWidth;

  var scrollStatePercentage = (container.scrollTop / pageWidth) * 100;
  document.querySelector("#tracker").style.width = scrollStatePercentage + "%";

  var per = document.querySelector("#timeline").offsetWidth / (count + 1);
  var number = Math.floor(document.querySelector("#tracker").offsetWidth / per);

  //selects line to make current and turns logo certain color
  document.querySelectorAll(".line").forEach(line => {
    line.classList.remove("current");
  });

  if (number >= 1 && number < count) {
    document
      .querySelector("a[href^='#" + number + "'")
      .classList.add("current");
    colorSelect(number);
  } else if (number == 0) {
    about.classList.add("current");
    colorSelect(0);
  } else if (number >= count) {
    end.classList.add("current");
    colorSelect(0);
  }
}

function colorSelect(n) {
  let cycle = Math.abs(n - 4 * Math.floor(n / 4));
  if (cycle == 0) {
    document.querySelector("#wrk").style.filter = "brightness(0)";
  } else if (cycle == 3) {
    document.querySelector("#wrk").style.filter =
      "hue-rotate(-76deg) saturate(300%)";
  } else if (cycle == 2) {
    document.querySelector("#wrk").style.filter =
      "hue-rotate(-184deg) saturate(300%)";
  } else if (cycle == 1) {
    document.querySelector("#wrk").style.filter = "hue-rotate(-7deg)";
  }
}
