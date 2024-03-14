# DolARG API

Is an API to get the most commonly exchange rates of Argentina. The data is updated from Monday to Friday at 12 AM and 16 PM (GMT-3).

URL: https://dolarg-api.hola6290.workers.dev

- Scraping with scrape-it: extracts quotes from LA NACIÓN. It does it automatically with GitHub Actions from Monday to Friday at 12 AM and 16 PM (GMT-3). The new exchange rates are added to the Latest object and the others are accumulated within Historical.

- Continuous Deployment with GitHub Actions: once the previous action pushes the new quotes to the repository, another action is automatically triggered to deploy to Edge Functions of Cloudflare Workers. It only runs if the JSON where the quotes are being stored is modified and controls only a specific branch.

- Backend with Hono: I used this framework because it is an ideal option for developing APIs that will be deployed on the edge. Technically, this API is an edge function and runs on the edge servers provided by Cloudflare with their Workers.
