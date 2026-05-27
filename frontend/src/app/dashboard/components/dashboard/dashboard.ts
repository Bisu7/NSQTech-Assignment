import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  users: any[] = [];
  user: any;

  recordForm: FormGroup;
  showRecordModal = false;
  isEditing = false;
  currentRecordId: string | null = null;
  formError = '';

  constructor(
    public api: Api,
    public loader: Loader,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.recordForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      accessLevel: ['Internal', Validators.required],
      assignedUser: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.fetchRecords();

    if (this.user?.role === 'Admin') {
      this.fetchUsers();
    }
  }

  fetchRecords() {
    this.api.getRecords().subscribe({
      next: (res) => {
        if (res.success) {
          this.records = res.data;
        }
      },
      error: (err) => console.error('Error fetching records:', err)
    });
  }

  fetchUsers() {
    this.api.getUsers().subscribe({
      next: (res) => {
        if (res.success) {
          this.users = res.data;
        }
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  openAddRecordModal() {
    this.isEditing = false;
    this.currentRecordId = null;
    this.recordForm.reset({ accessLevel: 'Internal', assignedUser: '' });
    this.formError = '';
    this.showRecordModal = true;
  }

  openEditRecordModal(record: any) {
    this.isEditing = true;
    this.currentRecordId = record._id;
    this.recordForm.patchValue({
      title: record.title,
      description: record.description,
      accessLevel: record.accessLevel,
      assignedUser: record.assignedUser?._id || ''
    });
    this.formError = '';
    this.showRecordModal = true;
  }

  closeModal() {
    this.showRecordModal = false;
  }

  onRecordSubmit() {
    if (this.recordForm.invalid) {
      this.formError = 'Please fill all fields.';
      return;
    }

    const formData = this.recordForm.value;

    if (this.isEditing && this.currentRecordId) {
      this.api.updateRecord(this.currentRecordId, formData).subscribe({
        next: (res) => {
          if (res.success) {
            this.fetchRecords();
            this.closeModal();
          }
        },
        error: (err) => {
          this.formError = err.error?.message || 'Error updating record';
        }
      });
    } else {
      this.api.createRecord(formData).subscribe({
        next: (res) => {
          if (res.success) {
            this.fetchRecords();
            this.closeModal();
          }
        },
        error: (err) => {
          this.formError = err.error?.message || 'Error creating record';
        }
      });
    }
  }

  onDeleteRecord(id: string) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.api.deleteRecord(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.fetchRecords();
          }
        },
        error: (err) => console.error('Error deleting record:', err)
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
