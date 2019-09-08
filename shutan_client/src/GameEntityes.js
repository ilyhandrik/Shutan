import * as PIXI from 'pixi.js';

export class Base {
    constructor(x,y) {
        this.graphic = new PIXI.Graphics();
    }

    move(x, y) {
        this.graphic.position.x = x;
        this.graphic.position.y = y;
    }
}

export class Player extends Base {
    constructor(x, y, r) {
        super(x,y);
        this.graphic.beginFill(0xFFFFFF);
        this.graphic.drawCircle(x, y, r);
    }
}

export class Fireball extends Base {
    constructor(x, y) {
        super(x,y);
        this.graphic.beginFill(0xFFFF00);
        this.graphic.drawCircle(x, y, 8);
    }
}

export class Rectangle extends Base {
    constructor(x, y, w, h) {
        super(x,y);
        this.graphic.beginFill(0xFFFF00);
        this.graphic.lineStyle(2, 0xFFFF00);
        this.graphic.drawRect(x, y, w, h);
    }
}