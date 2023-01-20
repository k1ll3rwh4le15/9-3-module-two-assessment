





// To ensure Cypress tests work as expeded, add any code/functions that you would like to run on page load inside this function

function run() {
    const header = document.querySelector("header");

    const h1 = document.createElement("h1");
    h1.textContent = "Ghibli Review App";
    
    const img = document.createElement("img");
    img.setAttribute("src", "./images/ghibli-logo.png");
    img.setAttribute("alt", "Ghibli logo");
    
    header.append(h1, img);
    
    const BASE_URL = "https://resource-ghibli-api.onrender.com";
    
    fetch(`${BASE_URL}/films`)
      .then((res) => res.json())
      .then((moviesData) => {
        const titles = document.querySelector("#titles");
        // loop begins
        for (let i = 0; i < moviesData.length; i++) {
          const option = document.createElement("option");
          option.value = moviesData[i].id;
          option.textContent = moviesData[i].title;
          titles.append(option);
    
          titles.addEventListener("change", (event) => {
            event.preventDefault();
    
            if (event.target.value === moviesData[i].id) {
              const info = document.querySelector("#display-info");
              info.innerHTML = "";
    
              const movieTitle = document.createElement("h3");
              movieTitle.textContent = moviesData[i].title;
    
              const movieReleaseYear = document.createElement("p");
              movieReleaseYear.textContent = moviesData[i].release_date;
    
              const movieDescription = document.createElement("p");
              movieDescription.textContent = moviesData[i].description;
    
              info.append(movieTitle, movieReleaseYear, movieDescription);
            }
          }); // <- titles addEventListener ends
        } // <-movie details loop ends
    
        const form = document.querySelector("form");
    
        form.addEventListener("submit", (event) => {
          event.preventDefault();
    
          const review = document.querySelector("#review");
    
          const ul = document.querySelector("ul");
    
          if (!titles.value) {
            alert("Please select a movie first");
          } else {
            for (movie of moviesData) {
              if (movie.id === titles.value) {
                const li = document.createElement("li");
                li.textContent = "";
                li.innerHTML = `<strong>${movie.title}:</strong> ${review.value}`;
                ul.append(li);
                form.reset();
              }
            } // <-form loop ends
          } // <- if/else ends
    
          const resetReview = document.querySelector("#reset-reviews");
    
          resetReview.addEventListener("click", () => {
            ul.innerHTML = "";
          }); // <- reset review addlistener ends
        }); //<- form addEventListener ends
    
        const button = document.querySelector("#show-people");
    
        button.addEventListener("click", (event) => {
          event.preventDefault();
          const ol = document.querySelector("ol");
          ol.textContent = "";
    
          fetch(`${BASE_URL}/people`)
            .then((res) => res.json())
            .then((people) => {
              for (let person of people) {
                for (let movie of person.films) {
                  if (movie.includes(titles.value)) {
                    const li = document.createElement("li");
                    li.textContent = `${person.name}`;
                    ol.append(li);
                  }
                }
              }
            }) //<- nested fetch ends
            .catch((err) => console.log(err));
        }); //<- button addEventListener ends
      }) //<- top/first fetch ends
      .catch((err) => console.log(err));// Add code you want to run on page load here
}

// This function will "pause" the functionality expected on load long enough to allow Cypress to fully load
// So that testing can work as expected for now
// A non-hacky solution is being researched

setTimeout(run, 1000);
