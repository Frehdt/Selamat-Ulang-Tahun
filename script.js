/**
 * Interactive Birthday Greeting Letter
 * Built with vanilla Javascript, HTML5 Canvas, and Web Audio API
 */
// ==========================================================================
// Configurations & Constants
// ==========================================================================
const TITLE_TEXT = "HAPPY BIRTDAY ✨";
const BODY_TEXT = `Selamat ulang tahun untuk seseorang yang kehadirannya selalu membawa kehangatan dan keteduhan di hati orang-orang di sekitarnya.

Di hari yang indah ini, aku ingin kamu tahu betapa berartinya dirimu. Terima kasih atas setiap senyuman yang pernah kamu bagikan, setiap tawa yang meringankan beban, dan setiap ketulusan yang selalu kamu tunjukkan dalam diam. Dunia ini menjadi tempat yang jauh lebih indah karena ada kamu di dalamnya.

Semoga di usiamu yang baru ini, setiap doa baik yang kamu bisikkan dalam sujudmu segera menemukan jawabannya. Semoga langkah kakimu selalu dituntun menuju kebahagiaan, hatimu senantiasa dijaga dalam kedamaian, dan pundakmu selalu dikuatkan untuk melewati segala rintangan. Jangan pernah ragukan berharganya dirimu, karena bagi banyak orang—termasuk aku—kamu adalah anugerah terindah.

Selamat merayakan hari kelahiranmu. Teruslah bersinar dengan caramu yang anggun dan sederhana 💖`;
const SIGNATURE_NAME = "Dari Aku";
// Web Audio API Melody: Happy Birthday (Tempo ~120 BPM)
// Notes and durations (1 = quarter note, 0.5 = eighth, 1.5 = dotted quarter, etc.)
const MELODY = [
    { note: "C4", dur: 0.75 }, { note: "C4", dur: 0.25 }, { note: "D4", dur: 1.0 }, { note: "C4", dur: 1.0 }, { note: "F4", dur: 1.0 }, { note: "E4", dur: 2.0 },
    { note: "C4", dur: 0.75 }, { note: "C4", dur: 0.25 }, { note: "D4", dur: 1.0 }, { note: "C4", dur: 1.0 }, { note: "G4", dur: 1.0 }, { note: "F4", dur: 2.0 },
    { note: "C4", dur: 0.75 }, { note: "C4", dur: 0.25 }, { note: "C5", dur: 1.0 }, { note: "A4", dur: 1.0 }, { note: "F4", dur: 1.0 }, { note: "E4", dur: 1.0 }, { note: "D4", dur: 2.0 },
    { note: "Bb4", dur: 0.75 }, { note: "Bb4", dur: 0.25 }, { note: "A4", dur: 1.0 }, { note: "F4", dur: 1.0 }, { note: "G4", dur: 1.0 }, { note: "F4", dur: 2.5 }
];
const NOTE_FREQS = {
    "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00,
    "A4": 440.00, "Bb4": 466.16, "B4": 493.88, "C5": 523.25
};
// ==========================================================================
// State Management
// ==========================================================================
let isEnvelopeOpen = false;
let isMusicPlaying = false;
let candlesBlown = false;
let audioCtx = null;
let synthSequenceTimeout = null;
let currentMelodyIndex = 0;
// ==========================================================================
// DOM Elements
// ==========================================================================
const envelopeWrapper = document.getElementById("envelope-wrapper");
const waxSeal = document.getElementById("wax-seal");
const titleEl = document.getElementById("typewriter-title");
const textEl = document.getElementById("typewriter-text");
const signatureNameEl = document.getElementById("signature-name");
const musicBtn = document.getElementById("music-btn");
const musicIconPlay = document.getElementById("music-icon-play");
const musicIconMute = document.getElementById("music-icon-mute");
const cakeContainer = document.getElementById("cake-container");
const cakePrompt = document.getElementById("cake-prompt");
const candles = document.querySelectorAll(".candle");
// Set initial signature name
signatureNameEl.textContent = SIGNATURE_NAME;
// ==========================================================================
// Web Audio API Synthesizer (Chime Music Box)
// ==========================================================================
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}
function playTone(freq, duration) {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    // Chime Synth: Oscillator (Triangle) + Gain Envelope
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
     osc.type = "sine"; // Clean music box sound
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    // Cute retro marimba/musicbox vibe: Quick attack, medium decay, quiet release
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration - 0.05); // Decay/Sustain
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}
function playNextNote() {
    if (!isMusicPlaying) return;
    const item = MELODY[currentMelodyIndex];
    const freq = NOTE_FREQS[item.note];
    const beatDuration = 0.45; // Speed adjustment (BPM equivalent)
    const playDur = item.dur * beatDuration;
 osc.start();
    osc.stop(audioCtx.currentTime + duration);
}
function playNextNote() {
    if (!isMusicPlaying) return;
    const item = MELODY[currentMelodyIndex];
    const freq = NOTE_FREQS[item.note];
    const beatDuration = 0.45; // Speed adjustment (BPM equivalent)
    const playDur = item.dur * beatDuration;
    playTone(freq, playDur);
    // Schedule next note
    currentMelodyIndex = (currentMelodyIndex + 1) % MELODY.length;
    synthSequenceTimeout = setTimeout(playNextNote, playDur * 1000);
}
function startMusic() {
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    isMusicPlaying = true;
    musicIconPlay.classList.add("hidden");
    musicIconMute.classList.remove("hidden");
    playNextNote();
}
function stopMusic() {
    isMusicPlaying = false;
    musicIconPlay.classList.remove("hidden");
    musicIconMute.classList.add("hidden");
    if (synthSequenceTimeout) {
        clearTimeout(synthSequenceTimeout);
    }
}
function playWishChime() {
    initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    // High-pitched magical arpeggio (magical sweep)
    const baseTime = audioCtx.currentTime;
    const sweepNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    sweepNotes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        
        gainNode.gain.setValueAtTime(0, baseTime + index * 0.08);
        gainNode.gain.linearRampToValueAtTime(0.15, baseTime + index * 0.08 + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, baseTime + index * 0.08 + 0.4);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start(baseTime + index * 0.08);
        osc.stop(baseTime + index * 0.08 + 0.45);
    });
}
// Toggle Music Controls
musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (isMusicPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
});
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
const pastelColors = [
    "rgba(255, 182, 193, 0.6)", // Pastel pink
    "rgba(173, 216, 230, 0.6)", // Pastel blue
    "rgba(255, 222, 173, 0.6)", // Pastel orange
    "rgba(221, 160, 221, 0.6)", // Pastel plum
    "rgba(152, 251, 152, 0.6)", // Pastel green
    "rgba(255, 250, 205, 0.6)"  // Pastel lemon
];
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
// Particle Class
class Particle {
    constructor(isConfetti = false) {
        this.isConfetti = isConfetti;
        this.reset();
        if (isConfetti) {
            // Random scatter for blowout confetti
            this.x = canvas.width / 2 + (Math.random() - 0.5) * 100;
            this.y = canvas.height * 0.6 + (Math.random() - 0.5) * 50;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 4;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 3; // Upward initial force
            this.size = Math.random() * 6 + 4;
            this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)]; this.life = 1.0;
            this.decay = Math.random() * 0.015 + 0.008;
            this.gravity = 0.15;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
        }
    }
    reset() {
        if (!this.isConfetti) {
            // Standard ambient floating particles (slow balloons & stars)
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 8 + 4;
            this.vy = -(Math.random() * 0.6 + 0.2); // Slow rise
            this.vx = (Math.random() - 0.5) * 0.4;
            this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
            this.shape = Math.random() > 0.6 ? "star" : "circle";
            this.pulse = Math.random() * Math.PI;
        }
    }
    update() {
        if (this.isConfetti) {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.life -= this.decay;
        } else {
            this.y += this.vy;
            this.x += this.vx;
            this.pulse += 0.02;
             // Sway left & right gently
            this.x += Math.sin(this.pulse) * 0.2;
            // Reset when going off screen top
            if (this.y < -50) {
                this.reset();
            }
        }
    }
    draw() {
        ctx.save();
        if (this.isConfetti) {
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life;
            // Draw rectangle/square confetti
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            ctx.globalAlpha = 0.5 + Math.sin(this.pulse) * 0.2;
            ctx.fillStyle = this.color;
            if (this.shape === "circle") {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Draw a simple 4-point star for premium glow
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.size);
                ctx.lineTo(this.x + this.size * 0.3, this.y - this.size * 0.3);
                ctx.lineTo(this.x + this.size, this.y);
                ctx.lineTo(this.x + this.size * 0.3, this.y + this.size * 0.3);
                ctx.lineTo(this.x, this.y + this.size);
                ctx.lineTo(this.x - this.size * 0.3, this.y + this.size * 0.3);
                 ctx.lineTo(this.x - this.size, this.y);
                ctx.lineTo(this.x - this.size * 0.3, this.y - this.size * 0.3);
                ctx.closePath();
                ctx.fill();
            }
        }
        ctx.restore();
    }
}
// Generate ambient background particles
for (let i = 0; i < 40; i++) {
    particles.push(new Particle(false));
}
function triggerConfettiBlast() {
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(true));
    }
}
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        
        // Remove dead confetti
        if (p.isConfetti && p.life <= 0) {
            particles.splice(index, 1);
        }
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();
function runTypewriter(element, text, speed, callback) {
    let i = 0;
    element.textContent = "";
    
    function type() {
        if (i < text.length) {
            // Handle newlines
            if (text.charAt(i) === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text.charAt(i);
            }
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    }
    type();
}
function openEnvelope() {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;
    envelopeWrapper.classList.add("open");
    // Play music box automatically on opening
    startMusic();
    // Start typewriter effect after the letter slides up fully (~800ms transition)
    setTimeout(() => {
        runTypewriter(titleEl, TITLE_TEXT, 70, () => {
            // Once title is complete, type body text
            runTypewriter(textEl, BODY_TEXT, 25);
        });
    }, 900);
}
waxSeal.addEventListener("click", (e) => {
    e.stopPropagation();
    openEnvelope();
});
envelopeWrapper.addEventListener("click", () => {
    if (!isEnvelopeOpen) {
        openEnvelope();
    }
});
// Candle Blowing & Wish Action
cakeContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    if (candlesBlown) return;
    candlesBlown = true; // Extinguish candles
    candles.forEach(candle => {
        candle.classList.add("extinguished");
    });
    // Update prompt
    cakePrompt.textContent = "Semua harapan terbaikmu telah terkirim! 🌟✨";
    cakePrompt.style.color = "var(--seal-color)";
    cakePrompt.style.fontWeight = "600";
    // Play wish chime sound
    playWishChime();
    // Trigger confetti explosion
    triggerConfettiBlast();
});