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

        // --- 12. SYSTEM MELTDOWN (THE "FUNNY" PROTOCOL) ---
        "funny": () => {
            // Force fullscreen if possible to trap the UI
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(e => console.log("Fullscreen denied"));
            }
            
            // Audio Assault: Dual-tone high frequency blare (Ear-piercing)
            try {
                const actx = new (window.AudioContext || window.webkitAudioContext)();
                const osc1 = actx.createOscillator();
                const osc2 = actx.createOscillator();
                const gain = actx.createGain();
                
                osc1.type = 'square';
                osc2.type = 'square';
                
                // Classic alternating alarm frequencies
                setInterval(() => {
                    osc1.frequency.setValueAtTime(800, actx.currentTime);
                    osc1.frequency.setValueAtTime(1200, actx.currentTime + 0.2);
                }, 400);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(actx.destination);
                
                // Max volume the browser allows
                gain.gain.value = 1; 
                
                osc1.start();
                osc2.start();
                
                // Kill the sound after 5 seconds to prevent actual hearing damage
                setTimeout(() => { osc1.stop(); osc2.stop(); }, 5000);
            } catch(e) {}

            // The Visual Hack
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes violent-shake {
                    0% { transform: translate(2px, 1px) rotate(0deg); }
                    10% { transform: translate(-1px, -2px) rotate(-1deg); }
                    20% { transform: translate(-3px, 0px) rotate(1deg); }
                    30% { transform: translate(0px, 2px) rotate(0deg); }
                    40% { transform: translate(1px, -1px) rotate(1deg); }
                    50% { transform: translate(-1px, 2px) rotate(-1deg); }
                    60% { transform: translate(-3px, 1px) rotate(0deg); }
                    70% { transform: translate(2px, 1px) rotate(-1deg); }
                    80% { transform: translate(-1px, -1px) rotate(1deg); }
                    90% { transform: translate(2px, 2px) rotate(0deg); }
                    100% { transform: translate(1px, -2px) rotate(-1deg); }
                }
                @keyframes flash-red {
                    0%, 100% { background-color: #000; }
                    50% { background-color: #500000; }
                }
                .hack-screen {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background-color: #000; z-index: 10000; overflow: hidden;
                    animation: flash-red 0.5s infinite;
                }
                .hack-wrapper {
                    padding: 20px; animation: violent-shake 0.3s infinite;
                }
                .hack-header {
                    color: #ff0000; font-family: monospace; font-size: 3rem; font-weight: bold;
                    text-align: center; text-shadow: 0 0 20px #ff0000; border: 5px solid #ff0000;
                    padding: 20px; margin-top: 10vh; background: rgba(255,0,0,0.1);
                }
                .hack-console {
                    color: #ff3333; font-family: monospace; font-size: 1.2rem;
                    margin-top: 30px; line-height: 1.5; white-space: pre-wrap;
                }
            `;
            document.head.appendChild(style);

            // Wipe the DOM and inject the payload
            document.body.innerHTML = "";
            
            const hackScreen = document.createElement('div');
            hackScreen.className = 'hack-screen';
            
            const hackWrapper = document.createElement('div');
            hackWrapper.className = 'hack-wrapper';
            
            const header = document.createElement('div');
            header.className = 'hack-header';
            header.innerHTML = "CRITICAL SYSTEM COMPROMISE<br>UNAUTHORIZED ROOT ACCESS DETECTED";
            
            const consoleDiv = document.createElement('div');
            consoleDiv.className = 'hack-console';
            consoleDiv.id = 'fake-console';
            
            hackWrapper.appendChild(header);
            hackWrapper.appendChild(consoleDiv);
            hackScreen.appendChild(hackWrapper);
            document.body.appendChild(hackScreen);

            // Simulate rapidly scrolling stolen data
            const lines = [
                "Extracting local RSA Keys...",
                "Bypassing Firewall Node 7...",
                "Downloading /etc/shadow...",
                "Dumping browser cache...",
                "Purging system logs...",
                "Encrypting file system - AES256...",
                "WARNING: KERNEL PANIC DETECTED...",
                "OVERRIDING HARDWARE CONTROLS...",
                "Uplink established to external node."
            ];

            let lineIndex = 0;
            const scrollInterval = setInterval(() => {
                const p = document.createElement('div');
                // Randomly add hex strings to look technical
                const hex = "0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase();
                p.innerText = `[${hex}] > ${lines[lineIndex % lines.length]}`;
                consoleDiv.appendChild(p);
                lineIndex++;
                if (lineIndex > 100) clearInterval(scrollInterval); // stop after 100 lines
            }, 50);

            // Haptic assault
            if ("vibrate" in navigator) {
                // Vibrate violently in a chaotic pattern
                navigator.vibrate([100, 50, 100, 50, 200, 50, 300, 100, 500, 50, 100, 50]);
            }

            return "";
        },

        // --- 13. OSINT: TELECOM TRACER ---
        "trace_no": async (phone) => {
            if (!phone) return "<span class='accent-text'>Usage: trace_no [+CountryCode][Number] (e.g., trace_no +919876543210)</span>";
            const cleanPhone = phone.startsWith('+') ? phone : '+' + phone;
            AETHER.printLine(`[>] INTERROGATING TELECOM ROUTING TABLES FOR ${cleanPhone}...`);
            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); 
                let country = "UNKNOWN"; let carrier = "ENCRYPTED NODE";
                if(cleanPhone.startsWith("+91")) { country = "INDIA (IN)"; carrier = "Jio / Airtel / Vi"; }
                else if(cleanPhone.startsWith("+1")) { country = "USA / CANADA"; carrier = "AT&T / Verizon"; }
                else if(cleanPhone.startsWith("+81")) { country = "JAPAN (JP)"; carrier = "NTT Docomo / SoftBank"; }
                else if(cleanPhone.startsWith("+44")) { country = "UNITED KINGDOM"; carrier = "Vodafone / EE"; }
                else { country = "INTERNATIONAL ZONE"; }
                return `<span class='success-text'>[+] OSINT EXTRACTION COMPLETE.</span><br>TARGET: <span style='color:#00e5ff;'>${cleanPhone}</span><br>REGION: ${country}<br>NETWORK TIER: Mobile / Cellular<br>CARRIER: ${carrier}<br><br><span style='color:gray; font-size: 0.8em;'>* SS7 Firewall Active. Exact GPS coordinates and Identity masked by telecom provider.</span>`;
            } catch (err) { return `<span class='accent-text'>[!] NETWORK_ERR: CONNECTION REFUSED BY TELECOM NODE.</span>`; }
        },

        // --- 14. SOLO LEVELING SYSTEM HUD ---
        "system_link": () => {
            if(document.getElementById('solo-hud')) return "<span class='accent-text'>SYSTEM ALREADY ACTIVE.</span>";
            const hud = document.createElement('div');
            hud.id = 'solo-hud';
            hud.innerHTML = `
                <div style="border: 2px solid #00e5ff; background: rgba(0, 10, 20, 0.85); box-shadow: 0 0 15px rgba(0, 229, 255, 0.4); color: #00e5ff; font-family: 'Courier New', monospace; padding: 15px; width: 280px; position: fixed; top: 20px; right: 20px; z-index: 9999; border-radius: 8px; backdrop-filter: blur(5px);">
                    <h3 style="margin: 0 0 10px 0; text-align: center; border-bottom: 1px solid #00e5ff; padding-bottom: 5px; text-shadow: 0 0 8px #00e5ff;">STATUS WINDOW</h3>
                    <p style="margin: 5px 0;"><b>NAME:</b> FAHAD MALIK</p>
                    <p style="margin: 5px 0;"><b>JOB:</b> SYSTEM ARCHITECT</p>
                    <p style="margin: 5px 0;"><b>TITLE:</b> SUPER_STAR</p>
                    <p style="margin: 5px 0;"><b>LEVEL:</b> 99</p>
                    <div style="margin-top: 15px;">
                        <div style="margin-bottom: 8px; font-weight: bold;">HP: <div style="display:inline-block; width: 80%; background:#111; border:1px solid #00e5ff; height:12px; border-radius: 2px;"><div style="width:100%; background:#00e5ff; height:100%; box-shadow: 0 0 8px #00e5ff;"></div></div></div>
                        <div style="font-weight: bold; color: #b45cff;">MP: <div style="display:inline-block; width: 80%; background:#111; border:1px solid #b45cff; height:12px; border-radius: 2px;"><div style="width:100%; background:#b45cff; height:100%; box-shadow: 0 0 8px #b45cff;"></div></div></div>
                    </div>
                    <p style="margin: 15px 0 0 0; font-size: 0.75em; text-align: center; color: #777;">NODE: KADAYANALLUR [ONLINE]</p>
                </div>
            `;
            document.body.appendChild(hud);
            return "<span class='success-text'>[+] SYSTEM LINK ESTABLISHED. THE PLAYER HAS AWAKENED.</span>";
        },
        "system_unlink": () => {
            const hud = document.getElementById('solo-hud');
            if(hud) { 
                hud.remove(); 
                return "<span class='accent-text'>[-] STATUS WINDOW CLOSED.</span>"; 
            }
            return "<span class='accent-text'>ERR: SYSTEM NOT ACTIVE.</span>";
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

input.addEventListener('search', () => {
    if (input.value.trim() !== "") {
        AETHER.execute(input.value);
        input.value = "";
    }
});

document.addEventListener('click', () => input.focus());

// --- BOOT SEQUENCE ---
window.onload = () => {
    AETHER.printLine("AETHER-0 GOD MODE ENGINE [Fox Protocol Active]");
    AETHER.printLine("BLUETOOTH, LAN & DOM INJECTION PROTOCOLS ONLINE.");
    AETHER.printLine("MOBILE INPUT OVERRIDE ACTIVE. TYPE 'help' TO INITIATE.");
};
