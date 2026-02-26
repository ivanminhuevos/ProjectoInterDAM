console.log("holaaa")
var mg = new Microgame("example", "Ejemplo!");
console.log(mg);

var imgTest = Canvas_NewImage("/img/debug/texture1.png");

mg.init = function() {
    console.log("Init, dificultad: " + mg.getDificultad());
}

mg.think = function(dt) {
    
}

mg.draw = function() {
    Canvas_Clear(0, 0, (Util_GetCurTime() * 32) % 255);

    Canvas_SetDrawColor(255, 0, 255);

    Canvas_DrawImage(imgTest, Mouse_GetX(), Mouse_GetY(), 256, 256);
}