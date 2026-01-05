import { getResortSnowReport } from '../Api.jsx';

export default async function getResortInfo(resortID) {
  const data = await getResortSnowReport(resortID);
  const resortInfo = data.items[0];
  // console.log(resortInfo);

  // format the date
  let reportDate = new Date(resortInfo?.reportDateTime);
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  reportDate = new Intl.DateTimeFormat("en-US", options).format(reportDate);
  reportDate = reportDate.replace(',', ' @');

  return {
    name: resortInfo?.resortName || 'N/A',
    location: resortInfo?.state + ', ' + resortInfo?.country || '',
    resortStatus: resortInfo?.resortStatus || '7',
    operatingStatus: resortInfo?.operatingStatus || '',
    minLast24Hours: Number(resortInfo?.newSnowMin) || 0,
    maxLast24Hours: Number(resortInfo?.newSnowMax) || 0,
    baseDepthMin: Number(resortInfo?.avgBaseDepthMin) || 0,
    baseDepthMax: Number(resortInfo?.avgBaseDepthMax) || 0,
    primarySurfaceCondition: resortInfo?.primarySurfaceCondition || 'N/A',
    openDownHillPercent: resortInfo?.openDownHillPercent !== '' ? resortInfo?.openDownHillPercent : '0',
    openDownHillLifts: resortInfo?.openDownHillLifts || '0',
    maxDownHillLifts: resortInfo?.maxOpenDownHillLifts || 'N/A',
    reportDateTime: reportDate || 'N/A',
    comments: resortInfo?.snowComments || 'N/A',
    trailMapUrl: resortInfo?.lgTrailMapURL || '',
    snowLast48Hours: Number(resortInfo?.snowLast48Hours) || 0,
    weekdayHours: resortInfo?.weekdayHours || 'N/A',
    weekendHours: resortInfo?.weekendHours || 'N/A',
  };
}