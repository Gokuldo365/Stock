import { RateCutCalculationModel } from "@Model/Product/StockEntryDetail.model";
import { Injectable } from "@nestjs/common";
import { stock_entry } from "@Root/Database/Table/Product/stock_entry";
import { round } from "lodash";

@Injectable()
export class StockRateCutService {
  constructor() {
  }

  async GetAll() {
    const StockRateCut = await stock_entry.find()
    return StockRateCut ;
  }

async RateCutCalculation(RateCutCalculationData: RateCutCalculationModel, UserId: string) {
  //calculation
  let TotalRoundOffAmount: number = 0;
  let RountOffValue: number = 0;
  let Discount: number = 0;

  const ItemAmount = parseFloat(((RateCutCalculationData.gold_rate * RateCutCalculationData.rate_cut_weight) / RateCutCalculationData.rate_per_gram).toFixed(2));
  const GrossAmount = parseFloat((ItemAmount + RateCutCalculationData.other_amount).toFixed(2));
  const GstAmount = parseFloat((GrossAmount * (RateCutCalculationData.gst / 100)).toFixed(2));
  const TcsTdsAmount = parseFloat((GrossAmount * (RateCutCalculationData.tcs_tds / 100)).toFixed(2));
  const TotalAmount = parseFloat((GrossAmount + GstAmount - TcsTdsAmount).toFixed(2));

  TotalRoundOffAmount = parseFloat((TotalAmount - Math.floor(TotalAmount)).toFixed(2));
  RountOffValue = parseFloat((TotalRoundOffAmount * 100 / (100 + RateCutCalculationData.gst)).toFixed(2));


  const _StockEntryData = new stock_entry();
  _StockEntryData.sales_type = RateCutCalculationData.sales_type;
  _StockEntryData.rate_cut_weight = RateCutCalculationData.rate_cut_weight;
  _StockEntryData.gold_rate = RateCutCalculationData.gold_rate;
  _StockEntryData.rate_per_gram = RateCutCalculationData.rate_per_gram;

  //Calculation
  _StockEntryData.item_amount = ItemAmount;
  _StockEntryData.other_amount = RateCutCalculationData.other_amount;
  _StockEntryData.gross_amount = GrossAmount;
  _StockEntryData.gst = RateCutCalculationData.gst;
  _StockEntryData.tcs_tds = RateCutCalculationData.tcs_tds;

  const GstAmountRoundOff = parseFloat((RountOffValue * (_StockEntryData.gst / 100)).toFixed(2));
  _StockEntryData.gst_amount = parseFloat((GstAmount - GstAmountRoundOff).toFixed(2));
  const TCSTDSAmountRoundOff = parseFloat((RountOffValue * (_StockEntryData.tcs_tds / 100)).toFixed(2));
  _StockEntryData.tcs_tds_amount = parseFloat((TcsTdsAmount - TCSTDSAmountRoundOff).toFixed(2));

  if(RateCutCalculationData.discount){
    Discount = RountOffValue + GstAmountRoundOff - TCSTDSAmountRoundOff + RateCutCalculationData.discount;
  }
  else{
    Discount = RountOffValue + GstAmountRoundOff - TCSTDSAmountRoundOff;
  }
  _StockEntryData.discount = Discount
  const FinalAmount :number = parseFloat((_StockEntryData.gross_amount + _StockEntryData.gst_amount - _StockEntryData.tcs_tds_amount - _StockEntryData.discount).toFixed(2));
  _StockEntryData.total_amount = Math.floor(FinalAmount);

  _StockEntryData.updated_by_id = UserId;
  _StockEntryData.updated_on = new Date();

  await stock_entry.update(RateCutCalculationData.stock_entry_id, _StockEntryData);
  return _StockEntryData;
}


// async RateCutCalculation(RateCutCalculationData: RateCutCalculationModel, UserId: string) {
//   //calculation
//   let TotalRoundOffAmount: number = 0;
//   let RountOffValue: number = 0;
//   let Discount: number = 0;

//   const ItemAmount = parseFloat(((RateCutCalculationData.gold_rate * RateCutCalculationData.rate_cut_weight) / RateCutCalculationData.rate_per_gram).toFixed(2));
//   const GrossAmount = parseFloat((ItemAmount + RateCutCalculationData.other_amount).toFixed(2));
//   const GstAmount = parseFloat((GrossAmount * (RateCutCalculationData.gst / 100)).toFixed(2));
//   const TcsTdsAmount = parseFloat((GrossAmount * (RateCutCalculationData.tcs_tds / 100)).toFixed(2));
//   const TotalAmount = parseFloat((GrossAmount + GstAmount - TcsTdsAmount).toFixed(2));

//   TotalRoundOffAmount = parseFloat((TotalAmount - Math.floor(TotalAmount)).toFixed(2));
//   RountOffValue = parseFloat((TotalRoundOffAmount * 100 / (100 + RateCutCalculationData.gst)).toFixed(2));


//   const _StockEntryData = new stock_entry();
//   _StockEntryData.sales_type = RateCutCalculationData.sales_type;
//   _StockEntryData.rate_cut_weight = RateCutCalculationData.rate_cut_weight;
//   _StockEntryData.gold_rate = RateCutCalculationData.gold_rate;
//   _StockEntryData.rate_per_gram = RateCutCalculationData.rate_per_gram;

//   //Calculation
//   _StockEntryData.item_amount = ItemAmount;
//   _StockEntryData.other_amount = RateCutCalculationData.other_amount;
//   _StockEntryData.gross_amount = GrossAmount;
//   _StockEntryData.gst = RateCutCalculationData.gst;
//   _StockEntryData.tcs_tds = RateCutCalculationData.tcs_tds;

//   const GstAmountRoundOff = parseFloat((RountOffValue * (_StockEntryData.gst / 100)).toFixed(2));
//   _StockEntryData.gst_amount = parseFloat((GstAmount - GstAmountRoundOff).toFixed(2));

//   const TCSTDSAmountRoundOff = parseFloat((RountOffValue * (_StockEntryData.tcs_tds / 100)).toFixed(2));
//   _StockEntryData.tcs_tds_amount = parseFloat((TcsTdsAmount - TCSTDSAmountRoundOff).toFixed(2));

//   const FinalTotal :number = parseFloat((_StockEntryData.gross_amount + _StockEntryData.gst_amount - _StockEntryData.tcs_tds_amount).toFixed(2));
//   const FinalAmountDiscount : number = parseFloat((FinalTotal - Math.floor(FinalTotal)).toFixed(2));
//   Discount = parseFloat((RountOffValue + GstAmountRoundOff - TCSTDSAmountRoundOff + FinalAmountDiscount).toFixed(2));
//   _StockEntryData.discount = Discount + FinalAmountDiscount;
//   _StockEntryData.total_amount = FinalTotal - Discount;
//   _StockEntryData.updated_by_id = UserId;
//   _StockEntryData.updated_on = new Date();

//   await stock_entry.update(RateCutCalculationData.stock_entry_id, _StockEntryData);
//   return _StockEntryData;
// }




}
