const imagePath = "https://image.tmdb.org/t/p/w154/";
const form = document.getElementById("user-form");
let formInput = document.getElementById("search-input");
const main = document.getElementById("main_movie");
const tableBody = document.getElementById("table");
const outputList = document.getElementById("book-output");
const row = document.getElementsByClassName("row");
const btn = document.getElementById("button");
const placeHldr = "";
let searchData;

const movieAuth = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NjQ3YzMzODcxMjJmMjEyYzZlZDFkZGViNzU4ZmZiMiIsInN1YiI6IjY1NGQwZGE0ZmQ0ZjgwMDExZWQzZDhjOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HB0iJ-sayz4Ungi3ekOAARph1iwM4wQe_pzuZsOeyzQ",
  },
};

function findMovies(search) {
  let movieURL = `https://api.themoviedb.org/3/search/movie?include_adult=false&original_language=en-US&page=1&query=${search}`;
  fetch(movieURL, movieAuth)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      showMovies(data.results);
    });
}

function showMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const { title, overview, poster_path } = movie;
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie-element");
    if (poster_path == null) {
      movieEl.innerHTML = `
      <h2 class = "output-title">${title}</h2>
      <div class = "movieInfo">

      <img id="placeholder" src="./assets/images/StorySeeker_placeholder_image.png" alt ="${title}" /> 
      <div class="overview">
      ${overview}
      </div>
      </div>
          `;
    } else if (overview == "") {
      movieEl.innerHTML = `
      <h2 class = "output-title">${title}</h2>
      <div class = "movieInfo">
      <img src="${imagePath + poster_path}" alt ="${title}" />
      <div class="overview">
      <p><i>Overview is not available<i></p>
      </div>
      </div>
          `;
    } else {
      movieEl.innerHTML = `
            <h2 class = "output-title">${title}</h2>
            <div class = "movieInfo">
            <img src="${imagePath + poster_path}" alt ="${title}" />
            <div class="overview">
            ${overview}
            </div>
            </div>
                `;
    }
    main.appendChild(movieEl);
  });
}

function findBooks(search) {
  const bookURL = `https://openlibrary.org/subjects/${search}.json`;
  fetch(bookURL)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.works);
      if (data.works.length === 0) {
        modal.classList.add("is-active"); // Open the modal
      } else {
        outputList.innerHTML = "";
        data.works.forEach((book) => {
          const bookEl = document.createElement("div");
          bookEl.classList.add("book-element");
          bookEl.innerHTML = `
              <h2 class = "output-title">${book.title}</h2>
              <div class="bookInfo">
                <img src="https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg" />
              </div>
            `;
          outputList.append(bookEl);
        });
        // console.log(data);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

formInput.addEventListener("input", function () {
  const errorMessage = formInput.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove(); // Remove the error message from the DOM
  }
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchInput = formInput.value.trim();
  if (searchInput === "") {
    // If the search input is empty, display a message
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Please enter a search term.";
    errorMessage.classList.add("error-message"); // Add a class for styling

    // Insert the error message after the form input
    formInput.parentNode.insertBefore(errorMessage, formInput.nextSibling);
  } else {
    // Open the modal instead of showing an alert
    modal.classList.add("is-active");
  }
});

let showHistory = function () {
  let storedHistory = JSON.parse(localStorage.getItem("searchTerm"));
  tableBody.innerHTML = "";
  if (storedHistory) {
    for (let i = 0; i < storedHistory.length; i++) {
      let history = storedHistory[i];
      let createTableRow = document.createElement("tr");
      createTableRow.setAttribute("id", "tableRow");
      let tableData = document.createElement("td");
      let searchHistory = document.createElement("a");
      searchHistory.setAttribute("id", "history");
      $("#search-input").val("");
      searchHistory.textContent = history;
      tableData.appendChild(searchHistory);
      createTableRow.appendChild(tableData);
      tableBody.appendChild(createTableRow);

      searchHistory.addEventListener("click", function () {
        let clickedTerm = this.textContent;
        findMovies(clickedTerm);
        findBooks(clickedTerm);
      });
    }
  } else {
  }
};

showHistory();
