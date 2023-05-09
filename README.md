# DolARG API

Is an API to get the most commonly dollar quotes of Argentina. The data is updated from Monday to Friday at 11:30 AM and 15:30 PM Argentina time.

URL: https://dolarg-api.hola6290.workers.dev

- Scraping with scrape-it: extracts quotes from LA NACIÓN. It does it automatically with GitHub Actions from Monday to Friday at 11:30 AM and 15:30 PM Argentina time. The new quotes are added to the Latest object and the others are accumulated within Historical.

- Continuous Deployment with Wrangler: once the scraper pushes the new quotes to the repository, another action is automatically triggered to deploy to Cloudflare Workers Edge Functions.

- Backend with Hono and Node JS: I used this framework that is specialized for backends that will be deployed to Edge Functions, which are servers that are close to the user, so they are faster than normal servers. They are usually used for simpler things, such as microservices.
