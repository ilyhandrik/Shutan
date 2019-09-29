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
        this.fireballs = [];
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
        if (data.fireballs.length !== this.fireballs.length) {
            const fireball = new Fireball(0, 0);
            this.fireballs.push(fireball);
            this.app.stage.addChild(fireball.graphic);
        }
        this.checkDamage(data.players);
        data.fireballs.forEach((fireball, index) => {
            this.fireballs[index].move(fireball.x, fireball.y);
        });
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
