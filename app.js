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



// ===== PASES FIJOS POR LINK (token) =====
(() => {
  const btnPases = document.getElementById("btnPases");
  const screenPases = document.getElementById("pases");
  const backToInvite = document.getElementById("backToInvite");

  const pasesTxt = document.getElementById("pasesTxt");
  const pasesTxt2 = document.getElementById("pasesTxt2");

  if (!btnPases || !screenPases || !backToInvite || !pasesTxt || !pasesTxt2) {
    console.log("Faltan elementos de Pases. Revisa IDs en el HTML.");
    return;
  }

  // 1) Mapa de tokens -> {adultos, ninos}
  const PASES = {
    R01: { adultos: 2, ninos: 0 },
    R02: { adultos: 3, ninos: 1 },
    R03: { adultos: 1, ninos: 2 },
    R04: { adultos: 2, ninos: 0 },
    R05: { adultos: 3, ninos: 0 },
    R06: { adultos: 2, ninos: 2 },
    R07: { adultos: 2, ninos: 1 },
    R08: { adultos: 3, ninos: 0 },
    R09: { adultos: 3, ninos: 0 },
    R10: { adultos: 2, ninos: 1 },
    R11: { adultos: 1, ninos: 0 },
    R12: { adultos: 3, ninos: 0 },
    R13: { adultos: 3, ninos: 2 },
    R14: { adultos: 2, ninos: 2 },
    R15: { adultos: 3, ninos: 1 },
    R16: { adultos: 2, ninos: 1 },
    R17: { adultos: 3, ninos: 2 },
    R18: { adultos: 5, ninos: 0 },
    R19: { adultos: 1, ninos: 0 },
    R20: { adultos: 2, ninos: 0 },
    R21: { adultos: 1, ninos: 0 },
    R22: { adultos: 2, ninos: 1 },
    R23: { adultos: 2, ninos: 3 },
    R24: { adultos: 3, ninos: 1 },
    R25: { adultos: 2, ninos: 1 },
    R26: { adultos: 2, ninos: 0 },
    R27: { adultos: 2, ninos: 0 },
    R28: { adultos: 2, ninos: 1 },
    R29: { adultos: 2, ninos: 1 }, // el que venía como "2PASES 1 NIÑO"
    R30: { adultos: 2, ninos: 2 },
    R31: { adultos: 1, ninos: 1 },
    R32: { adultos: 3, ninos: 0 },
    R33: { adultos: 2, ninos: 1 },
    R34: { adultos: 2, ninos: 2 },
    R35: { adultos: 2, ninos: 3 },
    R36: { adultos: 2, ninos: 1 },
    R37: { adultos: 1, ninos: 0 },
    R38: { adultos: 1, ninos: 0 },
    R39: { adultos: 2, ninos: 1 },
    R40: { adultos: 2, ninos: 0 },
    R41: { adultos: 2, ninos: 0 },
  };

  // 2) Leer token ?t=Rxx
  const params = new URLSearchParams(window.location.search);
  const token = (params.get("t") || "").toUpperCase();

  function getAsignacion() {
    const data = PASES[token];
    if (!data) return null;
    // Seguridad: máximo 8 en total
    const total = data.adultos + data.ninos;
    if (total > 8) return { ...data, total: 8 }; // (si algún día te pasas)
    return { ...data, total };
  }

  function showPasesScreen() {
    invite.classList.remove("screen--active");
    screenPases.classList.add("screen--active");
  }

  btnPases.addEventListener("click", () => {
    const asignacion = getAsignacion();
    if (!asignacion) {
      // Si el link no trae token válido
      pasesTxt.textContent = "Link no válido o sin token.";
      pasesTxt2.textContent = "Pide tu enlace correcto.";
      showPasesScreen();
      return;
    }

    pasesTxt.textContent = `Adultos: ${asignacion.adultos}`;
    pasesTxt2.textContent = `Niños: ${asignacion.ninos}`;
    showPasesScreen();
  });

  backToInvite.addEventListener("click", () => {
    screenPases.classList.remove("screen--active");
    invite.classList.add("screen--active");
  });
})();


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




