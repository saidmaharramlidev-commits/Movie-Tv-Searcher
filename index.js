// TOGGLE / LAYOUT
const rightPart = document.querySelector(".rightPart")
const moviesBtn = document.querySelector("#moviesBtn")
const seriesBtn = document.querySelector("#seriesBtn")
const loadingDiv = document.querySelector("#loading")
const toggle = document.querySelector("#toggle")
const leftPart = document.querySelector(".leftPart")
const navControls = document.querySelector(".navControls")


// HOME
const homeSearchForm = document.querySelector("#home .SearchPart")
const homeSearchInput = document.querySelector("#search")
const homeResults = document.querySelector("#home .results")
const homeRecentBox = document.querySelector("#home .recentSearches")
const resetBtnOfHome = document.querySelector("#resetBtnOfHome")

// MOVIES
const moviesSearchForm = document.querySelector("#movies .SearchPart")
const moviesSearchInput = document.querySelector("#searchMovies")
const moviesResults = document.querySelector(".resultsOfMovies")
const moviesRecentBox = document.querySelector("#movies .recentSearches")
const resetBtnOfMovies = document.querySelector("#resetBtnOfMovies")

//SERIES
const seriesSearchForm = document.querySelector("#series .SearchPart")
const seriesSearchInput = document.querySelector("#searchSeries")
const seriesResults = document.querySelector(".resultsOfSeries")
const seriesRecentBox = document.querySelector("#series .recentSearches")
const resetBtnOfSeries = document.querySelector("#resetBtnOfSeries")

//GENRES
const submitBtn = document.querySelector("#genres button")
const genresResults = document.querySelector(".resultsOfGenres")
const selectorOfGenres = document.querySelector("#selectGenre")
const dynamicGenreName = document.querySelector("#dynamicGenreName")

//IMDB
const imdbSearchForm = document.querySelector("#formOfImdb")
const imdbInputMin = document.querySelector("#formOfImdb .ratefirstOfImdb")
const imdbInputMax = document.querySelector("#formOfImdb .ratesecondOfImdb")
const imdbResults = document.querySelector(".resultsOfImdb")

//MOVIE TICKING PART
const movieTickingPart = document.querySelector("#movieTickingPart")
const movieTickingCoverDiv = document.querySelector("#movieTickingCoverDiv")
const nameOfTickingMovie = document.querySelector("#nameOfTickingMovie")
const infoTextOfTicking = document.querySelector("#infoTextOfTicking")
const movies = document.querySelectorAll(".movie")
const header = document.getElementById("header");

const releaseDate = document.getElementById("releaseDate");
const runtime = document.getElementById("runtime");
const rateOfMovieTicking = document.getElementById("rateOfMovieTicking");
const cast = document.querySelector(".cast");





const listOfGenres = {}



//--------------------------------------------------- LOCAL STORAGE ---------------------------------------------------

let recentItems = JSON.parse(localStorage.getItem("searches")) || []
let favorites = JSON.parse(localStorage.getItem("favorites")) || []



//--------------------------------------------------- SECTIONS MOVIES ---------------------------------------------------

const menuItems = document.querySelectorAll(".listOfRibbon li")
const sections = document.querySelectorAll(".section")

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        const target = item.dataset.section
        pushSection(target);
    

    })
})

document.addEventListener("click", async (e) => {
    const card = e.target.closest(".movie, .serie, .posterDiv[data-id]");
    if (!card) return;
    if (e.target.closest(".likeDiv")) return;

    toggle.style.display = "none";

    loadingDiv.style.visibility = 'visible'

    await loadDetails(card.dataset.id, card.dataset.type);

    loadingDiv.style.visibility = 'hidden'

    pushSection("movieTickingPart");
});







//--------------------------------------------------- RECENT UI ---------------------------------------------------

function updateRecentUI(container, input) {
    container.innerHTML = ""

    recentItems.forEach(item => {
        const p = document.createElement("p")
        p.className = "search"
        p.textContent = item

        p.addEventListener("click", () => {
            input.value = item
            container.style.visibility = "hidden"
        })

        container.appendChild(p)
    })
}

