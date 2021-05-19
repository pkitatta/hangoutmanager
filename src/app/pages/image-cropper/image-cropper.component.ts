import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {FirestoreService} from '../../api/firestore.service';
import {ImageService} from '../../api/image.service';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent implements OnInit {

  ref!: AngularFireStorageReference;
  task!: AngularFireUploadTask;
  // uploadProgress: Observable<number>;
  downloadURL!: Observable<any>;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  imageQuality = 75;
  onlyScaleDown = true;
  resizeToHeight = 1200;
  resizeToWidth = 1200;
  showCropper = false;
  containWithinAspectRatio = false;
  imageURL: string = '';
  @Input() type: any;
  @Input() hangoutId: any;
  @Input() did: any;
  @Input() menu: any;
  @Output() upload = new EventEmitter<any>();
  progressBar: boolean = false;
  constructor(
    private imgService: ImageService,
    private afStorage: AngularFireStorage,
    public firestoreService: FirestoreService,
  ) { }

  ngOnInit() {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }
  cropperReady() {
    // console.log('Cropper ready', sourceImageDimensions);
  }
  loadImageFailed() {
    console.log('Load failed');
  }
  async uploadImg() {
    if (this.croppedImage !== '') {
      this.progressBar = true;
      if (this.type === 'cover' || this.type === 'hangoutthumb') {
        const data = {
          hangoutId: this.hangoutId,
          photo: this.croppedImage,
          type: this.type
        };
        await this.imgService.uploadCoverPhoto(data, this.type).subscribe((res: any) => {
          if (res.data) {
            this.upload.emit({
              close: true,
              new: true,
              imgId: res.data.id,
              data: this.type === 'cover' ? res.data.file : res.data.thumb // this is data: data
            });
            this.progressBar = false;
          }
        }, error => {
          console.log(error);
          this.progressBar = false;
        });
      } else {
        // create a random id
        const randomId = Math.random().toString(36).substring(2);

        // create a reference to the storage bucket location
        this.ref = await this.afStorage.ref('/hangoutimages/hangoutfoodbar/' + randomId);

        // the put method creates an AngularFireUploadTask
        // and kicks off the upload
        this.task = this.ref.putString(this.croppedImage, 'data_url');

        // AngularFireUploadTask provides observable
        // to get uploadProgress value
        // this.uploadProgress = this.task.snapshotChanges()
        // .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

        // // observe upload progress
        // this.uploadProgress = this.task.percentageChanges();
        // // get notified when the download URL is available
        this.task.snapshotChanges().pipe(
          finalize(async () => {
            this.downloadURL = await this.ref.getDownloadURL();
            this.downloadURL.subscribe(url => {
              this.imageURL = url;
              this.firestoreService.editMeal({photoUrl: this.imageURL}, this.did, this.menu.mdid);
              this.upload.emit({
                close: true,
                new: true,
                data: this.imageURL // this is data: data
              });
              // this.modalController.dismiss({
              //   new: true,
              //   data: this.imageURL // this is data: data
              // });
              this.progressBar = false;
            });
            // await this.firestoreService.editMeal({photoUrl: this.downloadURL}, this.did, this.menu.mdid);
          })
        )
          .subscribe();
      }
    }
  }
  dismissModal() {
    console.log('in dismiss')
    this.upload.emit({
      close: true,
      new: false,
      data: null
    });
  }

}
