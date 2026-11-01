
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  onValue,
  runTransaction
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

// ============================================
// HISTORY ARENA - 31 QUESTIONS
// ============================================

const QUESTIONS = [
  // ΕΝΟΤΗΤΑ 1 — Το Μεγάλο Σχίσμα
  {
    q: "Ποια ήταν η άποψη της Ανατολικής Εκκλησίας σχετικά με την εξουσία του Πάπα;",
    a: [
      "Θεωρούσε ότι ο Πάπας είχε ανώτατη εξουσία σε ολόκληρη την Εκκλησία.",
      "Αρνιόταν οποιαδήποτε αναγνώριση του επισκόπου της Ρώμης.",
      "Αναγνώριζε την πρώτη θέση τιμής, αλλά όχι εξουσία πάνω στους άλλους Πατριάρχες."
    ],
    correct: 2,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Hagia%20Sophia%20Istanbul%20Turkey.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Τι υποστήριζε η Δυτική Εκκλησία για τον Πάπα;",
    a: [
      "Ότι ως διάδοχος του Αποστόλου Πέτρου είχε ιδιαίτερη εξουσία για ολόκληρη την Εκκλησία.",
      "Ότι οι αποφάσεις έπρεπε να λαμβάνονται αποκλειστικά από Συνόδους.",
      "Ότι δεν είχε θρησκευτική εξουσία πέρα από τη Ρώμη."
    ],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/St%20Peter%27s%20Basilica%20Vatican.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Τι σημαίνει η λατινική λέξη Filioque;",
    a: ["Και εκ του Πατρός.", "Δια του Πνεύματος.", "Και εκ του Υιού."],
    correct: 2,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Trinity%20Holy%20Spirit%20dove.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Πότε επικράτησε η προσθήκη του Filioque στη λειτουργική λατρεία της Ρώμης;",
    a: ["Το 1014.", "Το 1054.", "Το 800."],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Vatican%20St%20Peter%27s%20Square.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Ποια ήταν η κύρια γλώσσα της Ανατολικής Εκκλησίας στη θεολογία και στη λατρεία;",
    a: ["Η λατινική.", "Η συριακή.", "Η ελληνική."],
    correct: 2,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Byzantine%20mosaic%20Hagia%20Sophia.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Ποιος ήταν επικεφαλής των απεσταλμένων του Πάπα που πήγαν στην Κωνσταντινούπολη τον Ιούλιο του 1054;",
    a: ["Ο Πατριάρχης Μιχαήλ Κηρουλάριος.", "Ο Απόστολος Πέτρος.", "Ο καρδινάλιος Ουμβέρτος."],
    correct: 2,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Hagia%20Sophia%20Istanbul.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Πώς απάντησε ο Πατριάρχης Κωνσταντινουπόλεως στην πράξη των παπικών απεσταλμένων το 1054;",
    a: [
      "Συγκάλεσε Σύνοδο και αφόρισε τους παπικούς απεσταλμένους.",
      "Υπέγραψε συνθήκη ειρήνης.",
      "Έφυγε από την Κωνσταντινούπολη."
    ],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Hagia%20Sophia%20interior.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Πού βρισκόταν πολιτικά η Ανατολική Εκκλησία;",
    a: [
      "Στη Ρωμαϊκή Αυτοκρατορία, συνεργαζόμενη με τον Πάπα.",
      "Στη Βυζαντινή Αυτοκρατορία, συνεργαζόμενη στενά με τον αυτοκράτορα.",
      "Ήταν ανεξάρτητη από κάθε πολιτική αρχή."
    ],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Byzantine%20Empire%201000%20map.jpg",
    credit: "Wikimedia Commons"
  },

  // ΕΝΟΤΗΤΑ 2 — Συνέπειες και Σταυροφορίες
  {
    q: "Σε ποιες δύο Εκκλησίες χωρίστηκε ο Χριστιανισμός;",
    a: ["Ορθόδοξη και Προτεσταντική.", "Ορθόδοξη και Ρωμαιοκαθολική.", "Καθολική και Αγγλικανική."],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Christianity%20branches.svg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Ποιος Πατριάρχης ενίσχυσε σταδιακά την πνευματική του κυριαρχία στην Ανατολή;",
    a: ["Πατριάρχης Αλεξανδρείας.", "Πατριάρχης Αντιοχείας.", "Πατριάρχης Κωνσταντινουπόλεως."],
    correct: 2,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Patriarchal%20Church%20of%20St%20George%20Istanbul.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Ποια σημαντική ήττα υπέστη το Βυζάντιο το 1071;",
    a: ["Ήττα στο Ματζικέρτ.", "Άλωση της Κωνσταντινούπολης.", "Ήττα στη Ναυμαχία της Ναυπάκτου."],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Battle%20of%20Manzikert.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Τι συνέβη στις σχέσεις Ανατολής και Δύσης μετά το Σχίσμα;",
    a: ["Βελτιώθηκαν.", "Αυξήθηκαν η αντιπαλότητα και η δυσπιστία.", "Δεν άλλαξε τίποτα."],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Great%20Schism%201054.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Ποια Σταυροφορία οδήγησε στην κατάληψη της Κωνσταντινούπολης;",
    a: ["Πρώτη.", "Δεύτερη.", "Τέταρτη."],
    correct: 2,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Conquest%20of%20Constantinople%201204.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Τι προσπάθησαν να επιβάλουν οι Δυτικοί στις περιοχές που κατέκτησαν;",
    a: ["Τα λατινικά ήθη και έθιμα.", "Τα αρχαία ελληνικά έθιμα.", "Τα βυζαντινά έθιμα."],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Crusaders%20Constantinople%201204.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Ποιο κίνημα εμφανίστηκε αργότερα στη Δυτική Εκκλησία;",
    a: ["Ο Ανθρωπισμός.", "Ο Προτεσταντισμός.", "Η Αναγέννηση."],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Martin%20Luther%20by%20Lucas%20Cranach.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Το Σχίσμα ενίσχυσε την ενότητα Ανατολής και Δύσης.",
    a: ["Σωστό.", "Λάθος."],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Great%20Schism%20map.svg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Η Τέταρτη Σταυροφορία έγινε την περίοδο 1202–1204.",
    a: ["Σωστό.", "Λάθος."],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Fourth%20Crusade%20map.png",
    credit: "Wikimedia Commons"
  },
  {
    q: "Στην Ανατολή διατηρήθηκε το συνοδικό σύστημα διοίκησης της Εκκλησίας.",
    a: ["Σωστό.", "Λάθος."],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Orthodox%20bishops%20council.jpg",
    credit: "Wikimedia Commons"
  },

  // ΕΝΟΤΗΤΑ 3 — Ιστορικά έργα τέχνης
  {
    q: "Πότε δημιουργήθηκε η «Πομπή των Μάγων»;",
    a: ["1755–1756.", "1459–1460.", "1982–1983.", "1023–1024."],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Benozzo%20Gozzoli%20-%20Procession%20of%20the%20Magi.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Σε ποιο χρονικό υπήρχαν οι συγκεκριμένες μικρογραφίες;",
    a: ["Ευγένιου Ντελακρουά.", "Ιωάννη Η΄ Παλαιολόγου.", "Ιωάννη Σκυλίτζη.", "Μιχαήλ Κηρουλάριου."],
    correct: 2,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Skylitzes%20Chronicle.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Πού βρίσκεται το έργο «Η Είσοδος των Σταυροφόρων στην Κωνσταντινούπολη»;",
    a: ["Στο Λούβρο.", "Στην Αγία Σοφία.", "Στο Παρεκκλήσι των Μάγων της Φλωρεντίας.", "Στο Βρετανικό Μουσείο."],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Delacroix%20-%20The%20Entry%20of%20the%20Crusaders%20into%20Constantinople.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Πότε συνέβη επισήμως το Μεγάλο Σχίσμα μεταξύ Ανατολικής και Δυτικής Εκκλησίας;",
    a: ["1204", "1054", "1453"],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Sainte-Sophie-mosaique-empereur-offrant-basilique.jpg?width=1000",
    credit: "Wikimedia Commons · Βυζαντινό ψηφιδωτό της Αγίας Σοφίας"
  },
  {
    q: "Ποιος Βυζαντινός αυτοκράτορας επεδίωξε την ένωση των Εκκλησιών στη Σύνοδο της Λυών (1274);",
    a: [
      "Μιχαήλ Η΄ Παλαιολόγος",
      "Ιωάννης Η΄ Παλαιολόγος",
      "Κωνσταντίνος ΙΑ΄ Παλαιολόγος"
    ],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/152_-_Michael_VIII_Palaiologos_%28Mutinensis_-_color%29.png?width=900",
    credit: "Wikimedia Commons · Μικρογραφία του Μιχαήλ Η΄ Παλαιολόγου"
  },
  {
    q: "Ποιο ήταν το κύριο κίνητρο των Βυζαντινών αυτοκρατόρων για την άρση του Σχίσματος κατά τον Μεσαίωνα;",
    a: [
      "Η αλλαγή των θρησκευτικών τους πεποιθήσεων",
      "Η εξασφάλιση στρατιωτικής και πολιτικής βοήθειας από τη Δύση",
      "Η επέκταση της αυτοκρατορίας προς τη δυτική Ευρώπη"
    ],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Michael_VIII_Palaiologos.jpg?width=900",
    credit: "Wikimedia Commons · Απεικόνιση του Μιχαήλ Η΄"
  },
  {
    q: "Γιατί απέτυχε τελικά η προσπάθεια ένωσης στη Σύνοδο της Λυών;",
    a: [
      "Επειδή δεν εμφανίστηκε η βυζαντινή αντιπροσωπεία",
      "Λόγω των μεγάλων αξιώσεων του Πάπα και των έντονων αντιδράσεων στην Ανατολή",
      "Επειδή μεσολάβησε η Άλωση της Πόλης"
    ],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Union_1439.jpg?width=1000",
    credit: "Wikimedia Commons · Έγγραφο της Ένωσης του 1439"
  },
  {
    q: "Ποια ήταν η δεύτερη πολύ σημαντική Σύνοδος που έγινε τον 15ο αιώνα (1438–1439) για την ένωση των Εκκλησιών;",
    a: [
      "Η Σύνοδος της Νίκαιας",
      "Η Σύνοδος της Φερράρας-Φλωρεντίας",
      "Η Σύνοδος της Κωνσταντινούπολης"
    ],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Council-Florence.png?width=900",
    credit: "Wikimedia Commons · Σύνοδος της Φλωρεντίας"
  },
  {
    q: "Ποιο δογματικό ζήτημα σχετικά με το Άγιο Πνεύμα αποτελούσε το βασικό αγκάθι στις συζητήσεις για την ένωση;",
    a: [
      "Η προσθήκη του «Filioque» (και εκ του Υιού) στο Σύμβολο της Πίστεως",
      "Ο τρόπος με τον οποίο γίνεται η βάπτιση",
      "Η γλώσσα στην οποία γράφονται τα εκκλησιαστικά βιβλία"
    ],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Filioque.JPG?width=1000",
    credit: "Wikimedia Commons · Η διατύπωση Filioque"
  },
  {
    q: "Ποιος κορυφαίος Έλληνας ιεράρχης αρνήθηκε κατηγορηματικά να υπογράψει τον όρο της Ένωσης στη Φλωρεντία;",
    a: [
      "Ο Πατριάρχης Ιωσήφ Β΄",
      "Ο Μάρκος ο Ευγενικός (Επίσκοπος Εφέσου)",
      "Ο Βησσαρίων ο Νικαίας"
    ],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Mark_of_Ephesus.jpg?width=800",
    credit: "Wikimedia Commons · Τοιχογραφία του Μάρκου Ευγενικού"
  },
  {
    q: "Πώς αντέδρασε η συντριπτική πλειοψηφία του ορθόδοξου λαού στην υπογραφή της ένωσης στη Φλωρεντία;",
    a: [
      "Την απέρριψε σθεναρά, θεωρώντας την προδοσία της πίστης",
      "Την αποδέχθηκε αμέσως με μεγάλους πανηγυρισμούς",
      "Αδιαφόρησε πλήρως για το αποτέλεσμα"
    ],
    correct: 0,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Firenze-bolla-unione.jpg?width=1000",
    credit: "Wikimedia Commons · Η βούλα της Ένωσης του 1439"
  },
  {
    q: "Ποιοι θρησκευτικοί ηγέτες έκαναν το πρώτο ιστορικό βήμα συμφιλίωσης συναντώμενοι στα Ιεροσόλυμα το 1964;",
    a: [
      "Ο Πάπας Ιωάννης Παύλος Β΄ και ο Πατριάρχης Βαρθολομαίος",
      "Ο Πάπας Παύλος ΣΤ΄ και ο Οικουμενικός Πατριάρχης Αθηναγόρας",
      "Ο Πάπας Λέων Θ΄ και ο Πατριάρχης Μιχαήλ Κηρουλάριος"
    ],
    correct: 1,
    img: "https://wp.en.aleteia.org/wp-content/uploads/sites/2/2024/01/Pope-Paul-VI-meets-Orthodox-Patriarch-Athenagoras-I-AFP-000_ARP2291317.jpg",
    credit: "Greek Orthodox Archdiocese of America · Συνάντηση Παύλου ΣΤ΄ και Αθηναγόρα"
  },
  {
    q: "Τι συνέβη τελικά στις 7 Δεκεμβρίου του 1965 που άλλαξε τις σχέσεις των δύο Εκκλησιών;",
    a: [
      "Ενώθηκαν οριστικά οι δύο Εκκλησίες σε μία",
      "Έγινε ταυτόχρονη ανάκληση των αμοιβαίων αφορισμών (αναθεμάτων) του 1054",
      "Καταργήθηκε το πρωτείο του Πάπα"
    ],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/2019-07-25_Interior_of_Hagia_Sophia_1.jpg?width=1000",
    credit: "Wikimedia Commons · Εσωτερικό της Αγίας Σοφίας"
  },

  // ΕΝΟΤΗΤΑ 4 — Πρόσθετες ερωτήσεις
  {
    q: "Πότε έγινε το Σχίσμα των Εκκλησιών;",
    a: ["1045", "1053", "1049", "1054"],
    correct: 3,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Sainte-Sophie-mosaique-empereur-offrant-basilique.jpg?width=1000",
    credit: "Wikimedia Commons"
  },
  {
    q: "Ποιον επικεφαλής της αποστολής έστειλε ο Πάπας Λέων Θ΄ στην Κωνσταντινούπολη για να επιλύσει τις διαφορές με το Πατριαρχείο;",
    a: ["Τον επίσκοπο Αλεξανδρείας", "Τον καρδινάλιο Ουμβέρτο", "Τον αυτοκράτορα Κωνσταντίνο Θ΄ Μονομάχο", "Τον αρχιεπίσκοπο Καντουαρίας"],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Hagia%20Sophia%20Istanbul.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Ο Πατριάρχης Μιχαήλ Κηρουλάριος κατέθεσε στην Αγία Τράπεζα της Αγίας Σοφίας έγγραφο αφορισμού.",
    a: ["Σωστό", "Λάθος"],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/2019-07-25_Interior_of_Hagia_Sophia_1.jpg?width=1000",
    credit: "Wikimedia Commons"
  },
  {
    q: "Ποιο ήταν το τελικό αποτέλεσμα των διαπραγματεύσεων και των εντάσεων μεταξύ της παπικής αντιπροσωπείας και του Πατριάρχη Μιχαήλ Κηρουλάριου;",
    a: ["Η πλήρης ένωση της Εκκλησίας", "Αμοιβαίος αφορισμός και η οριστική ρήξη των δύο Εκκλησιών", "Η υπογραφή συνθήκης ειρήνης", "Η μεταφορά της έδρας του Πατριαρχείου στη Ρώμη"],
    correct: 1,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Hagia%20Sophia%20interior.jpg",
    credit: "Wikimedia Commons"
  },
  {
    q: "Τι αποφάσισε η Σύνοδος που συγκάλεσε ο Πατριάρχης Μιχαήλ Κηρουλάριος στις 24 Ιουλίου 1054;",
    a: ["Την αλλαγή θρησκεύματος", "Την έναρξη νέων μακροχρόνιων θεολογικών συνομιλιών για το Filioque", "Την καταδίκη και τον αφορισμό των παπικών απεσταλμένων", "Την αποδοχή των παπικών αξιώσεων περί πρωτείου δικαιοδοσίας"],
    correct: 2,
    img: "https://commons.wikimedia.org/wiki/Special:FilePath/Hagia%20Sophia%20Istanbul%20Turkey.jpg",
    credit: "Wikimedia Commons"
  }

];

