document.getElementById('commencer_simple').addEventListener('click', () => {
    let nom = document.getElementById('nom').value;
    localStorage.setItem('nom',nom);
    window.open('../../simple/index.html');
});

document.getElementById('commencer_autre').addEventListener('click', () => {
    let nom = document.getElementById('nom').value;
    localStorage.setItem('nom',nom);
    window.open('../../Interface/game/index.html');
});
