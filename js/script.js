console.log("java Script")
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    let totalSeconds = Math.floor(seconds);

    let minutes = Math.floor(totalSeconds / 60);
    let remainingSeconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${currFolder}/`);
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("%5C")[3]);
        }
    }

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                                                    <img class="invert" src="img/music.svg" alt="">
                                                    <div class="info">
                                                        <div>${song}</div>
                                                        <div>Artist</div>
                                                    </div>
                                                    <div class="playnow">
                                                        <span>Play Now</span>
                                                        <img width="30px" class="invert" src="img/play.svg" alt="">
                                                    </div>
                                                </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })

    return songs;
}

const playMusic = (track, pause = false) => {
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }
    currentSong.src = `/${currFolder}/` + track;
    currentSong.play();
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";

}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.getElementsByClassName("cardContainer")[0]
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("\songs")) {
            let folder = e.href.split("%5C").slice(-1)[0]

            // Ger the metadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                                                                    <div class="play">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                                                                            <circle cx="12" cy="12" r="12" fill="#1ed760" />
                                                                            <path d="M9 7L18 12L9 17V7Z" fill="black" />
                                                                        </svg>
                                                                    </div>
                                                                    <img src="/songs/${folder}/cover.jpg" alt="">
                                                                    <h2>${response.title}</h2>
                                                                    <p>${response.description}</p>
                                                                </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    })
}

async function main() {
    // Get the list of all the songs
    await getSongs(`songs/bollywood_fire`);
    playMusic(songs[0], true); 

    // Display all the albums on the page
    displayAlbums();

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // Add an event listener to previous song button
    previous.addEventListener("click", () => {
        console.log("previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);

        }
    })

    // Add an event listener to next song button
    next.addEventListener("click", () => {
        console.log("next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index) < songs.length - 1) {
            playMusic(songs[index + 1]);

        }
    })

    // Add an event to audio
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to: ", e.target.value, " out of 100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume > 0) {
            document.querySelector(".volume > img").src = document.querySelector(".volume > img").src.replace("img/mute.svg", "img/volume.svg");
        }
    })

    // Add an event listener to mute the track
    document.querySelector(".volume > img").addEventListener("click", (e) => {
        if(e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
            currentSong.volume = 0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })


}
main();