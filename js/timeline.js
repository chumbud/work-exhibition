var lazyLoadAmdUrl =
  "https://cdn.jsdelivr.net/npm/vanilla-lazyload@12.4.0/dist/lazyload.amd.min.js";
var polyfillAmdUrl =
  "https://cdn.jsdelivr.net/npm/intersection-observer-amd@2.1.0/intersection-observer-amd.js";

/// Dynamically define the dependencies
var dependencies = [
  "IntersectionObserver" in window
    ? null // <- Doesn't require the polyfill
    : polyfillAmdUrl,
  lazyLoadAmdUrl
];

var container = document.querySelector("#horizontal-container");
var innerContainer = document.querySelector("#horizontal-inner-container");
var poppin = document.querySelector("#poppin");
var about = document.querySelector("a[href^='#about']");
var end = document.querySelector("a[href^='#end']");
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
var workList = document.querySelector("#horizontal-inner-container");
var timeline = document.querySelector("#timeline");

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
      //create section and populate with appropriate content
      const section = document.createElement("section");
      section.setAttribute("id", count);
      section.classList.add("workspace");

      let contentInsert;
      let contentUrl;
      if (piece.img) {
        contentInsert =
          "<div class='workspace-container'><grid class='workspace-grid'><div class='workspace-frame'><a class='read-more'>" +
          "<img class='lazy' src='./assets/user/placeholder.jpg' data-src='./assets/user/" +
          piece.img +
          ".jpg'>";
        contentUrl =
          "<img class='lazy' src='./assets/user/placeholder.jpg' data-src='./assets/user/" +
          piece.img +
          ".jpg'>";
      } else if (piece.video) {
        contentInsert =
          "<div class='workspace-container'><grid class='workspace-grid with-video'><div class='workspace-frame'>" +
          piece.video;
        contentUrl =
          "<p class='play-button'>&#9654;</p> <img class='lazy' src='./assets/user/" +
          piece.video_thumb +
          "'>";
      }

      //section content + append
      section.innerHTML =
        contentInsert +
        "<h2>" +
        piece.time +
        " · " +
        months[piece.month - 1] +
        "." +
        piece.day +
        "." +
        piece.year +
        "</h2><h3>" +
        piece.author +
        "</h3></a></div></grid></div>";
      workList.insertBefore(section, document.querySelector("#end"));

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
    // Initialize LazyLoad inside the callback
    require(dependencies, function(_, LazyLoad) {
      var lazyLoadInstance = new LazyLoad({        elements_selector: ".lazy"});
    });
  });
container.addEventListener("scroll", function() {
  scrollProgress();
});

//scrolls into view the piece selected on the timeline
document.querySelector("#timeline").addEventListener("click", function(event) {
  if (event.target.className == "line") {
    event.preventDefault();
    document
      .getElementById(event.target.getAttribute("href").substring(1))
      .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }
});

//gets info to put into the poppin section when an image is selected
var imgInsert = document.querySelector("#poppin-frame");
var timeInsert = document.querySelector("#poppin-sidebar > h2");
var authorInsert = document.querySelector("#poppin-sidebar > h3");
var descriptionInsert = document.querySelector("#poppin-description");
var linkInsert = document.querySelector("#poppin-links");

//searches for nearest id number from element clicked to determine which info to retrieve from organized array
document
  .querySelector("#horizontal-container")
  .addEventListener("click", function(event) {
    if (
      event.target.parentElement.className == "read-more" ||
      event.target.className == "read-more"
    ) {
      event.preventDefault();

      var piece_info =
        submittedWorks[event.target.closest(".workspace").id - 1];

      imgInsert.innerHTML =
        "<img src='./assets/user/" + piece_info.img + ".jpg'>";
      timeInsert.innerHTML =
        piece_info.time +
        " · " +
        months[piece_info.month - 1] +
        "." +
        piece_info.day +
        "." +
        piece_info.year;
      authorInsert.innerHTML = piece_info.author;
      descriptionInsert.innerHTML = piece_info.description;
      piece_info.links.forEach(l => {
        let link = document.createElement("a");
        link.target = "_blank";
        link.href = l.url;
        link.innerHTML = l.vendor;
        linkInsert.appendChild(link);
      });
      document.querySelectorAll("body > *:not(#poppin)").forEach(i => {
        i.classList.add("blur");
      });
      poppin.classList.add("show");
    }
  });

//closes overlay
poppin.querySelector(".close").addEventListener("click", function(event) {
  poppin.classList.remove("show");
  document.querySelectorAll("body > *:not(#poppin)").forEach(i => {
    i.classList.remove("blur");
  });
  linkInsert.innerHTML = "";
});

//tracks scroll progress
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

//used to change the colors of the wrk and o svgs
function colorSelect(n) {
  let cycle = Math.abs(n - 4 * Math.floor(n / 4));
  if (cycle == 0) {
    document.querySelectorAll("#wrk svg").forEach(svg => {
      svg.style.fill = "#000";
    });
  } else if (cycle == 3) {
    document.querySelectorAll("#wrk svg").forEach(svg => {
      svg.style.fill = "#ec008c";
    });
  } else if (cycle == 2) {
    document.querySelectorAll("#wrk svg").forEach(svg => {
      svg.style.fill = "#00aeef";
    });
  } else if (cycle == 1) {
    document.querySelectorAll("#wrk svg").forEach(svg => {
      svg.style.fill = "#fcee22";
    });
  }
}
