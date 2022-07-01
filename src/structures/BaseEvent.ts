import Base from './Base';

export default abstract class BaseEvent extends Base {
  constructor() {
    super();
  }

  abstract execute(...args: any): Promise<any>;
}