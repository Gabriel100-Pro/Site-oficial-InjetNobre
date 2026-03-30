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
const calcBoxSelect = document.querySelector('.box-type-select');
const addCalcCartButton = document.querySelector('.add-calc-cart');
const PRICE_PER_UNIT = 2.50;

const boxImageMap = {
    'Estojo Clássico': './assets/Estojo individual.webp',
    'Estojo Duplo': './assets/Estojo Duplo.webp',
    'Estojo Múltiplo': './assets/Estojo Multiplo.webp'
};

function getValidCalcQuantity() {
    const rawValue = qntInput ? Number(qntInput.value) : 0;
    const quantity = Number.isFinite(rawValue) ? Math.floor(rawValue) : 0;

    if (quantity < 100) {
        alert('A quantidade mínima é de 100 peças.');
        if (qntInput) qntInput.value = 100;
        return null;
    }

    return quantity;
}

function calculateTotal() {
    const quantity = getValidCalcQuantity();
    if (!quantity) return null;

    const total = PRICE_PER_UNIT * quantity;
    document.querySelector('.total-value').textContent = formatBRL(total);

    return { quantity, total };
}

document.querySelector('.calculate-valor').addEventListener('click', calculateTotal);

// --- Carrinho: adiciona produtos ao clicar em `.adi-car-2` ---
const CART_KEY = 'injetnobre_cart_v1';

function loadCart() {
    try {
        const storedCart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
        if (!Array.isArray(storedCart)) return [];

        return storedCart.map(item => ({
            id: item.id || Date.now().toString(36),
            name: item.name || 'Produto',
            price: Number(item.price) || 0,
            quantity: Math.max(1, Number(item.quantity) || 1),
            boxType: typeof item.boxType === 'string' ? item.boxType : '',
            image: typeof item.image === 'string' ? item.image : '',
            imageAlt: typeof item.imageAlt === 'string' ? item.imageAlt : 'Imagem do produto'
        }));
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

function formatBRL(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

const cartButton = document.querySelector('.btn-pedido');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartSummary = document.getElementById('cart-summary');
const cartTotalItems = document.getElementById('cart-total-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartClearButton = document.getElementById('cart-clear');
const cartConfirmBanner = document.getElementById('cart-confirm-banner');
const confirmClearCartButton = document.getElementById('confirm-clear-cart');
const cancelClearCartButton = document.getElementById('cancel-clear-cart');

function showClearCartBanner() {
    if (!cartConfirmBanner) return;
    cartConfirmBanner.classList.add('is-visible');
    cartConfirmBanner.setAttribute('aria-hidden', 'false');
}

function hideClearCartBanner() {
    if (!cartConfirmBanner) return;
    cartConfirmBanner.classList.remove('is-visible');
    cartConfirmBanner.setAttribute('aria-hidden', 'true');
}

function removeCartItem(itemId) {
    const cart = loadCart();
    const updatedCart = cart.filter(item => item.id !== itemId);
    saveCart(updatedCart);
    updateCartBadge();
    renderCartModal();
}

function clearCart() {
    saveCart([]);
    updateCartBadge();
    renderCartModal();
}

function renderCartModal() {
    if (!cartItemsList || !cartEmpty || !cartSummary || !cartTotalItems || !cartTotalPrice) return;

    const cart = loadCart();
    if (cart.length === 0) {
        cartItemsList.innerHTML = '';
        cartEmpty.style.display = 'block';
        cartSummary.style.display = 'none';
        hideClearCartBanner();
        return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartItemsList.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        const itemImageMarkup = item.image
            ? `<img class="cart-item-image" src="${item.image}" alt="${item.imageAlt || item.name}">`
            : '<div class="cart-item-image cart-item-image-fallback" aria-hidden="true"></div>';

        return `
            <li class="cart-item">
                <div class="cart-item-top">
                    ${itemImageMarkup}
                    <div class="cart-item-text">
                        <p class="cart-item-name">${item.name}</p>
                        ${item.boxType ? `<p class="cart-item-option">Caixa: ${item.boxType}</p>` : ''}
                    </div>
                </div>
                <div class="cart-item-details">
                    <span>Quantidade: ${item.quantity}</span>
                    <span>Unitario: ${formatBRL(item.price)}</span>
                    <span>Subtotal: ${formatBRL(subtotal)}</span>
                    <button class="cart-remove" type="button" data-remove-item="${item.id}">Remover</button>
                </div>
            </li>
        `;
    }).join('');

    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'flex';
    cartTotalItems.textContent = totalItems;
    cartTotalPrice.textContent = formatBRL(totalPrice);
}

function openCartModal() {
    if (!cartModal) return;
    cartModal.classList.add('is-open');
    cartModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    if (!cartModal) return;
    cartModal.classList.remove('is-open');
    cartModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hideClearCartBanner();
}

function addCardProductToCart(card, triggerBtn) {
    const nameEl = card ? card.querySelector('h3') : null;
    const priceEl = card ? card.querySelector('.preco') : null;
    const imageEl = card ? card.querySelector('img') : null;
    const name = nameEl ? nameEl.textContent.trim() : 'Produto';
    const price = priceEl ? parsePrice(priceEl.textContent) : 2.5;
    const image = imageEl ? imageEl.getAttribute('src') || '' : '';
    const imageAlt = imageEl ? imageEl.getAttribute('alt') || name : name;

    const cart = loadCart();
    const existing = cart.find(i => i.name === name && i.price === price);
    if (existing) {
        existing.quantity += 1;
        if (!existing.image && image) {
            existing.image = image;
            existing.imageAlt = imageAlt;
        }
    } else {
        cart.push({ id: Date.now().toString(36), name, price, quantity: 1, image, imageAlt });
    }

    saveCart(cart);
    updateCartBadge();

    if (cartModal && cartModal.classList.contains('is-open')) {
        renderCartModal();
    }

    if (triggerBtn) {
        // feedback imediato no botao
        const originalText = triggerBtn.textContent;
        triggerBtn.classList.add('added');
        triggerBtn.textContent = 'Adicionado ✓';
        setTimeout(() => {
            triggerBtn.classList.remove('added');
            triggerBtn.textContent = originalText;
        }, 1200);
    }
}

document.querySelectorAll('.adi-car-2').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.box-1') || btn.closest('.box-two-box');
        addCardProductToCart(card, btn);
    });
});

