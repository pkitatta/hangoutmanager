import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ProfileComponent } from './pages/profile/profile.component';
import { MessageBoardComponent } from './pages/message-board/message-board.component';
import { StaffComponent } from './pages/staff/staff.component';
import { ThemeComponent } from './pages/theme/theme.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavComponent } from './pages/nav/nav.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LandingComponent } from './pages/landing/landing.component';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire';
import {firebaseConfig} from './api/fire_cred';
import {MatInputModule} from '@angular/material/input';
import { HomeComponent } from './pages/home/home.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ImageCropperComponent } from './pages/image-cropper/image-cropper.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { NewlinePipe } from './pipes/newline.pipe';
import { HangoutAddComponent } from './pages/hangout-add/hangout-add.component';
import { BarServiceComponent } from './pages/bar-service/bar-service.component';
import { RestaurantServiceComponent } from './pages/restaurant-service/restaurant-service.component';
import { TakeawayServiceComponent } from './pages/takeaway-service/takeaway-service.component';
import { HotelServiceComponent } from './pages/hotel-service/hotel-service.component';
import {MatTabsModule} from '@angular/material/tabs';
import { GroupByCategoryPipe } from './pipes/group-by-category.pipe';
import { DrinkOptModalComponent } from './pages/drink-opt-modal/drink-opt-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SimpleDialogComponent } from './components/simple-dialog/simple-dialog.component';
import { CancelOkDialogComponent } from './components/cancel-ok-dialog/cancel-ok-dialog.component';
import { ShortEditsDialogComponent } from './components/short-edits-dialog/short-edits-dialog.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import { MenuOptModalComponent } from './pages/menu-opt-modal/menu-opt-modal.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { DrinkAddComponent } from './pages/drink-add/drink-add.component';
import { MenuAddComponent } from './pages/menu-add/menu-add.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';
import { DrinkDetailComponent } from './pages/drink-detail/drink-detail.component';
import { ThemeEditComponent } from './pages/theme-edit/theme-edit.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { StaffAddComponent } from './pages/staff-add/staff-add.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import { MediaComponent } from './pages/media/media.component';
import { MediaGroupPipe } from './pipes/media-group.pipe';
import { ImageModalComponent } from './pages/image-modal/image-modal.component';
import { ImagePreviewComponent } from './pages/image-preview/image-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    MessageBoardComponent,
    StaffComponent,
    ThemeComponent,
    TicketsComponent,
    NavComponent,
    LandingComponent,
    HomeComponent,
    ImageCropperComponent,
    NewlinePipe,
    NewlinePipe,
    HangoutAddComponent,
    BarServiceComponent,
    RestaurantServiceComponent,
    TakeawayServiceComponent,
    HotelServiceComponent,
    GroupByCategoryPipe,
    DrinkOptModalComponent,
    SimpleDialogComponent,
    CancelOkDialogComponent,
    ShortEditsDialogComponent,
    MenuOptModalComponent,
    OrderByPipe,
    DrinkAddComponent,
    MenuAddComponent,
    DrinkDetailComponent,
    ThemeEditComponent,
    StaffAddComponent,
    MediaComponent,
    MediaGroupPipe,
    ImageModalComponent,
    ImagePreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // AngularFireModule.initializeApp(environment.firebase),
    AngularFireModule.initializeApp(firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatInputModule,
    MatGridListModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    ImageCropperModule,
    AngularFirestoreModule,
    MatTabsModule,
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
