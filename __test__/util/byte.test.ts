import assert from 'node:assert';
import Util from './util';

{
  assert.deepStrictEqual(new Util.Bytes(0).toArray(), [0, 'B']);
  assert.deepStrictEqual(new Util.Bytes(0).toJSON(), { bytes: 0, unit: 'B' });
  assert.deepStrictEqual(new Util.Bytes(0).toString(), '0.00 B');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 1)).toArray(), [0.98, 'KB']);
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 1)).toJSON(), { bytes: 0.98, unit: 'KB' });
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 1)).toString(), '0.98 KB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1024, 1)).toString(), '1.00 KB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 2)).toString(), '0.95 MB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1024, 2)).toString(), '1.00 MB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 3)).toString(), '0.93 GB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1024, 3)).toString(), '1.00 GB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 4)).toString(), '0.91 TB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1024, 4)).toString(), '1.00 TB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 5)).toString(), '0.89 PB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1024, 5)).toString(), '1.00 PB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 6)).toString(), '0.87 EB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1024, 6)).toString(), '1.00 EB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 7)).toString(), '0.85 ZB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1024, 7)).toString(), '1.00 ZB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1000, 8)).toString(), '0.83 YB');
  assert.deepStrictEqual(new Util.Bytes(Math.pow(1024, 8)).toString(), '1.00 YB');
}