
const FOR_TECHNICAL_PURPOSE_VALUE = 0.989;

const BYTES_PER_TB = Math.pow(1024, 4);
export const SSC_TEXT = 'tSSC';
export const URL_DATA_NETWORK_INFO = 'https://raw.githubusercontent.com/Koniverse/Subspace-Data-Cacher/main/data/netWorkInfo.json';
export function bytesToTB(bytes: number) {
  return bytes / BYTES_PER_TB;
}


export function convertToTib(value: number, unit: string): number | undefined {
  switch (unit.toLowerCase()) {
    case 'gib':
      return value / 1024;
    case 'tib':
      return value;
    case 'pib':
      return value * 1024;
    case 'eib':
      return value * Math.pow(1024, 2);
    default:
      return undefined; // Trả về undefined nếu đơn vị không hợp lệ.
  }
}



export function convertToByte(value: number, unit: string): number  {
  switch (unit.toLowerCase()) {
    case 'gib':
      return value * Math.pow(2, 30);
    case 'tib':
      return value * Math.pow(2, 40);
    case 'pib':
      return value * Math.pow(2, 50);
    case 'eib':
      return value * Math.pow(2, 60);
    default:
      return 0; // Trả về undefined nếu đơn vị không hợp lệ.
  }
}


export const convertPlotSizeToByte = (numberOfPlot: number, unit='gib'): number => {
    return convertToByte(numberOfPlot, unit)  * FOR_TECHNICAL_PURPOSE_VALUE;
}

export const convertPlotSizeToShorter = (plotSize: number): number => {
    return plotSize / BYTES_PER_TB;
}


export const listSize = [
    {value: 'gib', label: 'GB'},
    {value: 'tib', label: 'TB'},
    {value: 'pib', label: 'PB'},
    {value: 'eib', label: 'EB'},
]
export const DATE_FORMAT = 'MM/DD/YYYY';
export const MONTH_FORMAT = 'MM/YYYY';
export const YEAR_FORMAT = 'YYYY';

export const PAGE_TITLE = 'Farming Space';
