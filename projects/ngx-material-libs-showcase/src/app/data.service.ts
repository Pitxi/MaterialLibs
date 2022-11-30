import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from './person';
import { map, Observable } from 'rxjs';
import { DataFilter, DataFilterComparison } from '../../../pitxi/ngx-mat-data-filter/src/lib';

export interface PersonFilters {
  id?: DataFilter;
  firstName?: DataFilter;
  lastName?: DataFilter;
  email?: DataFilter;
  gender?: DataFilter;
  ipAddress?: DataFilter;
  jobTitle?: DataFilter;
  birthDate?: DataFilter;
}

export interface PaginatedResult<TRecord> {
  pageIndex: number;
  pageSize: number;
  rowCount: number;
  data: TRecord[];
}

@Injectable({ providedIn: 'root' })
export class DataService {

  constructor(private http: HttpClient) {
  }

  getData(filters: PersonFilters, pageIndex: number, pageSize: number): Observable<PaginatedResult<Person>> {
    return this.http.get<Person[]>('assets/data/persons.json')
               .pipe(
                 map(persons => persons.map(p => ({
                   ...p,
                   birthDate: new Date(p.birthDate)
                 }))),
                 map(persons => {
                   Object.entries(filters)
                         .forEach(([ key, filter ]) => {
                           persons = persons.filter(person => {
                             const value = person[key as keyof Person];

                             switch (filter?.comparison) {
                               case DataFilterComparison.IsInRange:
                                 return !filter.values[0] ||
                                   !filter.values[1] ||
                                   (value >= filter.values[0] &&
                                     value <= filter.values[1]);
                               case DataFilterComparison.LesserThan:
                                 return !filter.values[0] || value < filter.values[0];
                               case DataFilterComparison.GreaterThan:
                                 return !filter.values[0] || value > filter.values[0];
                               case DataFilterComparison.EqualTo:
                                 if (value instanceof Date && filter.values[0] instanceof Date) {
                                   return value.getFullYear() === filter.values[0].getFullYear() &&
                                     value.getDate() === filter.values[0].getDate() &&
                                     value.getMonth() === filter.values[0].getMonth();
                                 }

                                 return !filter.values[0] || value === filter.values[0];
                               case DataFilterComparison.NotEqualTo:
                                 return !filter.values[0] || value !== filter.values[0];
                               case DataFilterComparison.Contains:
                                 return !filter.values[0] || (value as string)?.includes(filter.values[0]);
                               case DataFilterComparison.NotContains:
                                 return !filter.values[0] || !(value as string)?.includes(filter.values[0]);
                               case DataFilterComparison.IsOneOf:
                                 return filter.values.includes(value);
                               case DataFilterComparison.IsNotOneOf:
                                 return !filter.values.includes(value);
                             }

                             return true;
                           });
                         });

                   return persons;
                 }),
                 map(persons => ({
                   pageIndex,
                   pageSize,
                   rowCount: persons.length,
                   data    : persons.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
                 }))
               );
  }
}
