import View from './view';
import icons from 'url:../../img/icons.svg';

/**
 * Pagination View
 * Responsible for:
 * - Rendering pagination buttons
 * - Handling page navigation clicks
 */
class PaginationView extends View {
    _parent = document.querySelector('.pagination');

    /**
     * Handle click on pagination buttons
     * Pass selected page to controller
     */
    addHandlerClick(handler) {
        this._parent.addEventListener('click', e => {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;

            const goToPage = +btn.dataset.goto;

            handler(goToPage);
        });
    }

    /**
     * Generate a single pagination button
     * @param {number} page - target page number
     * @param {string} type - 'prev' | 'next'
     */
    _generateButton(page, type) {
        const isPrev = type === 'prev';

        return `
        <button 
            class="btn--inline pagination__btn--${type}" 
            data-goto="${page}"
        >
            ${isPrev
                    ? `
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${page}</span>
                `
                    : `
                <span>Page ${page}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
                `
                }
        </button>
        `;
    }

    /**
     * Generate full pagination markup based on current state
     */
    _generateMarkup() {
        const { page, results, resultsPerPage } = this._data;

        const numPages = Math.ceil(results.length / resultsPerPage);

        // Case 1: only one page → no pagination
        if (numPages <= 1) return '';

        // Case 2: first page → only next button
        if (page === 1) {
            return this._generateButton(page + 1, 'next');
        }

        // Case 3: last page → only prev button
        if (page === numPages) {
            return this._generateButton(page - 1, 'prev');
        }

        // Case 4: middle pages → both buttons
        return `
        ${this._generateButton(page - 1, 'prev')}
        ${this._generateButton(page + 1, 'next')}
    `;
    }
}

export default new PaginationView();