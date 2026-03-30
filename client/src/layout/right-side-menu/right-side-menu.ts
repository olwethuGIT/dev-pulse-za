import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-right-side-menu',
  imports: [],
  templateUrl: './right-side-menu.html',
  styleUrl: './right-side-menu.css',
})
export class RightSideMenu {
  @ViewChild('drawerToggle') drawer!: ElementRef<HTMLInputElement>;

  openDrawer() {
    this.drawer.nativeElement.checked = true;
  }

  closeDrawer() {
    this.drawer.nativeElement.checked = false;
  }

  toggleDrawer() {
    this.drawer.nativeElement.checked = !this.drawer.nativeElement.checked;
  }
}
