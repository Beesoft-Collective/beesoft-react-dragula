import { isEqual } from 'lodash';
import React, { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { DragulaService } from '../../services/dragula.service';
import { isArrayOfObjects } from '../common/common-functions';
import { TypeWithKey } from '../common/common-types';

export interface DragulaContainerProps {
  containerName: string;
  copyItems?: boolean;
  sortDirection?: 'vertical' | 'horizontal';
  items: Array<unknown>;
  onItemsChanged?: (items: Array<unknown>) => void;
  className: string;
  children: (item: unknown) => ReactNode | Array<ReactNode>;
}

const DragulaContainer = ({
  containerName,
  copyItems = false,
  sortDirection = 'vertical',
  items,
  onItemsChanged,
  className,
  children,
}: DragulaContainerProps) => {
  const [stateItems, setStateItems] = useState<Array<TypeWithKey<Record<string, unknown>>>>();

  const containerId = useRef(v4());
  const currentItems = useRef<Array<TypeWithKey<Record<string, unknown>>>>();
  const service = useRef<DragulaService>();
  const containerElement = useRef<HTMLElement>();

  useEffect(() => {
    service.current = DragulaService.getServiceInstance();
    if (containerElement.current) {
      service.current?.addContainers([containerElement.current]);
    }

    service.current?.addAcceptsListener(containerId.current, (element, target) => {
      return (target as HTMLElement).dataset['dragContainer'] === containerName;
    });

    service.current?.addOnDropListener((element, target, source) => {
      const htmlTarget = target as HTMLElement;
      const htmlSource = source as HTMLElement;

      if (containerElement.current?.isSameNode(htmlTarget) && containerElement.current?.isSameNode(htmlSource)) {
        reorganizeItems(htmlSource.children);
      } else if (
        containerElement.current?.isSameNode(htmlTarget) &&
        htmlTarget.dataset['dragContainer'] === containerName
      ) {
        // this container is where the element was dropped
        reorganizeItems(htmlTarget.children);
      } else if (
        containerElement.current?.isSameNode(htmlSource) &&
        htmlSource.dataset['dragContainer'] === containerName
      ) {
        // this container is where the element came from
        reorganizeItems(htmlSource.children);
      }
    });
  }, []);

  useEffect(() => {
    if (items) {
      if (!isArrayOfObjects(items)) {
        throw new Error('The passed items must be an array of objects');
      }

      if (!isEqual(items, currentItems.current)) {
        const itemsWithKey: Array<TypeWithKey<Record<string, unknown>>> = [];
        for (let i = 0, length = items.length; i < length; i++) {
          itemsWithKey.push({
            ...items[i],
            _key: v4(),
          });
        }

        currentItems.current = itemsWithKey;
        setStateItems(itemsWithKey);
      }
    }
  }, [items]);

  const reorganizeItems = (children: HTMLCollection) => {
    const newArray: Array<TypeWithKey<Record<string, unknown>>> = [];
    for (let i = 0, length = children.length; i < length; i++) {
      const child = children[i] as HTMLElement;
      const foundItem = currentItems.current?.find((item) => item._key === child.dataset['id']);
      if (foundItem) {
        newArray.push(foundItem);
      } else {
        const key = child.dataset['id'];
        const parsedItem: Record<string, unknown> = JSON.parse(child.dataset['data'] || '{}');
        const newItem: TypeWithKey<Record<string, unknown>> = {
          ...parsedItem,
          _key: key || v4(),
        };

        newArray.push(newItem);
      }
    }

    currentItems.current = newArray;
    onItemsChanged?.(currentItems.current);
  };

  const onContainerCreated = (container: Element) => {
    service.current?.addContainers([container]);
    containerElement.current = container as HTMLElement;
  };
  console.log('rendered');
  return (
    <div
      ref={(element) => element && onContainerCreated(element)}
      className={className}
      data-id={containerId.current}
      data-drag-container={containerName}
      data-copy={copyItems}
      data-direction={sortDirection}
    >
      {stateItems &&
        stateItems.map((item) => {
          const { _key, ...itemNoKey } = item;
          return (
            <div key={_key} data-id={_key} data-data={JSON.stringify(itemNoKey)}>
              {children(itemNoKey)}
            </div>
          );
        })}
    </div>
  );
};

export default memo(DragulaContainer);
