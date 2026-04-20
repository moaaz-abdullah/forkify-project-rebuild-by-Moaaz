import { API_URL, RESULTS_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';
import addRecipeView from './views/addRecipeView';
import recipeView from './views/recipeView';
import searchView from './views/searchView';

/**
 * Global application state
 * Holds all shared data across the app (recipe, search, bookmarks)
 */
export const state = {
    // currently loaded recipe
    recipe: {},

    // search-related state
    search: {
        query: '',
        page: 1,
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
    },

    // saved bookmarked recipes
    bookmarks: [],
};

/**
 * Transform API recipe response into a clean app object
 * Keeps only the fields we actually use in the UI
 */
const createRecipeObject = function (data) {
    const { recipe } = data.data;

    return {
        title: recipe.title,
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        servings: recipe.servings,

        // optional property: only added if exists
        ...(recipe.key && { key: recipe.key }),
    };
};

/**
 * Load a single recipe from API by ID
 * Also checks if the recipe is bookmarked
 */
export const loadRecipe = async function (id) {
    try {
        // fetch recipe data from API
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

        // normalize and store recipe
        state.recipe = createRecipeObject(data);

        // check if recipe exists in bookmarks
        state.recipe.bookmarked = state.bookmarks.some(
            bookmark => bookmark.id === id
        );
    } catch (err) {
        throw err;
    }
};

/**
 * Load search results based on query
 * Stores results in state for pagination
 */
export const loadSearchResults = async function (query) {
    try {
        // store current query
        state.search.query = query;

        // fetch search results
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

        // normalize results
        state.search.results = data.data.recipes.map(rec => ({
            title: rec.title,
            id: rec.id,
            image: rec.image_url,
            publisher: rec.publisher,

            // optional API key flag
            ...(rec.key && { key: rec.key }),
        }));

        // reset pagination when new search happens
        state.search.page = 1;
    } catch (err) {
        throw err;
    }
};

/**
 * Get paginated results for current search
 */
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
};

/**
 * Update recipe servings and recalculate ingredient quantities
 * Keeps ingredient ratios consistent
 */
export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });

    state.recipe.servings = newServings;
};

/**
 * Add recipe to bookmarks list
 * Also updates current recipe state if needed
 */
export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);

    // mark current recipe as bookmarked
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    // persist changes in localStorage
    persistBookmarks();
};

/**
 * Remove recipe from bookmarks by ID
 */
export const deleteBookmark = function (id) {
    const index = state.bookmarks.findIndex(el => el.id === id);

    // remove from array
    state.bookmarks.splice(index, 1);

    // update current recipe state
    if (id === state.recipe.id) state.recipe.bookmarked = false;

    // persist changes
    persistBookmarks();
};

/**
 * Save bookmarks to localStorage
 * Makes bookmarks persistent across page reloads
 */
const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Initialize application state from localStorage
 * Runs once when app starts
 */
const init = function () {
    const storage = localStorage.getItem('bookmarks');

    state.bookmarks = storage ? JSON.parse(storage) : [];
};

init();

/**
 * Upload new recipe to API
 * Converts form data into API format first
 */
export const uploadRecipe = async function (newRecipe) {
    try {
        // transform ingredients from form into structured array
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1])
            .map(entry => {
                const ingArr = entry[1].split(',').map(el => el.trim());

                // enforce correct format: quantity, unit, description
                if (ingArr.length !== 3)
                    throw new Error('Wrong format! Use: quantity,unit,description');

                const [quantity, unit, description] = ingArr;

                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description,
                };
            });

        // build recipe object for API
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };

        // send data to API
        const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

        // normalize and store response
        state.recipe = createRecipeObject(data);

        // automatically bookmark newly added recipe
        addBookmark(state.recipe);

    } catch (err) {
        throw err;
    }
};