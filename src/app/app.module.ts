import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { PaginationComponent } from './pagination/pagination.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskFormComponent,
    TaskEditComponent,
    DeleteConfirmComponent,
    PaginationComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: TaskListComponent },
      { path: 'add', component: TaskFormComponent },
      { path: 'edit/:id', component: TaskEditComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }