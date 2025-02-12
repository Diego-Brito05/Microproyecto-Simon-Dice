document.querySelectorAll('.simon-button').forEach(button => {
  button.addEventListener('click', () => {
      let soundPath = button.getAttribute('data-sound');
      console.log("Intentando reproducir:", soundPath); // Verifica la ruta

      let sound = new Audio(soundPath);
      sound.play().then(() => {
          console.log("Sonido reproducido con éxito");
      }).catch(error => {
          console.error("Error al reproducir el sonido:", error);
      });
  });
});