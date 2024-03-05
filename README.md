# DolARG API

Is an API to get the most commonly exchange rates of Argentina. The data is updated from Monday to Friday at 11 AM and 16 PM Argentina time.

URL: https://dolarg-api.hola6290.workers.dev

- Scraping with scrape-it: extracts quotes from LA NACIÓN. It does it automatically with GitHub Actions from Monday to Friday at 12 AM and 16 PM Argentina time. The new exchange rates are added to the Latest object and the others are accumulated within Historical.

- Continuous Deployment with GitHub Actions: once the scraper pushes the new exchange rates to the repository, another action is automatically triggered to deploy to Edge Functions of Cloudflare Workers.

- Backend with Hono: I used this framework that is specialized for backends that will be deployed to Edge Functions, which are servers that are close to the user, so they are faster than normal servers. They are usually used for simpler things, such as microservices.