// ============================================
// FIREBASE INITIALIZATION
// ============================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const $ = id => document.getElementById(id);
const mode = new URLSearchParams(location.search).get("mode") || "host";

let uid = null;
let roomCode = null;
let room = null;
let playerId = null;
let unsubscribeRoom = null;
let timerInterval = null;
let ticking = false;
let lastPlayerState = "";

const roomRef = code => ref(db, `rooms/${code}`);
const players = () => Object.values(room?.players || {});

function makeCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

function show(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.add("hidden");
  });
  $(id).classList.remove("hidden");
}

function reportError(error, target = null) {
  console.error("History Arena Firebase error:", error);
  const message = error.code || error.message || String(error);
  if (target && $(target)) {
    $(target).textContent = "Firebase: " + message;
  } else {
    alert("Σφάλμα Firebase: " + message);
  }
}

function sortedPlayers() {
  return players().sort((a, b) => b.score - a.score);
}

function playerUrl() {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("mode", "player");
  return url.href;
}

// ============================================
// DATABASE LISTENER
// ============================================

function listenRoom(code) {
  if (unsubscribeRoom) unsubscribeRoom();
  roomCode = code;

  unsubscribeRoom = onValue(
    roomRef(code),
    snapshot => {
      room = snapshot.val();

      if (!room) {
        if (mode === "player") {
          $("joinError").textContent = "Το δωμάτιο δεν υπάρχει πλέον.";
          show("playerScreen");
          $("playerJoinPanel").classList.remove("hidden");
        }
        return;
      }

      if (mode === "host") {
        renderHost();
      } else if (playerId) {
        renderPlayer();
      }
    },
    error => reportError(error, mode === "player" ? "joinError" : null)
  );
}

