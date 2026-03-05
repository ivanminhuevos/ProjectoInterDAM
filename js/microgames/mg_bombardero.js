var mg_bombardero = new Microgame("bombardero", "¡Destruye las fábricas contaminantes!", 20);

var fabricas = [];
var bombas = [];
var fabricasDestruidas = 0;
var fabricasParaGanar = 2;

var avion = {
    x: 0,
    y: 50,
    w: 80,
    h: 40,
    vx: 200, // píxeles por segundo
    dir: 1
};

var cooldownBomba = 0;

mg_bombardero.init = function () {
    fabricas = [];
    bombas = [];
    fabricasDestruidas = 0;
    cooldownBomba = 0;

    avion.x = Canvas_GetWidth() / 2;
    avion.y = 50;

    var diff = mg_bombardero.getDificultad();

    fabricasParaGanar = 2;
    avion.vx = 200;

    if (diff >= 3) {
        fabricasParaGanar = 4;
        avion.vx = 250;
    }
    if (diff >= 6) {
        fabricasParaGanar = 6;
        avion.vx = 350;
    }
    if (diff >= 9) {
        fabricasParaGanar = 8; // En este punto llenamos casi toda la pantalla
        avion.vx = 450;
    }

    var padding = 20;
    var slotWidth = 70;
    var slotHeight = 70;

    function isValidPosition(x) {
        for (var f of fabricas) {
            var dx = f.x - x;
            if (Math.abs(dx) < slotWidth + padding) return false;
        }
        return true;
    }

    for (var i = 0; i < fabricasParaGanar; i++) {
        var px;
        var attempts = 0;
        do {
            px = padding + Math.random() * (Canvas_GetWidth() - slotWidth - padding * 2);
            attempts++;
        } while (!isValidPosition(px) && attempts < 100);

        fabricas.push({
            x: px,
            y: Canvas_GetHeight() - slotHeight - 20, // Abajo del todo
            w: slotWidth,
            h: slotHeight,
            destruida: false
        });
    }
}

var pressFlagBombardero = false;
mg_bombardero.think = function (dt) {
    if (fabricasDestruidas >= fabricasParaGanar) {
        mg_bombardero.win();
        return;
    }

    // Movimiento del avión
    avion.x += avion.vx * avion.dir * dt;
    if (avion.x <= 0) {
        avion.x = 0;
        avion.dir = 1;
    } else if (avion.x + avion.w >= Canvas_GetWidth()) {
        avion.x = Canvas_GetWidth() - avion.w;
        avion.dir = -1;
    }

    // Cooldown de bombas
    if (cooldownBomba > 0) {
        cooldownBomba -= dt;
    }

    // Soltar bomba
    if (Mouse_GetLeftDown()) {
        if (!pressFlagBombardero && cooldownBomba <= 0) {
            bombas.push({
                x: avion.x + avion.w / 2 - 10,
                y: avion.y + avion.h,
                w: 20,
                h: 20,
                vy: 300 // Velocidad de caída
            });
            cooldownBomba = 0.5; // Medio segundo entre bombas
        }
        pressFlagBombardero = true;
    } else {
        pressFlagBombardero = false;
    }

    // Física de las bombas y colisiones
    for (var i = bombas.length - 1; i >= 0; i--) {
        var b = bombas[i];
        b.y += b.vy * dt;

        // Comprobar si sale de la pantalla
        if (b.y > Canvas_GetHeight()) {
            bombas.splice(i, 1);
            continue;
        }

        // Comprobar colisiones con fábricas
        var bombaHit = false;
        for (var j = 0; j < fabricas.length; j++) {
            var f = fabricas[j];
            if (f.destruida) continue;

            // Simple AABB colisión
            if (b.x < f.x + f.w &&
                b.x + b.w > f.x &&
                b.y < f.y + f.h &&
                b.y + b.h > f.y) {

                f.destruida = true;
                fabricasDestruidas++;
                bombaHit = true;
                break;
            }
        }

        if (bombaHit) {
            bombas.splice(i, 1);
        }
    }
}

mg_bombardero.draw = function () {
    Canvas_Clear(100, 150, 255); // Cielo azul claro

    // Suelo
    Canvas_SetDrawColor(50, 50, 50);
    Canvas_DrawRect(0, Canvas_GetHeight() - 30, Canvas_GetWidth(), 30);

    // Dibujar fábricas
    for (var i = 0; i < fabricas.length; i++) {
        var f = fabricas[i];

        Canvas_SetFont("64px sans-serif");
        if (f.destruida) {
            Canvas_DrawTextAlign("💥", f.x + f.w / 2, f.y + f.h / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
        } else {
            Canvas_DrawTextAlign("🏭", f.x + f.w / 2, f.y + f.h / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
        }
    }

    // Dibujar bombas
    Canvas_SetFont("32px sans-serif");
    for (var i = 0; i < bombas.length; i++) {
        var b = bombas[i];
        Canvas_DrawTextAlign("💣", b.x + b.w / 2, b.y + b.h / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
    }

    // Dibujar avión
    Canvas_SetFont("64px sans-serif");
    // Voltear el avión según la dirección
    var avionIcon = avion.dir === 1 ? "✈️" : "🛩️"; // Emoji similar invertido si es posible (en font estándar se nota poco, pero usamos avionetas)
    Canvas_DrawTextAlign("✈️", avion.x + avion.w / 2, avion.y + avion.h / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);

    // UI
    Canvas_SetFont("40px sans-serif");
    Canvas_SetDrawColor(255, 255, 255);
    var restantes = fabricasParaGanar - fabricasDestruidas;
    Canvas_DrawTextAlign("Fábricas restantes: " + restantes, Canvas_GetWidth() / 2, 32, TEXT_ALIGN_CENTER, TEXT_ALIGN_TOP);
}
