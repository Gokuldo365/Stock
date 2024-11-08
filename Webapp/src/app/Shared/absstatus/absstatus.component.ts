import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, NgModule, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgPipesModule } from 'ngx-pipes';

@Component({
  selector: 'absstatus',
  templateUrl: './absstatus.component.html',
})
export class AbsstatusComponent implements OnInit {

  @Input() lable: string = "A";

  constructor() { }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [AbsstatusComponent],
  imports: [
    CommonModule
  ],
  exports: [AbsstatusComponent]
})
export class AbsstatusModule { }
