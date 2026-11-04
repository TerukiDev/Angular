import { Routes } from '@angular/router';
import { CardList } from './cards/card-list/card-list';
import { CardDetail } from './cards/card-detail/card-detail';
import { CardForm } from './cards/card-form/card-form';
import { OpenPack } from './pack/open-pack/open-pack';

export const routes: Routes = [
  { path: '', component: OpenPack },
  { path: 'collection', component: CardList },
  { path: 'cards/new', component: CardForm },
  { path: "cards/:id", component:  CardDetail },
  { path: 'cards/:id/edit', component: CardForm },
  {  path: '**', redirectTo: '' }
];
