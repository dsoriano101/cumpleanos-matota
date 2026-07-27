const TOTAL_FOTOS = 5;

const galleryImages = Array.from(
  { length: TOTAL_FOTOS },
  (_, index) => {
    const number = index + 1;
    const path = `images/foto_${number}.png`;

    return {
      src: path,
      download: path,
      title: `Recuerdo ${String(number).padStart(2, "0")}`,
      eyebrow: `Fotografía ${String(number).padStart(2, "0")}`,
      alt: `Fotografía ${number} de Diana`
    };
  }
);

const gallery = document.querySelector("#galeria");
const carousel = document.querySelector("#carousel");
const track = document.querySelector("#carouselTrack");
const dotsContainer = document.querySelector("#carouselDots");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const activeEyebrow = document.querySelector("#activeEyebrow");
const activeTitle = document.querySelector("#activeTitle");

let activeIndex = 0;
let autoplay;
let pointerStart = null;

function twoDigits(number) {
  return String(number).padStart(2, "0");
}

function circularOffset(index) {
  let offset = index - activeIndex;
  const middle = galleryImages.length / 2;

  if (offset > middle) {
    offset -= galleryImages.length;
  }

  if (offset < -middle) {
    offset += galleryImages.length;
  }

  return offset;
}

function createGallery() {
  galleryImages.forEach((image, index) => {
    const card = document.createElement("article");

    card.className = "photo-card";
    card.dataset.index = index;

    card.innerHTML = `
      <div class="photo-frame">

        <div class="image-fallback">
          <span>
            Foto ${twoDigits(index + 1)}
          </span>
        </div>

        <img
          src="${image.src}"
          alt="${image.alt}"
          draggable="false"
        >

        <div class="photo-shade"></div>

        <div class="card-topline">

          <span>
            ${image.eyebrow}
          </span>

          <span>
            ${twoDigits(index + 1)}
          </span>

        </div>

        <div class="card-caption">

          <div class="card-caption-text">

            <span>
              Un recuerdo para Diana
            </span>

            <h2>
              ${image.title}
            </h2>

          </div>

          <a
            class="download-button"
            href="${image.download}"
            download="recuerdo-diana-${index + 1}.png"
            aria-label="Descargar ${image.title}"
          >
            Descargar
          </a>

        </div>

      </div>
    `;

    const photo = card.querySelector("img");

    photo.addEventListener("error", () => {
      photo.remove();
    });

    card.addEventListener("click", event => {
      if (event.target.closest(".download-button")) {
        return;
      }

      goTo(index);
    });

    track.appendChild(card);

    const dot = document.createElement("button");

    dot.type = "button";

    dot.setAttribute(
      "aria-label",
      `Ver ${image.title}`
    );

    dot.addEventListener("click", () => {
      goTo(index);
    });

    dotsContainer.appendChild(dot);
  });

  updateGallery();
}

function updateGallery() {
  const cards = [
    ...track.querySelectorAll(".photo-card")
  ];

  const dots = [
    ...dotsContainer.querySelectorAll("button")
  ];

  cards.forEach((card, index) => {
    const offset = circularOffset(index);
    const distance = Math.abs(offset);
    const isVisible = distance <= 2;
    const isActive = offset === 0;

    card.style.setProperty("--offset", offset);
    card.style.setProperty("--distance", distance);

    card.dataset.visible = String(isVisible);

    card.classList.toggle(
      "is-active",
      isActive
    );

    card.setAttribute(
      "aria-hidden",
      String(!isActive)
    );
  });

  dots.forEach((dot, index) => {
    const isActive = index === activeIndex;

    dot.classList.toggle(
      "is-active",
      isActive
    );

    dot.toggleAttribute(
      "aria-current",
      isActive
    );
  });

  const currentImage = galleryImages[activeIndex];

  activeEyebrow.textContent =
    currentImage.eyebrow;

  activeTitle.textContent =
    currentImage.title;
}

function goTo(index) {
  activeIndex =
    (
      index +
      galleryImages.length
    ) %
    galleryImages.length;

  updateGallery();
}

