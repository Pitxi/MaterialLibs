import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from './person';
import { map, Observable } from 'rxjs';
import { DataFilter, FilterComparison } from '@pitxi/ngx-mat-data-filter';

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
                             const comparisonName = filter?.comparisonName as FilterComparison | undefined

                             switch (comparisonName) {
                               case 'is-in-range':
                                 return !filter.values[0] ||
                                   !filter.values[1] ||
                                   (value >= filter.values[0] &&
                                     value <= filter.values[1]);
                               case 'less-than':
                                 return !filter.values[0] || value < filter.values[0];
                               case 'greater-than':
                                 return !filter.values[0] || value > filter.values[0];
                               case 'equals':
                                 if (value instanceof Date && filter.values[0] instanceof Date) {
                                   return value.getFullYear() === filter.values[0].getFullYear() &&
                                     value.getDate() === filter.values[0].getDate() &&
                                     value.getMonth() === filter.values[0].getMonth();
                                 }

                                 return !filter.values[0] || value === filter.values[0];
                               case 'not-equal':
                                 return !filter.values[0] || value !== filter.values[0];
                               case 'contains':
                                 return !filter.values[0] || (value as string)?.includes(filter.values[0]);
                               case 'not-contains':
                                 return !filter.values[0] || !(value as string)?.includes(filter.values[0]);
                               case 'starts-with':
                                 return !filter.values[0] || (value as string)?.startsWith(filter.values[0]);
                               case 'ends-with':
                                 return !filter.values[0] || (value as string)?.endsWith(filter.values[0]);
                               case 'is-one-of':
                                 return filter.values.includes(value);
                               case 'is-not-one-of':
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
