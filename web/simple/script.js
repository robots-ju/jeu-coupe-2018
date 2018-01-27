const socket = io.connect('http://127.0.0.1:8080');

let code = ([]);
console.log(code);

function sendProgramme(blocks) {
    console.log('run', blocks);

    socket.emit('run', {
        robot: 1,
        blocks,
    });
};

document.getElementById('send').addEventListener('click', () => {
    sendProgramme(code);
});

document.getElementById('avancer').addEventListener('click', () => {
    code.push('forward');
});
document.getElementById('reculer').addEventListener('click', () => {
    code.push('backward');
});
document.getElementById('droite').addEventListener('click', () => {
    code.push('right');
});
document.getElementById('gauche').addEventListener('click', () => {
    code.push('left');
});
document.getElementById('ouvert').addEventListener('click', () => {
    code.push('release');
});
document.getElementById('fermer').addEventListener('click', () => {
    code.push('grab');
});
