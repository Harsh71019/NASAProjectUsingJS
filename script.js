const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// Nasa Api
const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent() {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "result") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

function createdDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  console.log("current array", page, currentArray);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement("div");
    card.classList.add("card");
    //Link for image
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "Nasa picture of the day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Card Body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;

    // Save Text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    if (page === "results") {
      saveText.textContent = "Add to favorites";
      saveText.setAttribute("onclick", `saveFavorites('${result.url}')`);
    } else {
      saveText.textContent = "Remove Favorite";
      saveText.setAttribute("onclick", `removeFavorites('${result.url}')`);
    }

    // card Text

    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    // Footer

    const footer = document.createElement("small");
    footer.classList.add("text-muted");

    // date
    const date = document.createElement("strong");
    date.textContent = result.date;

    // copyright
    const copyrightResult =
      result.copyright === undefined ? " " : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${result.copyright}`;

    // Append

    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody, footer);
    imagesContainer.appendChild(card);
    console.log(card);
  });
}

function updateDOM(page) {
  // Get favorites from local storage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
    console.log("fromlocal", favorites);
  }
  imagesContainer.textContent = "";
  createdDOMNodes(page);
  showContent(page);
}

// Get 10 images from the nasa api

async function getNasaPictures() {
  // Show Loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    updateDOM("results");
    console.log(resultsArray);
  } catch (error) {
    // catch error here
  }
}

// Add results to favorites

function saveFavorites(itemUrl) {
  //Loop through results to get the favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      //Show save confirmation
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      //   Set favorites in local storage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// Remove results to favorites

function removeFavorites(itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.removeItem("nasaFavorites", JSON.stringify(favorites));
    updateDOM("favorites");
  }
}

// On load

getNasaPictures();
