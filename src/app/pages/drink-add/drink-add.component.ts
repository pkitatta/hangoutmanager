import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {FirestoreService} from '../../api/firestore.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {DrinkDetailComponent} from '../drink-detail/drink-detail.component';

export interface BevItem {
  name: string;
  type: string;
  origin: string;
}

@Component({
  selector: 'app-drink-add',
  templateUrl: './drink-add.component.html',
  styleUrls: ['./drink-add.component.scss']
})
export class DrinkAddComponent implements OnInit {
  public drinkList: any = [];
  public hangIndex: any;
  public hangInfo: any;
  public did: string = '';
  private hangoutId: any;
  displayedColumns: string[] = ['name', 'type', 'country', 'actions'];
  queryText = '';
  originalData: any = [];
  searched: boolean = false;
  showSearchbar: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort, {static: true}) sort: MatSort | any;


  ELEMENT_DATA: BevItem[] = [];
  dataSource: any;
  progressBar: boolean = false;
  searchValue = new FormControl('name');

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
    this.getDrinkList();
  }

  ngOnInit(): void {

  }

  // ngAfterViewInit() {
  //   this.dataSource.sort = this.sort;
  // }

  getDrinkList() {
    this.progressBar = true;
    this.firestoreService.getAllDrinks().valueChanges({ idField: 'mdid' }).subscribe(data => {
      this.progressBar = false;
      this.drinkList = data;
      this.originalData = this.drinkList;
      this.dataSource = new MatTableDataSource(this.drinkList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  searchEvent(){
    if(this.queryText.length > 1) {
      this.drinkList = this.originalData.filter((e: any) => {
        return e[this.searchValue.value].toLowerCase().indexOf(this.queryText.toLowerCase()) !== -1;
      });
      this.dataSource = new MatTableDataSource(this.drinkList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.searched = true;
    } else{
      if(this.searched) {
        this.dataSource = new MatTableDataSource(this.originalData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.searched = false;
      }
    }
  }

  async drinkDetail(drink: any) {
    const dialogRef = this.dialog.open(DrinkDetailComponent, {
      height: '70%',
      width: '70%',
      data: {header: 'Add Drink', message: '', params: {drink, did: this.did,}}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
