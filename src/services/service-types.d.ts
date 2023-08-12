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

type IdListenerType<T> = {
  id: string;
  listener: T;
};

export interface AvailableListeners {
  container?: ContainerListenerType;
  moves?: MovesListenerType;
  accepts?: AcceptsListenerType;
  invalid?: InvalidListenerType;
  copy?: CopyListenerType;
  drag: Array<IdListenerType<DragListenerType>>;
  dragEnd: Array<IdListenerType<DragEndListenerType>>;
  drop: Array<IdListenerType<DropListenerType>>;
  cloned: Array<IdListenerType<ClonedListenerType>>;
  cancel: Array<IdListenerType<GenericListenerType>>;
  remove: Array<IdListenerType<GenericListenerType>>;
  shadow: Array<IdListenerType<GenericListenerType>>;
  over: Array<IdListenerType<GenericListenerType>>;
  out: Array<IdListenerType<GenericListenerType>>;
}
