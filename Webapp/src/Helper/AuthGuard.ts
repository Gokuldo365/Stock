import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonHelper } from './CommonHelper';
@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private router: Router,
    private helper: CommonHelper
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user_data = this.helper.GetUserInfo();
    if (user_data?.user_id) {
      return true;
    }
    else {
      this.router.navigate(['/Login']);
      return false;
    }
  }

}
