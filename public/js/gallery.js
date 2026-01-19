document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/projects.json")
    .then((res) => res.json())
    .then((projects) => {
      const container = document.getElementById("projects-container");

      container.innerHTML = projects
        .map(
          (project) => `
          <article class="project" id="${project.id}"
            data-category="${project.categories.join(" ")}">
    
            <div class="project-gallery">
              <img class="project-main"
                src="${project.images[0]}"
                alt="${project.title}"
                loading="lazy" />
    
              <div class="project-thumbs">
                ${project.images
                  .map(
                    (img) => `
                  <img src="${img}" loading="lazy" />
                `
                  )
                  .join("")}
              </div>
            </div>
    
            <div class="project-info">
              <h3>${project.title}</h3>
              <ul>
                ${project.features.map((f) => `<li>${f}</li>`).join("")}
              </ul>
            </div>
          </article>
        `
        )
        .join("");
    })
    .then(() => {
      const lightbox = document.getElementById("lightbox");
      const lightboxImg = document.getElementById("lightbox-img");
      const counter = document.getElementById("lightbox-counter");
      const closeBtn = document.querySelector(".lightbox-close");

      if (!lightbox || !lightboxImg || !closeBtn) return;

      let images = [];
      let index = 0;
      let startX = 0;

      function openLightbox(imgs, i, projectId) {
        images = imgs;
        index = i;
        updateImage();
        lightbox.style.display = "flex";
        document.body.style.overflow = "hidden";
        if (projectId) location.hash = projectId;
      }

      function closeLightbox() {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
        history.pushState("", document.title, window.location.pathname);
      }

      function updateImage() {
        lightbox.classList.add("fade");
        setTimeout(() => {
          lightboxImg.src = images[index];
          counter.textContent = `${index + 1} / ${images.length}`;
          lightbox.classList.remove("fade");
        }, 120);
      }

      document.querySelectorAll(".project-main").forEach((main) => {
        main.addEventListener("click", () => {
          const project = main.closest(".project");
          const thumbs = project.querySelectorAll(".project-thumbs img");
          const imgs = Array.from(thumbs).map((i) => i.src);
          openLightbox(imgs, imgs.indexOf(main.src), project.id);
        });
      });

      document.querySelectorAll(".project-thumbs img").forEach((thumb) => {
        thumb.addEventListener("click", () => {
          const main = thumb
            .closest(".project-gallery")
            .querySelector(".project-main");
          main.src = thumb.src;
        });
      });

      closeBtn.addEventListener("click", closeLightbox);

      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
      });

      document.addEventListener("keydown", (e) => {
        if (lightbox.style.display !== "flex") return;

        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") {
          index = (index + 1) % images.length;
          updateImage();
        }
        if (e.key === "ArrowLeft") {
          index = (index - 1 + images.length) % images.length;
          updateImage();
        }
      });

      /* Touch swipe */
      lightbox.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
      });

      lightbox.addEventListener("touchend", (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          index =
            diff > 0
              ? (index + 1) % images.length
              : (index - 1 + images.length) % images.length;
          updateImage();
        }
      });

      /* Deep link open */
      if (location.hash.startsWith("#project-")) {
        const project = document.querySelector(location.hash);
        if (project) {
          const main = project.querySelector(".project-main");
          main.click();
        }
      }

      const prevBtn = document.querySelector(".lightbox-arrow.prev");
      const nextBtn = document.querySelector(".lightbox-arrow.next");

      function nextImage() {
        index = (index + 1) % images.length;
        updateImage();
      }

      function prevImage() {
        index = (index - 1 + images.length) % images.length;
        updateImage();
      }

      nextBtn.addEventListener("click", nextImage);
      prevBtn.addEventListener("click", prevImage);
    });
});
