/* ==========================================================================
   THE GROOM'S ADVENTURE - GAME ENGINE & APPLICATION LOGIC
   Mobile-First Vanilla JavaScript 2D Canvas Endless Runner & Wedding Invitation
   ========================================================================== */

// ==========================================
// 1. CONFIGURATION OBJECTS (EASY CUSTOMIZATION)
// ==========================================
const WEDDING_CONFIG = {
    groomName: "Muneeb",
    weddingDate: "OCTOBER 24, 2026",
    weddingVenue: "THE GRAND PALACE HALL",
    weddingTime: "5:00 PM",
    weddingLocation: "MAIN STREET, CITY CENTER",
    targetScore: 200 // Score required to reach the final wedding stage
};

const WEDDING_PHOTOS = [
    {
        image: "assets/photo1.jpg",
        title: "THE ARABIAN SHEIKH 👑",
        caption: "Royal desert vibes with his loyal lion! ✨",
        tag: "LEGENDARY"
    },
    {
        image: "assets/photo2.jpg",
        title: "THE ACTION HERO 😎",
        caption: "Power, silence, money, respect. Born to lead! 🔥",
        tag: "ATTITUDE"
    },
    {
        image: "assets/photo3.jpg",
        title: "THE DESERT JOURNEY 🐫",
        caption: "Good people, good journey, pure class! ❤️",
        tag: "THE VIBE"
    },
    {
        image: "assets/photo4.jpg",
        title: "KING OF THE HELIPAD 🚁",
        caption: "Discipline builds freedom. Better than yesterday! 👑",
        tag: "ROYALTY"
    },
    {
        image: "assets/photo5.jpg",
        title: "READY FOR THE BIG DAY 💍",
        caption: "The ultimate adventure is about to begin! 🎉",
        tag: "CHAMPION"
    }
];

// Funny crash reasons for Game Over modal
const FUNNY_CRASH_REASONS = [
    "Muneeb stopped to adjust his royal sunglasses! 😎",
    "Muneeb got distracted petting his lion! 🦁",
    "Muneeb paused to pose for the camera! 📸",
    "Muneeb stopped for a quick Karak Chai break! ☕",
    "Muneeb got distracted picking up a gift box! 🎁"
];


// ==========================================
// 2. AUDIO SYNTHESIZER & SFX SYSTEM
// ==========================================
class SoundManager {
    constructor() {
        this.audioCtx = null;
        this.isMuted = false;
        this.bgMusicPlaying = false;
        this.synthTimer = null;
    }

    init() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const icon = document.getElementById('audio-icon');
        const btn = document.getElementById('btn-toggle-audio');
        if (this.isMuted) {
            if (icon) icon.textContent = '🔇';
            if (btn) btn.style.opacity = '0.6';
            this.stopBgMusic();
        } else {
            if (icon) icon.textContent = '🔊';
            if (btn) btn.style.opacity = '1';
            this.playBgMusic();
        }
        return this.isMuted;
    }

    // Web Audio Synthesized Jump Effect
    playJump() {
        if (this.isMuted || !this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(450, this.audioCtx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.15);
        } catch (e) {}
    }

    // Web Audio Synthesized Heart Collect Effect
    playCollectHeart() {
        if (this.isMuted || !this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, this.audioCtx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, this.audioCtx.currentTime + 0.08); // E5
            gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.2);
        } catch (e) {}
    }

    // Web Audio Synthesized Ring Collect Effect (Sparkling chime)
    playCollectRing() {
        if (this.isMuted || !this.audioCtx) return;
        try {
            const now = this.audioCtx.currentTime;
            [659.25, 783.99, 1046.50].forEach((freq, idx) => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.06);
                gain.gain.setValueAtTime(0.25, now + idx * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now + idx * 0.06);
                osc.stop(now + idx * 0.06 + 0.18);
            });
        } catch (e) {}
    }

    // Web Audio Synthesized Crash Sound
    playCrash() {
        if (this.isMuted || !this.audioCtx) return;
        try {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(120, this.audioCtx.currentTime);
            osc.frequency.linearRampToValueAtTime(40, this.audioCtx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.4, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start();
            osc.stop(this.audioCtx.currentTime + 0.3);
        } catch (e) {}
    }

    // Web Audio Synthesized Victory Fanfare
    playVictory() {
        if (this.isMuted || !this.audioCtx) return;
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            const now = this.audioCtx.currentTime;
            notes.forEach((freq, idx) => {
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + idx * 0.15);
                gain.gain.setValueAtTime(0.3, now + idx * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.4);
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now + idx * 0.15);
                osc.stop(now + idx * 0.15 + 0.4);
            });
        } catch (e) {}
    }

    // Background Wedding Synth Melodic Loop
    playBgMusic() {
        if (this.isMuted || this.bgMusicPlaying || !this.audioCtx) return;
        this.bgMusicPlaying = true;
        let step = 0;
        const melodyNotes = [
            261.63, 329.63, 392.00, 523.25, // C E G C
            349.23, 440.00, 523.25, 698.46, // F A C F
            392.00, 493.88, 587.33, 783.99  // G B D G
        ];

        const playNoteStep = () => {
            if (!this.bgMusicPlaying || this.isMuted) return;
            try {
                const freq = melodyNotes[step % melodyNotes.length];
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
                gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);
                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start();
                osc.stop(this.audioCtx.currentTime + 0.4);
                step++;
            } catch (e) {}
            this.synthTimer = setTimeout(playNoteStep, 400);
        };
        playNoteStep();
    }

    stopBgMusic() {
        this.bgMusicPlaying = false;
        if (this.synthTimer) {
            clearTimeout(this.synthTimer);
            this.synthTimer = null;
        }
    }
}

