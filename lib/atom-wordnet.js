const WordnetListView = require('./wordnet-list-view');
const Wordnet = require('./wordnet-getter');
const {CompositeDisposable} = require('atom');

const getWords = (ev, wordType, searchType) => {
    wordnetListView = new WordnetListView(wordType, searchType);
    if (searchType == 'open')
        wordnetListView.searchOpen( Wordnet.getWord );
    if (searchType == 'cursor')
        wordnetListView.searchWordAtCursor( Wordnet.getWord );
}

module.exports = {
    disposables: null,
    subscriptions: null,
    activate: () => {
        this.disposables = new CompositeDisposable();
        this.subscriptions = new CompositeDisposable();

        this.disposables.add(atom.config.observe('wordnet.grammars', (grammars) => {
            this.subscriptions.dispose();
            this.subscriptions = new CompositeDisposable();
            if (!grammars) grammars = [];
            grammars = grammars.forEach(
                (grammar) => {
                    grammar = grammar.replace(/\./g, ' ');
                    let selector = `[data-grammar='${grammar}']`;
                    if (grammars.length == 1 && grammar == '*') selector = '';
                    this.subscriptions.add(
                        atom.commands.add(`atom-text-editor${selector}`, {
                            'wordnet:synonyms-for-cursor': (ev) => getWords(ev, 'synonym', 'cursor'),
                            'wordnet:search-synonyms':  (ev) => getWords(ev, 'synonym', 'open')
                        })
                    );
                }
            );
            return;
        }));
    },
    serialize: () => {},
    deactivate: () => {
        this.subscriptions.dispose();
        this.disposables.dispose();
    }
};
