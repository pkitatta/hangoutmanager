import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FirestoreService} from '../../api/firestore.service';
import {AngularFirestoreCollection, DocumentData} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {DatePipe} from '@angular/common';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-short-edits-dialog',
  templateUrl: './short-edits-dialog.component.html',
  styleUrls: ['./short-edits-dialog.component.scss']
})
export class ShortEditsDialogComponent implements OnInit {

  public progressBar: boolean = false;
  beerPrice = new FormControl(0, [Validators.required]);
  submitted: boolean = false;
  menu: any;
  did: any;
  opt: any;
  header: any;
  message: any;
  theme: any;
  formData: FormGroup | any;
  start: any;
  end: any;


  constructor(
    public firestoreService: FirestoreService,
    public dialogRef: MatDialogRef<ShortEditsDialogComponent>,
    public _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.header = data.header;
    this.message = data.message;
    if (this.header === 'Beer Price Edit') {
      this.menu = data.params.menu;
      this.did = data.params.did;
      this.opt = data.params.opt;
      this.beerPrice.setValue(this.opt.price);
    } else if (this.header === 'Theme Edit') {
      this.theme = data.params.theme;
      this.did = data.params.did;
      this.formData = new FormGroup({
        description: new FormControl('', [Validators.minLength(2), Validators.maxLength(100)]),
        entry: new FormControl('', [Validators.pattern('^((0(\\.\\d{1,2})?)|([1-9]\\d*(\\.\\d{1,2})?))$')]),
        // start: new FormControl('', [Validators.required]),
        // end: new FormControl('', [Validators.required]),
      });
    }
  }

  ngOnInit(): void {
    if (this.header === 'Theme Edit') {
      if (this.theme) {
        console.log('Theme on edit page day: ' + this.theme.day + ', ' + typeof this.theme.day);
        console.log('This is the theme start: ' + this.theme.start + ', ' + typeof this.theme.start);
        // console.log('This is the theme end: ' + this.theme.end + ', ' + typeof this.theme.end);
        console.log('This is the theme description: ' + this.theme.description + ', ' + typeof this.theme.description);
        console.log('This is the theme description: ' + this.theme.entry + ', ' + typeof this.theme.entry);
        this.start = this.theme.start;
        this.end = this.theme.end;
        if (this.theme.description != null) {
          // Add ISO format to avoid update error 2020-05-07T10:30:22.218+03:00
          this.formData.patchValue({
            description: this.theme.description,
            entry: this.theme.entry,
            // start: this.theme.start,
            // end: this.theme.end,
          });
        }

      }
    }
  }

  async onBeerPriceEdit() {
    this.progressBar = true;
    this.submitted = true;

    if (this.beerPrice.valid) {
      if (this.beerPrice.value !== '') {
        await this.firestoreService.editDrinkPrice(this.menu.mdid, this.did, this.opt.odid, this.beerPrice.value);
        this.progressBar = false;
        this.dialogRef.close();
      } else {
        this.progressBar = false;
        this.dialogRef.close();
      }
    }
  }

  async submit() {
    console.log('time: ' + this.start);
    console.log('time-2: ' + this.end);
    this.progressBar = true;
    if (this.start === this.end) {
      this._snackBar.open('Opening and Closing time are the same!', '', {
        duration: 9000
      });
      return;
    }
    console.log(this.formData);
    // console.log('Date: ' + this.formData.controls.start.value);
    // const today = new Date(this.formData.controls.start.value);
    // const dd = this.pipe.transform(today, 'HH:mm');
    // console.log('DatePipe: ' + dd);
    this.submitted = true;

    if (this.formData.valid && this.start !== this.end) {
      this.submitted = false;

      const data = {
        description: this.formData.controls.description.value,
        start: this.start,
        end: this.end,
        entry: this.formData.controls.entry.value
      };

      // send http request
      await this.firestoreService.setTheme(data, this.did, this.theme.day);
      this.progressBar = false;
      this.dialogRef.close();
    }
  }

  // Dismiss Login Modal
  dismissModal() {
    this.dialogRef.close();
  }
}
