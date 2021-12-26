var url_string = window.location.href;
var url = new URL(url_string);
var id = url.searchParams.get("id");
var product = "";

const promise = getProduct(id);

promise.then(resolve, reject);


function getProduct(id) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/api/products/" + id);
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  }); 
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function resolve (response) {
  const result = JSON.parse(response);

  let image = document.createElement("img");
  let itemImg = document.getElementsByClassName("item__img");
  let title = document.getElementById("title");
  let price = document.getElementById("price");
  let description = document.getElementById("description");
  let colors = document.getElementById("colors");

  //result = resultat de ma fonction 
  //1 on crée l'element que j'ai besoin/ou on le récupere
  //2 je lui met son attribut(ce que je vais mettre dedans)
  //3 je lui met sont ou ses enfant 

  image.src = result.imageUrl;
  image.alt = result.altTxt;
  title.innerText = result.name;
  price.innerText = result.price;
  description.innerText = result.description;
  
  itemImg[0].appendChild(image);

  //boucle forEach
  result.colors.forEach(element => {
    let option = document.createElement("option");
    
    option.innerText = element;
    option.value = element;
  // value = attribut d'option
    colors.appendChild(option);
  });

  const button = document.getElementById('addToCart');

  button.addEventListener('click', event => {
    let quantity = document.getElementById("quantity");

    if (colors.value == '') {
      alert("Choisissez une couleur");
    } else if (quantity.value == 0) {
      alert("Choisissez une quantité pour le produit");
    } else {
      let paramName = result._id + '-' + colors.value;
      let paramQty = localStorage.getItem(paramName);

      let newQuantity = quantity.value;
      if (paramQty != null) {
        newQuantity = +newQuantity + +paramQty;
      }
      localStorage.setItem(paramName, newQuantity);

      console.log(localStorage.getItem(paramName));
      alert("Produit ajouté au panier !");
    }
  });
}

function reject(erreur) {
  console.error("L'opération a échoué avec le message : " + erreur);
}
