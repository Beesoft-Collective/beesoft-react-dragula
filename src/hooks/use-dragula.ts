import { isEqual } from 'lodash';
import { useEffect, useRef } from 'react';
import { DragulaInstance } from '../common/dragula-instance';
import { DragulaAvailableOptions } from '../common/dragula-types';

const useDragula = (containers?: Array<Element>, options?: DragulaAvailableOptions) => {
  const dragulaInstance = useRef(DragulaInstance.getInstance(containers, options));
  const previousOptions = useRef<DragulaAvailableOptions | undefined>(options);

  useEffect(() => {
    if (options && !isEqual(previousOptions.current, options)) {
      dragulaInstance.current.addOptions(options);
      previousOptions.current = options;
    }
  }, [options?.moves]);

  return dragulaInstance.current.drake;
};

export default useDragula;
