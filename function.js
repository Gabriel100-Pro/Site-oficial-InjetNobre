// Menu Hambúrguer
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = navMenu.querySelectorAll('a');

// Toggle do menu ao clicar no ícone
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (event) => {
    const isClickInside = hamburger.contains(event.target) || navMenu.contains(event.target);
    
    if (!isClickInside && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

const qntInput = document.querySelector('.qnt-peça');

function calculateTotal() {
    const quantity = document.querySelector('.qnt-peça').value;
    const valorPeca = 2.50;
    const total = valorPeca * quantity;
    document.querySelector('.total-value').textContent = `R$ ${total.toFixed(2)}`;
    
    
}

document.querySelector('.calculate-valor').addEventListener('click', calculateTotal);