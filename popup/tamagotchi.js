let tamagotchi = document.getElementById("tamagotchi");

let tama = document.getElementById("tama");
let tama_ctx = tama.getContext("2d");
const tama_img = new Image();

tamagotchi.classList.add("hungry");
tamagotchi.addEventListener("click", e => {
    tamagotchi.classList.remove("hungry");
    // tama_ctx.clearRect(0, 0, tama.height, tama.width);
    // tama_img.src = "../kaguya32.png";
});

tama_img.addEventListener("load", () => {
    tama_ctx.drawImage(tama_img, 0, 0);
});

tama_img.src = "../kaguya128.png";
// await new Promise(res => setTimeout(res, 5000));
// tama_img.src = "../kaguya32.png";
