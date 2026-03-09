// ===== Elements =====
var audio = document.getElementById("pupAudio");
var playPauseBtn = document.getElementById("playPauseBtn");
var playIcon = document.getElementById("playIcon");
var loopBtn = document.getElementById("loopBtn");
var karaokeBtn = document.getElementById("karaokeBtn");
var volumeSlider = document.getElementById("volumeSlider");
var volIcon = document.getElementById("volIcon");
var progressBar = document.getElementById("progressBar");
var progressFill = document.getElementById("progressFill");
var currentTimeEl = document.getElementById("currentTime");
var totalTimeEl = document.getElementById("totalTime");
var lyricBox = document.getElementById("lyricBox");
var lines = lyricBox.querySelectorAll("p");
var vinyl = document.querySelector(".plate .black");

// ===== Play / Pause =====
playPauseBtn.addEventListener("click", function () {
  if (audio.paused) {
    audio.play();
    playIcon.className = "fa-solid fa-pause";
    vinyl.style.animationPlayState = "running";
  } else {
    audio.pause();
    playIcon.className = "fa-solid fa-play";
    vinyl.style.animationPlayState = "paused";
  }
});

// ===== Loop Toggle =====
loopBtn.addEventListener("click", function () {
  audio.loop = !audio.loop;
  loopBtn.classList.toggle("active");
});

// ===== Volume =====
var savedVolume = 1;

volumeSlider.addEventListener("input", function () {
  audio.volume = this.value;
  if (this.value == 0) {
    audio.muted = true;
    volIcon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else {
    audio.muted = false;
    savedVolume = this.value;
    volIcon.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }
});

volIcon.addEventListener("click", function () {
  if (!audio.muted) {
    savedVolume = audio.volume;
    audio.muted = true;
    volumeSlider.value = 0;
    volIcon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else {
    audio.muted = false;
    audio.volume = savedVolume;
    volumeSlider.value = savedVolume;
    volIcon.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }
});

// ===== Progress Bar =====
audio.addEventListener("timeupdate", function () {
  if (audio.duration) {
    // Update progress bar width
    var percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + "%";

    // Update current time display
    currentTimeEl.textContent = formatTime(audio.currentTime);

    // ===== LYRICS HIGHLIGHT =====
    // Go through each lyric line
    for (var i = 0; i < lines.length; i++) {
      // Get the time from data-time attribute
      var lineTime = parseFloat(lines[i].getAttribute("data-time"));
      // Get the next line's time (or end of song)
      var nextTime;
      if (i + 1 < lines.length) {
        nextTime = parseFloat(lines[i + 1].getAttribute("data-time"));
      } else {
        nextTime = audio.duration;
      }

      // If current time is between this line and next line, highlight it
      if (audio.currentTime >= lineTime && audio.currentTime < nextTime) {
        lines[i].classList.add("active");
        // Scroll the active line into view
        lines[i].scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        lines[i].classList.remove("active");
      }
    }
  }
});

// ===== Total Time =====
audio.addEventListener("loadedmetadata", function () {
  totalTimeEl.textContent = formatTime(audio.duration);
});

// ===== Click to Seek =====
progressBar.addEventListener("click", function (e) {
  var rect = this.getBoundingClientRect();
  var percent = (e.clientX - rect.left) / rect.width;
  audio.currentTime = percent * audio.duration;
});

// ===== Reset on End =====
audio.addEventListener("ended", function () {
  playIcon.className = "fa-solid fa-play";
  vinyl.style.animationPlayState = "paused";
});

// ===== Format Time (seconds to m:ss) =====
function formatTime(sec) {
  var m = Math.floor(sec / 60);
  var s = Math.floor(sec % 60);
  return m + ":" + (s < 10 ? "0" : "") + s;
}

// ===== Karaoke Toggle (switch to backing track) =====
karaokeBtn.addEventListener("click", function () {
  var wasPlaying = !audio.paused;
  var currentTime = audio.currentTime;

  if (!karaokeBtn.classList.contains("active")) {
    // Switch to backing track
    audio.src = "/assets/mp3/imno_ng_pup_backing_track.mp3";
  } else {
    // Switch back to original
    audio.src = "/assets/mp3/imno_ng_pup.mp3";
  }

  karaokeBtn.classList.toggle("active");

  // Keep the same position and play state
  audio.addEventListener("loadedmetadata", function onLoad() {
    audio.currentTime = currentTime;
    if (wasPlaying) {
      audio.play();
    }
    audio.removeEventListener("loadedmetadata", onLoad);
  });
});