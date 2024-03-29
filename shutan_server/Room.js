const Game = require('./Game');

module.exports = class Room {
    constructor(players) {
        this.players = players;
        this.leftPlayer = players[0];
        this.rightPlayer = players[1];
        this.setToPlayers('status', 'connect');
        this.setToPlayers('statusHandler', this.changeStatus.bind(this));
        this.setToPlayers('gameHandler', this.gameHandler.bind(this));
        this.sendAllPlayers(
            'connect',
            {
                position: 'left',
                name: players[1].name,
            },
            {
                position: 'right',
                name: players[0].name,
            },
        );
    }

    changeStatus(isReady) {
        this.sendAllPlayers(
            'status',
            {
                player: this.leftPlayer.status,
                enemy: this.rightPlayer.status,
            },
            {
                player: this.rightPlayer.status,
                enemy: this.leftPlayer.status,
            }
        )
        if (this.players.every((player) => player.status === 'ready')) {
            this.start();
        }
    }

    start() {
        this.sendAllPlayers('start');
        this.game = new Game(this.leftPlayer.name, this.rightPlayer.name);
        this.game.tick = this.tickHandler.bind(this);
        this.game.start();
    }
    
    gameHandler(player, type, data) {
        console.log(player + ' - ' + type + ' - ' + data);
        this.game.usersControlHandler(player, type, data);
    }

    tickHandler(data) {
        this.leftPlayer.send('tick', data);
        this.rightPlayer.send('tick', data);
    }

    sendAllPlayers(type, firstPlayerData = null, secondPlayerData = null) {
        this.players[0].send(type, firstPlayerData);
        this.players[1].send(type, secondPlayerData || firstPlayerData);
    }

    setToPlayers(field, firstPlayerData = null, secondPlayerData = null) {
        this.players[0][field] = firstPlayerData;
        this.players[1][field] = secondPlayerData || firstPlayerData;
    }
}