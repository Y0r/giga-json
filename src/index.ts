import "./styles.css";
import logo from "./assets/logo.png";
import { config } from "@/config";

function render(): void {
  const heading = document.createElement("h1");
  heading.textContent = `Initial render content for ${config.appName}`;
  document.body.appendChild(heading);

  const img = document.createElement("img");
  img.src = logo;
  img.alt = "Sycamore Tree";
  img.style.width = "200px";

  document.body.appendChild(img);
}

render();
