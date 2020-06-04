const fetchData = async(searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "73bc1a54",
            s: searchTerm
        }
    });
    //retunrs an empty array if the search yields no results. 
    if (response.data.Error) {
        return [];
    }

    return response.data.Search;
};

const root = document.querySelector(".autocomplete");

//Creates HTML elements in JavaScript to display the dropdown menu.
root.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"> </div>
        </div>
    </div>    
`;

const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

//Promise function, hence "async" and "await," to fetch the data values.
const onInput = async event => {
    const movies = await fetchData(event.target.value);

    //If statement so the dropdown dissapears after every query search.
    if (!movies.length) {
        dropdown.classList.remove("is-active");
        return;
    }

    //clears the search bar of the string. Else search results stay.
    resultsWrapper.innerHTML = "";
    dropdown.classList.add("is-active");
    for (let movie of movies) {
        const option = document.createElement("a");
        //Ternary operator that checks if the movie has an image or "Poster." 
        //If it doesn't it will return no image
        const imgSrc = movie.Poster === "N/A" ? " " : movie.Poster;

        option.classList.add("dropdown-item");
        option.innerHTML = `
        <img src="${imgSrc}" />
        ${movie.Title}  
        `;

        option.addEventListener("click", () => {
            dropdown.classList.remove("is-active");
            input.value = movie.Title;

            onMovieSelect(movie);
        });

        resultsWrapper.appendChild(option);
    }
};

//Use of debounce function so the API does not launch a search immediately, but rather waits 1 second
//to search - doesn't exhaust the number of searches per day - For function see file "utils.js".
input.addEventListener("input", debounce(onInput, 1000));

//Handles event so menu retracts when the user clicks outside the the menu or "root" element in this case. 
document.addEventListener("click", event => {
    if (!root.contains(event.target)) {
        dropdown.classList.remove("is-active");
    }
});

const onMovieSelect = async movie => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "73bc1a54",
            i: movie.imdbID
        }
    });
    console.log(response.data);
    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
}

const movieTemplate = (movieDetail) => {
    return `
    <article class="media">
    <figure class="media-left">
        <p class="image">
            <img src="${movieDetail.Poster}" />
        </p>    
    </figure>
    <div class="media-content">
        <div class="content"> 
            <h1> ${movieDetail.Title} </h1>
            <h4> ${movieDetail.Genre} </h4>
            <p> ${movieDetail.Plot} </p>        
        </div> 
    </div>     
    </article>

    <article class="notification is-primary">
        <p class="title">${movieDetail.Awards} </p>
        <p class="subtitle"> Awards </p>
    </article>
    <article class="notification is-primary">
        <p c lass="title">${movieDetail.BoxOffice} </p>
        <p class="subtitle"> Box Office </p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Ratings[1].Value} </p>
        <p class="subtitle"> Rotten Tomatoes </p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbRating} </p>
        <p class="subtitle"> IMDB Rating </p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes} </p>
        <p class="subtitle"> IMDB Votes </p>
    </article>
    
    `;
}