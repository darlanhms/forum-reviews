import dot from 'dot-object';

const getPositionFromQuery = (obj: any, prop: string, query: string): number => {
  const propInObj = dot.pick(prop, obj);

  if (!propInObj) {
    return -1;
  }

  return propInObj.toString().toLowerCase().indexOf(query.toLowerCase());
};

interface ValidationKey {
  key: string;
  valid: boolean;
}

interface FilterArrayByQueryPayload<T> {
  array: Array<T>;
  keys: string | Array<string>;
  query: string;
}

export function filterArrayByQuery<T>({ array, keys, query }: FilterArrayByQueryPayload<T>): Array<T> {
  if (query && array) {
    query = query.trim();

    return array.filter(item => {
      if (Array.isArray(keys)) {
        const validatedKeys: ValidationKey[] = [];

        for (const key of keys) {
          const valid = getPositionFromQuery(item, key, query) !== -1;

          validatedKeys.push({ key, valid });
        }

        return Boolean(validatedKeys.find(key => key.valid));
      }

      return getPositionFromQuery(item, keys, query) !== -1;
    });
  }
  return [];
}
