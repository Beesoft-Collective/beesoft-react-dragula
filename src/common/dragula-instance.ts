import dragula, { DragulaOptions, Drake } from 'dragula';
import {
  ClonedListenerType,
  DragEndListenerType,
  DragListenerType,
  DragulaAvailableOptions,
  DropListenerType,
  GenericListenerType,
} from './dragula-types';

export class DragulaInstance {
  private static instance: DragulaInstance;

  private _drake: Drake;

  // these are the saved listener arrays
  private dragListeners: Array<DragListenerType> = [];
  private dragEndListeners: Array<DragEndListenerType> = [];
  private dropListeners: Array<DropListenerType> = [];
  private clonedListeners: Array<ClonedListenerType> = [];
  private cancelListeners: Array<GenericListenerType> = [];
  private removeListeners: Array<GenericListenerType> = [];
  private shadowListeners: Array<GenericListenerType> = [];
  private overListeners: Array<GenericListenerType> = [];
  private outListeners: Array<GenericListenerType> = [];

  public get drake() {
    return this._drake;
  }

  private constructor(private containers: Array<Element> = [], private options?: DragulaOptions) {
    this.options = {
      ...this.options,
      accepts: this.defaultAccepts,
      copy: this.defaultCopy,
      copySortSource: options?.copySortSource,
    };
    this._drake = dragula(this.containers, this.options);
  }

  public static getInstance(containers: Array<Element> = [], options?: DragulaAvailableOptions) {
    if (!this.instance) {
      this.instance = new DragulaInstance(containers, options);
    } else if (containers.length > 0) {
      this.instance.addContainers(containers);
    }

    if (options) {
    }

    return this.instance;
  }

  public addContainers(newContainers: Array<Element>) {
    if (this.containers.length > 0) {
      for (let i = 0, length = newContainers.length; i < length; i++) {
        const containerId = (newContainers[i] as HTMLElement).dataset['id'];
        const foundIndex = this.containers.findIndex(
          (container) => (container as HTMLElement).dataset['id'] === containerId
        );

        if (foundIndex > -1) {
          this.containers[foundIndex] = newContainers[i];
        } else {
          this.containers.push(newContainers[i]);
        }
      }
    } else {
      this.containers.push(...newContainers);
    }

    this._drake.containers = this.containers;
  }

  public addOptions(newOptions: DragulaAvailableOptions) {
    this.options = {
      ...this.options,
      ...newOptions,
    };

    this._drake.destroy();
    this._drake = dragula(this.containers, this.options);
    this.addSavedListeners();
  }

  public onDrag(listener: DragListenerType) {
    this.dragListeners.push(listener);
    this._drake.on('drag', listener);
  }

  public onDragEnd(listener: DragEndListenerType) {
    this.dragEndListeners.push(listener);
    this._drake.on('dragend', listener);
  }

  public onDrop(listener: DropListenerType) {
    this.dropListeners.push(listener);
    this._drake.on('drop', listener);
  }

  public on(event: 'cancel' | 'remove' | 'shadow' | 'over' | 'out', listener: GenericListenerType) {
    switch (event) {
      case 'cancel':
        this.cancelListeners.push(listener);
        break;
      case 'remove':
        this.removeListeners.push(listener);
        break;
      case 'shadow':
        this.shadowListeners.push(listener);
        break;
      case 'over':
        this.overListeners.push(listener);
        break;
      case 'out':
        this.outListeners.push(listener);
        break;
    }

    this._drake.on(event, listener);
  }

  public onCloned(listener: ClonedListenerType) {
    this.clonedListeners.push(listener);
    this._drake.on('cloned', listener);
  }

  private addSavedListeners() {
    this.dragListeners.forEach((listener) => this._drake.on('drag', listener));
    this.dragEndListeners.forEach((listener) => this._drake.on('dragend', listener));
    this.dropListeners.forEach((listener) => this._drake.on('drop', listener));
    this.clonedListeners.forEach((listener) => this._drake.on('cloned', listener));
    this.cancelListeners.forEach((listener) => this._drake.on('cancel', listener));
    this.removeListeners.forEach((listener) => this._drake.on('remove', listener));
    this.shadowListeners.forEach((listener) => this._drake.on('shadow', listener));
    this.overListeners.forEach((listener) => this._drake.on('over', listener));
    this.outListeners.forEach((listener) => this._drake.on('out', listener));
  }

  private defaultAccepts(element?: Element, target?: Element, source?: Element): boolean {
    const targetContainer = (target as HTMLElement).dataset['dragContainer'];
    const sourceContainer = (source as HTMLElement).dataset['dragContainer'];

    if (targetContainer === undefined && sourceContainer === undefined) {
      return false;
    }

    return targetContainer === sourceContainer;
  }

  private defaultCopy(element: Element, source: Element): boolean {
    const sourceCopy = (source as HTMLElement).dataset['copy'];

    if (sourceCopy === undefined) {
      return false;
    }

    // yes we need to do this using Boolean("false") will actually return true, here is the MDN documentation proving
    // this https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean/Boolean#description
    return sourceCopy === 'true';
  }
}
