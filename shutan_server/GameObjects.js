const Matter = require('matter-js');
const { Bodies } = Matter;

class Scene {
    constructor(x, y, w, h, collisionFilter) {
        const options = {
            collisionFilter,
            isStatic: true
        }
        this.matter = Bodies.rectangle(x, y, w, h, options);
    }
}
class Player {
    constructor(x, y, r, collisionFilter, fireBallCF) {
        const options = { collisionFilter };
        this.matter = Bodies.circle(x, y, r, options);
        this.fireBallCF = fireBallCF;
    }
}

class FireBall {
    constructor(x, y, collisionFilter) {
        const r = 8;
        const options = { collisionFilter };
        this.matter = Bodies.circle(x, y, 1, options);
    }
}

module.exports = {
    Scene,
    Player,
    FireBall,
}