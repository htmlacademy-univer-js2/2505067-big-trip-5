import Observable from '../framework/observable.js';
import { UpdateType } from '../consts.js';

export default class PointsModel extends Observable {
  #points = [];
  #allDestinations = [];
  #allOffers = [];
  #pointsApiService = null;
  #isLoading = true;

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#allDestinations;
  }

  get offers() {
    return this.#allOffers;
  }

  get loading() {
    return this.#isLoading;
  }

  async updatePoint(updateType, update) {
    const index = this.points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, updatedPoint);
    } catch {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, point) {
    try {
      const response = await this.#pointsApiService.addPoint(point);
      const update = this.#adaptToClient(response);
      this.#points = [
        update,
        ...this.#points
      ];
      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t add unexiscting point');
    }
  }

  async deletePoint(updateType, update) {
    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = this.#points.filter((item) => item.id !== update.id);
      this._notify(updateType, update);
    } catch {
      throw new Error('Can\'t delete point');
    }
  }

  async init() {
    let isLoadingFailed = false;
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map((point) => this.#adaptToClient(point));
      this.#allDestinations = await this.#pointsApiService.destinations;
      this.#allOffers = await this.#pointsApiService.offers;
      this.#isLoading = false;
    } catch {
      this.#points = [];
      this.#allDestinations = [];
      this.#allOffers = [];
      this.#isLoading = false;
      isLoadingFailed = true;
    }

    this._notify(UpdateType.INIT, { isLoadingFailed });
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  };
}

