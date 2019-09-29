const Matter = require('matter-js');
const matterFix = require('./matterFix');
const { Scene, Player, FireBall } = require('./GameObjects');
const FILTERS = require('./CFILTERS');

const { Engine, World, Bodies, Body, Events } = Matter;
const fix = new matterFix();

module.exports = class Game {
    constructor(leftPlayerName, rightPlayerName) {
        const { Engine, World } = Matter;
        this.Events = Events;
        this.Engine = Engine;
        this.World = World;
        this.Body = Body;
        this.engine = Engine.create(fix.options);
        this.leftPlayerName = leftPlayerName;
        this.rightPlayerName = rightPlayerName;
        this.tick = () => { };
        this.fireBalls = new Map();
    }

    add(object) {
        this.World.add(this.engine.world, object.matter);
    }

    start() {
        this.scene = new Scene(500, 680, 1000, 200, FILTERS.SCENE);
        this.add(this.scene);
        this.players = new Map([
            [
                this.leftPlayerName,
                new Player(300, 0, 30, FILTERS.LEFT_PLAYER, FILTERS.LEFT_FB),
            ],
            [
                this.rightPlayerName,
                new Player(600, 0, 30, FILTERS.RIGHT_PLAYER, FILTERS.RIGHT_FB),
            ],
        ]);
        this.Events.on(this.engine, 'collisionStart', this.collisionHandler.bind(this));
        this.add(this.players.get(this.leftPlayerName));
        this.add(this.players.get(this.rightPlayerName));
        this.Engine.run(this.engine);
        setInterval(() => {
            fireballs: Array.from(this.fireBalls).forEach(fireball => {
                if (fireball[1].isReadyToRemove) {
                    this.World.remove(this.engine.world, fireball[1].matter);
                    this.fireBalls.delete(fireball[1].matter.id);
                    this.players.get(this.leftPlayerName).fireBalls.delete(fireball[1].matter.id);
                    this.players.get(this.rightPlayerName).fireBalls.delete(fireball[1].matter.id);
                }
            });
            this.tick({
                players: [
                    {
                        x: this.players.get(this.leftPlayerName).matter.position.x,
                        y: this.players.get(this.leftPlayerName).matter.position.y,
                        damage: this.players.get(this.leftPlayerName).getDamage(),
                    },
                    {
                        x: this.players.get(this.rightPlayerName).matter.position.x,
                        y: this.players.get(this.rightPlayerName).matter.position.y,
                        damage: this.players.get(this.rightPlayerName).getDamage(),
                    }
                ],
                fireballs: Array.from(this.fireBalls).map(fireball => {
                    return {
                        id: fireball[1].matter.id,
                        x: fireball[1].matter.position.x,
                        y: fireball[1].matter.position.y,
                    };
                })
            });
        }, 16);
    }

    usersControlHandler(playerName, type, data) {
        const player = this.players.get(playerName);
        switch (data.type) {
            case 'move':
                switch (data.data) {
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
                };
                break;
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
        const v3 = Matter.Vector.angle(
            v1,
            v2,
        );
        const v4 = Matter.Vector.rotate({
            x: 0.02,
            y: 0.00
        }, v3);

        const fireBall = new FireBall(v1.x, v1.y, player.fireBallCF);
        this.fireBalls.set(fireBall.matter.id, fireBall);
        player.fireBalls.set(fireBall.matter.id, fireBall);

        this.add(fireBall);
        this.Body.applyForce(fireBall.matter, v1, v4);
    }

    collisionHandler(event) {
        const playerA = this.players.get(this.leftPlayerName);
        const playerB = this.players.get(this.rightPlayerName);
        const playersArray = [playerA, playerB];
        let findPlayer;
        event.pairs.forEach(pair => {
            let playerIndex;
            let bodyIndex;
            const bodyArray = [pair.bodyA.id, pair.bodyB.id]
            playersArray.forEach((player, playerI) => {
                bodyArray.forEach((body, bodyI) => {
                    if (player.matter.id === body) {
                        playerIndex = playerI;
                        bodyIndex = bodyI;
                        const fireBall =
                            playersArray[1 ^ playerIndex].fireBalls.get(bodyArray[1 ^ bodyIndex]);
                        if (fireBall) {
                            if (!fireBall.isPrepareToRemove) {
                                fireBall.setRemoveTimer();
                                this.hitHandler(playersArray[playerI])
                            }
                        }
                    }
                });
            });
        });
    }

    hitHandler(player) {
        player.damage(10);
        console.log(player.health);
    }

    findCollisionedPlayer(a, b, playersArray) {
        return playersArray.find(player => {
            //console.log(player[1].matter.id);
            return player[1].matter.id === a.id || player[1].matter.id === b.id;
        });
    }
}