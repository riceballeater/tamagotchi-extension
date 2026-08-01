// const normalIcon = new Image();
// normalIcon.src = "../kaguya32.png";

// const alertIcon = new Image();
// alertIcon.src = "../kaguyaAlert32.png";

function handleMessage(req, sender, res) {
    if (req.message == "alert") {
        browser.action.setIcon({
            path: "./kaguyaAlert32.png"
        });
    } else if (req.message == "normal") {
        browser.action.setIcon({
            path: "./kaguya32.png"
        });
    }

    res("ok");
}

browser.runtime.onMessage.addListener(handleMessage);