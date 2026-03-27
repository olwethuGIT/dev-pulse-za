import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-comment-button',
  imports: [],
  templateUrl: './comment-button.html',
  styleUrl: './comment-button.css',
})
export class CommentButton {
  commentsCount = input<number>(0);
}
