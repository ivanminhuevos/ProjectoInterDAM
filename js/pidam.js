console.log("Hola!");

function PIDAM_Init() {
    Canvas_Init();

    Canvas_Clear(0, 0, 255);
    
    canvas = Canvas_GetCanvas();

    prevTime = Date.now();
    deltaTime = 1;
    requestAnimationFrame(function update() {
        deltaTime = (Date.now() - prevTime) / 1000;
        Util_Internal_SetDeltaTime(deltaTime);
        

        Microgames_ThinkActive();
        Microgames_DrawActive();

        prevTime = Date.now();
        requestAnimationFrame(update);
    })
}


window.onload = function() {
    PIDAM_Init();

    Microgames_SetActive("example");
}
