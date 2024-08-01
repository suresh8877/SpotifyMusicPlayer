console.log("Start Music");
let albumset="happy"
async function getsongs() {
    let a = await fetch(`http://127.0.0.1:5500/albums/${albumset}`);
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
let imglist=[];
let albumlist=[];
let desc=[];
const folder=async ()=>{
    const albums=await fetch("http://127.0.0.1:5500/albums/");
    const albumstext=await albums.text();
    let div=document.createElement("div");
    div.innerHTML=albumstext;
    for(let i=1;i<div.getElementsByTagName("li").length;i++){
        albumlist.push(div.getElementsByTagName("li")[i].getElementsByTagName("a")[0].title);
    }

    for(let i=1;i<div.getElementsByTagName("li").length;i++){
        const a=await fetch(div.getElementsByTagName("li")[i].getElementsByTagName("a")[0].href);
        const b=await a.text();
        let c=document.createElement("div");
        c.innerHTML=b;
        for(let j=0;j<c.getElementsByTagName("li").length;j++){
            let st=c.getElementsByTagName("li")[j].getElementsByTagName("a")[0].href.split(".");
    
            if(st[st.length-1]=="JPG" || st[st.length-1]=="jpg"){
                imglist.push(c.getElementsByTagName("li")[j].getElementsByTagName("a")[0].href)
            }
            if(st[st.length-1]=="txt"){
                desc.push(c.getElementsByTagName("li")[j].getElementsByTagName("a")[0].title)
            }   
        }
    }
    albumlist.map((_,ind)=>{
                document.getElementById("albums").innerHTML=document.getElementById("albums").innerHTML+`
                <div onclick="handlelist(this)" id="lister" class="flex">
                    <div class="card flex">
                        <img style="height:300px" class="cardimg" src=${imglist[ind]} alt="GTA">
                        <h class="title">${albumlist[ind]}</h>
                        <p>${desc[ind]}</p>
                        <img class="playbtn " src="data/play.svg" alt="Play">
                    </div>
                </div>`
                return
    })
}
folder()
const handlelist=(e)=>{
    albumset=e.getElementsByTagName("h")[0].innerHTML;
    document.querySelector(".songlist").getElementsByTagName("ol")[0].innerHTML=null
    getsongs()
    main()
    console.log(e.getElementsByTagName("h")[0].innerHTML)
}

const playmusic=async (track)=>{
    let songs = await getsongs();
    let arra=songs.map((song)=>{
        let temp=song.split("/")
        if(track===temp[temp.length-1].replaceAll("%20"," ")){
            return song
        }
    })
    let arra2=arra.filter((song)=>{
        return song!=undefined
    })
    currentsong.src=arra2[0]
    currentsong.pause()
    document.getElementById("play").src="data/play2.svg";
    document.querySelector(".btu").getElementsByTagName("h")[0].innerHTML=track.split("/")[0];       
}
currentsong.volume=0.25;

async function main() {
    let songs = await getsongs();
    if(songs.length!=0){
        currentsong.src=`/albums/${albumset}`+songs[0].split(`/albums/${albumset}`)[1].replaceAll("%20", " ");
        document.querySelector(".btu").getElementsByTagName("h")[0].innerHTML=songs[0].split(`/albums/${albumset}`)[1].replaceAll("%20", " ").split("/")[1];   
    }
    let doc = document.querySelector(".songlist").getElementsByTagName("ol")[0];
 
    if(songs.length==0){
        doc.innerHTML="<li>EMPTY</li>"
    }
    else{
        for (const song of songs) { 
            doc.innerHTML = doc.innerHTML + `<li>
            <img src="data/music.svg" alt="Music">
            <h>${song.split(`/albums/${albumset}`)[1].replaceAll("%20", " ").split("/")[1]}</h>
            <img src="data/play4.svg" alt="Play">
            </li>`;
        }
    }
    let e=document.querySelector("ol").getElementsByTagName("li");
    console.log(e)

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
            playmusic(songs[index].split(`/albums/${albumset}`)[1].replaceAll("%20", " "));
        }
    })
    document.getElementById("next").addEventListener("click",()=>{
        let index=songs.indexOf(currentsong.src);
        if(index!=songs.length-1){
            currentsong.src=songs[++index];
            playmusic(songs[index].split(`/albums/${albumset}`)[1].replaceAll("%20", " "));
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
