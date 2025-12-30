export async function listResorts() {
  // rapid API version
  // const url = 'https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort';
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'x-rapidapi-key': 'f90f2d45ecmshc00f319866e548fp1ee5afjsnc909d6c28584',
  //     'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com'
  //   }
  // };

  // SnoCountry API version
  const url = 'http://feeds.snocountry.net/getResortList.php?apiKey=SnoCountry.example&states=co&output=json';
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

export async function getResortSnowReport(resortId) {
  // rapid API version
  // const url = `https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${resortId}`;
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'x-rapidapi-key': 'f90f2d45ecmshc00f319866e548fp1ee5afjsnc909d6c28584',
  //     'x-rapidapi-host': 'ski-resorts-and-conditions.p.rapidapi.com'
  //   }
  // };

  // SnoCountry API version
  const url = 'http://feeds.snocountry.net/getSnowReport.php?apiKey=SnoCountry.example&ids=' + resortId + '&output=json';
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