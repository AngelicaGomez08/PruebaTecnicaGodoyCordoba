import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatCardModule } from '@angular/material/card';
import { UserFormComponent } from '../user-form/user-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users = new MatTableDataSource<any>([]); 
  displayedColumns: string[] = ['firstName', 'lastName','identification', 'email', 'lastAccessDate', 'classification','score', 'actions'];

  constructor(private userService: UserService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (data) => {
        console.log('Usuarios recibidos:', data);
        this.users.data = data;
      },
      (error) => {
        console.error('Error al obtener usuarios', error);
      }
    );
  }

  openUserForm(): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: null 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers(); 
      }
    });
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '400px',
      data: user 
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
      }
    });
  }
  
  deleteUser(user: any): void {
    if (confirm('¿Estás seguro que deseas eliminar este usuario??')) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}