function next() {
  goTo(activeIndex + 1);
}

function previous() {
  goTo(activeIndex - 1);
}

function startAutoplay() {
  stopAutoplay();

  autoplay = window.setInterval(
    next,
    5200
  );
}

function stopAutoplay() {
  window.clearInterval(autoplay);
}

previousButton.addEventListener(
  "click",
  previous
);

nextButton.addEventListener(
  "click",
  next
);

carousel.addEventListener(
  "mouseenter",
  stopAutoplay
);

carousel.addEventListener(
  "mouseleave",
  startAutoplay
);

carousel.addEventListener(
  "pointerdown",
  event => {
    pointerStart = event.clientX;

    carousel.setPointerCapture(
      event.pointerId
    );
  }
);

carousel.addEventListener(
  "pointerup",
  event => {
    if (pointerStart === null) {
      return;
    }

    const distance =
      event.clientX - pointerStart;

    if (Math.abs(distance) > 45) {
      if (distance < 0) {
        next();
      } else {
        previous();
      }
    }

    pointerStart = null;
  }
);

carousel.addEventListener(
  "pointercancel",
  () => {
    pointerStart = null;
  }
);

window.addEventListener(
  "keydown",
  event => {
    if (event.key === "ArrowRight") {
      next();
    }

    if (event.key === "ArrowLeft") {
      previous();
    }

    if (
      event.key === "Escape" &&
      tourIsActive
    ) {
      closeTour();
    }
  }
);

document.addEventListener(
  "visibilitychange",
  () => {
    if (document.hidden) {
      stopAutoplay();
    } else if (!tourIsActive) {
      startAutoplay();
    }
  }
);

const revealElements =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(
            entry.target
          );
        }
      });
    },
    {
      threshold: 0.12
    }
  );

revealElements.forEach(element => {
  revealObserver.observe(element);
});

const tourLayer =
  document.querySelector("#tourLayer");

const tourSpotlight =
  document.querySelector("#tourSpotlight");

const tourPopover =
  document.querySelector("#tourPopover");

const tourStepNumber =
  document.querySelector("#tourStepNumber");

const tourIcon =
  document.querySelector("#tourIcon");

const tourTitle =
  document.querySelector("#tourTitle");

const tourText =
  document.querySelector("#tourText");

const tourCloseButton =
  document.querySelector("#tourCloseButton");

const tourSkipButton =
  document.querySelector("#tourSkipButton");

const tourPreviousButton =
  document.querySelector("#tourPreviousButton");

const tourNextButton =
  document.querySelector("#tourNextButton");

const tourReplayButton =
  document.querySelector("#tourReplayButton");

const tourSteps = [
  {
    target: ".gallery-heading",
    icon: "✦",
    title: "Elige un recuerdo",
    text:
      "Esta es la galería de fotografías de Diana. Aquí podrás elegir el recuerdo que más te guste."
  },
  {
    target: ".photo-card.is-active",
    icon: "◎",
    title: "Observa la fotografía",
    text:
      "La fotografía iluminada en el centro es la que está seleccionada actualmente."
  },
  {
    target: ".arrow-right",
    icon: "→",
    title: "Explora el carrusel",
    text:
      "Utiliza las flechas o desliza la pantalla para recorrer las ocho fotografías."
  },
  {
    target:
      ".photo-card.is-active .download-button",
    icon: "↓",
    title: "Descarga tu elección",
    text:
      "Cuando encuentres tu fotografía, presiona Descargar para guardarla en tu dispositivo."
  },
  {
    target: null,
    icon: "✦",
    title: "Imprime y dedica",
    text:
      "Imprime la fotografía, escribe un bonito mensaje y entrégasela personalmente a Diana durante la celebración."
  }
];

let tourStepIndex = 0;
let tourIsActive = false;
let tourStartedAutomatically = false;

function getTourTarget() {
  const step = tourSteps[tourStepIndex];

  if (!step.target) {
    return null;
  }

  return document.querySelector(
    step.target
  );
}

