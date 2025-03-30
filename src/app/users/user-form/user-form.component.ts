import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule], 
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent  implements OnInit {
  userForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      identification:['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    if (this.data) {
      this.isEdit = true;
      this.userForm.patchValue(this.data);
    }
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      return;
    }
  
    const userData = { ...this.userForm.value };
  
    if (this.isEdit && this.data?.id) {
      userData.id = this.data.id;
      this.userService.updateUser(userData.id, userData).subscribe({
        next: () => {
          this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', { duration: 2000 });
          this.dialogRef.close(true); 
        },
        error: () => {
          this.snackBar.open('Error al actualizar usuario', 'Cerrar', { duration: 2000 });
        }
      });
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.snackBar.open('Usuario creado con éxito', 'Cerrar', { duration: 2000 });
          this.dialogRef.close(true); 
        },
        error: () => {
          this.snackBar.open('Error al crear usuario', 'Cerrar', { duration: 2000 });
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
