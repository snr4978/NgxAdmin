import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: any[], iteratees?: string | string[], orders?: boolean | "asc" | "desc" | (boolean | "asc" | "desc")[]): any[] {
    return orderBy(array, iteratees, orders);
  }

}
