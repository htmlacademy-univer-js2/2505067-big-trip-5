import Presenter from './presenter/main-presenter';
import PointsModel from './model/points-model';
import FilterPresenter from './presenter/filter-presenter.js';
import RoutePointList from './view/route-point-list-view.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './server/points-api-service.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

const END_POINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = 'Basic rp1e251ol78998a';

const eventsContainer = document.querySelector('.trip-events');
const filtersContainer = document.querySelector('.trip-controls__filters');
const tripInfoContainer = document.querySelector('.trip-main');

const pointsModel = new PointsModel({pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)});
const filterModel = new FilterModel();
const pointListComponent = new RoutePointList();

const presenter = new Presenter({
  eventsContainer: eventsContainer,
  pointListComponent: pointListComponent,
  pointsModel: pointsModel,
  filterModel: filterModel
});

const filterPresenter = new FilterPresenter({
  filtersContainer: filtersContainer,
  filterModel: filterModel,
  pointsModel: pointsModel
});

new TripInfoPresenter({
  container: tripInfoContainer,
  pointsModel: pointsModel
});

presenter.init();
pointsModel.init();
filterPresenter.init();

