import { promisify } from 'util';

/** @description wait a time in miliseconds */
export = promisify(setTimeout);