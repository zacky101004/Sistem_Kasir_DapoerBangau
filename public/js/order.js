const Addtocart = document.querySelectorAll('.AddtoCart');
const Removetocart = document.querySelectorAll('.RemovetoCart');

const menu_item_cart = document.querySelectorAll('.menu-item-cart')
const cartProduct = document.querySelectorAll('.cart-product');
const nameProduct = document.querySelectorAll('.product h5');
const priceProduct = document.querySelectorAll('.product h6');
let list_Product = [];

const qty_numbers = document.querySelectorAll('.qty-numbers');
const menu_order = document.querySelector('.menu-order');
const clear_order = document.querySelector('.clear-order');
let arr = []; 

let total_price = 0; 
const subtotal = document.querySelector('.cart-payment .sub-total');
const total_transaction = document.querySelector('.cart-payment .total-transaction ');
const input_transaction = document.querySelector('.section-transaction input');
const menu_id = document.getElementById('menu_id');

const tableButtons = document.querySelectorAll('.table-btn');
let table_selected = [];
let table_click = [];


Addtocart.forEach((e, i) => {
    e.addEventListener('click', () => {
        let valueQty = parseInt(qty_numbers[i].innerText);
        let qty = 0;
        qty = valueQty + 1;
        qty_numbers[i].innerText = qty;
        let idProduct = menu_item_cart[i].getAttribute('data-id');
        if (!arr.includes(i)) {
            arr.push(i);
            list_Product.push({'menu_id' : idProduct, 'qty' : qty, 'price' : parseInt(priceProduct[i].innerText.split(".").join('')) });
            menu_order.innerHTML += 
            `<div class="cart-product d-flex flex-column rounded mb-4" data-cart="${i}" data-id="">
                <div class="product-order">
                    <h5 class="text-white ms-4 mt-3" style="font-size: 18px;">${nameProduct[i].innerText}</h5>
                    <h6 class="text-white ms-4 mb-3" style="font-size: 12px;">${priceProduct[i].innerText}</h6>
                </div>
                <div class="qty d-flex justify-content-between w-25 ms-4 mb-3">
                    <i onclick="remove(this)" class="btn-remove-inner fa-solid fa-minus" style="color: #fff;"></i>
                    <div class="qty-numbers text-white me-2 ms-2">
                        1
                    </div>
                    <i onclick="add(this)" class="btn-add-inner fa-solid fa-plus" style="color: #fff;"></i>
                </div>
            </div>`;
        }else {
            list_Product.find(product => product.menu_id == idProduct).qty = qty;
            list_Product.find(product => product.menu_id == idProduct).price = parseInt(priceProduct[i].innerText.split(".").join('')) * qty;
            document.querySelector(`[data-cart='${i}']`).innerHTML = 
            ` <div class="product-order">
                    <h5 class="text-white ms-4 mt-3" style="font-size: 18px;">${nameProduct[i].innerText}</h5>
                    <h6 class="text-white ms-4 mb-3" style="font-size: 12px;">${priceProduct[i].innerText}</h6>
                </div>
                <div class="qty d-flex justify-content-between w-25 ms-4 mb-3">
                    <i onclick="remove(this)" class="btn-remove-inner fa-solid fa-minus" style="color: #fff;"></i>
                    <div class="qty-numbers text-white me-2 ms-2">
                        ${qty}
                    </div>
                    <i onclick="add(this)" class="btn-add-inner fa-solid fa-plus" style="color: #fff;"></i>
                </div>`
        }
        total_price += parseInt(priceProduct[i].innerText.split(".").join(''));
        subtotal.innerText = `Rp ${formatRupiah(total_price.toString())}`;
        total_transaction.innerText = `Rp ${formatRupiah(total_price.toString())}`;
        input_transaction.value = total_price;
        menu_id.value = JSON.stringify(list_Product);
    })
});

Removetocart.forEach((e, i) => {
    e.addEventListener('click', () => {
        let valueQty = parseInt(qty_numbers[i].innerText);
        let qty = 0;
        let idProduct = menu_item_cart[i].getAttribute('data-id');
        if (arr.includes(i)) {
            if (valueQty <= 1) {
                qty = 0;
                let element = document.querySelector(`[data-cart='${i}']`);
                menu_order.removeChild(element);
                arr.splice(arr.indexOf(i),1);
                total_price -= parseInt(priceProduct[i].innerText.split(".").join(''));
                list_Product.splice(list_Product.indexOf(list_Product.find((product) => product.menu_id == idProduct)), 1);
            }else {
                qty = valueQty - 1;
                document.querySelector(`[data-cart='${i}']`).innerHTML = 
                ` <div class="product-order">
                        <h5 class="text-white ms-4 mt-3" style="font-size: 18px;">${nameProduct[i].innerText}</h5>
                        <h6 class="text-white ms-4 mb-3" style="font-size: 12px;">${priceProduct[i].innerText}</h6>
                    </div>
                    <div class="qty d-flex justify-content-between w-25 ms-4 mb-3">
                        <i onclick="remove(this)" class="btn-remove-inner fa-solid fa-minus" style="color: #fff;"></i>
                        <div class="qty-numbers text-white me-2 ms-2">
                            ${qty}
                        </div>
                        <i onclick="add(this)" class="btn-add-inner fa-solid fa-plus" style="color: #fff;"></i>
                    </div>`
                total_price -= parseInt(priceProduct[i].innerText.split(".").join(''));
                list_Product.find(product => product.menu_id == idProduct).qty = qty;
                list_Product.find(product => product.menu_id == idProduct).price -= parseInt(priceProduct[i].innerText.split(".").join(''));
            }
            qty_numbers[i].innerText = qty;
            menu_id.value = JSON.stringify(list_Product);
        }
        subtotal.innerText = `Rp ${formatRupiah(total_price.toString())}`;
        total_transaction.innerText = `Rp ${formatRupiah(total_price.toString())}`;
        if (total_price === 0) {
            input_transaction.removeAttribute('value');
        } else {
            input_transaction.value = total_price;
        }
    })
})

