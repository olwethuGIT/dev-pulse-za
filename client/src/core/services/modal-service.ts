import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalState = new Subject<boolean>();
  modalState$ = this.modalState.asObservable();

  open() {
    this.modalState.next(true);
  }

  close() {
    this.modalState.next(false);
  }
}
