let tamagotchi = document.getElementById("tamagotchi");

let tama = document.getElementById("tama");
let ctx = tama.getContext("2d");
// ctx.imageSmoothingEnabled = false;
const img = new Image();

tamagotchi.classList.add("hungry");
// maybe use the button for click event instead of the div...
tamagotchi.addEventListener("click", e => {
    tamagotchi.classList.remove("hungry");
});

let hatch = document.getElementById("hatch");

let start = document.getElementById("start");
let main = document.getElementById("main");

hatch.addEventListener("click", e => {
    ctx.clearRect(0, 0, tama.height, tama.width);
    x = 0, y = 0;
    img.src = "../kaguya128.png";
    // ctx.drawImage(img, 0, 0);

    start.style.display = "none";
    main.style.display = "";
});

// tama_img.addEventListener("load", () => {
//     // tama_ctx.drawImage(tama_img, 0, 0);
// });

// tama_img.src = "../kaguya128.png";
let x = 48, y = 48;
img.onload = () => ctx.drawImage(img, x, y);
img.src = "../bun32.png"; // change to bamboo
// ctx.drawImage(img, 48, 48);
// await new Promise(res => setTimeout(res, 5000));
// tama_img.src = "../kaguya32.png";
