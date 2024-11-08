import { isPlatformBrowser, Location, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID, QueryList, TemplateRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MTemplateDirective } from 'src/Directives/template.directive';

@Component({
  selector: 'app-sticky-page-header',
  standalone: true,
  imports: [
    ButtonModule,
    NgIf,
    NgClass,
    NgTemplateOutlet,
    MTemplateDirective
  ],
  templateUrl: './sticky-page-header.component.html',
  styleUrl: './sticky-page-header.component.scss'
})
export class StickyPageHeaderComponent implements AfterViewInit, OnDestroy, AfterContentInit {
  @Input() title: string = '';
  @Input() showBackButton: boolean = true;
  @Input() isCardTitle: boolean = true;
  @Input() defaultHref!: string;
  @Output() isPinned = new EventEmitter<boolean>();
  headerIntersectionObserver!: IntersectionObserver;
  hasHistory!: boolean;
  _isPinned: boolean = false;
  public actionButtonsTemplate!: TemplateRef<any>;
  public inputTemplate!: TemplateRef<any>;  
  @ContentChildren(MTemplateDirective) templates!: QueryList<MTemplateDirective>;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private hostElement: ElementRef,
    public location: Location,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.hasHistory = window.history.length > 2;
      // console.log(window.history.length, this.hasHistory)
    }
  }

  ngAfterContentInit() {
    /* Assigning template content to container */
    if (isPlatformBrowser(this.platformId)) {
      this.templates.forEach((item) => {
        switch (item.name) {
          case 'buttons':
            this.actionButtonsTemplate = item.template;
          break;
          case 'input':
            this.inputTemplate = item.template;
          break;
        }
      });
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      let headerHeight = (this.hostElement.nativeElement as HTMLElement).scrollHeight;      
      /* Header sticky observer */
      this.headerIntersectionObserver = new IntersectionObserver(([entries]) => {
        const yPosition = (entries.boundingClientRect as DOMRectReadOnly).y;        
        if (yPosition <= 68 || entries.intersectionRatio < 0.09) {
          let classList = this.isCardTitle ? ['pinned', 'card'] : ['pinned'];
          this.isPinned.emit(true);
          this._isPinned = true;    
          (this.hostElement.nativeElement as HTMLElement).classList.add(...classList);
        } else {
          (this.hostElement.nativeElement as HTMLElement).classList.remove('pinned', 'card');
          this.isPinned.emit(false);
          this._isPinned = false;         
        }
      },
      {threshold: [0, 0.1, 0.2], rootMargin: `-${64+headerHeight}px 0px 0px 0px`,}
      // {threshold: [0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6,0.65,0.7,0.75,0.8,0.85,0.9,0.95,1,0], rootMargin: "-121px 0px 0px 0px",}
      );
      this.headerIntersectionObserver.observe(this.hostElement.nativeElement);      
      
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.headerIntersectionObserver.unobserve(this.hostElement.nativeElement);
    }
  }

  navigateBack() {
    this.hasHistory ? this.location.back() : this.router.navigate([this.defaultHref]);
  }
}
