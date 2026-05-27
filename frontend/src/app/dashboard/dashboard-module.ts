import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './components/dashboard/dashboard';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [
    Dashboard
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
