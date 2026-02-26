var mouseLeftDown = false;
var mouseRightDown = false;
function onMouse(ev) {
    mouseLeftDown = (ev.buttons & 0b00000001) > 0;
    mouseRightDown = (ev.buttons & 0b00000010) > 0;
}

document.addEventListener("mouseup", onMouse);
document.addEventListener("mousedown", onMouse);

var mouseX = 0;
var mouseY = 0;
function Mouse_GetX() {
    return mouseX;
}

function Mouse_GetY() {
    return mouseY;
}

function Mouse_GetLeftDown() {
    return mouseLeftDown;
}

function Mouse_GetRightDown() {
    return mouseRightDown;
}

function Mouse_Inrange(x, a, b) {
    return (x >= a) && (x <= b);
}

function Mouse_InBox(x, y, w, h) {
    return Mouse_Inrange(mouseX, x, x + w) && Mouse_Inrange(mouseY, y, y + h);
}


function MOUSE_Update(e) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
}

