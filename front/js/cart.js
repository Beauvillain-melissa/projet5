
var storage = getAllStorage();
var storageKeys = getAllStorageKeys();
var form = document.getElementsByClassName('cart__order__form');
var url_string = window.location.href;
var url = new URL(url_string);
var orderId = url.searchParams.get("orderId");

// Si orderId on est sur page confirmation
if (orderId != null) {
  let span = document.getElementById("orderId");
  span.innerText = orderId;
} else {
  updatePrice(0, 0);

  
  form[0].addEventListener("submit", function(e){
    e.preventDefault();    //stop form from submitting

    // Validator
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;
    let products = [];
    storageKeys.forEach(element => {
      let productName = element.split('-');
      products.push(productName[0]);
    });
    if (products.length === 0) {
      alert('Pas de produit dans le panier !')
    } else {
      // Appel au back
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:3000/api/products/order", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
          if (this.readyState != 4) return;
          if (this.status == 201) {
              var data = JSON.parse(this.responseText);
              // we get the returned data
              localStorage.clear();
              window.location.replace("./confirmation.html?orderId=" + data.orderId);
              console.log(data);
          }
      };
      xhr.send(JSON.stringify({
          contact: {
            firstName : firstName,
            lastName : lastName,
            address : address,
            city : city,
            email : email
          },
          products: products
      }));
    }
  });

  let totalPrice = 0;
  let totalQty = 0;
  Object.entries(storage).forEach(element => {
    // element devient un tableau 
    let productElement = element[0].split("-");
    let productName = productElement[0];
    let productColor = productElement[1];
    let productQty = element[1];

    const product = getProduct(productName);

    product.then(resolve, reject);

    function resolve (response) {
      const result = JSON.parse(response);
      if (typeof result._id !== 'undefined') {
        let section = document.getElementById("cart__items");
        let article = document.createElement("article");
        let div_img = document.createElement("div");
        let div_item = document.createElement("div");
        let div_item_desc = document.createElement("div");
        let img = document.createElement("img");
        let h2 = document.createElement("h2");
        let pColor = document.createElement("p");
        let pPrix = document.createElement("p");
        let div_item_setting = document.createElement("div");
        let div_item_setting_qty = document.createElement("div");
        let div_item_setting_del = document.createElement("div");
        let pItemQty = document.createElement("p");
        let pItemDel = document.createElement("p");
        let input = document.createElement("input");

        article.classList.add("cart__item");
        article.setAttribute("data-id", result._id);
        article.setAttribute("data-color", productColor);
        div_img.classList.add("cart__item__img");
        img.src = result.imageUrl;
        img.alt = result.altTxt;
        div_item.classList.add("cart__item__content");
        div_item_desc.classList.add("cart__item__content__description");
        h2.innerText = result.name;
        pColor.innerText = productColor;
        pPrix.innerText = result.price + " €";
        div_item_setting.classList.add("cart__item__content__settings");
        div_item_setting_qty.classList.add("cart__item__content__settings__quantity");
        div_item_setting_del.classList.add("cart__item__content__settings__delete");
        pItemQty.innerText = "Qté : ";
        pItemDel.innerText = "Supprimer";
        pItemDel.classList.add("deleteItem");
        input.type = "number";
        input.classList.add("itemQuantity");
        input.name = "itemQuantity";
        input.setAttribute("min", "1");
        input.setAttribute("max", "100");
        input.setAttribute("value", productQty);

        section.appendChild(article);
        div_img.appendChild(img);
        article.appendChild(div_img);
        div_item_desc.appendChild(h2);
        div_item_desc.appendChild(pColor);
        div_item_desc.appendChild(pPrix);
        div_item.appendChild(div_item_desc);
        article.appendChild(div_item);
        div_item.appendChild(div_item_setting);
        div_item_setting.appendChild(div_item_setting_qty);
        div_item_setting.appendChild(div_item_setting_del);
        div_item_setting_qty.appendChild(pItemQty);
        div_item_setting_del.appendChild(pItemDel);
        div_item_setting_qty.appendChild(input);

        totalPrice = totalPrice + (result.price * productQty);
        totalQty = totalQty + +productQty;
        updatePrice(totalPrice, totalQty);

        pItemDel.addEventListener('click', event => {
          var article = document.querySelector('[data-id="' + productName + '"][data-color="' + productColor + '"]');
          article.style.display = 'none';

          localStorage.removeItem(element[0]);

          setTotalPriceQty();
        });

        input.addEventListener('input', function (event) {
          if (input.value > 0 && input.value !== '' && input.value <= 100) {
            localStorage.setItem(element[0], input.value);

            setTotalPriceQty();
          }
        });
      }
    }
  });

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validateName = (name) => {
    return name.match(
      /^[A-zÀ-ú]+$/
    );
  };

  const validateEmailForm = () => {
    const emailError = document.getElementById('emailErrorMsg');
    const email = document.getElementById('email');

    emailError.innerText = '';

    if (!validateEmail(email.value)) {
      emailError.innerText = email.value + ' n\'est pas un email valide.';
      emailError.style.color = 'red';
    }

    return false;
  }

  const validateLastNameForm = () => {
    const lastNameError = document.getElementById('lastNameErrorMsg');
    const lastName = document.getElementById('lastName');

    lastNameError.innerText = '';

    if (!validateName(lastName.value)) {
      lastNameError.innerText = lastName.value + ' n\'est pas un nom valide.';
      lastNameError.style.color = 'red';
    }

    return false;
  }

  const validateFirstNameForm = () => {
    const firstNameError = document.getElementById('firstNameErrorMsg');
    const firstName = document.getElementById('firstName');

    firstNameError.innerText = '';

    if (!validateName(firstName.value)) {
      firstNameError.innerText = firstName.value + ' n\'est pas un prénom valide.';
      firstNameError.style.color = 'red';
    }

    return false;
  }

  lastName.addEventListener('input', validateLastNameForm); 
  email.addEventListener('input', validateEmailForm);
  firstName.addEventListener('input', validateFirstNameForm);
}



function getProduct(id) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/api/products/" + id);
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  }); 
}

function updatePrice (price, quantity) {
  let totalPrice = document.getElementById("totalPrice");
  let totalQuantity = document.getElementById("totalQuantity");

  totalPrice.innerText = price;
  totalQuantity.innerText = quantity;
}

function setTotalPriceQty () {
  let totalPrice = 0;
  let totalQty = 0;
  let storage = getAllStorage();
  Object.entries(storage).forEach(element => {
    console.log(element);
    if (element !== "") {
      let productName = element[0].split("-");
      let productQty = element[1];
      const product = getProduct(productName[0]);

      product.then(resolveTotal, reject);

      function resolveTotal (response) {
        const result = JSON.parse(response);
        totalPrice = totalPrice + (result.price * productQty);
        totalQty = totalQty + +productQty;
        updatePrice(totalPrice, totalQty);
      }
    } else {
      updatePrice(0, 0);
    }
  });
}


function getAllStorage() {
  var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;
  while ( i-- ) {
    values[keys[i]] = localStorage.getItem(keys[i]);
  }

  return values;
}

function getAllStorageKeys() {
  var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;
  while ( i-- ) {
    values.push(keys[i]);
  }

  return values;
}

function reject(erreur) {
  console.error("L'opération a échoué avec le message : " + erreur);
}
