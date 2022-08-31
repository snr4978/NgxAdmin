import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(array: any[], predicate: (value?: any, index?: number, array?: any[]) => any): any[] {
    return array.filter(predicate);
  }

}
