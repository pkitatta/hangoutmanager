import {Component, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirestoreService} from '../../api/firestore.service';
import {AuthService} from '../../api/auth.service';
import {HangoutService} from '../../api/hangout.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-hangout-add',
  templateUrl: './hangout-add.component.html',
  styleUrls: ['./hangout-add.component.scss']
})
export class HangoutAddComponent implements OnInit {
  submitted = false;

  public query = '';
  public cityId = '';
  public filteredList = [];
  public curfilteredList = [];
  public elementRef;
  cities: any = [];

  formData: FormGroup | any;
  checkFlag = false;
  curcodes: any = [];
  public queryCur: string = '';
  catName = 'None';
  progressBar: boolean = false;
  @Output() create = new EventEmitter<any>();
  constructor(
    private formBuilder: FormBuilder,
    public hangoutService: HangoutService,
    public myElement: ElementRef,
    public user: AuthService,
    public firestoreService: FirestoreService,
    public _snackBar: MatSnackBar,
  ) {
    // this.getCityArray();

    this.elementRef = myElement;

    this.formData = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      street_address: ['', [Validators.required, Validators.pattern('[.,-_\\w\\s\\d]+')]],
      town: ['', [Validators.required, Validators.pattern('[.,-_\\w\\s\\d]+')]],
      currency_code: ['', [Validators.required, Validators.maxLength(3)]],
      city_id: ['', [Validators.required]],
      city_name: ['', [Validators.required]],
      category: [''],
      // gps_cords: [''],
    });
  }

  ngOnInit(): void {
    this.getCityArray();
    this.getCurrencyArray();
  }

  async submit() {
    this.progressBar = true;
    this.formData.patchValue({
      category: this.catName
    });
    this.submitted = true;

    if (this.formData.valid) {
      this.submitted = false;

      // send http request
      this.hangoutService.addHangout(this.formData).subscribe((response: any) => {
        console.log('Saved on aws');
        this.firestoreService
          .createHangout(response.data.id, response.data.name)
          .then(
            async (res) => {
              console.log('saved on fb');
              this.progressBar = false;
              this.create.emit({
                close: true,
                new: true,
              });
              await this._snackBar.open('Your Hangout has been create successfully.', '', {
                duration: 3000
              });
            },
            error => {
              console.error(error);
              this.progressBar = false;
              this.create.emit({
                close: true,
                new: true,
              });
            }
          );
      }, (e) => {
        console.log(e);
        this.progressBar = false;
        this._snackBar.open('Error: ' + e.error.message, '', {
          duration: 3000
        });
      });
    }
  }

  dismissModal() {
    this.create.emit({
      close: true,
      new: false,
    });
  }

  // Get the list of cities
  getCityArray() {
    this.user.getCities().subscribe((data: any) => {
      // data from api
      this.cities = data.data[0].cities;
      this.queryCur = data.data[0].cur_code;
    });
  }

  getCurrencyArray() {
    this.user.getCurrencies().subscribe((data: any) => {
      // data from api
      this.curcodes = data.data;
    });
  }
  filterCur() {
    if (this.queryCur !== '') {
      this.curfilteredList = this.curcodes.filter((el: any) => {
        return el.cur_code.toLowerCase().indexOf(this.queryCur.toLowerCase()) > -1;
      });
    } else {
      this.curfilteredList = [];
    }
  }

  selectCur(cur: { cur_code: string; }) {
    this.queryCur = cur.cur_code.toUpperCase().trim();
    this.curfilteredList = [];
  }

  filter() {
    console.log(this.cities);
    if (this.query !== '') {
      this.filteredList = this.cities.filter((el: any) => {
        return el.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      });
    } else {
      this.filteredList = [];
    }
  }

  select(city: { name: string; id: string; }) {
    this.query = city.name;
    this.cityId = city.id;
    this.filteredList = [];
  }

}
