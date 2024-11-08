import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonHelper } from '../Helper/CommonHelper';
import { DateFormat } from 'src/Helper/DateFormat';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private httpClient: HttpClient, private helper: CommonHelper) {

  }

  public GetAll(UrlName: string) {
    return this.httpClient.get<any>(`${this.helper.ApiURL}/${UrlName}`).toPromise<any>();
  }

  public GetById(id: number, UrlName: string) {
    return this.httpClient.get<any>(`${this.helper.ApiURL}/${UrlName}/${id}`).toPromise<any>();
  }

  public CommonPost(model: any, UrlName: string) {
    return this.httpClient.post(`${this.helper.ApiURL}/${UrlName}`, Object.assign({}, model)).toPromise<any>();
  }

  public CommonPut(model: any, UrlName: string) {
    return this.httpClient.put(`${this.helper.ApiURL}/${UrlName}`, Object.assign({}, model)).toPromise<any>();
  }

  public CommonPatch(model: any, UrlName: string) {
    return this.httpClient.patch(`${this.helper.ApiURL}/${UrlName}`, Object.assign(Array.isArray(model) ? [] : {}, model)).toPromise<any>();
  }

  // public Delete(id: number, UrlName: string) {
  //   return this.httpClient.get(`${this.helper.ApiURL}/${UrlName}/${id}`).toPromise();
  // }
  public Delete(UrlName: string) {
    return this.httpClient.delete(`${this.helper.ApiURL}/${UrlName}`).toPromise<any>();
  }

  public PostWithParameter(model: any, UrlName: string, params: any) {
    let url = `${this.helper.ApiURL}/${UrlName}`;
    params.forEach(e => {
      url = url + "/" + e.params;
    });
    return this.httpClient.post(url, Object.assign({}, model)).toPromise<any>();
  }

  public GetWithParameter(UrlName: string, params: any) {
    let url = `${this.helper.ApiURL}/${UrlName}`;
    params.forEach(e => {
      url = url + "/" + e.params;
    });
    return this.httpClient.get<any>(url).toPromise<any>();
  }

  public FullUrlGet(UrlName: string) {
    return this.httpClient.get<any>(UrlName, { headers: { "Anonymous": '' } }).toPromise<any>();
  }

  async GetExchangeRateOfTowCurrency(date: Date = new Date(), currency_code: string, base_currency_code: string): Promise<number> {
    let res = await this.httpClient.post(`${this.helper.ApiURL}/GetExchangeRate`, { date: DateFormat.FormatDate(date), currency_code: currency_code, base_currency_code: base_currency_code }).toPromise<any>();
    return Number(parseFloat(res["rates"][currency_code]).toFixed(6));
  }

  public DownloadPost(model: any, UrlName: string) {
    return this.httpClient.post(`${this.helper.ApiURL}/${UrlName}`, Object.assign({}, model), { observe: "response", responseType: "blob" }).toPromise<any>();
  }

  public DownloadGet(id: any, UrlName: string) {
    return this.httpClient.get(`${this.helper.ApiURL}/${UrlName}/${id}`, { observe: "response", responseType: "blob" }).toPromise<any>();
  }

  public ExcelDownloadGet(UrlName: string) {
    return this.httpClient.get(`${this.helper.ApiURL}/${UrlName}`, { observe: "response", responseType: "blob" }).toPromise<any>();
  }

  public UploadPost(model: any, UrlName: string) {
    return this.httpClient.post(`${this.helper.ApiURL}/${UrlName}`, model).toPromise<any>();
  }
}

