import FormEditing from '../view/form-editing-view.js';
import { render, remove, RenderPosition } from '../framework/render';
import { UserAction, UpdateType } from '../consts.js';
import { getOffersByType } from '../utils.js';

export default class PointCreationPresenter {
  #pointListComponent = null;
  #pointEditComponent = null;
  #filterModel = null;
  #addButton = null;
  #pointsModel = null;
  #point = null;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor({ filterModel, pointListComponent, point, pointsModel, addButton, handleDataChange, handleModeChange }) {
    this.#filterModel = filterModel;
    this.#pointListComponent = pointListComponent;
    this.#point = point;
    this.#pointsModel = pointsModel;
    this.#addButton = addButton;
    this.#handleDataChange = handleDataChange;
    this.#handleModeChange = handleModeChange;

    this.#addButton.addEventListener('click', this.#handleAddButtonClick);
  }

  init() {
    this.#pointEditComponent = new FormEditing({
      point: this.#point,
      typeOffers: getOffersByType(this.#pointsModel.offers, this.#point.type),
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      onFormSubmit: this.#handleFormSubmit.bind(this),
      onDeleteClick: this.destroy
    });

    render(this.#pointEditComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #handleAddButtonClick = () => {
    this.#handleModeChange();
    document.addEventListener('keydown', this.#onEscKeydown);
    this.init();
    this.#addButton.disabled = true;
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      update
    );

    if (update.isSaving) {
      this.#filterModel.setFilter(UpdateType.MAJOR, 'everything');
      document.removeEventListener('keydown', this.#onEscKeydown);
      this.destroy();
    }
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  destroy = () => {
    remove(this.#pointEditComponent);
    this.#addButton.disabled = false;
  };

  setAborting() {
    this.#pointEditComponent.shake(this.#pointEditComponent.updateElement({ isSaving: false }));
  }
}