// Atomic host updates
async function updateRoom(transform) {
  if (!roomCode || !uid) return false;

  const result = await runTransaction(
    roomRef(roomCode),
    current => {
      if (!current || current.hostUid !== uid) return;
      return transform(current);
    },
    { applyLocally: false }
  );

  return result.committed;
}

// Image src is changed only when the question changes.
// If the external URL fails, show an embedded SVG placeholder.
const IMAGE_FALLBACK = "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="#1c2745"/><text x="300" y="180" text-anchor="middle" font-family="Arial" font-size="28" fill="#e8bd72">HISTORY ARENA</text><text x="300" y="225" text-anchor="middle" font-family="Arial" font-size="20" fill="#f4f2ed">Η εικόνα δεν είναι διαθέσιμη</text></svg>`);

function loadQuestionImage(imageId, creditId, question) {
  const image = $(imageId);
  const credit = $(creditId);
  if (image.dataset.questionSrc === question.img) return;

  image.dataset.questionSrc = question.img;
  credit.textContent = question.credit || "";
  image.style.visibility = "visible";
  image.onerror = () => {
    console.warn("Image unavailable:", question.img);
    image.onerror = null; // avoid infinite fallback loop
    image.src = IMAGE_FALLBACK;
    credit.textContent = "Η εικόνα δεν είναι διαθέσιμη";
  };
  image.src = question.img || IMAGE_FALLBACK;
}

