let tamagotchi = document.getElementById("tamagotchi");

tamagotchi.classList.add("hungry");
tamagotchi.addEventListener("click", e => {
    tamagotchi.classList.remove("hungry");
});
