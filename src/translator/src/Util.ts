export default class Util {
  static bindFunctions(instance: any) {
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));

    for (let i = 0; i < propertyNames.length; i++) {
      const propertyName = propertyNames[i];

      if (typeof instance[propertyName] === 'function')
        instance[propertyName] = instance[propertyName].bind(instance);
    }
  }
}