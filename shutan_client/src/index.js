import './scss/style.scss';
import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    width: 1000,
    height: 600,
});

document.querySelector('#pixi').appendChild(app.view);

// app.stage.interactive = true;
// app.stage.hitArea = app.screen;
// disable context menu
app.renderer.view.addEventListener('contextmenu', () => {});

class Player {
    constructor(x, y, r) {
        this.graphic = new PIXI.Graphics();
        this.graphic.beginFill(0xFFFFFF);
        this.graphic.drawCircle(x, y, r);
        this.pos = this.graphic.position;
        app.stage.addChild(this.graphic);
    }

    move(x, y) {
        this.graphic.position.x = x;
        this.graphic.position.y = y;
    }
}

class Fireball {
    constructor(x, y) {
        this.graphic = new PIXI.Graphics();
        this.graphic.beginFill(0xFFFF00);
        this.graphic.drawCircle(x, y, 8);
        app.stage.addChild(this.graphic);
    }

    move(x, y) {
        this.graphic.position.x = x;
        this.graphic.position.y = y;
    }
}

class Rectangle {
    constructor(x, y, w, h) {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xFFFF00);
        this.graphics.lineStyle(2, 0xFFFF00);
        this.graphics.drawRect(x, y, w, h);
        this.pos = this.graphics.position;
        app.stage.addChild(this.graphics);
    }

    move(x, y) {
        this.graphics.position.x = x;
        this.graphics.position.y = y;
    }
}

const player = new Player(0, 0, 30);
const rect = new Rectangle(0, 580, 1000, 20);
console.log(rect);
const fireballs = [];

const messageHandler = function messageHandler(string) {
    const data = JSON.parse(string);
    player.move(data.player.x, data.player.y);
    if (data.fireballs.length) {
        if (fireballs.length !== data.fireballs.length) {
            const i = data.fireballs.length - 1;
            const fb = new Fireball(data.fireballs[i].x, data.fireballs[i].y);
            fireballs.push(fb);
            console.log(`${data.fireballs[i].x} - ${data.fireballs[i].y}`);
        }
    }
    fireballs.forEach((fireball, index) => {
        fireball.move(data.fireballs[index].x, data.fireballs[index].y);
    });
    console.log(`${data.fireballs[data.fireballs.length - 1].x} - ${data.fireballs[data.fireballs.length - 1].y}`);
};

const socket = new WebSocket('ws://localhost:8080');
socket.onopen = () => {
    socket.onmessage = (event) => {
        /* const reader = new FileReader();
        reader.onload = () => {
            const pos = new Float32Array(reader.result);
            player.move(pos[0], pos[1]);
        };
        reader.readAsArrayBuffer(event.data); */
        messageHandler(event.data);
    };
};

document.querySelector('button').addEventListener('click', () => {
    player.move(player.pos.x += 10, 300);
});
const send = function send(type, data) {
    const sendJSON = JSON.stringify({ type, data });
    socket.send(sendJSON);
};

document.body.addEventListener('keydown', (event) => {
    switch (event.key) {
    case 'ArrowUp':
        send('move', 'up');
        break;
    case 'ArrowDown':
        send('move', 'down');
        break;
    case 'ArrowLeft':
        send('move', 'left');
        break;
    case 'ArrowRight':
        send('move', 'right');
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
    send('fire', e.data.global);
});
