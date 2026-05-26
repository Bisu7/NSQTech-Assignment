import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Api } from '../../../core/services/api';
import { Loader } from '../../../core/services/loader';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  standalone: false
})
export class Admin implements OnInit {
  users: any[] = [];
  currentUser: any;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedUserId: string | null = null;
  userForm: FormGroup;
  formError: string = '';

  constructor(
    public api: Api,
    public loader: Loader,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      userId: ['', Validators.required],
      password: [''],
      role: ['General User', Validators.required]
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.fetchUsers();
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

  openAddModal() {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.userForm.reset({ role: 'General User' });
    this.userForm.get('userId')?.enable();
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.formError = '';
    this.showModal = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.selectedUserId = user._id;
    this.userForm.patchValue({
      name: user.name,
      userId: user.userId,
      role: user.role,
      password: ''
    });
    this.userForm.get('userId')?.disable(); // Prevent changing userId
    this.userForm.get('password')?.clearValidators(); // Password optional on edit
    this.userForm.get('password')?.updateValueAndValidity();
    this.formError = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.formError = 'Please fill out all required fields.';
      return;
    }

    const formData = this.userForm.getRawValue();

    if (this.isEditMode && this.selectedUserId) {
      // Remove empty password so it's not updated
      if (!formData.password) {
        delete formData.password;
      }
      this.api.updateUser(this.selectedUserId, formData).subscribe({
        next: (res) => {
          this.fetchUsers();
          this.closeModal();
        },
        error: (err) => {
          this.formError = err.error?.message || 'Failed to update user';
        }
      });
    } else {
      this.api.createUser(formData).subscribe({
        next: (res) => {
          this.fetchUsers();
          this.closeModal();
        },
        error: (err) => {
          this.formError = err.error?.message || 'Failed to create user';
        }
      });
    }
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.api.deleteUser(id).subscribe({
        next: (res) => {
          this.fetchUsers();
        },
        error: (err) => alert(err.error?.message || 'Failed to delete user')
      });
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