// ============================================
// HOST: CREATE ROOM
// ============================================

async function createRoom() {
  try {
    clearInterval(timerInterval);
    timerInterval = null;

    if (!uid) {
      throw new Error("Δεν ολοκληρώθηκε η σύνδεση Firebase.");
    }

    $("createRoomBtn").disabled = true;

    for (let i = 0; i < 30; i++) {
      const code = makeCode();

      const initial = {
        code: code,
        hostUid: uid,
        status: "lobby",
        questionIndex: -1,
        timeLeft: 20,
        players: {},
        roundResults: {}
      };

      const result = await runTransaction(
        roomRef(code),
        current => {
          if (current !== null) return;
          return initial;
        },
        { applyLocally: false }
      );

      if (result.committed) {
        console.log("Room created:", code);
        listenRoom(code);
        show("hostScreen");
        return;
      }
    }

    throw new Error("Αδυναμία δημιουργίας κωδικού δωματίου.");
  } catch (error) {
    reportError(error);
  } finally {
    $("createRoomBtn").disabled = false;
  }
}

// ============================================
// HOST: LOBBY
// ============================================

function renderLobby() {
  const list = players();

  $("playerCount").textContent = list.length;
  $("startGameBtn").disabled = list.length === 0;

  $("lobbyPlayers").classList.toggle("empty-list", list.length === 0);

  $("lobbyPlayers").innerHTML = list.length
    ? list.map((p, i) =>
      `<span class="player-chip">${i + 1}. ${escapeHtml(p.name)}</span>`
    ).join("")
    : "Περιμένουμε τους πρώτους παίκτες…";
}

