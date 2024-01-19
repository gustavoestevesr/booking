import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor() {}

  signIn(email: string, password: string): Observable<any> {
    return of({});
  }
}
