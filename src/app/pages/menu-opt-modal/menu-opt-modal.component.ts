import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FirestoreService} from '../../api/firestore.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Component({
  selector: 'app-menu-opt-modal',
  templateUrl: './menu-opt-modal.component.html',
  styleUrls: ['./menu-opt-modal.component.scss']
})
export class MenuOptModalComponent implements OnInit {

  formData = new FormGroup({
    cat: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2000)]),
    price: new FormControl('', [Validators.required, Validators.pattern('^((0(\\.\\d{1,2})?)|([1-9]\\d*(\\.\\d{1,2})?))$')]),
    discountPrice: new FormControl('', [Validators.pattern('^((0(\\.\\d{1,2})?)|([1-9]\\d*(\\.\\d{1,2})?))$')]),
    available: new FormControl(true, [Validators.required]),
  });
  edit: boolean = false;
  cols : number | any;
  gridByBreakpoint = {
    xl: 2,
    lg: 2,
    md: 2,
    sm: 2,
    xs: 1
  };
  breakpoint: any;
  public progressBar: boolean = false;
  public submitted: boolean = false;
  imgCrop: boolean = false;
  type: string = '';
  did: any;
  menu: any;
  public coverImage: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public firestoreService: FirestoreService,
    public dialogRef: MatDialogRef<MenuOptModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.menu = this.data.menu;
    this.did = this.data.did;
    if (this.menu) {
      this.coverImage = this.menu.photoUrl ? this.menu.photoUrl : 'http://placehold.it/500x500?text=No+Image+Uploaded';
    }

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

  onClickEdit() {
    this.edit = true;
    if (this.menu.name != null) {
      this.formData.patchValue({
        cat: this.menu.cat,
        name: this.menu.name,
        description: this.menu.description,
        price: this.menu.price,
        discountPrice: this.menu.discountPrice,
        available: this.menu.available,
      });
    }
  }

  async submit() {
    this.progressBar = true;
    console.log(this.formData);
    this.submitted = true;

    if (this.formData.valid) {
      this.submitted = false;

      const data = {
        cat: this.formData.controls.cat.value.trim(),
        name: this.formData.controls.name.value,
        description: this.formData.controls.description.value,
        price: this.formData.controls.price.value,
        discountPrice: this.formData.controls.discountPrice.value,
        available: this.formData.controls.available.value
      };

      console.log('data: ' + data);

      // send http request
      await this.firestoreService.editMeal(data, this.did, this.menu.mdid);
      this.progressBar = false;
      this.edit = false;
    }
  }

  updateImg(data: any) {
    this.imgCrop = !data.close;
    data.data != null ? this.coverImage = data.data : null;
  }
}
