import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from './components/table/table';

@NgModule({
  declarations: [
    Table
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Table
  ]
})
export class SharedModule {}
