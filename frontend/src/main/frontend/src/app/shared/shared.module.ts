import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NebularUIModule } from './nebular-ui/nebular-ui.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { AppNamePipe } from './app-name.pipe';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [CustomInputComponent, AppNamePipe, LogoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NebularUIModule,
    FontAwesomeModule,
    NgxSkeletonLoaderModule,
    NgxJsonViewerModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NebularUIModule,
    FontAwesomeModule,
    NgxSkeletonLoaderModule,
    NgxJsonViewerModule,
    CustomInputComponent,
    AppNamePipe,
    LogoComponent
  ]
})
export class SharedModule { }
