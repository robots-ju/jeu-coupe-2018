document.getElementById('commencer').addEventListener('click', () => {
    let nom = document.getElementById('nom').value;
    localStorage.setItem('nom',nom);
    window.open('../../simple/index.html');
});
document.addEventListener('DOMContentLoaded', () => {

    alert("Bienvenue sur le Jeu de la Coupe Robots-JU 2018 ! Veuillez prendre connaissance des règles et des commandes. Si vous avez des questions, n'hésitez pas les à poser au responsable de la partie. Dès que vous êtes prêts, cliquez sur le bouton Commencer la partie. Bon jeu !");
}, false);