// ============================================
// HOST: START QUESTION
// ============================================

async function startQuestion() {
  try {
    await updateRoom(r => {
      if (!["lobby", "result"].includes(r.status)) return;
      if (r.questionIndex >= QUESTIONS.length - 1) return;

      r.status = "question";
      r.questionIndex++;
      r.timeLeft = 20;

      Object.values(r.players || {}).forEach(p => {
        p.answer = -1;
        p.answeredAt = -1;
        p.lastPoints = 0;
      });

      return r;
    });
  } catch (error) {
    reportError(error);
  }
}

function renderHostQuestion() {
  const q = QUESTIONS[room.questionIndex];
  if (!q) return;

  $("questionCounter").textContent =
    `ΕΡΩΤΗΣΗ ${String(room.questionIndex + 1).padStart(2, "0")} / ${QUESTIONS.length}`;

  $("hostQuestionText").textContent = q.q;

  $("hostAnswers").innerHTML = q.a.map((answer, i) =>
    `<div><b>${"ABCD"[i]}</b>${escapeHtml(answer)}</div>`
  ).join("");

  
  loadQuestionImage("hostQuestionImage", "hostImageCredit", q);

  $("hostTimer").textContent = room.timeLeft;
  $("hostProgress").style.width = room.timeLeft * 5 + "%";

  $("answerCount").textContent =
    `${players().filter(p => p.answer !== -1).length} / ${players().length}`;

  $("revealBtn").disabled =
    room.timeLeft > 0 && players().some(p => p.answer === -1);

  $("hostSubtitle").textContent =
    `Ερώτηση ${room.questionIndex + 1} από ${QUESTIONS.length}`;
}

