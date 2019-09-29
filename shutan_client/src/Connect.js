export default class Connect {
    constructor(playerName) {
        this.playerName = playerName;

        // this.socket = new WebSocket('ws://130.61.122.38:3000');
        this.socket = new WebSocket('ws://localhost:3000');
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
