import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {FirestoreService} from '../../api/firestore.service';
import {DocumentData} from '@angular/fire/firestore';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {GridBreakpointsService} from '../../services/grid-breakpoints.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BarServiceComponent} from '../bar-service/bar-service.component';
import {CancelOkDialogComponent} from '../../components/cancel-ok-dialog/cancel-ok-dialog.component';
import {ShortEditsDialogComponent} from '../../components/short-edits-dialog/short-edits-dialog.component';

@Component({
  selector: 'app-drink-opt-modal',
  templateUrl: './drink-opt-modal.component.html',
  styleUrls: ['./drink-opt-modal.component.scss']
})
export class DrinkOptModalComponent implements OnInit {
  cols : number | any;
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 2,
    xs: 1
  };
  // xl = 2;
  // lg = 2;
  // md = 2;
  // sm = 2;
  // xs = 1;

  breakpoint: any;
  did: any;
  menu: any;
  public coverImage: any;
  public optList: any = [];
  private additional = false;
  price = new FormControl(0, [Validators.required]);
  public otherList: any = [];
  public newOptArray: DocumentData[any];
  private tempList: any[];
  public progressBar: boolean = false;

  constructor(
    public firestoreService: FirestoreService,
    private breakpointObserver: BreakpointObserver,
    private gridBreakPoint: GridBreakpointsService,
    // public dialogRef: MatDialogRef<BarServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) {
    console.log('menuData: ' + this.data.menu.name);
    this.menu = this.data.menu;
    this.did = this.data.did;
    this.tempList = [];
    this.newOptArray = [];
    // this.cols = this.gridBreakPoint.gridBreakPontFx(this.xl, this.lg, this.md, this.sm, this.xs)
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.cols = this.gridByBreakpoint.xs;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.cols = this.gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.cols = this.gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.cols = this.gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.cols = this.gridByBreakpoint.xl;
        }
      }
    });
  }

  async ngOnInit() {
    if (this.menu) {
      this.coverImage = this.menu.photoUrl ? this.menu.photoUrl : 'http://placehold.it/500x500?text=No+Image+Uploaded';
      // this.coverImage = this.menu.photoUrl ? this.menu.photoUrl : 'https://i.picsum.photos/id/200/500/500.jpg';
    }
    await this.getDrinkOptions();
    await this.getOtherOptions();
  }

  getDrinkOptions() {
    this.firestoreService.getHangoutDrinkOptions(this.menu.mdid, this.did).subscribe((data) => {
      this.optList = data;
    });
  }
  getOtherOptions() {
    this.firestoreService.getDrinkOptions(this.menu.name).subscribe(async (data) => {
      this.newOptArray = data;
      this.tempList = [];
      this.otherList = [];
      this.optList.map((item2: { option: string; }) => {
        console.log('value: ' + item2.option);
        this.tempList.push(item2);
      });

      await this.newOptArray.map((item: { option: string; photoUrl: any; avatarUrl: any; odid: any; }) => {
        console.log('value2: ' + this.tempList.findIndex((el) => el.option === item.option) + ', real' + item.option);
        if (this.tempList.findIndex((el) => el.option === item.option) === -1) {
          const obj = {
            option: item.option,
            photoUrl: item.photoUrl,
            avatarUrl: item.avatarUrl,
            odid: item.odid
          };
          this.otherList.push(obj);
        }
      });
      console.log('other length: ' + this.otherList.length);
      console.log('array1: ' + this.newOptArray);
    });
    console.log('array2: ' + this.optList);
  }

  async menuEditPage() {
    // const imageModal = await this.modalCtrl.create({
    //   component: MenuEditPage,
    //   componentProps: {
    //     menu: this.menu,
    //     // mdid: this.route.snapshot.paramMap.get('id'),
    //     did: this.did,
    //   }
    // });
    // await imageModal.present();
  }

  dismissModal() {
    // this.modalCtrl.dismiss();
  }

  changeAvail(option: any) {
    this.firestoreService.changeDrinkAvail(this.menu.mdid, this.did, option);
  }

  async editPricePrompt(opt: any) {
    const dialogRef = this.dialog.open(ShortEditsDialogComponent, {
      data: {header: 'Beer Price Edit', message: '', params: {opt: opt, menu: this.menu, did: this.did,}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  async deleteOpt(opt: any) {
    const dialogRef = this.dialog.open(CancelOkDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.progressBar = true;
        await this.firestoreService.deleteDrinkOption(this.menu.mdid, this.did, opt.odid);
        this.progressBar = false;
        const obj = {
          option: opt.option,
          photoUrl: opt.photoUrl,
          avatarUrl: opt.avatarUrl,
          odid: opt.odid
        };
        this.otherList.push(obj);
      }
    });
  }

  addOpt(opt: any) {
    const obj = {
      option: opt.option,
      photoUrl: opt.photoUrl,
      avatarUrl: opt.avatarUrl,
      available: true,
      price: 0
    };
    this.firestoreService.addDrinkOpt(obj, opt.odid, this.did, this.menu.mdid.toLowerCase());
    this.otherList.splice(this.otherList.findIndex((el: any) => el.option === opt.option), 1);
  }

}
