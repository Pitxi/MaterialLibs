import { DataFilter } from './data-filter';

export class DataFilterHelper {
  static compare(filter1: DataFilter | null, filter2: DataFilter | null): boolean {
    if (filter1 == filter2) {
      return true;
    }

    if (filter1?.comparison === filter2?.comparison) {
      if (filter1?.values === filter2?.values) {
        return true;
      }

      return !!filter1 &&
        !!filter2 &&
        filter1.values.length === filter2.values.length &&
        filter1.values.every((v, index) => filter2.values[index] === v);
    }

    return false;
  }
}
