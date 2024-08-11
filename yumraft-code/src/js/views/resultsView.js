import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class Resultsview extends View {
  _parentElement = document.querySelector('.results');
  _errormessage =
    'no recipes found for your query! please try another recipe😊';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new Resultsview();
