console.log("Hola!");

var onMinigame = false;
var onMinigameStart = Date.now();
function PIDAM_InterludeDraw() {
    var currMG = Microgames_GetActive();

    var timeSince = (Date.now() - onMinigameStart) / 1000;
    timeSince = timeSince * 16;
    var szDelta = Math.min(timeSince, 50);

    Canvas_SetFont(timeSince + "px sans-serif");
    Canvas_SetDrawColor(255, 255, 255);
    Canvas_DrawTextAlign(currMG.desc, Canvas_GetWidth() / 2, Canvas_GetHeight() / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);
}

function PIDAM_InterludeThink() {

}

function PIDAM_BeginInterlude() {
    onMinigame = false;
    onMinigameStart = Date.now();
}


function PIDAM_OnMinigameWin() {
    console.log("Minijuego ganado!");

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
        
        if(onMinigame) {
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


window.onload = function() {
    PIDAM_Init();

    Microgames_SetActive("arbol");
    onMinigame = true;

    //PIDAM_BeginInterlude();
}
