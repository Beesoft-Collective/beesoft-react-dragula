export type ContainerListenerType = (element?: Element) => boolean;

export type MovesListenerType = (
  element?: Element,
  container?: Element,
  handle?: Element,
  sibling?: Element
) => boolean;

export type AcceptsListenerType = (element?: Element, target?: Element, source?: Element, sibling?: Element) => boolean;

export type InvalidListenerType = (element?: Element, target?: Element) => boolean;

export type CopyListenerType = (element: Element, source: Element) => boolean;

export type DragListenerType = (element: Element, source: Element) => void;

export type DragEndListenerType = (element: Element) => void;

export type DropListenerType = (element: Element, target: Element, source: Element, sibling: Element) => void;

export type ClonedListenerType = (clone: Element, original: Element, type: 'mirror' | 'copy') => void;

export type GenericListenerType = (element: Element, container: Element, source: Element) => void;

export interface AvailableListeners {
  drag: Array<DragListenerType>;
  dragEnd: Array<DragEndListenerType>;
  drop: Array<DropListenerType>;
  cloned: Array<ClonedListenerType>;
  cancel: Array<GenericListenerType>;
  remove: Array<GenericListenerType>;
  shadow: Array<GenericListenerType>;
  over: Array<GenericListenerType>;
  out: Array<GenericListenerType>;
}
