const autoCompleteConfig = {
        renderOption(movie) {
            const imgSrc = movie.Poster === "N/A" ? " " : movie.Poster;
            return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
        },
        inputValue(movie) {
            return movie.Title;
        },
        async fetchData(searchTerm) {
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
        }
    }
    //inherits configuration from the auto complete configuration and selects the id in the HTML
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    }
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    }
});

let leftMovie;
let rightMovie;
const onMovieSelect = async(movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "73bc1a54",
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    // Function that iterates and compares the two movies
    const runComparison = () => {
        const leftSideStats = document.querySelectorAll('#left-summary .notification');
        const rightSideStats = document.querySelectorAll('#right-summary .notification');

        leftSideStats.forEach((leftStat, index) => {
            const rightStat = rightSideStats[index];

            const leftSideValue = parseInt(leftStat.dataset.value);
            const rightSideValue = parseInt(rightStat.dataset.value);


            if (rightSideValue > leftSideValue) {
                leftStat.classList.remove("is-primary");
                leftStat.classList.add("is-warning");
            } else if (rightSideValue == leftSideValue) {
                rightStat.classList.remove("is-primary");
                rightStat.classList.add("is-outlined");
            } else {
                rightStat.classList.remove("is-primary");
                rightStat.classList.add("is-warning");
            }
        });
    };
    //passed parameters to the function - left & right - this helps identify whether the user
    // searched on the left or right section
    if (side === "left") {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }
    //This if statement runs the comparison function when the left and right movie are populated
    if (leftMovie && rightMovie) {
        runComparison();
    }
}

const movieTemplate = (movieDetail) => {
    const rottenRating = parseInt(movieDetail.Ratings[1].Value.replace(/%/g, ""));
    const imdbRatingValue = parseFloat(movieDetail.imdbRating);
    const imdbVotesValue = parseInt(movieDetail.imdbVotes.replace(/%/g, "").replace(/,/g, ""));
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""));
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);


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
    <article data-value=${rottenRating} class="notification is-primary">
        <p class="title">${movieDetail.Ratings[1].Value} </p>
        <p class="subtitle"> Rotten Tomatoes </p>
    </article>
    <article data-value=${imdbRatingValue} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating} </p>
        <p class="subtitle"> IMDB Rating </p>
    </article>
    <article data-value=${imdbVotesValue} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes} </p>
        <p class="subtitle"> IMDB Votes </p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
        <p c lass="title">${movieDetail.BoxOffice} </p>
        <p class="subtitle"> Box Office </p>
    </article>
    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards} </p>
        <p class="subtitle"> Awards </p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Released} </p>
        <p class="subtitle"> Released </p>
    </article>
    `;
}