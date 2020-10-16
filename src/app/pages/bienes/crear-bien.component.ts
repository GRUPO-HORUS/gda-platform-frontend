import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../modules/auth/_services/auth.service';
import { BienesService } from './bienes.service';
import { Router } from '@angular/router';
import { BienModel } from './model/bien.model';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { CatHija } from './model/cat-hija.model';
import { RegistroBienDTO } from '../../util/registro-bien.dto';

import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-crear-bien',
  templateUrl: './crear-bien.component.html',
  styleUrls: ['./crear-bien.component.scss']
})
export class CrearBienComponent implements OnInit {
  isLoading$: Observable<boolean>;
  usuariosDrop: any[] = [];
  errorMsg: string;
  guardo: boolean = false;
  hasError: boolean = false;

  categoriasDrop: any[] = [];
  
  tiposBienDrop: any[] = [];

  unidadesDrop: any[] = [];

  hoy: Date;
  tipoSelect: boolean= false;

  basicoForm: FormGroup;
  asignacionForm: FormGroup;
  contableForm: FormGroup;
  adicionalForm: FormGroup;
  mantenimientoForm: FormGroup;

  unidadesD;

  estadosDrop = [{label:'Muy Bueno',value:'MUY_BUENO'}, {label:'Bueno',value:'BUENO'}, {label:'Regular',value:'REGULAR'}, {label:'Malo',value:'MALO'}];
  existenciaDrop = [{label:'No Registrado',value:'NO_REGISTRADO'}, {label:'Faltante',value:'FALTANTE'}, {label:'Conforme',value:'CONFORME'}];

  catHijas: any[] = [];
  subCategoriasDrop: any[] = [];

  usuarioResponsableDrop: any[] = [];
  usuarioAsignadoDrop:any[] = [];
  usuarioAprobadorDrop: any[] = [];
  usuarioControlDrop: any[] = [];
  usuarioRegistroDrop: any[] = [];

  ultimaCategoria: any;
  atributosList: any[] = [];
  url: string = '';
  selectedFile;
  fechaMax;

  constructor(private authService: AuthService, private fb: FormBuilder, private bienesService: BienesService, 
    private ubicacionService: UbicacionService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.basicoForm.controls;
  }

  getCategoriasHijas($event, band){
    if(band == 'base'){
      this.catHijas = [];
    }

    this.subCategoriasDrop = [];
    this.bienesService.getAllCategoriasHijas($event.target.value).subscribe(categorias => {
      if(categorias.content.length > 0){
        let catHija = new CatHija();
        catHija.nombre = 'subcategoria'+this.catHijas.length;
        let categoriasD = categorias.content;
        for (let i = 0; i < categoriasD.length; i++) {
          this.subCategoriasDrop.push({ label: categoriasD[i].descripcion, value: categoriasD[i].id });
        }

        catHija.subcategorias = this.subCategoriasDrop;
        //this.catHijas.push('subcategoria'+this.catHijas.length);
        this.catHijas.push(catHija);

        for(let hija of this.catHijas){
          //console.log(hija);
          this.basicoForm.addControl(hija.nombre,this.fb.control(''));
        }
      }else{
        this.ultimaCategoria = $event.target.value;
        this.bienesService.getAtributosCategoria(this.ultimaCategoria).subscribe(atributos => { 
          this.atributosList = atributos.atributoFormularioBien;
          for(let atributo of this.atributosList){
            if(atributo.requerido){
              this.adicionalForm.addControl(atributo.nombre,this.fb.control('',  [Validators.required]));
            }else{
              this.adicionalForm.addControl(atributo.nombre,this.fb.control(''));
            }
          }
        });
      }
    });
  }

