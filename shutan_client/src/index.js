import './scss/style.scss';
import Connect from './Connect';
import Ui from './Ui/Ui';
import Game from './Game';

const ui = new Ui('ilya', 'left');

let playerName;
let connection = {};
let game = null;

const messageCallback = (type, data) => {
    // console.log(`${type}   -   ${JSON.stringify(data)}`);
    switch (type) {
    case 'connect':
        ui.player.setName(playerName);
        ui.player.setPosition(data.position);
        ui.enemy.setName(data.name);
        ui.enemy.setPosition(data.position === 'left' ? 'right' : 'left');
        break;
    case 'wait':
        ui.player.setName(data.name);
        ui.player.setPosition('left');
        break;
    case 'ready':
        break;
    case 'status':
        ui.player.setStatus(data.player);
        ui.enemy.setStatus(data.enemy);
        break;
    case 'start':
        ui.start(3);
        break;
    case 'tick':
        game.tickHandler(data);
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
        connection.send('game', { type: 'move', data: 'up' });
        break;
    case 'ArrowDown':
        connection.send('game', { type: 'move', data: 'down' });
        break;
    case 'ArrowLeft':
        connection.send('game', { type: 'move', data: 'left' });
        break;
    case 'ArrowRight':
        connection.send('game', { type: 'move', data: 'right' });
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

function connectButtonHandler() {
    if (playerName) {
        connection = new Connect(playerName);
        game = new Game(connection);
        connection.messageCallback = messageCallback;
        ui.getLobby();
        ui.addPlayer(null, 'left');
        ui.addEnemy(null, 'right');
        ui.player.toggleReadyHandler = (status) => {
            connection.send('ready_status', status);
        };
    }
}

function init() {
    const connectButton = document.querySelector('.buttonConnect');
    const playerNameInput = document.querySelector('#playerName');

    playerNameInput.addEventListener('input', (e) => {
        playerName = e.target.value;
    });
    connectButton.addEventListener('click', connectButtonHandler);
}

document.addEventListener('DOMContentLoaded', init);
