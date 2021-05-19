import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImageService} from '../../api/image.service';
import {CancelOkDialogComponent} from '../../components/cancel-ok-dialog/cancel-ok-dialog.component';
import {FormControl, Validators} from '@angular/forms';
import {HangoutService} from '../../api/hangout.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss']
})
export class ImageModalComponent implements OnInit {

  img: any;
  type: any;
  hangoutId: any;
  adminLevel: any;
  imgId: any;
  showNavBar = true;
  public image;
  admin;
  new = false;
  imageList: any = [];
  imageIndex: number = 0;
  description: any;
  edit: boolean = false;
  desc = new FormControl('', [Validators.maxLength(500)]);
  public progressBar: boolean = false;

  constructor(
    public imageService: ImageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ImageModalComponent>,
    public hangoutService: HangoutService,
    public _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (this.data.img) {
      // this.image = this.data.img;
      this.admin = this.data.adminLevel === 1 || this.data.adminLevel === 2 || this.data.adminLevel === 3;
      this.type = data.type;
      this.hangoutId = data.hangoutId;
      this.imgId = this.data.imgId;
      this.imageIndex = this.data.imgIndex;
      this.imageList = this.data.imageList;
      this.image = this.imageList[this.imageIndex].photo.file;
      this.description = this.imageList[this.imageIndex].photo.description;
    }
  }

  ngOnInit(): void {
  }

  async takePicture() {
    // const image = await Plugins.Camera.getPhoto({
    //   quality: 100,
    //   allowEditing: false,
    //   resultType: CameraResultType.DataUrl,
    //   source: CameraSource.Photos
    // });
    //
    // this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image && (image.dataUrl));

    // const imageModal = await this.modalCtrl.create({
    //   component: ImageCropperPage,
    //   componentProps: {
    //     hangoutId: this.hangoutId,
    //     type: this.type
    //   }
    // });
    // await imageModal.present();
    // const {data} = await imageModal.onDidDismiss();
    // console.log(data);
    // if (data.new === true) {
    //   this.image = data.data;
    //   this.imgId = data.imgId;
    //   this.new = true;
    // }
  }
  onClickNext() {
    if (this.imageIndex < (this.imageList.length-1)) {
      this.imageIndex++;
      this.image = this.imageList[(this.imageIndex)].photo.file;
      this.description = this.imageList[this.imageIndex].photo.description;
    }
  }

  onClickPrev() {
    if (this.imageIndex > 0) {
      this.imageIndex--;
      this.image = this.imageList[(this.imageIndex)].photo.file;
      this.description = this.imageList[this.imageIndex].photo.description;
    }
  }

  onClickEditMessage() {
    this.edit = true;
    this.desc.setValue(this.description ? this.description : '');
  }

  async submitMessage() {
    this.progressBar = true;

    if (this.desc.value !== '') {
      const data = {
        description: this.desc.value,
      };
      // send http request
      await this.hangoutService.updatePhotoDesc(data, 'photo', this.imageList[this.imageIndex].photo.id).subscribe(async (response: any) => {
        console.log('res: ',response.data);
        this.description = response.data[0].description;
        await this._snackBar.open('Description updated successfully.', '', {
          duration: 3000
        });
        this.progressBar = false;
        this.edit = false;
      }, (e) => {
        console.log(e);
        this.progressBar = false;
        this.edit = false;
        this._snackBar.open('Error: ' + e.error.message, '', {
          duration: 3000
        });
      });
    } else {
      this._snackBar.open('Can\'t send empty message', '', {
        duration: 3000
      });
      this.progressBar = false;
      this.edit = false;
    }
  }

  async deletePhoto(event: any) {
    // Ask if the user wants to delete for real.
    const dialogRef = this.dialog.open(CancelOkDialogComponent);

    dialogRef.afterClosed().subscribe(async result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.deleteForReal();
      }
    });
  }

  deleteForReal() {
    this.progressBar = true;
    // @ts-ignore
    this.imageService.deleteCover({hangoutId: this.hangoutId, imageId: this.imgId}, this.type).subscribe((res: any) => {
      this.progressBar = false;
      console.log(res.message);
      this.dialogRef.close({
        new: true
      });
    });
  }

  // uploadCurrentPhoto(image, thumb): void {
  //   this.callUpload(image, thumb).then(() => {
  //     this.navCtrl.pop();
  //   });
  // }

  dismissModal() {
    this.dialogRef.close();
  }

  toggleNavBar() {
    this.showNavBar = !this.showNavBar;
  }

}
