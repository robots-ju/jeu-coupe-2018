const socket = io.connect('http://127.0.0.1:8080');

function sendProgramme(blocks) {
    console.log('run', blocks);

    socket.emit('run', {
        robot: 1,
        blocks,
    });
}

document.getElementById('test').addEventListener('click', () => {
    sendProgramme(['forward', 'forward']);
});
