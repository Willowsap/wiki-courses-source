import { Component } from '@angular/core';
import { ABOUT_DATA } from './about.data';

@Component({
  // no selector
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  public aboutData = ABOUT_DATA;
}
