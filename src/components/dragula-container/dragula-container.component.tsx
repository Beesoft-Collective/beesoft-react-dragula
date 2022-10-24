import React from 'react';

export interface DragulaContainerProps<T> {
  containerName: string;
  items: Array<T>;
}

export default function DragulaContainer<T>({ containerName, items }: DragulaContainerProps<T>) {
  return <div data-drag-container={containerName}>Test Item</div>;
}
