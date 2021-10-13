// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { base } from './base';

export const environment = {
  ...base,
  production: false,
  basicAuth: btoa('zoey:Adm!n4Z0EY'),
  sdeAuthApi: '',
  host: 'http://localhost:8081',
};