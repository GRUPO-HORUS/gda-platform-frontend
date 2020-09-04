import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { AsignarRolComponent } from './asignar-rol.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../modules/auth/_services/auth.guard';
//import { DashboardsModule } from 'src/app/_metronic/partials/content/dashboards/dashboards.module';

@NgModule({
  declarations: [UsuariosComponent, AsignarRolComponent],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsuariosComponent,
        canActivate: [AuthGuard],
      },
    ]),
    //DashboardsModule,
  ],
})
export class UsuariosModule {}
