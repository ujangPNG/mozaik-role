gsap.registerPlugin(TextPlugin);

// Variabel Penyimpan Waktu
let currentTimeStr = "";
let currentDayStr = "";
let currentDateStr = "";

// --- UPDATE JAM REGULER ---
function updateClock() {
    const now = new Date();

    // 1. Waktu
    let h = now.getHours();
    let m = now.getMinutes();
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    let newTimeStr = `- ${h}:${m} -`;

    // 2. Hari
    let newDayStr = now.toLocaleDateString('en-US', { weekday: 'long' });

    // 3. Tanggal
    const monthName = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    let dateNum = now.getDate();
    dateNum = dateNum < 10 ? "0" + dateNum : dateNum;
    const year = now.getFullYear().toString().substr(-2);
    let newDateStr = `${monthName} ${dateNum} ${year}`;

    // Update jika string berubah
    if (newTimeStr !== currentTimeStr) {
        currentTimeStr = newTimeStr;
        renderSplitText('line-time', currentTimeStr);
    }
    if (newDayStr !== currentDayStr) {
        currentDayStr = newDayStr;
        renderSplitText('line-day', currentDayStr);
    }
    if (newDateStr !== currentDateStr) {
        currentDateStr = newDateStr;
        renderSplitText('line-date', currentDateStr);
    }
}

/**
 * Merender teks ke dalam span per-huruf dengan lebar tetap.
 */
function renderSplitText(id, text) {
    const element = document.getElementById(id);
    element.innerHTML = '';
    
    const spans = [];
    
    text.split('').forEach(char => {
        const span = document.createElement('span');
        if (char === ' ') {
            span.innerHTML = '&nbsp;';
        } else {
            span.innerText = char;
        }
        span.className = 'hover-char';
        
        // Reset state jika ada
        span.dataset.hasPlayed = "false";

        // Tambahkan listener dengan state "hasPlayed"
        span.addEventListener('mouseenter', () => {
            // Hanya jalankan jika belum dimainkan dalam sesi hover ini
            if (span.dataset.hasPlayed === "true") return;

            if (char !== ' ' && char !== ':' && char !== '-') {
                span.dataset.hasPlayed = "true";
                rollSingleChar(span, char);
            }
        });

        // Reset state saat mouse keluar agar bisa dimainkan lagi nanti
        span.addEventListener('mouseleave', () => {
            span.dataset.hasPlayed = "false";
        });

        element.appendChild(span);
        spans.push(span);
    });

    requestAnimationFrame(() => {
        spans.forEach(span => {
            const width = span.getBoundingClientRect().width;
            span.style.width = `${width}px`;
        });
    });
}

/**
 * Animasi slot untuk satu huruf saja
 */
function rollSingleChar(span, targetChar) {
    if (span.classList.contains('is-rolling')) return;
    span.classList.add('is-rolling');

    const originalChar = targetChar;
    span.innerHTML = '';
    
    const wrapper = document.createElement('span');
    wrapper.className = 'slot-wrapper';
    
    const reel = document.createElement('span');
    reel.className = 'slot-reel';

    let pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (/[0-9]/.test(targetChar)) pool = "0123456789";
    else if (/[a-z]/.test(targetChar)) pool = "abcdefghijklmnopqrstuvwxyz";
    else if (/[A-Z]/.test(targetChar)) pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const length = 4; 
    let content = `<div class="slot-char">${targetChar}</div>`;
    for (let i = 0; i < length; i++) {
        const randChar = pool.charAt(Math.floor(Math.random() * pool.length));
        content += `<div class="slot-char">${randChar}</div>`;
    }
    
    reel.innerHTML = content;
    wrapper.appendChild(reel);
    span.appendChild(wrapper);

    gsap.fromTo(reel, 
        { y: -(length * 1.1) + "em" }, 
        { 
            y: "0em", 
            duration: 0.5, 
            ease: "power2.out",
            onComplete: () => {
                span.innerHTML = '';
                if (originalChar === ' ') span.innerHTML = '&nbsp;';
                else span.innerText = originalChar;
                
                span.classList.remove('is-rolling');
            }
        }
    );
}

// Jalankan jam
updateClock();
setInterval(updateClock, 1000);