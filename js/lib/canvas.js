var CANVAS_OBJ;
var CANVAS_CONTEXT;
function Canvas_Init() {
    CANVAS_OBJ = document.getElementById("framebuffer_canvas");
    CANVAS_CONTEXT = CANVAS_OBJ.getContext("2d");
}

function Canvas_GetCanvas() {
    return CANVAS_OBJ;
}

function Canvas_GetContext() {
    return CANVAS_CONTEXT;
}

function Canvas_GetWidth() {
    return CANVAS_OBJ.width;
}

function Canvas_GetHeight() {
    return CANVAS_OBJ.height;
}

function Canvas_GetDimensions() {
    return [CANVAS_OBJ.width, CANVAS_OBJ.height];
}

function Canvas_SetDrawColor(r, g, b) {
    CANVAS_CONTEXT.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
}

function Canvas_SetDrawColorA(r, g, b, a) {
    CANVAS_CONTEXT.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function Canvas_DrawRect(x, y, w, h) {
    CANVAS_CONTEXT.fillRect(x, y, w, h);
}

function Canvas_Clear(r, g, b) {
    Canvas_SetDrawColor(r, g, b);
    CANVAS_CONTEXT.fillRect(0, 0, CANVAS_OBJ.width, CANVAS_OBJ.height);
}