function saveRecent(query) {
    if (!recentItems.includes(query)) {
        recentItems.unshift(query)
        if (recentItems.length > 15) recentItems.pop()
        localStorage.setItem("searches", JSON.stringify(recentItems))
    }
}


//--------------------------------------------------- HOME SEARCH ---------------------------------------------------

homeSearchInput.addEventListener("focus", () => {
    updateRecentUI(homeRecentBox, homeSearchInput)
    homeRecentBox.style.visibility = "visible"
})

homeSearchInput.addEventListener("blur", () => {
    homeRecentBox.style.visibility = "hidden"
})

homeSearchForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const query = homeSearchInput.value.trim()
    if (!query) return



    homeResults.innerHTML = ""

    loadingDiv.style.visibility = 'visible'

    saveRecent(query)
    await fetchMoviesForHome(query, homeResults)
    loadingDiv.style.visibility = 'hidden'



})


//--------------------------------------------------- MOVIES SEARCH ---------------------------------------------------

moviesSearchInput.addEventListener("focus", () => {
    updateRecentUI(moviesRecentBox, moviesSearchInput)
    moviesRecentBox.style.visibility = "visible"
})

moviesSearchInput.addEventListener("blur", () => {
    moviesRecentBox.style.visibility = "hidden"
})

moviesSearchForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const query = moviesSearchInput.value.trim()
    if (!query) return

    moviesResults.innerHTML = ""
    loadingDiv.style.visibility = 'visible'
    saveRecent(query)
    await fetchMoviesForMovies(query, moviesResults)
    loadingDiv.style.visibility = 'hidden'

})

//-------------------------------------------------SERIES SEARCH----------------------------------------------------------------

seriesSearchInput.addEventListener("focus", () => {
    updateRecentUI(seriesRecentBox, seriesSearchInput)
    seriesRecentBox.style.visibility = "visible"
})

seriesSearchInput.addEventListener("blur", () => {
    seriesRecentBox.style.visibility = "hidden"
})

seriesSearchForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const query = seriesSearchInput.value.trim()
    if (!query) return

    seriesResults.innerHTML = ""
    loadingDiv.style.visibility = 'visible'
    saveRecent(query)
    await fetchSeries(query, seriesResults)
    loadingDiv.style.visibility = 'hidden'

})


//-------------------------------------------------------------GENRES SEARCH-------------------------------------------------------
const genresDivs = Array.from(document.querySelectorAll(".genre"))

submitBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    genresResults.innerHTML = ""

    if (!selectorOfGenres.value) return

    dynamicGenreName.textContent = selectorOfGenres.value

    loadingDiv.style.visibility = 'visible'
    await fetchGenre(selectorOfGenres.value, genresResults)
    loadingDiv.style.visibility = 'hidden'
  
})

genresDivs.forEach((genreDiv) => {
    genreDiv.addEventListener("click", async (e) => {
        e.preventDefault()
        genresResults.innerHTML = ""

        dynamicGenreName.textContent = genreDiv.textContent

        loadingDiv.style.visibility = 'visible'
        await fetchGenre(genreDiv.textContent, genresResults)
        loadingDiv.style.visibility = 'hidden'



    })


})

//------------------------------------------------------------IMDB-------------------------------------------------------------

imdbSearchForm.addEventListener("submit", async (e) => {

    e.preventDefault()

    if (!imdbInputMin.value || !imdbInputMax.value) return

    imdbResults.innerHTML = ""

    document.querySelector("#topRatedText").innerHTML = `Top Rated <h2 id="ratePoint">For ${imdbInputMin.value} - ${imdbInputMax.value}</h2>`
    loadingDiv.style.visibility = 'visible'

    await fetchImdb(imdbInputMin.value, imdbInputMax.value, imdbResults)
    loadingDiv.style.visibility = 'hidden'

    imdbSearchForm.reset()

})



//-----------------------------------------------------------RESET--------------------------------------------------------

