/* JavaScript Engine for Sheraz Somroo 25th Birthday Project */

document.addEventListener('DOMContentLoaded', () => {
    initFloatingEmojisEngine();
    initIntroBlast();
    initCountdown();
    initPartyBalloons();
    initContinuousMusic();
    initGyroSensorWorld();
    initParticleCanvas();
});

/* -------------------------------------------------------------
 * 1. CONTINUOUS FLOATING BACKGROUND EMOJIS ENGINE (CLICK TO POP)
 * ------------------------------------------------------------- */
function initFloatingEmojisEngine() {
    const container = document.getElementById('floating-emojis-container');
    if (!container) return;

    const emojiSymbols = ['🎈', '👑', '🎂', '✨', '🎉', '🎁', '💎', '⭐', '🥳'];
    const emojiCount = 14;
    const emojiItems = [];

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    for (let i = 0; i < emojiCount; i++) {
        const symbol = emojiSymbols[i % emojiSymbols.length];
        const el = document.createElement('div');
        el.className = 'floating-emoji pointer-events-auto';
        el.textContent = symbol;
        container.appendChild(el);

        const item = {
            el: el,
            symbol: symbol,
            x: Math.random() * (viewportWidth - 60),
            y: Math.random() * viewportHeight,
            speed: Math.random() * 1.2 + 0.8,
            angle: Math.random() * Math.PI * 2,
            swaySpeed: Math.random() * 0.02 + 0.01,
            swayWidth: Math.random() * 20 + 10,
            isDragging: false,
            isPopping: false,
            startX: 0,
            startY: 0,
            dragStartTime: 0
        };

        const onStart = (e) => {
            if (item.isPopping) return;

            item.isDragging = true;
            item.dragStartTime = Date.now();
            el.classList.add('is-dragging');

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            item.startX = clientX - item.x;
            item.startY = clientY - item.y;
        };

        const onMove = (e) => {
            if (!item.isDragging || item.isPopping) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            item.x = clientX - item.startX;
            item.y = clientY - item.startY;
        };

        const onEnd = (e) => {
            if (!item.isDragging) return;
            item.isDragging = false;
            el.classList.remove('is-dragging');

            const dragDuration = Date.now() - item.dragStartTime;

            if (dragDuration < 250 && !item.isPopping) {
                popBalloon(item);
            } else {
                playPopSound();
            }
        };

        el.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        el.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onEnd);

        emojiItems.push(item);
    }

    function popBalloon(item) {
        item.isPopping = true;
        item.el.classList.add('is-popping');

        playBalloonPopSound();
        triggerConfettiBurst(item.x / window.innerWidth, item.y / window.innerHeight);

        setTimeout(() => {
            item.y = window.innerHeight + 40;
            item.x = Math.random() * (window.innerWidth - 60);
            item.speed = Math.random() * 1.2 + 0.8;
            item.symbol = emojiSymbols[Math.floor(Math.random() * emojiSymbols.length)];
            item.el.textContent = item.symbol;
            item.el.classList.remove('is-popping');
            item.isPopping = false;
        }, 280);
    }

    function animateFloatingEmojis() {
        const curHeight = window.innerHeight;
        const curWidth = window.innerWidth;

        emojiItems.forEach(item => {
            if (!item.isDragging && !item.isPopping) {
                item.y -= item.speed;
                item.angle += item.swaySpeed;

                const swayX = Math.sin(item.angle) * item.swayWidth;
                const currentX = item.x + swayX;

                if (item.y < -80) {
                    item.y = curHeight + 40;
                    item.x = Math.random() * (curWidth - 60);
                    item.speed = Math.random() * 1.2 + 0.8;
                }

                item.el.style.transform = `translate3d(${currentX}px, ${item.y}px, 0) rotate(${Math.sin(item.angle) * 12}deg)`;
            } else if (item.isDragging && !item.isPopping) {
                item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) scale(1.3)`;
            }
        });

        requestAnimationFrame(animateFloatingEmojis);
    }

    animateFloatingEmojis();
}

/* -------------------------------------------------------------
 * 2. 25 POPPING BALLOONS & WISHES FEED ENGINE
 * ------------------------------------------------------------- */
const birthdayWishesList = [
    { title: "👑 25th Quarter Century King", wish: "Celebrating 25 years of standing tall, achieving milestones & inspiring everyone around!" },
    { title: "🏆 Legend of the Year", wish: "A true champion whose determination turns every challenge into a grand victory!" },
    { title: "🚀 Future Unstoppable", wish: "Age 25 is just the launchpad for your greatest achievements yet!" },
    { title: "⭐ Vibe Master", wish: "Bringing high energy, genuine smiles, and positive vibes wherever you step foot!" },
    { title: "🔥 Peak Energy Legend", wish: "Full of life, power, and passion — Happy 25th Birthday Sheraz bhai!" },
    { title: "💎 Pure Gold Heart", wish: "A genuine, kind, and warm-hearted brother loved and respected by all!" },
    { title: "🎯 Visionary Mind", wish: "Focusing on big goals and turning dreams into reality step by step." },
    { title: "🤝 Loyal Brother", wish: "A true friend who stands firm through thick & thin with unconditional loyalty." },
    { title: "🤲 Duas & Blessings", wish: "May Allah grant Sheraz long healthy life, peak success, peace & endless happiness!" },
    { title: "🎉 Party Demand Activated", wish: "Treat demand activated! Sheraz bhai, party to banti hai!" },
    { title: "👑 King of Good Vibes", wish: "Always filling the room with laughter, brotherhood, and unforgettable memories." },
    { title: "🌟 Rising Star", wish: "Shining brighter with every passing year — sky is the limit!" },
    { title: "💼 Future Tycoon", wish: "Here's to big business victories, growth, and prosperous success stories!" },
    { title: "💪 Unshakeable Strength", wish: "Resilient, strong, and always moving forward with zero fear!" },
    { title: "🎁 Silver Jubilee Honor", wish: "8th August • A historic day celebrating 25 golden years of Sheraz Somroo!" },
    { title: "🎈 Joy & Happiness", wish: "May your 25th year be filled with endless smiles and pure joy!" },
    { title: "🔥 Power & Passion", wish: "Chasing goals with 100% dedication, passion, and unstoppable focus!" },
    { title: "🏆 Brotherhood Gold", wish: "The absolute best brother anyone could ask for — stay blessed always!" },
    { title: "✨ Sparkle of Good Luck", wish: "May good luck, wealth, and prosperity follow you everywhere you go!" },
    { title: "🚀 Next-Level Success", wish: "Level 25 unlocked — Game on for bigger wins and bigger dreams!" },
    { title: "👑 Royal Respect", wish: "Earning love, honor, and respect wherever you set foot!" },
    { title: "🎉 Celebration Vibe", wish: "Turn up the music, fire the confetti — today is Sheraz's big day!" },
    { title: "🤲 Peace & Health", wish: "Praying for your continuous health, safety, and inner peace always!" },
    { title: "💎 Unforgettable Memories", wish: "May 2026 bring your most cherished memories and victory moments!" },
    { title: "🎂 Grand 25th Birthday Wish", wish: "Happy 25th Birthday Sheraz Somroo! Here's to a lifetime of greatness!" }
];

let poppedBalloonsCount = 0;

function initPartyBalloons() {
    const container = document.getElementById('candles-container');
    const feed = document.getElementById('unlocked-wishes-feed');
    if (!container) return;

    container.innerHTML = '';
    if (feed) feed.innerHTML = '';
    poppedBalloonsCount = 0;

    const balloonEmojis = ['🎈', '👑', '🎂', '✨', '🎉', '🎁', '💎', '⭐', '🔥'];

    for (let i = 1; i <= 25; i++) {
        const balloonUnit = document.createElement('div');
        balloonUnit.className = 'party-balloon-unit text-2xl sm:text-3xl flex flex-col items-center justify-center p-1';
        balloonUnit.id = `balloon-${i}`;
        balloonUnit.title = `Pop Balloon #${i} for Birthday Wish!`;

        const emoji = balloonEmojis[(i - 1) % balloonEmojis.length];

        balloonUnit.innerHTML = `
            <span class="balloon-icon">${emoji}</span>
            <span class="text-[10px] font-outfit text-amber-300 font-bold mt-0.5">#${i}</span>
        `;

        balloonUnit.addEventListener('click', () => popPartyBalloon(i));
        container.appendChild(balloonUnit);
    }

    updateBalloonStatus();

    const blowBtn = document.getElementById('btn-blow-candles');
    const relightBtn = document.getElementById('btn-relight-candles');

    if (blowBtn) blowBtn.addEventListener('click', popAllPartyBalloons);
    if (relightBtn) relightBtn.addEventListener('click', resetPartyBalloons);
}

function popPartyBalloon(index) {
    const balloonUnit = document.getElementById(`balloon-${index}`);
    if (balloonUnit && !balloonUnit.classList.contains('popped-balloon')) {
        balloonUnit.classList.add('popped-balloon');

        poppedBalloonsCount++;
        playBalloonPopSound();
        triggerConfettiCannon();

        // Unlock Wish Card
        const wishData = birthdayWishesList[(index - 1) % birthdayWishesList.length];
        appendWishToFeed(index, wishData);

        updateBalloonStatus();

        if (poppedBalloonsCount === 25) {
            playFanfareSound();
            triggerConfettiCannon();
        }
    }
}

function popAllPartyBalloons() {
    for (let i = 1; i <= 25; i++) {
        setTimeout(() => popPartyBalloon(i), i * 50);
    }
}

function resetPartyBalloons() {
    for (let i = 1; i <= 25; i++) {
        const unit = document.getElementById(`balloon-${i}`);
        if (unit) unit.classList.remove('popped-balloon');
    }
    const feed = document.getElementById('unlocked-wishes-feed');
    if (feed) feed.innerHTML = '';

    poppedBalloonsCount = 0;
    updateBalloonStatus();
}

function updateBalloonStatus() {
    const status = document.getElementById('candles-status');
    if (!status) return;

    if (poppedBalloonsCount === 0) {
        status.textContent = '25 Celebration Balloons Lit 🎈 (Tap to Pop!)';
    } else if (poppedBalloonsCount < 25) {
        status.textContent = `🎉 ${poppedBalloonsCount} / 25 Balloons Popped • Keep Popping!`;
    } else {
        status.textContent = '👑 All 25 Birthday Balloons Popped! Legend Unlocked! ✨';
    }
}

function appendWishToFeed(index, data) {
    const feed = document.getElementById('unlocked-wishes-feed');
    if (!feed) return;

    const card = document.createElement('div');
    card.className = 'bg-slate-950/90 border border-amber-400/40 rounded-2xl p-4 shadow-xl text-left space-y-1 transform transition-all duration-500 scale-95 opacity-0';
    
    card.innerHTML = `
        <div class="flex items-center justify-between">
            <h5 class="font-cinzel text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-1.5">
                <span>Wish #${index}</span>
                <span>•</span>
                <span>${data.title}</span>
            </h5>
            <span class="text-[10px] bg-amber-400/20 text-amber-300 font-outfit px-2 py-0.5 rounded-full">Unlocked 🔓</span>
        </div>
        <p class="font-dancing-script text-slate-200 text-base font-bold leading-relaxed pt-1">
            "${data.wish}"
        </p>
    `;

    feed.prepend(card);
    setTimeout(() => {
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    }, 50);
}

/* -------------------------------------------------------------
 * 3. 3D GYROSCOPE PANORAMIC SENSOR WORLD
 * ------------------------------------------------------------- */
function initGyroSensorWorld() {
    const stage = document.getElementById('gyro-stage');
    const world = document.getElementById('gyro-world');

    if (!stage || !world) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    let isMouseDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialRotX = 0;
    let initialRotY = 0;

    function updateGyroWorld() {
        currentRotX += (targetRotX - currentRotX) * 0.08;
        currentRotY += (targetRotY - currentRotY) * 0.08;

        world.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
        requestAnimationFrame(updateGyroWorld);
    }
    updateGyroWorld();

    stage.addEventListener('mousemove', (e) => {
        if (isMouseDragging) return;
        const rect = stage.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        targetRotY = deltaX * 36;
        targetRotX = -deltaY * 30;
    });

    stage.addEventListener('mouseleave', () => {
        if (!isMouseDragging) {
            targetRotX = 0;
            targetRotY = 0;
        }
    });

    stage.addEventListener('mousedown', (e) => {
        isMouseDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initialRotX = targetRotX;
        initialRotY = targetRotY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isMouseDragging) return;
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        targetRotY = initialRotY + deltaX * 0.3;
        targetRotX = initialRotX - deltaY * 0.3;
    });

    window.addEventListener('mouseup', () => {
        isMouseDragging = false;
    });

    window.addEventListener('deviceorientation', (e) => {
        if (e.beta !== null && e.gamma !== null) {
            const gammaRot = Math.min(50, Math.max(-50, e.gamma));
            const betaRot = Math.min(45, Math.max(-45, e.beta - 45));

            targetRotY = gammaRot * 1.1;
            targetRotX = -betaRot * 1.1;
        }
    }, true);
}

