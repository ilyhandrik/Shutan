'use strict';

module.exports = class PlayerConnection {
    constructor(name, socket) {
        this.name = name;
        this.status = 'connect';
        this.socket = socket;
        this.socket.on('message', messageString => {
            this.messageHandler(messageString);
        });
        this.statusHandler = () => {};
        this.gameHandler = () => {};
    }

    messageCallback(type, data) {
        console.log('from player Connection')
        switch (type) {
            case 'connect': this.name = data;
                break;
            case 'ready_status': this.status = data;
                this.statusHandler(this.status);
                break;
            case 'game': this.gameHandler(this.name, type, data);
                break;
        }
    }

    messageHandler(messageString) {
        console.log(messageString);
        const message = JSON.parse(messageString);
        this.messageCallback(message.type, message.data);
    }

    send(type, data = '') {
        const sendJSON = JSON.stringify({ type, data });
        this.socket.send(sendJSON);
    }
}