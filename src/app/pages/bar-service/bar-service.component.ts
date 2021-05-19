import { Component, OnInit } from '@angular/core';
import {AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {FirestoreService} from '../../api/firestore.service';
import {Observable, of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DrinkOptModalComponent} from '../drink-opt-modal/drink-opt-modal.component';
import {CancelOkDialogComponent} from '../../components/cancel-ok-dialog/cancel-ok-dialog.component';

@Component({
  selector: 'app-bar-service',
  templateUrl: './bar-service.component.html',
  styleUrls: ['./bar-service.component.scss']
})
export class BarServiceComponent implements OnInit {
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
  public progressBar: boolean = false;
  panelOpenState = false;
  // private menuList: Observable<DocumentData[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public firestoreService: FirestoreService,
    public dialog: MatDialog
  ) {
    console.log('Bar service Constructor');
    this.hangIndex = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.data.special) {
      this.hangInfo = this.route.snapshot.data.special;
      this.hangoutId = this.hangInfo.id;
      this.did = this.hangInfo.did;
      console.log('this.did: ', this.did);
    }

    this.menuList = this.firestoreService.getHangoutMenu(this.did, 'bar').valueChanges({ idField: 'mdid' });
    this.itemsCollection = this.firestoreService.getHangoutOrders(this.did, 'bar');
    this.orderData = this.itemsCollection.valueChanges({idField: 'odid'});
    // console.log('menuLength: ' + this.menuList);
    // console.log('menuLength type: ' + typeof this.menuList);
    // this.menuList.forEach((menu) => {
    //   console.log('menu: ' + menu);
    // });
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
      this.deliveredList = [];
      this.receiptList = [];
      order.forEach((ord) => {
        // console.log('ord: ' + ord.section);
        if (ord.delivered === false) {
          this.orderList.push(ord);
        } else if (ord.delivered === true && ord.settled === false) {
          this.deliveredList.push(ord);
        } else if (ord.delivered === true && ord.settled === true) {
          this.receiptList.push(ord);
        }
      });
      console.log('ord: ' + typeof this.orderList.length);
      this.orderNot = this.orderList.length;
      this.delNot = this.deliveredList.length;
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/hangout-detail/' + this.hangIndex]);
  }

  async drinkDetail(menu: any) {
    console.log('menuId: ' + menu.mdid);

    const dialogRef = this.dialog.open(DrinkOptModalComponent, {
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
    await this.firestoreService.sendToDelivered(this.did, order.odid, order);
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
