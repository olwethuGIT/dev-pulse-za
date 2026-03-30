import { Component, inject, input, output, signal } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { ModalService } from '../../core/services/modal-service';

@Component({
  selector: 'app-like-button',
  imports: [],
  templateUrl: './like-button.html',
  styleUrl: './like-button.css',
})
export class LikeButton {
  likeCount = input<Number>(0);
  clickEvent = output<Event>();
  private accountService = inject(AccountService);
  private modalService = inject(ModalService);

  onClick(event: Event) {
    if (this.accountService.currentUser() == null) {
      this.modalService.open();
    } else {
      this.clickEvent.emit(event);
    }
  }
}
