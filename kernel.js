/**
 * AETHER-0 // UNIVERSAL_OVERRIDE_KERNEL
 * VERSION: 1.0.4-STABLE
 * ARCHITECT: FAHAD_MALIK (SUPER_STAR)
 * LOCATION: TOKYO_JPN
 */

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const body = document.body;

const AETHER_KERNEL = {
    state: {
        authorized: true,
        mode: 'MATRIX',
        fs_handle: null,
        startTime: Date.now(),
        history: []
    },

    // --- COMMAND REGISTRY (100 TOTAL SLOTS) ---
    registry: {
        // MODULE 1: ARCHITECT (CORE OPS)
        "help": () => "AVAILABLE_PROTOCOLS: " + Object.keys(AETHER_KERNEL.registry).join(", "),
        "clear": () => { output.innerHTML = ""; return ""; },
        "whoami": () => "ID: FAHAD_MALIK | ALIAS: SUPER_STAR | ROLE: ROOT_ARCHITECT | LOC: TOKYO_JPN",
        "status": () => `KERNEL: OPTIMAL | UPLINK: ACTIVE | STABILITY: ${Math.floor(Math.random() * 20) + 80}%`,
        "uptime": () => `${Math.floor((Date.now() - AETHER_KERNEL.state.startTime) / 1000)}s`,
        "date": () => new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }),
        "ver": () => "AETHER-0 v1.0.4-STABLE_BUILD_2026",
        "reboot": () => { setTimeout(() => location.reload(), 1000); return "INITIALIZING COLD BOOT..."; },
        "ls": () => "AGENT.PY, HUNTER.CPP, KERNEL.JS, INDEX.HTML, STYLE.CSS, CONFIG.JSON",
        "ps": () => "PID 001: KERNEL | PID 042: PY_AGENT | PID 099: CPP_HUNTER | PID 101: SH_TOKYO",
        "sys": () => navigator.userAgent,
        "mem": () => `HEAP_LIMIT: ${performance.memory?.jsHeapSizeLimit || 'UNKNOWN'}`,
        "exit": () => "SESSION_TERMINATED. GOODBYE, SUPER STAR.",
        "history": () => AETHER_KERNEL.state.history.join("\n"),
        "man": (args) => `MANUAL_FOR_${args.toUpperCase()}: PROTOCOL_ACCESS_GRANTED.`,

        // MODULE 2: INFILTRATOR (NETWORK/HACK)
        "ip": async () => { const r = await fetch('https://api.ipify.org?format=json'); const d = await r.json(); return `EXTERNAL_IP: ${d.ip}`; },
        "ping": (h) => `Pinging ${h || '8.8.8.8'}... [OK] 22ms`,
        "trace": (h) => `TRACING_ROUTE TO ${h || 'NODE_TOKYO'}... HOPS: 12`,
        "fetch": async (u) => { try { const r = await fetch(u); return `UPLINK_STATUS: ${r.status}`; } catch(e) { return "ERR: CORS_BLOCK"; } },
        "dns": (h) => `RESOLVING ${h}... 127.0.0.1`,
        "uplink": () => "CONNECTION TO MAIN-GRID ESTABLISHED.",
        "sniff": () => "MONITORING_PACKET_FLOW... [ENCRYPTED DATA DETECTED]",
        "proxy": () => "ROUTING THROUGH TOKYO-NODE-07... [SECURE]",
        "scan": () => "PORT SCANNING LOCALHOST... 80: OPEN, 443: OPEN, 8080: LISTENING",
        "headers": async (u) => { const r = await fetch(u); return `SERVER: ${r.headers.get('server') || 'HIDDEN'}`; },
        "wifi": () => "SIGNAL: 98% | FREQ: 5.8GHz | SSID: SKYNET_RESISTANCE",
        "mac": () => "DE:AD:BE:EF:CA:FE",
        "latency": () => `${Math.floor(Math.random() * 50)}ms`,
        "netstat": () => "TCP: 127.0.0.1:8080 (ESTABLISHED)",
        "spoof": () => "HARDWARE_ID_MASKED.",

        // MODULE 3: OVERRIDE (MODES/VISUALS)
        "hunter": () => { body.className = 'hunter-mode'; AETHER_KERNEL.state.mode = 'HUNTER'; return "HUNTER PROTOCOL ENGAGED."; },
        "matrix": () => { body.className = 'matrix-mode'; AETHER_KERNEL.state.mode = 'MATRIX'; return "MATRIX OVERLAY RESTORED."; },
        "glitch": () => { body.classList.add('glitch-effect'); setTimeout(() => body.classList.remove('glitch-effect'), 500); return "CORRUPTION DETECTED."; },
        "lock": () => { input.disabled = true; return "SYSTEM_LOCKED. REBOOT_REQUIRED."; },
        "stealth": () => { body.style.opacity = "0.4"; return "STEALTH_MODE_ACTIVE."; },
        "normal": () => { body.style.opacity = "1"; return "VISIBILITY_RESTORED."; },
        "invert": () => { body.style.filter = "invert(1)"; return "POLARITY_REVERSED."; },
        "thermal": () => { body.style.filter = "sepia(1) hue-rotate(90deg) saturate(3)"; return "THERMAL_OPTICS_ON."; },
        "vision_off": () => { body.style.filter = "none"; return "VISUAL_FILTERS_CLEARED."; },
        "redpill": () => "THE_TRUTH_IS_FRAGMENTED.",
        "bluepill": () => "IGNORANCE_IS_BLISS. SYSTEM_RESTORING...",
        "sentinel": () => "WARNING: MACHINE_SWARM_DETECTED.",
        "zion": () => "BROADCASTING_REBELLION_SIGNAL...",
        "t800": () => "TARGETING_SYSTEM_CALIBRATED.",
        "neo": () => "HE_IS_BEGINNING_TO_BELIEVE.",

        // MODULE 4: BIOMETRICS & MEDIA
        "cam": async () => { try { await navigator.mediaDevices.getUserMedia({video: true}); return "OPTICAL_SENSORS_ONLINE."; } catch(e) { return "ERR: SENSOR_BLOCKED"; } },
        "mic": async () => { try { await navigator.mediaDevices.getUserMedia({audio: true}); return "AURAL_INTERCEPT_READY."; } catch(e) { return "ERR: MIC_BLOCKED"; } },
        "vibrate": () => { navigator.vibrate([100, 50, 100]); return "HAPTIC_FEEDBACK_TRIGGERED."; },
        "listen": () => "LISTENING_FOR_VOICE_COMMANDS...",
        "speak": (msg) => { const s = new SpeechSynthesisUtterance(msg || "Aether Zero Active"); window.speechSynthesis.speak(s); return "VOICE_SYNTH_ACTIVE."; },
        "snapshot": () => "CAPTURING_IMAGE_BUFFER...",
        "record": () => "RECORDING_SESSION_STREAM...",
        "bio": () => "DNA_PROFILE_MATCHED: FAHAD_MALIK",
        "retina": () => "RETINA_SCAN_COMPLETE. ACCESS_LEVEL: 0",
        "pulse": () => "BPM: 72 | STATUS: STABLE",

        // MODULE 5: FILESYSTEM (REAL CONTROL)
        "mount": async () => { AETHER_KERNEL.state.fs_handle = await window.showDirectoryPicker(); return `UPLINK_ESTABLISHED: ${AETHER_KERNEL.state.fs_handle.name}`; },
        "cat": (f) => `READING_${f}... [ENCRYPTED_DATA]`,
        "touch": (f) => `CREATING_FILE: ${f}`,
        "mkdir": (d) => `CREATING_DIR: ${d}`,
        "rm": (f) => `PURGING: ${f}`,
        "stat": (f) => `METADATA_FOR_${f}: 4KB | MODIFIED: NOW`,
        "hex": (f) => `0x48 0x65 0x6C 0x6C 0x6F 0x20 0x5A 0x65 0x6E 0x69 0x74 0x68`,
        "sync": () => "LOCAL_DATA_SYNCED_TO_VERCEL_EDGE.",
        "mount_v": () => "VIRTUAL_VOL_0_MOUNTED.",
        "crypt_ls": () => "HIDDEN_FILES_DECRYPTED.",

        // MODULE 6: TOKYO / ENV
        "weather": () => "SKYNET_SATELLITE: Tokyo - 14°C | Clear",
        "grid": () => "TOKYO_POWER_GRID: 88%_CAPACITY",
        "thermal_tokyo": () => "SHIBUYA_NODE: OPTIMAL | SHINJUKU_NODE: HIGH_LOAD",
        "radiation": () => "0.12 μSv/h (NORMAL)",
        "humidity": () => "45%",
        "wind": () => "NNE 12km/h",
        "astro": () => "MOON_PHASE: WANING_CRESCENT",
        "train": () => "YAMANOTE_LINE: ON_TIME",
        "geo": () => "LAT: 35.6762° N | LONG: 139.6503° E",
        "local": () => "TOKYO_TIMEZONE_LOCK_ACTIVE",

        // MODULE 7: CRYPTO / TOOLS
        "encrypt": (m) => btoa(m),
        "decrypt": (m) => atob(m),
        "hash": () => Math.random().toString(36).substring(2),
        "gen_key": () => "RSA_PRI_" + Date.now(),
        "calc": (expr) => { try { return eval(expr); } catch(e) { return "ERR: MATH_FAILURE"; } },
        "bin": (n) => parseInt(n).toString(2),
        "hexify": (n) => parseInt(n).toString(16),
        "base64": (s) => btoa(s),
        "unbase": (s) => atob(s),
        "random": () => Math.random(),
        "uuid": () => self.crypto.randomUUID(),
        "minify": (c) => c.replace(/\s+/g, ''),
        "beautify": (c) => "CODE_FORMATTING_COMPLETE.",
        "diff": () => "NO_CHANGES_DETECTED.",
        "timestamp": () => Date.now(),

        // MODULE 8: AGENT BRIDGING
        "py_run": (c) => `PYTHON_AGENT: EXECUTING '${c || 'IDLE'}'...`,
        "cpp_exec": (c) => `CPP_HUNTER: OVERRIDING '${c || 'IDLE'}'...`,
        "bridge": () => "WEB-TO-LOCAL_BRIDGE: ACTIVE [PORT 8080]",
        "relay": () => "RELAY_STATION_TOKYO: ONLINE",
        "tunnel": () => "ENCRYPTED_TUNNEL_ESTABLISHED.",
        "payload": () => "PREPARING_DATA_PAYLOAD...",
        "inject": () => "INJECTION_SEQUENCE_READY.",
        "intercept": () => "TRAFFIC_INTERCEPT_ACTIVE.",
        "override_0": () => { body.classList.add('glitch-effect'); return "SYSTEM_HIJACK_IN_PROGRESS..."; },
        "godmode": () => "ACCESS_LEVEL_INFINITY_GRANTED.",
    },

    // --- KERNEL LOGIC ---
    async execute(rawInput) {
        const parts = rawInput.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ");

        // Log to history
        this.state.history.push(rawInput);
        if (this.state.history.length > 50) this.state.history.shift();

        // Print User Line
        this.printLine(`<span class="prompt">ROOT@AETHER0:~$</span> ${rawInput}`);

        if (this.registry[cmd]) {
            try {
                const result = await this.registry[cmd](args);
                if (result) this.printLine(result);
            } catch (err) {
                this.printLine(`[!] KERNEL_ERR: ${err.message}`);
            }
        } else if (cmd !== "") {
            this.printLine(`[!] PROTOCOL_${cmd.toUpperCase()}_NOT_FOUND.`);
        }
    },

    printLine(text) {
        const line = document.createElement('div');
        line.className = 'line';
        line.innerHTML = text;
        output.appendChild(line);
        // Auto-scroll
        window.scrollTo(0, document.body.scrollHeight);
    }
};

// --- INITIALIZATION ---
input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        const val = input.value;
        await AETHER_KERNEL.execute(val);
        input.value = "";
    }
});

// Boot Sequence
window.onload = () => {
    AETHER_KERNEL.printLine("AETHER-0 KERNEL [Version 1.0.4-STABLE]");
    AETHER_KERNEL.printLine("LOCATION: TOKYO_JPN // STATUS: SYSTEM_READY");
    AETHER_KERNEL.printLine("TYPE 'HELP' TO SEE ALL 100 PROTOCOLS.");
};
