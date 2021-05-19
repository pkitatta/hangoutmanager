import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HangoutDataService {

  private data: any = [];
  private hangouts: any = [];
  constructor() { }

  setData(id: number, data: any) {
    this.data[id] = data;
  }

  getData(id: number) {
    return this.data[id];
  }

  setHangouts(data: any) {
    this.hangouts = data;
  }

  getHangout(index: string | number) {
    return this.hangouts[index];
  }

  getHangouts() {
    return this.hangouts;
  }

  setDid(did: string, hangIndex: number) {
    this.hangouts[hangIndex].did = did;
  }
}
