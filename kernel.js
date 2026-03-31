/**
 * AETHER-0 // FOX_ENGINE
 * UI_MODE: MODERN_GLASSMORPHISM
 * ARCHITECT: SUPER_STAR // WebLooM Inc. (Websites Only)
 * STATUS: LIVE_API_BRIDGE_ACTIVE
 */

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');

// --- REAL EXTERNAL UPLINKS ---
// Add your Google Cloud API Key for YouTube Data API v3
const YOUTUBE_API_KEY = "YOUR_REAL_YOUTUBE_API_KEY_HERE"; 
// Add your Discord server webhook URL
const DISCORD_WEBHOOK = "YOUR_REAL_DISCORD_WEBHOOK_URL_HERE";

const AETHER_KERNEL = {
    state: { history: [], historyIndex: -1 },

    registry: {
        // --- 1. RAW HTTP PUSH NOTIFICATION (Ntfy.sh) ---
        "notify": async (args) => {
            const parts = args.split(" ");
            if (parts.length < 2) return "ERR: SYNTAX IS 'notify [secret_topic] [message]'";
            
            const topic = parts[0]; 
            const msg = parts.slice(1).join(" ");
            
            AETHER_KERNEL.printLine(`[>] BROADCASTING RAW PUSH TO /${topic}...`);

            try {
                const res = await fetch(`https://ntfy.sh/${topic}`, {
                    method: 'POST',
                    body: msg,
                    headers: {
                        'Title': 'AETHER-0 TERMINAL',
                        'Tags': 'satellite',
                        'Priority': 'default'
                    }
                });

                if (res.ok) return `<span style="color:var(--cyan)">[+] PUSH_DELIVERED: Signal received by target OS.</span>`;
                return `[!] PUSH_FAILED: HTTP ${res.status}`;
            } catch (err) { return `[!] NETWORK_ERR: ${err.message}`; }
        },

        // --- 2. FORTRESS PROTOCOL (MAX PRIORITY NATIVE ALARM) ---
        "fortress": async (topic) => {
            if (!topic) return "ERR: SECURE_TOPIC_REQUIRED. Usage: fortress [secret_topic]";
            
            AETHER_KERNEL.printLine(`<span style="color:var(--accent)">[!] INITIATING FORTRESS PROTOCOL ON CHANNEL /${topic}</span>`);
            const alertMsg = "SYSTEM COMPROMISE DETECTED.\n• Do NOT click unknown links.\n• Verify HTTPS.\n• Disconnect from public Wi-Fi.";

            try {
                const res = await fetch(`https://ntfy.sh/${topic}`, {
                    method: 'POST',
                    body: alertMsg,
                    headers: {
                        'Title': '🚨 FORTRESS PROTOCOL ENGAGED 🚨',
                        'Tags': 'rotating_light,skull',
                        'Priority': '5', // Max priority bypasses silent mode
                        'Warning': 'yes'
                    }
                });

                if (res.ok) return `<span style="color:var(--accent)">[+] FORTRESS_ACTIVE: Max-priority alarm triggered on target device.</span>`;
                return `[!] FORTRESS_FAILED: Payload rejected.`;
            } catch (err) { return `[!] NETWORK_ERR: ${err.message}`; }
        },

        // --- 3. LIVE IP GEOLOCATION ---
        "locate_ip": async (ip) => {
            if (!ip) return "ERR: TARGET_IP_REQUIRED. Usage: locate_ip [ip_address]";
            AETHER_KERNEL.printLine(`[>] TRACING ROUTE TO ${ip}...`);
            try {
                const res = await fetch(`https://ipapi.co/${ip}/json/`);
                const data = await res.json();
                if (data.error) return `[!] TRACE_FAILED: ${data.reason}`;
                
                return `<span style="color:var(--cyan)">[+] TARGET ACQUIRED</span><br>IP: ${data.ip}<br>ORG/ISP: ${data.org}<br>CITY: ${data.city}, ${data.region}<br>COUNTRY: ${data.country_name}<br>COORDINATES: ${data.latitude}, ${data.longitude}`;
            } catch (err) { return `[!] NETWORK_ERR: ${err.message}`; }
        },

        // --- 4. REAL YOUTUBE METADATA EXTRACTOR ---
        "locate_media": async (videoId) => {
            if (!videoId) return "ERR: VIDEO_ID_REQUIRED. Usage: locate_media [youtube_video_id]";
            AETHER_KERNEL.printLine(`[>] EXTRACTING METADATA FROM YOUTUBE SERVERS...`);
            try {
                if (YOUTUBE_API_KEY === "YOUR_REAL_YOUTUBE_API_KEY_HERE") return `[!] API_KEY_MISSING: Add your Google Cloud API key in kernel.js.`;
                
                const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`);
                const data = await res.json();
                
                if (!data.items || data.items.length === 0) return "ERR: VIDEO_NOT_FOUND_OR_PRIVATE";
                
                const vid = data.items[0];
                return `<span style="color:var(--cyan)">[+] MEDIA METADATA EXTRACTED</span><br>CHANNEL: ${vid.snippet.channelTitle}<br>PUBLISHED: ${new Date(vid.snippet.publishedAt).toLocaleString()}<br>VIEWS: ${parseInt(vid.statistics.viewCount).toLocaleString()}<br>LIKES: ${parseInt(vid.statistics.likeCount).toLocaleString()}`;
            } catch (err) { return `[!] API_ERR: ${err.message}`; }
        },

        // --- 5. DISCORD SERVER BROADCAST ---
        "broadcast": async (args) => {
            if (!args) return "ERR: MESSAGE_EMPTY";
            if (DISCORD_WEBHOOK === "YOUR_REAL_DISCORD_WEBHOOK_URL_HERE") return "[!] WEBHOOK_MISSING: Add your Discord Webhook URL in kernel.js.";

            AETHER_KERNEL.printLine(`[>] TRANSMITTING TO SECURE SERVER...`);
            try {
                const res = await fetch(DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: `**[AETHER-0 TERMINAL]:** ${args}`, username: "Fox_Engine" })
                });
                if (res.ok) return "<span style="color:var(--cyan)">[+] TRANSMISSION_SUCCESSFUL: Message delivered to Discord.</span>";
                return `[!] TRANSMISSION_FAILED: HTTP ${res.status}`;
            } catch (err) { return `[!] NETWORK_ERR: ${err.message}`; }
        },

        // --- 6. REAL DOM MANIPULATION (UI SHREDDER) ---
        "shred": (args) => {
            if (!args) return "ERR: NO_TARGET_SELECTOR. Usage: shred [css_selector]";
            const element = document.querySelector(args);
            if (element) {
                element.style.transition = "all 0.5s ease";
                element.style.transform = "scale(0) rotate(180deg)";
                element.style.opacity = "0";
                setTimeout(() => element.remove(), 500);
                return `TARGET_DESTROYED: ${args} removed from DOM.`;
            }
            return `ERR: TARGET_NOT_FOUND_IN_DOM`;
        },

        // --- 7. LIVE REPL (JAVASCRIPT EXECUTION ENGINE) ---
        "exec": async (code) => {
            if (!code) return "ERR: CODE_REQUIRED";
            try { 
                const result = await eval(`(async () => { return ${code} })()`); 
                if (typeof result === 'object') return JSON.stringify(result, null, 2);
                return String(result);
            } 
            catch (e) { return `[!] EXECUTION_ERROR: ${e.message}`; }
        },

        // --- 8. DYNAMIC PROTOCOL CREATOR ---
        "create": (args) => {
            if(!args.includes(" ")) return "ERR: SYNTAX IS 'create [name] [logic]'";
            const newName = args.split(" ")[0];
            const logic = args.substring(newName.length).trim();
            
            const customCmds = JSON.parse(localStorage.getItem('AETHER_CUSTOM') || '{}');
            customCmds[newName] = logic;
            localStorage.setItem('AETHER_CUSTOM', JSON.stringify(customCmds));
            
            AETHER_KERNEL.registry[newName] = () => logic;
            return `[+] PROTOCOL_${newName.toUpperCase()} SAVED TO LOCAL STORAGE.`;
        },

        // --- 9. CARRIER LOOKUP (PLACEHOLDER FOR REAL API) ---
        "locate_num": async (num) => {
            if (!num) return "ERR: NUMBER_REQUIRED. Usage: locate_num [number]";
            return `[!] UPLINK_REQUIRED: Insert a real NumVerify or Twilio Lookup API key in kernel.js to trace carrier routing for ${num}.`;
        },

        // --- SYSTEM CORE ---
        "clear": () => { output.innerHTML = ""; return ""; },
        "whoami": () => "ID: FAHAD_MALIK | ALIAS: SUPER_STAR | LOC: TOKYO_JPN",
        "status": () => "AETHER-0 LIVE | UPLINK: SECURE | UI: GLASSMORPHISM",
        "date": () => new Date().toLocaleString()
    },

    initCustomScripts() {
        const custom = JSON.parse(localStorage.getItem('AETHER_CUSTOM') || '{}');
        for (const [key, value] of Object.entries(custom)) {
            this.registry[key] = () => value;
        }
    },

    async execute(rawInput) {
        if (!rawInput.trim()) return;
        
        // Command History
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
            this.printLine(`[!] UNKNOWN_PROTOCOL: '${cmd}'.`);
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
        AETHER_KERNEL.execute(input.value);
        input.value = "";
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (AETHER_KERNEL.state.historyIndex > 0) {
            AETHER_KERNEL.state.historyIndex--;
            input.value = AETHER_KERNEL.state.history[AETHER_KERNEL.state.historyIndex];
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (AETHER_KERNEL.state.historyIndex < AETHER_KERNEL.state.history.length - 1) {
            AETHER_KERNEL.state.historyIndex++;
            input.value = AETHER_KERNEL.state.history[AETHER_KERNEL.state.historyIndex];
        } else {
            AETHER_KERNEL.state.historyIndex = AETHER_KERNEL.state.history.length;
            input.value = "";
        }
    }
});

// --- BOOT SEQUENCE ---
window.onload = () => {
    AETHER_KERNEL.initCustomScripts();
    AETHER_KERNEL.printLine("AETHER-0 LIVE API ENGINE [Fox Protocol Active]");
    AETHER_KERNEL.printLine("WARNING: EXECUTING REAL NETWORK REQUESTS.");
};
        // --- INITIALIZE REAL PYTHON IN THE BROWSER ---
        let pyodideReady = false;
        let pyodide = null;
        
        async function bootPythonCore() {
            AETHER.printLine("[>] DOWNLOADING PYTHON WEBASSEMBLY KERNEL...");
            try {
                pyodide = await loadPyodide();
                pyodideReady = true;
                AETHER.printLine("<span class='success-text'>[+] Wasm CPYTHON ENVIRONMENT SECURED AND ACTIVE.</span>");
            } catch (err) {
                AETHER.printLine(`<span class='accent-text'>[!] WASM_ERR: ${err.message}</span>`);
            }
        }
        
        // Boot it right after the window loads
        setTimeout(bootPythonCore, 1000);

        // --- ADD THIS TO YOUR AETHER REGISTRY ---
        // Command: py [python_code]
        "py": async (code) => {
            if (!code) return "<span class='accent-text'>ERR: PYTHON_CODE_REQUIRED</span>";
            if (!pyodideReady) return "<span class='accent-text'>ERR: PYTHON_KERNEL_STILL_BOOTING</span>";
            
            try {
                // Execute real Python directly in the browser memory
                const pyResult = await pyodide.runPythonAsync(code);
                return typeof pyResult !== 'undefined' ? `<span style="color:#f2e422;">PYTHON_OUT: ${pyResult}</span>` : "<span class='success-text'>[+] EXECUTED.</span>";
            } catch (err) {
                return `<span class='accent-text'>[!] PYTHON_TRACEBACK: ${err.message}</span>`;
            }
        },

