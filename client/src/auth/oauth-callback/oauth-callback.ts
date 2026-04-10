import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../types/user';
import { AccountService } from '../../core/services/account-service';
import { UserMapper } from '../../mappers/github-user.mapper';

@Component({
  selector: 'app-oauth-callback',
  imports: [],
  templateUrl: './oauth-callback.html',
  styleUrl: './oauth-callback.css',
})
export class OauthCallbackComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  ngOnInit() {
    const tokenData = new URLSearchParams(window.location.search).get('token');

    if (tokenData) {
      const decoded = decodeURIComponent(tokenData);
      const rawData = JSON.parse(decoded);
      const user: User = UserMapper.toUser(rawData);
      this.accountService.setCurrentUser(user);
      this.router.navigate(['/']);
    }
  }
}
