import { Injectable } from '@angular/core';
import { FilterComparison, NgxMatDataFilterIntl } from '../../../../pitxi/ngx-mat-data-filter/src/lib';

@Injectable()
export class SpanishNgxMatDataFilterIntl extends NgxMatDataFilterIntl {
  override stringFilterPlaceholder                            = 'Filtro de texto';
  override numberFilterPlaceholder                            = 'Filtro numérico';
  override dateFilterPlaceholder                              = 'Filtro de fecha';
  override fromNumberPlaceholder                              = 'Desde número';
  override toNumberPlaceholder                                = 'Hasta número';
  override fromDatePlaceholder                                = 'Desde fecha';
  override toDatePlaceholder                                  = 'Hasta fecha';
  override selectAll                                          = 'Seleccionar todo';
  override selectNone                                         = 'Seleccionar nada';
  override toggleSelection                                    = 'Invertir selección';
  override all                                                = 'Todo';
  override none                                               = 'Nada';
  override toggle                                             = 'Invertir';
  override dateFilterErrorMessage                             = 'Formato de fecha no válido';
  override minValueErrorMessage                               = 'El valor es demasiado bajo';
  override maxValueErrorMessage                               = 'El valor es demasiado alto';
  override comparisons: { [key in FilterComparison]: string } = {
    'is-one-of'    : 'Es uno de',
    'is-not-one-of': 'No es uno de',
    'equals'       : 'Es igual a',
    'not-equal'    : 'Es diferente de',
    'greater-than' : 'Es mayor que',
    'less-than'    : 'Es menor que',
    'contains'     : 'Contiene',
    'not-contains' : 'No contiene',
    'starts-with'  : 'Empieza por',
    'ends-with'    : 'Termina en',
    'is-in-range'  : 'Está en el rango'
  };
}
