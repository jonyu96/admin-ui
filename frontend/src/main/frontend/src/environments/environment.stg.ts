import { base } from './base';

export const environment = {
    ...base,
    production: true,
    basicAuth: btoa('zoey:Adm!n4Z0EY'),
    sdeAuthApi: 'https://api-devstg.t-mobile.com/sde/internal',
    host: 'https://zoey-stg.t-mobile.com',
};
