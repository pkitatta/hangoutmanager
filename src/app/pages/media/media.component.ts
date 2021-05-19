import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FirestoreService} from '../../api/firestore.service';
import {HangoutService} from '../../api/hangout.service';
import {DatePipe} from '@angular/common';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ImageModalComponent} from '../image-modal/image-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {ImagePreviewComponent} from '../image-preview/image-preview.component';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  public type: string | any;
  public hangIndex: any;
  public segment: string;
  hangPhotoList: any;
  public adminLevel: any;
  public hangoutId: any;
  public hangInfo: any;
  public userId: any;
  pipe = new DatePipe('en-US');
  public hangTempList: any;
  public userPhotoList: any;
  public videoList: any;

  cols : number | any;

  gridByBreakpoint = {
    xl: 8,
    lg: 8,
    md: 8,
    sm: 6,
    xs: 4
  };
  breakpoint: any;
  progressBar: boolean = false;

  // Use your own locale

  segmentChanged($event: any) {
    if ($event.index === 0) {
      this.getHangoutPhotos();
    } else if ($event.index === 1) {
      this.getUserPhotos();
    } else if ($event.index === 2) {
      this.getVideos();
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public firestoreService: FirestoreService,
    public hangoutData: HangoutService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {
    this.type = Number(this.route.snapshot.paramMap.get('type'));
    this.hangIndex = this.route.snapshot.paramMap.get('id');
    this.segment = this.type;
    this.getData();

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
    //
  }

  async getData() {
    if (this.route.snapshot.data.special) {
      this.hangInfo = this.route.snapshot.data.special;
      this.hangoutId = this.hangInfo.id;
      this.adminLevel = this.hangInfo.pivot.level;
      this.userId = this.hangInfo.pivot.user_id;
    }
    console.log('currentIndex: ', this.type);
    if (this.type === 0) {
      this.getHangoutPhotos();
    } else if (this.type === 1) {
      this.getUserPhotos();
    } else if (this.type === 2) {
      this.getVideos();
    }
  }

  async getHangoutPhotos() {
    this.progressBar = true;
    this.hangoutData.getAdminPhotos(this.hangoutId).subscribe((res: any) => {
      this.progressBar = false;
      this.hangTempList = res.data;
      this.hangPhotoList = this.hangTempList;
      // this.hangPhotoList.forEach((photo) => {
      //     console.log('data: ' + photo.id);
      // });
    });

    // const hangList: any = await this.hangoutData.getAdminPhotos(this.hangoutId);
    //
    // console.log('list: ' + hangList.data[0]);
  }

  async getUserPhotos() {
    this.progressBar = true;
    this.hangoutData.getAUserPhotos(this.hangoutId).subscribe((res: any) => {
      this.progressBar = false;
      this.hangTempList = res.data;
      this.userPhotoList = this.hangTempList;
    });
  }

  async getVideos() {
    this.progressBar = true;
    this.hangoutData.getVideos(this.hangoutId).subscribe((res: any) => {
      this.progressBar = false;
      this.hangTempList = res.data;
      this.videoList = this.hangTempList;
    });
  }

  goBack() {
    this.router.navigate(['/dashboard/hangout-detail/' + this.hangIndex]);
  }

  async addPhoto() {

    const dialogRef = this.dialog.open(ImagePreviewComponent, {
      height: '80%',
      width: '80%',
      data: {
        hangoutId: this.hangoutId,
        userId: this.userId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result && result.new === true) {
        if (this.type === 0)
         this.getHangoutPhotos();
        else  if (this.type === 1)
          this.getUserPhotos();
        else if (this.type === 2)
          this.getVideos();
      }
    });
  }

  async enlargeImage(img: any, type: string) {
    var imageList = type === 'admin' ? this.hangPhotoList : this.userPhotoList;

    var idx = imageList.indexOf(img);
    console.log('index: ', idx);
    const dialogRef = this.dialog.open(ImageModalComponent, {
      height: '80%',
      width: '80%',
      data: {
        img: img.photo.file,
        type,
        imgId: img.photo.id,
        hangoutId: this.hangoutId,
        adminLevel: this.adminLevel,
        imgIndex: idx,
        imageList: imageList
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result && result.new === true) {
        if (this.type === 0)
          this.getHangoutPhotos();
        else  if (this.type === 1)
          this.getUserPhotos();
        else if (this.type === 2)
          this.getVideos();
      }
    });
  }
  async enlargeVideo(vid: string, type: string) {
    // const imageModal =  await this.modalCtrl.create({
    //   component: VideoPlayerPage,
    //   componentProps: {
    //     vid,
    //     vidId: vid.id,
    //     type,
    //     hangoutId: this.hangoutId,
    //     adminLevel: this.adminLevel,
    //   },
    //   backdropDismiss: false,
    //   cssClass: 'media-modal',
    // });
    // await imageModal.present();
    // const { data } = await imageModal.onDidDismiss();
    // if (data.new === true) {
    //   if (type === 'admin' && data.img === null) {
    //     this.getVideos();
    //   }
    // }
  }
}
