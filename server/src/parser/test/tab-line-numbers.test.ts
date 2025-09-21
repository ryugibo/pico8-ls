import * as assert from 'assert';
import { getTabLineNumbers } from '../tab-line-numbers';

describe("getTabLineNumbers", () => {
  it("should return empty for non-pico-8 files", () => {
    const text = `
function _init()
end
`;
    const result = getTabLineNumbers(text);
    assert.deepStrictEqual(result, []);
  });

  it("should return line numbers for a simple pico-8 file", () => {
    const text = `
__lua__
function _init()
  a = 1
end
-->8
function _update()
  b = 2
end
`;
    const result = getTabLineNumbers(text);
    assert.deepStrictEqual(result, [
      {
        range: {
          start: { line: 2, character: 0 },
          end: { line: 2, character: 16 },
        },
        lineInTab: 1,
      },
      {
        range: {
          start: { line: 3, character: 0 },
          end: { line: 3, character: 7 },
        },
        lineInTab: 2,
      },
      {
        range: {
          start: { line: 4, character: 0 },
          end: { line: 4, character: 3 },
        },
        lineInTab: 3,
      },
      // -->8 is skipped
      {
        range: {
          start: { line: 6, character: 0 },
          end: { line: 6, character: 18 },
        },
        lineInTab: 1,
      },
      {
        range: {
          start: { line: 7, character: 0 },
          end: { line: 7, character: 7 },
        },
        lineInTab: 2,
      },
      {
        range: {
          start: { line: 8, character: 0 },
          end: { line: 8, character: 3 },
        },
        lineInTab: 3,
      },
      {
        range: {
          start: { line: 9, character: 0 },
          end: { line: 9, character: 0 },
        },
        lineInTab: 4,
      },
    ]);
  });

  it("should handle no __lua__ section", () => {
    const text = `
__gfx__
0000
`;
    const result = getTabLineNumbers(text);
    assert.deepStrictEqual(result, []);
  });

  it("should handle a single tab in the __lua__ section", () => {
    const text = `
__lua__
a=1
b=2
c=3
`;
    const result = getTabLineNumbers(text);
    assert.deepStrictEqual(result, [
      {
        range: {
          start: { line: 2, character: 0 },
          end: { line: 2, character: 3 },
        },
        lineInTab: 1,
      },
      {
        range: {
          start: { line: 3, character: 0 },
          end: { line: 3, character: 3 },
        },
        lineInTab: 2,
      },
      {
        range: {
          start: { line: 4, character: 0 },
          end: { line: 4, character: 3 },
        },
        lineInTab: 3,
      },
      {
        range: {
          start: { line: 5, character: 0 },
          end: { line: 5, character: 0 },
        },
        lineInTab: 4,
      },
    ]);
  });
});
