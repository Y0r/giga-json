import "./styles.css";
import logo from "./assets/logo.png";

function render(): void {
  const heading = document.createElement("h1");
  heading.textContent = `Initial render content`;
  document.body.appendChild(heading);

  const img = document.createElement("img");
  img.src = logo;
  img.alt = "Sycamore Tree";
  img.style.width = "200px";

  document.body.appendChild(img);
}

render();
