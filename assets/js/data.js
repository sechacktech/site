/* ==========================================================================
   SecHack — adatok és beállítások
   Ezt a fájlt szerkeszd: nem kell hozzányúlnod a HTML-hez vagy a main.js-hez.
   ========================================================================== */

/* 1. Beállítások ------------------------------------------------------------- */
window.SECHACK_CONFIG = {
  "contact": {
    "email": "pedro@sechack.hu"
  },
  "platforms": {
    "spotify": "",
    "apple": "",
    "youtube": "",
    "rss": "",
    "linkedin": ""
  }
};
/* contact.email: a kapcsolati e-mail-cím; a főoldali „Írj nekem” gombja ezt használja.
   Amíg üres, a gomb nem jelenik meg.
   platforms: a beállított webcímek (https://…) a láblécben jelennek meg; az üresek nem. */

/* 2. Témák ------------------------------------------------------------------- */
window.SECHACK_TOPICS = [
  {
    "slug": "jelszavak",
    "title": "Jelszavak és fiókvédelem",
    "icon": "key"
  },
  {
    "slug": "adathalaszat",
    "title": "Adathalászat és online csalások",
    "icon": "mail"
  },
  {
    "slug": "telefon",
    "title": "Okostelefonok biztonsága",
    "icon": "phone"
  },
  {
    "slug": "bongeszes",
    "title": "Biztonságos böngészés",
    "icon": "globe"
  },
  {
    "slug": "eszkozok",
    "title": "Ingyenes biztonsági eszközök",
    "icon": "sliders"
  },
  {
    "slug": "adatvedelem",
    "title": "Adatvédelem és digitális magánélet",
    "icon": "eye-off"
  },
  {
    "slug": "wifi",
    "title": "Wi-Fi és otthoni hálózatok",
    "icon": "wifi"
  },
  {
    "slug": "mentesek",
    "title": "Mentések és adatvédelem",
    "icon": "database"
  }
];

/* 3. Epizódok ---------------------------------------------------------------- */
/* Új epizód hozzáadása: másold be az alábbi sablont a [ ] közé (több epizód esetén vesszővel elválasztva),
   és töltsd ki. Amíg a lista üres, az oldalon „Az első epizódok hamarosan érkeznek” üzenet látszik.

   {
     id: "ep-01", number: 1, status: "published",
     topic: "jelszavak",              // a fenti témák slug-ja (szűréshez és a Témák oldalhoz)
     category: "JELSZAVAK",           // a kártyán megjelenő címke
     title: "Az epizód címe",
     description: "Rövid leírás.",
     duration: "12 perc",
     date: "2026-11-05",              // ÉÉÉÉ-HH-NN, vagy null
     links: { spotify: "", apple: "", youtube: "", audio: "", page: "" }
   }

   links: elég egyet megadni (https://…). Sorrend: spotify > apple > youtube > audio > page.
   Link nélküli epizódnál „Hamarosan” felirat jelenik meg. */
window.SECHACK_EPISODES = [];
