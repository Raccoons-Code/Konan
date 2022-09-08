import assert from 'node:assert';
import Util from '../util';

/**
 * 4364
 */
const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent feugiat est metus, et vehicula velit mattis a. Nulla nec rhoncus dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer sit amet elit et erat aliquet tristique. Cras luctus ultricies lacinia. Suspendisse id vehicula odio, eget placerat magna. Donec quis velit et leo pretium feugiat. Aliquam quis dignissim diam, lobortis tristique urna. Etiam lobortis felis sapien, sed mollis eros interdum sit amet. Suspendisse eu nibh eget dui finibus tempus. Cras fringilla urna dignissim risus semper cursus. Vestibulum libero lectus, pretium non ex ut, ornare rhoncus erat. Etiam elementum nisi rutrum magna condimentum efficitur. Pellentesque nisl lectus, sollicitudin sed mauris ac, convallis mollis purus.

Ut vitae ipsum tincidunt, tristique dolor eu, scelerisque quam. Aliquam iaculis sem nec risus consequat tristique. Etiam at sem ut quam consectetur auctor. Aenean ac vehicula augue, ac vulputate risus. Sed vitae tempus quam. Sed vel eros convallis, euismod enim vel, tristique urna. Praesent quis leo vel orci consequat tempus. Mauris posuere ut neque eu aliquam. Duis in sagittis justo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum efficitur leo et tincidunt aliquam. Morbi sagittis tellus tristique scelerisque tempor. Nullam pretium, tellus id porttitor scelerisque, augue magna tristique libero, ac iaculis leo felis vitae urna.

Cras nunc tortor, volutpat eu blandit non, viverra et lacus. Donec lacus nunc, pellentesque in efficitur ut, maximus vitae risus. Nulla venenatis elit nec viverra semper. Cras tincidunt quam augue. Vestibulum placerat, eros et egestas venenatis, nunc est consequat tellus, in convallis elit tellus at neque. Mauris sed sodales justo. Cras tincidunt consequat commodo. Cras id tristique nibh. Etiam elementum orci ac venenatis mollis. Vestibulum sollicitudin ligula ac purus posuere, eget euismod massa laoreet. Aliquam sollicitudin magna velit, sed vulputate arcu laoreet sit amet. Quisque sit amet libero lobortis, gravida est non, dignissim sem.

Nulla finibus non libero bibendum tincidunt. Ut consequat sapien mauris, in ornare felis fermentum ac. Integer eget dolor at enim accumsan ultricies. Vivamus a enim nisl. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum metus metus, in porttitor ex auctor eu. Phasellus nunc urna, fringilla vitae dignissim nec, aliquet mollis libero. Pellentesque semper enim mi, eu congue velit laoreet ac. Curabitur aliquet eros diam, non commodo mi vehicula blandit. Nullam ultricies, libero at lacinia dictum, massa lacus rhoncus nunc, eget ullamcorper nisi sem eu nibh. Nam ipsum augue, vestibulum lobortis quam at, lobortis ultrices eros. Aliquam eu hendrerit ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus.

Sed sollicitudin lorem felis, vel scelerisque enim sollicitudin ac. Sed non justo sapien. Suspendisse semper enim quis fringilla maximus. Sed tristique est vel eleifend iaculis. Praesent id facilisis elit, et blandit lectus. Phasellus maximus vel felis sed scelerisque. Donec bibendum risus vel ligula ornare ultricies. Nulla a volutpat lorem. Pellentesque vehicula congue dictum. Nam sollicitudin turpis eget aliquet viverra.

Suspendisse potenti. Cras vehicula massa nibh, sollicitudin rhoncus felis vehicula interdum. Nulla facilisis mi vel feugiat convallis. Sed consequat non est quis sodales. Etiam in quam quis nisl iaculis convallis. Aliquam vehicula, eros non viverra sodales, libero felis ultrices leo, sit amet faucibus leo est nec libero. Nunc vitae eros sit amet libero aliquam vestibulum eu quis sem. Sed pretium vulputate nibh a viverra. Suspendisse rutrum euismod diam a posuere. Morbi sit amet enim bibendum, pharetra enim ac, ullamcorper purus. Nulla fringilla condimentum justo in faucibus. Maecenas fermentum feugiat lorem lacinia feugiat. Sed posuere porta urna nec faucibus.

Vestibulum enim metus, cursus sed velit quis, dictum imperdiet metus. Nam ornare magna at interdum laoreet. Duis dignissim justo ac orci tincidunt, non condimentum risus sagittis. Vestibulum aliquam dolor elit, vitae ultrices lorem pretium id. Donec porta libero sit amet mi.` as string;

{
  const matched = text.match(Util.regexp.embed) ?? [];

  assert.equal(matched[1].length, 256);
  assert.equal(matched[2].length, 4096);
}
{
  const matched = `|${text}`.match(Util.regexp.embed) ?? [];

  assert.equal(matched[1].length, 0);
  assert.equal(matched[2].length, 4096);
}

{
  const text1 = '';

  const matched = text1.match(Util.regexp.embed) ?? [];

  assert.equal(matched[1].length, 0);
  assert.equal(matched[2].length, 0);
}

{
  const text1 = '|';

  const matched = text1.match(Util.regexp.embed) ?? [];

  assert.equal(matched[1].length, 0);
  assert.equal(matched[2].length, 0);
}

{
  const text1 = 'L';

  const matched = text1.match(Util.regexp.embed) ?? [];

  assert.equal(matched[1].length, 1);
  assert.equal(matched[2].length, 0);
}

{
  const text1 = 'L|';

  const matched = text1.match(Util.regexp.embed) ?? [];

  assert.equal(matched[1].length, 1);
  assert.equal(matched[2].length, 0);
}

{
  const text1 = '|L';

  const matched = text1.match(Util.regexp.embed) ?? [];

  assert.equal(matched[1].length, 0);
  assert.equal(matched[2].length, 1);
}

{
  const text1 = 'L|o';

  const matched = text1.match(Util.regexp.embed) ?? [];

  assert.equal(matched[1].length, 1);
  assert.equal(matched[2].length, 1);
}