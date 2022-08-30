import { useEffect, useState } from 'react';
import { filterArrayByQuery } from 'app/utils/filterArrayByQuery';

interface SearchHandler {
  (text?: string): void;
}

type UseArrayQueryReturn<T extends Array<any>> = [T, SearchHandler, string | undefined];

interface UseArrayQueryOptions {
  /**
   *
   * if false, when the query is empty the array will be also empty and not with default data
   *
   * @default true
   */
  restoreOnEmptyQuery?: boolean;
}

export function useArrayQuery<T extends Array<any>>(
  data: T,
  keys: string | string[],
  options?: UseArrayQueryOptions,
): UseArrayQueryReturn<T> {
  const [filteredData, setFilteredData] = useState<T>(data);
  const [currentValue, setCurrentValue] = useState<string>();

  // default options values
  if (!options) {
    options = { restoreOnEmptyQuery: true };
  }

  const searchHandler: SearchHandler = text => {
    setCurrentValue(text);

    if (text) {
      const newRows = filterArrayByQuery<any>({
        array: data,
        keys,
        query: text,
      });

      setFilteredData(newRows as any);
    } else if (options?.restoreOnEmptyQuery) {
      setFilteredData(data);
    } else {
      setFilteredData([] as any);
    }
  };

  useEffect(() => {
    searchHandler(currentValue);
  }, [data]);

  return [filteredData, searchHandler, currentValue];
}
