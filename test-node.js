const Book = require(require("path").join(__dirname, "book-kit.js"));
let pass = 0, fail = 0;
function ok(n, c, e) { c ? (pass++, console.log("PASS  " + n + (e ? "  (" + e + ")" : ""))) : (fail++, console.log("FAIL  " + n + (e ? "  (" + e + ")" : ""))); }

const json = {
  title: "The Whispering Body", author: "Dr Sohil Momin",
  chapters: [
    { title: "First Aid Basics", keyPoints: ["Stay calm", "Assess the injury"], practices: ["Check the kit"] },
    { title: "Burns", keyPoints: ["Cool with water", "Do not pop blisters"], practices: ["Dress the burn"] },
    { title: "Fever", keyPoints: ["Hydrate", "Watch for red flags"], practices: ["Log the temperature"] }
  ],
  flashcards: [{ front: "Burns first step?", back: "Cool with water" }]
};
const b = Book.load(json);

ok("title and author load", b.title === "The Whispering Body" && b.author === "Dr Sohil Momin");
ok("chapters load", b.chapters.length === 3);
ok("chapter titles load", b.chapter(0).title === "First Aid Basics");
ok("key points load", b.keyPoints(1).length === 2 && b.keyPoints(1)[0] === "Cool with water");
ok("practices load", b.practices(0)[0] === "Check the kit");
ok("flashcards load", b.flashcards.length === 1);
ok("chapterByTitle works", b.chapterByTitle("burn").index === 1);
ok("search finds by key point", b.search("hydrate").length === 1);
ok("search finds by title", b.search("fever")[0].title === "Fever");
ok("search misses cleanly", b.search("zzzz").length === 0);

// progress with a fake store
const mem = {}; const store = { get: (k, d) => (k in mem ? mem[k] : d), set: (k, v) => { mem[k] = v; } };
const p = b.progress(store);
ok("nothing read initially", p.percent() === 0);
p.markRead(0); p.markRead(1);
ok("percent reflects read chapters", p.percent() === 67, p.percent() + "%");
ok("isRead reports", p.isRead(1) === true && p.isRead(2) === false);
p.note(1, "remember the cooling time");
ok("notes persist", p.note(1) === "remember the cooling time");
const p2 = b.progress(store);   // reload
ok("progress survives a reload", p2.isRead(0) === true && p2.percent() === 67);
p2.toggle(0);
ok("toggle un-reads", p2.isRead(0) === false && p2.percent() === 33);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
