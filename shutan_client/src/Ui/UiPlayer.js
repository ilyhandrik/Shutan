import * as img1 from '../assets/p1_front.png';
import * as img2 from '../assets/p2_front.png';

export default class UiPlayer {
    constructor(name, position) {
        this.images = {
            left: img1,
            right: img2,
        };
        this.name = name;
        this.position = position;
        this.uiNode = document.querySelector(`.player_${this.position}`);
        this.uiName = this.uiNode.querySelector('.playerName');
        this.button = this.uiNode.querySelector('.buttonReady');
        this.uiName.textContent = this.name;
        this.playerImg = document.createElement('img');
        this.uiNode.insertBefore(this.playerImg, this.uiName);
        this.playerImg.src = this.images[this.position];
        this.button.textContent = 'ready';
    }
}
