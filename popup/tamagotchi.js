let tamagotchi = document.getElementById("tamagotchi");

let canvas = document.getElementById("tama");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const img = new Image();

let x = 48, y = 48;

let button = document.getElementById("tama-b");

let hatchButton = document.getElementById("hatch");

let start = document.getElementById("start");
let main = document.getElementById("main");
let info = document.getElementById("name");

let hatchText = document.getElementById("hatch-time");

let actButton = document.getElementById("act");
let playButton = document.getElementById("play")
let settingButton = document.getElementById("set");
// let actMenu = document.getElementById("action");

let menuControls = document.getElementById("controls");
let menuCover = document.getElementById("control-cover");

let overlay = document.getElementById("overlay");
let closeOverlay = document.getElementById("close-overlay");

let actions = document.getElementById("action");
let foodButton = document.getElementById("feed");
let giveButton = document.getElementById("give");
// let closeAction = document.getElementById("close-action");

let games = document.getElementById("games");

let settings = document.getElementById("settings");
let clearButton = document.getElementById("clear");

// testing
let aaa = document.getElementById("hunger");
let bbb = document.getElementById("happy");

let hungerId, happyId;

const hatchTime = 3000;
const growthTime = 10000;
const hungerTimeout = 5000;
const hungerTimeoutBaby = 3000;
const happyTimeout = 5000;
const happyTimeoutBaby = 3000;

function clear() { // which one do i use...
    let clearing = browser.storage.local.clear();
    clearing.then(() => console.log("ok"), e => console.log(error));
    // let clearing2 = browser.storage.sync.clear();
    // clearing2.then(() => console.log("ok"), e => console.log(error));

    clearTimeout(hungerId);
    clearTimeout(happyId);
    hungerId = null;
    happyId = null;
}

// consider combining hunger and happiness into one loop
function hungerCycle() {
    let data = browser.storage.local.get(["hunger", "hungerTick", "state"]);
    
    let now = Date.now(); // should this be after everything?
    let timeout = hungerTimeout;

    data.then(i => {
        if (!i.hungerTick) {
            return;
        }
        if (i.state == "baby") {
            timeout = hungerTimeoutBaby;
        }
        let expectedTick = i.hungerTick + timeout;
        let deltaTime = now - expectedTick;
        if (deltaTime < timeout) {
            // setTimeout(() => {
            //     foodLoop = hungerCycle();
            // }, deltaTime);
        }
        console.log(`hunger dt ${deltaTime}`);

        if (i.hunger > 0) {
            browser.storage.local.set({hunger: i.hunger - 1});
            // tamagotchi.classList.remove("hungry");
            console.log(`hunger ${i.hunger - 1}`);
            aaa.innerText = `hunger ${i.hunger - 1} `;
        }
        
        if (i.hunger - 1 < 1) {
            // tamagotchi.classList.add("hungry");
        }
        
        console.log(`hunger tick ${expectedTick}`);
        browser.storage.local.set({hungerTick: expectedTick});

        if (hungerId) {
            clearTimeout(hungerId);
            hungerId = null;
        }

        hungerId = setTimeout(() => {
            hungerCycle();
            // console.log(hungerId);
        }, timeout - deltaTime);
    });
}

function happyCycle() {
    let data = browser.storage.local.get(["happy", "happyTick", "state"]);

    let now = Date.now();
    let timeout = happyTimeout;

    data.then(i => {
        if (!i.happyTick) {
            return;
        }
        if (i.state == "baby") {
            timeout = happyTimeoutBaby;
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
            // console.log(`happy ${i.happy - 1}`);
            bbb.innerText = `happy ${i.happy - 1}`;
        }
        
        if (i.happy - 1 < 1) {
            // tamagotchi.classList.add("sad");
        }

        console.log(`happy tick ${expectedTick}`);
        browser.storage.local.set({happyTick: expectedTick});

        if (happyId) {
            clearTimeout(happyId);
            happyId = null;
        }

        happyId = setTimeout(() => {
            happyCycle();
        }, timeout - deltaTime);
    });
}

function pause() {

}

function sleepCycle() {
    
}

function growth() {
    browser.storage.local.set({state: "adult"});
    tamagotchi.classList.remove("baby");
}

// function saveData() {
//     let test = browser.storage.local.get();
//     test.then(i => {
//         console.log(i);
//         console.log(window.btoa(JSON.stringify(i)));
//     });
// }

// eyJoYXBweSI6MywiaGFwcHlUaWNrIjoxNzg1NTE5NDU3NzEyLCJoYXRjaERhdGUiOjE3ODU1MTk0MTY3MTIsImh1bmdlciI6MywiaHVuZ2VyVGljayI6MTc4NTUxOTQ1NzcxMiwic3RhdGUiOiJhZHVsdCJ9
// function loadData(data) {
//     let test = window.atob(data);
//     console.log(test);
//     clearTimeout(foodLoop);
//     clearTimeout(funLoop);
//     clear();
//     browser.storage.local.set(JSON.parse(test));

//     let timeout = 2000;
//     if (test.state = "baby") {
//         timeout = 1000;
//     }
    
//     foodLoop = setTimeout(hungerCycle, timeout);
//     funLoop = setTimeout(happyCycle, timeout);
// }

