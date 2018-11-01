import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UploadComponent } from './upload/upload.component';
import {FilesComponent} from './files/files.component';
import {ConfigComponent} from './config/config.component';

const routes: Routes = [
    { path: 'home',             component: HomeComponent },
    { path: 'upload',           component: UploadComponent },
    { path: 'files',            component: FilesComponent },
    { path: 'config',           component: ConfigComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
