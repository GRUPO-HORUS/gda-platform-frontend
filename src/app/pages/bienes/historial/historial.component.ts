import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BienesService } from '../bienes.service';
import { TipoBienModel } from '../model/tipo-bien.model';
import { CategoriaModel } from '../model/categoria.model';
import { UnidadModel } from '../model/unidad.model';
import { Router, NavigationEnd } from '@angular/router';
import { VerBienComponent } from '../ver-bien/ver-bien.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BienModel } from '../model/bien.model';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {
  displayedColumns: string[] = ['fechaEvento', 'bien', 'detalle'];
  buscarForm: FormGroup;
  dataSource;
  length: number=10;
  bandera: boolean= false;

  nuevoBien;
  nuevoBien2;

  msgFinal;
  nombreBien:string;

  constructor(private bienesService: BienesService, private router: Router, private dialog: MatDialog, private fb: FormBuilder, private _snackBar: MatSnackBar) {
    /*if(this.router.getCurrentNavigation().extras.state !== undefined){
        //console.log(this.router.getCurrentNavigation().extras.state.bien);
        this.nuevoBien = this.router.getCurrentNavigation().extras.state.bien;
        this.bandera = true;
        //this.nuevoBien2 = localStorage.getItem(this.nuevoBien.id);
        localStorage.setItem(this.nuevoBien.id, JSON.stringify(this.nuevoBien));
    }*/
    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        if(this.router.getCurrentNavigation().extras.state !== undefined){
          this.nuevoBien = this.router.getCurrentNavigation().extras.state.bien;
          this.bandera = true;
        }
      }
    });
    
  }

  /*constructor(private bienesService: BienesService, private router: Router) {
    if(this.router.getCurrentNavigation().extras.state !== undefined){
        this.nuevoBien = this.router.getCurrentNavigation().extras.state.bien;
        this.bandera = true;
        this.cantNuevos = localStorage.getItem('cantNuevos') || 1;
        localStorage.setItem('cantNuevos',cantNro+'');
        localStorage.setItem(cantNro+'', JSON.stringify(this.nuevoBien));
    }
  }*/

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit(): void {

    /*this.dataSource = new MatTableDataSource<BienData>(BIEN_DATA);
    this.dataSource.paginator = this.paginator;
    this.length = BIEN_DATA.length;
    this.dataSource.filterPredicate = (data: BienData, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        //return (currentTerm + (data as { [key: string]: any })[key] + '◬');
        return key === 'gdaBienId' ? currentTerm + data.gdaBienId.detalle : currentTerm + data[key];
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }*/

    this.buscarForm = this.fb.group(
      {
        rotulado: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ]
      });
    
  }

  filtrar(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /*verBien(bien){
    this.router.navigate(['/bienes/ver'],{ state: { bienP: bien } });
  }*/

  submit(){
    //console.log(this.buscarForm.controls.rotulado.value);
    this.msgFinal='';
    this.nombreBien = '';
    this.dataSource = null;
    this.bienesService.getTrazaBien(this.buscarForm.controls.rotulado.value).subscribe(bienes => {
      
      if(bienes.totalElements > 0){
        this.dataSource = new MatTableDataSource<BienData>(bienes.content);
        this.dataSource.paginator = this.paginator;
        this.length =bienes.totalElements;

        this.nombreBien = bienes.content[0].gdaBienId.detalle;
      }else{
        this.msgFinal='Este bien no cuenta con una traza.';
        this._snackBar.open(this.msgFinal,null, {
          duration: 3500,
        });
      }
      

      this.dataSource.filterPredicate = (data: BienData, filter: string): boolean => {
        const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
          //return (currentTerm + (data as { [key: string]: any })[key] + '◬');
          return key === 'gdaBienId' ? currentTerm + data.gdaBienId.detalle : currentTerm + data[key];
  
        }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
        const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
        return dataStr.indexOf(transformedFilter) != -1;
      }

    },error=>{
      //console.log(error.error.apierror.message);
      this.dataSource = null;
      this.msgFinal=error.error.apierror.message;
      this._snackBar.open(this.msgFinal,null, {
        duration: 3500,
      });
    });
  }

}

export interface BienData {
  id: number;
  detalle: string;
  fechaEvento: Date;
  gdaBienId: BienModel;

  /*setBien(bien: any) {
    this.id = '';
    this.detalle = '';
  }*/
}
const BIEN_DATA: BienData[] = [
  /*{id:1, fechaEvento: new Date('2020-09-11T00:00:00'), detalle: 'En esta fecha el bien fue asignado a Alejandro Lafourcade con autorización previa de Mauricio Solalinde. Luego de esto se procedió a la', gdaBienId: {id:1, rotulado: '18.01.001', detalle: 'Teclado', fechaIncorporacion: new Date(), valorIncorporacion: 500000, gdaCategoriaBienId: {id:'1',descripcion:'EQUIPOS DE COMPUTACION'}, gdaUnidadUbicacionId: {id:'1',nombre:'EQUIPOS DE COMPUTACION'}}},
  {id:2, fechaEvento: new Date(), detalle: 'En esta fecha el bien fue llevado al depósito.', gdaBienId: {id:1, rotulado: '18.01.001', detalle: 'Impresora', fechaIncorporacion: new Date(), valorIncorporacion: 500000, gdaCategoriaBienId: {id:'1',descripcion:'EQUIPOS DE COMPUTACION'}, gdaUnidadUbicacionId: {id:'1',nombre:'EQUIPOS DE COMPUTACION'}}},
  {id:3, fechaEvento: new Date(), detalle: 'En esta fecha el bien fue llevado a sucursal 1.', gdaBienId: {id:1, rotulado: '18.01.001', detalle: 'Teclado', fechaIncorporacion: new Date(), valorIncorporacion: 500000, gdaCategoriaBienId: {id:'1',descripcion:'EQUIPOS DE COMPUTACION'}, gdaUnidadUbicacionId: {id:'1',nombre:'EQUIPOS DE COMPUTACION'}}},
  {id:4, fechaEvento: new Date(), detalle: 'En esta fecha el bien fue devuelto a la casa matriz.', gdaBienId: {id:1, rotulado: '18.01.001', detalle: 'Teclado', fechaIncorporacion: new Date(), valorIncorporacion: 500000, gdaCategoriaBienId: {id:'1',descripcion:'EQUIPOS DE COMPUTACION'}, gdaUnidadUbicacionId: {id:'1',nombre:'EQUIPOS DE COMPUTACION'}}},
  {id:5, fechaEvento: new Date(), detalle: 'En esta fecha el bien fue llevado a otra sucursal', gdaBienId: {id:1, rotulado: '18.01.001', detalle: 'Teclado', fechaIncorporacion: new Date(), valorIncorporacion: 500000, gdaCategoriaBienId: {id:'1',descripcion:'EQUIPOS DE COMPUTACION'}, gdaUnidadUbicacionId: {id:'1',nombre:'EQUIPOS DE COMPUTACION'}}}*/
]