const sounds = new SoundManager();


// ==========================================
// 3. UI NAVIGATION & MEMORY SYSTEM
// ==========================================
function setupUI() {
    // Populate dynamic text from WEDDING_CONFIG
    document.querySelectorAll('.groom-name-text').forEach(el => el.textContent = WEDDING_CONFIG.groomName);
    
    const targetScoreEl = document.getElementById('target-score');
    if (targetScoreEl) targetScoreEl.textContent = WEDDING_CONFIG.targetScore;

    const winDateEl = document.getElementById('win-date-display');
    if (winDateEl) winDateEl.textContent = WEDDING_CONFIG.weddingDate;

    // Initialize Story Timeline photos
    renderMemoryTimeline();

    // Spawn floating background ambient hearts
    createAmbientParticles();

    // Helper to safely bind click & touch events
    const bindBtn = (id, handler) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                handler(e);
            });
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handler(e);
            }, { passive: false });
        }
    };

    // Setup Button Listeners safely
    bindBtn('btn-toggle-audio', () => {
        sounds.init();
        sounds.toggleMute();
    });

    bindBtn('btn-enter-adventure', () => {
        sounds.init();
        sounds.playBgMusic();
        switchScreen('story-screen');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    bindBtn('btn-to-game-intro', () => {
        switchScreen('game-intro-screen');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    bindBtn('btn-start-game', () => {
        switchScreen('game-screen');
        startGame();
    });

    bindBtn('btn-retry', () => {
        hideModal('game-over-modal');
        startGame();
    });

    bindBtn('btn-back-memories', () => {
        hideModal('game-over-modal');
        switchScreen('story-screen');
    });

    bindBtn('btn-replay-game', () => {
        hideModal('win-modal');
        switchScreen('game-screen');
        startGame();
    });

    bindBtn('btn-win-back-memories', () => {
        hideModal('win-modal');
        switchScreen('story-screen');
    });

    bindBtn('btn-close-lightbox', () => {
        hideModal('photo-lightbox-modal');
    });
}

function switchScreen(screenId) {
    document.querySelectorAll('.page-section').forEach(sec => {
        sec.classList.remove('active');
        sec.classList.add('hidden');
    });
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('active');
    }
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

function openLightbox(photo) {
    document.getElementById('lightbox-img').src = photo.image;
    document.getElementById('lightbox-title').textContent = photo.title || "MUNEEB";
    document.getElementById('lightbox-caption').textContent = photo.caption || "";
    document.getElementById('lightbox-tag').textContent = photo.tag || "LEGENDARY";
    showModal('photo-lightbox-modal');
}

function renderMemoryTimeline() {
    const container = document.getElementById('memory-timeline');
    if (!container) return;
    container.innerHTML = '';

    WEDDING_PHOTOS.forEach((photo, idx) => {
        const card = document.createElement('div');
        card.className = 'memory-card 3d-tilt-card';
        card.innerHTML = `
            <div class="card-tag">${photo.tag || 'ROYAL'}</div>
            <div class="memory-image-holder">
                <img src="${photo.image}" alt="Memory ${idx+1}" loading="lazy">
            </div>
            <div class="card-content-box">
                <h3 class="card-title">${photo.title || 'THE LEGEND'}</h3>
                <p class="memory-caption">${photo.caption}</p>
            </div>
        `;

        // Click to open Lightbox Modal with full 3D view
        card.addEventListener('click', () => {
            openLightbox(photo);
        });

        container.appendChild(card);
    });

    // IntersectionObserver for 3D scroll-reveal animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.memory-card').forEach(card => observer.observe(card));
}

function createAmbientParticles() {
    const container = document.getElementById('ambient-particles');
    if (!container) return;
    container.innerHTML = '';
    const icons = ['❤️', '💍', '🌸', '✨'];

    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'floating-heart';
        p.textContent = icons[Math.floor(Math.random() * icons.length)];
        p.style.left = `${Math.random() * 100}%`;
        p.style.animationDuration = `${6 + Math.random() * 8}s`;
        p.style.animationDelay = `${Math.random() * 5}s`;
        p.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
        container.appendChild(p);
    }
}


// ==========================================
// 4. GAME ENGINE (HTML5 CANVAS 2D RUNNER)
// ==========================================
let canvas, ctx;
let animationFrameId = null;
let lastTime = 0;

let gameScore = 0;
let bestScore = localStorage.getItem('groom_best_score') || 0;
let gameSpeed = 6.0;
let isGameOver = false;
let isVictory = false;

// Entities
let player;
let obstacles = [];
let collectibles = [];
let particles = [];
let eventToastTimer = null;
let stageProgress = 0;

// Image sprite loading cache
const loadedImages = {};

function loadImage(src) {
    if (loadedImages[src]) return loadedImages[src];
    const img = new Image();
    img.src = src;
    loadedImages[src] = img;
    return img;
}

// Pre-load groom avatar
const groomImg = loadImage('assets/groom.jpg');

// ------------------------------------------
// PLAYER CLASS (GROOM)
// ------------------------------------------
class GroomPlayer {
    constructor(canvasWidth, canvasHeight) {
        this.width = 54;
        this.height = 70;
        this.x = 60;
        this.groundY = canvasHeight * 0.78 - this.height;
        this.y = this.groundY;
        this.vy = 0;
        this.gravity = 0.75;
        this.jumpForce = -15.5;
        this.isGrounded = true;
        this.jumpCount = 0;
        this.maxJumps = 2; // Allow double jump for mobile fun!
        this.animFrame = 0;
        this.runStep = 0;
    }

    jump() {
        if (this.jumpCount < this.maxJumps) {
            this.vy = this.jumpForce;
            this.isGrounded = false;
            this.jumpCount++;
            sounds.playJump();

            // Jump burst particles
            for (let i = 0; i < 6; i++) {
                particles.push(new Particle(
                    this.x + this.width / 2,
                    this.y + this.height,
                    (Math.random() - 0.5) * 4,
                    Math.random() * 2 + 1,
                    '#D4AF37',
                    4
                ));
            }
        }
    }

    update() {
        this.vy += this.gravity;
        this.y += this.vy;

        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.isGrounded = true;
            this.jumpCount = 0;
        }

        // Leg step cycle
        if (this.isGrounded) {
            this.runStep += gameSpeed * 0.08;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        // Draw Groom Avatar Image if loaded successfully, else render vector Groom in Tuxedo
        if (groomImg.complete && groomImg.naturalWidth > 0) {
            // Draw Groom photo in rounded frame with tuxedo body
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.width / 2, 24, 22, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(groomImg, 0, 0, this.width, 48);
            ctx.restore();

            // Gold Ring Frame around head
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(this.width / 2, 24, 22, 0, Math.PI * 2);
            ctx.stroke();

            // Body / Tuxedo (Dark Maroon & Gold Bowtie)
            ctx.fillStyle = '#380a17';
            ctx.fillRect(8, 42, 38, 28);
            ctx.fillStyle = '#D4AF37';
            ctx.fillRect(24, 44, 6, 8); // Bowtie

            // Animated Running Legs
            const legSwing = Math.sin(this.runStep) * 12;
            ctx.strokeStyle = '#1a0409';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(18, 68);
            ctx.lineTo(18 - legSwing, 68 + 14);
            ctx.moveTo(36, 68);
            ctx.lineTo(36 + legSwing, 68 + 14);
            ctx.stroke();
        } else {
            // Fallback Vector Groom in Tuxedo
            // Head
            ctx.fillStyle = '#F5CBA7';
            ctx.beginPath();
            ctx.arc(this.width / 2, 20, 18, 0, Math.PI * 2);
            ctx.fill();

            // Hair
            ctx.fillStyle = '#2C3E50';
            ctx.beginPath();
            ctx.arc(this.width / 2, 16, 18, Math.PI, Math.PI * 2);
            ctx.fill();

            // Tuxedo Body
            ctx.fillStyle = '#1A252F';
            ctx.fillRect(10, 36, 34, 26);

            // Red Bowtie
            ctx.fillStyle = '#FF4D6D';
            ctx.fillRect(23, 38, 8, 6);

            // Legs
            const legSwing = Math.sin(this.runStep) * 12;
            ctx.strokeStyle = '#1A252F';
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(18, 62);
            ctx.lineTo(18 - legSwing, 78);
            ctx.moveTo(36, 62);
            ctx.lineTo(36 + legSwing, 78);
            ctx.stroke();
        }

        // Heart trail particle behind player while running
        if (Math.random() < 0.3) {
            particles.push(new Particle(
                this.x - 5,
                this.y + 20 + Math.random() * 20,
                -gameSpeed * 0.3,
                (Math.random() - 0.5) * 1,
                '#E8A598',
                3
            ));
        }

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x + 8,
            y: this.y + 6,
            width: this.width - 16,
            height: this.height - 8
        };
    }
}


// ------------------------------------------
// OBSTACLE CLASS
// ------------------------------------------
class Obstacle {
    constructor(canvasWidth, canvasHeight) {
        this.type = Math.floor(Math.random() * 4);
        // 0: Gift Box, 1: Wedding Chair, 2: Flower Vase, 3: Luggage
        this.width = 44;
        this.height = 48;
        this.x = canvasWidth + 20;
        this.y = canvasHeight * 0.78 - this.height;
    }

    update() {
        this.x -= gameSpeed;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        if (this.type === 0) {
            // Gift Box 🎁
            ctx.fillStyle = '#8B263E';
            ctx.fillRect(0, 10, 44, 38);
            ctx.fillStyle = '#D4AF37';
            ctx.fillRect(18, 10, 8, 38); // Vertical Ribbon
            ctx.fillRect(0, 24, 44, 8); // Horizontal Ribbon
            ctx.fillStyle = '#FFDF00';
            ctx.beginPath(); // Bow
            ctx.arc(22, 8, 8, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 1) {
            // Wedding Chair 🪑
            ctx.fillStyle = '#D4AF37';
            ctx.fillRect(6, 0, 6, 48); // Backrest leg
            ctx.fillRect(32, 0, 6, 48);
            ctx.fillRect(6, 24, 32, 6); // Seat
            ctx.fillStyle = '#FFF';
            ctx.fillRect(8, 18, 28, 6); // Cushion
        } else if (this.type === 2) {
            // Flower Vase 💐
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(22, 34, 14, 0, Math.PI * 2);
            ctx.fill();
            // Flowers
            ctx.fillStyle = '#FF4D6D';
            ctx.beginPath();
            ctx.arc(14, 12, 10, 0, Math.PI * 2);
            ctx.arc(30, 12, 10, 0, Math.PI * 2);
            ctx.arc(22, 6, 10, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Luggage 🧳
            ctx.fillStyle = '#B8860B';
            ctx.fillRect(0, 12, 44, 36);
            ctx.fillStyle = '#1a0409';
            ctx.fillRect(8, 12, 4, 36);
            ctx.fillRect(32, 12, 4, 36);
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 3;
            ctx.strokeRect(16, 2, 12, 10); // Handle
        }

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x + 4,
            y: this.y + 4,
            width: this.width - 8,
            height: this.height - 4
        };
    }
}


// ------------------------------------------
// COLLECTIBLE CLASS (HEARTS & RINGS)
// ------------------------------------------
class Collectible {
    constructor(canvasWidth, canvasHeight) {
        this.type = Math.random() < 0.65 ? 'heart' : 'ring';
        this.width = 30;
        this.height = 30;
        this.x = canvasWidth + 20;
        // Float at jumpable height
        this.baseY = canvasHeight * 0.78 - 90 - Math.random() * 50;
        this.y = this.baseY;
        this.bobStep = Math.random() * Math.PI * 2;
        this.points = this.type === 'heart' ? 10 : 25;
    }

    update() {
        this.x -= gameSpeed;
        this.bobStep += 0.08;
        this.y = this.baseY + Math.sin(this.bobStep) * 8;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + 15, this.y + 15);

        if (this.type === 'heart') {
            // Heart ❤️
            ctx.fillStyle = '#FF4D6D';
            ctx.font = '22px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('❤️', 0, 0);
        } else {
            // Ring 💍
            ctx.fillStyle = '#FFDF00';
            ctx.font = '24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💍', 0, 0);
        }

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}


// ------------------------------------------
// PARTICLE SYSTEM
// ------------------------------------------
class Particle {
    constructor(x, y, vx, vy, color, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.alpha = 1.0;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.015;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}


// ==========================================
// 5. MAIN GAME LOOP & LOGIC
// ==========================================
function initCanvas() {
    canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Controls setup
    const handleJumpInput = (e) => {
        sounds.init();
        if (!isGameOver && !isVictory && player) {
            player.jump();
        }
    };

    // Mobile Touch & Pointer Jump
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleJumpInput(e);
    }, { passive: false });

    canvas.addEventListener('mousedown', (e) => {
        handleJumpInput(e);
    });

    const tapHint = document.getElementById('mobile-tap-hint');
    if (tapHint) {
        tapHint.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleJumpInput(e);
        }, { passive: false });
        tapHint.addEventListener('click', handleJumpInput);
    }

    const gameScreen = document.getElementById('game-screen');
    if (gameScreen) {
        gameScreen.addEventListener('touchstart', (e) => {
            if (!e.target.closest('#audio-control-bar') && !e.target.closest('#game-hud')) {
                handleJumpInput(e);
            }
        }, { passive: true });
    }

    // Desktop Keyboard Jump
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            handleJumpInput(e);
        }
    });
}

