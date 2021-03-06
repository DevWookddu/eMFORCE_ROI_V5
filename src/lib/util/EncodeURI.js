/* eslint-disable no-bitwise */
export default (val) => {
  const str = `${val || ''}`;
  if (str !== '' && str !== undefined) {
    let s0;
    let s;
    let u;
    s0 = ''; // encoded str
    for (let i = 0; i < str.length; i += 1) {
      // scan the source
      s = str.charAt(i);
      u = str.charCodeAt(i); // get unicode of the char
      if (s === ' ') {
        s0 += '+'; // SP should be converted to "+"
      } else if (
        u === 0x2a ||
        u === 0x2d ||
        u === 0x2e ||
        u === 0x5f ||
        (u >= 0x30 && u <= 0x39) ||
        (u >= 0x41 && u <= 0x5a) ||
        (u >= 0x61 && u <= 0x7a)
      ) {
        // check for escape
        s0 += s; // don't escape
      } else if (u >= 0x0 && u <= 0x7f) {
        // single byte format
        s = `0${u.toString(16)}`;
        s0 += `%${s.substr(s.length - 2)}`;
      } else if (u > 0x1fffff) {
        // quaternary byte format (extended)
        s0 += `%${(0xf0 + ((u & 0x1c0000) >> 18)).toString(16)}`;
        s0 += `%${(0x80 + ((u & 0x3f000) >> 12)).toString(16)}`;
        s0 += `%${(0x80 + ((u & 0xfc0) >> 6)).toString(16)}`;
        s0 += `%${(0x80 + (u & 0x3f)).toString(16)}`;
      } else if (u > 0x7ff) {
        // triple byte format
        s0 += `%${(0xe0 + ((u & 0xf000) >> 12)).toString(16)}`;
        s0 += `%${(0x80 + ((u & 0xfc0) >> 6)).toString(16)}`;
        s0 += `%${(0x80 + (u & 0x3f)).toString(16)}`;
      } else {
        // double byte format
        s0 += `%${(0xc0 + ((u & 0x7c0) >> 6)).toString(16)}`;
        s0 += `%${(0x80 + (u & 0x3f)).toString(16)}`;
      }
    }
    return s0;
  }
  return '';
};
