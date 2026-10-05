let currentSong = new Audio();
console.log("java Script")
let songs;

function formatTime(seconds) {
    if(isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    let totalSeconds = Math.floor(seconds);

    let minutes = Math.floor(totalSeconds / 60);
    let remainingSeconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("%5C")[2]);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    if(!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    currentSong.src = "/songs/" + track;
    currentSong.play();
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00/00:00";

}

async function main() {

    
    // Get the list of all the songs
    songs = await getSongs();
    // playMusic(songs[0], true); 
    
    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                                                    <img class="invert" src="music.svg" alt="">
                                                    <div class="info">
                                                        <div>${song}</div>
                                                        <div>Shivani</div>
                                                    </div>
                                                    <div class="playnow">
                                                        <span>Play Now</span>
                                                        <img width="30px" class="invert" src="play.svg" alt="">
                                                    </div>
                                                </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element =>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })

    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 +  "%";
        
    })

    //Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent+ "%";
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

        if(index - 1 >= 0) {
            playMusic(songs[index - 1]);

        }
    })

    // Add an event listener to next song button
    next.addEventListener("click", () => {
        console.log("next clicked")
        
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index) < songs.length - 1){
            playMusic(songs[index + 1]);

        }
    })
}
main();