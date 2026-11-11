# book-kit — API reference

**Version 1.0.0.** **The companion-app-from-a-book pattern.** Zero dependencies. One file. Chapters, key points, practices, flashcards and reading progress — the shared logic extracted from the drsamonline apps that repeat it.

Generated from the source in this repository: every name, argument and
note below is read out of the kit file, so it cannot describe a function
that is not there.

```js
<script src="book-kit.js"></script>
Book.load(...)
// or: const Book = require('./book-kit.js')
```

## The surface (1 entries)

| Name | Arguments | What it does |
|---|---|---|
| `Book.load` | `(json)` | — |

## Notes

- Zero dependencies, one file, no build step: it works from `file://`, from a
  `<script>` tag and from Node.
- The version above is the `VERSION` file in this repository; a pinned copy is
  what an app vendors.
