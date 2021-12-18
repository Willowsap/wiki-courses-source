import { Component } from '@angular/core';

@Component({
  // no selector
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  public title = 'About This Project';
  public subtitle = 'A Thesis at Appalachian State University';
  public aboutSections = [
    'This is an e-learning tool created as a thesis ' +
      'for Appalachian State University’s Computer Science Department, in partial ' +
      'fulfillment of the requirements for the degree of Master of ' +
      'Science by Willow Emmeliine Sapphire.',

    'Wiki Courses was created as an e-learning tool to experiment with using a wiki ' +
      'model to create teaching materials. ',
  ];
  public closing =
    'For inquiries, please contact Willow Sapphire at sapphirewe@appstate.edu';
}
