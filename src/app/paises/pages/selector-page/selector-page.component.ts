import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interfaces';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit{

  miFormulario: FormGroup = this.fb.group({
    region:   ['', Validators.required],
    pais  :   ['', Validators.required],
    frontera: ['', Validators.required]
  })
//Llenar selectores
  regiones: string [] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false

  constructor(private fb: FormBuilder, 
              private paisesServices: PaisesService){}


  ngOnInit(): void {

    this.regiones = this.paisesServices.regiones;
    //Cuando cambia de Región

    // this.miFormulario.get('region')?.valueChanges
    //     .subscribe(region => {
    //       console.log(region);
    //       this.paisesServices.getPaisesRegion(region)
    //           .subscribe(paises => {
    //             console.log(paises);
    //             this.paises = paises;
    //           })
    //     })
    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap(_ => {
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
          }),
          switchMap(region => this.paisesServices.getPaisesRegion(region))
        )
        .subscribe(paises => {
          this.paises = paises;
          this.cargando = false;
        });
    
    //Cuando se cambia de País
    this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap(() => {
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap(codigo => this.paisesServices.getPaisCode(codigo)),
          switchMap(pais => this.paisesServices.getPaisesBorders(pais?.borders!))
        )
        .subscribe(paises => {
          // this.fronteras = pais?.borders || [];
          this.fronteras = paises;
          this.cargando = false;
        })

  }

  seleccionar(){
    console.log(this.miFormulario.value);
  }

}
