import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ThemeComponent} from './pages/theme/theme.component';
import {StaffComponent} from './pages/staff/staff.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {TicketsComponent} from './pages/tickets/tickets.component';
import {MessageBoardComponent} from './pages/message-board/message-board.component';
import {HomeComponent} from './pages/home/home.component';
import {LandingComponent} from './pages/landing/landing.component';
import {NavComponent} from './pages/nav/nav.component';
import {AuthGuard} from './guard/auth.guard';
import {HangoutResolverService} from './resolver/hangout-resolver.service';
import {BarServiceComponent} from './pages/bar-service/bar-service.component';
import {RestaurantServiceComponent} from './pages/restaurant-service/restaurant-service.component';
import {HotelServiceComponent} from './pages/hotel-service/hotel-service.component';
import {TakeawayServiceComponent} from './pages/takeaway-service/takeaway-service.component';
import {DrinkAddComponent} from './pages/drink-add/drink-add.component';
import {MediaComponent} from './pages/media/media.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'nav/:id',
    resolve: {
      special: HangoutResolverService
    },
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'theme/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: ThemeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'tickets/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: TicketsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'staff/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: StaffComponent,
        canActivate: [AuthGuard] ,
      },
      {
        path: 'message/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: MessageBoardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'bar/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: BarServiceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'restaurant/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: RestaurantServiceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'hotel/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: HotelServiceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'takeaway/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: TakeawayServiceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'adddrinks/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: DrinkAddComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'media/:id',
        resolve: {
          special: HangoutResolverService
        },
        component: MediaComponent,
        canActivate: [AuthGuard],
      },
    ]
  },
  { path: 'landing', component: LandingComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
