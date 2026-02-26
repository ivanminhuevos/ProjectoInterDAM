var mgRegistry = {}
var mgSeqRegistry = []
class Microgame {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
        this.dificultad = 0;

        mgRegistry[name] = this;
        mgSeqRegistry.push(name);
    }

    getDificultad() {
        return this.dificultad;
    }

    setDificultad(newDificultad) {
        this.dificultad = newDificultad;
    }
    
    init() {}

    think() {}

    draw() {}

    win() {
        PIDAM_OnMinigameWin();
    }
}

function Microgames_GetByName(name) {
    return mgRegistry[name]
}

var activeMG;
function Microgames_SetActive(name) {
    mg = Microgames_GetByName(name);

    if(mg == null) {
        console.error("El minijuego \"" + name + "\" no existe!");
        return;
    }
    
    activeMG = mg;
    mg.init();
}

function Microgames_GetActive() {
    return activeMG;
}

function Microgames_ThinkActive() {
    if(activeMG == undefined) {
        return;
    }

    if(activeMG.think == null) {
        return;
    }

    activeMG.think(Util_GetDeltaTime());
}

function Microgames_DrawActive() {
    if(activeMG == undefined) {
        return;
    }

    if(activeMG.draw == null) {
        return;
    }

    activeMG.draw();
}

function Microgames_GetRandom() {
    var randIdx = Math.floor(Math.random() * mgSeqRegistry.length);
    return mgSeqRegistry[randIdx];
}