import { HTTP_INTERCEPTORS } from '@angular/common/http';

import appProvidersBase from './app-providers.base';
import { MockAuthInterceptor } from './core/auth/mock/mock-auth.interceptor';
import { MockPokemonInterceptor } from './core/pokemons/mock/mock-pokemon.interceptor';
import { MockPokemonMasterdataInterceptor } from './core/pokemons/mock/mock-pokemon-masterdata.interceptor';

export default [
  ...appProvidersBase,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MockAuthInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MockPokemonInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: MockPokemonMasterdataInterceptor,
    multi: true
  }
];