function positionTourElements() {
  if (!tourIsActive) {
    return;
  }

  const target = getTourTarget();
  const step = tourSteps[tourStepIndex];

  tourStepNumber.textContent =
    `Paso ${tourStepIndex + 1} de ${tourSteps.length}`;

  tourIcon.textContent = step.icon;
  tourTitle.textContent = step.title;
  tourText.textContent = step.text;

  tourPreviousButton.disabled =
    tourStepIndex === 0;

  tourNextButton.textContent =
    tourStepIndex === tourSteps.length - 1
      ? "Entendido"
      : "Siguiente";

  if (!target) {
    tourSpotlight.classList.add(
      "is-hidden"
    );

    tourPopover.classList.add(
      "is-centered"
    );

    return;
  }

  tourSpotlight.classList.remove(
    "is-hidden"
  );

  tourPopover.classList.remove(
    "is-centered"
  );

  const rect =
    target.getBoundingClientRect();

  const padding = 10;

  tourSpotlight.style.top =
    `${rect.top - padding}px`;

  tourSpotlight.style.left =
    `${rect.left - padding}px`;

  tourSpotlight.style.width =
    `${rect.width + padding * 2}px`;

  tourSpotlight.style.height =
    `${rect.height + padding * 2}px`;

  const isMobile =
    window.innerWidth <= 640;

  const popoverWidth = Math.min(
    isMobile ? 330 : 370,
    window.innerWidth - 28
  );

  const estimatedHeight =
    isMobile ? 250 : 300;

  const gap =
    isMobile ? 14 : 22;

  let popoverTop =
    rect.bottom + gap;

  if (
    popoverTop +
    estimatedHeight >
    window.innerHeight
  ) {
    popoverTop =
      rect.top -
      estimatedHeight -
      gap;
  }

  popoverTop = Math.max(
    14,
    Math.min(
      popoverTop,
      window.innerHeight -
      estimatedHeight -
      14
    )
  );

  let popoverLeft =
    rect.left +
    rect.width / 2 -
    popoverWidth / 2;

  popoverLeft = Math.max(
    14,
    Math.min(
      popoverLeft,
      window.innerWidth -
      popoverWidth -
      14
    )
  );

  tourPopover.style.top =
    `${popoverTop}px`;

  tourPopover.style.left =
    `${popoverLeft}px`;
}

function showTourStep(index) {
  tourStepIndex = Math.max(
    0,
    Math.min(
      index,
      tourSteps.length - 1
    )
  );

  const target = getTourTarget();

  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    window.setTimeout(
      positionTourElements,
      550
    );
  } else {
    positionTourElements();
  }
}

function startTour() {
  stopAutoplay();

  tourStepIndex = 0;
  tourIsActive = true;

  tourLayer.classList.add(
    "is-active"
  );

  tourLayer.setAttribute(
    "aria-hidden",
    "false"
  );

  showTourStep(0);
}

function closeTour() {
  tourIsActive = false;

  tourLayer.classList.remove(
    "is-active"
  );

  tourLayer.setAttribute(
    "aria-hidden",
    "true"
  );

  startAutoplay();
}

tourNextButton.addEventListener(
  "click",
  () => {
    if (
      tourStepIndex ===
      tourSteps.length - 1
    ) {
      closeTour();
      return;
    }

    showTourStep(
      tourStepIndex + 1
    );
  }
);

tourPreviousButton.addEventListener(
  "click",
  () => {
    showTourStep(
      tourStepIndex - 1
    );
  }
);

tourCloseButton.addEventListener(
  "click",
  closeTour
);

tourSkipButton.addEventListener(
  "click",
  closeTour
);

tourReplayButton.addEventListener(
  "click",
  startTour
);

window.addEventListener(
  "resize",
  () => {
    if (tourIsActive) {
      positionTourElements();
    }
  }
);

const galleryTourObserver =
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (
          entry.isIntersecting &&
          !tourStartedAutomatically
        ) {
          tourStartedAutomatically = true;

          window.setTimeout(
            startTour,
            700
          );

          observer.disconnect();
        }
      });
    },
    {
      threshold: 0.32
    }
  );

createGallery();
startAutoplay();

galleryTourObserver.observe(gallery);
