const socket = io.connect('http://127.0.0.1:8080');

let code = [];

// Numéro du robot contrôlé
const robot = 1;

socket.on('scoreChanged', change => {
    if (change.robot === robot) {
        document.getElementById('score').innerText = change.score;
    }
});

function resetScore() {
    socket.emit('resetScore', {
        robot,
    });
}

function sendProgramme(blocks) {
    console.log('run', blocks);

    socket.emit('run', {
        robot,
        blocks,
    });

    if (document.getElementById('effacer-envoi').checked) {
        code = [];
        affichecode();
    }
}

function affichecode() {
    document.getElementById('affichecode').innerHTML = code.map(block => '<img src="./Medias/' + block + '.png" width="80" height="80" >').join('');
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

document.getElementById('resetScore').addEventListener('click', () => {
    resetScore();
});

document.addEventListener('DOMContentLoaded', () => {
    let nom = localStorage.getItem('nom');

    document.getElementById('nom').textContent = nom;
}, false);
