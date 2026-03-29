import gameOverSound from './assets/faaah.mp3';

export class AudioController {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.gameOverAudio = new Audio(gameOverSound);
        this.gameOverAudio.preload = 'auto';
        this.frequencies = {
            green: 329.63, // E4
            red: 261.63,   // C4
            yellow: 293.66,// D4
            blue: 196.00,   // G3
            error: 110.00   // A2
        };
    }

    playTone(color, duration = 0.5) {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(this.frequencies[color], this.ctx.currentTime);

        // Better sound - triangle for distinct retro feel, or sine for smooth? 
        // Let's go with a mix or just sine for purity, but maybe triangle is punchier.
        // Let's stick to sine for now but add an envelope.
        osc.type = 'triangle';

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playError() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(55, this.ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
    }

    playGameOver() {
        this.gameOverAudio.currentTime = 0;
        this.gameOverAudio.play().catch(() => {
            this.playError();
        });
    }
}
