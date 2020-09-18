import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { AuthService } from '../../modules/auth/_services/auth.service';
import { BienesService } from '../bienes/bienes.service';
import { Router } from '@angular/router';
import { BienModel } from '../bienes/model/bien.model';
import { ContabilidadService } from './contabilidad.service';
import { first } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-cargar-coeficiente',
  templateUrl: './cargar-coeficiente.component.html',
  styleUrls: ['./cargar-coeficiente.component.scss']
})
export class CargarCoeficienteComponent implements OnInit, OnDestroy {
  cargarCoefForm: FormGroup;
  //isLoading$: Observable<boolean>;
  usuariosDrop: any[] = [];
  guardo: boolean;

  categoriasDrop: any[] = [];
  subCategoriasDrop: any[] = [];
  tiposBienDrop: any[] = [];

  unidadesDrop: any[] = [];
  tipoSelect: boolean= false;

  adicionalForm: FormGroup;
  unidadesD;
  msgFinal: string='';
  error=false;

  //isLoading$: Observable<boolean>;
  private unsubscribe: Subscription[] = [];

  constructor(private authService: AuthService, private fb: FormBuilder, private bienesService: BienesService, 
              private contabilidadService: ContabilidadService, private router: Router, private _snackBar: MatSnackBar) {
      //this.isLoading$ = this.contabilidadService.isLoading$; 
    }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.cargarCoefForm.controls;
  }

  initForm() {
    this.guardo = false;

    /*this.bienesService.getAllCategorias().subscribe(categorias => {
      let categoriasD = categorias.content;
      for (let i = 0; i < categoriasD.length; i++) {
          let c = categoriasD[i];
          this.categoriasDrop.push({ label: c.descripcion, value: c.id });
      }
    });
    this.bienesService.getAllTiposBien().subscribe(tipos => {
      let tiposD = tipos.content;
      for (let i = 0; i < tiposD.length; i++) {
          let t = tiposD[i];
          this.tiposBienDrop.push({ label: t.descripcion, value: t.id });
      }
    });*/

    this.cargarCoefForm = this.fb.group(
      {
        /*categoria: [
          '',
          [Validators.required],
        ],
        subcategoria: [
          '',
        ],*/
        coefDepreciacion: [
          null,
          Validators.compose([
            Validators.required,
          ]),
        ]
      },
    );
  }

  /*getCategoriasHijas($event){
    this.bienesService.getAllCategoriasHijas($event.target.value).subscribe(categorias => {
      let categoriasD = categorias.content;
      for (let i = 0; i < categoriasD.length; i++) {
          let cates = categoriasD[i].gdaCategoriaBienList;
          for(let c of cates){
            this.subCategoriasDrop.push({ label: c.descripcion, value: c.id });
          }
      }
    });
  }*/
cargar() {
    this.guardo = true;
    //pipe(first()).
    this.contabilidadService.guardarCoefDepreciacion(this.cargarCoefForm.controls.coefDepreciacion.value).subscribe((response:any) =>{
        /*if(response !== null){
          this.error = true;
          this.msgFinal = response.message;
        }*/
        if(response == null){
          this.error = false;
          this.msgFinal = "Se ha guardado correctamente el coeficiente.";
          this._snackBar.open(this.msgFinal,null, {
            duration: 3500,
          });
        }  
        
      },error=>{
        //console.log(error.error.apierror.message);
        this.msgFinal=error.error.apierror.message;
        this.error=true;
        this._snackBar.open(this.msgFinal,null, {
          duration: 3500,
        });
        //this.unsubscribe.push(contabSub);
        //return of(error);
      }); 
}

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
