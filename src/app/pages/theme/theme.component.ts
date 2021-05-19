import { Component, OnInit } from '@angular/core';
import {FirestoreService} from '../../api/firestore.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {ShortEditsDialogComponent} from '../../components/short-edits-dialog/short-edits-dialog.component';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {

  public hangIndex: any;
  public hangInfo: any;
  public did: string = '';
  private hangoutId: any;
  displayedColumns: string[] = ['day', 'theme', 'start', 'end', 'entry', 'actions'];
  dataSource: any;
  progressBar: boolean = false;
  public themeList: any = [];

  constructor(
    public firestoreService: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.hangIndex = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.data.special) {
      this.hangInfo = this.route.snapshot.data.special;
      this.hangoutId = this.hangInfo.id;
      this.did = this.hangInfo.did;
    }
    this.getTheme();
  }

  ngOnInit(): void {
  }

  getTheme() {
    this.progressBar = true;
    this.firestoreService.getHangoutTheme(this.did).valueChanges().subscribe(data => {
      this.progressBar = false;
      this.themeList = data;
      this.dataSource = new MatTableDataSource(this.themeList);
    });
  }

  async themeEditPage(theme: any) {
    // console.log('Theme going: ' + theme.day);
    // const themeModal = await this.modalCtrl.create({
    //   component: ThemeEditPage,
    //   componentProps: {
    //     theme,
    //     did: this.did,
    //     themeStatus: this.themeStatus
    //   }
    // });
    // await themeModal.present();
    // const {data} = await themeModal.onDidDismiss();
    // console.log(data);
    // if (data.new === true) {
    //   this.coverImage = data.img;
    // }

    const dialogRef = this.dialog.open(ShortEditsDialogComponent, {
      height: '70%',
      width: '60%',
      data: {header: 'Theme Edit', message: '', params: {theme, did: this.did}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
