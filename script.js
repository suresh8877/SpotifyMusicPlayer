console.log("Start Music");

async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}
let currentsong=new Audio();


const playmusic=(track)=>{
    currentsong.src="/songs/"+track;
    currentsong.play();
    document.getElementById("play").src="data/pause.svg";
    document.querySelector(".btu").getElementsByTagName("h")[0].innerHTML=track;       
}
currentsong.volume=0.25;

async function main() {
    let songs = await getsongs();
    currentsong.src="/songs/"+songs[0].split("/songs/")[1].replaceAll("%20", " ");
    document.querySelector(".btu").getElementsByTagName("h")[0].innerHTML=songs[0].split("/songs/")[1].replaceAll("%20", " ");   
    let doc = document.querySelector(".songlist").getElementsByTagName("ol")[0];

    for (const song of songs) {
        doc.innerHTML = doc.innerHTML + `<li>
        <img src="data/music.svg" alt="Music">
        <h>${song.split("/songs/")[1].replaceAll("%20", " ")}</h>
        <img src="data/play4.svg" alt="Play">
        </li>`;
    }
    let e=document.querySelector("ol").getElementsByTagName("li");
    Array.from(e).forEach((s)=>{
        s.addEventListener("click",()=>{
            playmusic(s.getElementsByTagName("h")[0].innerHTML);
            console.log(s.getElementsByTagName("h")[0].innerHTML,"i am here");
        })
    })

    document.getElementById("play").addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            document.getElementById("play").src="data/pause.svg";
        }
        else{
            currentsong.pause();
            document.getElementById("play").src="data/play2.svg";
        }
    })
    currentsong.addEventListener("timeupdate",()=>{
        let t=document.getElementById("timer");
        t.innerHTML=`${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`;
        document.getElementById("circle2").style.left=((currentsong.currentTime/currentsong.duration)*100)+"%";
        function formatTime(seconds) {
            var minutes = Math.floor(seconds / 60);
            var remainingSeconds = seconds % 60;
            return padZero(minutes) + ":" + padZero(Math.round(remainingSeconds));
        }
        function padZero(number) {
            return (number < 10 ? "0" : "") + number;
        }
    })
    document.getElementById("previous").addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src);
        if(index!=0){
            currentsong.src=songs[--index];
            playmusic(songs[index].split("/songs/")[1].replaceAll("%20", " "));
        }
    })
    document.getElementById("next").addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src);
        if(index!=songs.length-1){
            currentsong.src=songs[++index];
            playmusic(songs[index].split("/songs/")[1].replaceAll("%20", " "));
        }
    })
    document.querySelector(".volbar").addEventListener("click",(e)=>{
        currentsong.volume=(e.offsetX/e.target.getBoundingClientRect().width);
        document.querySelector(".circle").style.left=(currentsong.volume*100)+"%";
    })
    document.getElementById("statusbar").addEventListener("click",(e)=>{
        console.log(e.target.getBoundingClientRect().width,e.offsetX);
        currentsong.currentTime=(e.offsetX/e.target.getBoundingClientRect().width)*currentsong.duration;
    })
    document.getElementById("hamburger").addEventListener("click",(e)=>{
        let val=document.querySelector(".left").style.left;
        if(val=="-400px"){
            document.querySelector(".left").style.left="-12px";
        }
        else{
            document.querySelector(".left").style.left="-400px";
        }
    })
    document.getElementById("hamburger2").addEventListener("click",(e)=>{
        document.querySelector(".left").style.left="-12px";
    })
    document.getElementById("hamburger").addEventListener("click",(e)=>{
        document.querySelector(".left").style.left="-400px";
    })
    document.querySelector(".level").addEventListener("click",(e)=>{
        console.log(e.target);
        if(e.target.src=="vol.svg"){
            e.target.src="r.svg";
            currentsong.volume=0;
        }
    })
}

main();
