const Matter = require('matter-js');
const { Bodies } = Matter;

class Scene {
    constructor(x, y, w, h) {
        const options = {
            collisionFilter: {
                mask: 6,
                category: 8,
            },
            isStatic: true
        }
        this.matter = Bodies.rectangle(x, y, w, h, options);
    }
}
class Player {
    constructor(x, y, r) {
        const options = {
            collisionFilter: {
                category: 2,
                mask: 8,
            },
        };
        this.matter = Bodies.circle(x, y, r, options);
    }
}

class FireBall {
    constructor(x, y) {
        const r = 8;
        const options = {
            collisionFilter: {
                category: 4,
            },
        };
        this.matter = Bodies.circle(x, y, 1, options);
    }
}

module.exports = {
    Scene,
    Player,
    FireBall,
}