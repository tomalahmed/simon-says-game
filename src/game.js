import { AudioController } from './audio.js';

export class Game {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.bestScore = 0;
        this.isPlaying = false;
        this.isInputLocked = true;
        this.colors = ['green', 'red', 'yellow', 'blue'];

        this.ui = {
            buttons: document.querySelectorAll('.simon-btn'),
            startBtn: document.getElementById('start-btn'),
            statusLight: document.getElementById('status-light'),
            score: document.getElementById('current-score'),
            bestScore: document.getElementById('best-score'),
            messageOverlay: document.getElementById('message-overlay'),
            messageText: document.getElementById('message-text'),
            restartBtn: document.getElementById('restart-btn')
        };

        this.audio = new AudioController();
        this.init();
    }

    init() {
        this.ui.startBtn.addEventListener('click', () => this.startGame());
        this.ui.restartBtn.addEventListener('click', () => {
            this.ui.messageOverlay.classList.add('hidden');
            this.startGame();
        });

        this.ui.buttons.forEach(btn => {
            btn.addEventListener('mousedown', (e) => this.handleInput(e));
            // For mobile? touchstart?
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevent ghost clicks
                this.handleInput(e);
            });
        });

        // Load best score
        const savedBest = localStorage.getItem('simon-best-score');
        if (savedBest) {
            this.bestScore = parseInt(savedBest);
            this.updateScoreUI();
        }
    }

    async startGame() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        this.sequence = [];
        this.playerSequence = [];
        this.score = 0;
        this.bgMusic = false; // Maybe add background drone later?

        this.updateScoreUI();
        this.ui.messageOverlay.classList.add('hidden');
        this.ui.startBtn.classList.add('is-hidden');
        this.ui.startBtn.disabled = true;
        this.ui.startBtn.textContent = 'PLAYING';
        this.setStatus('active');

        await this.wait(500);
        this.nextRound();
    }

    async nextRound() {
        this.playerSequence = [];
        this.isInputLocked = true;

        // Add new color to sequence
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.sequence.push(randomColor);

        // Play sequence
        await this.wait(1000);
        for (let i = 0; i < this.sequence.length; i++) {
            await this.activateButton(this.sequence[i]);
            await this.wait(this.getSpeed()); // Speed up as game progresses?
        }

        this.isInputLocked = false;
        this.setStatus('input');
    }

    getSpeed() {
        // Speed increases as sequence gets longer.
        // Base 600ms, decrease by 20ms per level, min 200ms
        const speed = Math.max(200, 600 - (this.sequence.length * 20));
        return speed;
    }

    handleInput(e) {
        if (!this.isPlaying || this.isInputLocked) return;

        const btn = e.target.closest('.simon-btn');
        if (!btn) return;

        const color = btn.dataset.color;
        this.activateButton(color, 200); // Shorter duration for player input

        this.playerSequence.push(color);

        // Check correctness
        const currentIndex = this.playerSequence.length - 1;

        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            this.gameOver();
            return;
        }

        if (this.playerSequence.length === this.sequence.length) {
            this.isInputLocked = true;
            this.score++;
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('simon-best-score', this.bestScore);
            }
            this.updateScoreUI();
            setTimeout(() => this.nextRound(), 500);
        }
    }

    async activateButton(color, duration = 400) {
        const btn = document.querySelector(`.simon-btn[data-color="${color}"]`);
        if (!btn) return;

        btn.classList.add('active');
        this.audio.playTone(color, duration / 1000);

        await this.wait(duration);
        btn.classList.remove('active');
    }

    gameOver() {
        this.isPlaying = false;
        this.isInputLocked = true;
        this.audio.playGameOver();

        this.setStatus('error');
        this.ui.startBtn.classList.add('is-hidden');
        this.ui.startBtn.textContent = 'START';
        this.ui.startBtn.disabled = false;

        this.ui.messageText.textContent = `Game Over! Score: ${this.score}`;
        this.ui.messageOverlay.classList.remove('hidden');
    }

    setStatus(state) {
        this.ui.statusLight.style.backgroundColor =
            state === 'active' ? '#00ff00' :
                state === 'input' ? '#ffffff' :
                    state === 'error' ? '#ff0000' : '#333';
    }

    updateScoreUI() {
        this.ui.score.textContent = this.score;
        this.ui.bestScore.textContent = this.bestScore;
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
