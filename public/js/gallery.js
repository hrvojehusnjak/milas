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
    });
});
