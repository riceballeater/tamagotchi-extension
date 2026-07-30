let tamagotchi = document.getElementById("tamagotchi");

let canvas = document.getElementById("tama");
let ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled = false;
const img = new Image();

let button = document.getElementById("tama-b");

// tamagotchi.classList.add("hungry");
// // maybe use the button for click event instead of the div...
// button.addEventListener("click", e => {
//     tamagotchi.classList.remove("hungry");
// });

let hatch = document.getElementById("hatch");

let start = document.getElementById("start");
let main = document.getElementById("main");
let info = document.getElementById("name");

function hungerCycle() {
    let hunger = browser.storage.sync.get("hunger");
    hunger.then(i => {
        if (i.hunger > 0) {
            browser.storage.sync.set({hunger: i.hunger - 1});
            console.log(i.hunger - 1);
        }
        setTimeout(() => {
            hungerCycle();
        }, 1000);
    });
}

function happyCycle() {
    let happy = browser.storage.sync.get("happy");
    happy.then(i => {
        if (i.happy > 0) {
            browser.storage.sync.set({happy: i.happy - 1});
            console.log(i.happy - 1);
        }
        setTimeout(() => {
            happyCycle();
        }, 1000);
    });
}

function feed() {

}

function play() {

}

hatch.addEventListener("click", e => {
    let hatched = Date.now();
    browser.storage.sync.set({hatchDate: hatched, hunger: 4, happy: 4/*, lastFed: hatched, lastPlayed: hatched*/, state: "baby"});
    let test = browser.storage.sync.get();
    test.then(i => {
        console.log(i);
    });
    setTimeout(hungerCycle, 1000);
    setTimeout(happyCycle, 1000);
    // info.innerText = browser.storage.sync.get("hatchDate", i => {return i.toString();});

    tamagotchi.classList.add("baby");

    ctx.clearRect(0, 0, canvas.height, canvas.width);
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