function drawStart() {
    ctx.clearRect(0, 0, canvas.height, canvas.width);
    x = 0, y = 0;
    img.src = "../kaguya128.png";
    // ctx.drawImage(img, 0, 0);

    start.style.display = "none";
    // hatchText.style.display = "none";
    main.style.display = "";
}

function load() {
    let test = browser.storage.local.get();
    test.then(i => {
        let dtGrowth = Date.now() - i.hatchDate;
        if (i.state == "baby") {
            if (dtGrowth > growthTime) {
                growth();
            } else {
                setTimeout(() => {
                    growth();
                }, growthTime - dtGrowth);
                tamagotchi.classList.add("baby");
            }
        }

        let dtHunger = Date.now() - i.hungerTick;
        // console.log(dtHunger);
        let currentTimeout = i.state == "baby" ? hungerTimeoutBaby : hungerTimeout;
        // console.log(currentTimeout);
        if (dtHunger > currentTimeout) {
            let ticks = Math.floor(dtHunger / currentTimeout);
            // console.log(ticks);
            let newHunger = i.hunger - ticks;
            // console.log(newHunger);
            browser.storage.local.set({hunger: newHunger > 0 ? newHunger : 0});
            browser.storage.local.set({hungerTick: i.hungerTick + ticks * currentTimeout});
            // console.log(i.hungerTick + ticks * currentTimeout);
        }
        if (hungerId) {
            clearTimeout(hungerId);
            hungerId = null;
        }
        hungerId = setTimeout(() => {
            hungerCycle();
        }, currentTimeout - dtHunger);
        
        let dtHappy = Date.now() - i.happyTick;
        currentTimeout = i.state == "baby" ? happyTimeoutBaby : happyTimeout;
        if (dtHappy > currentTimeout) {
            let ticks = Math.floor(dtHappy / currentTimeout);
            let newHappy = i.happy - ticks;
            browser.storage.local.set({happy: newHappy > 0 ? newHappy : 0});
            browser.storage.local.set({happyTick: i.happyTick + ticks * currentTimeout});
        }
        if (happyId) {
            clearTimeout(happyId);
            happyId = null;
        }
        happyId = setTimeout(() => {
            happyCycle();
        }, currentTimeout - dtHappy);

        console.log(i);
        info.innerText = "";
        aaa.innerText = `hungry ${i.hunger} `;
        bbb.innerText = `happy ${i.happy}`;
    });

    drawStart();
}

function hatch() {
    let hatched = Date.now();
    clear();
    browser.storage.local.set({
        hatchDate: hatched,
        hunger: 0,
        happy: 0,
        hungerTick: hatched,
        happyTick: hatched,
        state: "baby"
    });
    hungerCycle();
    happyCycle();
    // clearTimeout(foodLoop);
    // clearTimeout(funLoop);
    // info.innerText = browser.storage.local.get("hatchDate", i => {return i.toString();});

    setTimeout(() => {
        growth();
    }, /*24 * 60 * 60 * 1000*/growthTime);

    tamagotchi.classList.add("baby");

    info.innerText = "";
    aaa.innerText = "hunger 0 ";
    bbb.innerText = "happy 0";

    drawStart();
}

function init() {
    img.onload = () => ctx.drawImage(img, x, y);

    let data = browser.storage.local.getBytesInUse();
    data.then(i => {
        if (typeof i !== "undefined" && i > 0) {
            load();
            console.log(i);
            hatchButton.style.display = "none";
            hatchText.style.display = "";

            // hungerCycle();
            // happyCycle();
        } else {
            img.src = "../kaguya32.png"; // change to bamboo
        }
    }, e => {
        // idk what to do here
        console.log(e);
    });
}

function showOverlay(menu) {
    menuControls.style.display = "none";
    menuCover.style.display = "";
    overlay.style.display = "";
    
    if (menu == "a") {
        actions.style.display = "";
    } else if (menu == "p") {
        games.style.display = "";
    } else if (menu == "s") {
        settings.style.display = "";
    } else {
        console.log("idk");
    }
}

function hideOverlay() {
    actions.style.display = "none";
    games.style.display = "none";
    settings.style.display = "none";
    overlay.style.display = "none";
    menuCover.style.display = "none";
    menuControls.style.display = "";
}

actButton.addEventListener("click", e => {
    // main.style.display = "none";
    // actMenu.style.display = "";
    showOverlay("a");
});

foodButton.addEventListener("click", e => {
    let hunger = browser.storage.local.get("hunger");
    hunger.then(i => {
        if (i.hunger < 4) {
            browser.storage.local.set({hunger: i.hunger + 1});
            // tamagotchi.classList.remove("hungry");
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
            // tamagotchi.classList.remove("sad");
            console.log(`happy ${i.happy + 1}`);
            bbb.innerText = `happy ${i.happy + 1}`;
        }
    });
});

// closeAction.addEventListener("click", e => {
//     actMenu.style.display = "none";
//     main.style.display = "";
// });

playButton.addEventListener("click", e => {
    showOverlay("p");
});

settingButton.addEventListener("click", e => {
    showOverlay("s");
});

clearButton.addEventListener("click", e => {
    clear();
    window.location.reload();
});

closeOverlay.addEventListener("click", hideOverlay);

hatchButton.addEventListener("click", e => {
    setTimeout(hatch, hatchTime);
    
    let hatchDate = Date.now() + hatchTime;
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

    hatchButton.style.display = "none";
    hatchText.style.display = "";
});

init();
