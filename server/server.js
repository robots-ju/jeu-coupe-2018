const http = require('http');
const io = require('socket.io');
const Manager = require('./ev3/BrickManager');
const RobotScore = require('./ev3/RobotScore');

// HTTP
const httpServer = http.createServer();
const httpPort = 8080;
httpServer.listen(httpPort);
console.log(`HTTP :${httpPort} ok`);

// SOCKET.IO
const socket = io.listen(httpServer);

// Les noms de brique se passent en arguments
const allowedBrickNames = process.argv.slice(2);

const availableBricks = [];

const mindstormsBlocks = {
    forward: 1,
    backward: 2,
    left: 3,
    right: 4,
    grab: 5,
    release: 6,
};

let scores = {};

function socketProgramToMindstormsProgram(blocks) {
    // Remplace chaque nom de bloc par son code mindstorms
    // Convertit chaque code mindstorm en texte
    // Concatène chaque code en une seule chaîne
    // Convertit la chaîne finale en nombre
    return parseInt(blocks.map(block => {
        if (typeof mindstormsBlocks[block] === 'undefined') {
            throw new Error('Nom de bloc invalide ' + block);
        }

        return mindstormsBlocks[block] + '';
    }).join(''));
}

socket.on('connection', client => {
    console.log('Client connected');

    client.on('run', run => {
        if (run.robot > availableBricks.length) {
            console.error('Brique ' + run.robot + ' demandée, mais pas dans la liste');

            return;
        }

        const brick = availableBricks[run.robot - 1];

        if (!brick.ready) {
            console.error('Brique ' + run.robot + ' demandée mais pas prête');

            return;
        }

        brick.sendMailboxMessage('run', socketProgramToMindstormsProgram(run.blocks));
    });

    client.on('resetScore', command => {
        console.log('Resetting score for robot ' + command.robot);

        const robotIndex = command.robot - 1;

        if (scores.length > robotIndex) {
            scores[robotIndex].resetScore();
        } else {
            console.error('Demandé à remettre le score du robot ' + command.robot + ' à zéro mais il n\'est pas connecté.');
        }
    });
});

const manager = new Manager();
manager.bind();

function indexFromBrickName(name) {
    return availableBricks.findIndex(brick => brick.name === name);
}

manager.on('foundBrick', brick => {
    if (allowedBrickNames.indexOf(brick.name) === -1) {
        console.info('Détecté la brique ' + brick.name + ' mais elle n\'est pas whitelistée. Pas connecté.');

        return;
    }

    brick.connect();

    brick.on('ready', () => {
        console.log('Nouvelle brique connectée. Liste des briques:');

        availableBricks.push(brick);

        availableBricks.forEach((brick, index) => {
            console.log('#' + (index + 1) + ' - Nom: ' + brick.name + ' - SN: ' + brick.serialNumber);
        });

        const robotScore = new RobotScore();
        robotScore.on('scoreChanged', score => {
            console.log(score);

            socket.emit('scoreChanged', {
                robot: indexFromBrickName(brick.name) + 1,
                score,
            });
        });

        scores[indexFromBrickName(brick.name)] = robotScore;

        setInterval(() => {
            brick.readFile('../prjs/coupe2018/score.rtf');
        }, 5000);
    });

    brick.on('fileContent', file => {
        const scoreOnBrick = parseInt(file.payload.split('\r')[0]);

        scores[indexFromBrickName(brick.name)].seenBrickScore(scoreOnBrick);
    });
});
