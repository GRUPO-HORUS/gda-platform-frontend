import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../modules/auth/_services/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog } from '@angular/material/dialog';
import { AsignarRolComponent } from './asignar-rol.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellidos', 'cedula', 'email', 'roles', 'acciones'];
  //dataSource = new MatTableDataSource<UserData>();
  dataSource;
  length: number;

  formGroup: FormGroup;

  constructor(private authService: AuthService, private dialog: MatDialog, private modalService: NgbModal) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  @ViewChild("modalMensaje") modal: ElementRef;

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      roles: new FormControl([], [
        Validators.required
      ]),
    });
    //let ELEMENT_DATA: any[];
    this.authService.getAllUsers().subscribe(usuarios => {
      this.dataSource = new MatTableDataSource<UserData>(usuarios.content);
      this.dataSource.paginator = this.paginator;
      this.length = usuarios.totalElements;

      //console.log(usuarios);
    });
  }

  asignarRoles(id){
    const dialogRef = this.dialog.open(AsignarRolComponent, { data: {
      id: id}, height: '350px', width: '450px'});

    //this.modalService.open(this.modal);

  }
}

export interface UserData {
  nombre: string;
  apellidos: string;
  cedula: string;
  email: string;
  roles;
}
