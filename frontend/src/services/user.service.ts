import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private gService: GeneralService) {}

  getUsers(): Observable<User[]> {
    return this.gService.getData('users');
  }

  // createUser in AuthService !!

  updateUser(user: User): Observable<User> {
    return this.gService.putData(`users/${user.id}`, user);
  }

  deleteUser(userId: number): Observable<void> {
    return this.gService.deleteData(`users/${userId}`);
  }
}
