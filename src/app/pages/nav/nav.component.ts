import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {FirestoreService} from '../../api/firestore.service';
import {HangoutDataService} from '../../services/hangout-data.service';
import {AuthService} from '../../api/auth.service';
import {HangoutService} from '../../api/hangout.service';
import {StorageMap} from '@ngx-pwa/local-storage';
import {MatDialog} from '@angular/material/dialog';
import {MenuAddComponent} from '../menu-add/menu-add.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public hangInfo: any;
  private coverImageId: any;
  // public coverImage: string;
  // public thumbImage: string;
  public fbObj: any;
  // public theme;
  public services: any;
  public servicesList = [];
  private hangoutId: any;
  public hangIndex: any;
  public adminLevel: any;
  private thumbImageId: any;
  hangouts: any[] = [];
  hangName: string = '';
  progressBar: boolean = false;
  pageName: string = '';
  useravatar: string = '';
  username: string = '';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private service: HangoutDataService,
    public firestoreService: FirestoreService,
    public hangoutData: HangoutService,
    public user: AuthService,
    private storage: StorageMap,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    this.hangIndex = this.route.snapshot.paramMap.get('id');
    console.log('hangIndexType const: ', typeof this.hangIndex);
    this.pageName = 'profile';
    router.navigateByUrl('/nav/' + this.hangIndex + '/' +this.pageName+ '/' + this.hangIndex).then(r => null);
  }

  ngOnInit() {
    this.hangIndex = this.route.snapshot.paramMap.get('id');
    const token = this.storage.get('token');
    token.subscribe((value: any) => {
      this.username = value.username;
      this.useravatar = value.fbPp;
    });
    this.getData();
  }

  async getData() {
    if (this.route.snapshot.data.special) {
      this.hangInfo = this.route.snapshot.data.special;
      this.hangoutId = this.hangInfo.id;
      this.hangName = this.hangInfo.name;
      // this.coverImage = 'https://i.picsum.photos/id/195/500/500.jpg';
      // this.thumbImage = 'https://i.picsum.photos/id/195/200/200.jpg';
      this.adminLevel = this.hangInfo.pivot.level;
    }
    this.progressBar = true;
    this.firestoreService.getHangout(Number(this.hangoutId)).valueChanges().subscribe((res: any) => {
      this.progressBar = false;
      console.log('Results: ' + res[0].services);
      console.log('SevicesLength: ' + res[0].services.length);
      this.fbObj = res[0];
      this.services = this.fbObj.services.length > 0;
      this.servicesList = this.fbObj.services;
      this.service.setDid(this.fbObj.did, this.hangIndex);
    }, error => (error));

    this.hangouts = this.service.getHangouts();
  }

  changeHang(hangout: any, i: number) {
    this.progressBar = true;
    this.hangName = hangout.name;
    this.hangIndex = i.toString();
    console.log('hangIndexType changHang: ', typeof this.hangIndex);
    this.router.navigateByUrl('/nav/' + this.hangIndex).then(r => this.router.navigateByUrl('/nav/' + this.hangIndex + '/' +this.pageName+ '/' + this.hangIndex).then(r => null));
    this.hangInfo = hangout;
    this.hangoutId = this.hangInfo.id;
    this.adminLevel = this.hangInfo.pivot.level;
    this.firestoreService.getHangout(Number(this.hangoutId)).valueChanges().subscribe((res: any) => {
      this.progressBar = false;
      console.log('Results: ' + res[0].services);
      console.log('SevicesLength: ' + res[0].services.length);
      this.fbObj = res[0];
      this.services = this.fbObj.services.length > 0;
      this.servicesList = this.fbObj.services;
      this.service.setDid(this.fbObj.did, this.hangIndex);
    }, error => (error));
  }

  changePageName(pageName: string) {
    // console.log('in the change page fx');
    this.pageName = pageName;
  }

  async addMenu() {
    console.log('menuId: ');

    const dialogRef = this.dialog.open(MenuAddComponent, {
      height: '70%',
      width: '70%',
      data: {did: this.fbObj.did}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
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
}
