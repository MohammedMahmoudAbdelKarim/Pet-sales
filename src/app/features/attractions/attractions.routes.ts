import { Routes } from '@angular/router';
import { AttractionListComponent } from './attraction-list/attraction-list.component';

export const ATTRACTIONS_ROUTES: Routes = [
  {
    path: '',
    component: AttractionListComponent,
  },
];
