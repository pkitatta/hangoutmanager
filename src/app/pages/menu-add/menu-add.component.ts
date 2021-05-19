import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FirestoreService} from '../../api/firestore.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-add.component.html',
  styleUrls: ['./menu-add.component.scss']
})
export class MenuAddComponent implements OnInit {
  formData = new FormGroup({
    cat: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]),
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
    description: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2000)]),
    price: new FormControl('', [Validators.required, Validators.pattern('^((0(\\.\\d{1,2})?)|([1-9]\\d*(\\.\\d{1,2})?))$')]),
    discountPrice: new FormControl('', [Validators.pattern('^((0(\\.\\d{1,2})?)|([1-9]\\d*(\\.\\d{1,2})?))$')]),
    available: new FormControl(true, [Validators.required]),
  });
  progressBar: boolean = false;
  did: any;
  constructor(
    public _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public firestoreService: FirestoreService,
    public dialogRef: MatDialogRef<MenuAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.did = this.data.did;
  }

  ngOnInit(): void {
  }

  async submit() {
    this.progressBar = true;
    console.log(this.formData);

    if (this.formData.valid) {
      const data = {
        cat: this.formData.controls.cat.value.trim(),
        name: this.formData.controls.name.value,
        description: this.formData.controls.description.value,
        price: this.formData.controls.price.value,
        discountPrice: null,
        photoUrl: null,
        available: true
      };

      // send http request
      await this.firestoreService.addMeal(data, this.did);
      await this.formData.reset();
      this.progressBar = false;
      this._snackBar.open('Item has been add. Continue adding, or cancel to remove form.', 'OK', {
        duration: 9000
      });
    }
  }

  dismissModal() {
    this.dialogRef.close();
  }
}
