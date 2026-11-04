import { Routes } from '@angular/router';
import { CardList } from './cards/card-list/card-list';
import { CardDetail } from './cards/card-detail/card-detail';

export const routes: Routes = [
  { path: 'collection', component: CardList },
  { path: '', redirectTo: 'collection', pathMatch: 'full' },
  { path: "cards/:id", component:  CardDetail },
  {  path: '**', redirectTo: 'collection' }
];
