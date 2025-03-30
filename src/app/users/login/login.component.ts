import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input'; 
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, FormsModule, MatInputModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private snackBar: MatSnackBar, 
              private router: Router,  
              private http: HttpClient,) {}

  onLogin() {
    const credentials = {
      email: this.email,
      password: this.password 
    };
  
    this.http.post('https://localhost:44349/api/Auth/Login', credentials).subscribe({
      next: () => {
        this.snackBar.open('Login satisfactorio', 'Cerrar', { duration: 2000 });
  
        setTimeout(() => {
          this.router.navigate(['/users']); 
        }, 1000);
      },
      error: () => {
        this.snackBar.open('Email o cédula incorrectos', 'Cerrar', { duration: 2000 });
      }
    });
  }
}
