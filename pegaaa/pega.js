// Cria as camadas da aurora dinamicamente
document.addEventListener("DOMContentLoaded", () => {
    const auroraContainer = document.getElementById("aurora");
    
    // Adiciona 3 camadas para a aurora boreal
    for (let i = 0; i < 3; i++) {
      const auroraLight = document.createElement("div");
      auroraLight.classList.add("aurora-light");
      auroraContainer.appendChild(auroraLight);
    }
  });
  