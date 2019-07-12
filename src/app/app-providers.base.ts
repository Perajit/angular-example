import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { LoadingInterceptor } from './core/loading/loading.interceptor';
import { AuthInterceptor } from './core/auth/auth.interceptor';

export default [
  {
    provide: 'Window',
    useValue: window
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
];
