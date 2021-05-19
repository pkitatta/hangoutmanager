import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'mediaGroup'
})
export class MediaGroupPipe implements PipeTransform {

  pipe = new DatePipe('en-US'); // Use your own locale
  transform(collection: any[], property: string | any): any[] {
    // let property = 'item_category';
    // prevents the application from breaking if the array of objects doesn't exist yet
    if (!collection) {
      return [];
    }

    const groupedCollection = collection.reduce((previous, current) => {
      // console.log('date: ' + this.pipe.transform(current[property], 'yyyy-MM-dd'));
      // console.log('property: ' + typeof current[property]);
      let index: any = this.pipe.transform(current[property], 'yyyy-MM-dd');
      if (!previous[index]) {
        previous[index] = [current];
      } else {
        previous[index].push(current);
      }

      return previous;
    }, {});

    // this will return an array of objects, each object containing a group of objects
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }

}
