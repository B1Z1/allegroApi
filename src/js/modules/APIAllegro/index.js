import axios from "axios";

const NOTFOUND_ACTIVE_CLASS = "m-Window__notfound--active";
const REQUEST_HEADER_CODE = "application/vnd.allegro.public.v1+json";

export class APIAllegro {
  constructor() {
    this.$Window = document.querySelector("[data-window-wrapper]");
    this.$WindowForm = document.querySelector("[data-window-form]");
    this.$WindowNotFound = document.querySelector("[data-window-notfound]");

    this.currentSearchItem = "";

    this.clientID = "5c470dc8057b43589bb5c3048b32e561";
    this.clientSecretID =
      "Zsg5uGBgJN3TFYwWweQhF0U5k42sRWyGa8kpCYEeGDhtAHMswBgfJ7NuPahJVLPN";
    this.link = `https://allegro.pl/auth/oauth/token?grant_type=client_credentials`;
    this.OAuthHeader = {
      Authorization: `Basic ${btoa(`${this.clientID}:${this.clientSecretID}`)}`,
      ContentType: "Content-Type: application/x-www-form-urlencoded"
    };
    this.requestHeader = {};
    this.listOfProducts = [];

    //Request OAuth Allegro
    this.OAuthRequest = axios.create({
      method: "post",
      headers: this.OAuthHeader
    });

    this.APIRequest = axios.create({
      method: "get"
    });

    this.init();
  }

  /**
   * @function init
   */
  init() {
    this.$WindowForm.addEventListener("submit", ev => {
      ev.preventDefault();
      this.currentSearchItem = this.$WindowForm.search.value.replace(
        /[ ,./+-]+/g,
        "+"
      );
      this.OAuthRequest.post(this.link).then(response => {
        this.requestHeader.Authorization = response.data.access_token;
        this.APIRequest.defaults.headers.common[
          "Authorization"
        ] = `bearer ${this.requestHeader.Authorization}`;
        this.APIRequest.defaults.headers.common["Accept"] = REQUEST_HEADER_CODE;
        this.APIRequest.defaults.headers.common[
          "ContentType"
        ] = REQUEST_HEADER_CODE;
        this.getListOffers();
      });
    });
  }

  /**
   * @function getListOffers
   */
  getListOffers() {
    this.APIRequest.get(
      `https://api.allegro.pl/offers/listing?phrase=${this.currentSearchItem}&sort=-popularity&limit=100&offset=0&include=+all`
    ).then(
      response => {
        this.listOfItems = response.data.items.promoted;
        this.insertProducts();
      },
      error => {
        console.log(error);
      }
    );
  }

  insertProducts() {
    this.$Window.innerHTML = "";
    if (this.listOfItems.length === 0) {
      this.$WindowNotFound.classList.add(NOTFOUND_ACTIVE_CLASS);
    } else {
      this.$WindowNotFound.classList.remove(NOTFOUND_ACTIVE_CLASS);
      this.listOfItems.forEach(item => {
        let name = item.name.toLowerCase(),
          image = item.images[0].url,
          sells = item.sellingMode.popularity,
          price = `${item.sellingMode.price.amount} ${item.sellingMode.price.currency}`,
          link = item.id,
          productElement = this.productTemplate(
            image,
            name,
            price,
            sells,
            link
          );
        this.$Window.appendChild(productElement);
      });
    }
  }

  /**
   * @function productTemplate
   * @param {String} image
   * @param {String} name
   * @param {String} price
   * @param {String} sells
   * @param {String} link
   */
  productTemplate(image, name, price, sells, link) {
    let a = document.createElement("a"),
      children = `
        <div class="c-ProductCard__img">
          <img src="${image}" alt="${name}">
        </div>
        <div class="c-ProductCard__desc">
          <h2 class="c-ProductCard__name">
            ${name}
          </h2>
          <p class="c-ProductCard__price">
            ${price}
          </p>
          <p class="c-ProductCard__sells">
            ${sells} zakupiło
          </p>
        </div>
      `;
    a.classList.add("c-ProductCard");
    a.href = `https://allegro.pl/oferta/${link}`;
    a.target = "_blank";
    a.innerHTML = children;
    return a;
  }
}
