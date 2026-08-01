let tamagotchi = document.getElementById("tamagotchi");

let canvas = document.getElementById("tama");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
ctx.font = "20px sans-serif";
ctx.fillStyle = "white";
// ctx.textAlign = "center";

const img = new Image();
let x = 48, y = 48;

let tamaButton = document.getElementById("tama-b");

let hatchButton = document.getElementById("hatch");

let start = document.getElementById("start");
let main = document.getElementById("main");
let info = document.getElementById("name");

let hatchText = document.getElementById("hatch-time");

let actButton = document.getElementById("act");
let gameButton = document.getElementById("play")
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
let pauseButton = document.getElementById("pause");
let clearButton = document.getElementById("clear");

// testing
let hungerInfo = document.getElementById("hunger");
let happyInfo = document.getElementById("happy");

let hungerId, happyId;

const hatchTime = 3000;
const growthTime = 20000;
const maxStat = 4;
const hungerTimeout = 8000;
const hungerTimeoutBaby = 4000;
const happyTimeout = 6000;
const happyTimeoutBaby = 3000;
// const daytime = 5000;
// const nighttime = 3000;
const checkTime = 1000;

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

function changeIcon(type) {
    let sending = browser.runtime.sendMessage({
        message: type
    });

    sending.then(r => console.log(r), e => console.log(e));
}

