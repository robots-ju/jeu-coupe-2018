const socket = io.connect('http://127.0.0.1:8080');

let code = [];
console.log(code);

function sendProgramme(blocks) {
    console.log('run', blocks);

    socket.emit('run', {
        robot: 1,
        blocks,
    });
};

function affichecode () {
document.getElementById("affichecode").innerHTML = code.map(block => "<li>" + block + "</li>").join("");

}

document.getElementById('send').addEventListener('click', () => {
    sendProgramme(code);
    affichecode();
});

document.getElementById('avancer').addEventListener('click', () => {
    code.push('forward');
    affichecode();
});
document.getElementById('reculer').addEventListener('click', () => {
    code.push('backward');
    affichecode();
});
document.getElementById('droite').addEventListener('click', () => {
    code.push('right');
    affichecode();
});
document.getElementById('gauche').addEventListener('click', () => {
    code.push('left');
    affichecode();
});
document.getElementById('ouvert').addEventListener('click', () => {
    code.push('release');
    affichecode();
});
document.getElementById('fermer').addEventListener('click', () => {
    code.push('grab');
    affichecode();
});
document.getElementById('reset').addEventListener('click', () => {
    code = [];
    console.log(code);
    affichecode();
});
document.getElementById('Delone').addEventListener('click', () => {
    code.pop()
    affichecode();
});
