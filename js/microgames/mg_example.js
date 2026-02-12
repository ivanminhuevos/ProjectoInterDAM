console.log("holaaa")
var mg = new Microgame("example");
console.log(mg);

mg.init = function() {
    console.log("Init, dificultad: " + mg.getDificultad());
}

mg.think = function(dt) {

}

mg.draw = function() {
    Canvas_Clear(0, 0, (Util_GetCurTime() * 32) % 255);
}