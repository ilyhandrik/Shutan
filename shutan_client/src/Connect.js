export default class Connect {
    constructor(playerName) {
        this.playerName = playerName;

        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onopen = () => {
            this.socket.onmessage = (event) => {
                this.messageHandler(event.data);
            };
        };
    }

    messageCallback() {
        console.log(`Messages callback is empty${this.playerName}`);
    }

    messageHandler(messageString) {
        const message = JSON.parse(messageString);
        this.messageCallback(message.type, message.data);
    }

    send(type, data) {
        const sendJSON = JSON.stringify({ type, data });
        this.socket.send(sendJSON);
    }
}
