console.log("Hola!");

var onMinigame = false;
var onMinigameStart = Date.now();
var score = 0;
var globalDifficulty = 0;

function PIDAM_InterludeDraw() {
    var currMG = Microgames_GetActive();

    var timeSince = (Date.now() - onMinigameStart) / 1000;
    var animTime = timeSince * 32;
    var fontSize = Math.min(animTime, 60); // Cap font size

    Canvas_Clear(0, 0, 0); // Clear to prevent ghosting
    Canvas_SetFont(fontSize + "px Outfit, sans-serif");
    Canvas_SetDrawColor(255, 255, 255);
    Canvas_DrawTextAlign(currMG.desc, Canvas_GetWidth() / 2, Canvas_GetHeight() / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);
}

function PIDAM_InterludeThink() {
    var timeSince = (Date.now() - onMinigameStart) / 1000;

    // After 2 seconds, pick a new random microgame
    if (timeSince > 2) {
        var nextMGName = Microgames_GetRandom();
        var nextMG = Microgames_GetByName(nextMGName);
        if (nextMG) nextMG.setDificultad(globalDifficulty);
        Microgames_SetActive(nextMGName);
        onMinigame = true;
    }
}

function PIDAM_BeginInterlude() {
    onMinigame = false;
    onMinigameStart = Date.now();
}


function PIDAM_OnMinigameWin() {
    console.log("Minijuego ganado!");
    score++;
    if (score % 10 === 0) {
        globalDifficulty++;
        console.log("¡Dificultad aumentada! Nivel: " + globalDifficulty);
    }

    PIDAM_BeginInterlude();
}

function PIDAM_Init() {
    Canvas_Init();

    Canvas_Clear(0, 0, 0);

    canvas = Canvas_GetCanvas();

    prevTime = Date.now();
    deltaTime = 1;
    requestAnimationFrame(function update() {
        deltaTime = (Date.now() - prevTime) / 1000;
        Util_Internal_SetDeltaTime(deltaTime);

        if (onMinigame) {
            Microgames_ThinkActive();
            Microgames_DrawActive();
        } else {
            PIDAM_InterludeThink();
            PIDAM_InterludeDraw();
        }

        prevTime = Date.now();
        requestAnimationFrame(update);
    })
}


window.onload = function () {
    PIDAM_Init();

    Microgames_SetActive("pozos");
    onMinigame = true;

    //PIDAM_BeginInterlude();
}
