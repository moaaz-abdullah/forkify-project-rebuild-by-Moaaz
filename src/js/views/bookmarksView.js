import View from './view';
import previewView from './previewView';

/**
 * Bookmarks View
 * Responsible for rendering list of bookmarked recipes
 */
class BookmarksView extends View {
    _parent = document.querySelector('.bookmarks__list');

    // Message when no bookmarks exist
    _errorMessage = 'No bookmarks yet. Please add some!';

    /**
     * Generate full bookmarks markup
     * Uses PreviewView for each item
     */
    _generateMarkup() {
        return this._data
            .map(bookmark => previewView._generateMarkup.call({
                _data: bookmark
            }))
            .join('');
    }

    /**
     * Render bookmarks on page load
     */
    addHandlerRender(handler) {
        window.addEventListener('load', handler);
    }
}

export default new BookmarksView();