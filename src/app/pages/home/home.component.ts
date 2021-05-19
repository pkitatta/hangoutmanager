import { Component, OnInit } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {HangoutService} from '../../api/hangout.service';
import {HangoutDataService} from '../../services/hangout-data.service';
import {StorageMap} from '@ngx-pwa/local-storage';
import {AuthService} from '../../api/auth.service';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  img: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hangouts: any = [];
  cols : number | any;

  gridByBreakpoint = {
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 1
  };
  breakpoint: any;
  token: any;
  isCreate: boolean = false;
  progressBar: boolean = false;
  dataLength: number = 0;
  useravatar: string = '';
  username: string = '';
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private hangoutService: HangoutService,
    private service: HangoutDataService,
    private storage: StorageMap,
    private authService: AuthService,
  ) {
    console.log('Home page');
    this.getHangouts();
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
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
  }
  async getHangouts() {
    this.progressBar = true;
    const token = await this.storage.get('token');
    token.subscribe((value: any) => {
      console.log('home comp token_type: ' + value.token_type);
      this.hangoutService.load(value).subscribe((res: any) => {
        this.dataLength = res.data.length;
        this.progressBar = false;
        this.hangouts = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < res.data.length; i++) {
          this.hangouts.push(res.data[i]);
        }
        this.service.setHangouts(this.hangouts);
        this.username = value.username;
        this.useravatar = value.fbPp;
        console.log('useravatar: ' + this.useravatar);
      }, (error: { status: string | number; }) => {
        console.log('This error: ' + error.status);
        if (error.status === 401) {
          this.storage.delete('token').subscribe(() => this.router.navigateByUrl('/landing'));
        }
      });
    });
  }

  async goTo() {
    await this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout().subscribe(
      (data: any) => {
        // this.alertService.presentToast(data.message);
      },
      error => {
        console.log(error);
      },
      () => {
        this.authService.isLoggedIn = false;
        this.router.navigateByUrl('/landing');
      }
    );
  }

  updateData(data: any) {
    this.isCreate = !data.close;
    this.getHangouts();
  }
}
