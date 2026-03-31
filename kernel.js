const output = document.getElementById('output');
const input = document.getElementById('cmd-input');

const SYSTEM_CMD = {
    // --- CORE (1-10) ---
    "help": () => "AVAILABLE PROTOCOLS: " + Object.keys(SYSTEM_CMD).join(", "),
    "clear": () => { output.innerHTML = ""; return ""; },
    "whoami": () => "ID: FAHAD_MALIK | ROLE: SUPER_STAR | LOC: TOKYO_JPN",
    "status": () => "KERNEL: OPTIMAL | UPLINK: ACTIVE | SYSTEM: SECURE",
    "date": () => new Date().toLocaleString(),
    "ver": () => "AETHER-0 v1.0.4-STABLE",
    "reboot": () => { location.reload(); return "INITIALIZING COLD BOOT..."; },
    "ls": () => "AGENT.PY, HUNTER.CPP, KERNEL.JS, INDEX.HTML, STYLE.CSS",
    "cd": (dir) => `MOUNTING DIRECTORY: ${dir || '/ROOT'}... SUCCESS.`,
    "ps": () => "PID 001: KERNEL | PID 042: PY_AGENT | PID 099: CPP_HUNTER",

    // --- NETWORK (11-25) ---
    "ping": (host) => `SENDING PACKETS TO ${host || '8.8.8.8'}... [OK]`,
    "ip": async () => { const r = await fetch('https://api.ipify.org?format=json'); const d = await r.json(); return `EXTERNAL_IP: ${d.ip}`; },
    "trace": (h) => `TRACING ROUTE TO ${h || 'GATEWAY'}... HOPS: 12`,
    "uplink": () => "CONNECTION TO MAIN-GRID ESTABLISHED.",
    "sniff": () => "MONITORING PACKET FLOW... [ENCRYPTED DATA DETECTED]",
    "dns": (h) => `RESOLVING ${h}... 127.0.0.1`,
    "fetch": async (u) => { const r = await fetch(u); return `STATUS: ${r.status}`; },
    "proxy": () => "ROUTING THROUGH TOKYO-NODE-07...",
    "scan": () => "PORT SCANNING LOCALHOST... 80: OPEN, 443: OPEN",
    
    // --- OVERRIDE/MODE (26-40) ---
    "hunter": () => { document.body.className = 'hunter-mode'; return "HUNTER PROTOCOL ENGAGED."; },
    "matrix": () => { document.body.className = 'matrix-mode'; return "MATRIX OVERLAY RESTORED."; },
    "glitch": () => { document.body.classList.add('glitch-effect'); setTimeout(()=>document.body.classList.remove('glitch-effect'), 500); return "CORRUPTION DETECTED."; },
    "lock": () => "SYSTEM LOCKED. BIOMETRIC SIGNATURE REQUIRED.",
    "unlock": () => "ACCESS GRANTED. WELCOME BACK, SUPER STAR.",

    // --- AGENT INTERFACE (41-50) ---
    "py_run": (cmd) => `SENDING '${cmd}' TO PYTHON AGENT...`,
    "cpp_exec": (cmd) => `SENDING '${cmd}' TO C++ CORE...`,
    "bridge": () => "ESTABLISHING WEB-TO-LOCAL BRIDGE... [OK]",
    "relay": () => "DATA RELAY ACTIVE ON PORT 8080."
};

// ... Add 50 more commands for "The Top" status ...

async function runCommand(val) {
    const [cmd, ...args] = val.trim().split(" ");
    const line = document.createElement('div');
    line.innerHTML = `<span class="prompt">ROOT@AETHER0:~$</span> ${val}`;
    output.appendChild(line);

    const response = document.createElement('div');
    response.className = 'response';
    
    if (SYSTEM_CMD[cmd]) {
        response.innerText = await SYSTEM_CMD[cmd](args.join(" "));
    } else {
        response.innerText = `[!] COMMAND_NOT_FOUND: ${cmd}`;
    }
    output.appendChild(response);
    input.value = "";
    window.scrollTo(0, document.body.scrollHeight);
}

input.addEventListener('keydown', (e) => { if(e.key === 'Enter') runCommand(e.target.value); });
