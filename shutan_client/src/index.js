import './scss/style.scss';
import * as PIXI from 'pixi.js';
import { Player, Rectangle, Fireball } from './GameEntityes';
import Connect from './Connect';
import Ui from './Ui/Ui';

const app = new PIXI.Application({
    width: 1000,
    height: 600,
});

document.querySelector('#pixi').appendChild(app.view);

app.renderer.view.addEventListener('contextmenu', () => { });

const ui = new Ui('ilya', 'left');

const player = new Player(0, 0, 30);
app.stage.addChild(player.graphic);
const rect = new Rectangle(0, 580, 1000, 20);
app.stage.addChild(rect.graphic);
const fireballs = [];
fireballs[0] = new Fireball(500, 0);
app.stage.addChild(fireballs[0].graphic);

let playerName;

const messageHandler = function messageHandler(string) {
    const data = JSON.parse(string);
    player.move(data.player.x, data.player.y);
    fireballs[0].move(data.fireballs.x, data.fireballs.y);
    // console.log(fireballs[0].graphic.position.x + '  -  ' + fireballs[0].graphic.position.y);
    /*     if (data.fireballs.length) {
            if (fireballs.length !== data.fireballs.length) {
                const i = data.fireballs.length - 1;
                fireballs.push(new Fireball(data.fireballs[i].x, data.fireballs[i].y));
            }
        }
        fireballs.forEach((fireball, index) => {
            fireball.move(data.fireballs[index].x, data.fireballs[index].y);
            console.log(fireballs[fireballs.length - 1].graphic.position.x);
        }); */
};

let connection = {};

const messageCallback = (type, data) => {
    console.log(`${type}   -   ${data}`);
    switch (type) {
    case 'frameData':
        player.move(data.player.x, data.player.y);
        fireballs[0].move(data.fireballs.x, data.fireballs.y);
        break;
    case 'connect':
        if (ui.page !== 'lobby') {
            ui.getLobby();
            ui.addPlayer(data.name, 'left');
            ui.addPlayer(playerName, 'right');
        } else {
            ui.addPlayer(data.name, 'right');
        }
        break;
    case 'wait':
        ui.getLobby();
        ui.addPlayer(data.name, 'left');
        break;
    case 'ready':
        break;
    default: break;
    }
};

/* const reader = new FileReader();
reader.onload = () => {
    const pos = new Float32Array(reader.result);
    player.move(pos[0], pos[1]);
};
reader.readAsArrayBuffer(event.data); */

document.body.addEventListener('keydown', (event) => {
    switch (event.key) {
    case 'ArrowUp':
        connection.send('move', 'up');
        break;
    case 'ArrowDown':
        connection.send('move', 'down');
        break;
    case 'ArrowLeft':
        connection.send('move', 'left');
        break;
    case 'ArrowRight':
        connection.send('move', 'right');
        break;
    default: break;
    }
});
document.body.addEventListener('keyup', (event) => {
    switch (event.key) {
    case 'ArrowUp': break;
    default: break;
    }
});

app.renderer.plugins.interaction.on('mousedown', (e) => {
    connection.send('fire', e.data.global);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('ready');
    const connectButton = document.querySelector('.buttonConnect');
    const playerNameInput = document.querySelector('#playerName');

    playerNameInput.addEventListener('input', (e) => {
        playerName = e.target.value;
    });

    connectButton.addEventListener('click', () => {
        console.log(playerName);
        if (playerName) {
            connection = new Connect(playerName);
            connection.messageCallback = messageCallback;
        }
    });
});
