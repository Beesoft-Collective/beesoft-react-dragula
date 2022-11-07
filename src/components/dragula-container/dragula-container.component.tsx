import React, { ReactNode } from 'react';
import { v4 } from 'uuid';

export interface DragulaContainerProps<T> {
  containerName: string;
  copyItems?: boolean;
  sortDirection?: 'vertical' | 'horizontal';
  items: Array<T>;
  onItemsChanged?: (items: Array<T>) => void;
  children: (item: T) => ReactNode;
}

export default function DragulaContainer<T>({
  containerName,
  copyItems = false,
  sortDirection = 'vertical',
  items,
  onItemsChanged,
  children,
}: DragulaContainerProps<T>) {
  return (
    <div data-drag-container={containerName} data-copy={copyItems} data-direction={sortDirection}>
      {items.map((item) => {
        const key = v4();
        return (
          <div key={key} id={key}>
            {children(item)}
          </div>
        );
      })}
    </div>
  );
}
