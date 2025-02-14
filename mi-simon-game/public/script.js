document.querySelectorAll('.simon-button').forEach(button => {
  button.addEventListener('click', () => {
      let soundPath = button.getAttribute('data-sound');
      console.log("Intentando reproducir:", soundPath); // Verifica la ruta

      let sound = new Audio(soundPath);
      sound.volume = 0.25; // Reducir el volumen al 25%

      sound.play().then(() => {
          console.log("Sonido reproducido con éxito");
      }).catch(error => {
          console.error("Error al reproducir el sonido:", error);
      });
  });
});

let sequence = [];  // Secuencia generada por el juego
let playerSequence = [];  // Secuencia ingresada por el jugador
let level = 0;  // Nivel actual
let isPlaying = false;  // Control del estado del juego
let audioPlayer = new Audio(); // Reproductor de sonido global
let totalRounds = localStorage.getItem('totalRounds') ? parseInt(localStorage.getItem('totalRounds')) : 0;

// Mostrar el valor almacenado al cargar la página
document.getElementById('total-rounds').textContent = totalRounds;

// Referencias a los botones y a los elementos de la interfaz
const buttons = document.querySelectorAll('.simon-button');
const startButton = document.querySelector('.start-btn');
const scoreDisplay = document.getElementById('score');

// Función para deshabilitar o habilitar los botones
function disableButtons(state) {
  buttons.forEach(button => {
    if (state) {
      button.classList.add('disabled');
    } else {
      button.classList.remove('disabled');
    }
  });
}

// Función para comenzar el juego
startButton.addEventListener('click', () => {
  if (!isPlaying) {
    startGame();
  }
});

// Función para iniciar el juego
function startGame() {
  isPlaying = true;
  level = -1;
  sequence = [];
  playerSequence = [];
  scoreDisplay.textContent = level;
  startButton.style.display = 'none';  // Ocultar botón de inicio
  nextRound();
}

// Función para avanzar al siguiente nivel
function nextRound() {
  level++;
  playerSequence = [];
  scoreDisplay.textContent = level;  // Actualizar puntaje
  if (level > 0) { // Solo aumenta si level es mayor que 0
      totalRounds++; 
      localStorage.setItem('totalRounds', totalRounds); // Guarda en localStorage
      document.getElementById('total-rounds').textContent = totalRounds;} // Muestra en la interfaz

  disableButtons(true);  // Deshabilitar botones mientras se muestra el patrón

  // Agregar un nuevo color a la secuencia
  const randomColor = getRandomColor();
  sequence.push(randomColor);

  // Reproducir la secuencia antes de permitir que el jugador juegue
  showPattern(sequence);
}

// Función para obtener un color aleatorio
function getRandomColor() {
  const colors = ['green', 'red', 'yellow', 'blue'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Función para mostrar la secuencia de la máquina (simular clics en los botones)
function showPattern(sequence) {
  let index = 0;
  const interval = setInterval(() => {
    const color = sequence[index];
    flashButton(color);  // Iluminar el botón y reproducir sonido

    index++;
    if (index >= sequence.length) {
      clearInterval(interval);  // Detener el intervalo al finalizar la secuencia
      
      // Reactivar los botones después de la reproducción
      setTimeout(() => {
        disableButtons(false);
      }, 600);
    }
  }, 800);  // Intervalo de 800ms para cada botón
}

// Función para hacer que un botón "brille" y reproduzca su sonido
function flashButton(color, callback) {
    const button = document.querySelector(`.simon-button.${color}`);
    button.classList.add('active'); // Iluminar el botón
  
    // Detener el sonido anterior antes de reproducir uno nuevo
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.src = button.getAttribute('data-sound');
    audioPlayer.volume = 0.3; // Reducir el volumen al 30%
    audioPlayer.play();
  
    setTimeout(() => {
      button.classList.remove('active'); // Apagar el "brillo" más rápido
    }, 300); // Efecto de brillo más corto
  
    // Esperar a que termine el sonido antes de continuar
    setTimeout(callback, 1000);
  }

// Función para manejar el clic del jugador
buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (!isPlaying || button.classList.contains('disabled')) return;

    const color = button.classList[1];  // Obtener el color del botón
    playerSequence.push(color);

    // Iluminar el botón al ser presionado
    flashButton(color);

    // Verificar si la secuencia del jugador es correcta
    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
      // Si el jugador se equivoca, termina el juego
      endGame();
    } else {
      // Si el jugador ha repetido toda la secuencia correctamente, avanzar de ronda
      if (playerSequence.length === sequence.length) {
        disableButtons(true); // Evita que el jugador presione botones mientras espera la nueva ronda
        setTimeout(() => {
          nextRound();
        }, 1000);  // Esperar un segundo antes de la siguiente ronda
      }
    }
  });
});

// Función para terminar el juego
function endGame() {
  alert('Game Over! You lost.');
  isPlaying = false;
  startButton.textContent = 'Play Again';
  startButton.style.display = 'block';  // Mostrar botón de reinicio
  disableButtons(false);  // Asegurar que los botones estén habilitados para el reinicio
}

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-btn");
    const nameInput = document.getElementById("player-name");
    const confirmNameBtn = document.getElementById("confirm-name-btn");
    const nameContainer = document.getElementById("name-container");

    // Verificar si ya hay un nombre guardado en LocalStorage
    let playerName = localStorage.getItem("playerName");

    if (playerName) {
        nameContainer.classList.add("hidden"); // Oculta el cuadro de nombre
        enableStartButton(); // Habilita el botón de inicio
    }

    confirmNameBtn.addEventListener("click", () => {
        const name = nameInput.value.trim(); // Eliminar espacios en blanco

        if (name) {
            localStorage.setItem("playerName", name); // Guardar en LocalStorage
            nameContainer.classList.add("hidden"); // Ocultar cuadro de nombre
            enableStartButton(); // Habilitar botón de inicio
        } else {
            alert("Please enter a valid name."); // Mostrar alerta si está vacío
        }
    });

    function enableStartButton() {
        startButton.disabled = false;
        startButton.style.opacity = 1;
        startButton.style.pointerEvents = "auto"; // Permitir clics
    }
});


document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-btn");
  const nameInput = document.getElementById("player-name");
  const confirmNameBtn = document.getElementById("confirm-name-btn");
  const nameContainer = document.getElementById("name-container");
  const playerInfo = document.getElementById("player-info");
  const displayName = document.getElementById("display-name");

  // Asegurar que la sección de ingresar nombre siempre esté visible al recargar
  nameContainer.classList.remove("hidden");
  playerInfo.classList.add("hidden"); // Ocultar la info del jugador
  startButton.disabled = true; // Deshabilitar el botón de inicio

  confirmNameBtn.addEventListener("click", () => {
      const name = nameInput.value.trim(); // Eliminar espacios en blanco

      if (name) {
          nameContainer.classList.add("hidden"); // Ocultar la sección de entrada
          showPlayerInfo(name); // Mostrar la sección con el nombre
          enableStartButton(); // Habilitar botón de inicio
      } else {
          alert("Please enter a valid name."); // Mostrar alerta si el campo está vacío
      }
  });

  function enableStartButton() {
      startButton.disabled = false;
      startButton.style.opacity = 1;
      startButton.style.pointerEvents = "auto"; // Permitir clics
  }

  function showPlayerInfo(name) {
      displayName.textContent = name; // Mostrar el nombre ingresado
      playerInfo.classList.remove("hidden"); // Mostrar la sección del nombre
  }
});
