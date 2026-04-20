import * as model from './model';
import { MODEL_CLOSE_SEC } from './config';

import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

///////////////////////////////////////
// Controller: Recipe Details

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Show loading spinner
    recipeView.renderSpinner();

    // Update UI (results + bookmarks) before loading new recipe
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Load recipe data
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

///////////////////////////////////////
// Controller: Search

const controlSearchResults = async function () {
  try {
    // Show spinner
    resultsView.renderSpinner();

    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load results
    await model.loadSearchResults(query);

    // Render results + pagination
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderErrorMessage();
  }
};

///////////////////////////////////////
// Controller: Pagination

const controlPagination = function (goToPage) {
  // Render new page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Update pagination buttons
  paginationView.render(model.state.search);
}
///////////////////////////////////////
//ontroller: Servings Update

const controlServings = function (newServings) {
  // Update servings in state
  model.updateServings(newServings);

  // Update UI بدون إعادة render كاملة
  recipeView.update(model.state.recipe);
};

///////////////////////////////////////
// Controller: Bookmarks

const controlAddBookmark = function () {
  const recipe = model.state.recipe;

  // Toggle bookmark
  if (!recipe.bookmarked) {
    model.addBookmark(recipe);
  } else {
    model.deleteBookmark(recipe.id);
  }

  // Update recipe view (icon)
  recipeView.update(model.state.recipe);

  // Render bookmarks list
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  // Render bookmarks on page load
  bookmarksView.render(model.state.bookmarks);
};

///////////////////////////////////////
// Controller: Add New Recipe

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload recipe to API
    await model.uploadRecipe(newRecipe);

    // Render new recipe
    recipeView.render(model.state.recipe);

    // Show success message
    addRecipeView.renderSuccessMessage();

    // Render updated bookmarks (auto-added)
    bookmarksView.render(model.state.bookmarks);

    // Update URL without reload
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close modal after delay
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);

  } catch (err) {
    addRecipeView.renderErrorMessage(err.message);
  }
};

///////////////////////////////////////
// App Initialization

const init = function () {
  // Load recipe on hash change / page load
  recipeView.addHandlerRender(controlRecipes);

  // Search
  searchView.addHandlerSearch(controlSearchResults);

  // Pagination
  paginationView.addHandlerClick(controlPagination);

  // Servings
  recipeView.addHandlerUpdateServings(controlServings);

  // Bookmark
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  // Render stored bookmarks
  bookmarksView.addHandlerRender(controlBookmarks);

  // Add recipe
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();