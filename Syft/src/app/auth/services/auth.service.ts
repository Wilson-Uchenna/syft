import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiService } from 'src/app/api/api.service';


const JWT_LOCALSTORE_KEY = 'jwt';
const USER_LOCALSTORE_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  constructor( private api: ApiService ) {
    this.initToken();
  }

  initToken() {
    const token = localStorage.getItem(JWT_LOCALSTORE_KEY);
    const user = <User> JSON.parse(localStorage.getItem(USER_LOCALSTORE_KEY) || '{}');
    if (token && user) {
      this.setTokenAndUser(token, user);
    }
  }

  setTokenAndUser(token: string | null, user: User | null): void {
    if (token && user) {
      localStorage.setItem(JWT_LOCALSTORE_KEY, token);
      localStorage.setItem(USER_LOCALSTORE_KEY, JSON.stringify(user));
      this.api.setAuthToken(token);
      this.currentUser$.next(user);
    } else {
      localStorage.removeItem(JWT_LOCALSTORE_KEY);
      localStorage.removeItem(USER_LOCALSTORE_KEY);
      this.api.setAuthToken('');
      this.currentUser$.next(null);
    }
  }

  async login(email: string, password: string): Promise<any> {
    return this.api.post('/auth/login',
              {email: email, password: password})
              .then((res) => {
                this.setTokenAndUser(res.token, res.user);
                return res;
              })
              .catch((e) => { throw e; });
      // return user !== undefined;
  }

  logout(): boolean {
    this.setTokenAndUser(null, null);
    return true;
  }

  register(user: User, password: string): Promise<any> {
    return this.api.post('/auth/register',
              {email: user.email, password: password})
              .then((res) => {
                this.setTokenAndUser(res.token, res.user);
                return res;
              })
              .catch((e) => { throw e; });
  }
}
