import { Pipe, PipeTransform } from '@angular/core';
import { find } from 'lodash-es';

@Pipe({
  name: 'find'
})
export class FindPipe implements PipeTransform {

  transform(array: any[], predicate: any): any {
    return find(array, predicate);
  }

}
