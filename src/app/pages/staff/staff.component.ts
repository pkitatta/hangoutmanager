import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HangoutDataService} from '../../services/hangout-data.service';
import {HangoutService} from '../../api/hangout.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CancelOkDialogComponent} from '../../components/cancel-ok-dialog/cancel-ok-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatStepper, MatVerticalStepper} from '@angular/material/stepper';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {

  public hangIndex: any;
  public hangInfo: any;
  public adminLevel: any;
  public hangoutId: any;
  public managers: any;
  progressBar: boolean = false;
  roleEdit: boolean = false;
  value: string = "0";
  currentManager: any;
  addStaff: boolean = false;

  email = new FormControl('', [Validators.email, Validators.required]);
  adminValue = new FormControl('4', [Validators.required]);
  role = 4;
  public showRoles = false;
  public user: any;
  private new = false;
  firstFormGroup: FormGroup | any;
  secondFormGroup: FormGroup | any;
  userExits: boolean = true;

  constructor(
    private route: ActivatedRoute,
    public hangoutData: HangoutService,
    private service: HangoutDataService,
    private router: Router,
    public _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder
  ) {
    this.hangIndex = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  ngOnInit(): void {
  }

  async getData() {
    if (this.route.snapshot.data.special) {
      this.hangInfo = this.route.snapshot.data.special;
      this.hangoutId = this.hangInfo.id;
      this.adminLevel = this.hangInfo.pivot.level;
      console.log('hangout info: ' + this.hangInfo.pivot.level);
    }
    this.getAdmins();
  }

  getAdmins() {
    this.progressBar = true;
    this.hangoutData.getAdmins(this.hangoutId).subscribe((res: any) => {
      this.managers = res.managers;
      this.progressBar = false
      // console.log('managerLength: ' + typeof this.managers[0].level);
      // this.managers.forEach((manager: any) => {
      //   console.log('manager: ' + manager.id);
      // });
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/hangout-detail/' + this.hangIndex]);
  }

  checkEmail(stepper: MatStepper) {
    this.progressBar = true;
    if (this.firstFormGroup.valid) {
      this.hangoutData.checkEmail({email: this.firstFormGroup.value.email}).subscribe((res: any) => {
        console.log('res: ' + res.data);
        if (res.data) {
          this.progressBar = false;
          this.user = res.data;
          stepper.next();
        } else {
          this._snackBar.open('User doesn\'s exit', 'OK', {
            duration: 6000
          });
          this.firstFormGroup.reset();
          this.progressBar = false;
        }
      });
    } else {
      this.progressBar = false;
    }
  }

  async send(stepper: MatVerticalStepper) {
    this.progressBar = true;
    const data = {
      hangoutId: this.hangoutId,
      level: this.secondFormGroup.value.roles,
      userId: this.user.id
    };
    console.log('data: ' + data);
    this.hangoutData.createAdmin(data).subscribe(async (res: any) => {
      this.progressBar = false;
      console.log('res: ' + res.data);
      if (res.message === 'Successful') {
        this._snackBar.open('Manager has been added', 'OK', {
          duration: 6000
        });
        this.firstFormGroup.reset();
        stepper.previous();
        this.user = null;
        this.getAdmins();
      } else {
        this._snackBar.open(res.message, '', {
          duration: 3000
        });
      }
    }, error => {
      this.progressBar = false;
    });
  }

  async addAdmin() {

    this.firstFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.secondFormGroup = this._formBuilder.group({
      roles: ['4', Validators.required]
    });

    this.roleEdit = false;
    this.addStaff = true;
  }

  showLevel(manager: any) {
    if (this.adminLevel >= manager.level) {
      this._snackBar.open('You are not authorised to edit owners', 'OK', {
        duration: 9000
      });
      return;
    }
    this.currentManager = manager;
    this.value = manager.level.toString();
    console.log('value: ' + this.value + ' type: ' + typeof +this.value);
    this.roleEdit = !this.roleEdit;
  }

  update() {
    // console.log('value: ' + +this.value);
    this.progressBar = true;
    this.hangoutData.editAdmin({level: +this.value}, this.currentManager.id).subscribe((res: any) => {
      console.log('response: ' + res.message);
      if (res.message === 'Successful') {
        this.getAdmins();
        this.progressBar = false;
        this._snackBar.open(this.currentManager.admin.name + '\'s role has been updated', '', {
          duration: 6000
        });
        this.roleEdit = false;
      }
    }, error => {
      this.progressBar = false;
      console.log(error);
    });
  }

  async removeAdmin(manager: any) {
    if (this.adminLevel >= manager.level) {
      this._snackBar.open('You are not authorised to edit level', 'OK', {
        duration: 9000
      });
      return;
    }
    const dialogRef = this.dialog.open(CancelOkDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.progressBar = true;
        this.hangoutData.deleteAdmin(manager.id).subscribe((res: any) => {
          if (res.message === 'Successful') {
            // this.managers.splice(this.managers.findIndex(element => element === manager), 1);
            this.getAdmins();
            this.progressBar = false;
          }
        }, error => {
          this.progressBar = false;
          console.log(error);
        });
      }
    });
  }
}
