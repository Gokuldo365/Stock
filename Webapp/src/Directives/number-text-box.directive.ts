import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[numeric]'
})

export class NumericDirective {

  @Input('decimals') decimals: number = 0;
  @Input('is_negative') is_negative: boolean = false;

  // private check(value: string, decimals: number) {
  //   if (decimals <= 0) {
  //     return String(value).match(new RegExp(/^\d+$/));
  //   } else {
  //     var regExpString = "^\\s*((\\d+(\\.\\d{0," + decimals + "})?)|((\\d*(\\.\\d{1," + decimals + "}))))\\s*$"
  //     return String(value).match(new RegExp(regExpString));
  //   }
  // }

  private check(value: string, decimals: number) {
    var regExpString = "\\s*((\\d+(\\.\\d{0," + decimals + "})?)|((\\d*(\\.\\d{1," + decimals + "}))))\\s*$";
    if (decimals <= 0) {
      return String(value).match(new RegExp(/^\d+$/));
    } else {
      if (this.is_negative) {
        if (value.length == 1) {
          if (value == "-") {
            return true;
          }
          else {
            return String(value).match(new RegExp("^" + regExpString));
          }
        }
        else {
          return String(value).match(new RegExp("^-?" + regExpString));
        }
      }
      else {
        return String(value).match(new RegExp("^" + regExpString));
      }
    }
  }

  private specialKeys = [
    'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'
  ];

  constructor(private el: ElementRef) {
  }
  replaceAtRange(start, end, value, replacement) {
    return value.substring(0, start) + replacement + value.substring(end);
  };

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1 ||
      (event.key === 'a' && event.ctrlKey === true) || // Allow: Ctrl+A
      (event.key === 'c' && event.ctrlKey === true) || // Allow: Ctrl+C
      (event.key === 'v' && event.ctrlKey === true) || // Allow: Ctrl+V
      (event.key === 'x' && event.ctrlKey === true) || // Allow: Ctrl+X
      (event.key === 'a' && event.metaKey === true) || // Cmd+A (Mac)
      (event.key === 'c' && event.metaKey === true) || // Cmd+C (Mac)
      (event.key === 'v' && event.metaKey === true) || // Cmd+V (Mac)
      (event.key === 'x' && event.metaKey === true) // Cmd+X (Mac)
    ) {
      return;
    }

    let current: string = this.el.nativeElement.value;
    let next: string = this.replaceAtRange(event.currentTarget['selectionStart'], event.currentTarget['selectionEnd'], current, event.key);
    if (next && !this.check(next, this.decimals)) {
      event.preventDefault();
    }
  }

}
