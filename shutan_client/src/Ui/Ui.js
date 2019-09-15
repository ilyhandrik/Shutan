import UiPlayer from './UiPlayer';

export default class Ui {
    constructor(name, position) {
        this.player = null;
        this.enemy = null;
        this.name = name;
        this.position = position;
        this.page = 'start';
        this.node = document.querySelector('#app');
        this.startPage = document.querySelector('#startPage');
        this.lobbyPage = document.querySelector('#lobby');
    }

    addPlayer(name, position) {
        this.player = new UiPlayer(name, position, 'player');
    }

    addEnemy(name, position) {
        this.enemy = new UiPlayer(name, position, 'enemy');
    }

    getLobby() {
        this.page = 'lobby';
        this.startPage.style.display = 'none';
        this.lobbyPage.style.display = 'flex';
    }
}