function resizeCanvas() {
    const container = document.getElementById('canvas-container');
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width > 0 ? rect.width : (container.clientWidth || 360);
    const height = rect.height > 0 ? rect.height : (container.clientHeight || 270);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    if (player) {
        player.groundY = height * 0.78 - player.height;
        if (player.isGrounded) player.y = player.groundY;
    }
}

function startGame() {
    if (!canvas) initCanvas();

    switchScreen('game-screen');

    // Force layout reflow before starting game loop
    setTimeout(() => {
        resizeCanvas();

        const container = document.getElementById('canvas-container');
        const rect = container.getBoundingClientRect();
        const width = rect.width || 360;
        const height = rect.height || 270;

        gameScore = 0;
        gameSpeed = 6.0;
        isGameOver = false;
        isVictory = false;
        obstacles = [];
        collectibles = [];
        particles = [];
        stageProgress = 0;

        player = new GroomPlayer(width, height);

        updateHUD();
        hideModal('game-over-modal');
        hideModal('win-modal');

        lastTime = performance.now();
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(gameLoop);
    }, 60);
}

function gameLoop(timestamp) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;

    const container = document.getElementById('canvas-container');
    const rect = container ? container.getBoundingClientRect() : { width: 0, height: 0 };
    const width = rect.width > 0 ? rect.width : 360;
    const height = rect.height > 0 ? rect.height : 270;

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Parallax Background
    drawEnvironment(ctx, width, height);

    if (!isGameOver && !isVictory) {
        // Increment Score & Speed
        gameScore += 0.15;
        gameSpeed = Math.min(11.0, 6.0 + Math.floor(gameScore / 30) * 0.5);
        updateHUD();

        // Check Event Banners
        checkEventBanners(Math.floor(gameScore));

        // Final Wedding Level Trigger
        if (gameScore >= WEDDING_CONFIG.targetScore) {
            triggerFinalWeddingLevel(width, height);
        }

        // 2. Spawn Obstacles
        if (obstacles.length === 0 || (obstacles[obstacles.length - 1].x < width - (220 + Math.random() * 150))) {
            if (gameScore < WEDDING_CONFIG.targetScore - 30) {
                obstacles.push(new Obstacle(width, height));
            }
        }

        // 3. Spawn Collectibles
        if (Math.random() < 0.02 && collectibles.length < 3) {
            if (gameScore < WEDDING_CONFIG.targetScore - 20) {
                collectibles.push(new Collectible(width, height));
            }
        }

        // Update & Filter Obstacles
        obstacles.forEach(obs => {
            obs.update();
            obs.draw(ctx);

            // Collision Detection
            if (checkAABBCollision(player.getBounds(), obs.getBounds())) {
                triggerGameOver();
            }
        });
        obstacles = obstacles.filter(obs => obs.x + obs.width > -50);

        // Update & Filter Collectibles
        collectibles.forEach(item => {
            item.update();
            item.draw(ctx);

            if (checkAABBCollision(player.getBounds(), item.getBounds())) {
                gameScore += item.points;
                if (item.type === 'heart') sounds.playCollectHeart();
                else sounds.playCollectRing();

                // Sparkle Particles
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(
                        item.x + 15,
                        item.y + 15,
                        (Math.random() - 0.5) * 6,
                        (Math.random() - 0.5) * 6,
                        item.type === 'heart' ? '#FF4D6D' : '#FFDF00',
                        4
                    ));
                }
                item.collected = true;
            }
        });
        collectibles = collectibles.filter(item => !item.collected && item.x + item.width > -50);

        // Update Player
        player.update();
    } else if (isVictory) {
        // Final Wedding Stage Animation
        drawWeddingStage(ctx, width, height);
    }

    // Draw Player
    player.draw(ctx);

    // Update Particles
    particles.forEach(p => {
        p.update();
        p.draw(ctx);
    });
    particles = particles.filter(p => p.alpha > 0);

    animationFrameId = requestAnimationFrame(gameLoop);
}


