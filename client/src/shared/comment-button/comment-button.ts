import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-comment-button',
  imports: [],
  templateUrl: './comment-button.html',
  styleUrl: './comment-button.css',
})
export class CommentButton {
  commentCount = signal(32);
}
