let currentSong = new Audio();
console.log("java Script")

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

const playMusic = (track) => {
    // let audio = new Audio("/songs/" + track);
    play.src = "pause.svg";
    currentSong.src = "/songs/" + track;
    currentSong.play();
}

async function main() {

    
    // Get the list of all the songs
    let songs = await getSongs();

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
}
main();