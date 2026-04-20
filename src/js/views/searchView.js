class SearchView {
    // Parent element (search form)
    _parent = document.querySelector('.search');

    /**
     * Get search query from input field
     * Clears input after reading value
     */
    getQuery() {
        const input = this._parent.querySelector('.search__field');

        const query = input.value;

        this._clear();

        return query;
    }

    /**
     * Clear search input field
     */
    _clear() {
        this._parent.querySelector('.search__field').value = '';
    }

    /**
     * Attach handler for search submit event
     * @param {Function} handler - controller callback
     */
    addHandlerSearch(handler) {
        this._parent.addEventListener('submit', function (e) {
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();