import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { CommonHelper } from '../Helper/CommonHelper';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  private get _CommonHelper() { return this._injector.get(CommonHelper); }

  constructor(private _injector: Injector) {

  }

  handleError(error) {
    console.log(error);
    if (!navigator.onLine) {
      this._CommonHelper.ErrorToastr("No Internet Connection");
    }
    else {
      this._CommonHelper.ErrorToastr("We tracked the error we will work and update soon");
    }
    this._CommonHelper.HideSpinner();

  }
}