resetBtnOfHome.addEventListener("click", (e) => {


    homeResults.innerHTML = ""
    homeSearchInput.value = ""

})

resetBtnOfMovies.addEventListener("click", (e) => {


    moviesResults.innerHTML = ""
    moviesSearchInput.value = ""

})

resetBtnOfSeries.addEventListener("click", (e) => {

    seriesResults.innerHTML = ""
    seriesSearchInput.value = ""

})



//--------------------------------------------------- FETCH FUNCTIONS ---------------------------------------------------

const TMDB_HEADERS = {
    method: "GET",
    headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMTA3ZmZlNGMzZWFmNGZiMzgwMTU3MTE4NTQwNjFmMSIsIm5iZiI6MTc2NzE2NTU1Mi4xNjQsInN1YiI6IjY5NTRjZTcwYWIxYmM1ZDY5YWNiZGZkNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vu6az21E9QNloHHpMEKU4enI0wrmX9DJEUps0DzriBA"
    }
}

async function fetchMoviesForHome(query, targetDiv) {
    return fetch(`https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&query=${query}`, TMDB_HEADERS)
        .then(res => res.json())
        .then(data => {
            renderMovies(data.results, targetDiv)
        })
        .catch(console.error)

}


async function fetchMoviesForMovies(query, targetDiv) {
    return fetch(`https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&query=${query}`, TMDB_HEADERS)
        .then(res => res.json())
        .then(data => renderMovies(data.results, targetDiv))
        .catch(console.error)
}

async function fetchSeries(query, targetDiv) {
    return fetch(`https://api.themoviedb.org/3/search/tv?include_adult=false&language=en-US&query=${query}`, TMDB_HEADERS)
        .then(res => res.json())
        .then(data => renderSeries(data.results, targetDiv))
        .catch(console.error)
}

async function fetchGenre(query, targetDiv) {
    return fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&page=2`, TMDB_HEADERS)
        .then(res => res.json())
        .then(data => renderGenres(data.results, query, targetDiv))
        .catch(console.error)
}

async function fetchImdb(queryMin, queryMax, targetDiv) {
    return fetch(`https://api.themoviedb.org/3/discover/movie?vote_average.gte=${queryMin}&vote_average.lte=${queryMax}&vote_count.gte=500`, TMDB_HEADERS)

        .then(res => res.json())
        .then(data => renderMovies(data.results, targetDiv))
        .catch(console.error)

}

//------------------------------------------------------SHOW FUNCTIONS------------------------------------------------------


function showPopular() {
    fetch("https://api.themoviedb.org/3/trending/all/day?language=en-US", TMDB_HEADERS)
        .then(res => res.json())
        .then(data => renderMovies(data.results, homeResults))
        .catch(console.error)
}

function showPopularForMovies() {
    fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=2", TMDB_HEADERS)
        .then(res => res.json())
        .then(data => renderMovies(data.results, moviesResults))
        .catch(console.error)
}

function showPopularForSeries() {
    fetch("https://api.themoviedb.org/3/trending/tv/day?language=en-US", TMDB_HEADERS)
        .then(res => res.json())
        .then(data => renderSeries(data.results, seriesResults))
        .catch(console.error)
}

function showTopRated() {
    fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", TMDB_HEADERS)
        .then(res => res.json())
        .then(data => renderMovies(data.results, imdbResults))
        .catch(console.error)

}




//--------------------------------------------------- RENDER ---------------------------------------------------

