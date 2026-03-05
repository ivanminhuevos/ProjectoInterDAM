(function () {
    var mg = new Microgame("pozos", "¡Busca el agua potable!");

    var potableWell = 0;
    var wells = [
        { x: 100, y: 300, w: 150, h: 200, hover: 0 },
        { x: 325, y: 300, w: 150, h: 200, hover: 0 },
        { x: 550, y: 300, w: 150, h: 200, hover: 0 }
    ];

    var timeLeft = 5;
    var state = "playing"; // "playing", "won", "lost"
    var stateTime = 0;

    mg.init = function () {
        potableWell = Math.floor(Math.random() * 3);

        // Difficulty scaling: 5s base, -0.4s per level, minimum 1.5s
        timeLeft = Math.max(1.5, 5 - mg.getDificultad() * 0.4);

        state = "playing";
        stateTime = 0;

        console.log("Minijuego Pozos: Pozo potable es " + potableWell + " | Tiempo: " + timeLeft.toFixed(2));

        for (var i = 0; i < wells.length; i++) {
            wells[i].hover = 0;
        }
    }

    mg.think = function (dt) {
        stateTime += dt;

        if (state === "playing") {
            timeLeft -= dt;
            if (timeLeft <= 0) {
                timeLeft = 0;
                state = "lost";
                stateTime = 0;
            }

            for (var i = 0; i < wells.length; i++) {
                var w = wells[i];
                var isOver = Mouse_InBox(w.x, w.y, w.w, w.h);

                if (isOver) {
                    w.hover = Math.min(w.hover + dt * 10, 1);

                    if (Mouse_GetLeftDown()) {
                        if (i === potableWell) {
                            state = "won";
                            stateTime = 0;
                        } else {
                            state = "lost";
                            stateTime = 0;
                        }
                    }
                } else {
                    w.hover = Math.max(w.hover - dt * 10, 0);
                }
            }
        } else {
            // After 1.5 seconds of showing feedback, proceed
            if (stateTime > 1.5) {
                if (state === "won") {
                    mg.win();
                } else {
                    PIDAM_OnMinigameLoss(); // Manual fail transition
                }
            }
        }
    }

    mg.draw = function () {
        Canvas_Clear(10, 10, 25);

        // Draw Timer
        var timerWidth = (timeLeft / 5) * Canvas_GetWidth();
        Canvas_SetDrawColor(255, 255, 0);
        Canvas_DrawRect(0, 0, timerWidth, 10);

        // Draw instructions or feedback
        var msg = mg.desc;
        var msgColor = [0, 210, 255]; // Neon cyan base

        if (state === "won") {
            msg = "¡Agua limpia!";
            msgColor = [57, 255, 20]; // Neon green
        } else if (state === "lost") {
            msg = "¡Contaminada!";
            msgColor = [255, 49, 49]; // Neon red
        }

        Canvas_SetFont("800 56px Outfit, sans-serif");
        Canvas_SetDrawColor(msgColor[0], msgColor[1], msgColor[2]);
        Canvas_DrawTextAlign(msg, Canvas_GetWidth() / 2, 80, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);

        // Draw Wells
        for (var i = 0; i < wells.length; i++) {
            var w = wells[i];
            var hoverScale = 1 + w.hover * 0.05;
            var drawW = w.w * hoverScale;
            var drawH = w.h * hoverScale;
            var drawX = w.x - (drawW - w.w) / 2;
            var drawY = w.y - (drawH - w.h) / 2;

            Canvas_SetDrawColor(30, 30, 60);
            Canvas_DrawRect(drawX, drawY, drawW, drawH);

            var r = i === potableWell ? 0 : 180;
            var g = i === potableWell ? 180 : 0;
            var b = 255;

            Canvas_SetDrawColorA(r, g, b, 0.2 + w.hover * 0.3);
            Canvas_DrawRect(drawX + 10, drawY + 10, drawW - 20, drawH - 20);

            Canvas_SetDrawColor(100, 100, 150);
            Canvas_DrawRect(drawX, drawY, drawW, 20);

            if (w.hover > 0 && state === "playing") {
                Canvas_SetDrawColorA(255, 255, 255, w.hover * 0.3);
                Canvas_DrawRect(drawX, drawY, drawW, drawH);
            }
        }
    }
})();
