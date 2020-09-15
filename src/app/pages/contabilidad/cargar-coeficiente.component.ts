import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../modules/auth/_services/auth.service';
import { BienesService } from '../bienes/bienes.service';
import { Router } from '@angular/router';
import { BienModel } from '../bienes/model/bien.model';
import { ContabilidadService } from './contabilidad.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-cargar-coeficiente',
  templateUrl: './cargar-coeficiente.component.html',
  styleUrls: ['./cargar-coeficiente.component.scss']
})
export class CargarCoeficienteComponent implements OnInit {
  cargarCoefForm: FormGroup;
  isLoading$: Observable<boolean>;
  usuariosDrop: any[] = [];
  guardo: boolean;

  categoriasDrop: any[] = [];
  subCategoriasDrop: any[] = [];
  tiposBienDrop: any[] = [];

  unidadesDrop: any[] = [];

  hoy: Date;
  tipoSelect: boolean= false;

  adicionalForm: FormGroup;
  unidadesD;
  msgFinal: string='';

  private unsubscribe: Subscription[] = [];

  constructor(private authService: AuthService, private fb: FormBuilder, private bienesService: BienesService, private contabilidadService: ContabilidadService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.cargarCoefForm.controls;
  }

  initForm() {
    this.guardo = false;

    this.bienesService.getAllCategorias().subscribe(categorias => {
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
    });

    let usu = this.authService.getUserFromLocalStorage();

    this.hoy = new Date();

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
      /*{
        validator: ConfirmPasswordValidator.MatchPassword,
      }*/
    );
  }

  getCategoriasHijas($event){
    //console.log($event.target.value);
    this.bienesService.getAllCategoriasHijas($event.target.value).subscribe(categorias => {
      let categoriasD = categorias.content;
      for (let i = 0; i < categoriasD.length; i++) {
          let cates = categoriasD[i].gdaCategoriaBienList;
          for(let c of cates){
            this.subCategoriasDrop.push({ label: c.descripcion, value: c.id });
          }
      }
    });
  }

  submit() {
    this.guardo = true;

    const result = {};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });
    const nuevoBien = new BienModel();

    //pipe(first()).
    const contabSubscr = this.contabilidadService.guardarCoefDepreciacion(this.cargarCoefForm.controls.coefDepreciacion.value).
    subscribe(response =>{
        if(response !== null){
          this.msgFinal = response.message;
          console.log(response.message);
          
        }else{
          this.msgFinal = "Se ha guardado correctamente el coeficiente";
        }  
        
      });
      this.unsubscribe.push(contabSubscr);
  }

}