function renderMovies(movies, container) {

    movies.forEach(movie => {
        if (!movie.poster_path) return

        const div = document.createElement("div")
        div.className = "posterDiv"
        div.classList.add("movie")
        div.dataset.section = "movieTickingPart"
        div.dataset.id = movie.id
        div.dataset.type = movie.media_type || "movie"


        const img = document.createElement("img")
        img.className = "posterImg"
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`


        const rateDiv = document.createElement("div")
        rateDiv.className = "ratingOfMovie"
        let rating = movie.vote_average
        let rounded = Math.round(rating * 10) / 10
        rateDiv.textContent = rounded




        const likeDiv = document.createElement("button")
        const likeIcon = document.createElement("span")
        likeIcon.className = "likeIcon"
        likeIcon.textContent = "♡"
        likeDiv.className = "likeDiv"


        div.appendChild(img)
        div.appendChild(rateDiv)
        likeDiv.appendChild(likeIcon)
        div.appendChild(likeDiv)
        container.appendChild(div)
    })
}


function renderSeries(series, container) {

    series.forEach(serie => {
        if (!serie.poster_path) return

        const div = document.createElement("div")
        div.className = "posterDiv"
        div.classList.add("serie")
        div.dataset.section = "movieTickingPart"
        div.dataset.id = serie.id
        div.dataset.type = serie.media_type || "tv"


        const img = document.createElement("img")
        img.className = "posterImg"
        img.src = `https://image.tmdb.org/t/p/w500${serie.poster_path}`


        const rateDiv = document.createElement("div")
        rateDiv.className = "ratingOfMovie"
        let rating = serie.vote_average
        let rounded = Math.round(rating * 10) / 10
        rateDiv.textContent = rounded




        const likeDiv = document.createElement("button")
        const likeIcon = document.createElement("span")
        likeIcon.className = "likeIcon"
        likeIcon.textContent = "♡"
        likeDiv.className = "likeDiv"


        div.appendChild(img)
        div.appendChild(rateDiv)
        likeDiv.appendChild(likeIcon)
        div.appendChild(likeDiv)
        container.appendChild(div)
    })
}

