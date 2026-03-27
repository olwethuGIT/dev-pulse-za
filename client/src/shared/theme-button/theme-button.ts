import { Component, OnInit, signal } from '@angular/core';
import { themes } from '../../layout/theme';

@Component({
  selector: 'app-theme-button',
  imports: [],
  templateUrl: './theme-button.html',
  styleUrl: './theme-button.css',
})
export class ThemeButton implements OnInit {
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }

  setPredicate(theme: string) {
    if (this.selectedTheme() !== theme) {
      this.selectedTheme.set(theme);
      this.handleSelectTheme(theme);
    }
  }
}
