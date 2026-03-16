document.addEventListener("DOMContentLoaded", () => {
  const imageBoxes = document.querySelectorAll(".img-placeholder[data-character]");

  if (!imageBoxes.length) return;

  const lightbox = document.createElement("div");
  lightbox.className = "db-lightbox";
  lightbox.setAttribute("aria-hidden", "true");

  lightbox.innerHTML = `
    <div class="db-lightbox__content" role="dialog" aria-modal="true" aria-label="Character image viewer">
      <button class="db-lightbox__close" type="button" aria-label="Close image viewer">&times;</button>
      <div class="db-lightbox__figure"></div>
      <p class="db-lightbox__caption"></p>
    </div>
  `;

  document.body.appendChild(lightbox);

  const lightboxFigure = lightbox.querySelector(".db-lightbox__figure");
  const lightboxCaption = lightbox.querySelector(".db-lightbox__caption");
  const closeButton = lightbox.querySelector(".db-lightbox__close");

  let lastFocusedElement = null;

  function getCharacterName(element) {
    const card = element.closest(".profile");
    const heading = card ? card.querySelector("h3") : null;
    return heading ? heading.textContent.trim() : "Character";
  }

  function copyImageStyles(sourceElement) {
    const styles = window.getComputedStyle(sourceElement);

    lightboxFigure.style.backgroundImage = styles.backgroundImage;
    lightboxFigure.style.backgroundSize = "contain";
    lightboxFigure.style.backgroundRepeat = "no-repeat";
    lightboxFigure.style.backgroundPosition = "center center";
  }

  function openLightbox(element) {
    const characterName = getCharacterName(element);

    lastFocusedElement = element;
    copyImageStyles(element);
    lightboxCaption.textContent = characterName;

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxFigure.style.backgroundImage = "";
    lightboxCaption.textContent = "";
    document.body.style.overflow = "";

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  imageBoxes.forEach((box) => {
    const characterName = getCharacterName(box);

    box.setAttribute("role", "button");
    box.setAttribute("tabindex", "0");
    box.setAttribute("aria-label", `Open better view of ${characterName}`);
    box.setAttribute("title", `Click to view ${characterName}`);

    box.addEventListener("click", () => {
      openLightbox(box);
    });

    box.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(box);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});