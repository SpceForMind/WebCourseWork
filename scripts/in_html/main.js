import {GameManager} from "../classes/GameManager.js";

let game = null;
let mapWidth = 600;
let mapHeight = 600;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("containerCanvas").style.width = `${mapWidth}px`;
    document.getElementById("containerCanvas").style.width = `${mapHeight}px`;
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    canvas.style.cursor = (canvas.style.cursor === 'pointer') ? 'default' : 'pointer';
    if (game === null) game = new GameManager(canvas, context, mapWidth, mapHeight);
});

