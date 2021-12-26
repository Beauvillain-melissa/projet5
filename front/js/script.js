const promise = getAllProducts();

promise.then(resolve, reject);

function getAllProducts() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/api/products");
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  }); 
}

function resolve (response) {

  const result = JSON.parse(response);

  result.forEach(element => {
    let a = document.createElement("a");
    let article = document.createElement("article");
    let image = document.createElement("img");
    let items = document.getElementById("items");
    let h3 = document.createElement("h3");
    let p = document.createElement("p");
    
    image.src = element.imageUrl;
    image.alt = element.altTxt;
    a.href = "./product.html?id=" + element._id;
    h3.classList.add("productName");
    h3.innerText = element.name;
    p.classList.add("productDescription");
    p.innerText = element.description;
    items.appendChild(a);
    a.appendChild(article);
    article.appendChild(image);
    article.appendChild(h3);
    article.appendChild(p);
    
  });
}

function reject(erreur) {
  console.error("L'opération a échoué avec le message : " + erreur);
}
