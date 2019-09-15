import * as img1 from '../assets/p1_front.png';
import * as img2 from '../assets/p2_front.png';

export default class UiPlayer {
    constructor(name, position, type) {
        this._name = name;
        this._position = position;
        this.type = type;
        this.images = {
            left: img1,
            right: img2,
        };
        this.uiNode = document.querySelector(`.player_${this.type}`);
        this.uiName = this.uiNode.querySelector('.playerName');
        this.button = this.uiNode.querySelector('.buttonReady');
        this.playerImg = document.createElement('img');
        this.uiNode.insertBefore(this.playerImg, this.uiName);
        this.playerImg.src = this.images[this._position];
        this.position = position;
        this.name = name;
        this.waitAnimationId = null;
        if (!this.name) {
            this.waitAnimation();
            this.uiName.textContent = 'wait...';
            this.playerImg.style.display = 'none';
        } else {
            this.uiName.textContent = this.name;
            this.button.textContent = 'ready';
        }
    }

    setName(name) {
        this._name = name;
        this.uiName.textContent = name;
        this.playerImg.style.display = 'block';
        this.button.textContent = 'ready';
    }

    setPosition(position) {
        this._position = position;
        this.playerImg.src = this.images[this.position];
        this.uiNode.classList.add(position);
    }

    readyButtonHandler() {
        this.button.classList.add('button_ready');
    }

    waitAnimation() {
        this.waitAnimationId = setInterval(() => {
            if (this.button.textContent.length < 4) {
                this.button.textContent += '/';
            } else {
                this.button.textContent = '/';
            }
        }, 300);
    }

    stopWaitAnimation() {
        window.clearInteval(this.waitAnimationId);
    }
}
