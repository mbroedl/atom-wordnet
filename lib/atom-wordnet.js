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
    subscriptions: null,
    activate: () => {
        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(
            atom.commands.add('atom-text-editor', {
                'wordnet:synonyms-for-cursor': (ev) => getWords(ev, 'synonym', 'cursor'),
                'wordnet:search-synonyms':  (ev) => getWords(ev, 'synonym', 'open')
            })
        );
    },
    serialize: () => {},
    deactivate: () => {
        this.subscriptions.dispose();
        this.subscriptions = null;
    },
    toggle: () => {
        if (this.subscriptions) {
            this.activate();
        } else {
            this.deactivate();
        }
    }
};
