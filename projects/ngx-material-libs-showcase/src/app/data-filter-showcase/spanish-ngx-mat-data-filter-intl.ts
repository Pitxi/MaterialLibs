import { FilterComparison, NgxMatDataFilterIntl } from '@pitxi/ngx-mat-data-filter';

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
  override comparisons: { [key in FilterComparison]: string } = {
    'is-one-of'    : 'Es uno de',
    'is-not-one-of': 'No es uno de',
    'equal-to'     : 'Es igual a',
    'not-equal-to' : 'Es diferente de',
    'greater-than' : 'Es mayor que',
    'lesser-than'  : 'Es menor que',
    'contains'     : 'Contiene',
    'not-contains' : 'No contiene',
    'starts-with'  : 'Empieza por',
    'ends-with'    : 'Termina en',
    'is-in-range'  : 'Está en el rango'
  };
}
