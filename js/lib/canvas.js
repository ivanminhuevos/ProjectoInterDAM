var CANVAS_OBJ;
var CANVAS_CONTEXT;
function Canvas_Init() {
    CANVAS_OBJ = document.getElementById("framebuffer_canvas");
    CANVAS_CONTEXT = CANVAS_OBJ.getContext("2d");

    // para que sea pixelado
    //CANVAS_CONTEXT.imageSmoothingEnabled = false;
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

function Canvas_NewImage(path) {
    const img = new Image();
    img.src = path;

    return img;
}

function Canvas_DrawImage(img, x, y, w, h) {
    if(img == null) {
        return;
    }

    CANVAS_CONTEXT.drawImage(img, x, y, w, h);
}

function Canvas_SetFont(font) {
    CANVAS_CONTEXT.font = font;
}

function Canvas_DrawText(msg, x, y) {
    CANVAS_CONTEXT.fillText(msg, x, y);
}

TEXT_ALIGN_LEFT = 0
TEXT_ALIGN_CENTER = -0.5
TEXT_ALIGN_RIGHT = -1

TEXT_ALIGN_TOP = 1
TEXT_ALIGN_MIDDLE = 0.25
TEXT_ALIGN_BOTTOM = 0

function Canvas_DrawTextAlign(msg, x, y, alX, alY) {
    var measure = CANVAS_CONTEXT.measureText(msg);

    var tW = measure.width;
    var tH = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
    
    CANVAS_CONTEXT.shadowColor = "black";
    CANVAS_CONTEXT.shadowBlur = 6;
    CANVAS_CONTEXT.shadowOffsetX = 2;
    CANVAS_CONTEXT.shadowOffsetY = 2;

    CANVAS_CONTEXT.fillText(msg, x + (tW * alX), y + (tH * alY));

    CANVAS_CONTEXT.shadowOffsetX = 0;
    CANVAS_CONTEXT.shadowOffsetY = 0;
    CANVAS_CONTEXT.shadowBlur = 0;
    CANVAS_CONTEXT.shadowColor = "rgba(0, 0, 0, 0)";
}