/* -------------------------------------------------------------
 * 4. CINEMATIC 24 BLAST -> 25 SMOOTH REVEAL & AUTOMATIC TRANSITION
 * ------------------------------------------------------------- */
function initIntroBlast() {
    const stage24 = document.getElementById('stage-24');
    const stage25 = document.getElementById('stage-25');
    const splash = document.getElementById('intro-splash');

    if (!stage24 || !stage25 || !splash) return;

    stage24.classList.add('blast-shake');

    setTimeout(() => {
        stage24.classList.remove('blast-shake');
        stage24.classList.add('opacity-0', 'scale-50');

        triggerConfettiCannon();
        playFanfareSound();
        startBackgroundMusic();

        setTimeout(() => {
            stage24.classList.add('hidden');
            stage25.classList.remove('hidden');

            setTimeout(() => {
                stage25.classList.add('reveal-25');
                triggerConfettiCannon();
            }, 50);
        }, 400);

        setTimeout(() => {
            stage25.classList.add('exit-25');

            setTimeout(() => {
                splash.classList.add('dissolve-splash');
                setTimeout(() => splash.remove(), 1200);
            }, 500);

        }, 3600);

    }, 1800);
}

/* -------------------------------------------------------------
 * 5. COUNTDOWN TIMER (Target: 8th August)
 * ------------------------------------------------------------- */
