import {Component, Inject, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HangoutService} from '../../api/hangout.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent implements OnInit {
  hangoutId: any;
  fileData: File | undefined;
  previewUrl: any = null;
  // fileUploadProgress: string = null;
  // uploadedFilePath: string = null;
  private new = false;
  // public description = null;
  description = new FormControl('', [Validators.maxLength(500)]);
  progressBar: boolean = false;
  constructor(
    private http: HttpClient,
    private hangoutData: HangoutService,
    public dialogRef: MatDialogRef<ImagePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.hangoutId = data.hangoutId;
  }

  ngOnInit() {
    // console.log('formData: ' + new Date());
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
    this.preview();
  }

  preview() {
    // Show preview
    // @ts-ignore
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    // @ts-ignore
    reader.readAsDataURL(this.fileData);
    reader.onload = (event) => {
      this.previewUrl = reader.result;
    };
  }

  onSubmit() {
    console.log('description: ',Date.now().toString());
    if (this.fileData != null){
      this.progressBar = true;
      const formData = new FormData();
      formData.append('imgFile', this.fileData);
      formData.append('hangoutId', this.hangoutId);
      formData.append('date', Date.now().toString());
      if (this.description.value !== '') {
        formData.append('description', this.description.value);
      }
      this.hangoutData.uploadPhoto(formData)
        .subscribe(async (events: any) => {
          this.progressBar = false;
          this.new = true;
          this.dialogRef.close({
            new: this.new,
            data: events.data[0]
          });

        }, error => {
          console.log(error);
          this.progressBar = false;
        });
    }
  }

  close() {
    this.dialogRef.close({
      new: this.new,
    });
  }
}
