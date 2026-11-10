/* =====================================================================
   FILE: src/app/services/auth.service.ts
   WHAT: Knows who is signed in, and talks to the login endpoints.
   WHY:  _currentUser is private and writable; everybody else gets the
         read-only currentUser, so no component can pretend to be someone else.
   ===================================================================== */
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  studentId: number;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // STEP 1: Only this service can change who is signed in.
  private readonly _currentUser = signal<User | null>(null);
  // Everybody else reads it, but cannot call set() on it.
  readonly currentUser = this._currentUser.asReadonly();
  // Derived state: true when somebody is signed in.
  readonly isLoggedIn = computed(() => this._currentUser() !== null);

  // Switch between mock-api and real backend automatically
  private baseUrl = environment.useMockApi ? '/mock-api' : `${environment.apiUrl}/auth`;

  /**
   * STEP 1: Login
   * POST /mock-api/login
   * Expects: { email, password, remember }
   */
  login(credentials: LoginPayload): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/login`, credentials, {
        withCredentials: true, // IMPORTANT: Allows browser to store the HttpOnly cookie
      })
      .pipe(tap((user) => this._currentUser.set(user)));
  }

  /**
   * STEP 2: Check current session ("Who am I?")
   * GET /mock-api/me
   */
  checkSession(): Observable<User> {
    return this.http
      .get<User>(`${this.baseUrl}/me`, {
        withCredentials: true, // Sends the HttpOnly session cookie back to the server
      })
      .pipe(
        tap({
          next: (user) => this._currentUser.set(user),
          error: () => this._currentUser.set(null),
        }),
      );
  }

  /**
   * STEP 3: Logout
   * POST /mock-api/logout
   */
  logout(): Observable<void> {
    return this.http
      .post<void>(
        `${this.baseUrl}/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .pipe(tap(() => this._currentUser.set(null)));
  }
}