function initCountdown() {
    const now = new Date();
    let currentYear = now.getFullYear();
    let targetDate = new Date(`August 8, ${currentYear} 00:00:00`);

    function updateTimer() {
        const currentTime = new Date().getTime();
        const diff = targetDate.getTime() - currentTime;

        const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

        const dEl = document.getElementById('days');
        const hEl = document.getElementById('hours');
        const mEl = document.getElementById('minutes');
        const sEl = document.getElementById('seconds');

        if (dEl) dEl.textContent = String(days).padStart(2, '0');
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
        if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* -------------------------------------------------------------
 * 6. CONTINUOUS AUTOMATIC MUSIC PLAYER
 * ------------------------------------------------------------- */
let audioCtx = null;
let isMusicLoopRunning = false;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function initContinuousMusic() {
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
        document.addEventListener(evt, () => {
            startBackgroundMusic();
        }, { once: false });
    });
}

const notes = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33
};

const happyBirthdayMelody = [
    { note: 'C4', duration: 0.3 }, { note: 'C4', duration: 0.3 },
    { note: 'D4', duration: 0.6 }, { note: 'C4', duration: 0.6 },
    { note: 'F4', duration: 0.6 }, { note: 'E4', duration: 1.0 },

    { note: 'C4', duration: 0.3 }, { note: 'C4', duration: 0.3 },
    { note: 'D4', duration: 0.6 }, { note: 'C4', duration: 0.6 },
    { note: 'G4', duration: 0.6 }, { note: 'F4', duration: 1.0 },

    { note: 'C4', duration: 0.3 }, { note: 'C4', duration: 0.3 },
    { note: 'C5', duration: 0.6 }, { note: 'A4', duration: 0.6 },
    { note: 'F4', duration: 0.6 }, { note: 'E4', duration: 0.6 }, { note: 'D4', duration: 1.0 },

    { note: 'A4', duration: 0.3 }, { note: 'A4', duration: 0.3 },
    { note: 'F4', duration: 0.6 }, { note: 'G4', duration: 0.6 },
    { note: 'F4', duration: 1.2 }
];

