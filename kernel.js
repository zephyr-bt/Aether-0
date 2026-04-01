/**
 * AETHER-0 // GOD_MODE_KERNEL
 * ARCHITECT: FAHAD MALIK (SUPER_STAR)
 * ORG: WEBLOOM INC. 
 * ORIGIN: TOKYO_JPN // LOCAL_NODE: KADAYANALLUR_IND
 */

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const clock = document.getElementById('clock');
const wrapper = document.getElementById('terminal-wrapper');

// --- LIVE CLOCK ---
setInterval(() => { clock.innerText = new Date().toLocaleTimeString("en-IN", {timeZone: "Asia/Kolkata"}); }, 1000);

// --- PYTHON WEBASSEMBLY (PYODIDE) BOOT SEQUENCE ---
let pyodideReady = false;
let pyodide = null;

async function bootPythonCore() {
    AETHER.printLine("[>] INITIALIZING WASM PYTHON KERNEL...");
    try {
        if (typeof loadPyodide !== "undefined") {
            pyodide = await loadPyodide();
            pyodideReady = true;
            AETHER.printLine("<span class='success-text'>[+] CPYTHON ENVIRONMENT SECURED. 'py' PROTOCOL ACTIVE.</span>");
        } else {
            AETHER.printLine("<span class='accent-text'>[!] PYODIDE_MISSING: Add Pyodide CDN script to HTML head.</span>");
        }
    } catch (err) {
        AETHER.printLine(`<span class='accent-text'>[!] WASM_ERR: ${err.message}</span>`);
    }
}
setTimeout(bootPythonCore, 1000);

// --- GLOBAL BLUETOOTH MEMORY ---
window.bleDevice = null;
window.bleServer = null;

