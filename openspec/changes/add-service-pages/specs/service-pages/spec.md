## ADDED Requirements

### Requirement: Service detail pages
The site SHALL serve `/services/<slug>` (and `/en/…`, `/pl/…`) for every file in `content/<locale>/services/`, returning 404 for unknown slugs.

#### Scenario: Known service renders
- **WHEN** a visitor opens `/en/services/laravel-upgrade`
- **THEN** the page shows the title, summary, price-from, timeline, deliverables, process steps, article, related projects, FAQ and a contact CTA

#### Scenario: Unknown service
- **WHEN** a visitor opens `/services/does-not-exist`
- **THEN** the response is 404

### Requirement: Service directions
Every service SHALL belong to exactly one direction, `development` or `support`. The site SHALL serve `/services/development` and `/services/support` (and `/en/…`, `/pl/…`), each with its own title, description and intro from `content/<locale>/services.yml` and the full list of that direction's services ordered by `order`. No service slug SHALL equal a direction slug.

#### Scenario: Direction page lists its services
- **WHEN** a visitor opens `/services/support`
- **THEN** the page shows the support intro and every service whose group is `support`, and no `development` service

#### Scenario: Slug collision rejected
- **WHEN** the unit tests run and a service file is named `development.yml` or `support.yml`
- **THEN** the tests fail

### Requirement: Services overview
`/services` SHALL show an intro and one block per direction with the direction's description, its featured services (3–4 slugs listed in `services.yml`) and a link to the direction page, followed by a contact CTA.

#### Scenario: Overview links both directions
- **WHEN** a visitor opens `/services`
- **THEN** the page links to `/services/development` and `/services/support` and shows the featured services of each

### Requirement: Structured data
Each service page SHALL embed JSON-LD with `Service` (provider Person, offer minPrice in the service’s configured priceCurrency, default USD), `BreadcrumbList` (Home → Services → Direction → Service), and `FAQPage` when FAQ exists. Direction pages SHALL embed `BreadcrumbList` (Home → Services → Direction).

#### Scenario: Service JSON-LD present
- **WHEN** the page HTML is fetched
- **THEN** it contains a `Service` node whose name equals the page title

#### Scenario: Breadcrumb includes direction
- **WHEN** `/services/laravel-upgrade` HTML is fetched
- **THEN** its `BreadcrumbList` contains an item for `/services/support` between Services and the service

### Requirement: Discovery
`/services`, both direction pages and every service slug SHALL appear in `sitemap.xml` for all three locales with hreflang alternates, and the header navigation SHALL link to `/services`.

#### Scenario: Sitemap lists services
- **WHEN** `/sitemap.xml` is fetched
- **THEN** it contains `/services/development</loc>`, `/services/support</loc>` and `/services/<slug></loc>` for every service slug

### Requirement: Locale parity
Every service slug SHALL exist in uk, en and pl and validate against `serviceSchema`.

#### Scenario: Parity check
- **WHEN** the unit tests run
- **THEN** the service slug sets of all three locales are identical and schema-valid

### Requirement: Temporary editorial indexing hold
The services overview, both direction pages and every service detail page SHALL expose a Studio-editable boolean `indexable` for each locale. It defaults to false. Only an explicit true SHALL emit `index, follow` in both robots meta and X-Robots-Tag; false or missing SHALL emit `noindex, follow`. Overview, direction and detail settings are independent of each other. Other page types SHALL retain their indexing behavior.

#### Scenario: Service copy awaits review
- **WHEN** a crawler requests the services overview, a direction page or a detail page in any locale
- **THEN** robots meta and X-Robots-Tag both contain `noindex, follow`

#### Scenario: Editor approves one localized page
- **WHEN** the editor sets `indexable: true` for a service or localized service list and publishes the change
- **THEN** that page emits `index, follow` in both robots meta and X-Robots-Tag
- **AND** other service pages keep their own indexing settings


### Requirement: Localized hourly pricing
Service content SHALL support an explicit `priceCurrency` of `USD` or `PLN`, defaulting to `USD` for existing content. Cards, detail-page price labels and JSON-LD SHALL use the same amount and currency.

#### Scenario: Polish hourly engagement
- **WHEN** a Polish hourly service has `priceFrom: 140`, `priceCurrency: PLN` and `priceUnit: hour`
- **THEN** cards and the detail page show `Od 140 zł/h`, and JSON-LD uses minPrice 140, priceCurrency PLN and unitText HOUR

#### Scenario: Existing dollar pricing
- **WHEN** a service omits priceCurrency
- **THEN** its amount is displayed in USD and its JSON-LD priceCurrency remains USD
