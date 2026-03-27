import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-like-button',
  imports: [],
  templateUrl: './like-button.html',
  styleUrl: './like-button.css',
})
export class LikeButton {
  likeCount = input<Number>(0);
  clickEvent = output<Event>();

  onClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
