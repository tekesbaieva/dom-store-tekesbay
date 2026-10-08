
class Store {
    constructor() {
        this.items = [];
    }

    addItem(name, price, qty) {
        const newItem = {
            id: Date.now(), // бірегей ID
            name: name.trim(),
            price: Number(price),
            qty: Number(qty)
        };
        this.items.push(newItem);
    }

    removeItem(id) {
        this.items = this.items.filter(item => item.id !== id);
    }

    updateQty(id, newQty) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.qty = Number(newQty);
        }
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }
}


const store = new Store();


const form = document.getElementById('product-form');
const nameInput = document.getElementById('name');
const priceInput = document.getElementById('price');
const qtyInput = document.getElementById('qty');
const productList = document.getElementById('product-list');
const grandTotal = document.getElementById('grand-total');


const nameError = document.getElementById('name-error');
const priceError = document.getElementById('price-error');
const qtyError = document.getElementById('qty-error');


function render() {
    productList.innerHTML = '';

    store.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price} ₸</td>
            <td>
                <input type="number" class="qty-input" data-id="${item.id}" value="${item.qty}" min="1" style="width: 60px;">
            </td>
            <td>${item.price * item.qty} ₸</td>
            <td>
                <button class="delete-btn" data-id="${item.id}" style="background-color: #dc3545;">Жою</button>
            </td>
        `;
        productList.appendChild(tr);
    });

    
    grandTotal.textContent = store.getTotal();
}


form.addEventListener('submit', (e) => {
    e.preventDefault();

    
    nameError.textContent = '';
    priceError.textContent = '';
    qtyError.textContent = '';

    let isValid = true;
    const nameVal = nameInput.value.trim();
    const priceVal = Number(priceInput.value);
    const qtyVal = Number(qtyInput.value);

    
    if (nameVal === '') {
        nameError.textContent = 'Атауы бос болмауы керек!';
        isValid = false;
    }

    if (isNaN(priceVal) || priceVal <= 0) {
        priceError.textContent = 'Бағасы 0-ден үлкен болуы тиіс!';
        isValid = false;
    }

    if (isNaN(qtyVal) || qtyVal <= 0) {
        qtyError.textContent = 'Саны дұрыс сан болуы тиіс!';
        isValid = false;
    }

    if (!isValid) return;

    
    store.addItem(nameVal, priceVal, qtyVal);
    
    
    render();
    
    
    form.reset();
});


productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const id = Number(e.target.getAttribute('data-id'));
        store.removeItem(id);
        render();
    }
});

productList.addEventListener('input', (e) => {
    if (e.target.classList.contains('qty-input')) {
        const id = Number(e.target.getAttribute('data-id'));
        const newQty = e.target.value;
        if (newQty > 0) {
            store.updateQty(id, newQty);
            render(); // немесе тек total-ды жаңартуға болады
        }
    }
});
