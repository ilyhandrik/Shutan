const Matter = require('matter-js');
const matterFix = require('./matterFix');
const { Scene, Player, FireBall } = require('./GameObjects');

const { Engine, World, Bodies } = Matter;
const fix = new matterFix();

module.exports = class Game {
    constructor(leftPlayerName, rightPlayerName) {
        const { Engine, World } = Matter;
        this.Engine = Engine;
        this.World = World;
        this.engine = Engine.create(fix.options);
        this.leftPlayerName = leftPlayerName;
        this.rightPlayerName = rightPlayerName;
        this.tick = () => {};
    }

    add(object) {
        this.World.add(this.engine.world, object.matter);
    }

    start() {
        this.scene = new Scene(0, 680, 1500, 200);
        this.add(this.scene);
        this.players = new Map([
            [
                this.leftPlayerName,
                new Player(0, 0, 30),
            ],
            [
                this.rightPlayerName,
                new Player(0, 0, 30),
            ],
        ]);
        this.add(this.players.get(this.leftPlayerName));
        this.add(this.players.get(this.rightPlayerName));
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
                ]
            });
        }, 30);
    }

    usersControlHandler(playerName, type, data) {
        const player = this.players.get(playerName);
            switch (data) {
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
                default: break;
            }
    }
}