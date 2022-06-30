import { promisify } from 'node:util';

/** @description wait a time in milliseconds */
export = promisify(setTimeout);