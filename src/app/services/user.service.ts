import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../users/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = 'https://localhost:44349/api/Users';

  constructor(private http: HttpClient) {}

  //Obtener todos los usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/GetUsers`);
  }

  //Crear un usuario 
  createUser(user: User): Observable<User> {
    console.log("Usuario a enviar:", user); 
    return this.http.post<User>(`${this.API_URL}/CreateUser`, user);
  }

  //Actualizar usuario
  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.API_URL}/UpdateUser/${id}`, user);
  }

  //Eliminar Usuario
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/DeleteUser/${id}`);
  }
}