// ============================================
// HOST: TIMER
// ============================================

async function tick() {
  if (ticking || !room || room.status !== "question") return;

  ticking = true;

  try {
    await updateRoom(r => {
      if (r.status !== "question" || r.timeLeft <= 0) return;

      r.timeLeft = Math.max(0, r.timeLeft - 1);
      return r;
    });

    if (room?.status === "question" && room.timeLeft <= 0) {
      await revealResults();
    }
  } catch (error) {
    reportError(error);
  } finally {
    ticking = false;
  }
}

// ============================================
// HOST: RESULTS
// ============================================

async function revealResults() {
  try {
    await updateRoom(r => {
      if (r.status !== "question") return;

      const q = QUESTIONS[r.questionIndex];
      r.status = "result";

      Object.values(r.players || {}).forEach(p => {
        let points = 0;

        if (p.answer === q.correct) {
          const elapsed = p.answeredAt < 0 ? 20 : p.answeredAt;
          points = Math.round(500 + 500 * (20 - elapsed) / 20);
        }

        p.score += points;
        p.lastPoints = points;
      });

      r.roundResults ||= {};
      r.roundResults[r.questionIndex] = q.correct;

      return r;
    });
  } catch (error) {
    reportError(error);
  }
}

function leaderboardHTML(round = false) {
  const list = sortedPlayers();

  if (!list.length) {
    return '<p class="muted">Δεν υπάρχουν παίκτες.</p>';
  }

  return list.map((p, i) => `
    <div class="leader-row ${i === 0 ? "first" : ""}">
      <span class="rank">${String(i + 1).padStart(2, "0")}</span>
      <span class="leader-name">
        ${escapeHtml(p.name)}
        ${round && p.lastPoints
          ? `<small style="color:#75d1aa">+${p.lastPoints}</small>`
          : ""}
      </span>
      <span class="leader-score">
        ${p.score.toLocaleString("el-GR")} pts
      </span>
    </div>
  `).join("");
}

async function finishGame() {
  try {
    await updateRoom(r => {
      if (r.status !== "result") return;
      r.status = "finished";
      return r;
    });
  } catch (error) {
    reportError(error);
  }
}

// ============================================
// HOST: SCREEN RENDERING
// ============================================

