import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EditorModule } from '@tinymce/tinymce-angular';

import { NoSanitizePipe } from '../util/nosanitize.pipe';

import { AngularMaterialModule } from '../angular-material.module';
import { AppRoutingModule } from '../app-routing.module';
import { CourseEditComponent } from './editing/course-edit/course-edit.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDisplayComponent } from './course-display/course-display.component';
import { ConfirmationComponent } from './editing/confirmation/confirmation.component';
import { CourseEditorComponent } from './editing/course-editor/course-editor.component';
import { CreateComponent } from './editing/create/create.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TopicMenuComponent } from './topic-menu/topic-menu.component';
import { AdvancedComponent } from './editing/advanced/advanced.component';

@NgModule({
  declarations: [
    CourseEditComponent,
    CourseListComponent,
    CourseDisplayComponent,
    CourseEditorComponent,
    TopicMenuComponent,
    ConfirmationComponent,
    CreateComponent,
    AdvancedComponent,
    NoSanitizePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    AngularMaterialModule,
    AppRoutingModule,
    MatDialogModule,
  ],
  entryComponents: [CreateComponent],
})
export class CourseModule {}