let list_table = Array.from(tableButtons);
for (let i = 0; i < tables.length; i++) {
    let btn = list_table.find(b => b.getAttribute("data-number") == tables[i].no_table);
    if (btn) {
        btn.classList.add('sold');
        btn.setAttribute('data-status', 'sold');
    }
}

tableButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
        if (btn.getAttribute('data-status') === 'sold') return;
        let tbl_num = btn.getAttribute("data-number");
        if (btn.classList.contains('selected')) {
            btn.classList.remove('selected');
            table_selected.splice(table_selected.indexOf(tbl_num), 1);
        } else {
            btn.classList.add('selected');
            table_selected.push(tbl_num);
        }
        document.getElementById("table_selected").value = table_selected;
        document.querySelector(".tables-selected").innerText = `Table ${table_selected}`
    });
});

function deleteOrder() {
    qty_numbers.forEach((e,i) => {
        e.innerText = '0';
    });
    menu_order.innerHTML = '';
    list_Product = [];
    arr = [];
    total_price = 0;
    fixed_price = 0;
    subtotal.innerText = 'Rp 0';
    total_transaction.innerText = 'Rp 0';
    input_transaction.removeAttribute('value')
    menu_id.removeAttribute('value')
    document.getElementById("table_selected").value = ' ';
    document.querySelector(".tables-selected").innerText = `Table `;
    table_selected.removeAttribute('value');
    tableButtons.forEach((btn) => {
        if (!btn.classList.contains('sold')) {
            btn.classList.remove('selected');
        }
    });
}

function add(e) {
    let qty_numbers_inner = e.parentElement.parentElement.children[1].children[1];
    let qty_numbers_outers = Addtocart[e.parentElement.parentElement.getAttribute('data-cart')].parentElement.children[1];
    let price_outers = parseInt(priceProduct[e.parentElement.parentElement.getAttribute('data-cart')].innerText.split(".").join(''));
    let list_menu_id = menu_item_cart[e.parentElement.parentElement.getAttribute('data-cart')].getAttribute('data-id');
    let number_count = parseInt(qty_numbers_outers.innerText) + 1;
    
    list_Product.find(product => product.menu_id == list_menu_id).qty = number_count;
    list_Product.find(product => product.menu_id == list_menu_id).price = price_outers * number_count;
    
    qty_numbers_inner.innerText = number_count;
    qty_numbers_outers.innerText = number_count;
    
    total_price += price_outers;
    subtotal.innerText = `Rp ${formatRupiah(total_price.toString())}`;
    total_transaction.innerText = `Rp ${formatRupiah(total_price.toString())}`;
    input_transaction.value = total_price;
    menu_id.value = JSON.stringify(list_Product);

}

function remove(e) {
    let qty_numbers_inner = e.parentElement.parentElement.children[1].children[1];
    let qty_numbers_outers = Addtocart[e.parentElement.parentElement.getAttribute('data-cart')].parentElement.children[1];
    let price_outers = parseInt(priceProduct[e.parentElement.parentElement.getAttribute('data-cart')].innerText.split(".").join(''));
    let list_menu_id = menu_item_cart[e.parentElement.parentElement.getAttribute('data-cart')].getAttribute('data-id');
    let number_count = parseInt(qty_numbers_outers.innerText) - 1;

    if (number_count < 1) {
        list_Product.splice(list_Product.indexOf(list_Product.find((product) => product.menu_id == list_menu_id)), 1);
        menu_order.removeChild(e.parentElement.parentElement);
        qty_numbers_outers.innerText = number_count;
        total_price -= price_outers;
    } else {
        qty_numbers_inner.innerText = number_count;
        qty_numbers_outers.innerText = number_count;
        list_Product.find(product => product.menu_id == list_menu_id).qty = number_count;
        list_Product.find(product => product.menu_id == list_menu_id).price = price_outers * number_count;
        total_price -= price_outers;
    }    

    subtotal.innerText = `Rp ${formatRupiah(total_price.toString())}`;
    total_transaction.innerText = `Rp ${formatRupiah(total_price.toString())}`;
    menu_id.value = JSON.stringify(list_Product);
    if (total_price === 0) {
        input_transaction.removeAttribute('value');
    } else {
        input_transaction.value = total_price;
    }
}
