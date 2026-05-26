import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './components/dashboard/dashboard';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [
    Dashboard
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
