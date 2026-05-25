import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { StatusComponent } from './status/status';
import { FeaturesComponent } from './features/features';
import { StyleComponent } from './style/style';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'status', component: StatusComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'style', component: StyleComponent },
  { path: '**', redirectTo: '' }
];