  /*getCategoriasHijasOrig($event, band){
    if(band == 'base'){
      this.catHijas = [];
    }
    this.subCategoriasDrop = [];
    this.bienesService.getAllCategoriasHijas($event.target.value).subscribe(categorias => {
      if(categorias.content.length > 0){
        let catHija = new CatHija();
        catHija.nombre = 'subcategoria'+this.catHijas.length;

        let categoriasD = categorias.content;
        for (let i = 0; i < categoriasD.length; i++) {
            //let cates = categoriasD[i].gdaCategoriaBienList;
            let cates = [];
            if(categoriasD[i].gdaCategoriaBienList.length > 0 ){
              cates = categoriasD[i].gdaCategoriaBienList;
            }else{
              cates = categoriasD[i].gdaBienList;
              //console.log(cates);
            }
            
            for(let c of cates){
              //this.subCategoriasDrop.push({ label: c.descripcion, value: c.id });
              if(c.gdaCategoriaBienId !== undefined){
                this.subCategoriasDrop.push({ label: c.gdaCategoriaBienId.descripcion, value: c.gdaCategoriaBienId.id });
              } 
            }
        }
        catHija.subcategorias = this.subCategoriasDrop;
        //this.catHijas.push('subcategoria'+this.catHijas.length);
        this.catHijas.push(catHija);

        for(let hija of this.catHijas){
          //console.log(hija);
          this.basicoForm.addControl(hija.nombre,this.fb.control(''));
        }
      }else{
        this.ultimaCategoria = $event.target.value;

        this.bienesService.getAtributosCategoria(this.ultimaCategoria).subscribe(atributos => { 
          this.atributosList = atributos.atributoFormularioBien;
          for(let atributo of this.atributosList){
            if(atributo.requerido){
              this.adicionalForm.addControl(atributo.nombre,this.fb.control('',  [Validators.required]));
            }else{
              this.adicionalForm.addControl(atributo.nombre,this.fb.control(''));
            }
          }
      });
      }
    });
  }*/

