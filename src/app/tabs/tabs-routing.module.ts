import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'outcome',
        loadChildren: () => import('../pages/outcome/outcome.module').then(m => m.OutcomePageModule)
      },
      {
        path: 'income',
        loadChildren: () => import('../pages/income/income.module').then(m => m.IncomePageModule)
      },
      {
        path: 'allowance',
        loadChildren: () => import('../pages/allowance/allowance.module').then(m => m.AllowancePageModule)
      },{
        path: 'routes',
        loadChildren: () => import('../pages/route/route.module').then(m => m.RoutePageModule)
      },
      {
        path: '',
        redirectTo: '/outcome',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/outcome',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
