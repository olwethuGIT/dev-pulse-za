import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Nav } from '../layout/nav/nav';
import { AccountModal } from '../shared/account-modal/account-modal';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, AccountModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected router = inject(Router);
}
