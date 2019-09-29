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
        this.health = 100;
        this.damageValue = 0;
        const options = { collisionFilter };
        this.matter = Bodies.circle(x, y, r, options);
        this.fireBallCF = fireBallCF;
        this.id = this.matter.id;
        this.fireBalls = new Map();
    }

    damage(damage) {
        this.damageValue = damage;
        this.health = this.health - damage;
    }

    getDamage() {
        const damage = this.damageValue;
        this.damageValue = 0;
        return damage;
    }


}

class FireBall {
    constructor(x, y, collisionFilter) {
        const r = 8;
        const options = { collisionFilter };
        this.matter = Bodies.circle(x, y, 8, options);
        this.isReadyToRemove = false;
        this.isPrepareToRemove = false;
    }

    setRemoveTimer() {
        this.isPrepareToRemove = true;
        setTimeout(() => {
            this.isReadyToRemove = true;
        }, 70);
    }
}

module.exports = {
    Scene,
    Player,
    FireBall,
}