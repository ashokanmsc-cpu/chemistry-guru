import { Routes } from '@angular/router';
import { Home } from './components/home';
import { CrystalField } from './components/crystal-field';
import { LabPlaceholder } from './components/lab-placeholder';
import { LAB_ITEMS } from './data/virtual-lab';

const suffix = ' | Chemistry Guru';
const placeholders: Routes = LAB_ITEMS.filter(i => !i.ready).map(i => ({
  path: i.path, component: LabPlaceholder, title: i.title + suffix, data: { title: i.title },
}));

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'virtual-lab/crystal-field-splitting', component: CrystalField, title: 'Crystal Field Splitting Simulator' + suffix },
  { path: 'virtual-lab/vsepr-theory', loadComponent: () => import('./components/vsepr').then(m => m.Vsepr), title: 'VSEPR Theory Simulator' + suffix },
  ...placeholders,
  { path: 'crystal-field', redirectTo: 'virtual-lab/crystal-field-splitting' },
  { path: '**', redirectTo: '' },
];
