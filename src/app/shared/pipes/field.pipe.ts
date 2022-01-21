import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'field'
})
export class FieldPipe implements PipeTransform {

  transform(object: any, field: any): any {
    if (object instanceof Array) {
      return object.map(i => i[field]);
    }
    else {
      return object ? object[field] : undefined;
    }
  }

}
