import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ModalService } from '../../core/services/modal-service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast-service';
import { LoginCreds } from '../../types/user';
import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-account-modal',
  imports: [FormsModule],
  templateUrl: './account-modal.html',
  styleUrl: './account-modal.css',
})
export class AccountModal {
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
    this.modalService.modalState$.subscribe((isOpen) => {
      if (isOpen) {
        this.modal.nativeElement.showModal();
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
      error: (error) => {
        this.toastService.error(error.error);
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
}
