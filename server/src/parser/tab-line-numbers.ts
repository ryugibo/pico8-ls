import { Range } from 'vscode-languageserver';

export interface TabLineNumber {
  range: Range;
  lineInTab: number;
}

export function getTabLineNumbers(text: string): TabLineNumber[] {
  const decorations: TabLineNumber[] = [];
  const lines = text.replace(/\r\n/g, '\n').split('\n');

  let luaSectionStart = -1;
  let luaSectionEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '__lua__') {
      luaSectionStart = i;
    } else if (luaSectionStart !== -1 && lines[i].trim().startsWith('__gfx__')) {
      luaSectionEnd = i;
      break;
    }
  }
  if (luaSectionEnd === -1) {
    luaSectionEnd = lines.length;
  }

  if (luaSectionStart === -1) {
    return [];
  }

  let lineInTab = 1;
  for (let i = luaSectionStart + 1; i < luaSectionEnd; i++) {
    const lineText = lines[i].trim();

    if (lineText === '-->8') {
      lineInTab = 1; // Reset for the next line
      continue; // Skip adding decoration to this line
    }

    const range = {
        start: { line: i, character: 0 },
        end: { line: i, character: lines[i].length }
    };
    decorations.push({
      range,
      lineInTab,
    });
    lineInTab++;
  }

  return decorations;
}
