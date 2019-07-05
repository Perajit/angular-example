import { Component } from '@angular/core';
import { Router } from '@angular/router';

export type RouteConfigKey = 'hideHeader' | 'hideFooter' | 'hideSidebar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly title = 'angular-example';
  readonly routeConfigs = {
    hideHeader: ['login'],
    hideFooter: ['login'],
    hideSidebar: ['login']
  } as Record<RouteConfigKey, string[]>;

  constructor(private router: Router) {}

  get shouldShowHeader() {
    return !this.hasRouteConfig('hideHeader');
  }

  get shouldShowFooter() {
    return !this.hasRouteConfig('hideFooter');
  }

  get shouldShowSidebar() {
    return !this.hasRouteConfig('hideSidebar');
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
