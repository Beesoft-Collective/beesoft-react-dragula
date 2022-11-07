import dragula, { DragulaOptions, Drake } from 'dragula';

export class DragulaService {
  private static instance: DragulaService;

  private drake: Drake;
  private readonly options: DragulaOptions;

  private constructor(containers: Array<Element> = []) {
    this.options = {};
    this.drake = dragula(containers, this.options);
  }

  public static getServiceInstance(containers: Array<Element> = []) {
    if (!DragulaService.instance) {
      DragulaService.instance = new DragulaService(containers);
    } else if (containers.length > 0) {
      const currentContainers = DragulaService.instance.drake.containers;
      const filteredContainers = containers.filter(
        (container) =>
          !currentContainers.some(
            (currentContainer) =>
              (currentContainer as HTMLElement).dataset['drag-container'] ===
              (container as HTMLElement).dataset['drag-container']
          )
      );
      currentContainers.push(...filteredContainers);
    }

    return DragulaService.instance;
  }
}
