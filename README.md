# PowderDay

[![Vercel Status](https://img.shields.io/website?url=https%3A%2F%2Fpowderday.io&up_message=deployed&down_message=down&label=Vercel)](https://powderday.io/)

https://powderday.io/

Check for snow before you go

Built with:
- React
- Vite
- SCSS

## Project setup
- After cloning repository, run `npm i` from project root

## Compile assets

- Be sure you're running Node v24+
- From project root, run `npm run dev`

## Deployment

Pushing to `main` triggers an automatic build and deploy on Vercel. The app is hosted at https://powderday.io.

## API

API requests that require secret keys are proxied through serverless functions in [api/](api) hosted on Vercel. Vercel runs files in the [api/](api) directory server-side, so those functions can read environment variables without exposing keys in frontend bundles.

All requests from [src/Api.jsx](src/Api.jsx) use this Vercel-based proxy layer before reaching third-party providers. National Weather Service requests don't need a key, but are proxied through [api/weather-us.js](api/weather-us.js) so their responses can be cached along with everything else (see below).

- Resort info courtesy of the SnoCountry API: https://feeds.snocountry.net/
- US resort weather from National Weather Service: https://api.weather.gov
- CAN resort weather from weatherApi: https://api.weatherapi.com
- Geocoding from Geoapify API: https://www.geoapify.com/api/

## Caching

Successful responses from every route in [api/](api) are cached on Vercel's CDN with `Cache-Control: public, s-maxage=1800, stale-while-revalidate=300`, set in `proxyJson` in [api/_utils.js](api/_utils.js):

- A response is served from the CDN for 30 minutes, so all visitors share one upstream request per unique URL in that window.
- For 5 minutes after that, the CDN keeps serving the stale copy while it fetches a fresh one in the background.
- Failed upstream requests aren't cached.

This keeps usage of the SnoCountry, weatherApi and Geoapify keys roughly flat regardless of traffic, and cuts down on National Weather Service requests that could otherwise get rate limited. Resorts publish snow reports a few times a day and forecasts update roughly hourly, so the 30-minute window costs little in freshness. To change it, edit `CACHE_CONTROL` in [api/_utils.js](api/_utils.js).

The cache is keyed on the full request URL, so requests only share a cache entry when their query strings match exactly. The Top Resorts search sorts resort ids before batching them into snow report requests (3 ids per call, the SnoCountry max) so every visitor requests the same batch URLs and hits the cache.

Coordinates and forecast URLs for most resorts are also stored in [src/data/coordinatesList.js](src/data/coordinatesList.js), which skips the geocode and grid point lookups entirely for those resorts.

During local development (`npm run dev`), requests go to the production API at https://powder-day.vercel.app, so they use the production cache. New or changed routes in [api/](api) aren't available locally until they're deployed.