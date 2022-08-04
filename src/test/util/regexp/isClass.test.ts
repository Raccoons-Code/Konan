import assert from 'node:assert';
import Util from './../util';

class A_1 { }
class B extends A_1 { }
class C implements B { }
class D extends C implements B { }

const E = class { };
const F = class extends E { };
const G = class implements D { };
const H = class extends G implements D { };

{
  const a_1Mock = [
    'class A_1 {',
    'class A_1',
    'A_1',
    undefined,
  ];

  const a_1 = A_1.toString().match(Util.regexp.isClass) ?? [];

  assert.equal(a_1[0], a_1Mock[0]);
  assert.equal(a_1[1], a_1Mock[1]);
  assert.equal(a_1[2], a_1Mock[2]);
  assert.equal(a_1[3], a_1Mock[3]);
}

{
  const bMock = [
    'class B extends A_1 {',
    'class B extends A_1',
    'B',
    'A_1',
  ];

  const b = B.toString().match(Util.regexp.isClass) ?? [];

  assert.equal(b[0], bMock[0]);
  assert.equal(b[1], bMock[1]);
  assert.equal(b[2], bMock[2]);
  assert.equal(b[3], bMock[3]);
}

{
  const cMock = [
    'class C {',
    'class C',
    'C',
    undefined,
  ];

  const c = C.toString().match(Util.regexp.isClass) ?? [];

  assert.equal(c[0], cMock[0]);
  assert.equal(c[1], cMock[1]);
  assert.equal(c[2], cMock[2]);
  assert.equal(c[3], cMock[3]);
}

{
  const dMock = [
    'class D extends C {',
    'class D extends C',
    'D',
    'C',
  ];

  const d = D.toString().match(Util.regexp.isClass) ?? [];

  assert.equal(d[0], dMock[0]);
  assert.equal(d[1], dMock[1]);
  assert.equal(d[2], dMock[2]);
  assert.equal(d[3], dMock[3]);
}

{
  const eMock = [
    'class {',
    'class',
    undefined,
    undefined,
  ];

  const e = E.toString().match(Util.regexp.isClass) ?? [];

  assert.equal(e[0], eMock[0]);
  assert.equal(e[1], eMock[1]);
  assert.equal(e[2], eMock[2]);
  assert.equal(e[3], eMock[3]);
}

{
  const fMock = [
    'class extends E {',
    'class extends E',
    undefined,
    'E',
  ];

  const f = F.toString().match(Util.regexp.isClass) ?? [];

  assert.equal(f[0], fMock[0]);
  assert.equal(f[1], fMock[1]);
  assert.equal(f[2], fMock[2]);
  assert.equal(f[3], fMock[3]);
}

{
  const gMock = [
    'class {',
    'class',
    undefined,
    undefined,
  ];

  const g = G.toString().match(Util.regexp.isClass) ?? [];

  assert.equal(g[0], gMock[0]);
  assert.equal(g[1], gMock[1]);
  assert.equal(g[2], gMock[2]);
  assert.equal(g[3], gMock[3]);
}

{
  const hMock = [
    'class extends G {',
    'class extends G',
    undefined,
    'G',
  ];

  const h = H.toString().match(Util.regexp.isClass) ?? [];

  assert.equal(h[0], hMock[0]);
  assert.equal(h[1], hMock[1]);
  assert.equal(h[2], hMock[2]);
  assert.equal(h[3], hMock[3]);
}

{
  const className = 'class a extends b.c {';

  assert.equal(Util.regexp.isClass.test(className), true);
}

{
  const className = 'class a extends b. {';

  assert.equal(Util.regexp.isClass.test(className), false);
}