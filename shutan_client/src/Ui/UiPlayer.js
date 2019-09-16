import * as img1 from '../assets/p1_front.png';
import * as img2 from '../assets/p2_front.png';

export default class UiPlayer {
    constructor(name, position, type) {
        this._name = name;
        this._position = position;
        this.type = type;
        this.status = '';
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
            this.button.textContent = 'ready?';
        }
        if (this.type === 'player') {
            this.button.addEventListener('click', this.toggleReadyStatus.bind(this));
        }
        this.toggleReadyHandler = () => { };
    }

    toggleReadyStatus() {
        this.status = this.status === 'ready' ? 'connected' : 'ready';
        this.toggleReadyHandler(this.status);
    }

    setStatus(status) {
        if (status === 'ready') {
            this.button.textContent = 'ready!!!';
        } else {
            this.button.textContent = 'ready?';
        }
    }

    setName(name) {
        this.stopWaitAnimation();
        this._name = name;
        this.uiName.textContent = name;
        this.playerImg.style.display = 'block';
        this.button.textContent = 'ready?';
    }

    setPosition(position) {
        this._position = position;
        this.playerImg.src = this.images[this._position];
        this.uiNode.classList.remove('left');
        this.uiNode.classList.remove('right');
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
        window.clearInterval(this.waitAnimationId);
    }
}
