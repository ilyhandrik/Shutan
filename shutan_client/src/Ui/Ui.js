import UiPlayer from './UiPlayer';

export default class Ui {
    constructor(name, position) {
        this.player = null;
        this.enemy = null;
        this.name = name;
        this.position = position;
        this.page = 'start';
        this.node = document.querySelector('#app');
        this.pixi = document.querySelector('#pixi');
        this.startPage = document.querySelector('#startPage');
        this.lobbyPage = document.querySelector('#lobby');
        this.startContainer = document.querySelector('.start');
        this.startCountdown = document.querySelector('.start_countdown');
        this.startAnimationId = null;
    }

    addPlayer(name, position) {
        this.player = new UiPlayer(name, position, 'player');
    }

    addEnemy(name, position) {
        this.enemy = new UiPlayer(name, position, 'enemy');
    }

    start() {
        this.startContainer.style.display = 'flex';
        this.startAnimation(3);
    }

    startAnimation(duration) {
        this.startCountdown.textContent = duration;
        this.startAnimationId = setInterval(() => {
            let time = parseInt(this.startCountdown.textContent, 10);
            time -= 1;
            this.startCountdown.textContent = time;
            if (time === 0) {
                window.clearInterval(this.startAnimationId);
                document.querySelector('.start_countdown_svg').classList.add('hide');
                setTimeout(() => {
                    this.goGame();
                }, 10);
            }
        }, 50);
    }

    goGame() {
        this.lobbyPage.style.display = 'none';
        this.pixi.style.display = 'block';
    }

    getLobby() {
        this.page = 'lobby';
        this.startPage.style.display = 'none';
        this.lobbyPage.style.display = 'flex';
    }
}
