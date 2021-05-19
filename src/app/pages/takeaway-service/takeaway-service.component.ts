import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {FirestoreService} from '../../api/firestore.service';
import {MatDialog} from '@angular/material/dialog';
import {MenuOptModalComponent} from '../menu-opt-modal/menu-opt-modal.component';
import {CancelOkDialogComponent} from '../../components/cancel-ok-dialog/cancel-ok-dialog.component';

@Component({
  selector: 'app-takeaway-service',
  templateUrl: './takeaway-service.component.html',
  styleUrls: ['./takeaway-service.component.scss']
})
export class TakeawayServiceComponent implements OnInit {
  public hangoutId: any;
  public menuList: Observable<DocumentData[any]>;
  public hangIndex: any;
  public hangInfo: any;
  public did: string = '';
  public orderList: any = [];
  public orderNot = 0;
  public itemsCollection: AngularFirestoreCollection<any>;
  public deliveredList: any = [];
  public orderData: Observable<DocumentData[]>;
  public delNot: number = 0;
  public receiptList: any = [];
  public enrouteList: any = [];
  public enrNot: number = 0;
  public progressBar: boolean = false;
  panelOpenState = false;
  // private menuList: Observable<DocumentData[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public firestoreService: FirestoreService,
    public dialog: MatDialog
  ) {
    this.hangIndex = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.data.special) {
      this.hangInfo = this.route.snapshot.data.special;
      this.hangoutId = this.hangInfo.id;
      this.did = this.hangInfo.did;
      console.log('this.did: ', this.did);
    }

    this.menuList = this.firestoreService.getHangoutMenu(this.did, 'restaurant').valueChanges({ idField: 'mdid' });
    this.itemsCollection = this.firestoreService.getHangoutDeliveries(this.did, 'takeaway');
    this.orderData = this.itemsCollection.valueChanges({idField: 'odid'});
  }

  ngOnInit() {
    console.log('Bar service Init');
    // this.hangIndex = this.route.snapshot.paramMap.get('id');
    // if (this.route.snapshot.data.special) {
    //   this.hangInfo = this.route.snapshot.data.special;
    //   this.hangoutId = this.hangInfo.id;
    //   this.did = this.hangInfo.did;
    //   console.log('this.did: ', this.did);
    // }
    this.getOrderData();
    this.getMenu();
  }

  getMenu() {
    // this.menuList = this.firestoreService.getHangoutMenu(this.did, 'bar').valueChanges({ idField: 'mdid' });
    // console.log('menuLength: ' + this.menuList);
    // this.menuList.forEach((menu) => {
    //   console.log('menu: ' + menu[0].name);
    // });
  }

  getOrderData() {
    // this.itemsCollection = this.firestoreService.getHangoutOrders(this.did, 'bar');
    // this.orderData = this.itemsCollection.valueChanges({idField: 'odid'});
    console.log('list type: ' + typeof this.orderData);
    this.orderData.forEach((order) => {
      console.log('order: ' + order.length);
      // this.orderNot = order.length;
      this.orderList = [];
      this.enrouteList = [];
      this.deliveredList = [];
      order.forEach((ord) => {
        console.log('ord: ' + ord.section);
        if (ord.enroute === false && ord.delivered === false) {
          this.orderList.push(ord);
        } else if (ord.enroute === true && ord.delivered === false) {
          this.enrouteList.push(ord);
        } else if (ord.delivered === true) {
          this.deliveredList.push(ord);
        }
      });
      this.orderNot = this.orderList.length;
      this.enrNot = this.enrouteList.length;
      this.enrNot = this.enrouteList.length;
    });
  }

  async menuDetail(menu: any) {
    console.log('menuId: ' + menu.mdid);

    const dialogRef = this.dialog.open(MenuOptModalComponent, {
      height: '70%',
      width: '70%',
      data: {menu, did: this.did,}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  async sendToDelivered(order: any) {
    this.progressBar = true;
    await this.firestoreService.sendToDeliveredOrders(this.did, order.odid);
    this.progressBar = false;
  }

  async sendToEnroute(order: any) {
    this.progressBar = true;
    await this.firestoreService.sendToEnroute(this.did, order.odid);
    this.progressBar = false;
  }

  async cancelOrder(order: any) {
    const dialogRef = this.dialog.open(CancelOkDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.progressBar = true;
        await this.firestoreService.cancelOrder(this.did, order.odid);
        this.progressBar = false;
      }
    });
  }

  async removeOrder(order: any) {
    this.progressBar = true;
    await this.firestoreService.removeOrder(this.did, order.odid);
    this.progressBar = false;
  }

  async settlement(order: any, settlement: string) {
    const dialogRef = this.dialog.open(CancelOkDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.progressBar = true;
        await this.firestoreService.settleOrder(this.did, order.odid, settlement);
        this.progressBar = false;
      }
    });
  }

  async rejectCash(order: any) {
    this.progressBar = true;
    await this.firestoreService.rejCash(this.did, order.odid);
    this.progressBar = false;
  }
}
