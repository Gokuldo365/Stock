import { Pipe, PipeTransform, Input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';

@Pipe({
  name: 'GetSumValue',
  pure: false
})
export class GetSumValuePipe implements PipeTransform {
  transform(value: any, Columnname: string, AddColumnname: string = "", type: string = "Add", SingelFilter = "", SingelFilterValue = ""): any {
    if (SingelFilter != "") {
      value = value.filter(o => o[SingelFilter] == SingelFilterValue);
    }
    if (value == null) {
      return 0;
    }
    else {
      let Amount = 0;
      if (type == "Add") {
        if (AddColumnname == "") {
          Amount = value.reduce((ya, u) =>
            parseFloat(ya.toString()) +
            parseFloat((u[Columnname] ? u[Columnname].toString() : 0)),
            0
          );
        }
        else {
          Amount = value.reduce((ya, u) =>
            parseFloat(ya.toString()) +
            parseFloat(((u[Columnname] ? u[Columnname] : 0) * (u[AddColumnname] ? u[AddColumnname] : 0)).toString()),
            0
          );

        }
      }
      else {

        if (AddColumnname == "") {
          Amount = value.reduce((ya, u) =>
            parseFloat(ya.toString()) -
            parseFloat(u[Columnname].toString()),
            0
          );
        }
        else {
          Amount = value.reduce((ya, u) =>
            parseFloat(ya.toString()) -
            parseFloat((u[Columnname] * u[AddColumnname]).toString()),
            0
          );

        }
      }
      return Amount;
    }
  }

}
