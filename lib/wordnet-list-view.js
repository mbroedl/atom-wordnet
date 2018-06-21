const SelectListView = require('atom-select-list');
const EditorInterface = require('./editor-interface');

const Views = {
    synonym: {
        filterKey : (res) => res.synonyms.join(' '),
        onSelection : (res, search) => {
            let infobox = '';
            if (res) {
                let exp = res.exp.map((exp) => `<span class='explanation'>${exp}</span>`);
                infobox = ((exp.length > 0) ? 'Examples:<br>' : '') + exp.join('\n');
            }
            return infobox;
        },
        element : (res, search) => {
            const element = document.createElement('li')
            let results = res.synonyms.map((r) => `<span class='result ${(r == search.toLowerCase()) ? 'searched' : ''} selectable'>${r}</span>`).join(', ');
            element.innerHTML = `<span class="position">${res.pos}</span><span class='definition'>${res.def}</span><span class='results'>${results}</span>`
            return element
        }
    }
}

module.exports =
class WordnetListView {
  constructor (wordType, searchType) {
    this.search = null;
    this.selectIndex = null;
    this.justUpdated = -1;
    this.searchType = searchType;
    this.searchNewItems = () => {}
    this.infobox = document.createElement('div');
    this.infobox.classList.add('infobox');
    this.selectListView = new SelectListView({
      itemsClassList: [''],
      items: [],
      filterKeyForItem: (r) => Views[wordType].filterKey(r, this.search),
      elementForItem: (r) => Views[wordType].element(r, this.search),
      didChangeSelection: (r) => {
          this.selectIndex = null;
          this.infobox.innerHTML = Views[wordType].onSelection(r, this.search)
      },
      didConfirmSelection: (word) => {
          let newword = ''
          if (this.selectIndex !== null) {
              newword = this.selectListView.element.getElementsByClassName('selected-term')[0].innerText;
          } else {
              newword = this.selectListView.element.getElementsByClassName('selected')[0].getElementsByClassName('selectable')[0].innerText;
          }
        if (newword) {
            if (this.searchType == 'cursor') {
                EditorInterface.replaceWordAtCursor(newword);
            }
            if (this.searchType == 'open') {
                EditorInterface.insertWordAtCursor(newword);
            }
        }
        this.cancel();
      },
      didChangeQuery: (query) => {
          if (searchType == 'open') {
              if (this.justUpdated == 2) {
                  this.justUpdated = 0
              } else {
                  if (this.justUpdated == 1) {
                      this.justUpdated = 2;
                      this.updateQuery();
                  }
                  if (this.justUpdated <= 0){
                      if (query && query.length >= 3) {
                          this.justUpdated = 1;
                          this.search = query;
                          this.searchNewItems(query);
                      }
                  }
              }
          }
      },
      didCancelSelection: () => {
        this.cancel();
      },
      infoMessage: 'Press <tab> to loop through word suggestions. <enter> to insert/replace, <esc> to abort.',
      emptyMessage: 'Please type the word you would like to find synonyms for.'
    });
    this.selectListView.element.classList.add('wordnet-selector');
    this.selectListView.element.classList.add('wordnet-' + wordType);
    atom.commands.add(this.selectListView.element, {
          'wordnet:select-next': (event) => {
              (this.selectIndex !== null) ? this.selectIndex++ : this.selectIndex = 0;
              this.selectItem();
              event.stopPropagation();
          },
          'wordnet:select-previous': (event) => {
              (this.selectIndex !== null) ? this.selectIndex-- : this.selectIndex = -1;
              this.selectItem();
              event.stopPropagation();
          }
      });
    this.selectListView.element.append(this.infobox);
  }

  destroy () {
    this.cancel()
    return this.selectListView.destroy()
  }

  cancel () {
    this.search = null;
    if (this.panel != null) {
      this.panel.destroy();
    }
    this.panel = null;
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
      this.previouslyFocusedElement = null;
    }
  }

  attach () {
    this.previouslyFocusedElement = document.activeElement
    if (this.panel == null) {
      this.panel = atom.workspace.addModalPanel({item: this.selectListView});
    }
    this.selectListView.focus();
    this.selectListView.reset();
  }

  selectItem (selectNone) {
      let selectables = this.selectListView.element.getElementsByClassName('selected')[0].getElementsByClassName('selectable');
      [...selectables].forEach((el) => el.classList.remove('selected-term'));
      if (selectNone) return;
      if (this.selectIndex < 0)
        this.selectIndex = selectables.length - 1;
      if (this.selectIndex >= selectables.length)
        this.selectIndex = 0;
      selectables[this.selectIndex].classList.add('selected-term');
  }

  async populate (wordlist) {
     if (wordlist.length == 0 & this.searchType == 'cursor') { return }
     await this.selectListView.update({items: wordlist})
     this.attach()
  }

  searchOpen (searchfunc) {
    this.populate([]);
    this.searchNewItems = (query) => {
        searchfunc(query, (l) => this.populate(l));
    };
    this.updateQuery = async () => {
        await this.selectListView.update({query: this.search})
    }
  }

  searchWordAtCursor (searchfunc) {
    this.search = EditorInterface.getWordAtCursor();
    searchfunc(this.search, (l) => this.populate(l));
  }
}