function playNote(freq, duration) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

function startBackgroundMusic() {
    if (isMusicLoopRunning) return;
    isMusicLoopRunning = true;

    let noteIdx = 0;
    function loopMelody() {
        const current = happyBirthdayMelody[noteIdx];
        if (notes[current.note]) {
            playNote(notes[current.note], current.duration);
        }
        noteIdx = (noteIdx + 1) % happyBirthdayMelody.length;
        setTimeout(loopMelody, 480);
    }

    loopMelody();
}

function playPopSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
}

function playBalloonPopSound() {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
}

function playFanfareSound() {
    try {
        const ctx = getAudioContext();
        [261.63, 329.63, 392.00, 523.25].forEach((freq, idx) => {
            setTimeout(() => playNote(freq, 0.4), idx * 100);
        });
    } catch (e) {}
}

/* -------------------------------------------------------------
 * 7. CONFETTI FX
 * ------------------------------------------------------------- */
function triggerConfettiCannon() {
    if (typeof confetti !== 'function') return;

    confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.2 },
        colors: ['#f59e0b', '#fbbf24', '#eab308', '#a855f7', '#ec4899']
    });

    confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.8 },
        colors: ['#f59e0b', '#fbbf24', '#eab308', '#3b82f6', '#10b981']
    });
}

function triggerConfettiBurst(x, y) {
    if (typeof confetti !== 'function') return;
    confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: x, y: y },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#ec4899']
    });
}

/* -------------------------------------------------------------
 * 8. PARTICLE BACKGROUND CANVAS
 * ------------------------------------------------------------- */
function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? 'rgba(245, 158, 11, ' : 'rgba(234, 179, 8, ',
            alpha: Math.random() * 0.4 + 0.1,
            speedY: -Math.random() * 0.5 - 0.2,
            speedX: (Math.random() - 0.5) * 0.3
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;

            if (p.y < -10) {
                p.y = height + 10;
                p.x = Math.random() * width;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}
