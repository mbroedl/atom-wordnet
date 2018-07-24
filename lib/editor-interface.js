module.exports = {
    getWordAtCursor : () => {
        let editor = atom.workspace.getActiveTextEditor();
        editor.selectWordsContainingCursors()
        return editor.getSelectedText()
    },
    getLineAtCursor : () => {
        let editor = atom.workspace.getActiveTextEditor();
        let cursor = editor.getCursorBufferPosition();
        return editor.lineTextForBufferRow(cursor.row);
    },
    getCursorColumn : () => {
        return atom.workspace.getActiveTextEditor().getCursorBufferPosition().column;
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
