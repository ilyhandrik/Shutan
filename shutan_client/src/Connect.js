export default class Connect {
    constructor(playerName) {
        this.playerName = playerName;

        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onopen = () => {
            this.socket.onmessage = (event) => {
                this.messageHandler(event.data);
            };
            this.send('connect', this.playerName);
        };
    }

    messageCallback() {
        console.log(`Messages callback is empty lol${this.playerName}`);
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
