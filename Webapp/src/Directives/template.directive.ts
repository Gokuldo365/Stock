import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[mTemplate]',
  standalone: true
})
export class MTemplateDirective implements OnInit {
  @Input() tempName!: string;
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) { }

  ngOnInit() {
  //   // if (this.condition) {
      console.log('MTemplateDirective', this.tempName)
      // this.viewContainer.createEmbeddedView(this.templateRef);
  //   // } else {
  //   //   this.viewContainer.clear();  

  //   // }
  }

  get name() {
    return this.tempName;
  }

  get template() {
    return this.templateRef
  }
}
