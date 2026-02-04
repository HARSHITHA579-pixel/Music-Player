 const songs = [
            {
                id: 1,
                title: "End Of Beginning",
                file:"songs/Djo-End Of Beginning.mp3",
                artist: "Djo",
                duration: "2:39",
                cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"
            },
            {
                id: 2,
                title: "Adore You",
                file:"songs/Harry Styles - Adore You.mp3",
                artist: "Harry Style",
                duration: "3:38",
                cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop"
            },
            {
                id: 3,
                title: "Night Changes",
                file:"songs/One Direction - Night Changes.mp3",
                artist: "One Direction",
                duration: "4:00",
                cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop"
            },
            {
                id: 4,
                title: "APT",
                file:"songs/ROSE & Bruno Mars - APT..mp3",
                artist: "Rose & Bruno",
                duration: "2:53",
                cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop"
            },
            {
                id: 5,
                title: "Shararath",
                file:" Shararat  Dhurandar.mp3",
                artist: "Durandar",
                duration: "3:49",
                cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop"
            },
            {
                id: 6,
                title: "The Fate of Ophelia",
                file:" Taylor Swift - The Fate of Ophelia.mp3",
                artist: "Tailor Swift",
                duration: "3:58",
                cover: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop"
            }
        ];

        let currentSongIndex = 0;
        let isPlaying = false;

        const audioPlayer = document.getElementById('audioPlayer');
        const playBtn = document.getElementById('playBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const progressBar = document.getElementById('progressBar');
        const volumeBar = document.getElementById('volumeBar');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        const currentCover = document.getElementById('currentCover');
        const currentTitle = document.getElementById('currentTitle');
        const currentArtist = document.getElementById('currentArtist');
        const searchInput = document.getElementById('searchInput');
        const songGrid = document.getElementById('songGrid');

        function init() {
            renderSongs();
            loadSong(0);
            setupEventListeners();
            volumeBar.value = 70;
            audioPlayer.volume = 0.7;
        }

        function renderSongs() {
            songGrid.innerHTML = songs.map((song, index) => `
                <div class="song-card" data-index="${index}">
                    <div class="song-cover">
                        <img src="${song.cover}" alt="${song.title}">
                        <div class="play-overlay">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                        </div>
                    </div>
                    <div class="song-info">
                        <h3>${song.title}</h3>
                        <p>${song.artist}</p>
                        <span class="duration">${song.duration}</span>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.song-card').forEach(card => {
                card.addEventListener('click', () => {
                    const index = parseInt(card.dataset.index);
                    loadSong(index);
                    playSong();
                });
            });
        }

        function loadSong(index) {
            currentSongIndex = index;
            const song = songs[index];
            audioPlayer.src = song.file; 
            currentTitle.textContent = song.title;
            currentArtist.textContent = song.artist;
            currentCover.src = song.cover;
            durationEl.textContent = song.duration;
            
            document.querySelectorAll('.song-card').forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });
        }

        function togglePlayPause() {
            isPlaying ? pauseSong() : playSong();
        }

        function playSong() {
            audioPlayer.play();
            isPlaying = true;
            playBtn.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
            `;
        }

        function pauseSong() {
            audioPlayer.pause();
            isPlaying = false;
            playBtn.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
            `;
        }

        function nextSong() {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            loadSong(currentSongIndex);
            if (isPlaying) playSong();
        }

        function prevSong() {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            loadSong(currentSongIndex);
            if (isPlaying) playSong();
        }

        function updateProgress() {
            const { currentTime, duration } = audioPlayer;
            if (duration) {
                progressBar.value = (currentTime / duration) * 100;
                currentTimeEl.textContent = formatTime(currentTime);
                if (!isNaN(duration)) durationEl.textContent = formatTime(duration);
            }
        }

        function seekSong(e) {
            const seekTime = (e.target.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        }

        function formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        }

        function handleSearch(e) {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll('.song-card').forEach((card, index) => {
                const song = songs[index];
                const matches = song.title.toLowerCase().includes(query) || 
                               song.artist.toLowerCase().includes(query);
                card.style.display = matches || query === '' ? 'block' : 'none';
            });
        }

        function setupEventListeners() {
            playBtn.addEventListener('click', togglePlayPause);
            prevBtn.addEventListener('click', prevSong);
            nextBtn.addEventListener('click', nextSong);
            progressBar.addEventListener('input', seekSong);
            volumeBar.addEventListener('input', (e) => {
                audioPlayer.volume = e.target.value / 100;
            });
            audioPlayer.addEventListener('timeupdate', updateProgress);
            audioPlayer.addEventListener('ended', nextSong);
            searchInput.addEventListener('input', handleSearch);

            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                    e.preventDefault();
                    togglePlayPause();
                }
            });
        }

        init();