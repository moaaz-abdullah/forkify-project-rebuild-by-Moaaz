import View from './view';
import previewView from './previewView';

/**
 * Results View
 * Responsible for rendering search results list
 */
class ResultView extends View {
    _parent = document.querySelector('.results');

    // Error message when no results found
    _errorMessage =
        'No recipes were found for your search. Please try again!';

    /**
     * Generate markup for results list
     * Uses PreviewView for each result item
     */
    _generateMarkup() {
        return this._data
            .map(result =>
                previewView._generateMarkup.call({ _data: result })
            )
            .join('');
    }
}

export default new ResultView();