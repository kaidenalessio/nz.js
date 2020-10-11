const ROOM_WIDTH = 800;
const ROOM_HEIGHT = 600;

const FOOD_AMOUNT = 5;
const FOOD_SPEED = 1;

const POISON_AMOUNT = 5;
const POISON_SPEED = 0.8;

const PLAYER_MAX_VELOCITY = 3;
const PLAYER_SPEED = 1;

const PLAYER_RADIUS = 32;
const FOOD_RADIUS = PLAYER_RADIUS * 0.5;
const POISON_RADIUS = FOOD_RADIUS;

const MAX_ITER = 100;

let SCORE = 0;
let GAME_OVER = false;

const TARGET_SCORE = 20;
const GAME_OVER_WON_TEXT = 'Congrats! You won!';
const GAME_OVER_LOST_TEXT = 'Game over! You lost!';