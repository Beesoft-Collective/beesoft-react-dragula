import React, { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { DragulaService } from '../../services/dragula.service';

export type TypeWithKey<T> = T & { _key: string };

export interface DragulaContainerProps<T> {
  containerName: string;
  copyItems?: boolean;
  sortDirection?: 'vertical' | 'horizontal';
  items: Array<T>;
  onItemsChanged?: (items: Array<T>) => void;
  children: (item: T) => ReactNode;
}

function DragulaContainer<T>({
  containerName,
  copyItems = false,
  sortDirection = 'vertical',
  items,
  onItemsChanged,
  children,
}: DragulaContainerProps<T>) {
  const [stateItems, setStateItems] = useState<Array<TypeWithKey<T>>>();

  const currentItems = useRef<Array<TypeWithKey<T>>>();
  const service = useRef<DragulaService>();
  const containerElement = useRef<HTMLElement>();

  useEffect(() => {
    service.current = DragulaService.getServiceInstance();
    service.current?.onDrop((element, target, source) => {
      if (containerElement.current?.isSameNode(target)) {
        reorganizeItems(target.children);
      } else if (containerElement.current?.isSameNode(source)) {
        reorganizeItems(source.children);
      }
    });
  }, []);

  useEffect(() => {
    const itemsWithKey: Array<TypeWithKey<T>> = [];
    for (let i = 0, length = items.length; i < length; i++) {
      itemsWithKey.push({
        ...items[i],
        _key: v4(),
      });
    }

    currentItems.current = itemsWithKey;
    setStateItems(itemsWithKey);
  }, [items]);

  const reorganizeItems = (children: HTMLCollection) => {
    // TODO: This will not work when an item is added
    const newArray: Array<TypeWithKey<T>> = [];
    for (let i = 0, length = children.length; i < length; i++) {
      const child = children[i] as HTMLElement;
      const foundItem = currentItems.current?.find((item) => item._key === child.dataset['id']);
      if (foundItem) {
        newArray.push(foundItem);
      }
    }

    currentItems.current = newArray;
    onItemsChanged?.(currentItems.current);
  };

  const onContainerCreated = (container: Element) => {
    service.current?.addContainers([container]);
    containerElement.current = container as HTMLElement;
  };

  return (
    <div
      ref={(element) => element && onContainerCreated(element)}
      data-drag-container={containerName}
      data-copy={copyItems}
      data-direction={sortDirection}
    >
      {stateItems &&
        stateItems.map((item) => {
          const { _key, ...itemNoKey } = item;
          return (
            <div key={_key} data-id={_key}>
              {children(itemNoKey as T)}
            </div>
          );
        })}
    </div>
  );
}

export default memo(DragulaContainer);
