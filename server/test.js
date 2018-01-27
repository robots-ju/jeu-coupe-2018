const Manager = require('./ev3/Manager');

const manager = new Manager();
manager.bind();

manager.on('foundBrick', brick => {
    brick.connect();
    brick.on('ready', () => {
        brick.sendMailboxMessage('test', 'hello world');
    });
});
