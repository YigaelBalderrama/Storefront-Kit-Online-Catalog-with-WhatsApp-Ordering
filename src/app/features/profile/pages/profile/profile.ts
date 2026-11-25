import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { AUTH_COPY } from '../../../../core/auth/auth.copy';
@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile {
  protected readonly auth = inject(AuthService);
  protected readonly copy = AUTH_COPY;
}
