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
  }

  public addIsContainerListener(listener: ContainerListenerType) {
    if (!this.options.isContainer) {
      this.addOptionSetting({
        isContainer: listener,
      });
    }
  }

  public addMovesListener(listener: MovesListenerType) {
    if (!this.options.moves) {
      this.addOptionSetting({
        moves: listener,
      });
    }
  }

  public addAcceptsListener(listener: AcceptsListenerType) {
    if (!this.options.accepts) {
      this.addOptionSetting({
        accepts: listener,
      });
    }
  }

  public addInvalidListener(listener: InvalidListenerType) {
    if (!this.options.invalid) {
      this.addOptionSetting({
        invalid: listener,
      });
    }
  }

  public addCopyListener(listener: CopyListenerType) {
    if (!this.options.copy) {
      this.addOptionSetting({
        copy: listener,
      });
    }
  }

  public addOnDragListener(listener: DragListenerType) {
    this.drake.on('drag', listener);
  }

  public addOnDragEndListener(listener: DragEndListenerType) {
    this.drake.on('dragend', listener);
  }

  public addOnDropListener(listener: DropListenerType) {
    this.drake.on('drop', listener);
  }

  public addOnClonedListener(listener: ClonedListenerType) {
    this.drake.on('cloned', listener);
  }

  public addOnCancelListener(listener: GenericListenerType) {
    this.drake.on('cancel', listener);
  }

  public addOnRemoveListener(listener: GenericListenerType) {
    this.drake.on('remove', listener);
  }

  public addOnShadowListener(listener: GenericListenerType) {
    this.drake.on('shadow', listener);
  }

  public addOnOverListener(listener: GenericListenerType) {
    this.drake.on('over', listener);
  }

  public addOnOutListener(listener: GenericListenerType) {
    this.drake.on('out', listener);
  }

  /*****************************************************************************************
   * the methods below here are the actual call methods from the different dragula functions
   ****************************************************************************************/

  private isContainer(element?: Element): boolean {
    const container = this.registeredListeners?.container;
    if (container) {
      return container(element);
    }

    return false;
  }

  private moves(element?: Element, container?: Element, handle?: Element, sibling?: Element): boolean {
    const moves = this.registeredListeners?.moves;
    if (moves) {
      return moves(element, container, handle, sibling);
    }

    return false;
  }

  private accepts(element?: Element, target?: Element, source?: Element, sibling?: Element): boolean {
    const targetContainer = (target as HTMLElement).dataset['dragContainer'];
    const sourceContainer = (source as HTMLElement).dataset['dragContainer'];

    if (targetContainer === undefined && sourceContainer === undefined) {
      return false;
    }

    return targetContainer === sourceContainer;
  }

  private invalid(element?: Element, target?: Element): boolean {
    const invalid = this.registeredListeners?.invalid;
    if (invalid) {
      return invalid(element, target);
    }

    return false;
  }

  private copy(element: Element, source: Element): boolean {
    const copy = this.registeredListeners?.copy;
    if (copy) {
      return copy(element, source);
    }

    return false;
  }
}
