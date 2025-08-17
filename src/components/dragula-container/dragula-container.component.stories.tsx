import React from 'react';
import { action } from 'storybook/actions';
import { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';
import DragulaContainer, { DragulaContainerProps } from './dragula-container.component';

import "../../../node_modules/dragula/dist/dragula.min.css";

const meta: Meta<typeof DragulaContainer> = {
  title: 'Dragula Container',
  component: DragulaContainer,
};

export default meta;

type Story = StoryObj<typeof DragulaContainer>;

export type TestItem = {
  test1: string;
  test2: string;
  test3: string;
};

const Template = (args: DragulaContainerProps) => {
  const data = useRef<Array<TestItem>>([
    {
      test1: 'Test 1 Item 1',
      test2: 'Test 2 Item 1',
      test3: 'Test 3 Item 1',
    },
    {
      test1: 'Test 1 Item 2',
      test2: 'Test 2 Item 2',
      test3: 'Test 3 Item 2',
    },
    {
      test1: 'Test 1 Item 3',
      test2: 'Test 2 Item 3',
      test3: 'Test 3 Item 3',
    },
    {
      test1: 'Test 1 Item 4',
      test2: 'Test 2 Item 4',
      test3: 'Test 3 Item 4',
    },
  ]);

  return (
    <div>
      <DragulaContainer {...args} items={data.current}>
        {(item) => {
          const renderItem = item as TestItem;
          return (
            <div className="cursor-pointer">
              <div>{renderItem.test1}</div>
              <div>{renderItem.test2}</div>
              <div>{renderItem.test3}</div>
            </div>
          );
        }}
      </DragulaContainer>
      <DragulaContainer {...args} containerName="not-reorder">
        {(item) => {
          const renderItem = item as TestItem;
          return (
            <div className="cursor-pointer">
              <div>{renderItem.test1}</div>
              <div>{renderItem.test2}</div>
              <div>{renderItem.test3}</div>
            </div>
          );
        }}
      </DragulaContainer>
      <DragulaContainer {...args}>
        {(item) => {
          const renderItem = item as TestItem;
          return (
            <div className="cursor-pointer">
              <div>{renderItem.test1}</div>
              <div>{renderItem.test2}</div>
              <div>{renderItem.test3}</div>
            </div>
          );
        }}
      </DragulaContainer>
    </div>
  );
};

export const Reorder: Story = {
  args: {
    containerName: 'reorder',
    sortDirection: 'horizontal',
    onItemsChanged: action('onItemsChanged'),
    className: 'horizontal padding border',
  },
  render: (args) => <Template {...args} />,
};

export const ReorderCopy: Story = {
  args: {
    containerName: 'reorder',
    sortDirection: 'horizontal',
    copyItems: true,
    allowCopySorting: true,
    onItemsChanged: action('onItemsChanged'),
    className: 'horizontal padding border',
  },
  render: (args) => <Template {...args} />,
};

export const ReorderVertical: Story = {
  args: {
    containerName: 'reorder',
    sortDirection: 'vertical',
    onItemsChanged: action('onItemsChanged'),
    className: 'vertical',
  },
  render: (args) => <Template {...args} />,
};
