const Matter = require('matter-js');
const matterFix = require('./matterFix');
const { Scene, Player, FireBall } = require('./GameObjects');

const { Engine, World, Bodies, Body } = Matter;
const fix = new matterFix();

module.exports = class Game {
    constructor(leftPlayerName, rightPlayerName) {
        const { Engine, World } = Matter;
        this.Engine = Engine;
        this.World = World;
        this.Body = Body;
        this.engine = Engine.create(fix.options);
        this.leftPlayerName = leftPlayerName;
        this.rightPlayerName = rightPlayerName;
        this.tick = () => { };
        this.fireBalls = [];
    }

    add(object) {
        this.World.add(this.engine.world, object.matter);
    }

    start() {
        this.scene = new Scene(500, 680, 1000, 200);
        this.add(this.scene);
        this.players = new Map([
            [
                this.leftPlayerName,
                new Player(300, 0, 30),
            ],
            [
                this.rightPlayerName,
                new Player(300, 0, 30),
            ],
        ]);
        this.add(this.players.get(this.leftPlayerName));
        this.add(this.players.get(this.rightPlayerName));
        this.add(new FireBall(100, 0));
        this.Engine.run(this.engine);
        setInterval(() => {
            this.tick({
                players: [
                    {
                        x: this.players.get(this.leftPlayerName).matter.position.x,
                        y: this.players.get(this.leftPlayerName).matter.position.y,
                    },
                    {
                        x: this.players.get(this.rightPlayerName).matter.position.x,
                        y: this.players.get(this.rightPlayerName).matter.position.y,
                    }
                ],
                fireballs: this.fireBalls.map(fireball => {
                    return {
                        x: fireball.matter.position.x,
                        y: fireball.matter.position.y,
                    };
                })
            });
        }, 16);
    }

    usersControlHandler(playerName, type, data) {
        const player = this.players.get(playerName);
        switch (data.type) {
            case 'move': switch (data.data) {
                case 'up':
                    player.matter.force = { x: 0, y: -0.07 };
                    break;
                case 'down':
                    player.matter.force = { x: 0, y: 0.07 };
                    break;
                case 'left':
                    player.matter.force = { x: -0.07, y: 0 };
                    break;
                case 'right':
                    player.matter.force = { x: 0.07, y: 0 };
                    break;
            }
            case 'fire':
                this.fire(player, data.data)
                break;
            default: break;
        }
    }

    fire(player, vector) {
        const v1 = {
            x: player.matter.position.x,
            y: player.matter.position.y,
        };
        const v2 = {
            x: vector.x,
            y: vector.y,
        };
        const v3 = Matter.Vector.angle(v1, v2);
        const v4 = Matter.Vector.rotate({
            x: 0.0003,
            y: 0.00
        }, v3);

        const fireBall = new FireBall(v1.x, v1.y);
        this.fireBalls.push(fireBall);
        this.add(fireBall);
        this.Body.applyForce(fireBall.matter, v1, v4);
    }

    addFireball(x, y) {
        const fireBall = new FireBall(x, y);
        this.fireBalls.push(fireBall);
        this.add(fireBall);
        this.Body.applyForce(fireBall.matter, v1, v4);
    }
}