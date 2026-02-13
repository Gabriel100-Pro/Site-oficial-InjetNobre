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
    
    if( quantity <= 99.99){
        alert("A quantidade mínima é de 100 peças.");
        document.querySelector('.qnt-peça').value = null;
        document.querySelector('.total-value').textContent = `R$ 0.00`;
    }
}

document.querySelector('.calculate-valor').addEventListener('click', calculateTotal);

// --- Carrinho: adiciona produtos ao clicar em `.adi-car-2` ---
const CART_KEY = 'injetnobre_cart_v1';

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartBadge() {
    const cart = loadCart();
    const totalItems = cart.reduce((s, p) => s + p.quantity, 0);
    const badge = document.querySelector('.cart-count');
    if (badge) badge.textContent = totalItems;
}

function parsePrice(text) {
    // espera formato "R$ 2,50" ou "2.50"
    if (!text) return 0;
    const n = text.replace(/[R$\s\.]/g, '').replace(',', '.');
    const parsed = parseFloat(n);
    return isNaN(parsed) ? 0 : parsed;
}

document.querySelectorAll('.adi-car-2').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.box-1') || btn.closest('.box-two-box');
        const nameEl = card ? card.querySelector('h3') : null;
        const priceEl = card ? card.querySelector('.preco') : null;
        const name = nameEl ? nameEl.textContent.trim() : 'Produto';
        const price = priceEl ? parsePrice(priceEl.textContent) : 2.5;

        const cart = loadCart();
        const existing = cart.find(i => i.name === name && i.price === price);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: Date.now().toString(36), name, price, quantity: 1 });
        }
        saveCart(cart);
        updateCartBadge();

        // feedback imediato no botão
        const originalText = btn.textContent;
        btn.classList.add('added');
        btn.textContent = 'Adicionado ✓';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.textContent = originalText;
        }, 1200);
    });
});

// Atualiza badge no carregamento
updateCartBadge();