  initForm() {
    this.guardo = false;
    this.fechaMax = new Date().toLocaleDateString('fr-CA');

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
    //this.unidadesDrop.push({ label: 'PRESIDENCIA', value: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00' });
    this.ubicacionService.getAllUnidadesEntidad(usu.entidad).subscribe(unidades => {
      //console.log(unidades);
      this.unidadesD = unidades;

      for (let uni of unidades) {
          this.unidadesDrop.push({ label: uni.nombre, value: uni.id });

        for(let uniHija of uni.unidades_hijas){
          this.unidadesDrop.push({ label: uniHija.nombre, value: uniHija.id });
        } 
      }     
    });

    /*this.authService.getAllUsers().subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_RESPONSABLE').length > 0) {
            this.usuarioResponsableDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_ASIGNADO').length > 0) {
            this.usuarioAsignadoDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_APROBADOR').length > 0) {
            this.usuarioAprobadorDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_CONTROL').length > 0) {
            this.usuarioControlDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toUpperCase() === 'BIEN_REGISTRO').length > 0) {
            this.usuarioRegistroDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
      }     
    });*/

    this.hoy = new Date();

    this.basicoForm = this.fb.group(
      {
        categoria: [
          '',
          [Validators.required],
        ],
        /*subcategoria0: [
          ''
        ],*/
        tipo: [
          '',
          [Validators.required],
        ],
        detalle: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(255),
          ]),
        ],
        valorIncorporacion: [
          null,
          Validators.compose([
            Validators.required,
          ]),
        ],
        fechaIncorporacion: [
          new Date().toLocaleDateString('fr-CA'),
          Validators.compose([
            Validators.required,
          ]),
        ],
        estadoConservacion: [
          this.estadosDrop[0].value,
          Validators.compose([
            Validators.required,
          ]),
        ],
        existenciaInventario: [
          this.existenciaDrop[2].value,
          Validators.compose([
            Validators.required,
          ]),
        ],
        /*unidad: [
          '',
          Validators.compose([
            Validators.required
          ]),
        ],
        usuarioResponsable: [
          null
        ],*/
      },
      /*{
        validator: ConfirmPasswordValidator.MatchPassword,
      }*/
    );
    this.asignacionForm = this.fb.group(
    {
      unidad: [
        '',
        /*Validators.compose([
          Validators.required
        ]),*/
      ],
      usuarioResponsable: [
        null
      ],
      usuarioAsignado: [
        null
      ],
      usuarioAprobador: [
        null
      ],
      usuarioControl: [
        null
      ],
      usuarioRegistro: [
        null
      ], 
    });

    this.contableForm = this.fb.group(
      {
        valorRevaluo: [
          null,
          Validators.compose([
            Validators.required,
          ]),
        ],
        valorDepreciacion: [
          null,
          Validators.compose([
            Validators.required,
          ]),
        ],
        coeficienteDepreciacion: [
          null,
          Validators.compose([
            Validators.required,
          ]),
        ],
        valorNeto: [
          null,
          Validators.compose([
            Validators.required,
          ]),
        ],
      });

    this.adicionalForm = this.fb.group(
    {
        //Se cargan los atributos dinámicos
    });

    this.mantenimientoForm = this.fb.group(
    {
          fechaMantenimiento: [
            new Date().toLocaleDateString('fr-CA')
          ],
          periodicidadMantenimiento: [
            null
          ], 
    });
  }

  getUsuariosUnidad($event){
    this.usuariosDrop = [];
    this.usuarioResponsableDrop = [];
    this.usuarioAsignadoDrop = [];
    this.usuarioAprobadorDrop = [];
    this.usuarioControlDrop = [];
    this.usuarioRegistroDrop = [];

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_RESPONSABLE').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioResponsableDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_ASIGNADO').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioAsignadoDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_APROBADOR').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioAprobadorDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_CONTROL').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioControlDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });

    this.ubicacionService.getUsuariosUnidad($event.target.value, 'BIEN_REGISTRO').subscribe(usuarios => {
      let usuariosD = usuarios.content;
      for(let usu of usuariosD){
        this.usuarioRegistroDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
      }
    });
    /*for(let uni of this.unidadesD){
      if(uni.id == $event.target.value){
        for(let usu of uni.gdaUsuarioList){
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_RESPONSABLE').length > 0) {
            this.usuarioResponsableDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_ASIGNADO').length > 0) {
            this.usuarioAsignadoDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_APROBADOR').length > 0) {
            this.usuarioAprobadorDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_CONTROL').length > 0) {
            this.usuarioControlDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
          if (usu.roles.filter(r => r.nombre.toLowerCase() === 'BIEN_REGISTRO').length > 0) {
            this.usuarioRegistroDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
          }
        }
      }
    }*/
  }

  selectTipo(ev) {
    console.log(ev.target.value);
  }

  public addFile(event: any) {
    if (event.target.files && event.target.files[0]) {
        this.selectedFile = event.target.files[0];
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
                
            }
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  public addPreview() {
    this.url = this.url;   
  }

  deleteFile(){
    this.url ='';
    this.selectedFile = null;
  }

  submit() {
    this.guardo = true;

    const result = {};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });

    const nuevoBien = new RegistroBienDTO();
    nuevoBien.tipoBienId = this.basicoForm.controls.tipo.value;
    nuevoBien.detalle = this.basicoForm.controls.detalle.value;
    nuevoBien.valorIncorporacion = this.basicoForm.controls.valorIncorporacion.value;
    //nuevoBien.fechaIncorporacion = this.basicoForm.controls.fechaIncorporacion.value;
    nuevoBien.estadoConservacion = this.basicoForm.controls.estadoConservacion.value;
    nuevoBien.existenciaInventario = this.basicoForm.controls.existenciaInventario.value;
    nuevoBien.categoriaBienId= this.ultimaCategoria;
    
    if(this.asignacionForm.controls.unidad !== null){
      nuevoBien.unidadUbicacionId= this.asignacionForm.controls.unidad.value;
    }

    if(this.asignacionForm.controls.usuarioResponsable !== null){
      nuevoBien.usuarioResponsableId = this.asignacionForm.controls.usuarioResponsable.value;
    }
    if(this.asignacionForm.controls.usuarioAsignado !== null){
      nuevoBien.usuarioAsignadoId = this.asignacionForm.controls.usuarioAsignado.value;
    }
    if(this.asignacionForm.controls.usuarioAprobador !== null){
      nuevoBien.usuarioAprobadorId = this.asignacionForm.controls.usuarioAprobador.value;
    }
    if(this.asignacionForm.controls.usuarioControl !== null){
      nuevoBien.usuarioControlId = this.asignacionForm.controls.usuarioControl.value;
    }
    if(this.asignacionForm.controls.usuarioRegistro !== null){
      nuevoBien.usuarioRegistroId = this.asignacionForm.controls.usuarioRegistro.value;
    }

    for(let atributo of this.atributosList){
      nuevoBien.atributosDinamicos.push({idAtributoCategoriaBien: atributo.id, valor:this.adicionalForm.get(atributo.nombre).value});
    }

    /*let bienForm = new FormData();
    bienForm.append('bien', JSON.stringify(nuevoBien));
    bienForm.append('imagen', this.selectedFile);
    console.log(bienForm.get('bien'));
    console.log(bienForm.get('imagen'));*/

    this.bienesService.crearBien(nuevoBien).subscribe((response:any) =>{
      this._snackBar.open("Se ha guardado correctamente el bien.",null, {
        duration: 2500,
      });

      /*setTimeout (() => {
      this.router.navigate(['/bienes'], { state: {bien: nuevoBien, editar:false} });
      }, 3000);*/
    },error=>{
      //console.log(error.error.apierror.message);
      this.hasError=true;
      if(error.error.apierror.formatted){
        this.errorMsg=error.error.apierror.message;
      }else{
        this.errorMsg="Ha ocurrido un error.";
      }
      this._snackBar.open(this.errorMsg,null, {
        duration: 3500,
      });
      //this.unsubscribe.push(contabSub);
    });
  }


}
