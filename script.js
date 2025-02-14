let sequence = [];  
let playerSequence = [];  
let level = 0;  
let isPlaying = false;  
let audioPlayer = new Audio(); 
let totalRounds = 0;

const buttons = document.querySelectorAll('.simon-button');
const startButton = document.querySelector('.start-btn');
const scoreDisplay = document.getElementById('score');

document.querySelectorAll('.simon-button').forEach(button => {
  button.addEventListener('click', () => {
      let soundPath = button.getAttribute('data-sound');
      console.log("Intentando reproducir:", soundPath); // Verifica la ruta

      let sound = new Audio(soundPath);
      sound.volume = 0.55; // Reducir el volumen al 40%

      sound.play().then(() => {
          console.log("Sonido reproducido con éxito");
      }).catch(error => {
          console.error("Error al reproducir el sonido:", error);
      });
  });
});

function disableButtons(state) {
    buttons.forEach(button => {
        if (state) {
            button.classList.add('disabled');
        } else {
            button.classList.remove('disabled');
        }
    });
}

startButton.addEventListener('click', () => {
    if (!isPlaying) {
        startGame();
    }
});

function startGame() {
    totalRounds = 0;
    isPlaying = true;
    level = -1;
    sequence = [];
    playerSequence = [];
    scoreDisplay.textContent = level;
    startButton.style.display = 'none';

    // Ocultar la tabla de puntuaciones al reiniciar
    document.getElementById("leaderboard-container").classList.remove("visible");
    document.getElementById("leaderboard-container").style.display = "none";


    nextRound();
}

function nextRound() {
    level++;
    playerSequence = [];
    scoreDisplay.textContent = level;
    
    if (level > 0) {
        totalRounds++; 
        localStorage.setItem('totalRounds', totalRounds);
        document.getElementById('total-rounds').textContent = totalRounds;
    }

    disableButtons(true);

    const randomColor = getRandomColor();
    sequence.push(randomColor);

    showPattern(sequence);
}

function getRandomColor() {
    const colors = ['green', 'red', 'yellow', 'blue'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function showPattern(sequence) {
    let index = 0;
    const interval = setInterval(() => {
        const color = sequence[index];
        flashButton(color);

        index++;
        if (index >= sequence.length) {
            clearInterval(interval);

            setTimeout(() => {
                disableButtons(false);
            }, 600);
        }
    }, 800);
}

function flashButton(color, callback) {
    const button = document.querySelector(`.simon-button.${color}`);
    button.classList.add('active');

    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.src = button.getAttribute('data-sound');
    audioPlayer.volume = 0.55 // Reducir el volumen al 40%;
    audioPlayer.play();

    setTimeout(() => {
        button.classList.remove('active');
    }, 300);

    setTimeout(callback, 1000);
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (!isPlaying || button.classList.contains('disabled')) return;

        const color = button.classList[1];
        playerSequence.push(color);

        flashButton(color);

        if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
            endGame();
        } else {
            if (playerSequence.length === sequence.length) {
                disableButtons(true);
                setTimeout(() => {
                    nextRound();
                }, 1000);
            }
        }
    });
});

function showGameOverMessage(playerName) {
  let messageBox = document.getElementById("game-over-message");
  
  if (!messageBox) {
    console.error("Elemento game-over-message no encontrado.");
    return;
  }

  messageBox.innerHTML = `<p>Game Over! You lost, <strong>${playerName}</strong>.</p>`;
  messageBox.classList.remove("hidden");
  messageBox.classList.add("visible");

  // Ocultar el mensaje después de 3 segundos
  setTimeout(() => {
    messageBox.classList.remove("visible");
    messageBox.classList.add("hidden");
  }, 3000);
}

function endGame() {
  isPlaying = false;
  startButton.textContent = 'Play Again';
  startButton.style.display = 'block';
  disableButtons(false);

  let playerName = localStorage.getItem('playerName') || "Unknown";

  saveHighScore(playerName, level); // Guardar la mejor puntuación del jugador
  updateLeaderboard(); // Actualizar la tabla correctamente

  // Mostrar mensaje de Game Over en pantalla
  showGameOverMessage(playerName);

  // Hacer visible la tabla de puntuaciones
  document.getElementById("leaderboard-container").classList.add("visible");
}


function updateLeaderboard() {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || {};
  let playerName = localStorage.getItem("playerName") || "Unknown";
  let bestScore = parseInt(localStorage.getItem(`bestScore_${playerName}`)) || 0;

  // Guardar la mejor puntuación del jugador
  if (!scores[playerName] || bestScore > scores[playerName]) {
      scores[playerName] = bestScore;
      localStorage.setItem("leaderboard", JSON.stringify(scores));
  }

  // Ordenar de mayor a menor y tomar solo las 10 mejores puntuaciones
  let sortedScores = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

  let leaderboardBody = document.getElementById("leaderboard-body");
  leaderboardBody.innerHTML = ""; // Limpiar la tabla antes de actualizar

  sortedScores.forEach(([name, score], index) => {
      let row = document.createElement("tr");
      row.innerHTML = `<td>${index + 1}°</td><td>${name}</td><td>${score}</td>`;
      leaderboardBody.appendChild(row);
  });

  document.getElementById("leaderboard-container").style.display = "block"; // Mostrar tabla
}

function saveHighScore(name, score) {
  let scores = JSON.parse(localStorage.getItem('leaderboard')) || {};



  // Solo guardar si es la mejor puntuación
  if (!scores[name] || score > scores[name]) {
      scores[name] = score;
      localStorage.setItem('leaderboard', JSON.stringify(scores));
  }
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

// Seccion de los nombres y la tabla de puntuacion
document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-btn");
  const nameInput = document.getElementById("player-name");
  const confirmNameBtn = document.getElementById("confirm-name-btn");
  const nameContainer = document.getElementById("name-container");
  const playerInfo = document.getElementById("player-info");
  const displayName = document.getElementById("display-name");

  // Asegurar que la sección de nombre siempre esté visible al cargar la página
  nameContainer.classList.remove("hidden");
  playerInfo.classList.add("hidden"); 

  // Deshabilitar el botón de inicio al recargar la página
  startButton.disabled = true;
  startButton.style.opacity = 0.5;
  startButton.style.pointerEvents = "none"; 

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
