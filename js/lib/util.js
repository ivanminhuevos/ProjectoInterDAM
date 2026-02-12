var dt = 0;
var curTime = 0;

function Util_GetDeltaTime() {
    return dt;
}

function Util_Internal_SetDeltaTime(dtGet) {
    dt = dtGet;
    curTime += dtGet;
}

function Util_GetCurTime() {
    return curTime;
}