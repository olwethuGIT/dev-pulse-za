import { Component, inject, OnInit, signal } from '@angular/core';
import { themes } from '../theme';
import { CommonModule } from '@angular/common';
import { ThemeButton } from '../../shared/theme-button/theme-button';
import { AccountService } from '../../core/services/account-service';
import { Router } from '@angular/router';
import { ModalService } from '../../core/services/modal-service';

@Component({
  selector: 'app-nav',
  imports: [CommonModule, ThemeButton],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  login() {
    this.modalService.open();
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
