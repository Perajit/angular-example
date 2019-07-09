import { Component } from '@angular/core';
import { Router } from '@angular/router';

export type RouteConfigKey = 'hideHeader' | 'fullWidth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'angular-example';
  readonly routeConfigs = {
    hideHeader: ['login'],
    fullWidth: ['login']
  } as Record<RouteConfigKey, string[]>;

  constructor(
    private router: Router
  ) { }

  get shouldShowHeader() {
    return !this.hasRouteConfig('hideHeader');
  }

  get shouldSpanFullWidth() {
    return !!this.hasRouteConfig('fullWidth');
  }

  private hasRouteConfig(configKey: RouteConfigKey) {
    const routes = this.routeConfigs[configKey];
    const rootPath = this.getRootPath();

    return routes.includes(rootPath);
  }

  private getRootPath() {
    const url = this.router.url;
    const rootUrl = url.split('/')[1];

    return rootUrl ? rootUrl.split('?')[0] : '';
  }
}