function renderGenres(movies, query, container) {
    container.innerHTML = ""

    const query_id = Number(
        Object.keys(listOfGenres)
            .find(id => listOfGenres[id] === query)
    )

    let found = false

    for (const movie of movies) {
        if (!movie.poster_path || !movie.genre_ids) continue

        if (movie.genre_ids.includes(query_id)) {
            found = true

            const div = document.createElement("div")
            div.className = "posterDiv"
            div.dataset.section = "movieTickingPart"
            div.dataset.id = movie.id
            div.dataset.type = movie.media_type || "movie"
            const img = document.createElement("img")

            img.className = "posterImg"
            img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`

            div.append(img)
            container.append(div)
        }
    }

    if (!found) {
        const h1 = document.createElement("h1")
        h1.textContent = "Sorry... No results for this genre"
        h1.className = "infoOfGenre"
        container.append(h1)
    }
}

const favoritesContainer = document.querySelector(".resultsOfFavorites")

function renderFavorites() {
    favoritesContainer.innerHTML = ""

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<h2 style='color:white'>No favorites yet</h2>"
        return
    }

    favorites.forEach(movie => {
        const div = document.createElement("div")
        div.className = "posterDiv"

        const img = document.createElement("img")
        img.className = "posterImg"
        img.src = movie.poster

        const rateDiv = document.createElement("div")
        rateDiv.className = "ratingOfMovie"
        rateDiv.textContent = movie.rating

        const likeDiv = document.createElement("button")
        const likeIcon = document.createElement("span")
        likeIcon.className = "likeIcon"
        likeIcon.textContent = "♡"
        likeDiv.className = "likeDiv"




        div.append(img, rateDiv)
        likeDiv.appendChild(likeIcon)
        div.appendChild(likeDiv)
        favoritesContainer.append(div)
    })
}


//-------------------------------------------------GENRES LIST FETCHING----------------------------------------------------

function getGenres() {
    fetch("https://api.themoviedb.org/3/genre/movie/list?language=en-US", TMDB_HEADERS)
        .then(res => res.json())
        .then(data => {
            data.genres.forEach((genre) => {
                listOfGenres[genre.id] = genre.name
            })
        })
}


//--------------------------------------------------- LIKING MOVE ---------------------------------------------------

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".likeDiv");
    if (!btn) return;

    e.stopPropagation();

    const card = btn.closest(".posterDiv");
    const movieId = card.dataset.id;

    // toggle liked class
    const isLiked = btn.classList.toggle("liked");

    const movieData = {
        id: movieId,
        poster: card.querySelector("img").src,
        rating: card.querySelector(".ratingOfMovie")?.textContent || "",
        type: card.dataset.type
    };

    if (isLiked) {
        // Add to favorites if not already there
        if (!favorites.some(f => f.id === movieId)) {
            favorites.push(movieData);
        }
    } else {
        // Remove from favorites
        favorites = favorites.filter(f => f.id !== movieId);

        // If this is favorites section, remove the card immediately
        if (card.parentElement.classList.contains("resultsOfFavorites")) {
            card.remove();
        }
    }

    // Update localStorage
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Update all like buttons for this movie across all sections
    document.querySelectorAll(`.posterDiv[data-id="${movieId}"] .likeDiv`).forEach(otherBtn => {
        if (isLiked) {
            otherBtn.classList.add("liked");
        } else {
            otherBtn.classList.remove("liked");
        }
    });

    // Re-render favorites if we didn't remove from favorites section
    if (!card.parentElement.classList.contains("resultsOfFavorites")) {
        renderFavorites();
    }
});




//----------------------------------------------------MOVIE DETAILS--------------------------------------------------


async function loadDetails(id, type) {
    
    
    const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?language=en-US`, TMDB_HEADERS)
    const data = await res.json()
    const resCast = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/credits`,
        TMDB_HEADERS
    );
    const dataCast = await resCast.json();

    



    movieTickingCoverDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${data.poster_path})`



    nameOfTickingMovie.textContent = data.title || data.name
    infoTextOfTicking.textContent = data.overview

    header.style.backgroundImage =
        `url(https://image.tmdb.org/t/p/original${data.poster_path})`

    if (type === "movie") {
        releaseDate.textContent = data.release_date
        runtime.innerHTML = `${data.runtime} <span>min</span>`
    } else {
        releaseDate.textContent = data.first_air_date
        runtime.innerHTML = `${data.number_of_seasons} <span>seasons</span>`
    }

    rateOfMovieTicking.textContent = Math.round(data.vote_average * 10) / 10






    // clear old cast first
    cast.innerHTML = "";

    // show first 6 actors
    dataCast.cast.slice(0, 10).forEach(actor => {
        const div = document.createElement("div");
        div.className = "actor";

        const img = document.createElement("img");
        img.src = actor.profile_path
            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
            : "fallback.jpg"; // optional

        img.alt = actor.name;

        const name = document.createElement("p");
        name.className = "actorName"
        name.textContent = actor.name;

        div.append(img, name);
        cast.append(div);
    });




}



//----------------------------------------------------TOGGLE--------------------------------------------------------------

toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    leftPart.classList.toggle('open');
});

leftPart.addEventListener('click', (e) => {
    e.stopPropagation();
});

document.addEventListener('click', () => {
    leftPart.classList.remove('open');
});

//----------------------------------------------------BACK AND FORWARD BUTTON-----------------------------------------------

const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");

function updateNavButtons() {
    backBtn.disabled = history.state === null;
}

backBtn.addEventListener("click", () => {
    history.back();

});

forwardBtn.addEventListener("click", () => {
    history.forward();
});

// push state when section changes
function pushSection(sectionId) {
    sections.forEach(sec => sec.classList.remove("active"));

    const target = document.getElementById(sectionId);
    target.classList.add("active");

    history.pushState({ section: sectionId }, "", `#${sectionId}`);
    updateNavButtons();
}


// listen to browser navigation
window.addEventListener("popstate", (e) => {
    if (!e.state?.section) return;

    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(e.state.section).classList.add("active");

    updateNavButtons();
});





//--------------------------------------------------- INIT ---------------------------------------------------

showPopular()
showPopularForMovies()
showPopularForSeries()
showTopRated()
getGenres()
renderFavorites()
updateNavButtons();

// Push initial state for the current section
const activeSection = document.querySelector(".section.active").id;
history.replaceState({ section: activeSection }, "", `#${activeSection}`);
updateNavButtons();



