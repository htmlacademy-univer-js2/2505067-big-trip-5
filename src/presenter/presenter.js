import Filters from '../view/filters';
import FormCreation from '../view/form-creation';
import FormEditing from '../view/form-editing';
import RoutePointList from '../view/route-point-list';
import RoutePoint from '../view/route-point';
import Sorting from '../view/sorting';
import { render } from '../render.js';

export default class Presenter {
  RoutePointListComponent = new RoutePointList();

  constructor() {
    this.tripEvents = document.querySelector('.trip-events');
    this.tripControlFilters = document.querySelector('.trip-controls__filters');
  }

  init() {
    render(new Filters(), this.tripControlFilters);
    render(new Sorting(), this.tripEvents);
    render(this.RoutePointListComponent, this.tripEvents);
    render(new FormEditing(), this.RoutePointListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new RoutePoint(), this.RoutePointListComponent.getElement());
    }

    render(new FormCreation(), this.RoutePointListComponent.getElement());
  }
}