// consider combining hunger and happiness into one loop
function hungerCycle(pause = 0) {
    let data = browser.storage.local.get(["hunger", "hungerTick", "state"]);
    
    let now = Date.now(); // should this be after everything?
    let timeout = hungerTimeout;

    data.then(i => {
        if (!i.hungerTick || i.paused) {
            return;
        }
        if (i.state == "baby") {
            timeout = hungerTimeoutBaby;
        }
        let expectedTick = i.hungerTick + timeout;
        let deltaTime = now - pause - expectedTick;
        if (deltaTime > timeout) {
            // load();
            // return;
        }
        // console.log(`hunger dt ${deltaTime}`);

        if (i.hunger > 0) {
            browser.storage.local.set({hunger: i.hunger - 1});
            // tamagotchi.classList.remove("hungry");
            // console.log(`hunger ${i.hunger - 1}`);
            // hungerInfo.innerText = `hunger ${i.hunger - 1} `;
        }
        
        if (i.hunger - 1 < 1) {
            // browser.browserAction.setIcon(alertIcon);
            changeIcon("alert");
            tamagotchi.classList.add("alert");
            // tamagotchi.classList.add("hungry");
        }
        
        // console.log(`hunger tick ${expectedTick}`);
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

function happyCycle(pause = 0) {
    let data = browser.storage.local.get(["happy", "happyTick", "state"]);

    let now = Date.now();
    let timeout = happyTimeout;

    data.then(i => {
        if (!i.happyTick || i.paused) {
            return;
        }
        if (i.state == "baby") {
            timeout = happyTimeoutBaby;
        }

        let expectedTick = i.happyTick + timeout;
        let deltaTime = now - pause - expectedTick;
        if (deltaTime > timeout) {
            // load();
            // return;
            // um
        }
        // console.log(`happy dt ${deltaTime}`);

        if (i.happy > 0) {
            browser.storage.local.set({happy: i.happy - 1});
            // tamagotchi.classList.remove("sad");
            // console.log(`happy ${i.happy - 1}`);
            // happyInfo.innerText = `happy ${i.happy - 1}`;
        }
        
        if (i.happy - 1 < 1) {
            // browser.browserAction.setIcon(alertIcon);
            changeIcon("alert");
            tamagotchi.classList.add("alert");
            // tamagotchi.classList.add("sad");
        }

        // console.log(`happy tick ${expectedTick}`);
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

let interactive = document.getElementsByClassName("interact");

function stopInteraction() {
    for (let i of interactive) {
        i.disabled = true;
    }
}

function startInteraction() {
    for (let i of interactive) {
        i.disabled = false;
    }
}

function pause() {
    let now = Date.now();
    browser.storage.local.set({pauseDate: now, paused: true});

    clearTimeout(hungerId);
    clearTimeout(happyId);
    hungerId = null;
    happyId = null;

    stopInteraction();
}

function unpause() {
    let now = Date.now();
    let pauseDate = browser.storage.local.get("pauseDate");
    pauseDate.then(i => {
        if (!i.pauseDate) return;
        browser.storage.local.set({paused: false}).then(() => {
            load(now - i.pauseDate);
            // browser.storage.local.set({pauseDate: null});
        });
        startInteraction();
    }, e => {
        console.log("yo i guess");
    });
}

function sleepCycle() {
    browser.storage.local.set({asleep: true});

}

function growth() {
    // character evolution code
    
    img.src = "../kaguya128.png";

    browser.storage.local.set({state: "adult"});
    tamagotchi.classList.remove("baby");
}

function saveData() {
    let test = browser.storage.local.get();
    test.then(i => {
        console.log(i);
        console.log(window.btoa(JSON.stringify(i)));
    });
}

// eyJoYXBweSI6MywiaGFwcHlUaWNrIjoxNzg1NTE5NDU3NzEyLCJoYXRjaERhdGUiOjE3ODU1MTk0MTY3MTIsImh1bmdlciI6MywiaHVuZ2VyVGljayI6MTc4NTUxOTQ1NzcxMiwic3RhdGUiOiJhZHVsdCJ9
function loadData(data) {
    clear();
    let test = window.atob(data);
    // console.log(test);
    browser.storage.local.set(JSON.parse(test));
    
    load();
}

function check() {
    let asdf = browser.storage.local.get();
    asdf.then(i => {
        // cleanup code
        // liholy molyghts code
        if (i.happy == 0 && i.hunger > 0) {
            tamagotchi.classList.add("sad");
            ctx.fillText("Sad", 64 - ctx.measureText("Sad").width/2, 15);
            setTimeout(() => {
                tamagotchi.classList.remove("sad");
                ctx.clearRect(0, 0, canvas.height, canvas.width);
                ctx.drawImage(img, x, y);
            }, checkTime);
        }
        if (i.hunger == 0) {
            tamagotchi.classList.add("hungry");
            ctx.fillText("Hungry", 64 - ctx.measureText("Hungry").width/2, 15);
            setTimeout(() => {
                tamagotchi.classList.remove("hungry");
                ctx.clearRect(0, 0, canvas.height, canvas.width);
                ctx.drawImage(img, x, y);
            }, checkTime);
        }
        if (i.happy > 0 && i.hunger > 0) {
            ctx.clearRect(0, 0, canvas.height, canvas.width);
            img.src = i.state == "baby" ? "../kaguyaBabyCheck.png" : "../kaguyaCheck.png";
            ctx.drawImage(img, x, y);
            setTimeout(() => {
                ctx.clearRect(0, 0, canvas.height, canvas.width);
                img.src = i.state == "baby" ? "../kaguyaBaby.png" : "../kaguya128.png";
                ctx.drawImage(img, x, y);
            }, checkTime);
        }
    });
}

function drawStart(image = "../kaguya128.png") {
    ctx.clearRect(0, 0, canvas.height, canvas.width);
    x = 0, y = 0;
    img.src = image;
    // ctx.drawImage(img, 0, 0);

    start.style.display = "none";
    // hatchText.style.display = "none";
    main.style.display = "";
}

let pauseText = document.getElementById("pause-text");
let playText = document.getElementById("play-text");

function load(pause = 0) {
    let isBaby = false;
    let test = browser.storage.local.get();
    test.then(i => {
        console.log(i);
        // asleep code?

        let newHunger, newHappy;
        if (!i.paused) {
            let dtGrowth = Date.now() - i.hatchDate - pause;
            if (i.state == "baby") {
                if (dtGrowth > growthTime) {
                    growth();
                } else {
                    setTimeout(() => {
                        growth();
                    }, growthTime - dtGrowth);
                    tamagotchi.classList.add("baby");
                    isBaby = true;
                }
            }

            let dtHunger = Date.now() - i.hungerTick - pause;
            // console.log(Date.now());
            // console.log(pause);
            // console.log(dtHunger);
            let currentTimeout = i.state == "baby" ? hungerTimeoutBaby : hungerTimeout;
            // console.log(currentTimeout);
            if (dtHunger > currentTimeout) {
                // console.log("yo???");
                let ticks = Math.floor(dtHunger / currentTimeout);
                // console.log(ticks);
                newHunger = i.hunger - ticks > 0 ? i.hunger - ticks : 0;
                // console.log(newHunger);
                browser.storage.local.set({hunger: newHunger});
                browser.storage.local.set({hungerTick: i.hungerTick + pause + ticks * currentTimeout});
                // console.log(i.hungerTick + pause + ticks * currentTimeout);
                dtHunger = dtHunger % currentTimeout;
            } else {
                browser.storage.local.set({hungerTick: i.hungerTick + pause});
                newHunger = i.hunger;
            }
            if (hungerId) {
                clearTimeout(hungerId);
                hungerId = null;
            }
            hungerId = setTimeout(() => {
                hungerCycle();
            }, currentTimeout - dtHunger);
            
            let dtHappy = Date.now() - i.happyTick - pause;
            currentTimeout = i.state == "baby" ? happyTimeoutBaby : happyTimeout;
            if (dtHappy > currentTimeout) {
                let ticks = Math.floor(dtHappy / currentTimeout);
                newHappy = i.happy - ticks > 0 ? i.happy - ticks : 0;;
                browser.storage.local.set({happy: newHappy});
                browser.storage.local.set({happyTick: i.happyTick + pause + ticks * currentTimeout});
                dtHappy = dtHappy % currentTimeout;
            } else {
                browser.storage.local.set({happyTick: i.happyTick + pause});
                newHappy = i.happy;
            }
            if (happyId) {
                clearTimeout(happyId);
                happyId = null;
            }
            happyId = setTimeout(() => {
                happyCycle();
            }, currentTimeout - dtHappy);
        } else {
            newHunger = i.hunger;
            newHappy = i.happy;
        }

        if (i.paused) {
            stopInteraction();
            pauseText.style.display = "none";
            playText.style.display = "";
        }

        // if (i.asleep) {
        //     pauseButton.disabled = true;
        // }

        info.innerText = "kaguya";
        // hungerInfo.innerText = `hunger ${newHunger} `;
        // happyInfo.innerText = `happy ${newHappy}`;

        if (i.hunger == 0 || i.happy == 0) {
            // browser.browserAction.setIcon(alertIcon);
            changeIcon("alert");
            tamagotchi.classList.add("alert");
        }
    });

    return isBaby;
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

    
    tamaButton.classList.remove("nohover");

    // browser.browserAction.setIcon(alertIcon);
    changeIcon("alert");
    tamagotchi.classList.add("baby", "alert");

    info.innerText = "kaguya";
    // hungerInfo.innerText = "hunger 0 ";
    // happyInfo.innerText = "happy 0";

    drawStart("../kaguyaBaby.png");
}

function init() {
    img.onload = () => ctx.drawImage(img, x, y);

    let data = browser.storage.local.getBytesInUse();
    data.then(i => {
        if (typeof i !== "undefined" && i > 0) {
            let isBaby = load();
            tamaButton.classList.remove("nohover");

            // console.log(i);
            hatchButton.style.display = "none";
            hatchText.style.display = "";

            // hungerCycle();
            // happyCycle();

            isBaby ? drawStart("../kaguyaBaby.png") : drawStart();
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
    } else if (menu == "g") {
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

tamaButton.addEventListener("click", e => {
    check();
});

actButton.addEventListener("click", e => {
    // main.style.display = "none";
    // actMenu.style.display = "";
    showOverlay("a");
});

foodButton.addEventListener("click", e => {
    let hunger = browser.storage.local.get(["hunger", "happy"]);
    hunger.then(i => {
        if (i.hunger < maxStat) {
            browser.storage.local.set({hunger: i.hunger + 1});
            console.log(`${i.hunger + 1} ${i.happy}`);
            if (i.happy > 0) {
                // console.log("a");
                // browser.browserAction.setIcon(normalIcon);
                changeIcon("normal");
                tamagotchi.classList.remove("alert");
            }
            // tamagotchi.classList.remove("hungry");
            // console.log(`hunger ${i.hunger + 1}`);
            // hungerInfo.innerText = `hunger ${i.hunger + 1} `;
        }
    });
});

giveButton.addEventListener("click", e => {
    let happy = browser.storage.local.get(["hunger", "happy"]);
    happy.then(i => {
        if (i.happy < maxStat) {
            browser.storage.local.set({happy: i.happy + 1});
            console.log(`${i.hunger} ${i.happy + 1}`);
            if (i.hunger > 0) {
                // console.log("b");
                // browser.browserAction.setIcon(normalIcon);
                changeIcon("normal");
                tamagotchi.classList.remove("alert");
            }
            // tamagotchi.classList.remove("sad");
            // console.log(`happy ${i.happy + 1}`);
            // happyInfo.innerText = `happy ${i.happy + 1}`;
        }
    });
});

// closeAction.addEventListener("click", e => {
//     actMenu.style.display = "none";
//     main.style.display = "";
// });

gameButton.addEventListener("click", e => {
    showOverlay("g");
});

settingButton.addEventListener("click", e => {
    showOverlay("s");
});

pauseButton.addEventListener("click", e => {
    let aaahh = browser.storage.local.get("paused");
    aaahh.then(i => {
        if (!i.paused) {
            pause();
            pauseText.style.display = "none";
            playText.style.display = "";
        } else {
            unpause();
            playText.style.display = "none";
            pauseText.style.display = "";
        }
    });
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
