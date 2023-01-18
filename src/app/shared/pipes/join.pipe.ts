import { Pipe, PipeTransform } from '@angular/core';
import { join } from 'lodash';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {

  transform(array: any[], separator?: string): string {
    return join(array, separator || '，');
  }

}
