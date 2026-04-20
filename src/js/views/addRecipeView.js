import View from './view';

/**
 * Handles Add Recipe Modal + Form Upload UI
 * Responsibilities:
 * - Open/close modal window
 * - Handle form submission
 * - Pass data to controller
 */
class AddRecipeView extends View {
    // Form container (upload form)
    _parent = document.querySelector('.upload');

    // Success message after upload
    _successMessage = 'Recipe has been uploaded successfully :)';

    // Modal elements
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');

    // Buttons
    _btnClose = document.querySelector('.btn--close-modal');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');

    constructor() {
        super();

        // Bind event handlers once on initialization
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    /**
     * Toggle modal visibility (open/close)
     */
    toggleWindow() {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    /**
     * Open modal event handler
     */
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener(
            'click',
            this.toggleWindow.bind(this)
        );
    }

    /**
     * Close modal event handler (button + overlay)
     */
    _addHandlerHideWindow() {
        this._btnClose.addEventListener(
            'click',
            this.toggleWindow.bind(this)
        );

        this._overlay.addEventListener(
            'click',
            this.toggleWindow.bind(this)
        );
    }

    /**
     * Handle form submission
     * - Prevent page reload
     * - Convert form data into object
     * - Pass data to controller
     */
    addHandlerUpload(handler) {
        this._parent.addEventListener('submit', function (e) {
            e.preventDefault();

            // Convert form data into key-value object
            const data = Object.fromEntries([
                ...new FormData(this),
            ]);

            // Send data to controller
            handler(data);
        });
    }
}

export default new AddRecipeView();