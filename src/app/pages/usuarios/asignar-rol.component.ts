import { Component, OnInit, Inject } from '@angular/core';
import { AuthService } from '../../modules/auth/_services/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../../modules/auth/_models/user.model';
import { UserRolDto } from '../../util/user-rol.dto';
@Component({
  selector: 'app-asignar-rol',
  templateUrl: './asignar-rol.component.html'
  //styleUrls: ['./usuarios.component.scss']
})
export class AsignarRolComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellidos', 'cedula', 'email', 'acciones'];
  dataSource;
  rolesDrop: any[] = [];
  formGroup: FormGroup;
  asigno: boolean;
  //toppings = new FormControl();
  //toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(private authService: AuthService, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.asigno = false;
    this.formGroup = new FormGroup({
      roles: new FormControl([], [
        Validators.required
      ]),
    });

    this.authService.getAllRols().subscribe(roles => {
      //console.log(roles);
      let rolesD = roles.content;
      for (let i = 0; i < rolesD.length; i++) {
          let r = rolesD[i];
          this.rolesDrop.push({ label: r.nombre, value: r.id });
      } 
    });
  }

  asignarRoles(){
    //console.log("Asignando a "+this.data.id);
    //console.log(this.formGroup.controls.roles.value);
    let user = new UserRolDto();
    user.id = this.data.id;
    //user.roles = this.formGroup.controls.roles.value;
    let roles = this.formGroup.controls.roles.value;
    for(let i=0; i < roles.length; i++){
        user.roles.push({id:roles[i]})
    }

    this.authService.asignRols(user);
    this.asigno = true;
  }
}
