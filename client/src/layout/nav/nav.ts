import { Component, OnInit, signal } from '@angular/core';
import { themes } from '../theme';
import { CommonModule } from '@angular/common';
import { ThemeButton } from "../../shared/theme-button/theme-button";

@Component({
  selector: 'app-nav',
  imports: [CommonModule, ThemeButton],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {}
