import RoutePoint from '../view/route-point-view.js';
import FormEditing from '../view/form-editing-view.js';
import {render, replace, remove} from '../framework/render.js';
import { isEscapeKey } from '../utils.js';
import { Mode, UserAction, UpdateType } from '../consts.js';

export class PointPresenter {
  #destinations = null;
  #offers = null;
  #point = null;
  #pointItem = null;
  #editFormItem = null;
  #pointsListComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #typeOffers = null;

  #escKeyHandler = (event) => {
    if (isEscapeKey(event)) {
      event.preventDefault();
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escKeyHandler);
    }
  };

  constructor({ destinations, offers, pointsListComponent, changeDataOnFavorite, changeMode, typeOffers }) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#pointsListComponent = pointsListComponent;
    this.#handleDataChange = changeDataOnFavorite;
    this.#handleModeChange = changeMode;
    this.#typeOffers = typeOffers;
  }

  destroy(){
    remove(this.#pointItem);
    remove(this.#editFormItem);
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointItem;
    const prevEditFormComponent = this.#editFormItem;

    this.#pointItem = new RoutePoint({point: this.#point,
      onRollButtonClick: this.#editFormResetHandler.bind(this),
      onFavoriteClick: this.#addToFaivorite
    });

    this.#editFormItem = new FormEditing({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#editFormSubmitHandler.bind(this),
      onFormReset: this.#replaceEditFormToPoint.bind(this),
      typeOffers: this.#typeOffers,
      onDeleteClick: this.#handleDeleteButtonClick
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointItem, this.#pointsListComponent.element);
      return;
    }

    if (this.#pointsListComponent.element.contains(prevPointComponent.element)) {
      replace(this.#pointItem, prevPointComponent);
    }

    if (this.#pointsListComponent.element.contains(prevEditFormComponent.element)) {
      replace(this.#editFormItem, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm() {
    replace(this.#editFormItem, this.#pointItem);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointItem, this.#editFormItem);
    document.removeEventListener('keydown', this.#escKeyHandler);
    this.#mode = Mode.DEFAULT;
  }

  #addToFaivorite = (point) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, {...point, isFavorite: !point.isFavorite});
  };

  #editFormSubmitHandler = (point) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  #editFormResetHandler = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#escKeyHandler);
  };

  #handleDeleteButtonClick = (point) => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };
}

