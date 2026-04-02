# PowderDay

[![Vercel Status](https://img.shields.io/website?url=https%3A%2F%2Fpowderday.io&up_message=deployed&down_message=down&label=Vercel)](https://powderday.io/)

https://powderday.io/

Check for snow before you go

Built with:
- React
- Vite
- SCSS

## Compile assets

- Be sure you're running Node v24+
- From project root, run `npm run dev`

## Deployment

Pushing to `main` triggers an automatic build and deploy on Vercel. The app is hosted at https://powderday.io.

## API

Resort info courtesy of the SnoCountry API: https://feeds.snocountry.net/

US resort weather from National Weather Service: https://api.weather.gov

CAN resort weather from weatherApi: https://api.weatherapi.com

API requests that require secret keys are proxied through serverless functions in [api/](api) hosted on Vercel. Vercel runs files in the [api/](api) directory server-side, so those functions can read environment variables without exposing keys in frontend bundles.

Most requests from [src/Api.jsx](src/Api.jsx) use this Vercel-based proxy layer before reaching third-party providers. Public National Weather Service requests are made directly from the client since no secret keys are involved.
