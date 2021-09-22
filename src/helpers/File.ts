import parser from 'fast-xml-parser';
import he from 'he';

export const FXPOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: 'attr', // default is 'false'
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataTagName: '__cdata', // default is 'false'
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  numParseOptions: {
    hex: true,
    leadingZeros: true,
    skipLike: /\+[0-9]{10}/,
  },
  arrayMode: false,
  attrValueProcessor: (val: unknown) => he.decode(val, { isAttributeValue: true }),
  tagValueProcessor: (val: unknown) => he.decode(val),
  stopNodes: ['parse-me-as-string'],
};

export async function readFile(file: File, reader: FileReader) {
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', (event) => {
      if (event?.target?.result === undefined || event?.target?.result === null) return;
      const strFile = event.target.result.toString();
      const tObj = parser.getTraversalObj(strFile, FXPOptions);
      const jsonObj = parser.convertToJson(tObj, FXPOptions);

      resolve(jsonObj);
    });
    reader.readAsText(file);
  });
}
