/**
 * AETHER-0 // GOD_MODE_KERNEL
 * ARCHITECT: FAHAD MALIK (SUPER_STAR)
 * ORG: WEBLOOM INC. (WEBSITES ONLY)
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
        // Requires: <script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"></script> in index.html
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

        // --- 2. HARDWARE IOT / LAN / BLUETOOTH CONTROLLERS ---
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
        "tv_power": async (ip) => {
            if (!ip) return "<span class='accent-text'>Usage: tv_power [local_ip] (e.g., 192.168.1.50)</span>";
            try {
                await fetch(`http://${ip}:8060/keypress/Power`, { method: 'POST', mode: 'no-cors' });
                return `<span class='success-text'>[+] POWER_PAYLOAD DELIVERED TO LAN IP: ${ip}</span>`;
            } catch(e) { return `<span class='accent-text'>[!] LAN_ERR: ${e.message}</span>`; }
        },

        // --- 3. DOM DESTRUCTION & UI MANIPULATION ---
        "edit_web": () => { document.designMode = "on"; return "<span class='success-text'>[+] DOM UNLOCKED: Type anywhere on this webpage.</span>"; },
        "lock_web": () => { document.designMode = "off"; return "<span class='accent-text'>[-] DOM LOCKED.</span>"; },
        "barrel_roll": () => { wrapper.style.transition = "transform 2s"; wrapper.style.transform = "rotate(360deg)"; setTimeout(()=>wrapper.style.transform="", 2000); return "DOING A BARREL ROLL."; },
        "earthquake": () => { let i=0; const iv = setInterval(()=>{ wrapper.style.transform = `translate(${Math.random()*20-10}px, ${Math.random()*20-10}px)`; i++; if(i>20){clearInterval(iv); wrapper.style.transform="";}}, 50); return "<span class='accent-text'>SEISMIC ANOMALY DETECTED.</span>"; },
        "invert": () => { document.body.style.filter = document.body.style.filter === "invert(1)" ? "" : "invert(1)"; return "POLARITY_TOGGLED."; },
        "disco": () => { window.discoIv = setInterval(()=> document.body.style.filter = `hue-rotate(${Math.random()*360}deg)`, 100); return "RAVE PROTOCOL ACTIVE. Use 'stop_disco'."; },
        "stop_disco": () => { clearInterval(window.discoIv); document.body.style.filter = ""; return "RAVE_HALTED."; },
        "hide_cursor": () => { document.body.style.cursor = "none"; return "STEALTH_CURSOR_ACTIVE."; },
        "show_cursor": () => { document.body.style.cursor = "default"; return "CURSOR_RESTORED."; },

        // --- 4. HARDWARE & OS INTERROGATION ---
        "battery": async () => { try { const b = await navigator.getBattery(); return `BATTERY: ${b.level*100}% | CHARGING: ${b.charging}`; } catch(e) { return "<span class='accent-text'>HARDWARE_LOCKED</span>"; } },
        "vibrate": () => { navigator.vibrate([200, 100, 200, 100, 500]); return "HAPTIC_MOTORS_ENGAGED."; },
        "voice": (msg) => { const u = new SpeechSynthesisUtterance(msg || "Super star override protocol accepted."); window.speechSynthesis.speak(u); return "TTS_ONLINE."; },
        "cores": () => `CPU_LOGICAL_CORES: ${navigator.hardwareConcurrency || 'UNKNOWN'}`,
        "memory": () => `RAM_HEAP_LIMIT: ${performance.memory ? performance.memory.jsHeapSizeLimit / 1048576 + ' MB' : 'DENIED'}`,
        "platform": () => `OS_USER_AGENT: ${navigator.userAgent}`,

        // --- 5. LIVE DATA HEISTS ---
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

        // --- 6. NETWORK & TRACKING ---
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

        // --- 7. SYSTEM CORE ---
        "whoami": () => "ID: FAHAD_MALIK | ALIAS: SUPER_STAR<br>ORIGIN: TOKYO_JPN | LOCAL_NODE: KADAYANALLUR_IND<br>ORG: WEBLOOM INC. (WEBSITES ONLY)",
        "clear": () => { output.innerHTML = ""; return ""; },
        "help": () => "AVAILABLE_PROTOCOLS:<br><br>" + Object.keys(AETHER.registry).join(", ")
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

// --- INPUT EVENT LISTENERS ---
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

// Auto-focus input when clicking terminal
document.addEventListener('click', () => input.focus());
        // --- SONY BRAVIA IP CONTROLLER ---
        "sony_power": async (args) => {
            const parts = args.split(" ");
            if (parts.length < 2) return "<span class='accent-text'>Usage: sony_power [local_ip] [psk_key]</span>";
            const ip = parts[0];
            const psk = parts[1]; // The code you set on the TV (e.g., 0000)
            
            // Raw SOAP XML payload for the Power Toggle command
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
            } catch(e) { 
                return `<span class='accent-text'>[!] SONY_API_ERR: ${e.message}<br>(Note: If fetching from a browser, CORS may block custom headers. Use a CORS-unblock extension or the native Python bridge).</span>`; 
            }
        },

        "sony_mute": async (args) => {
            const parts = args.split(" ");
            if (parts.length < 2) return "<span class='accent-text'>Usage: sony_mute [local_ip] [psk_key]</span>";
            const ip = parts[0];
            const psk = parts[1];
            
            const payload = `<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1"><IRCCCode>AAAAAQAAAAEAAAAUAw==</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>`;

            try {
                await fetch(`http://${ip}/sony/IRCC`, {
                    method: 'POST',
                    headers: { 'X-Auth-PSK': psk, 'Content-Type': 'text/xml; charset=utf-8', 'SOAPAction': '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"' },
                    body: payload
                });
                return `<span class='success-text'>[+] BRAVIA AUDIO MUTED.</span>`;
            } catch(e) { return `<span class='accent-text'>[!] SONY_API_ERR: ${e.message}</span>`; }
        },


// --- BOOT SEQUENCE ---
window.onload = () => {
    AETHER.printLine("AETHER-0 GOD MODE ENGINE [Fox Protocol Active]");
    AETHER.printLine("BLUETOOTH, LAN & DOM INJECTION PROTOCOLS ONLINE.");
    AETHER.printLine("TYPE 'help' TO INITIATE.");
};

