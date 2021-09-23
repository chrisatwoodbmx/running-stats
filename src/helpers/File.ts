import parser from 'fast-xml-parser';
import he from 'he';

export const FXPOptions = {
  attributeNamePrefix: '',
  attrNodeName: 'attributes', // default is 'false'
  textNodeName: '#text',
  ignoreAttributes: false,
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
  attrValueProcessor: (val: string): string => he.decode(val, { isAttributeValue: true }),
  tagValueProcessor: (val: string): string => he.decode(val),
  stopNodes: ['parse-me-as-string'],
};

export async function readFile(file: File, reader: FileReader): Promise<any> {
  return new Promise((resolve) => {
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
