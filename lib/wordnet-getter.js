const WordPOS = require('wordpos');
const posTagger = require('wink-pos-tagger');
const editorInterface = require('./editor-interface');

const self = {
    getWord : (word, callback) => {
        wordpos = new WordPOS();
        wordpos.lookup(word, (results, w) => {
            callback(results, w);
        });
    },
    getWordByPos : (word, pos, callback) => {
        wordpos = new WordPOS();
        // https://www.clips.uantwerpen.be/pages/mbsp-tags
        let dispatch = (results, w) => { callback(results, w); }
        switch(pos[0]) {
            case 'N':
                wordpos.lookupNoun(word, dispatch);
                break;
            case 'J':
                wordpos.lookupAdjective(word, dispatch);
                break;
            case 'V':
                wordpos.lookupVerb(word, dispatch);
                break;
            default:
                wordpos.lookup(word, dispatch);
                // wordpos.lookupAdverb
        }
    },
    getWordAtPos : (line, position, callback) => {
        let tagger = posTagger();
        let tags = tagger.tagSentence(line);
        //let word = editorInterface.getWordAtCursor().toLowerCase();
        //let wordpos = tags.filter((t) => t.value == word);
        index = line;
        let cumSum = 0;
        let wordpos = {};
        tags.every((t, n) => {
            index = index.replace(t.value, '');
            cumSum += t.value.length + index.search(/\S|$/);
            index = index.replace(/^\s+/, '');
            if (cumSum > position || n+1 >= tags.length) {
                wordpos = t;
                return false;
            }
            return true;
        });

        let search = wordpos.lemma || wordpos.value;
        self.getWordByPos(search, wordpos.pos, callback);
        return search;
    }
}
module.exports = self;
