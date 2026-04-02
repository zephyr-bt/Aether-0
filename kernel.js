/**
 * AETHER-0 // GOD_MODE_KERNEL // V5.0 OMNISCIENCE
 * ARCHITECT: FAHAD MALIK (SUPER_STAR / SPYDEY)
 * ORG: WEBLOOM INC. 
 * ORIGIN: TOKYO_JPN // LOCAL_NODE: KADAYANALLUR_IND
 */

// --- MAINFRAME UI OVERRIDE ---
const injectMainframeUI = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        body, html { margin: 0; padding: 0; background-color: #020202; color: #00ffcc; font-family: 'Share Tech Mono', monospace; height: 100vh; overflow: hidden; }
        #terminal-wrapper { height: 100vh; width: 100vw; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; position: relative; border: 1px solid #0044aa; box-shadow: inset 0 0 50px rgba(0, 68, 170, 0.2); background: radial-gradient(circle at center, #050505 0%, #000000 100%); }
        #terminal-wrapper::after { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%); background-size: 100% 4px; z-index: 100; pointer-events: none; }
        #output { flex-grow: 1; overflow-y: auto; text-shadow: 0 0 3px #00ffcc; font-size: 14px; letter-spacing: 0.5px; padding-bottom: 20px; z-index: 10; line-height: 1.6; scrollbar-width: none; }
        #output::-webkit-scrollbar { display: none; }
        #input-line { display: flex; align-items: center; border-top: 1px solid rgba(0, 255, 204, 0.3); padding-top: 15px; z-index: 10; }
        .prompt-text { color: #ff003c; text-shadow: 0 0 5px #ff003c; margin-right: 10px; font-weight: bold; white-space: nowrap; }
        #cmd-input { background: transparent; border: none; color: #ffffff; font-family: inherit; font-size: 15px; flex-grow: 1; outline: none; text-shadow: 0 0 4px #ffffff; caret-color: #ff003c; margin: 0; padding: 0; }
        .success-text { color: #00ff00; text-shadow: 0 0 5px #00ff00; }
        .accent-text { color: #ff003c; text-shadow: 0 0 5px #ff003c; }
        .sys-text { color: #0088ff; text-shadow: 0 0 5px #0088ff; }
        .muted { color: #447777; }
        #clock { position: absolute; top: 20px; right: 20px; z-index: 10; color: #447777; font-size: 12px; }
    `;
    document.head.appendChild(style);
};
injectMainframeUI();

const output = document.getElementById('output');
const input = document.getElementById('cmd-input');
const clock = document.getElementById('clock');
const wrapper = document.getElementById('terminal-wrapper');

if(clock) { setInterval(() => { clock.innerText = new Date().toLocaleTimeString("en-IN", {timeZone: "Asia/Kolkata"}) + " [IST]"; }, 1000); }

let pyodideReady = false; let pyodide = null;
setTimeout(async () => {
    AETHER.printLine("<span class='muted'>[SYSTEM] ALLOCATING WASM PYTHON THREADS...</span>");
    try { if (typeof loadPyodide !== "undefined") { pyodide = await loadPyodide(); pyodideReady = true; AETHER.printLine("<span class='success-text'>[OK] CPYTHON KERNEL SECURED.</span>"); } } catch(e) {}
}, 500);

window.bleDevice = null; window.bleServer = null;

const AETHER = {
    history: [], historyIndex: -1,
    registry: {
        // --- 1. KERNEL & EXECUTION ---
        "exec": async (c) => { try { const r = await eval(`(async()=>{return ${c}})()`); return typeof r==='object'?`<span class='success-text'>${JSON.stringify(r)}</span>`:String(r); }catch(e){return `<span class='accent-text'>[ERR] ${e.message}</span>`;} },
        "py": async (c) => { if(!pyodideReady) return "[ERR] KERNEL BOOTING"; try{ return `<span style='color:#FCD34D'>${await pyodide.runPythonAsync(c)}</span>`; }catch(e){return `<span class='accent-text'>[TRACE] ${e.message}</span>`;} },
        "clear": () => { output.innerHTML = ""; return ""; },
        "help": () => `<span class='sys-text'>AETHER-0 v5.0 // 60+ PROTOCOLS ONLINE:</span><br><br><span class='muted'>[CORE]</span> exec, py, clear, whoami, sys_diag, history, date, time, echo<br><span class='muted'>[NET]</span> ping_web, dns, locate_ip, trace_no, flight_tap, net_map, sat_view, ip, headers, weather, github_recon<br><span class='muted'>[CRYPTO]</span> hash, uuid, base64_enc, base64_dec, hex_enc, hex_dec, gen_pwd, jwt_decode<br><span class='muted'>[WEAPON]</span> edit_web, lock_web, barrel_roll, earthquake, invert, disco, hide_cursor, glitch_ui, matrix_rain, funny, domain_expansion<br><span class='muted'>[HARDWARE]</span> battery, vibrate, voice, cores, memory, platform, camera_test<br><span class='muted'>[LAN/BLE]</span> sony_power, sony_mute, tv_power, bt_scan, bt_connect, bt_disconnect<br><span class='muted'>[WEBLOOM]</span> vulcan_status, vertex_boot, scope_ping, evocore_sync, system_link, system_unlink<br><span class='muted'>[DATA]</span> crypto_btc, iss_loc, pokemon, notify`,
        "whoami": () => "<span class='sys-text'>[ID]</span> FAHAD MALIK (SPYDEY) <br><span class='sys-text'>[ORG]</span> WEBLOOM INC. <br><span class='sys-text'>[NODE]</span> KADAYANALLUR_IND",
        "history": () => AETHER.history.map((h,i) => `[${i}] ${h}`).join("<br>"),
        "date": () => new Date().toLocaleDateString(),
        "time": () => new Date().toLocaleTimeString(),
        "echo": (args) => args,

        // --- 2. NETWORK & OSINT ---
        "ping_web": async (url) => { const s=performance.now(); try{ await fetch(url.startsWith('http')?url:`https://${url}`,{mode:'no-cors',cache:'no-store'}); return `<span class='success-text'>[OK] LATENCY: ${(performance.now()-s).toFixed(2)}ms</span>`; }catch(e){return `<span class='accent-text'>[ERR] TIMEOUT</span>`;} },
        "dns": async (d) => { try{ const r = await (await fetch(`https://dns.google/resolve?name=${d}&type=ANY`)).json(); return r.Answer ? r.Answer.map(x=>`<span class='muted'>[TYPE_${x.type}]</span> ${x.data}`).join('<br>') : "[WARN] NO RECORDS"; }catch(e){return "[ERR]";} },
        "locate_ip": async (ip) => { try{ const d=await(await fetch(`https://ipapi.co/${ip}/json/`)).json(); return `IP: ${d.ip}<br>CITY: ${d.city}<br>ORG: ${d.org}`; }catch(e){return "[ERR]";} },
        "trace_no": async (ph) => { await new Promise(r=>setTimeout(r,1000)); return `<span class='success-text'>[OK] OSINT SS7 PING COMPLETE. REGION LOGGED.</span>`; },
        "flight_tap": async () => { try{ const d=await(await fetch("https://opensky-network.org/api/states/all")).json(); return d.states.slice(0,3).map(f=>`CALLSIGN: ${f[1]||'N/A'} | ALT: ${f[7]}m`).join('<br>'); }catch(e){return "[API LIMIT]";} },
        "net_map": async () => { setTimeout(()=>AETHER.printLine("<span class='success-text'>[+] 10.17.149.x SWEEP BACKGROUNDED.</span>"),1000); return "SCANNING..."; },
        "sat_view": (loc) => { window.open(`https://www.google.com/maps/search/${encodeURIComponent(loc||'Kadayanallur')}/data=!3m1!1e3`, '_blank'); return "[+] OPTICS DEPLOYED."; },
        "ip": async () => { const d=await(await fetch("https://api.ipify.org?format=json")).json(); return `<span class='sys-text'>[PUBLIC IP]</span> ${d.ip}`; },
        "headers": async (url) => { try{ const r=await fetch(url.startsWith('http')?url:`https://${url}`,{method:'HEAD',mode:'no-cors'}); return "[OK] HTTP HEADERS CAPTURED (CHECK DEVTOOLS)"; }catch(e){return "[ERR]";} },
        "weather": async (loc) => { try{ const t=await(await fetch(`https://wttr.in/${loc||'Kadayanallur'}?format=3`)).text(); return t; }catch(e){return "[ERR]";} },
        "github_recon": async (user) => { try{ const d=await(await fetch(`https://api.github.com/users/${user}`)).json(); return `USER: ${d.login}<br>REPOS: ${d.public_repos}<br>FOLLOWERS: ${d.followers}`; }catch(e){return "[ERR]";} },

        // --- 3. CRYPTO & DATA WEAPONS ---
        "hash": async (t) => { const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)); return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''); },
        "uuid": () => crypto.randomUUID?crypto.randomUUID():"NOT_SUPPORTED",
        "base64_enc": (t) => btoa(t),
        "base64_dec": (t) => atob(t),
        "hex_enc": (t) => Array.from(t).map(c=>c.charCodeAt(0).toString(16)).join(''),
        "hex_dec": (h) => decodeURIComponent('%'+h.match(/.{1,2}/g).join('%')),
        "gen_pwd": (len) => Array.from(crypto.getRandomValues(new Uint8Array(len||16))).map(x=>String.fromCharCode(x%86+40)).join(''),
        "jwt_decode": (t) => { try{ return JSON.stringify(JSON.parse(atob(t.split('.')[1])),null,2); }catch(e){return "[ERR] INVALID JWT";} },
        "crypto_btc": async () => `$${(await(await fetch("https://api.coindesk.com/v1/bpi/currentprice.json")).json()).bpi.USD.rate}`,
        "iss_loc": async () => { const d=await(await fetch("http://api.open-notify.org/iss-now.json")).json(); return `LAT ${d.iss_position.latitude}, LON ${d.iss_position.longitude}`; },
        "pokemon": async (n) => `🐉 ${(await(await fetch(`https://pokeapi.co/api/v2/pokemon/${n||'mewtwo'}`)).json()).name.toUpperCase()}`,
        "notify": async (args) => { const p=args.split(" "); await fetch(`https://ntfy.sh/${p[0]}`,{method:'POST',body:p.slice(1).join(" ")}); return `[+] PUSH SENT.`; },

        // --- 4. HARDWARE & LAN ---
        "sys_diag": async () => `PLATFORM: ${navigator.platform}<br>CORES: ${navigator.hardwareConcurrency}<br>RAM: ${navigator.deviceMemory}GB`,
        "battery": async () => { try{ const b=await navigator.getBattery(); return `LVL: ${b.level*100}% | CHARGING: ${b.charging}`; }catch(e){return "DENIED";} },
        "vibrate": () => { navigator.vibrate([200,100,200]); return "[+] HAPTICS ENGAGED."; },
        "voice": (m) => { window.speechSynthesis.speak(new SpeechSynthesisUtterance(m||"God mode active.")); return "[+] TTS OUT."; },
        "cores": () => navigator.hardwareConcurrency,
        "memory": () => `${navigator.deviceMemory} GB`,
        "platform": () => navigator.platform,
        "camera_test": async () => { try{ const s=await navigator.mediaDevices.getUserMedia({video:true}); s.getTracks().forEach(t=>t.stop()); return "<span class='success-text'>[OK] CAMERA HARDWARE ACCESSIBLE.</span>"; }catch(e){return "[ERR] CAM DENIED.";} },
        "sony_power": async (a) => { const p=a.split(" "); fetch(`http://${p[0]}/sony/IRCC`,{method:'POST',headers:{'X-Auth-PSK':p[1],'Content-Type':'text/xml'},body:`<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1"><IRCCCode>AAAAAQAAAAEAAAAVAw==</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>`}); return "[+] SONY PAYLOAD SENT."; },
        "sony_mute": async (a) => { const p=a.split(" "); fetch(`http://${p[0]}/sony/IRCC`,{method:'POST',headers:{'X-Auth-PSK':p[1],'Content-Type':'text/xml'},body:`<?xml version="1.0"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"><s:Body><u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1"><IRCCCode>AAAAAQAAAAEAAAAUAw==</IRCCCode></u:X_SendIRCC></s:Body></s:Envelope>`}); return "[+] AUDIO MUTED."; },
        "tv_power": async (ip) => { fetch(`http://${ip}:8060/keypress/Power`,{method:'POST',mode:'no-cors'}); return "[+] ROKU PAYLOAD SENT."; },
        "bt_scan": async () => { try{ window.bleDevice = await navigator.bluetooth.requestDevice({acceptAllDevices:true}); return `[+] LOCKED: ${window.bleDevice.name}`; }catch(e){return "[ERR]";} },
        "bt_connect": async () => { try{ window.bleServer = await window.bleDevice.gatt.connect(); return "[+] GATT ESTABLISHED."; }catch(e){return "[ERR]";} },
        "bt_disconnect": () => { if(window.bleDevice) window.bleDevice.gatt.disconnect(); return "[-] SEVERED."; },

        // --- 5. DOM DESTRUCTION & UI EFFECTS ---
        "edit_web": () => { document.designMode="on"; return "[+] DOM UNLOCKED."; },
        "lock_web": () => { document.designMode="off"; return "[-] DOM LOCKED."; },
        "barrel_roll": () => { wrapper.style.transition="transform 2s"; wrapper.style.transform="rotate(360deg)"; setTimeout(()=>wrapper.style.transform="",2000); return "EXECUTING."; },
        "earthquake": () => { let i=0; const iv=setInterval(()=>{wrapper.style.transform=`translate(${Math.random()*20-10}px,${Math.random()*20-10}px)`; i++; if(i>20){clearInterval(iv);wrapper.style.transform="";}},50); return "SEISMIC ANOMALY."; },
        "invert": () => { document.body.style.filter = document.body.style.filter==="invert(1)"?"":"invert(1)"; return "POLARITY TOGGLED."; },
        "disco": () => { window.discoIv=setInterval(()=>document.body.style.filter=`hue-rotate(${Math.random()*360}deg)`,100); return "RAVE ACTIVE."; },
        "hide_cursor": () => { document.body.style.cursor="none"; return "CURSOR HIDDEN."; },
        "glitch_ui": () => { document.body.style.animation = "glitch 0.2s infinite"; const s=document.createElement('style');s.innerHTML=`@keyframes glitch{0%{transform:translate(2px,1px) skewX(2deg)}50%{transform:translate(-2px,-1px) skewX(-2deg)}}`;document.head.appendChild(s); return "GLITCH ACTIVE."; },
        "matrix_rain": () => { 
            const c=document.createElement('canvas');c.style="position:fixed;top:0;left:0;z-index:99999;pointer-events:none;opacity:0.3";document.body.appendChild(c);
            const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;
            const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*".split("");const drops=[];for(let x=0;x<c.width/10;x++)drops[x]=1;
            setInterval(()=>{ctx.fillStyle="rgba(0,0,0,0.05)";ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle="#0F0";ctx.font="10px monospace";for(let i=0;i<drops.length;i++){const text=chars[Math.floor(Math.random()*chars.length)];ctx.fillText(text,i*10,drops[i]*10);if(drops[i]*10>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}},33);
            return "[+] MATRIX OVERLAY DEPLOYED.";
        },
        
        // --- 6. WEBLOOM ECOSYSTEM HOOKS ---
        "vulcan_status": () => "<span class='sys-text'>[VULCAN_BOT]</span> UPTIME: 99.9% | SHARDS: 4 | SERVERS: 104,210",
        "vertex_boot": () => "<span class='sys-text'>[VERTEX_OS]</span> KERNEL RESPONDING. NODE SECURE.",
        "scope_ping": () => "<span class='sys-text'>[SCOPE_SOCIAL]</span> API LATENCY: 24ms | DB: CONNECTED",
        "evocore_sync": () => "<span class='sys-text'>[EVOCORE]</span> FIREBASE SYNC: MATCHED. ALL PLAYERS SAVED.",

        // --- 7. CINEMATIC WEAPONS (GOD MODE) ---
        "system_link": () => {
            if(document.getElementById('solo-hud')) return "ACTIVE.";
            const h = document.createElement('div'); h.id = 'solo-hud';
            h.style = "border:1px solid #00ffcc;background:rgba(0,10,20,0.95);box-shadow:0 0 20px rgba(0,255,204,0.3);color:#00ffcc;font-family:monospace;padding:15px;width:260px;position:fixed;top:20px;right:20px;z-index:9999;border-radius:4px;";
            h.innerHTML = `<h3 style='margin:0 0 10px 0;text-align:center;border-bottom:1px solid #00ffcc;padding-bottom:5px;'>PLAYER STATUS</h3><p style='margin:5px 0'><b>NAME:</b> SPYDEY</p><p style='margin:5px 0'><b>JOB:</b> SHADOW MONARCH</p><p style='margin:5px 0'><b>LVL:</b> 999</p><div style='margin-top:10px'>HP: <div style='display:inline-block;width:80%;background:#111;height:8px;'><div style='width:100%;background:#00ffcc;height:100%;box-shadow:0 0 5px #00ffcc'></div></div></div><div style='margin-top:5px;color:#ff003c'>MP: <div style='display:inline-block;width:80%;background:#111;height:8px;'><div style='width:100%;background:#ff003c;height:100%;box-shadow:0 0 5px #ff003c'></div></div></div>`;
            document.body.appendChild(h); return "<span class='success-text'>[+] THE SYSTEM HAS AWAKENED.</span>";
        },
        "system_unlink": () => { const h=document.getElementById('solo-hud'); if(h){h.remove();return "[-] UNLINKED.";} return "NOT ACTIVE."; },
        "domain_expansion": () => {
            document.body.style.overflow = "hidden";
            const s=document.createElement('style');s.innerHTML=`@keyframes f{0%{background:white;opacity:1}100%{background:transparent;opacity:0}}@keyframes sp{0%{transform:translate(-50%,-50%) scale(0)}100%{transform:translate(-50%,-50%) scale(100);background:black}}.fl{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;animation:f 0.8s forwards;}.sp{position:fixed;top:50%;left:50%;width:10px;height:10px;background:#ff003c;border-radius:50%;z-index:99998;animation:sp 1s forwards cubic-bezier(0.7,0,0.2,1);}`;document.head.appendChild(s);
            document.body.innerHTML=`<div class='fl'></div><div class='sp'></div><h1 style='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:white;z-index:100000;font-family:monospace;text-shadow:0 0 30px #ff003c;font-size:10vw;white-space:nowrap;'>無量空処<br>INFINITE VOID</h1>`;
            return "";
        },
        
        // --- 8. THE MELTDOWN (FUNNY) ---
        "funny": () => {
            if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(()=>{});
            
            // Audio Siren
            try {
                const actx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = actx.createOscillator(); osc.type = 'sawtooth';
                const gain = actx.createGain(); gain.gain.value = 0.5;
                setInterval(() => { osc.frequency.setValueAtTime(400, actx.currentTime); osc.frequency.setValueAtTime(800, actx.currentTime + 0.2); }, 400);
                osc.connect(gain); gain.connect(actx.destination); osc.start();
                setTimeout(() => osc.stop(), 8000);
            } catch(e) {}

            // The Visual Hack Overlay
            const s = document.createElement('style');
            s.innerHTML = `
                @keyframes m-shake { 0% {transform:translate(3px,2px)} 50% {transform:translate(-3px,-2px)} 100% {transform:translate(3px,2px)} }
                @keyframes m-flash { 0%, 100% { background-color: #050000; color: #ff0000; } 50% { background-color: #ff0000; color: #ffffff; } }
                .meltdown { position:fixed; top:0; left:0; width:100vw; height:100vh; background:#000; z-index:999999; padding:30px; box-sizing:border-box; color:#ff0000; font-family:'Courier New', monospace; overflow:hidden; animation:m-shake 0.1s infinite; }
                .md-header { font-size: 3rem; text-align:center; border: 8px solid #ff0000; padding: 20px; font-weight:900; animation:m-flash 0.5s infinite; text-transform:uppercase; margin-bottom: 20px;}
                .md-log { font-size: 1.2rem; line-height: 1.8; text-shadow: 0 0 5px #ff0000; }
            `;
            document.head.appendChild(s);

            document.body.innerHTML = `
                <div class='meltdown'>
                    <div class='md-header'>CRITICAL SECURITY BREACH<br>SYSTEM LOCKDOWN INITIATED</div>
                    <div id='md-log' class='md-log'></div>
                </div>
            `;

            // Rapid Scrolling Logs
            const log = document.getElementById('md-log');
            const lines = [
                "UNAUTHORIZED ROOT ACCESS DETECTED AT NODE: KADAYANALLUR",
                "BYPASSING KERNEL FIREWALL [OK]",
                "EXTRACTING WEBLOOM RSA KEYS...",
                "DOWNLOADING VULCAN DISCORD TOKENS...",
                "ENCRYPTING LOCAL FILE SYSTEM [AES-256-CBC]...",
                "WIPING OSINT LOGS...",
                "INITIATING HARDWARE OVERVOLT SEQUENCE...",
                "WARNING: KERNEL PANIC"
            ];
            
            let i = 0;
            const iv = setInterval(() => {
                const hex = "0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0');
                log.innerHTML += `[${hex}] > ${lines[Math.floor(Math.random()*lines.length)]}<br>`;
                window.scrollTo(0, document.body.scrollHeight);
                i++; if(i > 150) clearInterval(iv);
            }, 40);

            // Violent Haptics
            if ("vibrate" in navigator) setInterval(() => navigator.vibrate(200), 400);

            return "";
        }
    },

    async execute(rawInput) {
        if (!rawInput.trim()) return;
        this.history.push(rawInput); this.historyIndex = this.history.length;
        const parts = rawInput.trim().split(/\s+/);
        const cmd = parts[0].toLowerCase(); const args = parts.slice(1).join(" ");

        this.printLine(`<span class="prompt-text">SPYDEY@AETHER-0:~$</span> <span style="color:#fff">${rawInput}</span>`);

        if (this.registry[cmd]) {
            try { const res = await this.registry[cmd](args); if (res) this.printLine(res); } 
            catch (err) { this.printLine(`<span class='accent-text'>[FATAL ERROR]</span> ${err.message}`); }
        } else {
            this.printLine(`<span class='accent-text'>[!] UNKNOWN_PROTOCOL: '${cmd}'</span>`);
        }
    },

    printLine(text) {
        const line = document.createElement('div'); line.style.marginBottom = "6px";
        line.innerHTML = text; output.appendChild(line); output.scrollTop = output.scrollHeight;
    }
};

// --- INPUT LISTENERS ---
input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) { e.preventDefault(); AETHER.execute(input.value); input.value = ""; } 
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (AETHER.historyIndex > 0) { AETHER.historyIndex--; input.value = AETHER.history[AETHER.historyIndex]; } } 
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (AETHER.historyIndex < AETHER.history.length - 1) { AETHER.historyIndex++; input.value = AETHER.history[AETHER.historyIndex]; } else { AETHER.historyIndex = AETHER.history.length; input.value = ""; } }
});

input.addEventListener('search', () => { if (input.value.trim() !== "") { AETHER.execute(input.value); input.value = ""; } });
document.addEventListener('click', () => input.focus());

// --- BOOT ---
window.onload = () => {
    AETHER.printLine("<span class='sys-text' style='font-size: 1.2em; font-weight: bold;'>AETHER-0 // GOD_MODE KERNEL [v5.0]</span>");
    AETHER.printLine("<span class='success-text'>[SYSTEM OVERRIDE ACCEPTED. 60+ PROTOCOLS UNLOCKED.]</span>");
    AETHER.printLine("TYPE <span class='sys-text'>'help'</span> TO VIEW THE ARSENAL.");
};
