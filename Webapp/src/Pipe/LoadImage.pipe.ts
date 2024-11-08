import { Pipe, PipeTransform, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from '../Service/Common.service';

@Pipe({
  name: 'LoadImage'
})
export class LoadImage implements PipeTransform {
  constructor(private service: CommonService) {

  }
  async transform(value: string): Promise<any> {
    if (value) {
      if (new RegExp(/^data:image\/[a-z]+;base64,/).test(value)) {
        return value;
      }
      else if (new RegExp(/^data:application\/[a-z]+;base64,/).test(value)) {
        return "dfssdfsdf";
      }
      else {
        return environment.API_URL + "/GetCompanyImage/" + value;
      }
    }
  }

}
