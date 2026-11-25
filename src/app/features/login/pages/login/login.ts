import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormField, form, required, email, minLength, submit } from '@angular/forms/signals';
import { AuthService } from '../../../../core/auth/auth.service';
import { AUTH_COPY, PASSWORD_MIN_LENGTH } from '../../../../core/auth/auth.copy';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-login',
  imports: [FormField, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly copy = AUTH_COPY;
  protected readonly model = signal({ email: '', password: '' });
  protected readonly error = signal('');
  protected readonly passwordVisible = signal(false);
  protected readonly loginForm = form(this.model, (path) => {
    required(path.email, { message: AUTH_COPY.emailRequired });
    email(path.email, { message: AUTH_COPY.emailInvalid });
    required(path.password, { message: AUTH_COPY.passwordRequired });
    minLength(path.password, PASSWORD_MIN_LENGTH, { message: AUTH_COPY.passwordShort });
  });
  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.loginForm().submitting()) return;
    this.error.set('');
    await submit(this.loginForm, async () => {
      try {
        const { email, password } = this.model();
        await this.auth.login(email, password);
        if (!this.auth.isAuthenticated()) return;
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const safe =
          returnUrl?.startsWith('/') &&
          !returnUrl.startsWith('//') &&
          !returnUrl.includes('\\') &&
          !/^\/login(?:[/?#;]|$)/.test(returnUrl);
        await this.router.navigateByUrl(safe && returnUrl ? returnUrl : '/dashboard');
      } catch (error: unknown) {
        this.error.set(
          error instanceof HttpErrorResponse && error.status === 401
            ? this.copy.invalidCredentials
            : this.copy.unavailable,
        );
      }
    });
    if (this.loginForm().invalid())
      this.loginForm().errorSummary()[0]?.fieldTree().focusBoundControl();
  }
}
