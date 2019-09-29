import * as PIXI from 'pixi.js';

export class Base {
    constructor() {
        this.graphic = new PIXI.Graphics();
    }

    move(x, y) {
        this.graphic.position.x = x;
        this.graphic.position.y = y;
    }
}

export class Player extends Base {
    constructor(x, y, r, appStage) {
        super();
        this.appStage = appStage;
        // this.graphic.beginFill(0xFFFFFF);
        this.graphic.lineStyle(1, 0xFFFFFF, 1, 1);
        this.graphic.drawCircle(x, y, r);
        this.damage = [];
        this.damageOffset = 0;
        this.damageIndicators = [];
    }

    show(x, y) {
        this.move(x, y);
      
        if (!indicator.isLife) {
                    this.appStage.removeChild(indicator);
                }
            });
        }
    }

    addDamage(value) {
        const indicator = new DamageIndicator(
            this.graphic.position.x,
            this.graphic.position.y,
            value,
            1000,
        );
        this.damageIndicators.push(indicator);
        this.appStage.addChild(indicator.text);
    }
}

export class Fireball extends Base {
    constructor(x, y) {
        super();
        this.graphic.lineStyle(1, 0xFFFF00, 1, 1);
        this.graphic.drawCircle(x, y, 8);
    }
}

export class Rectangle extends Base {
    constructor(x, y, w, h) {
        super(x, y);
        // this.graphic.beginFill(0xFFFF00);
        this.graphic.lineStyle(1, 0xFFFF00, 1, 1);
        this.graphic.drawRect(x, y, w, h);
    }
}

class DamageIndicator {
    constructor(x, y, value, lifeTime) {
        this.offset = 0;
        this.isLife = true;
        this.step = 2;
        this.timeStamp = Date.now();
        this.text = new PIXI.Text(value, {
            fontFamily: 'Iceland',
            fontSize: 24,
            fill: 0xff1010,
            align: 'center',
        });
        this.tick(x, y);
        setTimeout(() => {
            this.isLife = false;
            this.text.visible = false;
        }, lifeTime);
    }

    tick(playerX, playerY) {
        if (Date.now() - this.timeStamp >= 300) {
            this.text.alpha = this.text.alpha - 0.02;
        }
        this.offset = this.offset + this.step;
        this.text.x = playerX;
        this.text.y = playerY - 60 - this.offset;
    }
}
