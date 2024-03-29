import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NbLayoutModule, NbSpinnerModule, NbCardModule, NbTreeGridModule, NbInputModule, NbToggleModule, NbIconModule, NbDialogModule, NbButtonModule, NbTagModule, NbSelectModule, NbRadioModule, NbFormFieldModule, NbTooltipModule, NbToastrModule, NbThemeModule, NbBadgeModule, NbActionsModule, NbAccordionModule, NbTabsetModule, NbCheckboxModule, NbPopoverModule, NbStepperModule, NbUserModule, NbProgressBarModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbIconModule,
    NbSpinnerModule,
    NbCardModule,
    NbInputModule,
    NbTreeGridModule, 
    NbToggleModule,
    NbDialogModule.forRoot(),
    NbTagModule,
    NbSelectModule,
    NbRadioModule,
    NbFormFieldModule,
    NbTooltipModule,
    NbToastrModule.forRoot(),
    NbBadgeModule,
    NbActionsModule,
    NbAccordionModule,
    NbTabsetModule,
    NbCheckboxModule,
    NbPopoverModule,
    NbStepperModule,
    NbUserModule,
    NbProgressBarModule,
  ],
  exports: [
    NbThemeModule,
    NbLayoutModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbIconModule,
    NbSpinnerModule,
    NbCardModule,
    NbInputModule,
    NbTreeGridModule, 
    NbToggleModule,
    NbDialogModule,
    NbTagModule,
    NbSelectModule,
    NbRadioModule,
    NbFormFieldModule,
    NbTooltipModule,
    NbToastrModule,
    NbBadgeModule,
    NbActionsModule,
    NbAccordionModule,
    NbTabsetModule,
    NbCheckboxModule,
    NbPopoverModule,
    NbStepperModule,
    NbUserModule,
    NbProgressBarModule,
  ]
})
export class NebularUIModule { }
