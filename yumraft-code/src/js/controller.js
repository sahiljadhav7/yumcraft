import * as modal from './modal.js';
import recipeView from './views/recipeView.js';
import 'regenerator-runtime';
import searchview from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(modal.getSearchResultsPage());
    bookmarksView.update(modal.state.bookmarks);
    //1) Loading Recipe
    await modal.loadRecipe(id);

    //2) Rendering Recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError(`${err}🎆🎆🎆🎆`);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1)Get Search Query
    const query = searchview.getQuery();
    if (!query) return;

    //2)Load search results
    await modal.loadSearchResults(query);

    //3)Render Results
    resultsView.render(modal.getSearchResultsPage());

    //4)Render initial pagination
    paginationView.render(modal.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(modal.getSearchResultsPage(goToPage));
  paginationView.render(modal.state.search);
};
const controlServings = function (newServings) {
  modal.updateServings(newServings);

  recipeView.update(modal.state.recipe);
};
const controlAddBookmark = function () {
  if (!modal.state.recipe.bookmarked) {
    modal.addBookmark(modal.state.recipe);
  } else {
    modal.deleteBookmark(modal.state.recipe.id);
  }

  // Update the recipe view with the new bookmark status
  recipeView.update(modal.state.recipe);

  // Re-render the bookmarks view to reflect changes
  bookmarksView.render(modal.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(modal.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await modal.uploadRecipe(newRecipe);
    console.log(modal.state.recipe);

    recipeView.render(modal.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(modal.state.bookmarks);

    window.history.pushState(null, '', `#${modal.state.recipe.id}`);
    // window.history.back()

    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    addRecipeView.renderMessage();
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchview.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
