(function () {
  "use strict";

  /* ---------- Konfiguration ---------- */
  var RELAY = "https://ntfy.sh";
  var TOPIC = "helga-wwm-4a5824fa660cdd73";
  var MQTT_URL = "wss://broker.hivemq.com:8884/mqtt";
  var MQTT_TOPIC = "helga-wwm/4a5824fa660cdd73/state";
  var MQTT_VOTES = "helga-wwm/4a5824fa660cdd73/votes";
  var VOTE_TOPIC = TOPIC + "-votes";
  var STORE_KEY = "helga-quiz-game";

  var Q = window.QUIZ || [], N = Q.length, L = ["A", "B", "C", "D"];
  var MONEY = ["50", "100", "500", "1.000", "2.000", "8.000", "32.000", "125.000", "500.000"];
  var FRESH = { step: "intro", q: 0, picked: null, fifty: null, poll: null, saal: null, vote: null, ts: 0 };

  var G = Object.assign({}, FRESH);
  var app = document.getElementById("app");
  var liveEl = document.getElementById("live");
  var host = { busy: false, msg: "", err: false, confirmReset: false, pollDraft: null, sound: true };
  var lastId = "all";
  var voterId = (function () { var k = "helga-voter", v = null; try { v = localStorage.getItem(k); } catch (e) {} if (!v) { v = Math.random().toString(36).slice(2, 12); try { localStorage.setItem(k, v); } catch (e) {} } return v; })();
  var myVote = {}; // vote id -> gewählte Antwort
  var tally = {}; // nur am Pult: wer -> Antwort

  function isHost() { return location.hash === "#pult"; }
  function view() { if (isHost()) return "host"; if (location.hash === "#kandidat") return "kandidat"; return "publikum"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function stakeLabel(i) { if (i === N - 1) return "Dein Geschenk"; var m = MONEY.slice(-(N - 1)); return (m[i] || "") + " Helga-Taler"; }
  function audienceUrl() { return location.origin + location.pathname; }

  /* ---------- Bühne (sehen alle) ---------- */
  function orb() { return '<div class="orb"><span>WER WIRD<br>MILLIONÄRIN</span></div>'; }
  function stage(v) {
    if (G.step === "intro") {
      var h = '<div class="stage splash">' + orb() + '<h1>Gleich geht es los</h1>';
      if (v === "kandidat") h += '<div class="qr"><div id="qrbox"></div><p>Publikum: QR-Code scannen und live mitspielen</p></div>';
      else h += '<p>Licht aus, Spot an: Gleich nimmt Helga auf dem Ratestuhl Platz. Lass diese Seite offen, die Fragen erscheinen hier automatisch.</p>';
      return h + '</div>';
    }
    if (G.step === "finale") {
      var conf = "";
      for (var k = 0; k < 40; k++) conf += '<i style="left:' + ((k * 37) % 100) + '%;animation-duration:' + (3 + (k % 5)) + 's;animation-delay:-' + (k % 7) * 0.6 + 's"></i>';
      return '<div class="confetti" aria-hidden="true">' + conf + '</div><div class="stage splash">' + orb() +
        '<p class="label">Alle ' + N + ' Fragen richtig</p><h1>Helga hat es geschafft!</h1><p>Herzlichen Glückwunsch zum Geburtstag, Mama. Der Hauptgewinn gehört dir.</p></div>';
    }
    var q = Q[G.q], i = G.q, gone = (G.fifty === i) ? q.fifty : [];
    var h = '<div class="stage"><div class="topline"><div><p class="label">Frage ' + (i + 1) + ' von ' + N + '</p><div class="stake">' + esc(stakeLabel(i)) + '</div></div><div class="jokers">' +
      '<span class="joker' + (G.fifty !== null ? ' used' : '') + '">50:50</span><span class="joker' + (G.poll || G.vote ? ' used' : '') + '">Publikum</span><span class="joker' + (G.saal !== null ? ' used' : '') + '">Saal</span></div></div>';
    if (q.img) h += '<img class="pic" src="' + esc(q.img) + '" alt="Bild zur Frage">';
    var voting = votingNow(), canVote = voting && v === "publikum", mine = voting ? myVote[G.vote.id] : undefined;
    h += '<div class="loz q">' + esc(q.q) + '</div>';
    if (canVote) h += '<div class="banner"><strong>Publikumsjoker:</strong> ' + (mine === undefined ? 'Tippe auf die Antwort, die du für richtig hältst.' : 'Deine Stimme: ' + L[mine] + '. Du kannst noch wechseln.') + '</div>';
    else if (voting) h += '<div class="banner"><strong>Publikumsjoker:</strong> Das Publikum stimmt gerade ab …</div>';
    h += '<div class="answers">';
    for (var a = 0; a < 4; a++) {
      var cls = "loz ans";
      if (canVote && gone.indexOf(a) === -1) {
        h += '<button type="button" class="' + cls + ' votable' + (mine === a ? ' voted' : '') + '" data-vote="' + a + '"><b>' + L[a] + ':</b> <span>' + esc(q.a[a]) + '</span></button>';
        continue;
      }
      if (gone.indexOf(a) > -1) cls += " gone";
      else if (G.step === "locked" && G.picked === a) cls += " picked";
      else if (G.step === "reveal" && a === q.c) cls += " right";
      else if (G.step === "reveal" && G.picked === a) cls += " wrong";
      h += '<div class="' + cls + '"><b>' + L[a] + ':</b> <span>' + esc(q.a[a]) + '</span></div>';
    }
    h += '</div>';
    if (G.saal === i && G.step !== "reveal") h += '<div class="banner"><strong>Joker im Saal:</strong> Wer die Antwort weiß, steht jetzt auf!</div>';
    if (G.poll && G.poll.q === i) {
      h += '<p class="label">Publikumsjoker</p><div class="poll">';
      for (var p = 0; p < 4; p++) { var val = G.poll.pct[p] || 0; h += '<div class="bar"><div>' + val + '%</div><i style="height:' + Math.max(1, val) + '%"></i><span>' + L[p] + '</span></div>'; }
      h += '</div>';
    }
    return h + '</div>';
  }
  function votingNow() { return !!(G.vote && G.vote.open && G.vote.q === G.q && (G.step === "question" || G.step === "locked")); }
  function tallyCounts() { var c = [0, 0, 0, 0], n = 0; Object.keys(tally).forEach(function (k) { var x = tally[k]; if (x >= 0 && x < 4) { c[x]++; n++; } }); return { c: c, n: n }; }
  function tallyHtml() { var t = tallyCounts(); return t.n + (t.n === 1 ? ' Stimme' : ' Stimmen') + ': ' + L.map(function (l, k) { return l + ' ' + t.c[k]; }).join(' · '); }
  function ladder() {
    var cur = G.step === "finale" ? N - 1 : G.q, h = '<div class="ladder" aria-label="Gewinnleiter">';
    for (var i = N - 1; i >= 0; i--) {
      var c = "rung" + (i === N - 1 ? " top" : "") + (i === cur ? " now" : "") + (i < cur || G.step === "finale" ? " done" : "");
      h += '<div class="' + c + '"><i>' + (i + 1) + '</i>' + esc(stakeLabel(i)) + '</div>';
    }
    return h + '</div>';
  }

  /* ---------- Moderationspult ---------- */
  function desk() {
    var q = Q[G.q], i = G.q, dis = host.busy ? " disabled" : "";
    var d = '<aside class="desk"><h2>Moderationspult</h2>';
    if (G.step === "intro") {
      d += '<div class="group"><button class="btn primary" data-act="start"' + dis + '>Spiel starten: Frage 1 zeigen</button><p class="hint">' + N + ' Fragen geladen.</p></div>';
    } else if (G.step === "finale") {
      d += '<div class="group"><p>Finale läuft. Zeit für das Geschenk!</p><button class="btn" data-act="back"' + dis + '>Zurück zur letzten Frage</button></div>';
    } else {
      d += '<div class="card"><p class="label">Frage ' + (i + 1) + ' · ' + esc(stakeLabel(i)) + '</p><p>' + esc(q.q) + '</p><p class="ok">Richtig: ' + L[q.c] + ' – ' + esc(q.a[q.c]) + '</p>' + (q.note ? '<p>' + esc(q.note) + '</p>' : '') + '</div>';
      if (G.step === "question") {
        d += '<div class="group"><p class="label">Helga loggt ein</p><div class="row">';
        for (var a = 0; a < 4; a++) {
          var gone = (G.fifty === i && q.fifty.indexOf(a) > -1);
          d += '<button class="btn lock' + (a === q.c ? ' correct' : '') + '" data-act="lock" data-v="' + a + '"' + (gone || host.busy ? ' disabled' : '') + '>' + L[a] + ': ' + esc(q.a[a]) + '</button>';
        }
        d += '</div></div><div class="group"><p class="label">Joker</p><div class="row">' +
          '<button class="btn" data-act="fifty"' + (G.fifty !== null || host.busy ? ' disabled' : '') + '>50:50</button>' +
          '<button class="btn" data-act="voteopen"' + (G.poll || G.vote || host.busy ? ' disabled' : '') + '>Publikum abstimmen lassen</button>' +
          '<button class="btn" data-act="saal"' + (G.saal !== null || host.busy ? ' disabled' : '') + '>Joker im Saal</button></div>';
        if (votingNow()) {
          d += '<div class="card"><p class="label">Abstimmung läuft</p><p id="tally">' + tallyHtml() + '</p>' +
            '<div class="row"><button class="btn primary" data-act="voteclose"' + dis + '>Ergebnis zeigen</button><button class="btn ghost" data-act="voteadjust">Anpassen</button></div></div>';
        }
        if (host.pollDraft) {
          d += '<p class="hint">Prozente anpassen, dann zeigen.</p><div class="pollin">';
          for (var p = 0; p < 4; p++) d += '<label for="poll' + p + '">' + L[p] + '<input id="poll' + p + '" type="number" min="0" max="100" inputmode="numeric" value="' + host.pollDraft[p] + '"></label>';
          d += '</div><div class="row"><button class="btn primary" data-act="poll"' + dis + '>Ergebnis zeigen</button><button class="btn ghost" data-act="pollcancel">Abbrechen</button></div>';
        }
        d += '</div>';
      } else if (G.step === "locked") {
        d += '<div class="group"><p>Eingeloggt: <strong>' + L[G.picked] + ' – ' + esc(q.a[G.picked]) + '</strong>' + (G.picked !== q.c ? ' <span style="color:#ffb3b3">(falsch!)</span>' : '') + '</p>' +
          '<button class="btn primary" data-act="reveal"' + dis + '>Auflösen</button><button class="btn" data-act="unlock"' + dis + '>Antwort ändern</button></div>';
      } else if (G.step === "reveal") {
        d += '<div class="group"><button class="btn primary" data-act="next"' + dis + '>' + (i === N - 1 ? 'Zum Finale' : 'Nächste Frage: ' + (i + 2) + ' von ' + N) + '</button><button class="btn" data-act="back"' + dis + '>Schritt zurück</button></div>';
      }
    }
    d += '<p class="status' + (host.err ? ' err' : '') + '" role="status">' + esc(host.busy ? "Wird gesendet …" : host.msg) + '</p>';
    d += '<div class="group"><p class="label">Ton & Technik</p><div class="row">' +
      '<button class="btn' + (host.sound ? ' on' : '') + '" data-act="sound">Sound: ' + (host.sound ? 'an' : 'aus') + '</button>' +
      '<button class="btn" data-act="tension">Spannung abspielen</button>' +
      '<button class="btn" data-act="stopall">Alles stoppen</button>' +
      '<button class="btn" data-act="resend"' + dis + '>Stand erneut senden</button></div>' +
      '<details class="sounds"' + (host.soundsOpen ? ' open' : '') + '><summary>Eigene Sounds (' + Object.keys(custom).length + ' von ' + SLOTS.length + ')</summary><p class="hint">Audiodateien vom MacBook auswählen. Sie bleiben nur in diesem Browser und ersetzen die eingebauten Töne.</p>' +
      SLOTS.map(function (sl) {
        var c = custom[sl[0]];
        return '<div class="slot"><span>' + esc(sl[1]) + '</span>' + (c ? '<small>' + esc(c.name) + '</small><div class="row"><button class="btn" data-act="testslot" data-slot="' + sl[0] + '">Test</button><button class="btn ghost" data-act="clearslot" data-slot="' + sl[0] + '">Entfernen</button></div>'
          : '<label class="btn" for="f-' + sl[0] + '">Datei wählen</label><input type="file" accept="audio/*" id="f-' + sl[0] + '" data-slot="' + sl[0] + '" hidden>') + '</div>';
      }).join('') + '</details>' +
      '<p class="hint">Helgas Bildschirm: Link mit <code>#kandidat</code>. Publikum: Link ohne Zusatz.</p>' +
      (host.confirmReset ? '<div class="row"><button class="btn danger" data-act="reset"' + dis + '>Ja, alles zurücksetzen</button><button class="btn ghost" data-act="resetcancel">Abbrechen</button></div>'
        : '<button class="btn danger" data-act="resetask"' + dis + '>Spiel zurücksetzen</button>') + '</div>';
    return d + '</aside>';
  }

  var qrDone = false;
  function render() {
    var v = view();
    if (v === "host") app.innerHTML = '<div class="host"><div>' + stage(v) + '</div>' + desk() + '</div>';
    else if (v === "kandidat") app.innerHTML = '<div class="kandidat">' + stage(v) + (G.step === "intro" || G.step === "finale" ? '' : ladder()) + '</div>';
    else app.innerHTML = stage(v);
    var box = document.getElementById("qrbox");
    if (box && window.QRCode) { box.innerHTML = ""; new QRCode(box, { text: audienceUrl(), width: 220, height: 220 }); }
  }

  /* ---------- Echtzeit-Kanal ---------- */
  function setLive(on) { if (liveEl) { liveEl.className = "live" + (on ? " on" : ""); liveEl.lastChild.textContent = on ? "Live" : "Verbinde …"; } }
  function apply(msg) {
    try {
      var data = JSON.parse(msg.message);
      if (!data || !data.g || typeof data.g.step !== "string") return;
      if (msg.id) lastId = msg.id;
      if ((data.g.ts || 0) < (G.ts || 0)) return;
      var before = G.step + G.q;
      G = data.g;
      if (!isHost() || before !== G.step + G.q) render();
    } catch (e) {}
  }
  function handleVote(obj) {
    if (!isHost() || !obj || !G.vote || obj.vid !== G.vote.id || !G.vote.open) return;
    var c = +obj.c; if (!(c >= 0 && c < 4) || typeof obj.who !== "string") return;
    tally[obj.who.slice(0, 20)] = c;
    var el = document.getElementById("tally"); if (el) el.textContent = tallyHtml();
  }
  function pollVotes() {
    if (!votingNow()) return;
    fetch(RELAY + "/" + VOTE_TOPIC + "/json?poll=1&since=" + Math.floor((G.vote.t || Date.now()) / 1000 - 5))
      .then(function (r) { return r.text(); })
      .then(function (t) { t.split("\n").forEach(function (line) { if (!line) return; try { var m = JSON.parse(line); if (m.event === "message") handleVote(JSON.parse(m.message)); } catch (e) {} }); })
      .catch(function () {});
  }
  function sendVote(c) {
    if (!votingNow()) return;
    myVote[G.vote.id] = c; render();
    var body = JSON.stringify({ vid: G.vote.id, who: voterId, c: c });
    if (mq && mqOk) { try { mq.publish(MQTT_VOTES, body, { qos: 1 }); return; } catch (e) {} }
    fetch(RELAY + "/" + VOTE_TOPIC, { method: "POST", body: body }).catch(function () {});
  }
  function poll() {
    return fetch(RELAY + "/" + TOPIC + "/json?poll=1&since=" + encodeURIComponent(lastId))
      .then(function (r) { return r.text(); })
      .then(function (t) {
        t.split("\n").forEach(function (line) { if (!line) return; try { var m = JSON.parse(line); if (m.event === "message") apply(m); } catch (e) {} });
      });
  }
  var es = null, mq = null, mqOk = false;
  function liveNow() { setLive(mqOk || (es && es.readyState === 1)); }
  function connectNtfy() {
    if (es) return;
    try {
      es = new EventSource(RELAY + "/" + TOPIC + "/sse?since=" + encodeURIComponent(lastId));
      es.onopen = liveNow;
      es.onmessage = function (e) { try { var m = JSON.parse(e.data); if (m.event === "message") apply(m); } catch (x) {} };
      es.onerror = liveNow;
    } catch (e) {}
  }
  function connectMqtt() {
    if (!window.mqtt) return;
    try {
      mq = window.mqtt.connect(MQTT_URL, { clientId: "helga-" + Math.random().toString(16).slice(2, 10), reconnectPeriod: 2000, connectTimeout: 8000, clean: true });
      mq.on("connect", function () { mqOk = true; liveNow(); mq.subscribe(MQTT_TOPIC, { qos: 1 }); if (isHost()) mq.subscribe(MQTT_VOTES, { qos: 1 }); });
      mq.on("close", function () { mqOk = false; liveNow(); });
      mq.on("offline", function () { mqOk = false; liveNow(); });
      mq.on("message", function (t, payload) {
        if (t === MQTT_VOTES) { try { handleVote(JSON.parse(payload.toString())); } catch (e) {} return; }
        apply({ message: payload.toString() });
      });
    } catch (e) {}
  }
  function send() {
    G.ts = Date.now();
    try { localStorage.setItem(STORE_KEY, JSON.stringify(G)); } catch (e) {}
    host.busy = true; host.err = false; render();
    var body = JSON.stringify({ g: G }), viaMqtt = false;
    if (mq && mqOk) { try { mq.publish(MQTT_TOPIC, body, { qos: 1, retain: true }); viaMqtt = true; } catch (e) {} }
    return fetch(RELAY + "/" + TOPIC, { method: "POST", body: body })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return true; })
      .catch(function () { return false; })
      .then(function (viaNtfy) {
        host.busy = false;
        if (viaMqtt || viaNtfy) { host.err = false; host.msg = "Gesendet."; }
        else { host.err = true; host.msg = "Senden hat nicht geklappt. „Stand erneut senden“ klicken."; }
        render();
      });
  }
  function commit(patch) {
    if (host.busy) return;
    var prev = G.step;
    G = Object.assign({}, G, patch);
    host.pollDraft = null; host.confirmReset = false;
    sfx(prev, G.step, patch);
    send();
  }

  /* ---------- Eigene Sounddateien (bleiben im Browser des Pults) ---------- */
  var SLOTS = [["start", "Neue Frage"], ["tension", "Spannung (läuft in Schleife)"], ["lock", "Eingeloggt"], ["right", "Richtig"], ["wrong", "Falsch"], ["finale", "Finale"]];
  var custom = {}; // slot -> {name, url}
  var playing = {}; // slot -> Audio
  function idb() {
    return new Promise(function (res, rej) {
      if (!window.indexedDB) return rej();
      var r = indexedDB.open("helga-sounds", 1);
      r.onupgradeneeded = function () { r.result.createObjectStore("s"); };
      r.onsuccess = function () { res(r.result); }; r.onerror = rej;
    });
  }
  function idbPut(k, v) { return idb().then(function (db) { return new Promise(function (res) { var t = db.transaction("s", "readwrite"); if (v === null) t.objectStore("s").delete(k); else t.objectStore("s").put(v, k); t.oncomplete = res; t.onerror = res; }); }); }
  function idbAll() {
    return idb().then(function (db) { return new Promise(function (res) {
      var out = {}, t = db.transaction("s", "readonly"), st = t.objectStore("s"), req = st.openCursor();
      req.onsuccess = function () { var c = req.result; if (c) { out[c.key] = c.value; c.continue(); } else res(out); };
      req.onerror = function () { res(out); };
    }); });
  }
  function loadCustom() {
    if (!isHost()) return;
    idbAll().then(function (all) {
      Object.keys(all).forEach(function (k) { var v = all[k]; if (v && v.blob) custom[k] = { name: v.name, url: URL.createObjectURL(v.blob) }; });
      render();
    }).catch(function () {});
  }
  function playSlot(slot, loop) {
    var c = custom[slot]; if (!c) return false;
    stopSlot(slot);
    var a = new Audio(c.url); a.loop = !!loop; a.play().catch(function () {}); playing[slot] = a; return true;
  }
  function stopSlot(slot) { var a = playing[slot]; if (a) { try { a.pause(); a.currentTime = 0; } catch (e) {} delete playing[slot]; } }
  function stopAllSlots() { Object.keys(playing).forEach(stopSlot); }

  /* ---------- Sounds (nur am Pult) ---------- */
  var ac = null, drone = null;
  function ctx() { if (!ac) { var C = window.AudioContext || window.webkitAudioContext; if (C) ac = new C(); } if (ac && ac.state === "suspended") ac.resume(); return ac; }
  function tone(freq, start, dur, type, vol) {
    var c = ctx(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || "triangle"; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.25, c.currentTime + start + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
    o.connect(g); g.connect(c.destination); o.start(c.currentTime + start); o.stop(c.currentTime + start + dur + 0.05);
  }
  function stopDrone() { stopSlot("tension"); if (drone) { try { drone.g.gain.setTargetAtTime(0.0001, ac.currentTime, 0.2); var d = drone; setTimeout(function () { d.o.forEach(function (o) { o.stop(); }); }, 800); } catch (e) {} drone = null; } }
  function startDrone() {
    if (playing.tension) return;
    if (playSlot("tension", true)) return;
    var c = ctx(); if (!c || drone) return;
    var g = c.createGain(); g.gain.value = 0.0001; g.connect(c.destination);
    var lfo = c.createOscillator(), lg = c.createGain(); lfo.frequency.value = 1.1; lg.gain.value = 0.05; lfo.connect(lg); lg.connect(g.gain);
    var o1 = c.createOscillator(), o2 = c.createOscillator(); o1.type = "sawtooth"; o2.type = "sine"; o1.frequency.value = 55; o2.frequency.value = 110.6;
    var f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 320;
    o1.connect(f); o2.connect(f); f.connect(g);
    g.gain.setTargetAtTime(0.09, c.currentTime, 0.8);
    [o1, o2, lfo].forEach(function (o) { o.start(); });
    drone = { g: g, o: [o1, o2, lfo] };
  }
  function sfx(prev, next, patch) {
    if (!host.sound) return;
    if (next === "question" && (prev === "intro" || prev === "reveal")) {
      stopAllSlots();
      if (custom.start) { var a = custom.start && playSlot("start"); var st = playing.start; if (st) st.onended = function () { if (G.step === "question") startDrone(); }; if (!custom.tension) setTimeout(startDrone, 600); }
      else { [262, 330, 392].forEach(function (f, k) { tone(f, k * 0.12, 0.5, "triangle", 0.2); }); setTimeout(startDrone, 600); }
    }
    else if (next === "locked") { stopDrone(); stopSlot("start"); if (!playSlot("lock")) { tone(98, 0, 0.9, "sawtooth", 0.18); tone(147, 0, 0.9, "triangle", 0.15); } }
    else if (next === "reveal") {
      stopSlot("lock"); var ok = G.picked === Q[G.q].c;
      if (ok) { if (!playSlot("right")) [523, 659, 784, 1047].forEach(function (f, k) { tone(f, k * 0.11, 0.6, "triangle", 0.22); }); }
      else if (!playSlot("wrong")) { tone(196, 0, 0.5, "square", 0.12); tone(147, 0.4, 0.8, "square", 0.12); }
    }
    else if (next === "finale") { stopDrone(); stopAllSlots(); if (!playSlot("finale")) [392, 523, 659, 784, 659, 784, 1047].forEach(function (f, k) { tone(f, k * 0.16, k === 6 ? 1.6 : 0.4, "triangle", 0.25); }); }
    else if (patch && patch.fifty !== undefined) { tone(880, 0, 0.15, "sine", 0.2); tone(440, 0.15, 0.3, "sine", 0.2); }
    else if (next === "intro") { stopDrone(); stopAllSlots(); }
  }
  function suggestPoll() {
    var q = Q[G.q], left = [0, 1, 2, 3].filter(function (a) { return a !== q.c && !(G.fifty === G.q && q.fifty.indexOf(a) > -1); });
    var pct = [0, 0, 0, 0], main = 55 + Math.floor(Math.random() * 16); pct[q.c] = main; var rest = 100 - main;
    left.forEach(function (a, k) { var v = k === left.length - 1 ? rest : Math.floor(rest * (0.35 + Math.random() * 0.3)); pct[a] = v; rest -= v; });
    return pct;
  }

  app.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act]"); if (!b || !isHost()) return;
    var act = b.dataset.act, i = G.q;
    if (act === "start") commit({ step: "question", q: 0, picked: null });
    else if (act === "lock") commit({ step: "locked", picked: +b.dataset.v });
    else if (act === "unlock") commit({ step: "question", picked: null });
    else if (act === "reveal") commit({ step: "reveal" });
    else if (act === "next") commit(i === N - 1 ? { step: "finale" } : { step: "question", q: i + 1, picked: null });
    else if (act === "fifty") commit({ fifty: i });
    else if (act === "saal") commit({ saal: i });
    else if (act === "voteopen") { tally = {}; commit({ vote: { q: i, open: true, id: Math.random().toString(36).slice(2, 10), t: Date.now() } }); }
    else if (act === "voteclose") {
      var t = tallyCounts(), res = t.c.map(function (x) { return t.n ? Math.round(x * 100 / t.n) : 0; });
      commit({ vote: Object.assign({}, G.vote, { open: false }), poll: { q: i, pct: res, n: t.n } });
    }
    else if (act === "voteadjust") {
      var t2 = tallyCounts();
      host.pollDraft = t2.n ? t2.c.map(function (x) { return Math.round(x * 100 / t2.n); }) : suggestPoll(); render();
    }
    else if (act === "pollcancel") { host.pollDraft = null; render(); }
    else if (act === "poll") {
      var pct = [0, 1, 2, 3].map(function (p) { var el = document.getElementById("poll" + p); return Math.max(0, Math.min(100, parseInt(el && el.value, 10) || 0)); });
      commit({ vote: G.vote ? Object.assign({}, G.vote, { open: false }) : null, poll: { q: i, pct: pct } });
    }
    else if (act === "back") {
      if (G.step === "finale") commit({ step: "reveal", q: N - 1, picked: Q[N - 1].c });
      else if (G.step === "reveal") commit({ step: "locked" });
    }
    else if (act === "sound") { host.sound = !host.sound; if (!host.sound) stopDrone(); render(); }
    else if (act === "tension") { if (drone || playing.tension) stopDrone(); else startDrone(); }
    else if (act === "stopall") { stopDrone(); stopAllSlots(); }
    else if (act === "testslot") { var sl = b.dataset.slot; if (playing[sl]) stopSlot(sl); else playSlot(sl, false); }
    else if (act === "clearslot") { var s2 = b.dataset.slot; stopSlot(s2); if (custom[s2]) URL.revokeObjectURL(custom[s2].url); delete custom[s2]; idbPut(s2, null).then(render, render); }
    else if (act === "resend") send();
    else if (act === "resetask") { host.confirmReset = true; render(); }
    else if (act === "resetcancel") { host.confirmReset = false; render(); }
    else if (act === "reset") { stopDrone(); commit(Object.assign({}, FRESH)); }
  });
  app.addEventListener("toggle", function (e) { if (e.target.classList && e.target.classList.contains("sounds")) host.soundsOpen = e.target.open; }, true);
  app.addEventListener("change", function (e) {
    var inp = e.target; if (!isHost() || !inp.dataset || !inp.dataset.slot || !inp.files || !inp.files[0]) return;
    var f = inp.files[0], sl = inp.dataset.slot;
    custom[sl] = { name: f.name, url: URL.createObjectURL(f) };
    idbPut(sl, { name: f.name, blob: f }).then(render, render);
  });
  app.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-vote]"); if (!b || isHost()) return;
    sendVote(+b.dataset.vote);
  });
  window.addEventListener("hashchange", render);
  setInterval(function () { if (isHost() && votingNow()) pollVotes(); }, 2500);

  /* ---------- Start ---------- */
  if (isHost()) { try { var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null"); if (saved && saved.step) G = saved; } catch (e) {} }
  render();
  loadCustom();
  connectMqtt();
  poll().catch(function () {});
  // Sicherheitsnetz: ohne MQTT nach 6 s auf den zweiten Kanal wechseln, und alle 8 s nachsehen, solange nichts live ist
  setTimeout(function () { if (!mqOk) connectNtfy(); }, 6000);
  setInterval(function () { if (!mqOk && !(es && es.readyState === 1)) poll().catch(function () {}); }, 8000);
})();
