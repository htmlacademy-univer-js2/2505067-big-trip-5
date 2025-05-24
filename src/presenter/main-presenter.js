import Sorting from '../view/sorting-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { PointPresenter } from './point-presenter.js';
import { sortByDuration, sortByDay, sortByPrice, getAllDestinations, getAllOffers, getOffersByType } from '../utils.js';
import { SortTypes, UpdateType, UserAction, NEW_POINT, filter } from '../consts.js';
import PointCreationPresenter from './point-creation-presenter.js';

export default class Presenter {
  #pointsModel = null;
  #sortComponent = null;
  #filterModel = null;
  #filterType = null;
  #currentSortType = null;
  #pointListComponent = null;
  #emptyPointListComponent = null;
  #pointCreationPresenter = null;
  #eventsContainer = null;

  #destinations = getAllDestinations();
  #offers = getAllOffers();
  #pointPresenters = new Map();

  constructor({ eventsContainer, pointListComponent, pointsModel, filterModel }) {
    this.#pointsModel = pointsModel;
    this.#eventsContainer = eventsContainer;
    this.#pointListComponent = pointListComponent;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);

    this.#pointCreationPresenter = new PointCreationPresenter({
      filterModel: this.#filterModel,
      pointListComponent: this.#pointListComponent,
      point: NEW_POINT,
      typeOffers: getOffersByType(NEW_POINT.type),
      offers: this.#offers,
      destinations: this.#destinations,
      handleDataChange: this.#handleUserAction.bind(this),
      handleModeChange: this.#handleModeChange.bind(this)
    });
  }

  #handleModelChange = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#clearListView();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        this.#clearListView();
        this.#renderPointList(true);
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#pointCreationPresenter.destroy();
  };

  init() {
    this.#onSortChange(SortTypes.DAY);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      destinations: this.#destinations,
      offers: this.#offers,
      pointsListComponent: this.#pointListComponent,
      changeDataOnFavorite: this.#handleUserAction.bind(this),
      changeMode: this.#handleModeChange.bind(this),
      typeOffers: getOffersByType(point.type)
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handleUserAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #clearListView() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #onSortChange(sortTypes) {
    if (this.#currentSortType !== sortTypes) {
      this.#currentSortType = sortTypes;
      this.#renderSort();
      this.#clearListView();
      this.#renderPointList();
    }
  }

  #renderSort() {
    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new Sorting(this.#currentSortType, this.#onSortChange.bind(this));
    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderPointList(isFilterTypeChanged = false) {
    if (isFilterTypeChanged) {
      this.#currentSortType = 'day';
      this.#renderSort();
    }

    remove(this.#emptyPointListComponent);
    render(this.#pointListComponent, this.#eventsContainer);
    if (this.points.length > 0) {
      this.points.forEach((point) => this.#renderPoint(point));
    } else {
      this.#renderEmptyPointList();
    }
  }

  #renderEmptyPointList() {
    this.#emptyPointListComponent = new EmptyListView({ filterType: this.#filterType });
    render(this.#emptyPointListComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;

    switch (this.#currentSortType) {
      case SortTypes.PRICE:
        points.sort(sortByPrice);
        break;
      case SortTypes.TIME:
        points.sort(sortByDuration);
        break;
      default:
        points.sort(sortByDay);
        break;
    }
    return filter[this.#filterType](points);
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }
}

