document.getElementById('commencer').addEventListener('click', () => {
    let nom = document.getElementById('nom').value;
    localStorage.setItem('nom',nom);
    window.open('../../simple/index.html');
});
