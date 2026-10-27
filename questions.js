// Fragen für Helgas Quizshow.
// c = Index der richtigen Antwort (0=A, 1=B, 2=C, 3=D)
// fifty = die zwei falschen Antworten, die beim 50:50 verschwinden
// img = optionaler Bildpfad, z. B. "img/frage3.jpg"
// note = nur für den Moderator sichtbar
window.QUIZ = [
  {
    q: "Was feiert man am 31. Oktober?",
    a: ["Nikolaus", "Halloween", "Reformationstag", "Halloween und Reformationstag"],
    c: 3, fifty: [0, 2], img: "",
    note: "BEISPIELFRAGE – wird durch echte Fragen ersetzt."
  },
  {
    q: "Wo findet die heutige Sendung statt?",
    a: ["In Köln-Hürth", "Im Petzengarten", "In Hollywood", "Im Wohnzimmer"],
    c: 1, fifty: [0, 2], img: "",
    note: "BEISPIELFRAGE – wird durch echte Fragen ersetzt."
  },
  {
    q: "Was passiert beim 50:50-Joker?",
    a: ["Zwei falsche Antworten verschwinden", "Die Frage wird halbiert", "Der Gewinn wird halbiert", "Der Moderator rät mit"],
    c: 0, fifty: [1, 3], img: "",
    note: "BEISPIELFRAGE – wird durch echte Fragen ersetzt."
  }
];
