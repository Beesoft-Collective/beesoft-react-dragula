import dragula, { DragulaOptions, Drake } from 'dragula';

export class DragulaService {
  private static instance: DragulaService;

  private drake: Drake;
  private options: DragulaOptions;

  private constructor(containers: Array<Element> = []) {
    this.options = {};
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
    const currentContainers = DragulaService.instance.drake.containers;
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
  }

  public onDrag(listener: (el: Element, source: Element) => void) {
    this.drake.on('drag', listener);
  }

  public onDragEnd(listener: (el: Element) => void) {
    this.drake.on('dragend', listener);
  }

  public onDrop(listener: (el: Element, target: Element, source: Element, sibling: Element) => void) {
    this.drake.on('drop', listener);
  }

  public onCloned(listener: (clone: Element, original: Element, type: 'mirror' | 'copy') => void) {
    this.drake.on('cloned', listener);
  }

  public on(
    event: 'cancel' | 'remove' | 'shadow' | 'over' | 'out',
    listener: (el: Element, container: Element, source: Element) => void
  ) {
    this.drake.on(event, listener);
  }
}
