import * as PIXI from 'pixi.js';
import { Player, Rectangle, Fireball } from './GameEntityes';

export default class Game {
    constructor(connection) {
        this.connection = connection;
        this.app = new PIXI.Application({
            width: 1000,
            height: 600,
        });
        this.text = null;
        this.players = [];
        this.fireballs = new Map();
        document.querySelector('#pixi').appendChild(this.app.view);
        this.app.renderer.view.addEventListener('contextmenu', () => { });
        this.app.renderer.plugins.interaction.on('mousedown', this.fireHandler.bind(this));
        this.createScene();
        this.addPlayers();
    }

    fireHandler(e) {
        this.connection.send('game', { type: 'fire', data: e.data.global });
    }

    createScene() {
        this.rect = new Rectangle(0, 580, 1000, 20);
        this.app.stage.addChild(this.rect.graphic);
    }

    addPlayers() {
        this.players.push(new Player(0, 0, 30, this.app.stage));
        this.players.push(new Player(0, 0, 30, this.app.stage));
        this.app.stage.addChild(this.players[0].graphic, this.players[1].graphic);
    }

    tickHandler(data) {
        this.players[0].show(data.players[0].x, data.players[0].y);
        this.players[1].show(data.players[1].x, data.players[1].y);

        data.fireballs.forEach((fbFromServer) => {
            let fireball = this.fireballs.get(fbFromServer.id);
            if (!fireball) {
                fireball = new Fireball(0, 0);
                console.log('new Fireball!!!!!!!!!');
                this.fireballs.set(fbFromServer.id, fireball);
                this.app.stage.addChild(fireball.graphic);
            }
            fireball.move(fbFromServer.x, fbFromServer.y);
            fireball.isDirty = false;
        });
        Array.from(this.fireballs).forEach((fireBall) => {
            if (fireBall[1].isDirty) {
                this.app.stage.removeChild(fireBall[1].graphic);
                this.fireballs.delete(fireBall[0]);
            } else {
                fireBall[1].isDirty = true;
            }
        });

        this.checkDamage(data.players);
    }

    checkDamage(players) {
        players.forEach((player, index) => {
            if (player.damage) {
                console.log('damage!!');
                this.players[index].addDamage(player.damage);
            }
        });
    }

    hitHandler(index, damage) {
        const text = new PIXI.Text(`${index} - ${damage}`, {
            fontFamily: 'Iceland',
            fontSize: 24,
            fill: 0xff1010,
            align: 'center',
        });
        if (this.text) {
            this.app.stage.removeChild(this.text);
        }
        console.log(this.players[index].graphic.position);
        text.x = this.players[index].graphic.position.x;
        text.y = this.players[index].graphic.position.y - 60;
        this.text = text;
        this.app.stage.addChild(text);
    }
}
