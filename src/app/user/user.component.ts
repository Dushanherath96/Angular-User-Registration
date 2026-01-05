import { Component } from '@angular/core';
import {
  trigger,
  query,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ChildrenOutletContexts } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [],
  animations: [
    trigger('routerFadeIn', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('500ms ease-in', style({ opacity: 1 })),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class UserComponent {
  constructor(private context: ChildrenOutletContexts) {}

  getRouteUrl() {
    return this.context.getContext('primary')?.route?.snapshot?.url.join('/');
  }
}
