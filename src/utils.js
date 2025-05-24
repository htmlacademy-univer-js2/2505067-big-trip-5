import dayjs from 'dayjs';

function convertDate(date, newFormat) {
  return dayjs(date).format(newFormat);
}

const getDestinationById = (destinations, id) => destinations.find((item) => item.id === id);

function getDuration(dateFrom, dateTo){
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);
  const difference = end.diff(start, 'minute');

  if (difference > (60 * 24)) {
    const days = Math.floor(difference / (60 * 24));
    const remainder = difference % (60 * 24);
    const hours = Math.floor(remainder / 60);
    const minutes = remainder % 60;
    return `${String(days).padStart(2,'0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else if (difference > 60){
    const hours = Math.floor(difference / 60);
    const minutes = difference % 60;
    return `${String(hours).padStart(2,'0')}H ${String(minutes).padStart(2,'0')}M`;
  } else {
    return `${String(difference).padStart(2,'0')}M`;
  }
}

const getOffersByType = (offers, type) => offers.find((item) => item.type === type).offers.map((offer) => offer.id);

function isEscapeKey(evt) {
  return evt.key === 'Escape';
}

function isPointPresent(point) {
  return dayjs().isAfter(dayjs(point.dateFrom)) && dayjs().isBefore(dayjs(point.dateTo));
}

function isPointFuture(point) {
  return dayjs().isBefore(dayjs(point.dateFrom));
}

function isPointPast(point) {
  return dayjs().isAfter(dayjs(point.dateTo));
}

const capitalizeWord = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const getMonthAndDate = (date) => dayjs(date).format('MMM DD');

const getFullDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const getOfferById = (offers, id) => {
  for (let i = 0; i < offers.length; i++) {
    const foundOffer = offers[i].offers.find((offer) => offer.id === id);
    if (foundOffer) {
      return foundOffer;
    }
  }
};

const SortTypes = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time'
};

const sort = {
  [SortTypes.DAY]: (points) => points.sort((pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom))),
  [SortTypes.TIME]: (points) => points.sort((pointA, pointB) => dayjs(pointB.dateTo).diff(pointB.dateFrom) - dayjs(pointA.dateTo).diff(pointA.dateFrom)),
  [SortTypes.PRICE]: (points) => points.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice)
};

const getDayAndMonth = (date) => dayjs(date).format('D MMM');

const getRouteDates = (points) => points.length > 0 ? [getDayAndMonth(points[0].dateFrom), getDayAndMonth(points[points.length - 1].dateTo)] : ['', ''];

const getRoute = (points, destinations) => {
  const route = points.map((point) => getDestinationById(destinations, point.destination).name);
  return route.length < 4 ? route.join(' &mdash; ') : `${route[0]} &mdash; ... &mdash; ${route[route.length - 1]}`;
};

const getRoutePrice = (points, offers) => {
  const pointPrices = points.map((point) => Number(point.basePrice));
  const offersPrices = points.map((point) => point.offers.map((offer) => Number(getOfferById(offers, offer).price)));
  const basePrice = pointPrices.reduce((sum, price) => sum + price, 0);
  const additionalPrice = offersPrices.flat().reduce((sum, price) => sum + price, 0);
  return basePrice + additionalPrice;
};

export {
  convertDate,
  getDestinationById,
  getDuration,
  getOffersByType,
  isEscapeKey,
  isPointPresent,
  isPointFuture,
  isPointPast,
  capitalizeWord,
  getMonthAndDate,
  getFullDate,
  getOfferById,
  sort,
  getRouteDates,
  getRoute,
  getRoutePrice
};