function renderHost() {
  $("roomCode").textContent = room.code;
  $("playerUrl").textContent = playerUrl();

  const status = room.status;

  [
    "lobbyPanel",
    "questionHostPanel",
    "resultHostPanel",
    "finalHostPanel"
  ].forEach(id => $(id).classList.add("hidden"));

  if (status !== "question" && timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (status === "lobby") {
    $("lobbyPanel").classList.remove("hidden");
    $("hostTitle").textContent = "Το δωμάτιό σου";
    $("hostSubtitle").textContent = "Περίμενε να συνδεθούν οι παίκτες.";
    renderLobby();
  }

  if (status === "question") {
    $("questionHostPanel").classList.remove("hidden");
    renderHostQuestion();

    if (!timerInterval) {
      timerInterval = setInterval(tick, 1000);
    }

    if (room.timeLeft <= 0) revealResults();
  }

  if (status === "result") {
    $("resultHostPanel").classList.remove("hidden");

    const q = QUESTIONS[room.questionIndex];

    $("correctAnswerText").textContent =
      `Σωστή απάντηση: ${"ABCD"[q.correct]}) ${q.a[q.correct]}`;

    $("roundLeaderboard").innerHTML = leaderboardHTML(true);

    $("nextQuestionBtn").textContent =
      room.questionIndex === QUESTIONS.length - 1
        ? "Τελική κατάταξη →"
        : "Επόμενη ερώτηση →";
  }

  if (status === "finished") {
    $("finalHostPanel").classList.remove("hidden");

    const winner = sortedPlayers()[0];

    $("winnerName").textContent = winner?.name || "—";
    $("winnerScore").textContent = winner
      ? `${winner.score.toLocaleString("el-GR")} συνολικοί πόντοι`
      : "";

    $("finalLeaderboard").innerHTML = leaderboardHTML();
    $("hostTitle").textContent = "Η πρόκληση ολοκληρώθηκε";
    $("hostSubtitle").textContent = "Η τελική κατάταξη των παικτών.";
  }
}

function startHost() {
  show("homeScreen");

  $("createRoomBtn").addEventListener("click", createRoom);
  $("startGameBtn").addEventListener("click", startQuestion);
  $("revealBtn").addEventListener("click", revealResults);

  $("nextQuestionBtn").addEventListener("click", () => {
    if (room.questionIndex === QUESTIONS.length - 1) {
      finishGame();
    } else {
      startQuestion();
    }
  });

  $("restartBtn").addEventListener("click", createRoom);

  $("copyLinkBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(playerUrl());
      $("copyLinkBtn").textContent = "✓";
    } catch (error) {
      reportError(error);
    }
  });
}

// ============================================
// PLAYER: JOIN
// ============================================

async function playerJoin() {
  const code = $("roomInput").value.trim();
  const name = $("nameInput").value.trim();

  $("joinError").textContent = "";

  if (!/^\d{4}$/.test(code) || !name) {
    $("joinError").textContent =
      "Συμπλήρωσε τετραψήφιο κωδικό και όνομα.";
    return;
  }

  try {
    $("joinBtn").disabled = true;

    const snapshot = await get(roomRef(code));

    if (!snapshot.exists()) {
      $("joinError").textContent =
        "Δεν βρέθηκε δωμάτιο με αυτόν τον κωδικό.";
      return;
    }

    const currentRoom = snapshot.val();

    if (currentRoom.status !== "lobby") {
      $("joinError").textContent = "Το παιχνίδι έχει ήδη ξεκινήσει.";
      return;
    }

    if (Object.values(currentRoom.players || {}).some(p =>
      p.name.toLocaleLowerCase("el") === name.toLocaleLowerCase("el")
    )) {
      $("joinError").textContent = "Αυτό το όνομα χρησιμοποιείται ήδη.";
      return;
    }

    const playerRef = ref(db, `rooms/${code}/players/${uid}`);

    const result = await runTransaction(
      playerRef,
      current => {
        if (current !== null) return;

        return {
          id: uid,
          name,
          score: 0,
          answer: -1,
          answeredAt: -1,
          lastPoints: 0
        };
      },
      { applyLocally: false }
    );

    if (!result.committed) {
      $("joinError").textContent =
        "Έχεις ήδη συνδεθεί σε αυτό το δωμάτιο.";
      return;
    }

    playerId = uid;
    $("playerWelcomeName").textContent = name + "!";

    listenRoom(code);
  } catch (error) {
    reportError(error, "joinError");
  } finally {
    $("joinBtn").disabled = false;
  }
}

// ============================================
// PLAYER: ANSWERS
// ============================================

