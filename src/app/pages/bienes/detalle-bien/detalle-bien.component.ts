import { Component, OnInit, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BienesService } from '../bienes.service';
@Component({
  selector: 'app-detalle-bien',
  templateUrl: './detalle-bien.component.html'
  //styleUrls: ['./usuarios.component.scss']
})
export class DetalleBienComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellidos', 'cedula', 'email', 'acciones'];
  dataSource;
  rolesDrop: any[] = [];
  formGroup: FormGroup;
  asigno: boolean;
  detallesList;
  detalle: string;
  //toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(private bienesService: BienesService, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.asigno = false;
    this.detalle = this.data.detalle;
    this.bienesService.getDetallesBien(this.data.id).subscribe(detalles => { 
      this.detallesList = detalles.atributoValorBienDTOS;
    });

    
  }

  /*asignarRoles(){
    //console.log("Asignando a "+this.data.id);
    //console.log(this.formGroup.controls.roles.value);
    user.id = this.data.id;
    //user.roles = this.formGroup.controls.roles.value;
    let roles = this.formGroup.controls.roles.value;
    for(let i=0; i < roles.length; i++){
        user.roles.push({id:roles[i]})
    }
    this.authService.asignRols(user);
  }*/
}
