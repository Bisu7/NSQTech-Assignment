import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Admin } from './components/admin/admin';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    Admin
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminModule {}
