import { Routes } from '@angular/router';
import { CardList } from './cards/card-list/card-list';
import { CardDetail } from './cards/card-detail/card-detail';
import { OpenPack } from './pack/open-pack/open-pack';

export const routes: Routes = [
  { path: '', component: OpenPack },
  { path: 'collection', component: CardList },
  { path: "cards/:id", component:  CardDetail },
  {  path: '**', redirectTo: '' }
];
