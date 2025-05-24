import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../consts.js';

function createSortingTemplate(sortType) {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            <div class="trip-sort__item  trip-sort__item--day">
              <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day"
                ${sortType === SortType.DAY ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-day" data-sort=${SortType.DAY}>Day</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--event">
              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
              <label class="trip-sort__btn" for="sort-event">Event</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--time">
              <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time"
                ${sortType === SortType.TIME ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-time" data-sort=${SortType.TIME}>Time</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--price">
              <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price"
                ${sortType === SortType.PRICE ? 'checked' : ''}>
              <label class="trip-sort__btn" for="sort-price" data-sort=${SortType.PRICE}>Price</label>
            </div>

            <div class="trip-sort__item  trip-sort__item--offer">
              <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
              <label class="trip-sort__btn" for="sort-offer">Offers</label>
            </div>
          </form>`;
}

export default class Sorting extends AbstractView {
  #sortType = null;
  #onSortTypeChange = null;

  constructor(sortType, onSortTypeChange) {
    super();
    this.#sortType = sortType;
    this.#onSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      const sortingType = evt.target.dataset.sort;
      if (sortingType) {
        this.#onSortTypeChange(sortingType);
      }
    });
  }

  get template() {
    return createSortingTemplate(this.#sortType);
  }
}


