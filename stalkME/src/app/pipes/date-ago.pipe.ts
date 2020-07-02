//This code it's an adaptation of a snipmen from https://medium.com/@thunderroid/angular-date-ago-pipe-minutes-hours-days-months-years-ago-c4b5efae5fe5
//his original author is Shifatul Islam
//I am very grateful that you share it - Daniel Modesto - Indiecake

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, ...args: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value * 1000)) / 1000);
      if (seconds < 29)
        return 'Justo hace un momento';
      const intervals = {
        'año': 31536000,
        'mes': 2592000,
        'semana': 604800,
        'dia': 86400,
        'hora': 3600,
        'minuto': 60,
        'segundo': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return 'hace ' + counter + ' ' + i; 
          } else {
            if (i === 'mes') {
              return 'hace ' + counter + ' ' + i + 'es';
            } else {
              return 'hace ' + counter + ' ' + i + 's'; 
            }
          }
      }
    }
    return value;
  }

}
