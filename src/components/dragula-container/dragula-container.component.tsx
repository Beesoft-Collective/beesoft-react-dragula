import { isEqual } from 'lodash';
import React, { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { isArrayOfObjects } from '../../common/common-functions';
import { TypeWithKey } from '../../common/common-types';
import { DragulaInstance } from '../../common/dragula-instance';

export interface DragulaContainerProps {
  /**
   * The name of this container; 2 containers with the same names are allowed to drag and drop items between each other.
   */
  containerName: string;
  /**
   * If true dragging an item from the container will copy it instead of remove it (default false).
   */
  copyItems?: boolean;
  /**
   * When copy is true this determines if the items can still be reordered (default false).
   */
  allowCopySorting?: boolean;
  sortDirection?: 'vertical' | 'horizontal';
  /**
   * The items to render inside the dragula container.
   */
  items: Array<unknown>;
  /**
   * If the object data being created has a unique identifier defining it here will improve the comparison logic
   * resulting in less renders.
   */
  identityField?: string;
  /**
   * Fired when the items within a container are added to, removed from or reordered.
   * @param {Array<unknown>} items - The current items within the container after the operation has completed.
   */
  onItemsChanged?: (items: Array<unknown>) => void;
  className: string;
  children: (item: unknown) => ReactNode | Array<ReactNode>;
}

const DragulaContainer = ({
  containerName,
  copyItems = false,
  allowCopySorting = false,
  sortDirection = 'vertical',
  items,
  identityField,
  onItemsChanged,
  className,
  children,
}: DragulaContainerProps) => {
  const [stateItems, setStateItems] = useState<Array<TypeWithKey<Record<string, unknown>>>>();

  const containerId = useRef(v4());
  const currentItems = useRef<Array<TypeWithKey<Record<string, unknown>>>>();
  const dragula = useRef<DragulaInstance>();
  const containerElement = useRef<HTMLElement>();

  useEffect(() => {
    dragula.current = DragulaInstance.getInstance();
    if (containerElement.current) {
      dragula.current?.addContainers([containerElement.current]);
    }

    dragula.current?.onDrop((element, target, source) => {
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
    dragula.current?.addOptions({
      copySortSource: allowCopySorting,
    });
  }, [allowCopySorting]);

  useEffect(() => {
    if (items) {
      if (!isArrayOfObjects(items)) {
        throw new Error('The passed items must be an array of objects');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const currentItemsNoKey = currentItems.current?.map(({ _key, ...itemNoKey }) => itemNoKey);
      if (!isEqual(items, currentItemsNoKey)) {
        const itemsWithKey: Array<TypeWithKey<Record<string, unknown>>> = [];
        for (let i = 0, length = items.length; i < length; i++) {
          const item = items[i];
          let itemIndex = -1;
          if (identityField && currentItems.current) {
            itemIndex = currentItems.current.findIndex(
              (currentItem) => currentItem[identityField] === item[identityField]
            );
          } else if (currentItems.current) {
            itemIndex = currentItems.current.findIndex((currentItem) => isEqual(currentItem, item));
          }

          if (itemIndex > -1 && currentItems.current) {
            itemsWithKey.push({
              ...item,
              _key: currentItems.current[itemIndex]._key,
            });
          } else {
            itemsWithKey.push({
              ...item,
              _key: v4(),
            });
          }
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
    dragula.current?.addContainers([container]);
    containerElement.current = container as HTMLElement;
  };

  return (
    <div
      ref={(element) => element && onContainerCreated(element)}
      className={className}
      data-id={containerId.current}
      data-drag-container={containerName}
      data-copy={copyItems}
      data-copy-ordering={allowCopySorting}
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
