import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[abs-dropdown-footer]'
})

export class DropdownFooterDirective implements OnInit {

  @Input() footer_template: any;

  constructor(private el: ElementRef) {

  }
  ngOnInit() {
    if (this.el.nativeElement) {
      this.el.nativeElement.addEventListener('click', (event) => {
        if (event.currentTarget.querySelector(".p-dropdown-open")) {
          this.AssignFooter(event, this.footer_template)
        }
        else {
          event.stopPropagation();
        }

      }, false);
    }
  }

  AssignFooter(event, footer_template) {

    let select_container = event.currentTarget.querySelector(".p-dropdown-panel.p-component")
    if (event) {
      if (footer_template) {
        select_container.appendChild(footer_template);
        footer_template.style = "";
      }
    }


  }

}
