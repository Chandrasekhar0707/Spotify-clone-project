//  Let's Write JavaScript

let currentSong = new Audio();
let songs;
let currFolder;
let activeCard = null;
let activeLibraryItem = null;
let allFolders = [];
let currentFolderIndex = 0;
let currentTrackIndex = -1;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`
}




















// async function getSongs(folder) {
//     currFolder = folder;
//     let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
//     let response = await a.text()
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a")
//     songs = []
//     for (let index = 0; index < as.length; index++) {
//         const element = as[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href.split(`/${folder}/`)[1])
//         }

//     }



//     // Show all the songs in the playlist
//     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
//     const noSongsMessage = document.querySelector(".noSongsMessage")
//     songUL.innerHTML = ""
//     for (const song of songs) {
//         songUL.innerHTML = songUL.innerHTML + `<li data-track="${song}"><img class = "invert" width = "34" src = "img/music.svg" altv = "">
//         <div class = "info">
//             <div> ${song.replaceAll("%20", " ")}</div>
//         </div>
//         <div class = "playnow">
//             <span> Play Now </span>
//             <img class = "invert library-play" src = "img/play.svg" alt = "">
//         </div>
//         </li>`;
//     }
//     if (noSongsMessage) {
//         noSongsMessage.style.display = songs.length > 0 ? 'none' : 'block'
//     }

//     // Attach event listeners to each song item and its play button
//     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
//         // click on entire item -> play that track
//         e.addEventListener("click", element => {
//             const track = e.dataset.track
//             playMusic(track)
//             setActiveLibraryItem(e)
//         })

//         // click on small play button -> toggle play/pause for that track
//         const playBtn = e.querySelector('.library-play')
//         if (playBtn) {
//             playBtn.addEventListener('click', ev => {
//                 ev.stopPropagation()
//                 const track = e.dataset.track
//                 // if this is the current playing track
//                 if (currentSong.src.endsWith(track)) {
//                     if (currentSong.paused) {
//                         currentSong.play()
//                         play.src = 'img/pause.svg'
//                         setActiveLibraryItem(e)
//                     } else {
//                         currentSong.pause()
//                         play.src = 'img/play.svg'
//                         // reset icon for this item
//                         playBtn.src = 'img/play.svg'
//                         activeLibraryItem = null
//                     }
//                 } else {
//                     // start playing this new track
//                     playMusic(track)
//                     setActiveLibraryItem(e)
//                 }
//             })
//         }
//     })

//     return songs

// }



// REPLACING GPT

async function getSongs(folder) {
    currFolder = folder;

    // Load songs from info.json
    let response = await fetch(`/${folder}/info.json`);
    let info = await response.json();

    songs = info.songs || [];

    // Show all songs in the library
    let songUL = document.querySelector(".songList ul");
    const noSongsMessage = document.querySelector(".noSongsMessage");

    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
        <li data-track="${song}">
            <img class="invert" width="34" src="img/music.svg" alt="">
            <div class="info">
                <div>${song}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert library-play" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    if (noSongsMessage) {
        noSongsMessage.style.display = songs.length > 0 ? "none" : "block";
    }

    // Attach click events
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const track = e.dataset.track;
            playMusic(track);
            setActiveLibraryItem(e);
        });
    });

    return songs;
}

















const playMusic = (track, pause = false) => {
    if (track) {
        currentSong.src = `/${currFolder}/` + track
        currentTrackIndex = Array.isArray(songs) ? songs.indexOf(track) : -1
    } else {
        currentSong.src = ''
        currentTrackIndex = -1
    }

    if (!pause && track) {
        currentSong.play()
    }

    const isPlaying = !!track && !pause && !currentSong.paused
    const playBtn = document.getElementById('play')
    if (playBtn) {
        playBtn.src = isPlaying ? 'img/pause.svg' : 'img/play.svg'
    }

    if (activeCard) {
        const img = activeCard.querySelector('.card-play')
        if (img) img.src = isPlaying ? 'img/pause.svg' : 'img/card-play.svg'
    }

    const libItem = Array.from(document.querySelectorAll('.songList li')).find(li => li.dataset.track === track)
    if (libItem) {
        setActiveLibraryItem(libItem, isPlaying)
    } else if (!track) {
        setActiveLibraryItem(null)
    }

    document.querySelector('.songinfo').innerHTML = track ? decodeURI(track) : ''
    document.querySelector('.songtime').innerHTML = '00:00 / 00:00'
}

