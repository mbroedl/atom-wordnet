const WordPOS = require('wordpos');

module.exports = {
    getWord : (word, callback) => {
        wordpos = new WordPOS();
        wordpos.lookup(word, (results, w) => {
            callback(results);
        });
    }
}
