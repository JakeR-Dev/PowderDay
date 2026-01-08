import { usStates, canadaProvinces } from './data/statesList'

// list resorts by state
export async function listResorts(stateCode = 'vt') {
  const url = 'https://feeds.snocountry.net/getResortList.php?apiKey=SnoCountry.example&resortType=alpine&states=' + stateCode + '&output=json';
  const options = {
    method: 'GET'
  };
  
  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
  }
}

// search resorts by name
export async function listAllResorts(resortQuery) {
  // get all the states and provinces, join them into a comma-separated list to be used in fetch
  const allStates = [...usStates, ...canadaProvinces].map(s => s.value.toLowerCase()).join(',');
  const url = 'https://feeds.snocountry.net/getResortList.php?apiKey=SnoCountry.example&states=' + allStates + '&output=json';
  const options = {
    method: 'GET'
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
  }
}

// get single resort snow report
export async function getResortSnowReport(resortId) {
  const url = 'https://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=' + resortId + '&output=json';
  const options = {
    method: 'GET'
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return JSON.parse(result);
  } catch (error) {
    console.error(error);
  }
}