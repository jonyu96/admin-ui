import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom'
})
export class CustomPipe implements PipeTransform {

  transform(value: string): string {
    switch(value.toLowerCase()) {
      case 'zoey_admin': 
        return 'Zoey Admin';
        break;
      case 'pv_rule':
        return 'PV Rule';
        break;
      case 'ps_bot':
        return 'PS Bot';
        break;
      case 'datasource':
        return 'Datasource';
        break;
      case 'pier_support_group':
        return 'Pier Support Group';
        break;
      case 'slack_id':
        return 'Slack ID';
        break;
      case 'role':
        return 'Role';
        break;
    }
  }

}