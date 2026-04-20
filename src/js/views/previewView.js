import View from './view';
import icons from 'url:../../img/icons.svg';

/**
 * Preview View
 * Responsible for rendering recipe preview items
 * inside search results / bookmarks list
 */
class PreviewView extends View {
    // NOTE: parent is usually set dynamically in parent view (results/bookmarks)
    _parent = '';

    /**
     * Generate preview markup for a single recipe item
     */
    _generateMarkup() {
        const currentId = window.location.hash.slice(1);

        const isActive =
            this._data.id === currentId ? 'preview__link--active' : '';

        return `
        <li class="preview">
            <a 
            class="preview__link ${isActive}" 
            href="#${this._data.id}"
            >
            
            <!-- Recipe image -->
            <figure class="preview__fig">
                <img 
                src="${this._data.image}" 
                alt="${this._data.title}" 
                />
            </figure>

            <!-- Recipe data -->
            <div class="preview__data">

                <h4 class="preview__title">
                ${this._data.title}
                </h4>

                <p class="preview__publisher">
                ${this._data.publisher}
                </p>

                <!-- User generated icon -->
                <div class="preview__user-generated ${this._data.key ? '' : 'hidden'
                }">
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
                </div>

            </div>
            </a>
        </li>
        `;
    }
}

export default new PreviewView();