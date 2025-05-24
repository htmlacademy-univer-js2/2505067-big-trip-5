import { isPointFuture, isPointPast, isPointPresent } from './utils';
import { getOffersByType } from './utils.js';

const Formats = {
  TIME: 'HH:mm',
  DAY: 'MMM D',
  FULL_DATE: 'D/MM/YY HH:mm',
  TIME_TAG_VALUE: 'YYYY-MM-DD'
};

const FilterType = {
  EVERYTHING:'everything',
  FUTURE:'future',
  PRESENT: 'present',
  PAST:'past',
};

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point))
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

const SortTypes = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time'
};

const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const NoPointMessages = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now'
};

const NEW_POINT = {
  id: crypto.randomUUID(),
  type: 'flight',
  destination: '',
  dateFrom: '',
  dateTo: '',
  basePrice: 0,
  offers: getOffersByType('flight'),
  isFavorite: false
};

export { Formats, filter, Mode, SortTypes, EVENT_TYPES, FilterType, UserAction, UpdateType, NoPointMessages, NEW_POINT};


