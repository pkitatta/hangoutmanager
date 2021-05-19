import {Component, OnInit, ViewChild} from '@angular/core';
import {HangoutService} from '../../api/hangout.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  displayedColumns: string[] = ['title', 'issued', 'start', 'end', 'actions'];
  public did: any;
  public hangoutId: any;
  public hangInfo: any;
  public hangIndex: any;
  public compCollection: any[] = [];
  submitted = false;
  minDate = Date();
  plotStartTime: any;
  plotEndTime: any;
  formData: FormGroup | any;
  pipe = new DatePipe('en-US'); // Use your own locale

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort, {static: true}) sort: MatSort | any;

  dataSource: any;
  progressBar: boolean = false;
  addForm: boolean = false;
  editForm: boolean = false;
  public compList: any[] = [];
  todayDate:Date = new Date();
  timeInvalid: boolean = false;
  compData: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hangoutService: HangoutService,
    private formBuilder: FormBuilder,
  ) {
    // const today = Date.now();
    // const currentDate = this.pipe.transform(' Fri May 14 2021 00:00:00 GMT+0300 (East Africa Time)', 'yyyy-MM-dd');
    // console.log('time: ' + currentDate);
  }

  ngOnInit() {
    this.hangIndex = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.data.special) {
      this.hangInfo = this.route.snapshot.data.special;
      this.hangoutId = this.hangInfo.id;
      this.did = this.hangInfo.did;
    }
    this.getCompTickets();
  }

  getCompTickets() {
    this.progressBar = true;
    this.hangoutService.getHangoutComp(this.hangoutId).subscribe((res: any) => {
      this.progressBar = false;
      this.compCollection = res.data;
      this.dataSource = new MatTableDataSource(this.compCollection);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      this.progressBar = false;
    });
    //
  }

  async addComp() {
    //
  }

  compDetail(compData: any) {
    //
  }

  goBack() {
    this.router.navigate(['/dashboard/hangout-detail/' + this.hangIndex]);
  }

  compCancel(comp: any,) {
    this.hangoutService.cancelComp(comp.id).subscribe((res: any) => {
      console.log('Response: ' + res.message);
      if (res.message === 'Successful') {
        const found = this.compCollection.find(element => element === comp);
        found.deleted_at = 1;
      }
    });
  }

  compRestore(comp: any) {
    this.hangoutService.restoreComp(comp.id).subscribe((res: any) => {
      console.log('Response: ' + res.message);
      if (res.message === 'Successful') {
        const found = this.compCollection.find(element => element === comp);
        found.deleted_at = null;
      }
    });
  }


  /******* Ticket add *********/
  onTicketAdd() {
    this.addForm = true;
    this.editForm = false;
    this.formData = this.formBuilder.group({
      hangoutId: [''],
      issuedQty: [1, [Validators.required]],
      ticketId: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],

      dates: this.formBuilder.group({
        start_date_time: [''],
        end_date_time: [''],
        start_time: ['', [Validators.required]],
        end_time: ['', [Validators.required]],
      }, {validator: this.dateConfirming}),
    });

    if (this.compList.length === 0) {
      this.progressBar = true;
      this.hangoutService.getCompTemps().subscribe((res: any) => {
        this.progressBar = false;
        this.compList = res.data;
        console.log('comp list: ' + this.compList);
      }, error => {
        this.progressBar = false;
      });
    }
  }

  async submit() {
    this.progressBar = true;
    console.log(this.formData.controls.dates.controls.start_date_time.value + ' type: ' + typeof this.formData.controls.dates.controls.start_date_time.value);
    // console.log('Date: ' + this.formData.controls.start.value);
    const startDate = new Date(this.formData.controls.dates.controls.start_date_time.value);
    const startTime = this.formData.controls.dates.controls.start_time.value;
    const startDateTime = this.pipe.transform(startDate, 'yyyy-MM-dd') + 'T' + startTime;
    console.log('startDatetime: ' + startDateTime);
    const endDate = new Date(this.formData.controls.dates.controls.end_date_time.value);
    const endTime = this.formData.controls.dates.controls.end_time.value;
    const endDateTime = this.pipe.transform(endDate, 'yyyy-MM-dd') + 'T' + endTime;
    console.log('endDatetime: ' + endDateTime);
    this.formData.controls.dates.get('start_date_time').setValue(startDateTime);
    this.formData.controls.dates.get('end_date_time').setValue(endDateTime);

    console.log(this.formData.value);

    this.formData.get('hangoutId').setValue(this.hangoutId);

    this.hangoutService.createComp(this.formData).subscribe(async (res: any) => {
      console.log('res: ' + res.data);
      if (res.data !== 'invalid dates') {
        this.formData.reset();
        this.addForm = false;
        this.progressBar = false;
        this.getCompTickets();
      } else {
        this.progressBar = false;
      }
    }, error => {
      console.log('error: ' + error);
      this.progressBar = false;
    });
  }

  dateConfirming(c: AbstractControl | any): { invalid: boolean } {
    // console.log('date  ' + (c.get('start_date_time').value));
    console.log('time  ' + (c.get('start_time').value));
    console.log('endtime  ' + (c.get('end_time').value));
    // console.log('datetime  ' + (p.transform(c.get('start_date_time').value,'yyyy-MM-dd'))+'T'+(c.get('start_time').value));
    // console.log('time check: S- ' + c.get('start_date_time').value + ', E- ' + c.get('end_date_time').value);
    if (c.get('start_date_time').value > c.get('end_date_time').value) {
      console.log('The time is invalid');
      return {invalid: true};
    } else if (c.get('start_date_time').value === c.get('end_date_time').value) {
      if (c.get('start_time').value > c.get('end_time').value) {
        return {invalid: true};
      } else {
        return {invalid: false};
      }
    } else {
      return {invalid: false};
    }
  }

  /********* Edit ********/
  async compEdit(compData: any,) {
    this.editForm = true;
    if (this.compList.length === 0) {
      this.progressBar = true;
      this.hangoutService.getCompTemps().subscribe((res: any) => {
        this.progressBar = false;
        this.compList = res.data;
        console.log('comp list: ' + this.compList);
      }, error => {
        this.progressBar = false;
      });
    }
    console.log('comp length ' +this.compList.length);
    this.formData = this.formBuilder.group({
      ticketId: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],

      dates: this.formBuilder.group({
        start_date_time: [''],
        end_date_time: [''],
        start_time: ['', [Validators.required]],
        end_time: ['', [Validators.required]],
      }, {validator: this.dateConfirming}),
    });

    this.compData = compData;
    this.formData.patchValue({
      ticketId: Number(this.compData.type),
      title: this.compData.title,
      dates: this.formBuilder.group({
        start_date_time: this.compData.start_date_time,
        end_date_time: this.compData.end_date_time,
        start_time: this.pipe.transform(this.compData.start_date_time, 'HH:mm'),
        end_time: this.pipe.transform(this.compData.end_date_time, 'HH:mm'),
      }, {validator: this.dateConfirming}),
    });
  }

  async submitEdit() {
    this.progressBar = true;
    const startDate = new Date(this.formData.controls.dates.controls.start_date_time.value);
    const startTime = this.formData.controls.dates.controls.start_time.value;
    const startDateTime = this.pipe.transform(startDate, 'yyyy-MM-dd') + 'T' + startTime;
    console.log('startDatetime: ' + startDateTime);
    const endDate = new Date(this.formData.controls.dates.controls.end_date_time.value);
    const endTime = this.formData.controls.dates.controls.end_time.value;
    const endDateTime = this.pipe.transform(endDate, 'yyyy-MM-dd') + 'T' + endTime;
    console.log('endDatetime: ' + endDateTime);
    this.formData.controls.dates.get('start_date_time').setValue(startDateTime);
    this.formData.controls.dates.get('end_date_time').setValue(endDateTime);

    console.log(this.formData.value);

    this.hangoutService.editComp(this.formData, this.compData.id).subscribe(async (res: any) => {
      console.log('res: ' + res.data);
      if (res.data !== 'invalid dates') {
        this.formData.reset();
        this.editForm = false;
        this.progressBar = false;
        this.getCompTickets();
      } else {
        this.progressBar = false;
      }
    }, error => {
      console.log('error: ' + error);
      this.progressBar = false;
    });
  }
}
