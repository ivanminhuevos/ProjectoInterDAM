var mg = new Microgame("arbol", "Colleciona manzanas!");

var arbolImg = Canvas_NewImage("/img/arbol/arbol.png");
var arbolFondoImg = Canvas_NewImage("/img/arbol/fondo.png")
var arbolManzanaImg = Canvas_NewImage("/img/arbol/manzana.png")
var arbolManoImg = Canvas_NewImage("/img/arbol/mano.png")
var arbolManoCerradaImg = Canvas_NewImage("/img/arbol/mano_cerrada.png")

manzanas = []

var timeLeft = 5;
var state = "playing"; // "playing", "won", "lost"
var stateTime = 0;

mg.init = function () {
    manzanas = []
    var diff = mg.getDificultad();

    // Time scaling
    timeLeft = Math.max(2, 5 - diff * 0.5);
    state = "playing";
    stateTime = 0;

    var manzanasTotal = 4;
    if (diff > 9) {
        manzanasTotal = 5;
    } else if (diff > 19) {
        manzanasTotal = 6;
    }

    var beginX = (256 + 128) / 2;
    var beginY = (256);
    var endX = beginX + 256 + 128;
    var endY = beginY + 196;


    for (var i = 0; i < manzanasTotal; i++) {
        manzana = {
            "x": beginX + (Math.random() * (endX - beginX)),
            "y": beginY + (Math.random() * (endY - beginY)),
        }

        manzanas.push(manzana)
    }
}

var pressFlag = false;
mg.think = function (dt) {
    if (manzanas.length <= 0) {
        mg.win()
    }

    if (Mouse_GetLeftDown()) {
        if (pressFlag) {
            return;
        }
        pressFlag = true;

        toRemove = []
        for (var i = 0; i < manzanas.length; i++) {
            var manzana = manzanas[i];
            if (!Mouse_InBox(manzana.x - 32, manzana.y - 32, 64, 64)) {
                continue;
            }

            toRemove.push(i);
        }

        if (toRemove.length <= 0) {
            return;
        }

        for (var i = (toRemove.length - 1); i >= 0; i--) {
            manzanas.splice(toRemove[i], 1);
        }
    } else {
        if (pressFlag) {
            pressFlag = false;
        }
    }

}

mg.draw = function () {
    Canvas_Clear(0, 0, 0);

    Canvas_DrawImage(arbolFondoImg, 0, 0, Canvas_GetWidth(), Canvas_GetHeight())

    Canvas_SetDrawColor(255, 255, 255);

    var arbolW = 256 + 128;
    var arbolH = 256 + 128;

    Canvas_DrawImage(arbolImg, Canvas_GetWidth() / 2 - (arbolW / 2), Canvas_GetHeight() + 32 - arbolH, arbolW, arbolH);

    for (var i = 0; i < manzanas.length; i++) {
        var manzana = manzanas[i];

        Canvas_DrawImage(arbolManzanaImg, manzana.x - 32, manzana.y - 32, 64, 64);
    }


    Canvas_SetFont("50px sans-serif");
    Canvas_DrawTextAlign("Manzanas restantes: " + manzanas.length, Canvas_GetWidth() / 2, 32, TEXT_ALIGN_CENTER, TEXT_ALIGN_TOP);


    if (Mouse_GetLeftDown()) {
        Canvas_DrawImage(arbolManoCerradaImg, Mouse_GetX() - 32, Mouse_GetY() - 32, 64, 64);
    } else {
        Canvas_DrawImage(arbolManoImg, Mouse_GetX() - 32, Mouse_GetY() - 32, 64, 64);
    }
}