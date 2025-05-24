import { pointsMock } from '../mock/points-mock';
import { getAllDestinations, getAllOffers } from '../utils.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = pointsMock;
  #allDestinations = getAllDestinations();
  #allOffers = getAllOffers();

  get points() {
    return [...this.#points];
  }

  get destinations() {
    return this.#allDestinations;
  }

  get offers() {
    return this.#allOffers;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}
