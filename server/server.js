const http = require('http');
const io = require('socket.io');
const Manager = require('./ev3/Manager');

// HTTP
const httpServer = http.createServer();
const httpPort = 8080;
httpServer.listen(httpPort);
console.log(`HTTP :${httpPort} ok`);

// SOCKET.IO
const socket = io.listen(httpServer);

const mindstormsBlocks = {
    forward: 1,
    backward: 2,
    left: 3,
    right: 4,
    grab: 5,
    release: 6,
};

function socketProgramToMindstormsProgram(blocks) {
    // Remplace chaque nom de bloc par son code mindstorms
    // Convertit chaque code mindstorm en texte
    // Concatène chaque code en une seule chaîne
    // Convertit la chaîne finale en nombre
    return parseInt(blocks.map(block => mindstormsBlocks[block] + '').join(''));
}

socket.on('connection', client => {
    console.log('Client connected');

    client.on('run', run => {
        if (run.robot > manager.bricks.length) {
            console.error('Brique ' + run.robot + ' demandée, mais pas dans la liste');

            return;
        }

        const brick = manager.bricks[run.robot - 1];

        if (!brick.ready) {
            console.error('Brique ' + run.robot + ' demandée mais pas prête');

            return;
        }

        brick.sendMailboxMessage('run', socketProgramToMindstormsProgram(run.blocks));
    });
});

const manager = new Manager();
manager.bind();

manager.on('foundBrick', brick => {
    brick.connect();
    brick.on('ready', () => {
        console.log('Nouvelle brique connectée. Liste des briques:');

        manager.bricks.forEach((brick, index) => {
            console.log('#' + (index + 1) + ' - Nom: ' + brick.name + ' - SN: ' + brick.serialNumber);
        });
    });
});
