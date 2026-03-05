(function () {
    var mg = new Microgame("clima", "¡Apaga las máquinas!");

    var machines = [
        { id: 0, x: 180, y: 200, w: 200, h: 140, on: true, hover: 0 },
        { id: 1, x: 420, y: 200, w: 200, h: 140, on: true, hover: 0 },
        { id: 2, x: 180, y: 380, w: 200, h: 140, on: true, hover: 0 },
        { id: 3, x: 420, y: 380, w: 200, h: 140, on: true, hover: 0 }
    ];

    var timeLeft = 5;
    var state = "playing"; // "playing", "won", "lost"
    var stateTime = 0;
    var goal = 2;
    var totalTimeSinceStart = 0;

    mg.init = function () {
        // Difficulty scaling: 5s base, -0.4s per level, minimum 1.5s
        timeLeft = Math.max(1.5, 5 - mg.getDificultad() * 0.4);
        goal = Math.min(4, 2 + Math.floor(mg.getDificultad() / 3));

        state = "playing";
        stateTime = 0;
        totalTimeSinceStart = 0;

        for (var i = 0; i < machines.length; i++) {
            machines[i].on = true;
            machines[i].hover = 0;
        }

        console.log("Minijuego Clima: Objetivo " + goal + " | Tiempo: " + timeLeft.toFixed(2));
    }

    mg.think = function (dt) {
        stateTime += dt;
        totalTimeSinceStart += dt;

        if (state === "playing") {
            timeLeft -= dt;
            if (timeLeft <= 0) {
                timeLeft = 0;
                state = "lost";
                stateTime = 0;
            }

            var machinesOff = 0;
            for (var i = 0; i < machines.length; i++) {
                var m = machines[i];
                if (!m.on) {
                    machinesOff++;
                    continue;
                }

                var isOver = Mouse_InBox(m.x, m.y, m.w, m.h);

                if (isOver) {
                    m.hover = Math.min(m.hover + dt * 10, 1);

                    if (Mouse_GetLeftDown()) {
                        m.on = false;
                    }
                } else {
                    m.hover = Math.max(m.hover - dt * 10, 0);
                }
            }

            if (machinesOff >= goal) {
                state = "won";
                stateTime = 0;
            }
        } else {
            if (stateTime > 1.5) {
                if (state === "won") mg.win();
                else PIDAM_OnMinigameLoss();
            }
        }
    }

    mg.draw = function () {
        // Background - Very dark blue/black
        Canvas_Clear(13, 13, 18);

        // Draw Timer
        var timerWidth = (timeLeft / 5) * Canvas_GetWidth();
        Canvas_SetDrawColor(0, 210, 255); // Neon Blue
        Canvas_DrawRect(0, 0, timerWidth, 10);

        // Feedback Text
        var msg = mg.desc;
        var msgColor = [255, 49, 49]; // Neon Red

        if (state === "won") {
            msg = "¡Logrado!";
            msgColor = [57, 255, 20]; // Neon Green
        } else if (state === "lost") {
            msg = "¡Fallaste!";
            msgColor = [255, 49, 49]; // Neon Red
        }

        Canvas_SetFont("800 56px Outfit, sans-serif");
        Canvas_SetDrawColor(msgColor[0], msgColor[1], msgColor[2]);
        Canvas_DrawTextAlign(msg, Canvas_GetWidth() / 2, 100, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);

        // Counter
        var offCount = 0;
        for (var i = 0; i < machines.length; i++) if (!machines[i].on) offCount++;
        Canvas_SetFont("bold 24px Outfit, sans-serif");
        Canvas_SetDrawColor(0, 210, 255);
        Canvas_DrawTextAlign("MÁQUINAS: " + offCount + " / " + goal, Canvas_GetWidth() / 2, 160, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);

        // Draw Machines
        for (var i = 0; i < machines.length; i++) {
            var m = machines[i];
            var scale = 1 + m.hover * 0.05;
            var w = m.w * scale;
            var h = m.h * scale;
            var x = m.x - (w - m.w) / 2;
            var y = m.y - (h - m.h) / 2;

            // Machine Body
            if (m.on) Canvas_SetDrawColor(45, 45, 58);
            else Canvas_SetDrawColor(26, 26, 36);
            Canvas_DrawRect(x, y, w, h);

            // Border
            if (m.on) Canvas_SetDrawColor(0, 210, 255); // Blue border when ON
            else Canvas_SetDrawColor(34, 34, 34); // Grey border when OFF

            var bSize = 3;
            Canvas_DrawRect(x, y, w, bSize);
            Canvas_DrawRect(x, y + h - bSize, w, bSize);
            Canvas_DrawRect(x, y, bSize, h);
            Canvas_DrawRect(x + w - bSize, y, bSize, h);

            // Status Light
            if (m.on) {
                // Blinking red light
                var alpha = 0.5 + Math.sin(totalTimeSinceStart * 10) * 0.5;
                Canvas_SetDrawColorA(255, 49, 49, alpha);
            } else {
                Canvas_SetDrawColor(34, 34, 34);
            }
            Canvas_DrawRect(x + w - 25, y + 10, 15, 15);

            // Icon (Lightning Bolt)
            var shakeX = 0;
            var shakeY = 0;
            if (m.on && state === "playing") {
                shakeX = (Math.random() - 0.5) * 4;
                shakeY = (Math.random() - 0.5) * 4;
                Canvas_SetDrawColor(57, 255, 20); // Neon Green
            } else {
                Canvas_SetDrawColor(51, 51, 51); // Dark Gray
            }

            Canvas_SetFont("64px Outfit, sans-serif");
            Canvas_DrawTextAlign("⚡", x + w / 2 + shakeX, y + h / 2 + shakeY + 25, TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER);

            // Hover overlay
            if (m.hover > 0 && m.on && state === "playing") {
                Canvas_SetDrawColorA(255, 255, 255, m.hover * 0.1);
                Canvas_DrawRect(x, y, w, h);
            }
        }
    }
})();
