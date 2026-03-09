// ===== Modal: Listen Now / Close =====
var listenBtn = document.querySelector(".listen-btn");
var titleContent = document.querySelector(".title-content");
var musicPlayer = document.querySelector(".music-player");
var modalOverlay = document.getElementById("modalOverlay");
var closeModalBtn = document.getElementById("closeModalBtn");

listenBtn.addEventListener("click", function () {
  titleContent.classList.add("hidden");
  setTimeout(function () {
    titleContent.style.display = "none";
    musicPlayer.classList.add("active");
    modalOverlay.classList.add("active");
  }, 400);
});

closeModalBtn.addEventListener("click", function () {
  // Pause audio when closing
  audio.pause();
  playIcon.className = "fa-solid fa-play";
  vinyl.style.animationPlayState = "paused";

  musicPlayer.classList.remove("active");
  modalOverlay.classList.remove("active");
  titleContent.style.display = "";
  titleContent.classList.remove("hidden");
});

modalOverlay.addEventListener("click", function () {
  closeModalBtn.click();
});