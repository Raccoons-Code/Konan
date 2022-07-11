import assert from 'node:assert';
import Util from './util';

{
  assert.deepEqual(Util.bytes(0), [0, 'B']);
  assert.deepEqual(Util.bytes(999), [999, 'B']);
  assert.deepEqual(Util.bytes(Math.pow(1000, 1)), [0.98, 'KB']);
  assert.deepEqual(Util.bytes(Math.pow(1024, 1)), [1, 'KB']);
  assert.deepEqual(Util.bytes(Math.pow(1000, 2)), [0.95, 'MB']);
  assert.deepEqual(Util.bytes(Math.pow(1024, 2)), [1, 'MB']);
  assert.deepEqual(Util.bytes(Math.pow(1000, 3)), [0.93, 'GB']);
  assert.deepEqual(Util.bytes(Math.pow(1024, 3)), [1, 'GB']);
  assert.deepEqual(Util.bytes(Math.pow(1000, 4)), [0.91, 'TB']);
  assert.deepEqual(Util.bytes(Math.pow(1024, 4)), [1, 'TB']);
  assert.deepEqual(Util.bytes(Math.pow(1000, 5)), [0.89, 'PB']);
  assert.deepEqual(Util.bytes(Math.pow(1024, 5)), [1, 'PB']);
  assert.deepEqual(Util.bytes(Math.pow(1000, 6)), [0.87, 'EB']);
  assert.deepEqual(Util.bytes(Math.pow(1024, 6)), [1, 'EB']);
  assert.deepEqual(Util.bytes(Math.pow(1000, 7)), [0.85, 'ZB']);
  assert.deepEqual(Util.bytes(Math.pow(1024, 7)), [1, 'ZB']);
  assert.deepEqual(Util.bytes(Math.pow(1000, 8)), [0.83, 'YB']);
  assert.deepEqual(Util.bytes(Math.pow(1024, 8)), [1, 'YB']);
}