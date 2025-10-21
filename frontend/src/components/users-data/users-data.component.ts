import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from '../dialogs/update-user/update-user.component';
import { UserService } from '../../services/user.service';

import { User } from '../../models/user';

@Component({
  standalone: true,
  selector: 'app-users-data',
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './users-data.component.html',
  styleUrls: ['./users-data.component.css'],
})
export class UsersDataComponent {
  users: User[] = [];

  constructor(private dialog: MatDialog, private userService: UserService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Fetched users:', users);
        this.users = users;
        console.log('Fetched users:', this.users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }

  openUpdateDialog(user: User) {
    if (!user) {
      console.error('No user data provided for update dialog');
      return;
    }
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      data: { ...user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onUpdate(result);
      }
    });
  }

  onUpdate(user: User) {
    this.userService.updateUser(user).subscribe({
      next: () => {
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error updating user:', err);
      },
    });
  }

  onDelete(user: User) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.fetchUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      },
    });
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }
}
