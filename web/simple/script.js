const socket = io.connect('http://127.0.0.1:8080');

let code = [];

function sendProgramme(blocks) {
    console.log('run', blocks);

    socket.emit('run', {
        robot: 1,
        blocks,
    });

    if (document.getElementById('effacer-envoi').checked) {
        code = [];
        affichecode();
    }
}

function affichecode() {
    document.getElementById('affichecode').innerHTML = code.map(block => '<li>' + block + '</li>').join('');
}

function ajout(block) {
    if (code.length < 7) {
        code.push(block);
        affichecode();
    }
}

document.getElementById('send').addEventListener('click', () => {
    sendProgramme(code);
    affichecode();
});

document.getElementById('avancer').addEventListener('click', () => {
    ajout('forward');

});
document.getElementById('reculer').addEventListener('click', () => {
    ajout('backward');

});
document.getElementById('droite').addEventListener('click', () => {
    ajout('right');

});
document.getElementById('gauche').addEventListener('click', () => {
    ajout('left');

});
document.getElementById('ouvert').addEventListener('click', () => {
    ajout('release');

});
document.getElementById('fermer').addEventListener('click', () => {
    ajout('grab');

});
document.getElementById('reset').addEventListener('click', () => {
    code = [];
    affichecode();
});
document.getElementById('Delone').addEventListener('click', () => {
    code.pop();
    affichecode();
});

document.addEventListener('DOMContentLoaded', () => {
    let nom = localStorage.getItem('nom');

    document.getElementById('nom').textContent = nom;
}, false);
