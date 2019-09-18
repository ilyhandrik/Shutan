const WebSocket = require('ws');
const Matter = require('matter-js');
const matterFix = require('./matterFix');
const PlayerConnection  = require('./PlayerConnection');
const Room  = require('./Room');

const fix = new matterFix();

const { Engine, World, Render, Bodies } = Matter;
const engine = Engine.create(fix.options);

class Scene {
    constructor(x, y, w, h) {
        const options = {
            collisionFilter: {
                mask: 6,
                category: 8,
            },
            isStatic: true 
        }
        this.matter = Bodies.rectangle(x, y, w, h, options);
    }
}
class Player {
    constructor(x, y, r) {
        const options = {
            collisionFilter: {
                category: 2,
                mask: 8,
            },
        };
        this.matter = Bodies.circle(x, y, r, options);
    }
}

class FireBall {
    constructor(x, y) {
        const r = 8;
        const options = {
            collisionFilter: {
                category: 4,
            },
        };
        this.matter = Bodies.circle(x, y, 1, options);
    }
}

const scene = new Scene(0, 680, 1500, 200);
const player = new Player(515, 0, 30);

World.add(engine.world, [scene.matter, player.matter]);
Engine.run(engine);
// engine.timing.timeScale = 0.5; lol

const fireBallArray = [];

const fire = function fire(v) {
    const v1 = { x: player.matter.position.x - 500, y: player.matter.position.y };
    const v2 = { x: v.x - 500, y: v.y };
    const v3 = Matter.Vector.angle(v1, v2);
    const v4 = Matter.Vector.rotate({ x: 0.0003, y: 0.00 }, v3);
    console.log(v1);
    console.log(v2);
    console.log(v3);
    console.log(v4);
    const fireBall = new FireBall(v1.x, v1.y);
    fireBallArray[0] = fireBall;
    World.add(engine.world, fireBall.matter);
    Matter.Body.applyForce(fireBall.matter, v1, v4);
}

const fireBall = new FireBall(0, 0);
fireBallArray[0] = fireBall;
World.add(engine.world, fireBall.matter);
const wss = new WebSocket.Server({
    port: 8080,
});

const playerConnections = [];
const rooms = [];

const getName = (socket) => new Promise((resolve, reject) => {
    socket.on('message', messageString => {
        const message = JSON.parse(messageString);
        if(message.type === 'connect') {
            resolve(message.data);
        }
    });
});

const connectHandler = function (socket) {
    getName(socket).then((name) => {
        const newPlayer = new PlayerConnection(name, socket);
        const readyPlayer = playerConnections.find(connection => (connection.status === 'connect'));
        if (readyPlayer) {
            rooms.push(new Room([readyPlayer, newPlayer]));
        } else  {
            newPlayer.send('wait', {
                position: 'left',
                name: name,
            });
        }
        playerConnections.push(newPlayer);
    })
};

const messageHandler = function(messageString) {
    const message = JSON.parse(messageString);
    console.log(messageString);
    switch (message.type) {
        case 'connect': console.log('player ' + message.data + ' connected!');
    }
}


wss.on('connection', connectHandler);

/* wss.on('connection', ws => {
    ws.on('message', messageString => {
        const message = JSON.parse(messageString);
        switch (message.type) {
            case 'move':
                switch (message.data) {
                    case 'up':
                        player.matter.force = { x: 0, y: -0.07 };
                        break;
                    case 'down':
                        player.matter.force = { x: 0, y: 0.07 };
                        break;
                    case 'left':
                        player.matter.force = { x: -0.07, y: 0 };
                        break;
                    case 'right':
                        player.matter.force = { x: 0.07, y: 0 };
                        break;
                    default: break;
                }
                break;
            case 'fire':
                fire(message.data);
                break;
            default: break;
        }
    });
    setInterval(() => {
        const array = new Float32Array(2);
        array[0] = player.matter.position.x;
        array[1] = player.matter.position.y;
        ws.send(array);
        const fireballs = fireBallArray.map((el, index) => ({
            id: index,
            x: el.matter.position.x,
            y: el.matter.position.y,
        }))
        const data = {
            type: 'frameData',
            data: {
                player: {
                    x: player.matter.position.x,
                    y: player.matter.position.y,
                },
                fireballs: {
                    x: fireBallArray[0].matter.position.x,
                    y: fireBallArray[0].matter.position.y,
                },
            },
        }
        ws.send(JSON.stringify(data));
    }, 16);
}); */