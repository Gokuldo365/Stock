import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'LVOW';
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) { }

  ngOnInit() {
    const theme: string | null = localStorage.getItem('theme');
    const direction: string | null = localStorage.getItem('direction');
    theme && this.document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : theme === 'dark' ? 'dark' : 'system');
    direction && this.document.body.setAttribute('dir', direction === 'ltr' ? 'ltr' : 'rtl')
  }
}
