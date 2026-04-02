/**
 * AETHER-0 // GOD_MODE_KERNEL // V4.0 ENTERPRISE
 * ARCHITECT: FAHAD MALIK (SUPER_STAR / SPYDEY)
 * ORG: WEBLOOM INC. 
 * ORIGIN: TOKYO_JPN // LOCAL_NODE: KADAYANALLUR_IND
 */

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const clock = document.getElementById('clock');
const wrapper = document.getElementById('terminal-wrapper');

// --- ENTERPRISE UI INJECTION (VERCEL/LINEAR AESTHETIC) ---
const injectEnterpriseUI = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');
        body { background-color: #0A0A0A; color: #A1A1AA; font-family: 'JetBrains Mono', monospace; margin: 0; overflow: hidden; letter-spacing: -0.5px; }
        #terminal-wrapper { width: 100vw; height: 100vh; display: flex; flex-direction: column; padding: 24px; box-sizing: border-box; background: radial-gradient(circle at 50% 0%, #171717 0%, #0A0A0A 100%); }
        #output { flex-grow: 1; overflow-y: auto; padding-bottom: 20px; scrollbar-width: none; font-size: 13px; line-height: 1.7; }
        #output::-webkit-scrollbar { display: none; }
        .line { margin-bottom: 8px; word-wrap: break-word; animation: fade-in 0.2s ease-out; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .prompt-text { color: #3B82F6; font-weight: 600; }
        .success-text { color: #10B981; }
        .accent-text { color: #EF4444; }
        .sys-text { color: #8B5CF6; }
        .muted { color: #52525B; }
        .data-key { color: #F59E0B; }
        #input-line { display: flex; align-items: center; padding-top: 16px; border-top: 1px solid #27272A; }
        #cmd-input { background: transparent; border: none; color: #E4E4E7; font-family: inherit; font-size: 13px; flex-grow: 1; outline: none; margin-left: 12px; font-weight: 600; caret-color: #3B82F6; }
        #clock { position: absolute; top: 24px; right: 24px; color: #52525B; font-size: 11px; font-weight: 600; letter-spacing: 1px; }
    `;
    document.head.appendChild(style);
};
injectEnterpriseUI();

// --- LIVE CLOCK ---
setInterval(() => { clock.innerText = new Date().toLocaleTimeString("en-IN", {timeZone: "Asia/Kolkata", hour12: false}) + " IST"; }, 1000);

// --- PYTHON WEBASSEMBLY (PYODIDE) BOOT SEQUENCE ---
let pyodideReady = false;
let pyodide = null;

async function bootPythonCore() {
    AETHER.printLine("<span class='muted'>[SYSTEM]</span> INITIALIZING WASM CPYTHON ENGINE...");
    try {
        if (typeof loadPyodide !== "undefined") {
            pyodide = await loadPyodide();
            pyodideReady = true;
            AETHER.printLine("<span class='success-text'>[OK]</span> CPYTHON ENVIRONMENT ALLOCATED.");
        } else {
            AETHER.printLine("<span class='accent-text'>[WARN]</span> PYODIDE CDN MISSING. PYTHON PROTOCOLS OFFLINE.");
        }
    } catch (err) {
        AETHER.printLine(`<span class='accent-text'>[ERROR]</span> WASM_ERR: ${err.message}`);
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
                return typeof result === 'object' ? `<span class='success-text'>${JSON.stringify(result, null, 2)}</span>` : `<span class='success-text'>${String(result)}</span>`;
            } catch (e) { return `<span class='accent-text'>[ERROR]</span> ${e.message}`; }
        },
        "py": async (code) => {
            if (!code) return "<span class='accent-text'>Usage: py [python_code]</span>";
            if (!pyodideReady) return "<span class='accent-text'>[ERROR]</span> CPYTHON KERNEL OFFLINE.";
            try {
                const pyResult = await pyodide.runPythonAsync(code);
                return typeof pyResult !== 'undefined' ? `<span style="color:#FCD34D;">${pyResult}</span>` : "<span class='success-text'>[OK]</span> SCRIPT EXECUTED.";
            } catch (err) { return `<span class='accent-text'>[TRACEBACK]</span> ${err.message}`; }
        },

        // --- 2. ENTERPRISE DEV TOOLS (NEW) ---
        "dns": async (domain) => {
            if(!domain) return "<span class='accent-text'>Usage: dns [domain.com]</span>";
            AETHER.printLine(`<span class='muted'>[NETWORK]</span> QUERYING DNS ROUTING TABLES FOR ${domain}...`);
            try {
                const res = await fetch(`https://dns.google/resolve?name=${domain}&type=ANY`);
                const data = await res.json();
                if(!data.Answer) return `<span class='accent-text'>[WARN]</span> NO DNS RECORDS FOUND FOR: ${domain}`;
                let out = `<span class='sys-text'>[ROUTING TABLE: ${domain}]</span><br>`;
                data.Answer.forEach(r => {
                    const typeMap = {1: 'A', 5: 'CNAME', 15: 'MX', 16: 'TXT', 28: 'AAAA'};
                    const typeStr = typeMap[r.type] || `TYPE_${r.type}`;
                    out += `<span class='muted'>[${typeStr.padEnd(5, ' ')}]</span> <span class='data-key'>${r.data}</span> (TTL: ${r.TTL})<br>`;
                });
                return out;
            } catch(e) { return "<span class='accent-text'>[ERROR]</span> DNS LOOKUP FAILED."; }
        },
        "hash": async (text) => {
            if(!text) return "<span class='accent-text'>Usage: hash [string]</span>";
            const msgUint8 = new TextEncoder().encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return `<span class='sys-text'>[SHA-256]</span> ${hashHex}`;
        },
        "uuid": () => {
            const id = crypto.randomUUID ? crypto.randomUUID() : 'UUID_API_NOT_SUPPORTED';
            return `<span class='sys-text'>[UUID-V4]</span> ${id}`;
        },
        "ping_web": async (url) => {
            if(!url) return "<span class='accent-text'>Usage: ping_web [https://domain.com]</span>";
            const target = url.startsWith('http') ? url : `https://${url}`;
            AETHER.printLine(`<span class='muted'>[NETWORK]</span> INITIATING TCP HANDSHAKE WITH ${target}...`);
            const start = performance.now();
            try {
                await fetch(target, { mode: 'no-cors', cache: 'no-store' });
                const end = performance.now();
                return `<span class='success-text'>[OK]</span> RESPONSE RECEIVED IN ${(end - start).toFixed(2)}ms`;
            } catch(e) {
                return `<span class='accent-text'>[ERROR]</span> CONNECTION REFUSED OR TIMED OUT.`;
            }
        },

        // --- 3. HARDWARE & OS INTERROGATION ---
        "sys_diag": async () => {
            let out = `<span class='sys-text'>[SYSTEM DIAGNOSTICS]</span><br>`;
            out += `<span class='muted'>PLATFORM :</span> <span class='data-key'>${navigator.platform}</span><br>`;
            out += `<span class='muted'>AGENT    :</span> <span class='data-key'>${navigator.userAgent}</span><br>`;
            out += `<span class='muted'>CORES    :</span> <span class='data-key'>${navigator.hardwareConcurrency || 'UNKNOWN'}</span><br>`;
            out += `<span class='muted'>MEMORY   :</span> <span class='data-key'>${navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'RESTRICTED'}</span><br>`;
            try { 
                const b = await navigator.getBattery(); 
                out += `<span class='muted'>POWER    :</span> <span class='data-key'>${(b.level*100).toFixed(0)}% (${b.charging ? 'AC_ATTACHED' : 'DISCHARGING'})</span>`; 
            } catch(e) { out += `<span class='muted'>POWER    :</span> <span class='accent-text'>ACCESS_DENIED</span>`; }
            return out;
        },

        // --- 4. NETWORK & TRACKING ---
        "locate_ip": async (ip) => {
            if (!ip) return "<span class='accent-text'>Usage: locate_ip [target_ip]</span>";
            try {
                const res = await fetch(`https://ipapi.co/${ip}/json/`);
                const data = await res.json();
                if (data.error) return `<span class='accent-text'>[ERROR]</span> TRACE_FAILED: ${data.reason}`;
                return `<span class='success-text'>[OK]</span> TARGET ACQUIRED<br><span class='muted'>IP:</span> ${data.ip}<br><span class='muted'>ISP:</span> ${data.org}<br><span class='muted'>LOC:</span> ${data.city}, ${data.country_name}`;
            } catch (err) { return `<span class='accent-text'>[ERROR]</span> NETWORK TRACE FAILED`; }
        },

        // --- 5. OMNISCIENCE (NETWORK MAPPING) ---
        "net_map": async () => {
            AETHER.printLine("<span class='muted'>[NETWORK]</span> INITIATING SUBNET DISCOVERY [10.17.149.1 - 254]...");
            const subnet = "10.17.149";
            let found = 0;
            const container = document.createElement('div');
            container.style.borderLeft = "2px solid #3B82F6";
            container.style.paddingLeft = "12px";
            container.style.margin = "12px 0";
            output.appendChild(container);

            for (let i = 60; i < 75; i++) {
                const ip = `${subnet}.${i}`;
                const img = new Image();
                img.onload = () => {
                    container.innerHTML += `<div class='success-text'>[ALIVE] ${ip}</div>`;
                    found++;
                };
                img.onerror = () => { };
                img.src = `http://${ip}/favicon.ico?${Date.now()}`;
            }
            setTimeout(() => { if(found === 0) container.innerHTML += "<span class='muted'>[INFO] NO UNPROTECTED NODES DISCOVERED.</span>"; }, 3000);
            return "<span class='muted'>[SYSTEM]</span> SCAN BACKGROUNDED.";
        },
        "sat_view": (coords) => {
            const loc = coords || "Kadayanallur,India";
            AETHER.printLine("<span class='muted'>[UPLINK]</span> INITIATING SECURE DETACHED OPTICS...");
            const targetUrl = `https://www.google.com/maps/search/${encodeURIComponent(loc)}/data=!3m1!1e3`;
            const newWindow = window.open(targetUrl, '_blank');
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                return `<span class='accent-text'>[ERROR]</span> POPUP_BLOCKER DETECTED. OVERRIDE REQUIRED.`;
            }
            return `<span class='success-text'>[OK]</span> SATELLITE OPTICS ENGAGED FOR: <span class='data-key'>${loc}</span>`;
        },

        // --- 6. SYSTEM CORE ---
        "whoami": () => "<span class='sys-text'>[IDENTITY]</span> FAHAD MALIK<br><span class='muted'>[ALIAS]</span> SUPER_STAR / SPYDEY<br><span class='muted'>[ORG]</span> WEBLOOM INC. / VULCAN PROTOCOL<br><span class='muted'>[ORIGIN]</span> TOKYO_JPN <br><span class='muted'>[NODE]</span> KADAYANALLUR_IND",
        "clear": () => { output.innerHTML = ""; return ""; },
        "help": () => {
            return `<span class='sys-text'>AETHER-0 // MAINFRAME PROTOCOLS:</span><br><br>` +
                   `<span class='muted'>[SYSTEM]</span>  clear, whoami, sys_diag, exec, py<br>` +
                   `<span class='muted'>[NETWORK]</span> locate_ip, net_map, ping_web, dns<br>` +
                   `<span class='muted'>[DEV_OPS]</span> hash, uuid<br>` +
                   `<span class='muted'>[INTEL]</span>   sat_view<br><br>` +
                   `<span class='muted'>* Legacy toy protocols have been archived.</span>`;
        },

        // --- 7. LEGACY ARCHIVE (HIDDEN FROM HELP) ---
        "funny": () => { return "<span class='accent-text'>[RESTRICTED]</span> PROTOCOL ARCHIVED BY ORG POLICY."; },
        "domain_expansion": () => { return "<span class='accent-text'>[RESTRICTED]</span> PROTOCOL ARCHIVED BY ORG POLICY."; }
    },

    async execute(rawInput) {
        if (!rawInput.trim()) return;

        this.history.push(rawInput);
        this.historyIndex = this.history.length;

        const parts = rawInput.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ");

        this.printLine(`<span class="prompt-text">SUPER_STAR@AETHER-0:~$</span> <span style="color:#E4E4E7">${rawInput}</span>`);

        if (this.registry[cmd]) {
            try {
                const result = await this.registry[cmd](args);
                if (result) this.printLine(result);
            } catch (err) {
                this.printLine(`<span class='accent-text'>[FATAL ERROR]</span> ${err.message}`);
            }
        } else {
            this.printLine(`<span class='accent-text'>[ERROR]</span> COMMAND NOT RECOGNIZED: '${cmd}'`);
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

// --- INPUT HANDLERS ---
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
    AETHER.printLine("<span class='sys-text'>AETHER-0 // WEBLOOM ENTERPRISE MAINFRAME [v4.0]</span>");
    AETHER.printLine("<span class='muted'>SECURE CONNECTION ESTABLISHED. ALL PROTOCOLS ONLINE.</span>");
    AETHER.printLine("<span class='muted'>TYPE 'help' TO VIEW AVAILABLE DIRECTIVES.</span>");
};