// ------------------------------------------
// PARALLAX ENVIRONMENT & SCENERY
// ------------------------------------------
let skyScroll = 0;
let bgScroll = 0;

function drawEnvironment(ctx, width, height) {
    skyScroll += 0.2;
    bgScroll += gameSpeed * 0.4;

    // 1. Sunset Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#1c050a');
    skyGrad.addColorStop(0.5, '#58111A');
    skyGrad.addColorStop(0.8, '#E8A598');
    skyGrad.addColorStop(1, '#F7E7CE');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Setting Sun
    ctx.fillStyle = 'rgba(255, 223, 0, 0.4)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.35, 45, 0, Math.PI * 2);
    ctx.fill();

    // 2. Moving Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    [0.1, 0.45, 0.75].forEach((posRatio, i) => {
        const cx = (width * posRatio - skyScroll * (i + 1) * 0.5) % (width + 100);
        const actualX = cx < -50 ? cx + width + 100 : cx;
        ctx.beginPath();
        ctx.arc(actualX, height * 0.2, 28, 0, Math.PI * 2);
        ctx.arc(actualX + 22, height * 0.18, 36, 0, Math.PI * 2);
        ctx.arc(actualX + 44, height * 0.2, 28, 0, Math.PI * 2);
        ctx.fill();
    });

    // 3. Distant Romantic Hills & Wedding Venue Silhouette
    ctx.fillStyle = '#2d0a15';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.78);
    for (let x = 0; x <= width; x += 20) {
        const hillY = height * 0.58 + Math.sin((x + bgScroll * 0.2) * 0.01) * 20;
        ctx.lineTo(x, hillY);
    }
    ctx.lineTo(width, height * 0.78);
    ctx.closePath();
    ctx.fill();

    // 4. Hanging Wedding Lights Garland at Top
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    for (let x = 0; x <= width; x += 40) {
        ctx.quadraticCurveTo(x + 20, 35, x + 40, 15);
    }
    ctx.stroke();

    // Glow Bulbs
    for (let x = 20; x < width; x += 40) {
        ctx.fillStyle = '#FFDF00';
        ctx.beginPath();
        ctx.arc(x, 26, 3.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // 5. Road / Floral Path Foreground
    const pathY = height * 0.78;
    ctx.fillStyle = '#170408';
    ctx.fillRect(0, pathY, width, height - pathY);

    // Gold Trim Border Line
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, pathY);
    ctx.lineTo(width, pathY);
    ctx.stroke();

    // Moving Cobblestone Dashes
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.lineDashOffset = -bgScroll;
    ctx.beginPath();
    ctx.moveTo(0, pathY + 14);
    ctx.lineTo(width, pathY + 14);
    ctx.stroke();
    ctx.setLineDash([]); // Reset
}


