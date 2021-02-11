// Take search input

var searchBox = document.querySelector("input");
var searchBtn = document.querySelector(".js-submit");

searchBtn.addEventListener('click', () => {
  SoundCloudAPI.searchTracks(searchBox.value);
});

searchBox.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    SoundCloudAPI.searchTracks(searchBox.value);
  }
});

// Query the API

let SoundCloudAPI = {}

SoundCloudAPI.init = () => {
  SC.initialize({
    client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
  });
};

SoundCloudAPI.searchTracks = (q) => {
  SC.get('/tracks', {
    q: q
  }).then(function (tracks) {
    // console.log(tracks);
    SoundCloudAPI.renderTracks(tracks);
  });
}

SoundCloudAPI.init();

// Display songs
SoundCloudAPI.renderTracks = (tracks) => {
  console.log(tracks);
  let searchResults = document.querySelector(".js-search-results");

  searchResults.innerHTML = "";

  tracks.forEach((track) => {

    let card = document.createElement("div");
    card.className = "card";

    let image = document.createElement("div");
    image.className = "image";

    let img = document.createElement("img");
    img.className = "image_img";
    img.src = track.artwork_url ?? "http://www.placekitten.com/290/290";

    let content = document.createElement("div");
    content.className = "content";

    let header = document.createElement("div");
    header.className = "header";

    let a = document.createElement("a");
    a.href = track.permalink_url;
    a.target = "_blank"
    a.innerText = track.title;

    let bottom = document.createElement("div");
    bottom.classList.add("ui", "bottom", "attached", "button", "js-button");

    let i = document.createElement("i");
    i.classList.add("add", "icon");

    let span = document.createElement("span");
    span.innerText = "Add to playlist";

    bottom.addEventListener("click", () => {
      playMusic(track.permalink_url);
    });

    image.appendChild(img);
    header.appendChild(a);
    content.appendChild(header);

    bottom.appendChild(i);
    bottom.appendChild(span);

    card.appendChild(image);
    card.appendChild(content);
    card.appendChild(bottom);

    searchResults.appendChild(card);
  });
};

// Play Music
function playMusic(link) {
  var track_url = link;
  SC.oEmbed(track_url, { auto_play: true }).then(function (oEmbed) {
    console.log('oEmbed response: ', oEmbed);
    var sidebar = document.querySelector(".inner");

    let box = document.createElement("div");
    box.innerHTML = oEmbed.html;

    sidebar.insertBefore(box, sidebar.firstChild);

    localStorage.setItem("playlist", sidebar.innerHTML);

  });
}

var sidebar = document.querySelector(".inner");

sidebar.innerHTML = localStorage.getItem("playlist");

// Clear button

let clearBtn = document.querySelector(".clear-btn");
clearBtn.addEventListener('click', () => {
  localStorage.clear();
  sidebar.innerHTML = "";
});