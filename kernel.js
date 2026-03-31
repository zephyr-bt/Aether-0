/**
 * AETHER-0 // UNIVERSAL_OVERRIDE_KERNEL
 * UI_MODE: MODERN_GLASSMORPHISM
 * CODENAME: FOX
 */

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const body = document.body;
const headerTime = document.getElementById('header-time'); // Add <div id="header-time"></div> to your HTML header

const AETHER_KERNEL = {
    state: {
        mode: 'CYBER',
        fs_handle: null,
        history: [],
        historyIndex: -1
    },

    registry: {
        // --- SYSTEM CORE ---
        "help": () => "PROTOCOLS: " + Object.keys(AETHER_KERNEL.registry).join(", "),
        "clear": () => { output.innerHTML = ""; return ""; },
        "whoami": () => "ID: FAHAD_MALIK | ALIAS: SUPER_STAR | ORG: WebLooM Inc. (Websites Only)",
        "reboot": () => { setTimeout(() => location.reload(), 1000); return "INITIATING_COLD_BOOT..."; },
        "date": () => new Date().toLocaleString(),
        "status": () => "AETHER-0 STABLE | UPLINK: SECURE | UI: GLASSMORPHISM",
        
        // --- VISUAL OVERRIDES ---
        "matrix": () => { body.className = 'matrix-mode'; return "MATRIX_GREEN_OVERLAY_ACTIVE."; },
        "hunter": () => { body.className = 'hunter-mode'; return "HUNTER_RED_PROTOCOL_ENGAGED."; },
        "cyber": () => { body.className = ''; return "CYBER_CYAN_DEFAULT_RESTORED."; },
        "glitch": () => { 
            document.getElementById('terminal-container').classList.add('glitch-active'); 
            setTimeout(() => document.getElementById('terminal-container').classList.remove('glitch-active'), 600); 
            return "ARTIFICIAL_CORRUPTION_INJECTED."; 
        },

        // --- THE CREATOR PROTOCOL (Custom Scripts) ---
        "create": (args) => {
            if(!args.includes(" ")) return "ERR: SYNTAX IS 'create [name] [return_string]'";
            const newName = args.split(" ")[0];
            const logic = args.substring(newName.length).trim();
            
            const customCmds = JSON.parse(localStorage.getItem('AETHER_CUSTOM') || '{}');
            customCmds[newName] = logic;
            localStorage.setItem('AETHER_CUSTOM', JSON.stringify(customCmds));
            
            AETHER_KERNEL.registry[newName] = () => logic;
            return `[+] PROTOCOL_${newName.toUpperCase()} COMPILED AND SAVED TO LOCAL STORAGE.`;
        },
        "scripts": () => {
            const custom = JSON.parse(localStorage.getItem('AETHER_CUSTOM') || '{}');
            const keys = Object.keys(custom);
            return keys.length ? "CUSTOM_PROTOCOLS: " + keys.join(", ") : "NO_CUSTOM_SCRIPTS_FOUND.";
        },
        "rm_script": (args) => {
            const customCmds = JSON.parse(localStorage.getItem('AETHER_CUSTOM') || '{}');
            if(customCmds[args]) {
                delete customCmds[args];
                delete AETHER_KERNEL.registry[args];
                localStorage.setItem('AETHER_CUSTOM', JSON.stringify(customCmds));
                return `[-] PROTOCOL_${args.toUpperCase()} PURGED.`;
            }
            return "ERR: SCRIPT_NOT_FOUND.";
        },

        // --- REAL-WORLD NETWORK & DATA ---
        "ip": async () => { 
            try { const r = await fetch('https://api.ipify.org?format=json'); const d = await r.json(); return `PUBLIC_IP: ${d.ip}`; } 
            catch { return "ERR: UPLINK_FAILED"; } 
        },
        "crypto": async () => {
            try {
                const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
                const d = await r.json();
                return `BTC: $${d.bitcoin.usd} | ETH: $${d.ethereum.usd}`;
            } catch { return "ERR: MARKET_API_UNREACHABLE"; }
        },
        "tokyo_time": () => new Date().toLocaleTimeString("ja-JP", {timeZone: "Asia/Tokyo"}) + " JST",
        "battery": async () => {
            if(navigator.getBattery) {
                const b = await navigator.getBattery();
                return `POWER: ${Math.round(b.level * 100)}% | CHARGING: ${b.charging}`;
            }
            return "HARDWARE_ACCESS_DENIED.";
        },
        
        // --- LOCAL FILE ACCESS (Requires Chrome/Edge) ---
        "mount": async () => { 
            try {
                AETHER_KERNEL.state.fs_handle = await window.showDirectoryPicker(); 
                return `SECURE_VOLUME_MOUNTED: ${AETHER_KERNEL.state.fs_handle.name}`;
            } catch { return "MOUNT_ABORTED."; }
        },
        "ls": async () => {
            if (!AETHER_KERNEL.state.fs_handle) return "ERR: NO_VOLUME_MOUNTED. RUN 'mount' FIRST.";
            let files = [];
            for await (const entry of AETHER_KERNEL.state.fs_handle.values()) {
                files.push(entry.kind === 'directory' ? `[DIR]  ${entry.name}` : `[FILE] ${entry.name}`);
            }
            return files.join("<br>");
        },

        // --- CRYPTO / TOOLS ---
        "encode": (str) => btoa(str),
        "decode": (str) => atob(str),
        "uuid": () => self.crypto.randomUUID(),
        "ai_query": (args) => `SENDING '${args}' TO GEMINI_FOX_BRIDGE... [AWAITING API HOOK]`
    },

    // Load custom scripts on boot
    initCustomScripts() {
        const custom = JSON.parse(localStorage.getItem('AETHER_CUSTOM') || '{}');
        for (const [key, value] of Object.entries(custom)) {
            this.registry[key] = () => value;
        }
    },

    async execute(rawInput) {
        if (!rawInput.trim()) return;
        
        // History Management
        this.state.history.push(rawInput);
        this.state.historyIndex = this.state.history.length;

        const parts = rawInput.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ");

        this.printLine(`<span class="prompt">ROOT@AETHER0:~$</span> ${rawInput}`);

        if (this.registry[cmd]) {
            try {
                const result = await this.registry[cmd](args);
                if (result) this.printLine(result);
            } catch (err) {
                this.printLine(`[!] KERNEL_PANIC: ${err.message}`);
            }
        } else {
            this.printLine(`[!] UNKNOWN_PROTOCOL: '${cmd}'. TYPE 'help' OR 'create' A NEW ONE.`);
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

// Input Handling & Arrow Key History
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const val = input.value;
        input.value = "";
        await AETHER_KERNEL.execute(val);
    } else if (e.key === 'ArrowUp') {
        if (AETHER_KERNEL.state.historyIndex > 0) {
            AETHER_KERNEL.state.historyIndex--;
            input.value = AETHER_KERNEL.state.history[AETHER_KERNEL.state.historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        if (AETHER_KERNEL.state.historyIndex < AETHER_KERNEL.state.history.length - 1) {
            AETHER_KERNEL.state.historyIndex++;
            input.value = AETHER_KERNEL.state.history[AETHER_KERNEL.state.historyIndex];
        } else {
            AETHER_KERNEL.state.historyIndex = AETHER_KERNEL.state.history.length;
            input.value = "";
        }
    }
});

// Live Clock in Header (if HTML is updated)
if(headerTime) {
    setInterval(() => { headerTime.innerText = new Date().toLocaleTimeString("ja-JP"); }, 1000);
}

// Boot Sequence
window.onload = () => {
    AETHER_KERNEL.initCustomScripts();
    setTimeout(() => AETHER_KERNEL.printLine("AETHER-0 KERNEL [Version 2.0-GLASS]"), 200);
    setTimeout(() => AETHER_KERNEL.printLine("LOCATION: TOKYO_JPN // STATUS: SECURE"), 500);
    setTimeout(() => AETHER_KERNEL.printLine("WELCOME BACK, SUPER STAR."), 800);
};
