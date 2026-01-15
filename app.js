const intro = document.getElementById("intro");
const invite = document.getElementById("invite");

const envelopeBtn = document.getElementById("envelopeBtn");
const envelopeImg = document.getElementById("envelopeImg");
const backBtn = document.getElementById("backBtn");

const bgm = document.getElementById("bgm");

function startMusic() {
  if (!bgm) return;
  bgm.loop = true;
  bgm.volume = 0.6;
  bgm.play().catch(() => {});
}

// Arranca en el primer toque/click real del usuario
const armMusic = () => startMusic();
window.addEventListener("pointerdown", armMusic, { once: true });
window.addEventListener("touchstart", armMusic, { once: true });
window.addEventListener("click", armMusic, { once: true });


startMusic();
// ===== MÚSICA AUTOMÁTICA =====
function startMusic() {
  bgm.volume = 0.6; // ajusta volumen si quieres (0.0 a 1.0)
  bgm.play().catch(() => {
    // Algunos móviles bloquean autoplay hasta interacción
  });
}




// ===== MOSTRAR / OCULTAR INVITACIÓN =====
function showInvite() {
  intro.classList.remove("screen--active");
  invite.classList.add("screen--active");

  playInviteVideoLoop(); // 👈 ESTA ES LA CLAVE
}

function showIntro() {
  invite.classList.remove("screen--active");
  intro.classList.add("screen--active");
}


// ===== VIDEO INTRO =====
const videoIntro = document.getElementById("videoIntro");
const introVideo = document.getElementById("introVideo");
const skipVideo = document.getElementById("skipVideo");

function openVideoIntro() {
  videoIntro.classList.add("videoIntro--open");
  videoIntro.setAttribute("aria-hidden", "false");
  introVideo.currentTime = 0;

  setTimeout(() => {
    introVideo.play().catch(() => {});
  }, 180);
}

function closeVideoIntroAndShowInvite() {
  // 1) Deja la INVITACIÓN activa debajo (para que no se vea el sobre)
  showInvite();

  // 2) Desvanece el overlay del video
  introVideo.pause();
  videoIntro.classList.remove("videoIntro--open");
  videoIntro.setAttribute("aria-hidden", "true");

  // 3) Limpieza final (opcional)
  setTimeout(() => {
    introVideo.currentTime = 0;
  }, 450);
}


skipVideo.addEventListener("click", () => {
  closeVideoIntroAndShowInvite();
});

introVideo.addEventListener("ended", () => {
  closeVideoIntroAndShowInvite();
});

// ===== SOBRE =====
envelopeBtn.addEventListener("click", async () => {
  envelopeImg.src = "sobre-abierto.png";
  envelopeBtn.disabled = true;

  await new Promise(r => setTimeout(r, 600));
  openVideoIntro();

  envelopeBtn.disabled = false;
});

// ===== VOLVER =====
backBtn.addEventListener("click", () => {
  envelopeImg.src = "sobre-cerrado.png";
  showIntro();
});


const inviteVideo = document.getElementById("inviteVideo");

function playInviteVideoLoop() {
  if (!inviteVideo) return;
  inviteVideo.loop = true;
  inviteVideo.currentTime = 0;
  inviteVideo.play().catch(() => {});
}



// ===== PASES / MENÚ =====
(() => {
  const btnPases = document.getElementById("btnPases");
  const modalPases = document.getElementById("modalPases");
  const pasesBackdrop = document.getElementById("pasesBackdrop");
  const closePases = document.getElementById("closePases");
  const confirmPases = document.getElementById("confirmPases");
  const pasesSelect = document.getElementById("pasesSelect");

  const screenPases = document.getElementById("pases");
  const backToInvite = document.getElementById("backToInvite");
  const pasesTxt = document.getElementById("pasesTxt");

  // Si falta algo, avisamos en consola
  if (!btnPases || !modalPases || !pasesBackdrop || !closePases || !confirmPases || !pasesSelect || !screenPases || !backToInvite || !pasesTxt) {
    console.log("Faltan elementos de Pases. Revisa IDs en el HTML.");
    return;
  }

  // Abrir modal
  btnPases.addEventListener("click", () => {
    modalPases.classList.add("modal--open");
  });

  // Cerrar modal
  function closeModalPases() {
    modalPases.classList.remove("modal--open");
  }
  closePases.addEventListener("click", closeModalPases);
  pasesBackdrop.addEventListener("click", closeModalPases);

  // Mostrar pantalla de Pases (oculta invitación)
  function showPasesScreen() {
    invite.classList.remove("screen--active");
    screenPases.classList.add("screen--active");
  }

  // Volver a la invitación
  backToInvite.addEventListener("click", () => {
    screenPases.classList.remove("screen--active");
    invite.classList.add("screen--active");
  });

  // Confirmar selección
  confirmPases.addEventListener("click", () => {
    let n = parseInt(pasesSelect.value, 10);
    if (isNaN(n) || n < 1) n = 1;
    if (n > 8) n = 8;

    pasesTxt.textContent = `Tienes ${n} pase${n === 1 ? "" : "s"}`;
    closeModalPases();
    showPasesScreen();
  });
})();



