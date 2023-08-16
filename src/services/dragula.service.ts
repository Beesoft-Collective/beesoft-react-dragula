import dragula, { DragulaOptions, Drake } from 'dragula';
import { cloneDeep } from 'lodash';
import {
  AcceptsListenerType,
  AvailableListeners,
  ClonedListenerType,
  ContainerListenerType,
  CopyListenerType,
  DragEndListenerType,
  DragListenerType,
  DropListenerType,
  GenericListenerType,
  InvalidListenerType,
  MovesListenerType,
} from './service-types';

export class DragulaService {
  private static instance: DragulaService;

  private drake: Drake;
  private options: DragulaOptions;
  private registeredListeners: AvailableListeners;

  private constructor(containers: Array<Element> = []) {
    this.registeredListeners = {
      drag: [],
      dragEnd: [],
      drop: [],
      cloned: [],
      cancel: [],
      remove: [],
      shadow: [],
      over: [],
      out: [],
    };

    this.options = {
      accepts: this.accepts,
    };
    this.drake = dragula(containers, this.options);
  }

  public static getServiceInstance(containers: Array<Element> = []) {
    if (!DragulaService.instance) {
      DragulaService.instance = new DragulaService(containers);
    } else if (containers.length > 0) {
      DragulaService.instance.addContainers(containers);
    }

    return DragulaService.instance;
  }

  public addContainers(containers: Array<Element>) {
    const currentContainers = this.drake.containers;
    if (currentContainers.length > 0) {
      for (let i = 0, length = containers.length; i < length; i++) {
        const containerId = (containers[i] as HTMLElement).dataset['id'];
        const foundIndex = currentContainers.findIndex(
          (container) => (container as HTMLElement).dataset['id'] === containerId
        );

        if (foundIndex > -1) {
          currentContainers[foundIndex] = containers[i];
        } else {
          currentContainers.push(containers[i]);
        }
      }
    } else {
      currentContainers.push(...containers);
    }
  }

  public addOptionSetting(settings: DragulaOptions) {
    this.options = {
      ...this.options,
      ...settings,
    };
    const containers = cloneDeep(this.drake.containers);
    this.drake.destroy();
    this.drake = dragula(containers, this.options);
    this.addRegisteredListeners();
  }

  public addIsContainerListener(listener: ContainerListenerType) {
    this.addOptionSetting({
      isContainer: listener,
    });
  }

  public addMovesListener(listener: MovesListenerType) {
    this.addOptionSetting({
      moves: listener,
    });
  }

  public addAcceptsListener(listener: AcceptsListenerType) {
    this.addOptionSetting({
      accepts: listener,
    });
  }

  public addInvalidListener(listener: InvalidListenerType) {
    this.addOptionSetting({
      invalid: listener,
    });
  }

  public addCopyListener(listener: CopyListenerType) {
    this.addOptionSetting({
      copy: listener,
    });
  }

  public addOnDragListener(listener: DragListenerType) {
    this.registeredListeners.drag.push(listener);
    this.drake.on('drag', listener);
  }

  public addOnDragEndListener(listener: DragEndListenerType) {
    this.registeredListeners.dragEnd.push(listener);
    this.drake.on('dragend', listener);
  }

  public addOnDropListener(listener: DropListenerType) {
    this.registeredListeners.drop.push(listener);
    this.drake.on('drop', listener);
  }

  public addOnClonedListener(listener: ClonedListenerType) {
    this.registeredListeners.cloned.push(listener);
    this.drake.on('cloned', listener);
  }

  public addOnCancelListener(listener: GenericListenerType) {
    this.registeredListeners.cancel.push(listener);
    this.drake.on('cancel', listener);
  }

  public addOnRemoveListener(listener: GenericListenerType) {
    this.registeredListeners.remove.push(listener);
    this.drake.on('remove', listener);
  }

  public addOnShadowListener(listener: GenericListenerType) {
    this.registeredListeners.shadow.push(listener);
    this.drake.on('shadow', listener);
  }

  public addOnOverListener(listener: GenericListenerType) {
    this.registeredListeners.over.push(listener);
    this.drake.on('over', listener);
  }

  public addOnOutListener(listener: GenericListenerType) {
    this.registeredListeners.out.push(listener);
    this.drake.on('out', listener);
  }

  private addRegisteredListeners() {
    this.registeredListeners.drag.forEach((listener) => this.drake.on('drag', listener));
    this.registeredListeners.dragEnd.forEach((listener) => this.drake.on('dragend', listener));
    this.registeredListeners.drop.forEach((listener) => this.drake.on('drop', listener));
    this.registeredListeners.cloned.forEach((listener) => this.drake.on('cloned', listener));
    this.registeredListeners.cancel.forEach((listener) => this.drake.on('cancel', listener));
    this.registeredListeners.remove.forEach((listener) => this.drake.on('remove', listener));
    this.registeredListeners.shadow.forEach((listener) => this.drake.on('shadow', listener));
    this.registeredListeners.over.forEach((listener) => this.drake.on('over', listener));
    this.registeredListeners.out.forEach((listener) => this.drake.on('out', listener));
  }

  /*****************************************************************************************
   * the methods below here are the actual call methods from the different dragula functions
   ****************************************************************************************/

  private isContainer(element?: Element): boolean {
    return false;
  }

  private moves(element?: Element, container?: Element, handle?: Element): boolean {
    return false;
  }

  private accepts(element?: Element, target?: Element, source?: Element): boolean {
    const targetContainer = (target as HTMLElement).dataset['dragContainer'];
    const sourceContainer = (source as HTMLElement).dataset['dragContainer'];

    if (targetContainer === undefined && sourceContainer === undefined) {
      return false;
    }

    return targetContainer === sourceContainer;
  }

  private invalid(element?: Element, target?: Element): boolean {
    return false;
  }

  private copy(element: Element, source: Element): boolean {
    return false;
  }
}
