import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateAgoPipe } from '../pipes/date-ago.pipe';


@NgModule({
  declarations: [
    DateAgoPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DateAgoPipe
  ]
})
export class ApplicationPipeModule { }
