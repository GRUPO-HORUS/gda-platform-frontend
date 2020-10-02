import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../modules/auth/_services/auth.service';
import { BienesService } from './bienes.service';
import { Router } from '@angular/router';
import { BienModel } from './model/bien.model';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { CatHija } from './model/cat-hija.model';

@Component({
  selector: 'app-crear-bien',
  templateUrl: './crear-bien.component.html',
  styleUrls: ['./crear-bien.component.scss']
})
export class CrearBienComponent implements OnInit {
  crearBienForm: FormGroup;
  isLoading$: Observable<boolean>;
  usuariosDrop: any[] = [];
  errorMsg: string;
  guardo: boolean;

  categoriasDrop: any[] = [];
  
  tiposBienDrop: any[] = [];

  unidadesDrop: any[] = [];

  hoy: Date;
  tipoSelect: boolean= false;

  asignacionForm: FormGroup;
  contableForm: FormGroup;

  adicionalForm: FormGroup;
  unidadesD;

  estadosDrop = [{label:'Muy Bueno',value:'Muy Bueno'}, {label:'Bueno',value:'Bueno'}, {label:'Regular',value:'Regular'}, {label:'Malo',value:'Malo'}];
  existenciaDrop = [{label:'No Registrado',value:'No Registrado'}, {label:'Faltante',value:'Faltante'}, {label:'Conforme',value:'Conforme'}];

  catHijas: any[] = [];
  subCategoriasDrop: any[] = [];

  usuarioResponsableDrop: any[] = [];
  usuarioAsignadoDrop:any[] = [];
  usuarioAprobadorDrop: any[] = [];
  usuarioControlDrop: any[] = [];
  usuarioRegistroDrop: any[] = [];


  constructor(private authService: AuthService, private fb: FormBuilder, private bienesService: BienesService, private ubicacionService: UbicacionService, private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.crearBienForm.controls;
  }

  getCategoriasHijas($event){
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
              console.log(cates);
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
          this.crearBienForm.addControl(hija.nombre,this.fb.control(''));
        }
      }
     
    });
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

    this.authService.getAllUsers().subscribe(usuarios => {
      let usuariosD = usuarios.content;
      //console.log(usuariosD);

      /*for (let i = 0; i < usuariosD.length; i++) {
          let r = usuariosD[i];
          this.usuariosDrop.push({ label: r.nombre+' '+r.apellidos, value: r.id });*/
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
    });

    let usu = this.authService.getUserFromLocalStorage();
    this.unidadesDrop.push({ label: 'PRESIDENCIA', value: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00' });
    /*this.ubicacionService.getAllUnidadesEntidad(usu.entidad).subscribe(unidades => {
      //console.log(unidades);
      this.unidadesD = unidades;
      for (let uni of unidades) {
          this.unidadesDrop.push({ label: uni.nombre, value: uni.id });
      }     
    });*/

    this.hoy = new Date();

    this.crearBienForm = this.fb.group(
      {
        /*fullname: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],*/
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
            Validators.maxLength(250),
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
        fechaMantenimiento: [
          new Date().toLocaleDateString('fr-CA')
        ],
        periodoMantenimiento: [
          null
        ], 
      });
  }

  /*getUsuariosUnidad($event){
    this.usuariosDrop = [];
    for(let uni of this.unidadesD){
      if(uni.id == $event.target.value){
        
        for(let usu of uni.gdaUsuarioList){
          this.usuariosDrop.push({ label: usu.nombre+' '+usu.apellidos, value: usu.id });
        }
      }
    }
  }*/

  getUsuariosUnidad($event){
    this.usuariosDrop = [];

    this.usuarioResponsableDrop = [];
    this.usuarioAsignadoDrop = [];
    this.usuarioAprobadorDrop = [];
    this.usuarioControlDrop = [];
    this.usuarioRegistroDrop = [];
    for(let uni of this.unidadesD){
      if(uni.id == $event.target.value){
        
        for(let usu of uni.gdaUsuarioList){
          //console.log(usu);
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
    }
  }

  selectTipo() {
    //console.log('cancelando');
  }

  submit() {
    this.guardo = true;

    const result = {};
    Object.keys(this.f).forEach(key => {
      result[key] = this.f[key].value;
    });
    const nuevoBien = new BienModel();
    nuevoBien.rotulado = '0000-0001-004';
    nuevoBien.detalle = this.crearBienForm.controls.detalle.value;
    nuevoBien.fechaIncorporacion = this.crearBienForm.controls.fechaIncorporacion.value;
    nuevoBien.valorIncorporacion = this.crearBienForm.controls.valorIncorporacion.value;
    nuevoBien.gdaCategoriaBienId= {id: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00', descripcion: 'UNIDAD CENTRAL DE PROCESAMIENTO (CPU)', gdaCategoriaBienId:{}};
    nuevoBien.gdaUnidadUbicacionId= {id: '7fdfbc99-a168-4f31-b794-a7d7ac02bd00', nombre: 'PRESIDENCIA'};

    //console.log(this.asignacionForm.controls.usuarioResponsable.value);
    setTimeout (() => {
      this.router.navigate(['/bienes'], { state: {bien: nuevoBien, editar:false} });
    }, 3000);
  }

  


}
