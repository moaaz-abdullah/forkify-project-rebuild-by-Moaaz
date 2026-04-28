import fracty from 'fracty';
import View from './view';
import icons from 'url:../../img/icons.svg';

/**
 * Recipe View
 * Responsible for rendering recipe details UI
 * and handling user interactions (bookmarks, servings)
 */
class RecipeView extends View {
    _parent = document.querySelector('.recipe');

    // Default error message if no recipe is found
    _errorMessage =
        'No recipes found for your query. Please try again!';

    /**
     * Handle bookmark button click
     * Delegates event to controller
     */
    addHandlerAddBookmark(handler) {
        this._parent.addEventListener('click', e => {
            const btn = e.target.closest('.btn--bookmark');
            if (!btn) return;

            handler();
        });
    }

    /**
     * Generate HTML markup for recipe view
     */
    _generateMarkup() {
        return `
        <figure class="recipe__fig">
            <img 
            src="${this._data.image}" 
            alt="${this._data.title}" 
            class="recipe__img" 
            />

            <h1 class="recipe__title">
            <span>${this._data.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">

            <!-- Cooking time -->
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icons}#icon-clock"></use>
            </svg>

            <span class="recipe__info-data recipe__info-data--minutes">
                ${this._data.cookingTime}
            </span>
            <span class="recipe__info-text">minutes</span>
            </div>

            <!-- Servings -->
            <div class="recipe__info">
            <svg class="recipe__info-icon">
                <use href="${icons}#icon-users"></use>
            </svg>

            <span class="recipe__info-data recipe__info-data--people">
                ${this._data.servings}
            </span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
                <button
                class="btn--tiny btn--decrease-servings"
                data-update-to="${this._data.servings - 1}"
                >
                <svg>
                    <use href="${icons}#icon-minus-circle"></use>
                </svg>
                </button>

                <button
                class="btn--tiny btn--increase-servings"
                data-update-to="${this._data.servings + 1}"
                >
                <svg>
                    <use href="${icons}#icon-plus-circle"></use>
                </svg>
                </button>
            </div>
            </div>

            <!-- User generated icon -->
            <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'
                }">
            <svg>
                <use href="${icons}#icon-user"></use>
            </svg>
            </div>

            <!-- Bookmark button -->
            <button class="btn--round btn--bookmark">
            <svg>
                <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''
                }"></use>
            </svg>
            </button>
        </div>

        <!--Ingredients -->
        <div class="recipe__ingredients">
            <h2 class="heading--2">Recipe ingredients</h2>

            <ul class="recipe__ingredient-list">
            ${this._data.ingredients
                    .map(ing => this._generateIngredient(ing))
                    .join('')}
            </ul>
        </div>

        <!--Directions -->
            <div class="recipe__directions">
                <h2 class="heading--2">How to cook it</h2>

                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__publisher">
                        ${this._data.publisher}
                    </span>.
                </p>

                <a
                    class="btn--small recipe__btn"
                    href="${this._data.sourceUrl}"
                    target="_blank"
                >
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </a>
            </div>`;

    }

    /**
     * Generate single ingredient markup
     * (clean separation of concerns)
     */
    _generateIngredient(ingredient) {
        return `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
            </svg>

            <div class="recipe__quantity">
                ${ingredient.quantity
                ? fracty(ingredient.quantity)
                : ''
            }
            </div>

            <div class="recipe__description">
                <span class="recipe__unit">
                    ${ingredient.unit}
                </span>
                ${ingredient.description}
            </div>
        </li>`;
    }

    /**
     * Render recipe when URL changes
     */
    addHandlerRender(handler) {
        ['hashchange', 'load'].forEach(event =>
            window.addEventListener(event, handler)
        );
    }

    /**
     * Handle servings update buttons
     */
    addHandlerUpdateServings(handler) {
        this._parent.addEventListener('click', e => {
            const btn = e.target.closest('.btn--tiny');
            if (!btn) return;

            const updateTo = +btn.dataset.updateTo;

            if (updateTo > 0) handler(updateTo);
        });
    }
}

export default new RecipeView();