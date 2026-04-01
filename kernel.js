const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const clock = document.getElementById('clock');
const wrapper = document.getElementById('terminal-wrapper');

setInterval(() => { clock.innerText = new Date().toLocaleTimeString("ja-JP"); }, 1000);

const AETHER = {
    history: [],
    historyIndex: -1,

    registry: {
        // --- 1. THE REAL EXEC ---
        "exec": async (code) => {
            if (!code) return "<span class='accent-text'>ERR: CODE_REQUIRED</span>";
            try { 
                const result = await eval(`(async () => { return ${code} })()`); 
                return typeof result === 'object' ? `<span class='success-text'>${JSON.stringify(result)}</span>` : `<span class='success-text'>${String(result)}</span>`;
            } catch (e) { return `<span class='accent-text'>[!] EXEC_ERR: ${e.message}</span>`; }
        },

        // --- 2. DOM DESTRUCTION ---
        "edit_web": () => { document.designMode = "on"; return "<span class='success-text'>[+] DOM UNLOCKED: Type anywhere on this webpage.</span>"; },
        "lock_web": () => { document.designMode = "off"; return "<span class='accent-text'>[-] DOM LOCKED.</span>"; },
        "barrel_roll": () => { wrapper.style.transition = "transform 2s"; wrapper.style.transform = "rotate(360deg)"; setTimeout(()=>wrapper.style.transform="", 2000); return "DOING A BARREL ROLL."; },
        "earthquake": () => { let i=0; const iv = setInterval(()=>{ wrapper.style.transform = `translate(${Math.random()*20-10}px, ${Math.random()*20-10}px)`; i++; if(i>20){clearInterval(iv); wrapper.style.transform="";}}, 50); return "<span class='accent-text'>SEISMIC ANOMALY DETECTED.</span>"; },
        "invert": () => { document.body.style.filter = document.body.style.filter === "invert(1)" ? "" : "invert(1)"; return "POLARITY_TOGGLED."; },
        "disco": () => { window.discoIv = setInterval(()=> document.body.style.filter = `hue-rotate(${Math.random()*360}deg)`, 100); return "RAVE PROTOCOL ACTIVE. Use 'stop_disco'."; },
        "stop_disco": () => { clearInterval(window.discoIv); document.body.style.filter = ""; return "RAVE_HALTED."; },
        "hide_cursor": () => { document.body.style.cursor = "none"; return "STEALTH_CURSOR_ACTIVE."; },
        "show_cursor": () => { document.body.style.cursor = "default"; return "CURSOR_RESTORED."; },

        // --- 3. HARDWARE & OS CONTROL ---
        "battery": async () => { try { const b = await navigator.getBattery(); return `BATTERY: ${b.level*100}% | CHARGING: ${b.charging}`; } catch(e) { return "<span class='accent-text'>HARDWARE_LOCKED</span>"; } },
        "vibrate": () => { navigator.vibrate([200, 100, 200, 100, 500]); return "HAPTIC_MOTORS_ENGAGED."; },
        "voice": (msg) => { const u = new SpeechSynthesisUtterance(msg || "Super star override protocol accepted."); window.speechSynthesis.speak(u); return "TTS_ONLINE."; },
        "cores": () => `CPU_LOGICAL_CORES: ${navigator.hardwareConcurrency || 'UNKNOWN'}`,
        "memory": () => `RAM_HEAP_LIMIT: ${performance.memory ? performance.memory.jsHeapSizeLimit / 1048576 + ' MB' : 'DENIED'}`,
        "platform": () => `OS_USER_AGENT: ${navigator.userAgent}`,

        // --- 4. LIVE DATA HEISTS ---
        "iss_loc": async () => { const r = await fetch("http://api.open-notify.org/iss-now.json"); const d = await r.json(); return `🛰️ ISS_COORDS: LAT ${d.iss_position.latitude}, LON ${d.iss_position.longitude}`; },
        "crypto_btc": async () => { const r = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json"); const d = await r.json(); return `🪙 BTC_LIVE: $${d.bpi.USD.rate}`; },
        "anime_quote": async () => { const r = await fetch("https://animechan.xyz/api/random"); const d = await r.json(); return `🗡️ ${d.character} (${d.anime}): "${d.quote}"`; },
        "arise": () => { 
            document.body.style.background = "#050014"; 
            wrapper.style.borderColor = "#7b00ff";
            wrapper.style.boxShadow = "0 20px 50px rgba(0,0,0,0.9), inset 0 0 25px rgba(123, 0, 255, 0.3)";
            document.documentElement.style.setProperty('--cyan', '#b45cff');
            return "<span style='color:#b45cff; font-weight:bold; text-shadow: 0 0 8px #b45cff'>SHADOW_ARMY_AWAKENED. ARISE.</span>"; 
        },
        "pokemon": async (name) => { try { const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${name||'rayquaza'}`); const d = await r.json(); return `🐉 EVO_DATA: ${d.name.toUpperCase()} | TYPE: ${d.types[0].type.name} | HP: ${d.stats[0].base_stat}`; } catch(e){ return "<span class='accent-text'>ENTITY_NOT_FOUND</span>"; } },
        "joke": async () => { const r = await fetch("https://official-joke-api.appspot.com/random_joke"); const d = await r.json(); return `🤡 ${d.setup} ... ${d.punchline}`; },
        "fake_user": async () => { const r = await fetch("https://randomuser.me/api/"); const d = await r.json(); const u = d.results[0]; return `👤 IDENTITY_FORGED: ${u.name.first} ${u.name.last} | LOC: ${u.location.city}, ${u.location.country}`; },

        // --- 5. NETWORK & TRACKING ---
        "locate_ip": async (ip) => {
            if (!ip) return "<span class='accent-text'>ERR: TARGET_IP_REQUIRED</span>";
            try {
                const res = await fetch(`https://ipapi.co/${ip}/json/`);
                const data = await res.json();
                if (data.error) return `<span class='accent-text'>[!] TRACE_FAILED: ${data.reason}</span>`;
                return `<span class='success-text'>[+] TARGET ACQUIRED</span><br>IP: ${data.ip}<br>CITY: ${data.city}<br>ORG: ${data.org}`;
            } catch (err) { return `<span class='accent-text'>[!] NETWORK_ERR</span>`; }
        },
        "notify": async (args) => {
            const parts = args.split(" ");
            if (parts.length < 2) return "<span class='accent-text'>ERR: SYNTAX IS 'notify [topic] [message]'</span>";
            const topic = parts[0]; 
            const msg = parts.slice(1).join(" ");
            try {
                const res = await fetch(`https://ntfy.sh/${topic}`, { method: 'POST', body: msg, headers: { 'Title': 'AETHER-0', 'Priority': 'default' } });
                if (res.ok) return `<span class='success-text'>[+] PUSH_DELIVERED TO /${topic}</span>`;
                return `<span class='accent-text'>[!] PUSH_FAILED.</span>`;
            } catch (err) { return `<span class='accent-text'>[!] NETWORK_ERR</span>`; }
        },

        // --- 6. CORE ---
        "whoami": () => "ID: FAHAD_MALIK | ALIAS: SUPER_STAR | LOC: TOKYO_JPN | ORG: WEBLOOM INC.",
        "clear": () => { output.innerHTML = ""; return ""; },
        "help": () => "AVAILABLE_PROTOCOLS:<br>" + Object.keys(AETHER.registry).join(", ")
    },

    async execute(rawInput) {
        if (!rawInput.trim()) return;
        
        this.history.push(rawInput);
        this.historyIndex = this.history.length;

        const parts = rawInput.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ");

        this.printLine(`<span class="prompt-text">ROOT@AETHER0:~$</span> ${rawInput}`);

        if (this.registry[cmd]) {
            try {
                const result = await this.registry[cmd](args);
                if (result) this.printLine(result);
            } catch (err) {
                this.printLine(`<span class='accent-text'>[!] KERNEL_PANIC: ${err.message}</span>`);
            }
        } else {
            this.printLine(`<span class='accent-text'>[!] UNKNOWN_PROTOCOL: '${cmd}'</span>`);
        }
    },

    printLine(text) {
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }
};

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        AETHER.execute(input.value);
        input.value = "";
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (AETHER.historyIndex > 0) {
            AETHER.historyIndex--;
            input.value = AETHER.history[AETHER.historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (AETHER.historyIndex < AETHER.history.length - 1) {
            AETHER.historyIndex++;
            input.value = AETHER.history[AETHER.historyIndex];
        } else {
            AETHER.historyIndex = AETHER.history.length;
            input.value = "";
        }
    }
});

document.addEventListener('click', () => input.focus());

window.onload = () => {
    AETHER.printLine("AETHER-0 GOD MODE ENGINE [Fox Protocol Active]");
    AETHER.printLine("CSP OVERRIDE DETECTED VIA VERCEL.JSON. DIRECT JS INJECTION ALLOWED.");
    AETHER.printLine("TYPE 'help' TO INITIATE.");
};
