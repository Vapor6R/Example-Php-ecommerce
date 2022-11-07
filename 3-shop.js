var shop = {
  // (A) HELPER - AJAX FETCH
  fetch : (data, after) => {
    // (A1) FORM DATA
    let form;
    if (data instanceof FormData) { form = data; }
    else {
      form = new FormData();
      for (let [k, v] of Object.entries(data)) { form.append(k, v); }
    }

    // (A2) FETCH
    fetch("1-lib.php", { method : "post", body : form })
    .then(res => res.text())
    .then(txt => after(txt))
    .catch(err => console.error(err));
  },

  // (B) PROPERTIES
  hPdt : null, // html products
  hCart : null, // html cart
  hCCart : null, // html cart count
  hCO : null, // html checkout wrapper
  hCOF : null, // html checkout form
  products : null, // products list
  cart : null, // cart items
  qty : 0, // cart total item quantity
  total : 0, // cart total amount

  // (C) INITIALIZE
  init : () => {
    // (C1) GET HTML ELEMENTS
    shop.hPdt = document.getElementById("products");
    shop.hCart = document.getElementById("cart");
    shop.hCCart = document.getElementById("cCart");
    shop.hCO = document.getElementById("checkout");
    shop.hCOF = document.querySelector("#checkout form");

    // (C2) CLICK TO TOGGLE CART
    document.getElementById("iCart").onclick = () => {
      document.getElementById("wCart").classList.toggle("show");
    };

    // (C3) RESTORE CART
    shop.cart = localStorage.getItem("cart");
    if (shop.cart == null) { shop.cart = {}; }
    else { shop.cart = JSON.parse(shop.cart); }

    // (C4) LOAD PRODUCTS > DRAW HTML
    shop.fetch({"req": "get"}, data => {
      // (C4-1) PARSE DATA INTO JS OBJECT
      shop.products = JSON.parse(data);

      // (C4-2) DRAW HTML PRODUCTS
      for (let [id, pdt] of Object.entries(shop.products)) {
        let row = document.createElement("div");
        row.className = "pCell";
        row.innerHTML = `<img class="pImg" src="assets/${pdt.i}">
        <div class="pName">${pdt.n}</div>
        <div class="pPrice">$${pdt.p.toFixed(2)}</div>
        <input class="pAdd button" type="button" value="Add To Cart" onclick="shop.add(${id})">`;
        shop.hPdt.appendChild(row);
      }

      // (C4-3) DRAW CART ITEMS
      shop.drawcart();
    });
  },

  // (D) SAVE CART ITEMS INTO LOCALSTORAGE
  save : () => {
    localStorage.setItem("cart", JSON.stringify(shop.cart));
  },

  // (E) DRAW CART ITEMS
  drawcart : () => {
    // (E1) RESET
    let row;
    shop.qty = 0;
    shop.total = 0;
    shop.hCart.innerHTML = "";

    // (E2) EMPTY CART
    if (Object.keys(shop.cart).length==0) {
      row = document.createElement("div");
      row.className = "cCell empty";
      row.innerHTML = `Cart is empty`;
      shop.hCart.appendChild(row);
      shop.hCCart.innerHTML = 0;
    }

    // (E3) DRAW ITEMS
    else {
      for (let [i, q] of Object.entries(shop.cart)) {
        // (E3-1) CALCULATE SUBTOTAL
        let subtotal = q * shop.products[i]["p"];
        shop.total += subtotal;
        shop.qty += parseInt(q);

        // (E3-2) ITEM ROW
        row = document.createElement("div");
        row.className = "cCell";
        row.innerHTML = `<input class="cQty" type="number" value="${q}" 
        min="0" max="99" onchange="shop.change(${i}, this.value)">
        <div class="cInfo">
          <div class="cName">${shop.products[i]["n"]}</div>
          <div class="cPrice">$${subtotal.toFixed(2)}</div>
        </div>
        <input class="cDel button" type="button" value="X" onclick="shop.remove(${i})">`;
        shop.hCart.appendChild(row);
      }

      // (E3-3) CART TOTAL
      row = document.createElement("div");
      row.className = "cCell";
      row.innerHTML = `<input class="cDel button" type="button" value="X" onclick="shop.empty()">
      <div class="cInfo">
        <div class="cName">Total</div>
        <div class="cPrice">$${shop.total.toFixed(2)}</div>
      </div>
      <input class="cDel button" type="button" value="&gt;" onclick="shop.togcf(true)">`;
      shop.hCart.appendChild(row);

      // (E3-4) TOTAL QUANTITY
      shop.hCCart.innerHTML = shop.qty;
    }
  },

  // (F) ADD PRODUCT TO CART
  add : id => {
    if (shop.cart[id]==undefined) { shop.cart[id] = 1; }
    else { shop.cart[id]++; }
    shop.save(); shop.drawcart();
  },

  // (G) CHANGE QUANTITY IN CART
  change : (id, qty) => {
    if (qty <= 0) { shop.remove(id) }
    else { shop.cart[id] = qty; }
    shop.save(); shop.drawcart();
  },

  // (H) REMOVE PRODUCT FROM CART
  remove : id => {
    delete shop.cart[id];
    shop.save(); shop.drawcart();
  },

  // (I) EMPTY CART
  empty : () => { if (confirm("Empty cart?")) {
    shop.cart = {};
    shop.save(); shop.drawcart();
  }},

  // (J) TOGGLE CHECKOUT FORM
  togcf : show => {
    if (show) { shop.hCO.className = "show"; }
    else { shop.hCO.className = ""; }
  },

  // (K) CHECKOUT
  checkout : () => {
    // (K1) FORM DATA
    let form = new FormData(shop.hCOF);
    form.append("req", "checkout");
    form.append("cart", JSON.stringify(shop.cart));

    // (K2) AJAX PROCESS
    shop.fetch(form, res => {
      if (res=="OK") {
        shop.cart = {};
        shop.save();
        shop.drawcart();
        shop.togcf(false);
        alert("CHECKOUT OK. DO SOMETHING - REDIRECT TO THANK YOU?");
      } else { alert(res); }
    });

    // (K3) PREVENT FORM SUBMIT
    return false;
  }
};
window.onload = shop.init;