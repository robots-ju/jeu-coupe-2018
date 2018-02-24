const Manager = require('./ev3/BrickManager');

const manager = new Manager();
manager.bind();

manager.on('foundBrick', brick => {
    if (process.argv.slice(2).indexOf(brick.name) === -1) {
        return;
    }

    brick.connect();
    brick.on('ready', () => {
        console.log('Ready');

        //brick.sendMailboxMessage('test', 'hello world');

        setInterval(() => {
            brick.readFile('../prjs/LectureFichiers/score.rtf');
        }, 5000);

        brick.on('fileContent', file => {
            console.log(file);
        });
    });
});
