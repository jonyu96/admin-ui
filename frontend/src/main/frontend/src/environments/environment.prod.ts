import { base } from './base';

export const environment = {
  ...base,
  production: true,
  basicAuth: btoa('zoey:Adm!n4Z0EY_PRD'),
  sdeAuthApi: 'https://apis.t-mobile.com/sde/internal',
  host: 'https://zoey.t-mobile.com'
};
