import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Paises, PaisSmall } from '../interfaces/paises.interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl : string = ' https://restcountries.com/v2'; 
  private _regiones: string[] = 
  ['Africa','Americas','Asia', 'Europe', 'Oceania'];

  get regiones(): string[]{
    return [...this._regiones];
  }

  constructor(private http: HttpClient) { }

  getPaisesRegion(region: string): Observable<PaisSmall[]>{
    const url: string = `${this._baseUrl}/region/${region}?field=alpha3Code;name`
    return this.http.get<PaisSmall[]>(url);
  }

  getPaisCode(codigo: string): Observable<Paises | null>{
    if(!codigo){
      return of(null)
    }
    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<Paises>(url);

  }

  getPaisCodeSmall(codigo: string): Observable<PaisSmall>{
    // if(!codigo){
    //   return of(null)
    // }
    const url = `${this._baseUrl}/alpha/${codigo}?field=name;alpha3Code`;
    return this.http.get<PaisSmall>(url);

  }

  getPaisesBorders(borders: string[]): Observable<PaisSmall[]>{
    if(!borders){
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisCodeSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }
}
