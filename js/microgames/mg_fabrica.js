var mg_fabrica = new Microgame("fabrica", "¡Planta semillas para crear fábricas!", 20);

var tierraSlots = [];
var fabricasPlantadas = 0;
var fabricasParaGanar = 3;

var backgroundImgFabrica = Canvas_NewImage("/img/fabrica/fondo.png"); // opcional si se quiere añadir imagen
var tierraImg = Canvas_NewImage("/img/fabrica/tierra.png"); // visual fallback por rectángulos

mg_fabrica.init = function () {
    tierraSlots = [];
    fabricasPlantadas = 0;

    var diff = mg_fabrica.getDificultad();

    fabricasParaGanar = 3;
    if (diff >= 4) {
        fabricasParaGanar = 6;
    }
    if (diff >= 8) {
        fabricasParaGanar = 9;
    }

    var slotWidth = 80;
    var slotHeight = 80;
    var padding = 20;

    function isValidPosition(x, y) {
        for (var s of tierraSlots) {
            var dx = s.x - x;
            var dy = s.y - y;
            // Verificar colisión simple con un poco de padding
            if (Math.abs(dx) < slotWidth + padding && Math.abs(dy) < slotHeight + padding) return false;
        }
        return true;
    }

    for (var i = 0; i < fabricasParaGanar; i++) {
        var px, py;
        var attempts = 0;
        do {
            // Generar posición aleatoria dentro del área verde (la mitad inferior de la pantalla)
            px = padding + Math.random() * (Canvas_GetWidth() - slotWidth - padding * 2);
            py = (Canvas_GetHeight() / 2) + Math.random() * ((Canvas_GetHeight() / 2) - slotHeight - padding);
            attempts++;
        } while (!isValidPosition(px, py) && attempts < 100);

        tierraSlots.push({
            x: px,
            y: py,
            w: slotWidth,
            h: slotHeight,
            plantada: false
        });
    }
}

var pressFlagFabrica = false;
mg_fabrica.think = function (dt) {
    if (fabricasPlantadas >= fabricasParaGanar) {
        mg_fabrica.win();
        return;
    }

    if (Mouse_GetLeftDown()) {
        if (pressFlagFabrica) return;
        pressFlagFabrica = true;

        for (var i = 0; i < tierraSlots.length; i++) {
            var s = tierraSlots[i];
            if (!s.plantada && Mouse_InBox(s.x, s.y, s.w, s.h)) {
                s.plantada = true;
                fabricasPlantadas++;
            }
        }
    } else {
        pressFlagFabrica = false;
    }
}

mg_fabrica.draw = function () {
    Canvas_Clear(135, 206, 235); // Color cielo azul claro

    // Suelo verde decorativo
    Canvas_SetDrawColor(34, 139, 34);
    Canvas_DrawRect(0, Canvas_GetHeight() / 2, Canvas_GetWidth(), Canvas_GetHeight() / 2);

    for (var i = 0; i < tierraSlots.length; i++) {
        var s = tierraSlots[i];

        Canvas_SetDrawColor(139, 69, 19); // Color marrón para la tierra
        Canvas_DrawRect(s.x, s.y, s.w, s.h);

        if (s.plantada) {
            Canvas_SetFont("64px sans-serif");
            Canvas_DrawTextAlign("🏭", s.x + s.w / 2, s.y + s.h / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
        } else {
            Canvas_SetFont("32px sans-serif");
            Canvas_DrawTextAlign("🌱", s.x + s.w / 2, s.y + s.h / 2, TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
        }
    }

    Canvas_SetFont("40px sans-serif");
    Canvas_SetDrawColor(0, 0, 0); // Texto negro para que se vea en el cielo
    var restantes = fabricasParaGanar - fabricasPlantadas;
    Canvas_DrawTextAlign("Fábricas por plantar: " + restantes, Canvas_GetWidth() / 2, 32, TEXT_ALIGN_CENTER, TEXT_ALIGN_TOP);

    // Cursor (bolsa de semillas)
    Canvas_SetFont("64px sans-serif");
    var cursorIcon = Mouse_GetLeftDown() ? "💧" : "🫘";
    Canvas_DrawTextAlign(cursorIcon, Mouse_GetX(), Mouse_GetY(), TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
}
