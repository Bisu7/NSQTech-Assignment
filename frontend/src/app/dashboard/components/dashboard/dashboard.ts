import { Component, OnInit } from '@angular/core';
import { Api } from '../../../core/services/api';
import { Loader } from '../../../core/services/loader';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  standalone: false
})
export class Dashboard implements OnInit {
  records: any[] = [];
  user: any;

  constructor(
    public api: Api,
    public loader: Loader,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.fetchRecords();
  }

  fetchRecords() {
    this.api.getRecords().subscribe({
      next: (res) => {
        if (res.success) {
          this.records = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching records after retries:', err);
        // Show user-friendly error state here if needed
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
