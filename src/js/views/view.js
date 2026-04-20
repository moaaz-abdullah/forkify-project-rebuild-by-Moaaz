import icons from 'url:../../img/icons.svg';
import fracty from 'fracty';

/**
 * Base View class
 * Provides reusable UI rendering logic for all views
 */
export default class View {
    _data;

    /**
     * Render data to DOM
     * @param {Object|Array} data - data to render
     * @param {boolean} render - if false returns markup only
     */
    render(data, render = true) {
        // Guard clause: handle empty or invalid data
        if (
            !data ||
            (Array.isArray(data) && data.length === 0)
        )
            return this.renderErrorMessage();

        // store data
        this._data = data;

        // generate HTML markup
        const markup = this._generateMarkup();

        // return markup instead of rendering (useful for updates/testing)
        if (!render) return markup;

        // clear container and render new markup
        this._clear();
        this._parent.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Render loading spinner
     */
    renderSpinner() {
        const markup = `
        <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
        `;

        this._clear();
        this._parent.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Clear parent container
     */
    _clear() {
        this._parent.innerHTML = '';
    }

    /**
     * Render error message
     */
    renderErrorMessage(message = this._errorMessage) {
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;

        this._clear();
        this._parent.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Render success message
     */
    renderSuccessMessage(message = this._successMessage) {
        const markup = `
        <div class="message">
            <div>
            <svg>
                <use href="${icons}#icon-alert-triangle"></use>
            </svg>
            </div>
            <p>${message}</p>
        </div>
    `;

        this._clear();
        this._parent.insertAdjacentHTML('afterbegin', markup);
    }

    /**
     * Updates only changed DOM elements instead of re-rendering whole view
     */
    update(data) {
        this._data = data;

        // generate new markup
        const newMarkup = this._generateMarkup();

        // convert markup to DOM fragment
        const newDom = document
            .createRange()
            .createContextualFragment(newMarkup);

        const newElements = Array.from(newDom.querySelectorAll('*'));
        const curElements = Array.from(
            this._parent.querySelectorAll('*')
        );

        // compare new vs current DOM elements
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            // update changed text
            if (
                !newEl.isEqualNode(curEl) &&
                newEl.firstChild?.nodeValue?.trim() !== ''
            ) {
                curEl.textContent = newEl.textContent;
            }

            // update changed attributes
            if (!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value)
                );
            }
        });
    }
}