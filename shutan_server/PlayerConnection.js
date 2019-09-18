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
    }

    messageCallback(type, data) {
        switch (type) {
            case 'connect': this.name = data;
                break;
            case 'ready_status': this.status = data;
                this.statusHandler(this.status);
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