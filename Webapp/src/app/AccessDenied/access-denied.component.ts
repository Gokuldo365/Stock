import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
})
export class AccessDeniedComponent implements OnInit {
  constructor(
  ) { }
  ngOnInit() {
  }
}
const routes: Routes = [
  { path: "", component: AccessDeniedComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessDeniedRoutingModule { }

@NgModule({
  declarations: [AccessDeniedComponent],
  imports: [
    CommonModule,
    AccessDeniedRoutingModule
  ]
})
export class AccessDeniedModule { }
