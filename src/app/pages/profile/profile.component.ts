import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HangoutDataService} from '../../services/hangout-data.service';
import {FirestoreService} from '../../api/firestore.service';
import {HangoutService} from '../../api/hangout.service';
import {AuthService} from '../../api/auth.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public hangInfo: any;
  private coverImageId: any;
  public coverImage: any;
  public thumbImage: any;
  public fbObj: any;
  public services: any;
  public servicesList: any[] = [];
  public hangoutId: any;
  public hangIndex: any;
  public adminLevel: any;
  private thumbImageId: any;
  edit: boolean = false;

  public query = '';
  public cityId = '';
  public filteredList = [];
  public curfilteredList = [];
  // public elementRef;
  cities: any = [];

  formData: FormGroup | any;
  messageBoard = new FormControl('', [Validators.minLength(2), Validators.maxLength(2000)]);
  basePrice: FormGroup | any;
  checkFlag = false;
  curcodes: any = [];
  public queryCur: string = '';
  catName: string = '';

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
  editMessage: boolean = false;
  progBarMess: any = false;
  editBasePrice: boolean = false;
  itemName = 'Beer Price';
  entryName = 'Entry Price';
  editServices: boolean = false;
  fbProgBar: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private service: HangoutDataService,
    public firestoreService: FirestoreService,
    public hangoutService: HangoutService,
    public user: AuthService,
    public myElement: ElementRef,
    public _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) {
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

    this.basePrice = this.formBuilder.group({
      item_price: [0, [Validators.required]],
      entry_price: [0, [Validators.required]],
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

  ngOnInit() {
    this.hangIndex = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  async getData() {
    if (this.route.snapshot.data.special) {
      this.hangInfo = this.route.snapshot.data.special;
      this.hangoutId = this.hangInfo.id;
      this.coverImageId = this.hangInfo.photo_id;
      this.thumbImageId = this.hangInfo.thumbnail_id;
      this.coverImage = this.hangInfo.photo
        ? this.hangInfo.photo.file
        : null;
      this.thumbImage = this.hangInfo.thumbnail
        ? this.hangInfo.thumbnail.thumb
        : null;
      // this.coverImage = 'https://material.angular.io/assets/img/examples/shiba2.jpg';
      // this.thumbImage = 'https://material.angular.io/assets/img/examples/shiba1.jpg';
      this.adminLevel = this.hangInfo.pivot.level;
    }
    this.fbProgBar = true;
    this.firestoreService.getHangout(Number(this.hangoutId)).valueChanges().subscribe((res: any) => {
      this.fbProgBar = false;
      console.log('services: ' + res[0].services);
      console.log('SevicesLength: ' + res[0].services.length);
      this.fbObj = res[0];
      this.services = this.fbObj.services.length > 0;
      this.servicesList = this.fbObj.services;
    }, error => (error));
  }

  onClickEdit() {
    this.edit = true;
    this.formData.patchValue({
      name: this.hangInfo.name,
      street_address: this.hangInfo.street_address,
      town: this.hangInfo.town,
      currency_code: this.hangInfo.currency_code,
      city_id: this.hangInfo.city_id,
      city_name: this.hangInfo.city.name,
    });
    this.queryCur = this.hangInfo.currency_code;
    this.query = this.hangInfo.city.name;
    this.cityId = this.hangInfo.city.id;
    this.catName = this.hangInfo.category ? this.hangInfo.category : 'None';

    this.getCityArray();
    this.getCurrencyArray();
  }

  onClickEditMessage() {
    this.editMessage = true;
    this.messageBoard.setValue(this.hangInfo.message_board ? this.hangInfo.message_board : '');
  }

  onClickEditBasePrice() {
    this.editBasePrice = true;
    this.basePrice.patchValue({
      entry_price: this.fbObj.entryBase != null ? this.fbObj.entryBase.price : 0,
      item_price: this.fbObj.drinkFoodBase != null ? this.fbObj.drinkFoodBase.price : 0,
    });
    this.itemName = this.fbObj.drinkFoodBase != null ? this.fbObj.drinkFoodBase.name : 'Beer Price';
    this.entryName = this.fbObj.entryBase != null ? this.fbObj.entryBase.name : 'Entry Price';
  }

  // Get the list of cities
  getCityArray() {
    this.user.getCities().subscribe((data: any) => {
      // data from api
      this.cities = data.data[0].cities;
      // this.queryCur = data.data[0].cur_code;
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

  async submit() {
    this.progressBar = true;
    this.formData.patchValue({
      category: this.catName
    });
    console.log(this.formData);
    this.submitted = true;

    if (this.formData.valid) {
      this.submitted = false;

      // send http request
      this.hangoutService.editHangout(this.formData, this.hangInfo.id).subscribe(async (response: any) => {
        const data = {
          name: this.formData.controls.name.value,
          street_address: this.formData.controls.street_address.value,
          town: this.formData.controls.town.value,
          currency_code: this.formData.controls.currency_code.value,
          city_id: this.formData.controls.city_id.value,
          city_name: this.formData.controls.city_name.value,
          category: this.formData.controls.category.value,
        };
        if (this.formData.controls.name.dirty) {
          const info = {
            name: this.formData.controls.name.value,
          };
          this.firestoreService
            .editHangout(info, this.hangInfo.did)
            .then(
              (res) => {
                this.progressBar = false;
                this.edit = false;
                // this.hangInfo.name = this.formData.controls.name.value;
                // this.hangInfo.street_address = this.formData.controls.street_address.value;
                // this.hangInfo.town = this.formData.controls.town.value;
                // this.hangInfo.currency_code = this.formData.controls.currency_code.value;
                // this.hangInfo.city_id = this.formData.controls.city_id.value;
                // this.hangInfo.city.name = this.formData.controls.city_name.value;
                // this.hangInfo.category = this.formData.controls.category.value;

              },
              error => {
                console.error(error);
                this.progressBar = false;
                this.edit = false;
              }
            );
          await this._snackBar.open('Your Hangout has been updated successfully.', 'OK', {
            duration: 3000
          });
        } else {
          await this._snackBar.open('Your Hangout has been updated successfully.', 'OK', {
            duration: 3000
          });
          this.progressBar = false;
          this.edit = false;
        }
      }, (e) => {
        console.log(e);
        this.progressBar = false;
        this._snackBar.open('Error: ' + e.error.message, 'OK', {
          duration: 3000
        });
      });
    }
  }

  async submitMessage() {
    this.progBarMess = true;
    this.submitted = true;

    if (this.messageBoard.valid) {
      if (this.messageBoard.value !== '') {
        this.submitted = false;
        const data = {
          message_board: this.messageBoard.value,
        };
        // send http request
        await this.hangoutService.editHangoutMessage(data, this.hangInfo.id).subscribe(async (response: any) => {
          await this._snackBar.open('Your Message Board has been updated successfully.', '', {
            duration: 3000
          });
          this.progBarMess = false;
          this.editMessage = false;
        }, (e) => {
          console.log(e);
          this.progBarMess = false;
          this.editMessage = false;
          this._snackBar.open('Error: ' + e.error.message, '', {
            duration: 3000
          });
        });
      } else {
        this._snackBar.open('Can\'t send empty message', '', {
          duration: 3000
        });
        this.progBarMess = false;
        this.editMessage = false;
      }
    }
  }

  async submitBase() {
    this.progressBar = true;
    this.submitted = true;

    if (this.basePrice.valid) {
      this.submitted = false;

      if (
        this.basePrice.controls.item_price.dirty ||
        this.basePrice.controls.entry_price.dirty
      ) {
        const info = {
          drinkFoodBase: {name: this.itemName, price: this.basePrice.controls.item_price.value},
          entryBase: {name: this.entryName, price: this.basePrice.controls.entry_price.value},
        };

        // update firebase
        this.firestoreService
          .editHangout(info, this.fbObj.did)
          .then(
            (res) => {

              if (this.itemName === 'Beer Price' || this.entryName === 'Entry Price') {
                const data = {
                  beer_price: this.itemName === 'Beer Price' ? this.basePrice.controls.item_price.value : null,
                  entry_price: this.entryName === 'Entry Price' ? this.basePrice.controls.entry_price.value : null,
                };

                // send http request
                this.hangoutService.editHangoutMessage(data, this.fbObj.hid).subscribe(async (response: any) => {
                  this.progressBar = false;
                  this.editBasePrice = false
                  this._snackBar.open('Your Hangout has been updated successfully.', '', {
                    duration: 3000
                  });
                }, (e) => {
                  console.log(e);
                  this.progressBar = false;
                  this.editBasePrice = false;
                  this._snackBar.open('Error: ' + e.error.message, '', {
                    duration: 3000
                  });
                });
              } else {
                this.progressBar = false;
                this.editBasePrice = false
                this._snackBar.open('Your Hangout has been updated successfully.', '', {
                  duration: 3000
                });
              }

            },
            error => {
              console.error(error);
              this.progressBar = false;
              this.editBasePrice = false
              this._snackBar.open('Something is wrong', '', {
                duration: 3000
              });
            }
          );
      } else {
        this.progressBar = false;
        this.editBasePrice = false
      }
    }
  }

  updateImg(data: any) {
    this.imgCrop = !data.close;
    if (this.type == 'cover') {
      data.data != null ? this.coverImage = data.data : null;
    } else {
      data.data != null ? this.thumbImage = data.data : null;
    }
  }

  /****** Service Creation ********/
  addService(service: string) {
    if (this.servicesList.findIndex((element) => element === service) === -1) {
      this.firestoreService.addService(service, this.fbObj.did).then(r => {
        // this.servicesList.push(service);
      });
    } else {
      this._snackBar.open('Service already added', '', {
        duration: 3000
      });
    }
  }

  removeService(service: string) {
    this.firestoreService.removeService(service, this.fbObj.did).then(r => {
      // this.servicesList.splice(this.servicesList.findIndex((element) => element === service), 1);
    });
  }

  goTo(service: string) {
    this.router.navigateByUrl('/nav/' + this.hangIndex + '/' + service + '/' + this.hangIndex).then(r => null)
  }
}
