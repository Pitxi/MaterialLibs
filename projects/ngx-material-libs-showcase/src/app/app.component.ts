import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

interface LinkItem {
  title: string;
  link: string;
}

@Component({
             selector       : 'app-root',
             templateUrl    : './app.component.html',
             styleUrls      : [ './app.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class AppComponent {
  readonly links: LinkItem[] = [
    {
      title: 'Data Filter',
      link : '/data-filter'
    }
  ];

  readonly currentUrl$     = this.router.events
                                 .pipe(
                                   filter(event => event instanceof NavigationEnd),
                                   map(event => (event as NavigationEnd).urlAfterRedirects)
                                 );
  readonly activeLinkItem$ = this.currentUrl$
                                 .pipe(
                                   map(url => this.links.find(item => item.link === url))
                                 );
  sidenavOpen              = true;

  constructor(private router: Router) {
  }

  toggleSidenav(): void {
    this.sidenavOpen = !this.sidenavOpen;
  }
}
