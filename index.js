const readline = require("readline");
const shell = require("shelljs");
const fs = require("fs");
const path = require("path");

// Leer configuración desde projects.json
const projectsPath = path.join(__dirname, "projects.json");
let projects;

try {
  const rawData = fs.readFileSync(projectsPath);
  projects = JSON.parse(rawData);
} catch (err) {
  console.error("❌ Error al leer projects.json:", err.message);
  process.exit(1);
}

// Mostrar menú
console.log("\nSeleccione el proyecto con el que desea trabajar:\n");
projects.forEach(function (project, index) {
  console.log((index + 1) + ". " + project.name + " (Node " + project.nodeVersion + ", Angular CLI " + project.angularCli + ")");
});

// Crear interfaz de entrada
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Esperar selección
rl.question("\nIngrese el número del proyecto: ", function (input) {
  const index = parseInt(input.trim(), 10) - 1;

  if (index >= 0 && index < projects.length) {
    const selected = projects[index];

    console.log("\n⏳ Cambiando a Node " + selected.nodeVersion + "...");
    shell.exec("nvm use " + selected.nodeVersion);

    console.log("\n🔄 Instalando Angular CLI " + selected.angularCli + "...");
    shell.exec("npm install -g @angular/cli@" + selected.angularCli);

    console.log("\n✅ Entorno listo para trabajar con " + selected.name + ".\n");
  } else {
    console.log("❌ Selección inválida.");
  }

  rl.close();
});
