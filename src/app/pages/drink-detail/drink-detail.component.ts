import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {DocumentData} from '@angular/fire/firestore';
import {FirestoreService} from '../../api/firestore.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-drink-detail',
  templateUrl: './drink-detail.component.html',
  styleUrls: ['./drink-detail.component.scss']
})
export class DrinkDetailComponent implements OnInit {
  drink: any;
  public optList: any = [];
  header: any;
  message: any;
  did: any;
  public newOptArray: Observable<DocumentData[]>;
  progressBar: boolean = false;

  cols : number | any;
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 2,
    xs: 1
  };

  constructor(
    public firestoreService: FirestoreService,
    private breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<DrinkDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.drink = data.params.drink;
    this.did = data.params.did;

    this.newOptArray = this.firestoreService.getDrinkOptions(this.drink.name);
    this.newOptArray.forEach((menua) => {
      // menua.option.isEmpty = false;
      menua.forEach(opt => {
        const obj = {
          option:opt.option,
          isChecked: true,
          photoUrl: opt.photoUrl,
          avatarUrl: opt.avatarUrl,
          odid: opt.odid
        };
        this.optList.push(obj);
      });
    });

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

  ngOnInit(): void {
    //
  }

  async addDrink() {
    this.progressBar = true;
    const drinkObj = {
      name: this.drink.name,
      photoUrl: this.drink.photoUrl,
      type: this.drink.type
    };
    console.log('drinkObj: ' + drinkObj);
    await this.firestoreService.addDrink(drinkObj, this.drink.mdid.toLowerCase(), this.did);
    await this.optList.forEach((drink: { isChecked: any; option: any; photoUrl: any; avatarUrl: any; odid: any; }) => {
      if (drink.isChecked) {
        const obj = {
          option: drink.option,
          photoUrl: drink.photoUrl,
          avatarUrl: drink.avatarUrl,
          available: true,
          price: 0
        };
        this.firestoreService.addDrinkOpt(obj, drink.odid, this.did, this.drink.mdid.toLowerCase());
      }
    });

    this.progressBar = false;
    this.dialogRef.close();
  }

}
