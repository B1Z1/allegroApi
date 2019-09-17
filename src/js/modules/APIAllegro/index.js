import axios from "axios";

export class APIAllegro {
  constructor() {
    this.clientID = "5c470dc8057b43589bb5c3048b32e561";
    this.clientSecretID =
      "Zsg5uGBgJN3TFYwWweQhF0U5k42sRWyGa8kpCYEeGDhtAHMswBgfJ7NuPahJVLPN";
    this.link = `https://allegro.pl/auth/oauth/token?grant_type=client_credentials`;
    this.OAuthHeader = {
      Authorization: `Basic ${btoa(`${this.clientID}:${this.clientSecretID}`)}`
    };
    this.OAuthRequest = axios.create({
      method: "post",
      headers: this.OAuthHeader
    });
    this.$LoginButton = document.querySelector("[data-window-login]");
    if (this.$LoginButton) this.init();
  }

  init() {
    this.OAuthRequest.post(this.link).then(response => {
      console.log(response);
      
    });
  }
}
