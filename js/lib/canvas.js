var CANVAS_OBJ;
function Canvas_GetCanvas() {
    return CANVAS_OBJ;
}

window.onload = function() {
    console.log("Cargado");
    CANVAS_OBJ = document.getElementById("framebuffer_canvas");
}