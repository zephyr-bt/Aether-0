/**
 * AETHER-0 // GOD_MODE_KERNEL // V4.1 ULTIMATE MAINFRAME
 * ARCHITECT: FAHAD MALIK (SUPER_STAR / SPYDEY)
 * ORG: WEBLOOM INC. 
 * ORIGIN: TOKYO_JPN // LOCAL_NODE: KADAYANALLUR_IND
 */

// --- MAINFRAME UI OVERRIDE (FORCED INJECTION) ---
const injectMainframeUI = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        body, html { 
            margin: 0 !important; padding: 0 !important; 
            background-color: #030303 !important; 
            color: #00ffcc !important; 
            font-family: 'Share Tech Mono', monospace !important; 
            height: 100vh !important; overflow: hidden !important; 
        }
        #terminal-wrapper { 
            height: 100vh !important; width: 100vw !important; 
            padding: 15px !important; box-sizing: border-box !important; 
            display: flex !important; flex-direction: column !important; 
            position: relative; 
            border: 2px solid #0044aa !important; 
            box-shadow: inset 0 0 30px rgba(0, 68, 170, 0.5) !important;
            background: radial-gradient(circle at center, #050505 0%, #000000 100%) !important;
        }
        /* CRT Scanlines Overlay */
        #terminal-wrapper::after { 
            content: ""; position: absolute; top: 0; left: 0; 
            width: 100%; height: 100%; 
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%); 
            background-size: 100% 4px; z-index: 100; pointer-events: none; 
        }
        #output { 
            flex-grow: 1 !important; overflow-y: auto !important; 
            text-shadow: 0 0 4px #00ffcc !important; 
            font-size: 14px !important; letter-spacing: 0.5px !important; 
            padding-bottom: 20px !important; z-index: 10; line-height: 1.6 !important;
        }
        #output::-webkit-scrollbar { width: 4px; }
        #output::-webkit-scrollbar-thumb { background: #0044aa; }
        #input-line { 
            display: flex !important; align-items: center !important; 
            border-top: 1px solid #0044aa !important; padding-top: 10px !important; 
            z-index: 10; 
        }
        .prompt-text { 
            color: #ff003c !important; text-shadow: 0 0 6px #ff003c !important; 
            margin-right: 8px !important; font-weight: bold !important; white-space: nowrap !important;
        }
        #cmd-input { 
            background: transparent !important; border: none !important; 
            color: #ffffff !important; font-family: inherit !important; 
            font-size: 15px !important; flex-grow: 1 !important; outline: none !important; 
            text-shadow: 0 0 5px #ffffff !important; caret-color: #ff003c !important;
            margin: 0 !important; padding: 0 !important;
        }
        .success-text { color: #00ff00 !important; text-shadow: 0 0 5px #00ff00 !important; }
        .accent-text { color: #ff0000 !important; text-shadow: 0 0 5px #ff0000 !important; }
        .sys-text { color: #0088ff !important; text-shadow: 0 0 5px #0088ff !important; }
        .muted { color: #447777 !important; }
        #clock { position: absolute; top: 15px; right: 15px; z-index: 10; color: #447777; font-size: 12px; }
    `;
    document.head.appendChild(style);
};
injectMainframeUI();

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const clock = document.getElementById('clock');
const wrapper = document.getElementById('terminal-wrapper');

// --- LIVE CLOCK ---
if(clock) { setInterval(() => { clock.innerText = new Date().toLocaleTimeString("en-IN", {timeZone: "Asia/Kolkata"}); }, 1000); }

// --- PYTHON WEBASSEMBLY (PYODIDE) BOOT SEQUENCE ---
let pyodideReady = false;
let pyodide = null;

async function bootPythonCore() {
    AETHER.printLine("<span class='muted'>[SYSTEM]</span> ALLOCATING WASM PYTHON THREADS...");
    try {
        if (typeof loadPyodide !== "undefined") {
            pyodide = await loadPyodide();
            pyodideReady = true;
            AETHER.printLine("<span class='success-text'>[OK] CPYTHON ENGINE MOUNTED.</span>");
        } else {
            AETHER.printLine("<span class='accent-text'>[WARN] PYODIDE CDN OFFLINE.</span>");
        }
    } catch (err) {
        AETHER.printLine(`<span class='accent-text'>[ERR] WASM_FAULT: ${err.message}</span>`);
    }
}
setTimeout(bootPythonCore, 500);

// --- GLOBAL MEMORY ---
window.bleDevice = null;
window.bleServer = null;

const AETHER = {
    history: [],
    historyIndex: -1,

    registry: {
        // --- 1. CORE ENGINES ---
        "exec": async (code) => {
            if (!code) return "<span class='accent-text'>Usage: exec [javascript]</span>";
            try { 
                const result = await eval(`(async () => { return ${code} })()`); 
                return typeof result === 'object' ? `<span class='success-text'>${JSON.stringify(result)}</span>` : `<span class='success-text'>${String(result)}</span>`;
            } catch (e) { return `<span class='accent-text'>[ERR] ${e.message}</span>`; }
        },
        "py": async (code) => {
            if (!code) return "<span class='accent-text'>Usage: py [python_code]</span>";
            if (!pyodideReady) return "<span class='accent-text'>[ERR] KERNEL BOOTING</span>";
            try {
                const pyResult = await pyodide.runPythonAsync(code);
                return typeof pyResult !== 'undefined' ? `<span style="color:#FCD34D;">${pyResult}</span>` : "<span class='success-text'>[OK] EXECUTED.</span>";
            } catch (err) { return `<span class='accent-text'>[TRACE] ${err.message}</span>`; }
        },

        // --- 2. MAINFRAME DEV TOOLS ---
        "dns": async (domain) => {
            if(!domain) return "<span class='accent-text'>Usage: dns [domain.com]</span>";
            AETHER.printLine(`<span class='muted'>[NET]</span> QUERYING ROOT SERVERS FOR ${domain}...`);
            try {
                const res = await fetch(`https://dns.google/resolve?name=${domain}&type=ANY`);
                const data = await res.json();
                if(!data.Answer) return `<span class='accent-text'>[WARN] NO RECORDS</span>`;
                let out = `<span class='sys-text'>[ROUTING TABLE]</span><br>`;
                data.Answer.forEach(r => {
                    const typeMap = {1: 'A', 5: 'CNAME', 15: 'MX', 16: 'TXT', 28: 'AAAA'};
                    out += `<span class='muted'>[${(typeMap[r.type] || 'TYP').padEnd(5)}]</span> ${r.data}<br>`;
                });
                return out;
            } catch(e) { return "<span class='accent-text'>[ERR] DNS LOOKUP FAILED.</span>"; }
        },
        "hash": async (text) => {
            if(!text) return "<span class='accent-text'>Usage: hash [string]</span>";
            const msgUint8 = new TextEncoder().encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
            return `<span class='sys-text'>[SHA-256]</span> ${hashHex}`;
        },
        "uuid": () => `<span class='sys-text'>[UUID-V4]</span> ${crypto.randomUUID ? crypto.randomUUID() : 'NOT_SUPPORTED'}`,
        "ping_web": async (url) => {
            if(!url) return "<span class='accent-text'>Usage: ping_web [domain.com]</span>";
            const target = url.startsWith('http') ? url : `https://${url}`;
            const start = performance.now();
            try {
                await fetch(target, { mode: 'no-cors', cache: 'no-store' });
                return `<span class='success-text'>[OK] LATTENCY: ${(performance.now() - start).toFixed(2)}ms</span>`;
            } catch(e) { return `<span class='accent-text'>[ERR] CONNECTION TIMEOUT.</span>`; }
        },
        "sys_diag": async () => {
            let out = `<span class='sys-text'>[HARDWARE DIAGNOSTICS]</span><br>`;
            out += `PLATFORM : ${navigator.platform}<br>CORES    : ${navigator.hardwareConcurrency || 'UNKNOWN'}<br>RAM      : ${navigator.deviceMemory ? navigator.deviceMemory + 'GB' : 'DENIED'}<br>`;
            try { const b = await navigator.getBattery(); out += `POWER    : ${(b.level*100).toFixed(0)}%`; } catch(e) { out += `POWER    : DENIED`; }
            return out;
        },

        // --- 3. LAN EXPLOITS ---
        "sony_power": async (args) => {
            const parts = args.split(" "); if (parts.length < 2) return "<span class='accent-text'>Usage: sony_power [ip] [psk]</span>";
            try { await fetch(`http://${parts[0]}/sony/IRCC`, { method: 'POST', headers: { 'X-Auth-PSK': parts[1], 'Content-Type': 'text/xml' }, body: `<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1"><IRCCCode>AAAAAQAAAAEAAAAVAw==</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>`}); return `<span class='success-text'>[+] POWER TOGGLED.</span>`; } catch(e) { return `<span class='accent-text'>[!] SONY_ERR</span>`; }
        },
        "tv_power": async (ip) => {
            if (!ip) return "<span class='accent-text'>Usage: tv_power [ip]</span>";
            try { await fetch(`http://${ip}:8060/keypress/Power`, { method: 'POST', mode: 'no-cors' }); return `<span class='success-text'>[+] LAN PAYLOAD DELIVERED.</span>`; } catch(e) { return `<span class='accent-text'>[!] LAN_ERR</span>`; }
        },

        // --- 4. BLUETOOTH ---
        "bt_scan": async () => {
            try { window.bleDevice = await navigator.bluetooth.requestDevice({ acceptAllDevices: true }); return `<span class='success-text'>[+] TARGET LOCKED: ${window.bleDevice.name}</span>`; } catch(e) { return `<span class='accent-text'>[!] BT_ERR</span>`; }
        },
        "bt_connect": async () => {
            if (!window.bleDevice) return "<span class='accent-text'>NO TARGET LOCKED.</span>";
            try { window.bleServer = await window.bleDevice.gatt.connect(); return `<span class='success-text'>[+] GATT ESTABLISHED.</span>`; } catch(e) { return `<span class='accent-text'>[!] GATT_ERR</span>`; }
        },
        "bt_disconnect": () => { if (window.bleDevice && window.bleDevice.gatt.connected) { window.bleDevice.gatt.disconnect(); return "[-] SEVERED."; } return "NOT CONNECTED."; },

        // --- 5. DOM DESTRUCTION WEAPONS ---
        "edit_web": () => { document.designMode = "on"; return "[+] DOM UNLOCKED."; },
        "lock_web": () => { document.designMode = "off"; return "[-] DOM LOCKED."; },
        "barrel_roll": () => { wrapper.style.transition = "transform 2s"; wrapper.style.transform = "rotate(360deg)"; setTimeout(()=>wrapper.style.transform="", 2000); return "EXECUTING."; },
        "earthquake": () => { let i=0; const iv = setInterval(()=>{ wrapper.style.transform = `translate(${Math.random()*20-10}px, ${Math.random()*20-10}px)`; i++; if(i>20){clearInterval(iv); wrapper.style.transform="";}}, 50); return "SEISMIC ANOMALY."; },
        "invert": () => { document.body.style.filter = document.body.style.filter === "invert(1)" ? "" : "invert(1)"; return "POLARITY TOGGLED."; },
        "disco": () => { window.discoIv = setInterval(()=> document.body.style.filter = `hue-rotate(${Math.random()*360}deg)`, 100); return "RAVE ACTIVE."; },
        "stop_disco": () => { clearInterval(window.discoIv); document.body.style.filter = ""; return "RAVE HALTED."; },

        // --- 6. API HEISTS ---
        "iss_loc": async () => { const r = await fetch("http://api.open-notify.org/iss-now.json"); const d = await r.json(); return `🛰️ ISS: LAT ${d.iss_position.latitude}, LON ${d.iss_position.longitude}`; },
        "crypto_btc": async () => { const r = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json"); const d = await r.json(); return `🪙 BTC: $${d.bpi.USD.rate}`; },
        "pokemon": async (name) => { try { const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${name||'rayquaza'}`); const d = await r.json(); return `🐉 EVO: ${d.name.toUpperCase()} | TYP: ${d.types[0].type.name} | HP: ${d.stats[0].base_stat}`; } catch(e){ return "<span class='accent-text'>NOT_FOUND</span>"; } },

        // --- 7. OSINT & NETWORK SURVEILLANCE ---
        "locate_ip": async (ip) => {
            if (!ip) return "<span class='accent-text'>Usage: locate_ip [ip]</span>";
            try { const res = await fetch(`https://ipapi.co/${ip}/json/`); const data = await res.json(); return `<span class='success-text'>[+] TARGET ACQUIRED</span><br>IP: ${data.ip}<br>CITY: ${data.city}<br>ORG: ${data.org}`; } catch (err) { return `<span class='accent-text'>[!] NETWORK_ERR</span>`; }
        },
        "trace_no": async (phone) => {
            if (!phone) return "<span class='accent-text'>Usage: trace_no [+CodeNumber]</span>";
            AETHER.printLine(`[>] PINGING SS7 BACKBONE FOR ${phone}...`);
            try { await new Promise(r => setTimeout(r, 1500)); return `<span class='success-text'>[+] OSINT COMPLETE.</span><br>REGION DETECTED. EXACT COORDINATES FIREWALLED.`; } catch(e) { return "ERR"; }
        },
        "net_map": async () => {
            AETHER.printLine("<span class='muted'>[NET]</span> SUBNET SWEEP [10.17.149.x]...");
            let container = document.createElement('div'); output.appendChild(container);
            for (let i = 60; i < 75; i++) { const img = new Image(); img.onload = () => container.innerHTML += `<div class='success-text'>[ALIVE] 10.17.149.${i}</div>`; img.onerror = () => {}; img.src = `http://10.17.149.${i}/favicon.ico?${Date.now()}`; }
            return "SCAN BACKGROUNDED.";
        },
        "flight_tap": async () => {
            AETHER.printLine("<span class='muted'>[NET]</span> INTERCEPTING ADS-B DATA...");
            try { const res = await fetch("https://opensky-network.org/api/states/all"); const data = await res.json(); let out = "<span class='success-text'>[+] AIRSPACE DATA:</span><br>"; data.states.slice(0, 3).forEach(f => { out += `CALLSIGN: ${f[1] || 'N/A'} | ALT: ${Math.round(f[7]||0)}m<br>`; }); return out; } catch(e) { return "<span class='accent-text'>[!] API_THROTTLED</span>"; }
        },
        "sat_view": (coords) => {
            const loc = coords || "Kadayanallur,India";
            window.open(`https://www.google.com/maps/search/${encodeURIComponent(loc)}/data=!3m1!1e3`, '_blank');
            return `<span class='success-text'>[+] DETACHED SATELLITE OPTICS ENGAGED FOR: ${loc}</span>`;
        },
        "notify": async (args) => {
            const parts = args.split(" "); if(parts.length < 2) return "Usage: notify [topic] [msg]";
            try { await fetch(`https://ntfy.sh/${parts[0]}`, { method: 'POST', body: parts.slice(1).join(" ") }); return `<span class='success-text'>[+] PUSH SENT TO /${parts[0]}</span>`; } catch(e) { return `<span class='accent-text'>[!] ERR</span>`; }
        },

        // --- 8. SYSTEM ALIASES ---
        "whoami": () => "<span class='sys-text'>[ID]</span> FAHAD MALIK (SPYDEY) <br><span class='sys-text'>[ORG]</span> WEBLOOM INC. <br><span class='sys-text'>[NODE]</span> KADAYANALLUR_IND",
        "clear": () => { output.innerHTML = ""; return ""; },
        
        // --- 9. WEAPONIZED PAYLOADS (THE FUN STUFF) ---
        "funny": () => {
            if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
            try { const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator();o.type='square';setInterval(()=>{o.frequency.setValueAtTime(800,a.currentTime);o.frequency.setValueAtTime(1200,a.currentTime+0.2);},400);o.connect(a.destination);o.start();setTimeout(()=>o.stop(),5000); } catch(e){}
            const s=document.createElement('style');s.innerHTML=`@keyframes shake{0%{transform:translate(2px,1px)}50%{transform:translate(-2px,-2px)}100%{transform:translate(2px,2px)}}.hack{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#000;z-index:99999;animation:shake 0.2s infinite;padding:20px;color:red;font-family:monospace;}`;document.head.appendChild(s);
            document.body.innerHTML=`<div class='hack'><h1 style='border:5px solid red;text-align:center;'>CRITICAL SYSTEM COMPROMISE</h1><div id='log'></div></div>`;
            setInterval(()=>{document.getElementById('log').innerHTML+=`[0x${Math.floor(Math.random()*16777215).toString(16)}] EXFILTRATING DATA...<br>`;},50);
            if("vibrate" in navigator)navigator.vibrate([100,50,200,50,300]); return "";
        },
        "domain_expansion": () => {
            document.body.style.overflow = "hidden";
            const s=document.createElement('style');s.innerHTML=`@keyframes f{0%{background:white;opacity:1}100%{background:transparent;opacity:0}}@keyframes sp{0%{transform:translate(-50%,-50%) scale(0)}100%{transform:translate(-50%,-50%) scale(100);background:black}}.fl{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;animation:f 0.8s forwards;}.sp{position:fixed;top:50%;left:50%;width:10px;height:10px;background:#00ffcc;border-radius:50%;z-index:99998;animation:sp 1s forwards;}`;document.head.appendChild(s);
            document.body.innerHTML=`<div class='fl'></div><div class='sp'></div><h1 style='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:white;z-index:100000;font-family:monospace;text-shadow:0 0 20px #00ffcc;'>無量空処<br>INFINITE VOID</h1>`;
            return "";
        },
        "system_link": () => {
            if(document.getElementById('solo-hud')) return "<span class='accent-text'>ALREADY ACTIVE.</span>";
            const h = document.createElement('div'); h.id = 'solo-hud';
            h.style = "border:2px solid #00ffcc;background:rgba(0,10,20,0.9);box-shadow:0 0 15px rgba(0,255,204,0.4);color:#00ffcc;font-family:monospace;padding:15px;width:250px;position:fixed;top:20px;right:20px;z-index:9999;border-radius:5px;";
            h.innerHTML = `<h3 style='margin:0 0 10px 0;text-align:center;border-bottom:1px solid #00ffcc;padding-bottom:5px;'>STATUS WINDOW</h3><p style='margin:5px 0'><b>NAME:</b> SPYDEY</p><p style='margin:5px 0'><b>CLASS:</b> ARCHITECT</p><p style='margin:5px 0'><b>LVL:</b> 99</p><div style='margin-top:10px'>HP: <div style='display:inline-block;width:75%;background:#111;height:10px;'><div style='width:100%;background:#00ffcc;height:100%;box-shadow:0 0 5px #00ffcc'></div></div></div><div style='margin-top:5px;color:#ff0055'>MP: <div style='display:inline-block;width:75%;background:#111;height:10px;'><div style='width:100%;background:#ff0055;height:100%;box-shadow:0 0 5px #ff0055'></div></div></div>`;
            document.body.appendChild(h); return "<span class='success-text'>[+] SYSTEM AWAKENED.</span>";
        },
        "system_unlink": () => { const h = document.getElementById('solo-hud'); if(h){h.remove();return "[-] UNLINKED.";} return "NOT ACTIVE."; },
        
        "help": () => {
            return `<span class='sys-text'>AETHER-0 // COMMAND INDEX:</span><br><br>` +
                   `<span class='sys-text'>[CORE]</span>     exec, py, clear, whoami, sys_diag<br>` +
                   `<span class='sys-text'>[DEV]</span>      dns, hash, uuid, ping_web<br>` +
                   `<span class='sys-text'>[NET]</span>      net_map, locate_ip, flight_tap, sat_view, notify<br>` +
                   `<span class='sys-text'>[LAN/BT]</span>   sony_power, tv_power, bt_scan, bt_connect, bt_disconnect<br>` +
                   `<span class='sys-text'>[DOM/GFX]</span>  edit_web, lock_web, barrel_roll, earthquake, invert, disco, stop_disco<br>` +
                   `<span class='sys-text'>[DATA]</span>     iss_loc, crypto_btc, pokemon<br>` +
                   `<span class='sys-text'>[WEAPON]</span>   funny, domain_expansion, system_link, system_unlink`;
        }
    },

    async execute(rawInput) {
        if (!rawInput.trim()) return;

        this.history.push(rawInput);
        this.historyIndex = this.history.length;

        const parts = rawInput.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ");

        this.printLine(`<span class="prompt-text">ROOT@AETHER-0:~$</span> <span style="color:#fff">${rawInput}</span>`);

        if (this.registry[cmd]) {
            try {
                const result = await this.registry[cmd](args);
                if (result) this.printLine(result);
            } catch (err) {
                this.printLine(`<span class='accent-text'>[FATAL ERROR]</span> ${err.message}`);
            }
        } else {
            this.printLine(`<span class='accent-text'>[!] UNKNOWN_PROTOCOL: '${cmd}'</span>`);
        }
    },

    printLine(text) {
        const line = document.createElement('div');
        line.className = 'line';
        line.style.marginBottom = "8px";
        line.innerHTML = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }
};

// --- INPUT HANDLERS ---
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault(); AETHER.execute(input.value); input.value = "";
    } else if (e.key === 'ArrowUp') {
        e.preventDefault(); if (AETHER.historyIndex > 0) { AETHER.historyIndex--; input.value = AETHER.history[AETHER.historyIndex]; }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault(); if (AETHER.historyIndex < AETHER.history.length - 1) { AETHER.historyIndex++; input.value = AETHER.history[AETHER.historyIndex]; } else { AETHER.historyIndex = AETHER.history.length; input.value = ""; }
    }
});

input.addEventListener('search', () => { if (input.value.trim() !== "") { AETHER.execute(input.value); input.value = ""; } });
document.addEventListener('click', () => input.focus());

// --- BOOT SEQUENCE ---
window.onload = () => {
    AETHER.printLine("<span class='sys-text' style='font-size: 1.2em; font-weight: bold;'>AETHER-0 // GOD_MODE MAINFRAME [v4.1]</span>");
    AETHER.printLine("<span class='success-text'>[SECURITY OVERRIDE ACCEPTED. ALL PROTOCOLS UNLOCKED.]</span>");
    AETHER.printLine("TYPE <span class='data-key'>'help'</span> TO VIEW THE ARSENAL.");
};
