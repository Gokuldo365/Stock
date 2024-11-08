
import { formatDate } from '@angular/common';

export class DateFormat {

  public static GetCurrentDate(): string {
    return formatDate(new Date(), 'yyyy-MM-dd', 'en-us');
  }

  public static FormatDateUsingCustom(date: Date, format: string): string {
    return formatDate(date, format, 'en-us');
  }

  public static GetCurrentYear(): string {
    return formatDate(new Date(), 'yyyy', 'en-us');
  }
  public static GetCurrentMonth(): string {
    return formatDate(new Date(), 'MM', 'en-us');
  }
  public static GetMonthAndYear(Datevalue: Date): string {
    return formatDate(Datevalue, 'MMM-yyyy', 'en-us');
  }
  public static FormatDate(Datevalue: Date): string {
    return formatDate(Datevalue, 'yyyy-MM-dd', 'en-us');
  }
  public static FormatDateToDP(Datevalue: Date): string {
    return formatDate(Datevalue, 'dd-MMM-yyyy', 'en-us');
  }
  public static FormatDateToDateAndTime(Datevalue: Date): string {
    return formatDate(Datevalue, 'yyyy-MM-dd H:mm:ss', 'en-us');
  }
  public static GetMonthStartDate() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay;
  }
  public static GetMonthEndDate() {
    var date = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay;
  }
  public static GetTwelveMonthBeforeFromStartDate(date = new Date()) {
    var lastDay = new Date(date.getFullYear(), date.getMonth() - 10, 0);
    return lastDay;
  }
  public static monthDiff(dateFrom, dateTo) {
    let months = dateTo.getMonth() - dateFrom.getMonth() +
      (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
    console.log(months);
    return months;
  }

  public static OneMonthRangeByEndDate(date = new Date()) {
    var lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30);
    return lastDay;
  }

  public static FormatDateTimeDisplay(Datevalue: Date): string {
    return formatDate(Datevalue, 'dd-MMM-yyyy HH:mm:ss', 'en-us');
  }

  public static GetMonthEndDateByStartDate(Datevalue: Date) {
    var lastDay = new Date(Datevalue.getFullYear(), Datevalue.getMonth() + 1, 0);
    return lastDay;
  }

  public static DayDiff(dateFrom, dateTo) {
    const diffTime = Math.abs(dateTo - dateFrom);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  public static GetWeekStartDate() {
    var date = new Date();
    var firstDay = new Date(date.setDate(date.getDate() - date.getDay()));
    return firstDay;
  }

  public static GetWeekEndDate() {
    var date = new Date();
    var EndDay = new Date(date.setDate(date.getDate() - date.getDay() + 6));
    return EndDay;
  }

  public static FormatDateTimeForAPI(Datevalue: Date): string {
    return formatDate(Datevalue, 'yyyy-MM-dd HH:mm', 'en-us');
  }

  public static DateTimeToStringDateTime(date : Date)
  {
    let Hours : any = "";
    let Minutes : any = "";
    // Hours
    if(date.getHours() == 0){
      Hours = "00";
    }
    else if(date.getHours() == 1){
      Hours = "01";
    }
    else if(date.getHours() == 2){
      Hours = "02";
    }
    else if(date.getHours() == 3){
      Hours = "03";
    }
    else if(date.getHours() == 4){
      Hours = "04";
    }
    else if(date.getHours() == 5){
      Hours = "05";
    }
    else if(date.getHours() == 6){
      Hours = "06";
    }
    else if(date.getHours() == 7){
      Hours = "07";
    }
    else if(date.getHours() == 8){
      Hours = "08";
    }
    else if(date.getHours() == 9){
      Hours = "09";
    }
    else{
      Hours = date.getHours();
    }
    // Hours

    // Minutes
    if(date.getMinutes() == 0){
      Minutes = "00"
    }
    else if(date.getMinutes() == 1){
      Minutes = "01"
    }
    else if(date.getMinutes() == 2){
      Minutes = "02"
    }
    else if(date.getMinutes() == 3){
      Minutes = "03"
    }
    else if(date.getMinutes() == 4){
      Minutes = "04"
    }
    else if(date.getMinutes() == 5){
      Minutes = "05"
    }
    else if(date.getMinutes() == 6){
      Minutes = "06"
    }
    else if(date.getMinutes() == 7){
      Minutes = "07"
    }
    else if(date.getMinutes() == 8){
      Minutes = "08"
    }
    else if(date.getMinutes() == 9){
      Minutes = "09"
    }
    else{
      Minutes = date.getMinutes();
    }
    // Minutes
    date.setMonth(date.getMonth() + 1);
    let dateTime = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    return formatDate(dateTime, 'yyyy-MM-dd HH:mm', 'en-us')

  }
  
}