function setActiveLibraryItem(li, isPlaying = false) {
    if (activeLibraryItem && activeLibraryItem !== li) {
        const prevImg = activeLibraryItem.querySelector('.library-play')
        if (prevImg) prevImg.src = 'img/play.svg'
    }
    if (!li) {
        activeLibraryItem = null
        return
    }
    activeLibraryItem = li
    const img = li.querySelector('.library-play')
    if (img) img.src = isPlaying ? 'img/pause.svg' : 'img/play.svg'
}

const openHamburgerMenu = () => {
    const left = document.querySelector(".left")
    const library = document.querySelector(".library")

    if (window.innerWidth <= 1200) {
        if (left) left.style.left = "0"

        if (library) {
            library.classList.add("mobile-open")
            const songList = library.querySelector(".songList")
            if (songList) {
                songList.style.display = "block"
                library.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        }
    }
}



































// async function displayAlbums() {
//     let a = await fetch(`http://127.0.0.1:5500/songs/`)
//     // let response = await fetch(`/songs/index.json`); // replace
//     // let folders = await response.json(); // replace

//     let response = await a.text()
//     let div = document.createElement("div")
//     div.innerHTML = response;
//     let anchors = div.getElementsByTagName("a")

//     let cardContainer = document.querySelector(".cardContainer")

//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];


//         if (e.href.includes("/songs/")) {
//             let folder = e.href.split("/").slice(-2)[1]
//             allFolders.push(folder)

//             // Get meta data of the folder
//             let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
//             let response = await a.json();
//             console.log(response)

//             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
//                             <div class="play">
//                                 <img class="card-play" width="34" src="img/card-play.svg" alt="">
//                             </div>
//                             <img
//                                 src="/songs/${folder}/cover.jpg"
//                                 alt="" />
//                             <h2>${response.title}</h2>
//                             <p>${response.description}</p>
//                         </div>
// `
//         }

//     }
//     Array.from(document.getElementsByClassName("card")).forEach((e, index) => {
//         e.addEventListener("click", async () => {

//             const folder = e.dataset.folder;

//             songs = await getSongs(`songs/${folder}`);

//             console.log(songs);
//             playMusic(songs[0]);

//             setActiveCard(e);

//             currentFolderIndex = allFolders.indexOf(folder);

//             openHamburgerMenu();

//         });
//     })
// }


// REPLACING GPT
async function displayAlbums() {
    allFolders = [];

    // Load folder list from index.json
    let response = await fetch(`/songs/index.json`);
    let folders = await response.json();

    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    for (const folder of folders) {
        allFolders.push(folder);

        // Load playlist info
        let res = await fetch(`/songs/${folder}/info.json`);
        let info = await res.json();

        cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
            <div class="play">
                <img class="card-play" width="34" src="img/card-play.svg" alt="">
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="" />
            <h2>${info.title}</h2>
            <p>${info.description}</p>
        </div>`;
    }

    // Card click events
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async () => {
            const folder = e.dataset.folder;

            songs = await getSongs(`songs/${folder}`);

            if (songs.length > 0) {
                playMusic(songs[0]);
            }

            setActiveCard(e);
            currentFolderIndex = allFolders.indexOf(folder);
            openHamburgerMenu();
        });
    });
}











function setActiveCard(card) {
    if (!card) return
    // reset previous card icon
    if (activeCard && activeCard !== card) {
        const prevImg = activeCard.querySelector('.card-play')
        if (prevImg) prevImg.src = 'img/card-play.svg'
    }
    activeCard = card
    const img = card.querySelector('.card-play')
    if (img) img.src = 'img/pause.svg'
}


async function main() {
    // Display all the albums on the page and build playlist cards first
    await displayAlbums()

    // Load the first available playlist folder on refresh
    if (allFolders.length > 0) {
        const initialFolder = allFolders[0]
        await getSongs(`songs/${initialFolder}`)
        if (Array.isArray(songs) && songs.length > 0) {
            playMusic(songs[0], true)
            currentFolderIndex = 0
            const firstCard = document.querySelector(`[data-folder="${initialFolder}"]`)
            if (firstCard) {
                setActiveCard(firstCard)
                firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        }
    }

    // listin for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // when a track ends, advance to next; if it was the last, restart from first
    currentSong.addEventListener('ended', () => {
        if (!Array.isArray(songs) || songs.length === 0) return;
        const currentTrack = currentSong.src.split('/').slice(-1)[0];
        const index = songs.indexOf(currentTrack);
        if (index >= 0 && (index + 1) < songs.length) {
            playMusic(songs[index + 1])
        } else {
            console.log(songs);
            playMusic(songs[0])
        }
    })

    // Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listner for Hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add an event listner for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })

    // Home button: navigate to site root on desktop, reload on mobile
    const homeBtn = document.getElementById('homeBtn')
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            if (window.innerWidth <= 1200) {
                // on mobile, refresh the page
                location.reload()
            } else {
                // on desktop, navigate to site root
                location.href = '/'
            }
        })
    }

    const searchBtn = document.getElementById('searchBtn')
    const searchRow = document.querySelector('.search-row')
    const searchInput = document.getElementById('searchInput')

    function filterLibrary(searchTerm) {
        const normalized = String(searchTerm || '').trim().toLowerCase()
        const songItems = document.querySelectorAll('.songList li')
        const cardItems = document.querySelectorAll('.cardContainer .card')
        const noSongsMessage = document.querySelector('.noSongsMessage')

        // if empty search, reset all visibility
        if (!normalized) {
            songItems.forEach(li => li.style.display = '')
            cardItems.forEach(card => card.style.display = '')
            if (noSongsMessage) noSongsMessage.style.display = 'none'
            return
        }

        let foundInSongs = false
        let foundInCards = false

        songItems.forEach(li => {
            const title = decodeURI(li.dataset.track || '').replaceAll('%20', ' ').toLowerCase()
            const visible = title.includes(normalized)
            li.style.display = visible ? '' : 'none'
            if (visible) foundInSongs = true
        })

        cardItems.forEach(card => {
            const folder = (card.dataset.folder || '').toLowerCase()
            const title = (card.querySelector('h2')?.textContent || '').toLowerCase()
            const visible = folder.includes(normalized) || title.includes(normalized)
            card.style.display = visible ? '' : 'none'
            if (visible) foundInCards = true
        })

        // show/hide library "no songs" message based on library results only
        if (noSongsMessage) {
            noSongsMessage.style.display = foundInSongs ? 'none' : 'block'
        }

        // ensure playlists (cards) also show a no-results message when none match
        const cardContainer = document.querySelector('.cardContainer')
        if (cardContainer) {
            let playlistMsg = cardContainer.querySelector('.noPlaylistsMessage')
            if (!playlistMsg) {
                playlistMsg = document.createElement('div')
                playlistMsg.className = 'noPlaylistsMessage'
                // use same text as library no-songs message if available
                playlistMsg.textContent = noSongsMessage ? noSongsMessage.textContent || 'No song Found' : 'No song Found'
                playlistMsg.style.display = 'none'
                playlistMsg.style.padding = '16px'
                playlistMsg.style.color = '#666'
                cardContainer.appendChild(playlistMsg)
            }
            playlistMsg.style.display = foundInCards ? 'none' : 'block'
        }
    }

    if (searchBtn && searchRow && searchInput) {
        searchBtn.addEventListener('click', () => {
            const isVisible = !searchRow.classList.toggle('hidden')
            if (isVisible) {
                searchInput.focus()
            } else {
                searchInput.value = ''
                filterLibrary('')
            }
        })



        // unified input handler: search both your library and playlists
        searchInput.addEventListener('input', () => {
            filterLibrary(searchInput.value)
        })
    }

    const volumeIcon = document.querySelector(".volume > img");
    const volumeRange = document.querySelector(".range input");

    function updateVolumeIcon(value) {
        if (value > 0) {
            volumeIcon.src = "img/volume.svg";
            currentSong.muted = false;
        } else {
            volumeIcon.src = "img/mute.svg";
            currentSong.muted = true;
        }
    }

    function setVolume(value) {
        const volume = Number(value);
        currentSong.volume = Math.min(Math.max(volume, 0), 100) / 100;
        volumeRange.value = volume;
        updateVolumeIcon(volume);
    }

    volumeRange.addEventListener("input", (e) => {
        console.log("Setting vol to", e.target.value, "/ 100");
        setVolume(e.target.value);
    });

    volumeRange.addEventListener("change", (e) => {
        setVolume(e.target.value);
    });

    volumeIcon.addEventListener("click", () => {
        if (Number(volumeRange.value) > 0) {
            setVolume(0);
        } else {
            setVolume(10);
        }
    });

    // Add event listeners for left and right navigation arrows
    const prevBtn = document.getElementById('prevBtn')
    const nextBtn = document.getElementById('nextBtn')

    const navigatePlaylist = async (direction) => {
        if (allFolders.length === 0) return

        // Update the index based on direction
        if (direction === 'next') {
            currentFolderIndex = (currentFolderIndex + 1) % allFolders.length
        } else if (direction === 'prev') {
            currentFolderIndex = (currentFolderIndex - 1 + allFolders.length) % allFolders.length
        }

        // Get the card element for the new folder
        const folder = allFolders[currentFolderIndex]
        const card = document.querySelector(`[data-folder="${folder}"]`)

        if (card) {
            // Trigger click on the card
            card.click()
            setActiveCard(card)
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigatePlaylist('prev')
        })
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigatePlaylist('next')
        })
    }

    const playBtn = document.getElementById('play')
    const previousBtn = document.getElementById('previous')
    const nextTrackBtn = document.getElementById('next')

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            if (currentSong.paused) {
                currentSong.play()
                playBtn.src = 'img/pause.svg'
                if (activeCard) {
                    const img = activeCard.querySelector('.card-play')
                    if (img) img.src = 'img/pause.svg'
                }
                if (activeLibraryItem) {
                    setActiveLibraryItem(activeLibraryItem, true)
                }
            } else {
                currentSong.pause()
                playBtn.src = 'img/play.svg'
                if (activeCard) {
                    const img = activeCard.querySelector('.card-play')
                    if (img) img.src = 'img/card-play.svg'
                }
                if (activeLibraryItem) {
                    setActiveLibraryItem(activeLibraryItem, false)
                }
            }
        })
    }

    if (previousBtn) {
        previousBtn.addEventListener('click', () => {
            if (!Array.isArray(songs) || songs.length === 0) return
            currentTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : songs.length - 1
            playMusic(songs[currentTrackIndex])
        })
    }

    if (nextTrackBtn) {
        nextTrackBtn.addEventListener('click', () => {
            if (!Array.isArray(songs) || songs.length === 0) return
            currentTrackIndex = currentTrackIndex < songs.length - 1 ? currentTrackIndex + 1 : 0
            playMusic(songs[currentTrackIndex])
        })
    }
}
main()