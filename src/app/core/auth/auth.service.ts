import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { injectAppConfig } from '../config/app-config';
import { LoginResponse } from './auth.models';
import { decodeJwt, isTokenExpired } from './jwt.util';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly config = injectAppConfig();
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly currentToken = signal<string | null>(null);
  private expiryTimer?: ReturnType<typeof setTimeout>;
  private generation = 0;
  private pending = false;
  readonly token = this.currentToken.asReadonly();
  readonly user = computed(() => {
    const token = this.token();
    return token ? decodeJwt(token) : null;
  });
  readonly isAuthenticated = computed(() => {
    const user = this.user();
    return user !== null && !isTokenExpired(user);
  });
  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.expiryTimer));
    let stored: string | null;
    try {
      stored = localStorage.getItem(this.config.tokenStorageKey);
    } catch {
      stored = null;
    }
    this.setSession(stored);
  }
  async login(email: string, password: string): Promise<void> {
    if (this.pending) return;
    this.pending = true;
    const generation = this.generation;
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.config.apiBaseUrl}/auth/login`, { email, password }),
      );
      if (generation !== this.generation) return;
      const user =
        typeof response?.accessToken === 'string' ? decodeJwt(response.accessToken) : null;
      if (!user || isTokenExpired(user)) throw new Error('INVALID_SESSION');
      this.setSession(response.accessToken);
    } finally {
      this.pending = false;
    }
  }
  logout(): void {
    this.generation++;
    this.setSession(null);
    void this.router.navigate(['/login']);
  }
  validateSession(): boolean {
    const user = this.user();
    if (!user || isTokenExpired(user)) {
      this.setSession(null);
      return false;
    }
    return true;
  }
  private setSession(token: string | null): void {
    clearTimeout(this.expiryTimer);
    const user = token ? decodeJwt(token) : null;
    const validToken = user && !isTokenExpired(user) ? token : null;
    this.currentToken.set(validToken);
    // localStorage es solo para este mock; en producción conviene usar cookies httpOnly.
    try {
      if (validToken) localStorage.setItem(this.config.tokenStorageKey, validToken);
      else localStorage.removeItem(this.config.tokenStorageKey);
    } catch {
      return this.scheduleIfValid(validToken, user?.exp);
    }
    this.scheduleIfValid(validToken, user?.exp);
  }
  private scheduleIfValid(token: string | null, exp: number | undefined): void {
    if (token && exp !== undefined) this.scheduleExpiry(exp);
  }
  private scheduleExpiry(exp: number): void {
    const remaining = exp * 1000 - Date.now();
    if (remaining <= 0) {
      this.logout();
      return;
    }
    this.expiryTimer = setTimeout(() => this.scheduleExpiry(exp), Math.min(remaining, 2147483647));
  }
}
