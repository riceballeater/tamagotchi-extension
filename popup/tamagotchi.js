let tamagotchi = document.getElementById("tamagotchi");

let canvas = document.getElementById("tama");
let ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled = false;
const img = new Image();

let x = 48, y = 48;

let button = document.getElementById("tama-b");

let hatchBtn = document.getElementById("hatch");

let start = document.getElementById("start");
let main = document.getElementById("main");
let info = document.getElementById("name");

let hatchText = document.getElementById("hatch-time");

let actButton = document.getElementById("act");
let playButton = document.getElementById("play")
let setButton = document.getElementById("set");
let actMenu = document.getElementById("action");

let foodButton = document.getElementById("feed");
let giveButton = document.getElementById("give");
let actionReturn = document.getElementById("a-return");

let aaa = document.getElementById("hunger");
let bbb = document.getElementById("happy");

function hatch() {
    let hatched = Date.now();
    browser.storage.local.set({hatchDate: hatched, hunger: 0, happy: 0, hungerTick: hatched, happyTick: hatched, state: "baby"});
    let test = browser.storage.local.get();
    test.then(i => {
        console.log(i);
    });
    setTimeout(hungerCycle, 1000);
    setTimeout(happyCycle, 1000);
    // info.innerText = browser.storage.local.get("hatchDate", i => {return i.toString();});

    setTimeout(() => {
        browser.storage.local.set({state: "adult"})
        tamagotchi.classList.remove("baby");
    }, /*24 * 60 * 60 * 1000*/10000);

    tamagotchi.classList.add("baby");
    info.innerText = "";
    aaa.innerText = "hunger 0";
    bbb.innerText = "happy 0";

    ctx.clearRect(0, 0, canvas.height, canvas.width);
    x = 0, y = 0;
    img.src = "../kaguya128.png";
    // ctx.drawImage(img, 0, 0);

    start.style.display = "none";
    // hatchText.style.display = "none";
    main.style.display = "";
}

// consider combining hunger and happiness
function hungerCycle() {
    let data = browser.storage.local.get(["hunger", "hungerTick", "state"]);
    
    let now = Date.now(); // should this be after everything?
    let timeout = 2000;

    data.then(i => {
        if (i.state == "baby") {
            timeout = 1000;
        }
        let expectedTick = i.hungerTick + timeout;
        let deltaTime = now - expectedTick;
        if (deltaTime < timeout) {
            // um
        }
        console.log(`hunger dt ${deltaTime}`);

        if (i.hunger > 0) {
            browser.storage.local.set({hunger: i.hunger - 1});
            tamagotchi.classList.remove("hungry");
            console.log(`hunger ${i.hunger - 1}`);
            aaa.innerText = `hunger ${i.hunger - 1} `;
        }
        
        if (i.hunger - 1 < 1) {
            tamagotchi.classList.add("hungry");
        }
        
        console.log(`hunger tick ${expectedTick}`);
        browser.storage.local.set({hungerTick: expectedTick});

        setTimeout(() => {
            hungerCycle();
        }, timeout - deltaTime);
    });
}

function happyCycle() {
    let data = browser.storage.local.get(["happy", "happyTick", "state"]);

    let now = Date.now();
    let timeout = 2000;

    data.then(i => {
        if (i.state == "baby") {
            timeout = 1000;
        }

        let expectedTick = i.happyTick + timeout;
        let deltaTime = now - expectedTick;
        if (deltaTime > timeout) {
            // um
        }
        console.log(`happy dt ${deltaTime}`);

        if (i.happy > 0) {
            browser.storage.local.set({happy: i.happy - 1});
            // tamagotchi.classList.remove("sad");
            console.log(`happy ${i.happy - 1}`);
            bbb.innerText = `happy ${i.happy - 1}`;
        }
        
        if (i.happy - 1 < 1) {
            tamagotchi.classList.add("sad");
        }

        console.log(`happy tick ${expectedTick}`);
        browser.storage.local.set({happyTick: expectedTick});

        setTimeout(() => {
            happyCycle();
        }, timeout - deltaTime);
    });
}

function clear() { // which one do i use bro
    let clearing = browser.storage.local.clear();
    clearing.then(() => console.log("ok"), e => console.log(error));
    let clearing2 = browser.storage.sync.clear();
    clearing2.then(() => console.log("ok"), e => console.log(error));
}

function init() {
    let data = browser.storage.local.get();
    data.then(i => {
        if (true) {
            img.onload = () => ctx.drawImage(img, x, y);
            img.src = "../kaguya32.png"; // change to bamboo
        } else {
            console.log(i);
            // idk
        }
    }, e => {
        // idk what to do here
        console.log(e);
    })
}

actButton.addEventListener("click", e => {
    main.style.display = "none";
    actMenu.style.display = "";
});

foodButton.addEventListener("click", e => {
    let hunger = browser.storage.local.get("hunger");
    hunger.then(i => {
        if (i.hunger < 4) {
            browser.storage.local.set({hunger: i.hunger + 1});
            tamagotchi.classList.remove("hungry");
            console.log(`hunger ${i.hunger + 1}`);
            aaa.innerText = `hunger ${i.hunger + 1} `;
        }
    });
});

giveButton.addEventListener("click", e => {
    let happy = browser.storage.local.get("happy");
    happy.then(i => {
        if (i.happy < 4) {
            browser.storage.local.set({happy: i.happy + 1});
            tamagotchi.classList.remove("sad");
            console.log(`happy ${i.happy + 1}`);
            bbb.innerText = `happy ${i.happy + 1}`;
        }
    });
});

actionReturn.addEventListener("click", e => {
    actMenu.style.display = "none";
    main.style.display = "";
});

hatchBtn.addEventListener("click", e => {
    let test = 1000;
    setTimeout(hatch, test);
    
    let hatchDate = Date.now() + test;
    let updateTime = () => {
        let time = Date.now();
        let timeLeft = hatchDate - time;

        hatchText.innerText = Math.round((timeLeft % (60 * 1000)) / 1000) + "s";

        if (timeLeft < 0) {
            clearInterval(hatchInterval);
        }
        // setTimeout(() => {
        //     updateTime();
        // }, 1000);
    };
    let hatchInterval = setInterval(updateTime, 1000);
    updateTime();

    hatchBtn.style.display = "none";
    hatchText.style.display = "";
});

init();
