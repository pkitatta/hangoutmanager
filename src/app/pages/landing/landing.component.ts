import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../api/auth.service';
import {Router} from '@angular/router';
import {StorageMap} from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  submitted = false;
  formData: FormGroup | any;
  firstFormGroup: FormGroup | any;
  secondFormGroup: FormGroup | any;
  showForm: boolean = false;
  progressBar: boolean = false;
  errorMessage: boolean = false;
  token: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private _formBuilder: FormBuilder,
    private storage: StorageMap,
  ) {
    console.log('Landing page');
  }

  async ngOnInit() {
    await this.storage.get('token').subscribe((value) => {
      if (value) {
        this.token = value;
        this.authService.isLoggedIn = true;
        this.router.navigate(['/home']);
      }
    });

    this.firstFormGroup = this._formBuilder.group({
     email: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      password: ['', Validators.required]
    });
  }

  async submit() {

    if (this.firstFormGroup.valid || this.secondFormGroup.valid) {
      this.errorMessage = false;
      this.progressBar = true;

      // send http request
      this.authService.login(this.firstFormGroup.value.email, this.secondFormGroup.value.password).subscribe(
        (data: any) => {
          console.log('token received: ' + data.access_token);
                  },
        error => {
          console.log('This error: ' + error.status);
          if (error.status === 401) {
            this.errorMessage = true;
          } else if (error.status === 0) {
            //
          }
        },
        async () => {
          this.progressBar = false;
          await this.router.navigate(['/home']);
        }
      );
    }
  }

}
