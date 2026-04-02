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
        // --- 1. ENGINES ---
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

        // --- 2. LAN CONTROLLERS ---
        "sony_power": async (args) => {
            const parts = args.split(" ");
            if (parts.length < 2) return "<span class='accent-text'>Usage: sony_power [local_ip] [psk_key]</span>";
            const payload = `<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1"><IRCCCode>AAAAAQAAAAEAAAAVAw==</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>`;
            try {
                await fetch(`http://${parts[0]}/sony/IRCC`, { method: 'POST', headers: { 'X-Auth-PSK': parts[1], 'Content-Type': 'text/xml' }, body: payload });
                return `<span class='success-text'>[+] BRAVIA POWER TOGGLED.</span>`;
            } catch(e) { return `<span class='accent-text'>[!] SONY_ERR: ${e.message}</span>`; }
        },
        "tv_power": async (ip) => {
            try { await fetch(`http://${ip}:8060/keypress/Power`, { method: 'POST', mode: 'no-cors' }); return `<span class='success-text'>[+] ROKU POWER_SIGNAL SENT.</span>`; } catch(e) { return `<span class='accent-text'>[!] LAN_ERR</span>`; }
        },

        // --- 3. NETWORK SURVEILLANCE ---
        "net_map": async () => {
            AETHER.printLine("[>] INITIATING SUBNET DISCOVERY [Range: 10.17.149.1 - 254]...");
            const subnet = "10.17.149";
            let found = 0;
            const container = document.createElement('div');
            container.style.borderLeft = "2px solid #7b00ff";
            container.style.paddingLeft = "10px";
            container.style.margin = "10px 0";
            output.appendChild(container);

            for (let i = 60; i < 75; i++) { // Optimized range for mobile hotspot scan
                const ip = `${subnet}.${i}`;
                const img = new Image();
                img.onload = () => {
                    container.innerHTML += `<div class='success-text'>[+] NODE_ALIVE: ${ip} (Active)</div>`;
                    found++;
                };
                img.onerror = () => { /* Silent check */ };
                img.src = `http://${ip}/favicon.ico?${Date.now()}`;
            }
            setTimeout(() => { if(found === 0) container.innerHTML += "<span class='accent-text'>[!] NO UNPROTECTED NODES DISCOVERED.</span>"; }, 3000);
            return "SCAN_BACKGROUNDED.";
        },
        "flight_tap": async () => {
            AETHER.printLine("[>] INTERCEPTING ADS-B DATA FROM NEAREST TELEMETRY NODE...");
            try {
                // Mocking Kadayanallur/Tokyo regional bounding box for simulation
                const res = await fetch("https://opensky-network.org/api/states/all");
                const data = await res.json();
                const slice = data.states.slice(0, 5);
                let out = "<span class='success-text'>[+] LOCAL AIRSPACE DATA EXTRACTED:</span><br>";
                slice.forEach(f => {
                    out += `ID: ${f[0]} | CALLSIGN: ${f[1] || 'N/A'} | ALT: ${Math.round(f[7])}m | VEL: ${Math.round(f[9])}m/s<br>`;
                });
                return out;
            } catch(e) { return "<span class='accent-text'>[!] API_THROTTLED: Global aviation nodes are heavily guarded.</span>"; }
        },
        "sat_view": (coords) => {
            const loc = coords || "Kadayanallur,India";
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.google.com/maps?q=${loc}&output=embed&t=k`;
            iframe.style.width = "100%";
            iframe.style.height = "300px";
            iframe.style.border = "2px solid #7b00ff";
            iframe.style.marginTop = "10px";
            output.appendChild(iframe);
            return `<span class='success-text'>[+] OPTICAL SATELLITE UPLINK ESTABLISHED FOR: ${loc}</span>`;
        },

        // --- 4. BLUETOOTH ---
        "bt_scan": async () => {
            try {
                const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
                window.bleDevice = device;
                return `<span class='success-text'>[+] BLE TARGET LOCKED: ${device.name}</span>`;
            } catch(e) { return `<span class='accent-text'>[!] BT_FAILED: ${e.message}</span>`; }
        },

        // --- 5. UI & DOM ---
        "edit_web": () => { document.designMode = "on"; return "[+] DOM UNLOCKED."; },
        "lock_web": () => { document.designMode = "off"; return "[-] DOM LOCKED."; },
        "funny": () => {
            if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
            try {
                const actx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = actx.createOscillator();
                osc.type = 'square';
                setInterval(() => { osc.frequency.setValueAtTime(800, actx.currentTime); osc.frequency.setValueAtTime(1200, actx.currentTime + 0.2); }, 400);
                osc.connect(actx.destination);
                osc.start();
                setTimeout(() => osc.stop(), 5000);
            } catch(e) {}
            
            document.body.innerHTML = "<div style='background:#000; color:#f00; height:100vh; width:100vw; position:fixed; top:0; left:0; z-index:10000; font-family:monospace; padding:50px; text-align:center; animation: flash-red 0.2s infinite;'>" +
                "<h1 style='border:5px solid red; padding:20px;'>CRITICAL SYSTEM BREACH</h1>" +
                "<div id='h-log' style='text-align:left; margin-top:20px;'></div></div>";
            
            const log = document.getElementById('h-log');
            setInterval(() => { log.innerHTML += `[0x${Math.floor(Math.random()*16777215).toString(16)}] EXFILTRATING_DATA_NODE_${Math.floor(Math.random()*99)}...<br>`; window.scrollTo(0,document.body.scrollHeight); }, 50);
            return "";
        },

        // --- 6. SYSTEM CORE ---
        "whoami": () => "ID: FAHAD_MALIK | ALIAS: SUPER_STAR<br>ORIGIN: TOKYO_JPN | NODE: KADAYANALLUR_IND",
        "clear": () => { output.innerHTML = ""; return ""; },
        "help": () => "AVAILABLE_PROTOCOLS:<br><br>" + Object.keys(AETHER.registry).join(", "),
        
        "domain_expansion": () => {
            document.body.style.overflow = "hidden";
            const style = document.createElement('style');
            style.innerHTML = `@keyframes flash-bang { 0% { background: white; opacity: 1; } 100% { background: transparent; opacity: 0; } } @keyframes sphere-expand { 0% { transform: translate(-50%,-50%) scale(0); } 100% { transform: translate(-50%,-50%) scale(100); background: black; } } .flash { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:10000; animation: flash-bang 0.8s forwards; } .sphere { position:fixed; top:50%; left:50%; width:10px; height:10px; background:#b45cff; border-radius:50%; z-index:9999; animation: sphere-expand 1s forwards; }`;
            document.head.appendChild(style);
            document.body.innerHTML = "<div class='flash'></div><div class='sphere'></div><h1 style='position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); color:white; z-index:10001; font-family:monospace; text-align:center;'>無量空処<br>INFINITE VOID</h1>";
            return "";
        },
        "system_link": () => {
            const hud = document.createElement('div');
            hud.id = 'solo-hud';
            hud.style = "border: 2px solid #00e5ff; background: rgba(0,10,20,0.9); color: #00e5ff; font-family: monospace; padding: 15px; width: 250px; position: fixed; top: 20px; right: 20px; z-index: 9999; border-radius: 8px; box-shadow: 0 0 15px #00e5ff;";
            hud.innerHTML = "<h3>STATUS WINDOW</h3><p>NAME: FAHAD MALIK</p><p>LEVEL: 99</p><p>HP: [||||||||||] 100%</p><p>MP: [||||||||||] 100%</p>";
            document.body.appendChild(hud);
            return "[+] SYSTEM LINK ACTIVE.";
        }
    },

    async execute(rawInput) {
        if (!rawInput.trim()) return;
        this.history.push(rawInput);
        const parts = rawInput.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ");
        this.printLine(`<span style="color:#7b00ff;">ROOT@AETHER0:~$</span> ${rawInput}`);
        if (this.registry[cmd]) {
            const res = await this.registry[cmd](args);
            if (res) this.printLine(res);
        } else {
            this.printLine(`<span style="color:red;">[!] UNKNOWN_PROTOCOL: '${cmd}'</span>`);
        }
    },

    printLine(text) {
        const line = document.createElement('div');
        line.innerHTML = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }
};

input.addEventListener('keyup', (e) => { if (e.key === 'Enter') { AETHER.execute(input.value); input.value = ""; } });
document.addEventListener('click', () => input.focus());
window.onload = () => { AETHER.printLine("AETHER-0 [v3.5 OMNISCIENCE] ONLINE."); AETHER.printLine("TYPE 'help' TO INITIATE."); };
