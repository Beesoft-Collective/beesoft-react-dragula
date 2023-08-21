import { DragulaOptions } from 'dragula';

export type DragListenerType = (element: Element, source: Element) => void;

export type DragEndListenerType = (element: Element) => void;

export type DropListenerType = (element: Element, target: Element, source: Element, sibling: Element) => void;

export type ClonedListenerType = (clone: Element, original: Element, type: 'mirror' | 'copy') => void;

export type GenericListenerType = (element: Element, container: Element, source: Element) => void;

export type DragulaAvailableOptions = Omit<DragulaOptions, 'containers' | 'accepts' | 'copy'>;
