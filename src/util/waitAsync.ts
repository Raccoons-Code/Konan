import { promisify } from 'util';

/** @description wait a time in milliseconds */
export = promisify(setTimeout);