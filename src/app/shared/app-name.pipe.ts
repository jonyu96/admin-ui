import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appName'
})
export class AppNamePipe implements PipeTransform {

  transform(value: string): string {
    if (value === 'Slack_id') {
      return 'Slack ID';
    } else if (value === 'Pier_support_group') {
      return 'Pier Support Group';
    } else {
      return value.replace('_', ' ');
    }
  }
}