if (addCalcCartButton) {
    addCalcCartButton.addEventListener('click', () => {
        const calcData = calculateTotal();
        if (!calcData) return;

        const selectedBoxType = calcBoxSelect ? calcBoxSelect.value : 'Estojo Clássico';
        const image = boxImageMap[selectedBoxType] || '';
        const cart = loadCart();
        const existing = cart.find(item => item.name === 'Pedido em Lote' && item.boxType === selectedBoxType);

        if (existing) {
            existing.quantity += calcData.quantity;
        } else {
            cart.push({
                id: Date.now().toString(36),
                name: 'Pedido em Lote',
                boxType: selectedBoxType,
                price: PRICE_PER_UNIT,
                quantity: calcData.quantity,
                image,
                imageAlt: selectedBoxType
            });
        }

        saveCart(cart);
        updateCartBadge();
        if (cartModal && cartModal.classList.contains('is-open')) {
            renderCartModal();
        }

        const originalText = addCalcCartButton.textContent;
        addCalcCartButton.textContent = 'Adicionado ✓';
        setTimeout(() => {
            addCalcCartButton.textContent = originalText;
        }, 1000);
    });
}

const heroAddButton = document.querySelector('.adi-car');
if (heroAddButton) {
    heroAddButton.addEventListener('click', () => {
        const firstCard = document.querySelector('#catalog .box-1');
        addCardProductToCart(firstCard, heroAddButton);
    });
}

// Atualiza badge no carregamento
updateCartBadge();

if (cartButton && cartModal) {
    cartButton.addEventListener('click', () => {
        renderCartModal();
        openCartModal();
    });

    cartModal.querySelectorAll('[data-close-cart]').forEach(element => {
        element.addEventListener('click', closeCartModal);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && cartModal.classList.contains('is-open')) {
            closeCartModal();
        }
    });
}

if (cartItemsList) {
    cartItemsList.addEventListener('click', (event) => {
        const removeButton = event.target.closest('[data-remove-item]');
        if (!removeButton) return;

        const itemId = removeButton.getAttribute('data-remove-item');
        if (!itemId) return;
        removeCartItem(itemId);
    });
}

if (cartClearButton) {
    cartClearButton.addEventListener('click', showClearCartBanner);
}

if (confirmClearCartButton) {
    confirmClearCartButton.addEventListener('click', () => {
        clearCart();
        hideClearCartBanner();
    });
}

if (cancelClearCartButton) {
    cancelClearCartButton.addEventListener('click', hideClearCartBanner);
}

// Setas do carrossel de produtos no mobile
const cardsTrack = document.querySelector('#catalog');
const cardsArrowLeft = document.querySelector('.cards-arrow-left');
const cardsArrowRight = document.querySelector('.cards-arrow-right');

if (cardsTrack && cardsArrowLeft && cardsArrowRight) {
    let isPointerDragging = false;
    let pointerStartX = 0;
    let scrollStartLeft = 0;

    const getScrollStep = () => {
        const firstCard = cardsTrack.querySelector('.box-1');
        if (!firstCard) return 220;

        const cardWidth = firstCard.getBoundingClientRect().width;
        const trackStyle = window.getComputedStyle(cardsTrack);
        const gap = parseFloat(trackStyle.gap || '0') || 0;
        return cardWidth + gap;
    };

    const updateArrowState = () => {
        const maxScrollLeft = cardsTrack.scrollWidth - cardsTrack.clientWidth;
        cardsArrowLeft.disabled = cardsTrack.scrollLeft <= 5;
        cardsArrowRight.disabled = cardsTrack.scrollLeft >= maxScrollLeft - 5;
    };

    cardsArrowLeft.addEventListener('click', () => {
        cardsTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    cardsArrowRight.addEventListener('click', () => {
        cardsTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    cardsTrack.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        if (event.target.closest('button, a, input, textarea, select, label')) return;

        isPointerDragging = true;
        pointerStartX = event.clientX;
        scrollStartLeft = cardsTrack.scrollLeft;
        cardsTrack.style.scrollBehavior = 'auto';
        cardsTrack.setPointerCapture(event.pointerId);
    });

    cardsTrack.addEventListener('pointermove', (event) => {
        if (!isPointerDragging) return;

        const deltaX = event.clientX - pointerStartX;
        cardsTrack.scrollLeft = scrollStartLeft - deltaX;
    });

    const stopPointerDrag = (event) => {
        if (!isPointerDragging) return;

        isPointerDragging = false;
        cardsTrack.style.scrollBehavior = 'smooth';

        if (event && cardsTrack.hasPointerCapture(event.pointerId)) {
            cardsTrack.releasePointerCapture(event.pointerId);
        }
    };

    cardsTrack.addEventListener('pointerup', stopPointerDrag);
    cardsTrack.addEventListener('pointercancel', stopPointerDrag);
    cardsTrack.addEventListener('pointerleave', stopPointerDrag);

    cardsTrack.addEventListener('scroll', updateArrowState);
    window.addEventListener('resize', updateArrowState);
    updateArrowState();
}