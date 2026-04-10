import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ModalService } from '../../core/services/modal-service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast-service';
import { LoginCreds } from '../../types/user';
import { AccountService } from '../../core/services/account-service';
declare var google: any;
@Component({
  selector: 'app-account-modal',
  imports: [FormsModule],
  templateUrl: './account-modal.html',
  styleUrl: './account-modal.css',
})
export class AccountModal implements OnInit {
  @ViewChild('modalRef') modal!: ElementRef<HTMLDialogElement>;
  isRegistered = signal<boolean>(true);
  protected loginCredentials: LoginCreds = {
    email: '',
    password: '',
  };

  protected registerCredentials = {
    displayName: '',
    email: '',
    password: '',
    subscribeToNewsletter: true,
  };
  private toastService = inject(ToastService);
  private accountService = inject(AccountService);

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: '862734762972-5t2lo9o1tcsaihac2083jp2ij5sb4lfe.apps.googleusercontent.com',
      callback: (response: any) => {
        const token = response.credential;
        this.handleGoogleLogin(token);
      },
    });

    this.modalService.modalState$.subscribe((isOpen) => {
      if (isOpen) {
        this.modal.nativeElement.showModal();
        setTimeout(() => {
          google.accounts.id.renderButton(document.getElementById('google-btn'), {
            theme: 'filled_blue',
            size: 'large',
            shape: 'rectangle',
            text: 'continue_with'
          });
        });
      } else {
        this.modal.nativeElement.close();
      }
    });
  }

  login() {
    this.accountService.login(this.loginCredentials).subscribe({
      next: () => {
        this.toastService.success('Logged in successfully.');
        this.close();
        this.isRegistered.set(true);
        this.loginCredentials = { email: '', password: '' };
      },
    });
  }

  register() {
    this.isRegistered.set(false);
    console.log('Register with', this.registerCredentials);
  }

  close() {
    this.modalService.close();
  }

  handleGoogleLogin(token: any) {
    if (token) {
      this.accountService.googleLogin(token).subscribe({
        next: () => {
          this.toastService.success('Logged in successfully.');
          this.close();
          this.isRegistered.set(true);
        }
      });
    }
  }

  handleGithubLogin() {
    this.accountService.githubLogin();
    // window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23lidgsagbNnbeDOb8&redirect_uri=http://localhost:4200`;
  }
}
