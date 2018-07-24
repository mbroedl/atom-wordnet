# atom-wordnet package

A Wordnet wrapper to display definitions and insert/replace with synonyms.
The package uses lemmatisation to suggest alternatives even for inflected words, and part of speech tagging to suggest the correct words.

**Warning:** It downloads and extracts the whole WordNet (~30mb) database.

![Screenshot](screenshot.png)

## Keybindings

At the moment this package has _no keybindings_ in the standard editor environment, so you can find those that work best for you, and to avoid clashes.
If you would like keybindings, copy these lines to your _keymap.cson_ (and change the keys if you like)

```cson
'atom-text-editor':
  'alt-s': 'wordnet:synonyms-for-cursor'
```
to find a synonym for the word under the current cursor and

```cson
'atom-workspace'
  'alt-a': 'wordnet:search-synonyms'
```
to find a synonym for a word you can enter into the search bar.
Use `tab`/`shift-tab` or `left/right` to scroll through suggestions, and `enter` to paste the highlighted word to the cursor.

## Potential Future Improvements

* fuzzy search + suggestions for words under cursor
* automatic expansion of the currently typed word in the wordnet-search
* use user-defined fields from the wordnet database (e.g. categorisation, similar-to, or antonyms)
* a helper-pane showing a definition for the word currently under the cursor
* integrate with other packages using the `natural` package and therefore having a wordnet-copy already
