/* book-kit — the "companion app from a book" pattern. Zero dependencies.
 *
 * Six of the drsamonline apps are companions to a book: chapters, key points,
 * practices, flashcards and reading progress. That shape lives here, once.
 *
 *   var book = Book.load(json);          // {title, author, chapters:[{title,keyPoints,practices}]}
 *   book.chapter(0).keyPoints;
 *   var p = book.progress(store);        // mark chapters read, keep notes
 *
 * MIT License. (c) 2026 Dr Sohil Momin.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Book = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var B = { version: "0.1.0" };

  function norm(s) { return String(s == null ? "" : s).toLowerCase(); }

  B.load = function (json) {
    var b = json || {};
    var chapters = (b.chapters || []).map(function (c, i) {
      return {
        index: i,
        id: c.id || "ch-" + i,
        title: c.title || "Chapter " + (i + 1),
        keyPoints: c.keyPoints || c.points || [],
        practices: c.practices || c.exercises || [],
        body: c.body || ""
      };
    });
    var api = {
      title: b.title || "Untitled",
      author: b.author || "",
      meta: b.meta || {},
      chapters: chapters,
      flashcards: b.flashcards || []
    };

    api.chapter = function (i) { return chapters[i] || null; };
    api.chapterByTitle = function (t) {
      var n = norm(t);
      return chapters.filter(function (c) { return norm(c.title).indexOf(n) !== -1; })[0] || null;
    };
    api.keyPoints = function (i) { var c = chapters[i]; return c ? c.keyPoints : []; };
    api.practices = function (i) { var c = chapters[i]; return c ? c.practices : []; };

    api.search = function (term) {
      var n = norm(term);
      if (!n) return [];
      return chapters.filter(function (c) {
        return norm(c.title).indexOf(n) !== -1
          || c.keyPoints.some(function (k) { return norm(k).indexOf(n) !== -1; })
          || norm(c.body).indexOf(n) !== -1;
      }).map(function (c) { return { index: c.index, title: c.title }; });
    };

    /* Reading progress + notes, backed by any {get,set} store (web-kit fits). */
    api.progress = function (store, key) {
      key = key || ("book:" + norm(api.title).replace(/\s+/g, "-"));
      var state = (store && store.get) ? (store.get(key, null) || { read: {}, notes: {} }) : { read: {}, notes: {} };
      function save() { if (store && store.set) store.set(key, state); }
      return {
        isRead: function (i) { return !!state.read[i]; },
        markRead: function (i, v) { state.read[i] = v === false ? false : true; save(); return this; },
        toggle: function (i) { state.read[i] = !state.read[i]; save(); return this; },
        note: function (i, text) { if (text == null) return state.notes[i] || ""; state.notes[i] = text; save(); return this; },
        notes: function () { return state.notes; },
        percent: function () {
          if (!chapters.length) return 0;
          var n = Object.keys(state.read).filter(function (k) { return state.read[k]; }).length;
          return Math.round((n / chapters.length) * 100);
        },
        raw: function () { return state; }
      };
    };

    return api;
  };

  return B;
});
