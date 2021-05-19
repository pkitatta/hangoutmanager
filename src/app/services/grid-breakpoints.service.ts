import { Injectable } from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class GridBreakpointsService {
  cols : number | any;
  breakpoint: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) { }

  gridBreakPontFx(xl: number, lg: number, md: number, sm: number, xs: number) {
    console.log('in the break fx');
    const gridByBreakpoint = {
      xl: xl,
      lg: lg,
      md: md,
      sm: sm,
      xs: xs
    };
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          return this.cols = gridByBreakpoint.xs;
        }
        if (result.breakpoints[Breakpoints.Small]) {
          return this.cols = gridByBreakpoint.sm;
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          return this.cols = gridByBreakpoint.md;
        }
        if (result.breakpoints[Breakpoints.Large]) {
          return this.cols = gridByBreakpoint.lg;
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          return this.cols = gridByBreakpoint.xl;
        }
      }
      return null;
    });
  }
}
