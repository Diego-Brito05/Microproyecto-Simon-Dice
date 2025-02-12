// Crear los objetos de los sonidos
const sounds = {
  green: new Audio('sounds/GreenButtonSound.wav'),
  red: new Audio('sounds/RedButtonSound.wav'),
  yellow: new Audio('sounds/YellowButtonSound.wav'),
  blue: new Audio('sounds/BlueButtonSound.wav')
};

// Obtener los botones
const greenButton = document.getElementById('green');
const redButton = document.getElementById('red');
const yellowButton = document.getElementById('yellow');
const blueButton = document.getElementById('blue');

// Asignar los eventos de clic para reproducir los sonidos
greenButton.addEventListener('click', () => {
  sounds.green.play();
});
redButton.addEventListener('click', () => {
  sounds.red.play();
});
yellowButton.addEventListener('click', () => {
  sounds.yellow.play();
});
blueButton.addEventListener('click', () => {
  sounds.blue.play();
});