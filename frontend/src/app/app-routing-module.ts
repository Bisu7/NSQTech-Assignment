import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule) },
  { path: 'admin', canActivate: [AuthGuard], loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule) },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
