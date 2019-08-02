import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule, MatExpansionPanelContent, MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatToolbarModule,
  MatToolbar,
  MatButtonModule,
  MatButton,
  MatSidenavModule,
  MatSidenav,
  MatSidenavContent,
  MatSidenavContainer,
  MatFormFieldModule,
  MatFormField,
  MatInputModule,
  MatInput,
  MatNavList,
  MatListModule,
  MatCardModule,
  MatCard,
  MatCardTitle,
  MatCardHeader,
  MatCardSubtitle,
  MatCardContent,
  MatCardActions,
  MatGridList,
  MatGridTile,
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelTitle,
  MatExpansionPanelHeader,
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatSelect,
  MatAutocompleteSelectedEvent,
  MatOption,
  MatOptgroup,
  MatSlideToggle,
  MatHint,
  MatCheckbox,
  MatError,
} from '@angular/material';

import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { MatIconModule } from '@angular/material/icon';

import { ColorElementDirective } from './directives/color-element.directive';
import { BoldElementDirective } from './directives/bold-element.directive';

@NgModule({
  declarations: [
    BoldElementDirective,
    ColorElementDirective,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    AngularFontAwesomeModule,
    MatGridListModule,
    MatExpansionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatCheckboxModule,
  ],
  exports: [
    MatToolbar,
    MatTooltipModule,
    MatButton,
    MatSidenav,
    MatSidenavContent,
    MatSidenavContainer,
    MatFormField,
    MatInput,
    MatNavList,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardSubtitle,
    MatCardContent,
    CommonModule,
    AngularFontAwesomeModule,
    MatIconModule,
    MatCardActions,
    MatGridList,
    MatGridTile,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelContent,
    MatExpansionPanelDescription,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatSelect,
    MatOption,
    MatOptgroup,
    MatSlideToggle,
    MatHint,
    MatCheckbox,
    MatError,
    BoldElementDirective,
    ColorElementDirective,
  ]
})
export class SharedModule { }

