let timer;
let baseTime = 5.0;
let timeLeft = 5.0;
let gameActive = false;
let machinesOff = 0;
let score = 0;
let level = 1;
let goal = 2;

const timerBar = document.getElementById('timer-bar');
const offCountDisplay = document.getElementById('off-count');
const goalValDisplay = document.getElementById('goal-val');
const overlay = document.getElementById('overlay');
const resultText = document.getElementById('result-text');
const prompt = document.getElementById('prompt');
const scoreVal = document.getElementById('score-val');
const levelVal = document.getElementById('level-val');

function startGame(isFullReset = true) {
    if (isFullReset) {
        score = 0;
        level = 1;
        baseTime = 5.0;
        goal = 2;
        scoreVal.textContent = '0';
        levelVal.textContent = '1';
        goalValDisplay.textContent = '2';
    }

    gameActive = true;
    timeLeft = baseTime;
    machinesOff = 0;
    offCountDisplay.textContent = '0';
    overlay.classList.add('hidden');

    // Reset machines
    const machines = document.querySelectorAll('.machine');
    machines.forEach(m => {
        m.classList.remove('off');
        m.classList.add('on');
        m.style.transform = 'translateY(0)';
    });

    if (timer) clearInterval(timer);

    const tickRate = 50;
    timer = setInterval(() => {
        timeLeft -= tickRate / 1000;

        const percentage = (timeLeft / baseTime) * 100;
        timerBar.style.width = `${Math.max(0, percentage)}%`;

        if (timeLeft <= 0) {
            endGame();
        }
    }, tickRate);
}

function toggleMachine(id) {
    if (!gameActive) return;

    const machine = document.getElementById(id);
    if (machine.classList.contains('on')) {
        machine.classList.remove('on');
        machine.classList.add('off');
        machinesOff++;
        offCountDisplay.textContent = machinesOff;

        machine.style.transform = 'scale(0.95)';
        setTimeout(() => {
            if (machine.classList.contains('off')) {
                machine.style.transform = 'translateY(5px)';
            }
        }, 100);

        // Instant win check for faster pace
        if (machinesOff >= goal) {
            winRound();
        }
    }
}

function winRound() {
    gameActive = false;
    clearInterval(timer);

    score++;
    scoreVal.textContent = score;

    // Level up check
    if (score > 0 && score % 10 === 0) {
        level++;
        levelVal.textContent = level;

        // Difficulty Scaling
        baseTime = Math.max(1.5, baseTime - 0.5);
        if (goal < 4) {
            goal++;
            goalValDisplay.textContent = goal;
        }

        // Flash level up
        prompt.textContent = "¡NIVEL UP!";
        prompt.style.color = "var(--neon-blue)";
        setTimeout(() => {
            prompt.textContent = "¡APÁGALO!";
            prompt.style.color = "var(--neon-red)";
        }, 1000);
    }

    // Brief Success Visual
    timerBar.style.width = '100%';
    timerBar.style.background = 'var(--neon-green)';

    setTimeout(() => {
        timerBar.style.background = 'linear-gradient(90deg, var(--neon-blue), var(--neon-green))';
        startGame(false); // Start next round without resetting score/level
    }, 800);
}

function endGame() {
    gameActive = false;
    clearInterval(timer);

    overlay.classList.remove('hidden');
    resultText.textContent = "¡FALLASTE!";
    resultText.className = 'fail';
}

window.onload = () => startGame(true);

