// Fragen für Helgas Quizshow (vorläufige Reihenfolge).
// c = Index der richtigen Antwort (0=A, 1=B, 2=C, 3=D)
// img = Bild zur Frage, imgReveal = Bild nach der Auflösung (optional)
// note = nur am Moderationspult sichtbar
// 50:50 streicht zufällig zwei falsche Antworten.
window.QUIZ = [
  {
    q: "Auf welchem Berg bist du mit Ursula als Kind Schlitten gefahren?",
    a: ["Annaberg", "Gritzberg", "Kakauberg", "Schneekoppe"],
    c: 1,
    note: "Frage kommt von Ursula. Lass sie erzählen, wie das damals war: Wer ist am häufigsten im Schnee gelandet?"
  },
  {
    q: "Wie viele Schulen gab es in Karb, als du dort Kind warst?",
    a: ["2", "3", "4", "5"],
    c: 2,
    note: "Frage kommt von Ursula. Danach fragen, auf welche der vier Schulen die beiden gegangen sind und wie ihr Schulweg war."
  },
  {
    q: "Was berührst du auf diesem Foto? (Du bist rechts im Bild.)",
    a: ["Einen Hund", "Eine Puppe", "Einen Teddybär", "Eine Katze"],
    c: 3,
    img: "img/kindheit-raetsel.jpg?v=2",
    imgReveal: "img/kindheit-aufgeloest.jpg",
    note: "Nach der Auflösung erscheint das Foto ohne Verpixelung. Fragen, wie die Katze hieß und wer das andere Mädchen ist."
  },
  {
    q: "Du hast Matthias und deinen Mann einmal zum Spiel 1. FC Nürnberg gegen FC Bayern ins Stadion geschickt. Wie ging das Spiel aus?",
    a: ["0:0", "3:0 für Bayern", "2:1 für Nürnberg", "3:0 für Nürnberg"],
    c: 3,
    note: "2. Februar 2007, Bundesliga im Frankenstadion. Tore: Saenko, Schroth, Vittek, Oliver Kahn stand bei Bayern im Tor. Eine echte Sensation, und du als Bayern-Fan mittendrin. Kurz erzählen, wie die Heimfahrt war."
  },
  {
    q: "„Dem lebhaften, motorisch sehr unruhigen Schüler fällt es nicht immer leicht, die Regeln des Schulalltags einzuhalten.“ In wessen Zeugnis stand dieser Satz?",
    a: ["Darius", "Thomas", "Leo", "David"],
    c: 2,
    note: "Leo ist da: Bitte ihn aufzustehen und frag, was er damals angestellt hat."
  },
  {
    q: "Welchen dieser Sprüche hast du deinen beiden Söhnen NICHT mit auf den Weg gegeben?",
    a: ["Wo ein Wille ist, ist auch ein Weg", "Trau dich alles, mehr als Nein sagen können sie nicht", "Wer nichts macht, dem passiert auch nichts", "Iss deinen Teller leer, dann gibt's schönes Wetter"],
    c: 3,
    note: "Die anderen drei sind echte Helga-Sprüche. Zu C: Wenn jemand etwas anpackt und dabei etwas schiefgeht, z. B. etwas runterfällt, soll man sich nicht ärgern, denn immerhin hat er Initiative gezeigt. Gag: Fragen, wie das Wetter heute ist und ob alle ihren Teller leer gegessen haben."
  },
  {
    q: "An welchem Wochentag habt ihr beide geheiratet?",
    a: ["Donnerstag", "Freitag", "Samstag", "Sonntag"],
    c: 1,
    img: "img/hochzeit.jpg",
    note: "8.8.1986, ein Freitag. Im August war der 40. Hochzeitstag. Samstag ist die typische Falle."
  }
];
