import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any[], propertyName: string, order: string): any[] {
    if (propertyName && order !== '') {
      if (order === 'asc')
        return value.sort((a: any, b: any) => a[propertyName]-b[propertyName]);
      else
        return value.sort((a: any, b: any) => b[propertyName]-a[propertyName]);
    } else {
      return value;
    }
  }

}