async function submitAnswer(index) {
  if (!roomCode || !playerId || room?.status !== "question") return;

  try {
    const elapsed = Math.min(20, Math.max(0, 20 - room.timeLeft));

    const answerRef = ref(db, `rooms/${roomCode}/players/${playerId}`);

    const result = await runTransaction(
      answerRef,
      player => {
        if (!player || player.answer !== -1) return;

        player.answer = index;
        player.answeredAt = elapsed;

        return player;
      },
      { applyLocally: false }
    );

    if (result.committed) {
      $("playerAnswerFeedback").textContent =
        "Η απάντησή σου καταχωρίστηκε!";
    }
  } catch (error) {
    reportError(error);
  }
}

// ============================================
// PLAYER: SCREENS
// ============================================

function renderPlayer() {
  if (!room || !playerId) return;

  const p = room.players?.[playerId];
  if (!p) return;

  [
    "playerJoinPanel",
    "playerWaitingPanel",
    "playerQuestionPanel",
    "playerResultPanel",
    "playerFinalPanel"
  ].forEach(id => $(id).classList.add("hidden"));

  if (room.status === "lobby") {
    $("playerWaitingPanel").classList.remove("hidden");
    return;
  }

  if (room.status === "question") {
    $("playerQuestionPanel").classList.remove("hidden");

    const q = QUESTIONS[room.questionIndex];

    if (lastPlayerState !== `question${room.questionIndex}`) {
      lastPlayerState = `question${room.questionIndex}`;

      $("playerQuestionCounter").textContent =
        `ΕΡΩΤΗΣΗ ${room.questionIndex + 1} / ${QUESTIONS.length}`;

      $("playerQuestionText").textContent = q.q;
      loadQuestionImage("playerQuestionImage", "playerImageCredit", q);

      $("playerChoices").innerHTML = q.a.map((answer, i) => `
        <button class="choice-btn" data-index="${i}">
          <span class="choice-letter">${"ABCD"[i]}</span>
          <span>${escapeHtml(answer)}</span>
        </button>
      `).join("");

      $("playerChoices").querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
          submitAnswer(Number(button.dataset.index));
        });
      });
    }

    $("playerTimer").textContent = room.timeLeft;
    $("playerProgress").style.width = room.timeLeft * 5 + "%";

    $("playerChoices").querySelectorAll("button").forEach(button => {
      button.disabled = p.answer !== -1 || room.timeLeft <= 0;
    });

    $("playerAnswerFeedback").textContent =
      p.answer !== -1 ? "Η απάντησή σου καταχωρίστηκε!" : "";

    return;
  }

  if (room.status === "result") {
    lastPlayerState = `result${room.questionIndex}`;

    $("playerResultPanel").classList.remove("hidden");

    const q = QUESTIONS[room.questionIndex];
    const correct = p.answer === q.correct;

    $("playerResultIcon").textContent = correct ? "✓" : "×";
    $("playerResultIcon").style.color =
      correct ? "var(--green)" : "var(--red)";

    $("playerResultTitle").textContent =
      correct ? "Σωστή απάντηση!" : "Αυτή τη φορά όχι!";

    $("playerResultDetail").textContent =
      `Η σωστή απάντηση ήταν: ${"ABCD"[q.correct]}) ${q.a[q.correct]}`;

    $("playerPoints").textContent = "+" + (p.lastPoints || 0);
    return;
  }

  if (room.status === "finished") {
    $("playerFinalPanel").classList.remove("hidden");

    $("playerFinalPoints").textContent =
      p.score.toLocaleString("el-GR");

    const winner = sortedPlayers()[0];

    $("playerFinalMessage").textContent =
      winner?.id === p.id
        ? "Συγχαρητήρια! Είσαι ο μεγάλος νικητής!"
        : `Νικητής: ${winner?.name || "—"}. Μπράβο για τη συμμετοχή σου!`;
  }
}

function startPlayer() {
  show("playerScreen");

  $("joinBtn").addEventListener("click", playerJoin);

  $("roomInput").addEventListener("input", event => {
    event.target.value =
      event.target.value.replace(/\D/g, "").slice(0, 4);
  });
}

// ============================================
// START APPLICATION
// ============================================

async function init() {
  try {
    const credential = await signInAnonymously(auth);
    uid = credential.user.uid;

    console.log("Firebase connected:", uid);
    console.log("Database:", firebaseConfig.databaseURL);

    if (mode === "player") {
      startPlayer();
    } else {
      startHost();
    }
  } catch (error) {
    reportError(error);
  }
}

init();
