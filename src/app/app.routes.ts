import { Routes } from '@angular/router';
import { CardList } from './cards/card-list/card-list';

export const routes: Routes = [
  { path: 'collection', component: CardList },
  { path: '', redirectTo: 'collection', pathMatch: 'full' },
];
