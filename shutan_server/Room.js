module.exports = class Room {
    constructor(players) {
        this.players = players;
        this.leftPlayer = players[0];
        this.rightPlayer = players[1];
        this.setToPlayers('status', 'connect');
        this.setToPlayers('statusHandler', this.changeStatus.bind(this));
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
            this.sendAllPlayers('start');
        }
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