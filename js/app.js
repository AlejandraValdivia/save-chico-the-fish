// Global DOM manipulation / variables
const game = document.getElementById('game');
const movement = document.getElementById('movement');
const score = document.getElementById('score');
const status = document.getElementById('status');
const ctx = game.getContext('2d');
let chicoCharacter;
let shark;
const fishImg = document.getElementById('chico-fish');
fishImg.style.position = 'absolute';
fishImg.style.display = 'block';
console.log(fishImg);
const sharkImg = document.getElementById('shark');

// ====================== PAINT INTIAL SCREEN ======================= //
// EVENT LISTENERS
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');
    
});