// ------------------------------------------
// FINAL WEDDING STAGE & VICTORY
// ------------------------------------------
let stageX = 9999;

function triggerFinalWeddingLevel(width, height) {
    if (!isVictory) {
        isVictory = true;
        sounds.playVictory();
        stageX = width + 20;
        showToast('🎉 MUNEEB MADE IT TO THE WEDDING STAGE! 👑');
    }
}

function drawWeddingStage(ctx, width, height) {
    stageX = Math.max(width * 0.45, stageX - gameSpeed * 0.6);
    gameSpeed = Math.max(0, gameSpeed - 0.1);

    const pathY = height * 0.78;

    // Draw Grand Royal Wedding Stage / Arch
    ctx.save();
    ctx.translate(stageX, pathY - 120);

    // Red Carpet
    ctx.fillStyle = '#8B263E';
    ctx.fillRect(-60, 114, 240, 10);
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(-60, 114, 240, 2);

    // Gold Pillars
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(0, 0, 16, 120);
    ctx.fillRect(110, 0, 16, 120);

    // Arch Roof
    ctx.fillStyle = '#8B263E';
    ctx.beginPath();
    ctx.arc(63, 0, 68, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Royal Crown 👑 on Stage Center
    ctx.fillStyle = '#FFDF00';
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👑', 63, 60);

    // Gold Trophy 🏆
    ctx.font = '28px sans-serif';
    ctx.fillText('🏆', 63, 98);

    ctx.restore();

    // When groom reaches stage center, trigger victory celebration modal
    if (player.x >= stageX - 15) {
        player.x = stageX - 15;

        // Fireworks & Confetti Burst!
        for (let i = 0; i < 6; i++) {
            particles.push(new Particle(
                stageX + 63,
                pathY - 80,
                (Math.random() - 0.5) * 14,
                (Math.random() - 0.5) * 14,
                ['#FFDF00', '#FF4D6D', '#E8A598', '#D4AF37', '#FFF'][Math.floor(Math.random() * 5)],
                6
            ));
        }

        setTimeout(() => {
            showModal('win-modal');
        }, 1200);
    }
}


// ------------------------------------------
// COLLISION & HUD HELPERS
// ------------------------------------------
function checkAABBCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function updateHUD() {
    const currentVal = Math.floor(gameScore);
    document.getElementById('current-score').textContent = currentVal;

    if (currentVal > bestScore) {
        bestScore = currentVal;
        localStorage.setItem('groom_best_score', bestScore);
    }
    document.getElementById('best-score').textContent = bestScore;
}

function checkEventBanners(score) {
    if (score === 40) showToast("WAIT... THE WEDDING VENUE IS GETTING CLOSER! 😳");
    else if (score === 90) showToast("RUN FASTER MUNEEB! 🏃‍♂️💨");
    else if (score === 140) showToast("ALMOST AT THE STAGE! DON'T GET DISTRACTED! 👑");
}

function showToast(text) {
    const toast = document.getElementById('game-toast');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = text;
    toast.classList.remove('hidden');

    if (eventToastTimer) clearTimeout(eventToastTimer);
    eventToastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3500);
}

function triggerGameOver() {
    isGameOver = true;
    sounds.playCrash();

    const finalVal = Math.floor(gameScore);
    document.getElementById('final-score-val').textContent = finalVal;

    // Pick random funny reason
    const reason = FUNNY_CRASH_REASONS[Math.floor(Math.random() * FUNNY_CRASH_REASONS.length)];
    document.getElementById('funny-reason').textContent = reason;

    showModal('game-over-modal');
}


// ==========================================
// 6. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    setupUI();
    initCanvas();
});
