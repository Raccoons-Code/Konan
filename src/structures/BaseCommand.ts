import Base from './Base';

export default abstract class BaseCommand extends Base {
  constructor() {
    super();
  }

  abstract execute(...args: any): Promise<any>;
}