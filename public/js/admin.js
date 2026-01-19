let projects = [];

fetch("/api/projects")
  .then((r) => r.json())
  .then((data) => {
    projects = data;
    render();
  });

function render() {
  const root = document.getElementById("projects");
  root.innerHTML = projects
    .map(
      (p, i) => `
    <div class="field">
  <label for="title-0">Title</label>
  <input id="title-0" type="text" />
</div>

<div class="features">
  <label>Features</label>
  <ul>
    <li>
      <input type="text" />
      <button class="remove">×</button>
    </li>
  </ul>
  <button class="add-feature">+ Add feature</button>
</div>


      <div class="field">
  <label>Categories</label>

  <div class="chips" data-index="0">
    <span class="chip">
      branding
      <button class="remove">×</button>
    </span>

    <button class="add-chip">+</button>
  </div>
</div>

      <button onclick="projects.splice(${i},1); render()">Delete</button>
    </div>
  `
    )
    .join("");
}

document.getElementById("save").onclick = () => {
  fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projects),
  }).then(() => alert("Saved"));
};
