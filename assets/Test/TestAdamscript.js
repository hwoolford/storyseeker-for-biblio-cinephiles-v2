const imagePath = "https://image.tmdb.org/t/p/w154/";
const form = document.getElementById("user-form");
let formInput = document.getElementById("search-input");
const main = document.getElementById("main_movie");
const tableBody = document.getElementById("table");
const outputList = document.getElementById("book-output")
const row = document.getElementsByClassName("row")
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
    if (poster_path == null) {
      movieEl.innerHTML = `
      <h2>${title}</h2>
      <div class = "movieInfo">

      <img id="placeholder" src="./assets/images/placeholder.png" alt ="${title}" /> 
      <div class="overview">
      <h3>Overview</h3>
      ${overview}
      </div>
      </div>
          `;
    } else if (overview == "") {
      movieEl.innerHTML = `
      <h2>${title}</h2>
      <div class = "movieInfo">
      <img src="${imagePath + poster_path}" alt ="${title}" />
      <div class="overview">
      <h3>Overview</h3>
      <p><i>Overview is not available<i></p>
      </div>
      </div>
          `;
    } else {
      movieEl.innerHTML = `
            <h2>${title}</h2>
            <div class = "movieInfo">
            <img src="${imagePath + poster_path}" alt ="${title}" />
            <div class="overview">
            <h3>Overview</h3>
            ${overview}
            </div>
            </div>
                `;
    }
    main.appendChild(movieEl);
  });
}


const modal = document.getElementById('myModal');
const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.querySelector('.modal-close');

openModalButton.addEventListener('click', () => {
  modal.classList.add('is-active');
});

closeModalButton.addEventListener('click', () => {
  modal.classList.remove('is-active');
});
// Select the modal element and store it in a variable
const modal1 = document.getElementById("modal");

// Add an event listener to the modal close button
const modalCloseButton = modal.querySelector(".modal-close");
modalCloseButton.addEventListener("click", () => {
  modal.classList.remove("is-active");
});

function findBooks(search) {
  const bookURL = `https://openlibrary.org/subjects/${search}.json`;
  fetch(bookURL)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data.works);
      if (data.works.length === 0) {
        modal.classList.add('is-active'); // Open the modal
      } else {
        outputList.innerHTML = "";
        data.works.forEach((book) => {
          const bookEl = document.createElement("div");
          bookEl.innerHTML = `
              <h2>${book.title}</h2>
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

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchInput = formInput.value;
  let storedHistory = JSON.parse(localStorage.getItem("searchTerm")) || [];

  if (!Array.isArray(storedHistory)) {
    storedHistory = [];
  }

  if (!storedHistory.includes(searchInput)) {
    storedHistory.push(searchInput);
  }
  localStorage.setItem("searchTerm", JSON.stringify(storedHistory));
  if (searchInput && searchInput !== "") {
    findMovies(searchInput);
    findBooks(searchInput);
    showHistory();
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
      searchHistory.setAttribute("id", "input");
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
