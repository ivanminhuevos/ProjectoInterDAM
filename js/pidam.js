console.log("Hola!");

var textGrowTime = 1;
var textStayTime = 2.5;
var textShrinkTime = 1;
var interludeLenTotal = textGrowTime + textStayTime + textShrinkTime;

var bgRectTotal = 4;

var nextMG = null;
var onMinigame = false;
var onMinigameStart = Date.now();


function PIDAM_InterludeDraw() {
    Canvas_Clear(32, 64, 96);
    var nextMGObj = Microgames_GetByName(nextMG);

    var timeSince = (Date.now() - onMinigameStart) / 1000;


    var widthDiv = Canvas_GetWidth() / (bgRectTotal * 2)
    for(var i = -1; i < bgRectTotal; i++) {
        Canvas_SetDrawColor(32, 96, 140);
        Canvas_DrawRect((i * widthDiv * 2) + (Util_GetCurTime() * 128) % (widthDiv * 2), 0, widthDiv, Canvas_GetHeight());
    }

    // texto
    var alphaDelta = 1;
    var szDelta = 0;
    if(timeSince < textGrowTime) {
        szDelta = (timeSince / textGrowTime) * 50;
    } else if(timeSince < (textGrowTime + textStayTime)) {
        szDelta = 50;
    } else {
        szDelta = ((timeSince - (textGrowTime + textStayTime)) / textShrinkTime)
        
        alphaDelta = (1 - szDelta)
        szDelta = (1 - szDelta) * 50
    }


    Canvas_SetFont(szDelta + "px sans-serif");
    Canvas_SetDrawColorA(255, 255, 255, alphaDelta);
    Canvas_DrawTextAlign(nextMGObj.desc, Canvas_GetWidth() / 2, Canvas_GetHeight() / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);


    var szAdd = Math.abs(Math.sin(Util_GetCurTime() * 8) * 8)

    // vidas
    Canvas_SetFont(szDelta + "px sans-serif");
    var vidasTotal = Vidas_GetVidas();
    var maxVidas = Vidas_GetMaxVidas();

    for(var i = 0; i < maxVidas; i++) {
        var iDelta = ((i / (maxVidas - 1)) - 0.5) * 2;

        Canvas_SetFont((szDelta + szAdd) + "px sans-serif");
        var char = "❤️";
        if(i >= vidasTotal) {
            Canvas_SetFont((szDelta / 2) + "px sans-serif");
            char = "💔";
        }

        Canvas_DrawTextAlign(char, Canvas_GetWidth() / 2 + (iDelta * 96), Canvas_GetHeight() / 2 + 96, TEXT_ALIGN_CENTER, TEXT_ALIGN_BOTTOM);
    }
}

function PIDAM_InterludeThink() {
    var timeSince = (Date.now() - onMinigameStart) / 1000;

    if(timeSince > interludeLenTotal) {
        onMinigame = true;
        Util_ResetCurTime();

        Microgames_SetActive(nextMG);
    }
}

function PIDAM_BeginInterlude() {
    var prevActive = Microgames_GetActiveName();
    nextMG = Microgames_GetRandom();
    do {
        nextMG = Microgames_GetRandom();
    } while(prevActive == nextMG);

    onMinigame = false;
    onMinigameStart = Date.now();
}


function PIDAM_OnMinigameWin() {
    console.log("Minijuego ganado!");

    PIDAM_BeginInterlude();
}

function PIDAM_OnMinigameLose() {
    console.log("Minijuego perdido!");
    Vidas_RestarVida();

    PIDAM_BeginInterlude();
}

function PIDAM_RenderTimeBar() {
    var currActive = Microgames_GetActive();
    var maxTime = currActive.maxTime;

    Canvas_SetDrawColor(32, 32, 32);
    Canvas_DrawRect(8, Canvas_GetHeight() - 32 - 8, Canvas_GetWidth() - 16, 32);

    var timeLeft = Util_GetCurTime(); 
    timeLeft = timeLeft / maxTime;
    timeLeft = 1 - timeLeft;
    timeLeft = Math.max(timeLeft, 0);

    Canvas_SetDrawColor(255, 32, 32);
    Canvas_DrawRect(12, Canvas_GetHeight() - 32 - 8 + 4, (Canvas_GetWidth() - 16 - 8) * timeLeft, 24);
}

function PIDAM_TimeThink() {
    var currActive = Microgames_GetActive();
    var maxTime = currActive.maxTime;

    var timeLeft = Util_GetCurTime(); 
    timeLeft = timeLeft / maxTime;
    timeLeft = 1 - timeLeft;

    if(timeLeft <= 0) {
        PIDAM_OnMinigameLose();
    }
}


function PIDAM_LoseDraw() {
    Canvas_Clear(96, 32, 32);

    var timeSince = (Date.now() - onMinigameStart) / 1000;

    var widthDiv = Canvas_GetWidth() / (bgRectTotal * 2)
    for(var i = -1; i < bgRectTotal; i++) {
        Canvas_SetDrawColor(128, 48, 48);
        Canvas_DrawRect((i * widthDiv * 2) + (Util_GetCurTime() * 64) % (widthDiv * 2), 0, widthDiv, Canvas_GetHeight());
    }

    // texto
    var szDelta = 0;
    if(timeSince < textGrowTime) {
        szDelta = (timeSince / textGrowTime) * 50;
    } else {
        szDelta = 50;
    }

    Canvas_SetFont(szDelta + "px sans-serif");
    Canvas_SetDrawColor(255, 255, 255);
    Canvas_DrawTextAlign("Has perdido!", Canvas_GetWidth() / 2, Canvas_GetHeight() / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);

    var btnX = Canvas_GetWidth() / 2;
    var btnY = (Canvas_GetHeight() / 2) + 128;

    var btnW = 196;
    var btnH = 96;
    if(timeSince > textGrowTime) {
        Canvas_SetDrawColor(64, 96, 64);
        Canvas_DrawRect(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH);

        Canvas_SetDrawColor(190, 255, 190);
        Canvas_DrawRect(btnX - btnW / 2 + 2, btnY - btnH / 2 + 2, btnW - 4, btnH - 4);

        Canvas_SetDrawColor(32, 32, 32);
        Canvas_SetFont("26px sans-serif");
         Canvas_DrawTextAlign("Volver a jugar", btnX, btnY, TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
    }
}

function PIDAM_LoseThink() {
    var timeSince = (Date.now() - onMinigameStart) / 1000;

    if(timeSince < textGrowTime) {
        return;
    }

    if(!Mouse_GetLeftDown()) {
        return;
    }

    var btnX = Canvas_GetWidth() / 2;
    var btnY = (Canvas_GetHeight() / 2) + 128;

    var btnW = 196;
    var btnH = 96;
    if(!Mouse_InBox(btnX - btnW / 2, btnY - btnH / 2, btnW, btnH)) {
        return;
    }

    Vidas_ResetearVidas();
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

        if(Vidas_GetVidas() <= 0) {
            PIDAM_LoseThink();
            PIDAM_LoseDraw();
        } else {
            if(onMinigame) {
                Microgames_ThinkActive();
                Microgames_DrawActive();

                PIDAM_TimeThink();
                PIDAM_RenderTimeBar();
            } else {
                PIDAM_InterludeThink();
                PIDAM_InterludeDraw();
            }
        }
    
        prevTime = Date.now();
        requestAnimationFrame(update);
    })
}


window.onload = function() {
    PIDAM_Init();

    Microgames_SetActive("arbol");
    onMinigame = true;

    PIDAM_BeginInterlude();
}