const AETHER = {
    history: [],
    historyIndex: -1,

    registry: {
        // --- 1. REAL EXEC & PYTHON ENGINES ---
        "exec": async (code) => {
            if (!code) return "<span class='accent-text'>ERR: CODE_REQUIRED</span>";
            try { 
                const result = await eval(`(async () => { return ${code} })()`); 
                return typeof result === 'object' ? `<span class='success-text'>${JSON.stringify(result)}</span>` : `<span class='success-text'>${String(result)}</span>`;
            } catch (e) { return `<span class='accent-text'>[!] EXEC_ERR: ${e.message}</span>`; }
        },
        "py": async (code) => {
            if (!code) return "<span class='accent-text'>ERR: PYTHON_CODE_REQUIRED</span>";
            if (!pyodideReady) return "<span class='accent-text'>ERR: PYTHON_KERNEL_STILL_BOOTING</span>";
            try {
                const pyResult = await pyodide.runPythonAsync(code);
                return typeof pyResult !== 'undefined' ? `<span style="color:#f2e422;">PYTHON_OUT: ${pyResult}</span>` : "<span class='success-text'>[+] EXECUTED.</span>";
            } catch (err) { return `<span class='accent-text'>[!] PYTHON_TRACEBACK: ${err.message}</span>`; }
        },

        // --- 2. SONY BRAVIA & ROKU LAN CONTROLLERS ---
        "sony_power": async (args) => {
            const parts = args.split(" ");
            if (parts.length < 2) return "<span class='accent-text'>Usage: sony_power [local_ip] [psk_key]</span>";
            const ip = parts[0];
            const psk = parts[1];

            const payload = `<?xml version="1.0"?>
            <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
                <s:Body>
                    <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
                        <IRCCCode>AAAAAQAAAAEAAAAVAw==</IRCCCode>
                    </u:X_SendIRCC>
                </s:Body>
            </s:Envelope>`;

            try {
                AETHER.printLine(`[>] TRANSMITTING IRCC XML PAYLOAD TO ${ip}...`);
                await fetch(`http://${ip}/sony/IRCC`, {
                    method: 'POST',
                    headers: {
                        'X-Auth-PSK': psk,
                        'Content-Type': 'text/xml; charset=utf-8',
                        'SOAPAction': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"'
                    },
                    body: payload
                });
                return `<span class='success-text'>[+] BRAVIA OVERRIDDEN. POWER TOGGLED.</span>`;
            } catch(e) { return `<span class='accent-text'>[!] SONY_API_ERR: ${e.message}<br>(Check CORS extensions if running in browser sandbox).</span>`; }
        },
        "sony_mute": async (args) => {
            const parts = args.split(" ");
            if (parts.length < 2) return "<span class='accent-text'>Usage: sony_mute [local_ip] [psk_key]</span>";
            const payload = `<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1"><IRCCCode>AAAAAQAAAAEAAAAUAw==</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>`;
            try {
                await fetch(`http://${parts[0]}/sony/IRCC`, {
                    method: 'POST',
                    headers: { 'X-Auth-PSK': parts[1], 'Content-Type': 'text/xml; charset=utf-8', 'SOAPAction': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"' },
                    body: payload
                });
                return `<span class='success-text'>[+] BRAVIA AUDIO MUTED.</span>`;
            } catch(e) { return `<span class='accent-text'>[!] SONY_API_ERR: ${e.message}</span>`; }
        },
        "tv_power": async (ip) => {
            if (!ip) return "<span class='accent-text'>Usage: tv_power [local_ip] (e.g., Roku port 8060)</span>";
            try {
                await fetch(`http://${ip}:8060/keypress/Power`, { method: 'POST', mode: 'no-cors' });
                return `<span class='success-text'>[+] POWER_PAYLOAD DELIVERED TO LAN IP: ${ip}</span>`;
            } catch(e) { return `<span class='accent-text'>[!] LAN_ERR: ${e.message}</span>`; }
        },

        // --- 3. BLUETOOTH (BLE) CONTROLLERS ---
        "bt_scan": async () => {
            try {
                AETHER.printLine(`[>] SCANNING LOCAL FREQUENCIES FOR BLE SIGNATURES...`);
                const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
                window.bleDevice = device;
                return `<span class='success-text'>[+] BLE TARGET LOCKED: ${device.name || 'UNKNOWN_DEVICE'}</span><br>ID: ${device.id}<br>Type 'bt_connect' to attempt GATT link.`;
            } catch(e) { return `<span class='accent-text'>[!] BT_SCAN_FAILED: ${e.message}</span>`; }
        },
        "bt_connect": async () => {
            if (!window.bleDevice) return "<span class='accent-text'>ERR: NO_TARGET_LOCKED. Run 'bt_scan' first.</span>";
            try {
                AETHER.printLine(`[>] NEGOTIATING GATT SERVER HANDSHAKE WITH ${window.bleDevice.name}...`);
                const server = await window.bleDevice.gatt.connect();
                window.bleServer = server;
                return `<span class='success-text'>[+] GATT LINK ESTABLISHED. DEVICE VULNERABLE.</span>`;
            } catch(e) { return `<span class='accent-text'>[!] GATT_LINK_FAILED: ${e.message}</span>`; }
        },
        "bt_disconnect": () => {
            if (window.bleDevice && window.bleDevice.gatt.connected) {
                window.bleDevice.gatt.disconnect();
                return "[-] GATT LINK SEVERED.";
            }
            return "ERR: NO_ACTIVE_BT_CONNECTION.";
        },

        // --- 4. DOM DESTRUCTION & UI MANIPULATION ---
        "edit_web": () => { document.designMode = "on"; return "<span class='success-text'>[+] DOM UNLOCKED: Type anywhere on this webpage.</span>"; },
        "lock_web": () => { document.designMode = "off"; return "<span class='accent-text'>[-] DOM LOCKED.</span>"; },
        "barrel_roll": () => { wrapper.style.transition = "transform 2s"; wrapper.style.transform = "rotate(360deg)"; setTimeout(()=>wrapper.style.transform="", 2000); return "DOING A BARREL ROLL."; },
        "earthquake": () => { let i=0; const iv = setInterval(()=>{ wrapper.style.transform = `translate(${Math.random()*20-10}px, ${Math.random()*20-10}px)`; i++; if(i>20){clearInterval(iv); wrapper.style.transform="";}}, 50); return "<span class='accent-text'>SEISMIC ANOMALY DETECTED.</span>"; },
        "invert": () => { document.body.style.filter = document.body.style.filter === "invert(1)" ? "" : "invert(1)"; return "POLARITY_TOGGLED."; },
        "disco": () => { window.discoIv = setInterval(()=> document.body.style.filter = `hue-rotate(${Math.random()*360}deg)`, 100); return "RAVE PROTOCOL ACTIVE. Use 'stop_disco'."; },
        "stop_disco": () => { clearInterval(window.discoIv); document.body.style.filter = ""; return "RAVE_HALTED."; },
        "hide_cursor": () => { document.body.style.cursor = "none"; return "STEALTH_CURSOR_ACTIVE."; },
        "show_cursor": () => { document.body.style.cursor = "default"; return "CURSOR_RESTORED."; },

        // --- 5. HARDWARE & OS INTERROGATION ---
        "battery": async () => { try { const b = await navigator.getBattery(); return `BATTERY: ${b.level*100}% | CHARGING: ${b.charging}`; } catch(e) { return "<span class='accent-text'>HARDWARE_LOCKED</span>"; } },
        "vibrate": () => { navigator.vibrate([200, 100, 200, 100, 500]); return "HAPTIC_MOTORS_ENGAGED."; },
        "voice": (msg) => { const u = new SpeechSynthesisUtterance(msg || "Super star override protocol accepted."); window.speechSynthesis.speak(u); return "TTS_ONLINE."; },
        "cores": () => `CPU_LOGICAL_CORES: ${navigator.hardwareConcurrency || 'UNKNOWN'}`,
        "memory": () => `RAM_HEAP_LIMIT: ${performance.memory ? performance.memory.jsHeapSizeLimit / 1048576 + ' MB' : 'DENIED'}`,
        "platform": () => `OS_USER_AGENT: ${navigator.userAgent}`,

        // --- 6. LIVE DATA HEISTS ---
        "iss_loc": async () => { const r = await fetch("http://api.open-notify.org/iss-now.json"); const d = await r.json(); return `🛰️ ISS_COORDS: LAT ${d.iss_position.latitude}, LON ${d.iss_position.longitude}`; },
        "crypto_btc": async () => { const r = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json"); const d = await r.json(); return `🪙 BTC_LIVE: $${d.bpi.USD.rate}`; },
        "arise": () => { 
            document.body.style.background = "#050014"; 
            wrapper.style.borderColor = "#7b00ff";
            wrapper.style.boxShadow = "0 20px 50px rgba(0,0,0,0.9), inset 0 0 25px rgba(123, 0, 255, 0.3)";
            document.documentElement.style.setProperty('--cyan', '#b45cff');
            return "<span style='color:#b45cff; font-weight:bold; text-shadow: 0 0 8px #b45cff'>SHADOW_ARMY_AWAKENED. ARISE.</span>"; 
        },
        "pokemon": async (name) => { try { const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${name||'rayquaza'}`); const d = await r.json(); return `🐉 EVO_DATA: ${d.name.toUpperCase()} | TYPE: ${d.types[0].type.name} | HP: ${d.stats[0].base_stat}`; } catch(e){ return "<span class='accent-text'>ENTITY_NOT_FOUND</span>"; } },

        // --- 7. NETWORK & TRACKING ---
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
            if (parts.length < 2) return "<span class='accent-text'>Usage: notify [topic] [message]</span>";
            const topic = parts[0]; 
            const msg = parts.slice(1).join(" ");
            try {
                const res = await fetch(`https://ntfy.sh/${topic}`, { method: 'POST', body: msg, headers: { 'Title': 'AETHER-0', 'Priority': 'default' } });
                if (res.ok) return `<span class='success-text'>[+] PUSH_DELIVERED TO /${topic}</span>`;
                return `<span class='accent-text'>[!] PUSH_FAILED.</span>`;
            } catch (err) { return `<span class='accent-text'>[!] NETWORK_ERR</span>`; }
        },

        // --- 8. SYSTEM CORE ---
        "whoami": () => "ID: FAHAD_MALIK | ALIAS: SUPER_STAR<br>ORIGIN: TOKYO_JPN | LOCAL_NODE: KADAYANALLUR_IND<br>ORG: WEBLOOM INC.",
        "clear": () => { output.innerHTML = ""; return ""; },
        "help": () => "AVAILABLE_PROTOCOLS:<br><br>" + Object.keys(AETHER.registry).join(", "),

        // --- 12. DOMAIN EXPANSION (V2 - CINEMATIC OVERRIDE) ---
        "domain_expansion": () => {
            // Lock scrolling and prep the canvas
            document.body.style.overflow = "hidden";
            
            // Phase 1: The Audio Design (High-pitch ring -> Deep Bass Drop)
            try {
                const actx = new (window.AudioContext || window.webkitAudioContext)();
                
                // The Activation Ring
                const ring = actx.createOscillator();
                ring.type = 'sine';
                ring.frequency.setValueAtTime(3000, actx.currentTime);
                ring.frequency.exponentialRampToValueAtTime(8000, actx.currentTime + 0.8);
                ring.connect(actx.destination);
                ring.start();
                setTimeout(() => ring.stop(), 800);
                
                // The Void Bass
                setTimeout(() => {
                    const bass = actx.createOscillator();
                    bass.type = 'sawtooth';
                    bass.frequency.setValueAtTime(50, actx.currentTime);
                    bass.frequency.exponentialRampToValueAtTime(10, actx.currentTime + 2.5);
                    bass.connect(actx.destination);
                    bass.start();
                    setTimeout(() => bass.stop(), 3000);
                }, 800);
            } catch(e) {}

            // Phase 2: The Visual Physics
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes flash-bang {
                    0% { background-color: white; opacity: 1; }
                    80% { background-color: white; opacity: 1; }
                    100% { background-color: transparent; opacity: 0; }
                }
                @keyframes sphere-expand {
                    0% { transform: translate(-50%, -50%) scale(0); border: 2px solid white; background: transparent; }
                    50% { border: 15px solid #b45cff; background: rgba(180, 92, 255, 0.3); box-shadow: 0 0 50px #b45cff; }
                    100% { transform: translate(-50%, -50%) scale(100); border: 2px solid black; background: black; }
                }
                @keyframes text-glitch {
                    0% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 2px); }
                    20% { clip-path: inset(80% 0 10% 0); transform: translate(2px, -2px); }
                    40% { clip-path: inset(30% 0 50% 0); transform: translate(-2px, 0); }
                    60% { clip-path: inset(50% 0 30% 0); transform: translate(2px, 2px); }
                    80% { clip-path: inset(10% 0 60% 0); transform: translate(-1px, -1px); }
                    100% { clip-path: inset(0 0 0 0); transform: translate(0); }
                }
                @keyframes float-up {
                    0% { transform: translateY(100vh); opacity: 1; }
                    100% { transform: translateY(-10vh); opacity: 0; }
                }
                .flash {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    z-index: 10000; animation: flash-bang 0.8s cubic-bezier(0.1, 0.8, 0.1, 1) forwards;
                    pointer-events: none;
                }
                .sphere {
                    position: fixed; top: 50%; left: 50%; width: 5vmin; height: 5vmin;
                    border-radius: 50%; z-index: 9998;
                    animation: sphere-expand 1s cubic-bezier(0.7, 0, 0.2, 1) forwards;
                    animation-delay: 0.2s; pointer-events: none; opacity: 0;
                }
                .void-core {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: #000; z-index: 9997; opacity: 0;
                    animation: fadeIn 0s linear 1s forwards;
                }
                @keyframes fadeIn { to { opacity: 1; } }
                
                .jujutsu-text {
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    color: white; font-family: monospace; font-size: 10vw;
                    font-weight: bold; text-align: center; white-space: nowrap; z-index: 9999;
                    text-shadow: -4px 0px #ff003c, 4px 0px #00e5ff, 0 0 20px rgba(255,255,255,0.5);
                    opacity: 0; animation: fadeIn 0s linear 1.2s forwards, text-glitch 0.15s infinite 1.2s;
                }
                .debris {
                    position: absolute; color: #b45cff; font-family: monospace;
                    font-size: 1.2rem; z-index: 9998; opacity: 0;
                    text-shadow: 0 0 5px #7b00ff;
                    animation: fadeIn 0s linear 1s forwards, float-up linear infinite;
                }
            `;
            document.head.appendChild(style);

            // Wipe the DOM clean
            document.body.innerHTML = "";
            document.body.style.backgroundColor = "black";

            // Inject the elements
            const flash = document.createElement('div'); flash.className = 'flash';
            const sphere = document.createElement('div'); sphere.className = 'sphere';
            const voidCore = document.createElement('div'); voidCore.className = 'void-core';
            
            const text = document.createElement('div'); 
            text.className = 'jujutsu-text';
            text.innerHTML = "無量空処<br>INFINITE VOID"; 
            
            document.body.appendChild(flash);
            document.body.appendChild(sphere);
            document.body.appendChild(voidCore);
            document.body.appendChild(text);

            // Generate floating corrupted data debris
            for(let i = 0; i < 40; i++) {
                let d = document.createElement('div');
                d.className = 'debris';
                // Random hex generator
                d.innerText = "0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
                d.style.left = (Math.random() * 100) + 'vw';
                d.style.animationDuration = (Math.random() * 2 + 1) + 's';
                d.style.animationDelay = (Math.random() * 1.5 + 1) + 's';
                document.body.appendChild(d);
            }

            return "";
        }
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

// --- MOBILE-OPTIMIZED INPUT LISTENER ---
input.addEventListener('keyup', (e) => {
    // 13 is the universal keyCode for the Enter/Return button on mobile devices
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault(); 
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

// Fallback listener for soft-keyboards that trigger a 'search' event instead of 'Enter'
input.addEventListener('search', () => {
    if (input.value.trim() !== "") {
        AETHER.execute(input.value);
        input.value = "";
    }
});

// Auto-focus input when clicking terminal
document.addEventListener('click', () => input.focus());

// --- BOOT SEQUENCE ---
window.onload = () => {
    AETHER.printLine("AETHER-0 GOD MODE ENGINE [Fox Protocol Active]");
    AETHER.printLine("BLUETOOTH, LAN & DOM INJECTION PROTOCOLS ONLINE.");
    AETHER.printLine("MOBILE INPUT OVERRIDE ACTIVE. TYPE 'help' TO INITIATE.");
};
