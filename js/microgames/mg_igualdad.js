(function () {
    var mg = new Microgame("igualdad", "¡Rompe el techo!");

    var timeLeft = 5;
    var state = "playing"; // "playing", "won", "lost"
    var stateTime = 0;
    var clicksNeeded = 5;
    var clicksDone = 0;

    var glassBox = { x: 100, y: 200, w: 600, h: 120, hover: 0 };
    var previousMouseState = false;

    mg.init = function () {
        timeLeft = Math.max(3, 5 - mg.getDificultad() * 0.2);
        clicksNeeded = 5 + Math.floor(mg.getDificultad() / 2);

        state = "playing";
        stateTime = 0;
        clicksDone = 0;
        previousMouseState = Mouse_GetLeftDown();

        console.log("Minijuego Igualdad: Clics objetivo " + clicksNeeded + " | Tiempo: " + timeLeft.toFixed(2));
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

            var isOver = Mouse_InBox(glassBox.x, glassBox.y, glassBox.w, glassBox.h);
            if (isOver) {
                glassBox.hover = Math.min(glassBox.hover + dt * 10, 1);
            } else {
                glassBox.hover = Math.max(glassBox.hover - dt * 10, 0);
            }

            var currentMouseState = Mouse_GetLeftDown();
            // Detect single click (edge detection)
            if (currentMouseState && !previousMouseState && isOver) {
                clicksDone++;
                if (clicksDone >= clicksNeeded) {
                    state = "won";
                    stateTime = 0;
                }
            }
            previousMouseState = currentMouseState;

        } else {
            if (stateTime > 1.5) {
                if (state === "won") mg.win();
                else PIDAM_OnMinigameLoss();
            }
        }
    }

    mg.draw = function () {
        Canvas_Clear(20, 15, 30); // Dark violet background

        // Draw Timer
        var baseTime = Math.max(3, 5 - mg.getDificultad() * 0.2);
        var timerWidth = (timeLeft / baseTime) * Canvas_GetWidth();
        Canvas_SetDrawColor(255, 105, 180); // Hot pink for gender equality vibe
        Canvas_DrawRect(0, 0, timerWidth, 10);

        var msg = mg.desc;
        var msgColor = [255, 105, 180];

        if (state === "won") {
            msg = "¡Igualdad Alcanzada!";
            msgColor = [57, 255, 20]; // Neon Green
        } else if (state === "lost") {
            msg = "El techo resiste...";
            msgColor = [255, 49, 49]; // Neon Red
        }

        Canvas_SetFont("800 56px Outfit, sans-serif");
        Canvas_SetDrawColor(msgColor[0], msgColor[1], msgColor[2]);
        Canvas_DrawTextAlign(msg, Canvas_GetWidth() / 2, 80, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);

        // Draw characters at the bottom
        Canvas_SetFont("80px Outfit, sans-serif");
        Canvas_DrawTextAlign("👩‍💻", Canvas_GetWidth() / 2 - 60, Canvas_GetHeight() - 80, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);
        Canvas_DrawTextAlign("👨‍💻", Canvas_GetWidth() / 2 + 60, Canvas_GetHeight() - 80, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);

        // Draw Glass Ceiling
        if (state !== "won") {
            var glassHealth = 1 - (clicksDone / clicksNeeded);
            var alpha = 0.2 + (glassHealth * 0.6); // Becomes more transparent

            var shakeX = (glassBox.hover > 0 && state === "playing") ? (Math.random() - 0.5) * 6 : 0;
            var shakeY = (glassBox.hover > 0 && state === "playing") ? (Math.random() - 0.5) * 6 : 0;

            // Glass Background
            Canvas_SetDrawColorA(150, 200, 255, alpha);
            Canvas_DrawRect(glassBox.x + shakeX, glassBox.y + shakeY, glassBox.w, glassBox.h);

            // Glass Border
            Canvas_SetDrawColor(0, 210, 255);
            var bSize = 4;
            Canvas_DrawRect(glassBox.x + shakeX, glassBox.y + shakeY, glassBox.w, bSize);
            Canvas_DrawRect(glassBox.x + shakeX, glassBox.y + glassBox.h - bSize + shakeY, glassBox.w, bSize);
            Canvas_DrawRect(glassBox.x + shakeX, glassBox.y + shakeY, bSize, glassBox.h);
            Canvas_DrawRect(glassBox.x + glassBox.w - bSize + shakeX, glassBox.y + shakeY, bSize, glassBox.h);

            // Draw cracks based on clicks
            Canvas_SetDrawColorA(255, 255, 255, 0.9);
            for (var i = 0; i < clicksDone; i++) {
                var crackX = glassBox.x + (i * ((glassBox.w - 40) / clicksNeeded)) + 20;
                // Vertical crack
                Canvas_DrawRect(crackX + shakeX, glassBox.y + 10 + shakeY, 3, glassBox.h - 20);
                // Diagonal/horizontal crack offshoot
                if (i % 2 === 0) {
                    Canvas_DrawRect(crackX - 15 + shakeX, glassBox.y + glassBox.h / 2 + shakeY, 30, 3);
                }
            }

            Canvas_SetFont("bold 28px Outfit, sans-serif");
            Canvas_SetDrawColor(255, 255, 255);
            Canvas_DrawTextAlign("CLIC PARA ROMPER: " + clicksDone + " / " + clicksNeeded, Canvas_GetWidth() / 2, glassBox.y + glassBox.h / 2 + shakeY, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);
        } else {
            // Broken glass effect
            Canvas_SetFont("80px Outfit, sans-serif");
            Canvas_DrawTextAlign("✨ 🚀 ✨", Canvas_GetWidth() / 2, glassBox.y + glassBox.h / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);
        }
    }
})();
