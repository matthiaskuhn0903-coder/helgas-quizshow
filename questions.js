// Fragen für Helgas Quizshow (Spielreihenfolge).
// c = Index der richtigen Antwort (0=A, 1=B, 2=C, 3=D)
// img = Bild zur Frage, imgReveal = Bild nach der Auflösung (optional)
// note = nur am Moderationspult sichtbar
// 50:50 streicht zufällig zwei falsche Antworten.
window.QUIZ = [
  {
    q: "Welchen dieser Sprüche hast du deinen beiden Söhnen NICHT mit auf den Weg gegeben?",
    a: ["Wo ein Wille ist, ist auch ein Weg", "Trau dich alles, mehr als Nein sagen können sie nicht", "Wer nichts macht, dem passiert auch nichts", "Iss deinen Teller leer, dann gibt's schönes Wetter"],
    c: 3,
    note: "Die anderen drei sind echte Helga-Sprüche. Zu C: Wenn jemand etwas anpackt und dabei etwas schiefgeht, z. B. etwas runterfällt, soll man sich nicht ärgern, denn immerhin hat er Initiative gezeigt. Gag: Fragen, wie das Wetter heute ist und ob alle ihren Teller leer gegessen haben."
  },
  {
    q: "An welchem Wochentag habt ihr beide geheiratet?",
    a: ["Donnerstag", "Freitag", "Samstag", "Sonntag"],
    c: 2,
    img: "img/hochzeit.jpg",
    note: "9.8.1986, ein Samstag. Am 9. August war der 40. Hochzeitstag."
  },
  {
    q: "Was berührst du auf diesem Foto?",
    a: ["Einen Hund", "Eine Puppe", "Einen Teddybär", "Eine Katze"],
    c: 3,
    img: "img/kindheit-raetsel.jpg?v=3",
    imgReveal: "img/kindheit-aufgeloest.jpg",
    note: "Nach der Auflösung erscheint das Foto ohne Verpixelung. Fragen, wie die Katze hieß und wer das andere Mädchen ist."
  },
  {
    q: "Du hast Matthias und Martin einmal zum Spiel 1. FC Nürnberg gegen FC Bayern ins Stadion geschickt. Wie ging das Spiel aus?",
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
    q: "Du siehst gleich vier Gesten. Welche davon war NIE ein Trend unter Jugendlichen?",
    a: ["Der Dab", "Das Einhorn", "Der Floss", "Six Seven"],
    c: 1,
    note: "VORFÜHRUNG, bevor du die Antworten vorliest: Lara macht den Dab (Kopf in die Armbeuge, anderer Arm schräg ausgestreckt, ca. 2015/16). David macht das Einhorn (Faust auf den Kopf klopfen, dann mit dem Finger in die Luft zeigen, erfunden, todernst vorführen!). Leo macht den Floss (Arme vor und hinter dem Körper schwingen, ca. 2018, Fortnite). Sarah macht Six Seven (Hände auf und ab wie eine Waage, 2025). Bonus bei der Auflösung: „Six Seven“ bedeutet übrigens gar nichts, das ist genau der Witz. Am Ende macht der ganze Saal Six Seven."
  },
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
    q: "Welche Aussage über diesen Song stimmt NICHT?",
    a: ["Der Song heißt „Dragostea din tei“", "Die Band O-Zone besteht aus drei Sängern", "Er war 2004 ein Sommerhit in ganz Europa", "Er hat den Eurovision Song Contest gewonnen"],
    c: 3,
    note: "MUSIK: Lara spielt den Song an, bevor du die Antworten vorliest. Alle mitsingen lassen („Ma-ia-hii, ma-ia-huu“). O-Zone kommen aus Moldau und waren nie beim ESC. Der Titel heißt übersetzt „Liebe unter den Lindenbäumen“."
  },
  {
    q: "Die Millionenfrage: In welcher Stadt steht diese Säule mit der goldenen Engelsfigur?",
    a: ["Berlin", "Mexiko-Stadt", "Budapest", "Paris"],
    c: 2,
    note: "Das Millenniumsdenkmal auf dem Heldenplatz in Budapest: 36 m hoch, oben Erzengel Gabriel, gebaut zum 1000-jährigen Bestehen Ungarns (1896). Gemein: Alle vier Städte haben eine ähnliche Säule mit goldener Figur (Berlin: Siegessäule mit der Goldelse, Mexiko-Stadt: Ángel de la Independencia, Paris: Julisäule auf der Place de la Bastille). Nach der Auflösung: „Und genau da wirst du bald stehen!“ Dann auf „Zum Finale“ klicken: „Dein Hauptgewinn ist eine Flusskreuzfahrt auf der Donau, mit Halt in Budapest!“ Luftschlangen-Kanone und Bordkarte."
  }
];
