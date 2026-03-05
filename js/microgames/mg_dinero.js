var mg_dinero = new Microgame("dinero", "¡Haz ricos a los pobres!", 20);

var pobres = [];
var millonarios = [];

var dineroPobresParaGanar = 2;
var dineroPobresConvertidos = 0;

mg_dinero.init = function() {
    pobres = [];
    millonarios = [];
    dineroPobresConvertidos = 0;

    var diff = mg_dinero.getDificultad(); 

    dineroPobresParaGanar = 2;
    var numMillonarios = 1;

    if (diff >= 3) {
        dineroPobresParaGanar = 4;
        numMillonarios = 2;
    }
    if (diff >= 6) {
        dineroPobresParaGanar = 6;
        numMillonarios = 4;
    }
    if (diff >= 9) {
        dineroPobresParaGanar = 8;
        numMillonarios = 6;
    }
    
    var padding = 64;
    var minDistance = 80;

    function isValidPosition(x, y) {
        for (var p of pobres) {
            var dx = p.x - x;
            var dy = p.y - y;
            if (Math.sqrt(dx*dx + dy*dy) < minDistance) return false;
        }
        for (var m of millonarios) {
            var dx = m.x - x;
            var dy = m.y - y;
            if (Math.sqrt(dx*dx + dy*dy) < minDistance) return false;
        }
        return true;
    }

    for(var i = 0; i < dineroPobresParaGanar; i++) {
        var px, py;
        var attempts = 0;
        do {
            px = padding + Math.random() * (Canvas_GetWidth() - padding * 2);
            py = padding + Math.random() * (Canvas_GetHeight() - padding * 2);
            attempts++;
        } while(!isValidPosition(px, py) && attempts < 100);

        pobres.push({
            "x": px,
            "y": py,
            "rico": false
        });
    }

    for(var i = 0; i < numMillonarios; i++) {
        var mx, my;
        var attempts = 0;
        do {
            mx = padding + Math.random() * (Canvas_GetWidth() - padding * 2);
            my = padding + Math.random() * (Canvas_GetHeight() - padding * 2);
            attempts++;
        } while(!isValidPosition(mx, my) && attempts < 100);

        millonarios.push({
            "x": mx,
            "y": my,
        });
    }
}

var pressFlagDinero = false;
mg_dinero.think = function(dt) {
    if (dineroPobresConvertidos >= dineroPobresParaGanar) {
        mg_dinero.win();
        return;
    }

    if (Mouse_GetLeftDown()) {
        if (pressFlagDinero) return;
        pressFlagDinero = true;

        for(var i = 0; i < millonarios.length; i++) {
            var m = millonarios[i];
            if (Mouse_InBox(m.x - 32, m.y - 32, 64, 64)) {
                PIDAM_OnMinigameLose();
                return;
            }
        }

        for(var i = 0; i < pobres.length; i++) {
            var p = pobres[i];
            if (!p.rico && Mouse_InBox(p.x - 32, p.y - 32, 64, 64)) {
                p.rico = true;
                dineroPobresConvertidos++;
            }
        }
    } else {
        pressFlagDinero = false;
    }
}

mg_dinero.draw = function() {
    Canvas_Clear(50, 50, 80); 

    Canvas_SetFont("64px sans-serif");
    
    for(var i = 0; i < millonarios.length; i++) {
        var m = millonarios[i];
        Canvas_DrawTextAlign("🕴️", m.x, m.y, TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
    }

    for(var i = 0; i < pobres.length; i++) {
        var p = pobres[i];
        var icon = p.rico ? "🤑" : "😔";
        Canvas_DrawTextAlign(icon, p.x, p.y, TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
    }

    Canvas_SetFont("40px sans-serif");
    Canvas_SetDrawColor(255, 255, 255);
    Canvas_DrawTextAlign("Pobres restantes: " + (dineroPobresParaGanar - dineroPobresConvertidos), Canvas_GetWidth() / 2, 32, TEXT_ALIGN_CENTER, TEXT_ALIGN_TOP);

    Canvas_SetFont("64px sans-serif");
    Canvas_DrawTextAlign("💵", Mouse_GetX(), Mouse_GetY(), TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);

    if (Mouse_GetLeftDown()) {
        Canvas_DrawTextAlign("💥", Mouse_GetX(), Mouse_GetY(), TEXT_ALIGN_CENTER, TEXT_ALIGN_MIDDLE);
    }
}
