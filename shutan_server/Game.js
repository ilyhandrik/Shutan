const Matter = require('matter-js');
const matterFix = require('./matterFix');
const { Scene, Player, FireBall } = require('./GameObjects');

const { Engine, World, Bodies } = Matter;
const fix = new matterFix();

module.exports = class Game {
    constructor() {
        const { Engine, World } = Matter;
        this.Engine = Engine;
        this.World = World;
        this.engine = Engine.create(fix.options);
    }

    add(object) {
        this.World.add(this.engine.world, object.matter);
    }
    start() {
        this.scene = new Scene(0, 680, 1500, 200);
        this.player = new Player(0, 0, 30);
        this.add(this.scene);
        this.add(this.player);
        this.Engine.run(this.engine);
        setInterval(() => {
            console.log(this.player.matter.position);
        }, 500);
    }
}