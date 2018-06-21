module.exports = {
    getWordAtCursor : () => {
        let editor = atom.workspace.getActiveTextEditor();
        editor.selectWordsContainingCursors()
        return editor.getSelectedText()
    },
    insertWordAtCursor : (newword) => {
        let editor = atom.workspace.getActiveTextEditor();
        editor.insertText(replacement)
        return true
    },
    replaceWordAtCursor : (replacement) => {
        let editor = atom.workspace.getActiveTextEditor();
        editor.selectWordsContainingCursors();
        editor.insertText(replacement);
        return true;
    },
}
