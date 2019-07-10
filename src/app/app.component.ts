import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from './core/loading/loading.service';

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
    private router: Router,
    private loadingService: LoadingService
  ) { }

  get shouldShowHeader() {
    return !this.hasRouteConfig('hideHeader');
  }

  get shouldSpanFullWidth() {
    return !!this.hasRouteConfig('fullWidth');
  }

  get shouldShowLoading$() {
    return this.loadingService.isLoading$;
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
