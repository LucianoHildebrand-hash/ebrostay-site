# Ebrostay Rental Marketplace Software Design Document

## 1. Purpose

Ebrostay should become a Zaragoza-focused rental marketplace and property-management website for furnished medium-stay homes. The reference product category is online verified rental platforms such as Spotahome: searchable homes, filters, listing evidence, clear availability, trust guarantees, and a request or booking path.

This document defines the requirements to build an Ebrostay-owned product inspired by that category. It must not copy Spotahome branding, visual trade dress, text, private data, images, APIs, or proprietary workflows.

## 2. Reference Research

Public observations from Spotahome and its help content:

- Homepage pattern: city search, accommodation categories, tenant trust messaging, owner/landlord path, multilingual footer, and online rental positioning.
- Search pattern: location-driven results with filters, listing cards, prices, availability, amenities, verification/protection signals, and sorting.
- Filter guidance: users narrow listings by location and filter options before selecting a property.
- Booking pattern: search, pick a place, request/book online, and move in with support.

Sources:

- https://www.spotahome.com/
- https://spotahome.zohodesk.com/portal/en/kb/articles/how-to-use-search-filters
- https://www.spotahome.com/blog/how-to-book-with-spotahome/

## 3. Product Goals

- Help tenants find furnished medium-stay homes in Zaragoza quickly.
- Make Ebrostay look operationally credible, local, and trustworthy.
- Capture inquiries from tenants and owners.
- Provide a foundation for real listings, calendars, payments, and owner operations later.
- Keep the MVP static and GitHub Pages-compatible until a backend is required.

## 4. Target Users

### Tenants

- Students, researchers, digital workers, relocating professionals, families in transition, and guests needing 1-11 month stays.
- Need clarity on price, location, availability, capacity, amenities, and terms before contacting Ebrostay.

### Property Owners

- Owners in Zaragoza who want Ebrostay to manage, publish, operate, or improve their rental property.
- Need confidence that Ebrostay can present homes well and coordinate guest operations.

### Ebrostay Operators

- Internal users who update listings, prices, availability, blocked dates, photos, and inquiries.
- In the MVP, these updates happen in code. In production, they should happen through an admin tool or connected property system.

## 5. MVP Scope

The current MVP is a static website with:

- Spanish and English language switching.
- Header and footer Ebrostay logo.
- Hero search form.
- Search results section with filter sidebar.
- Sort control.
- Quick filter chips.
- Listing cards with sample properties.
- Static map-style neighborhood preview.
- Favorites saved in local storage.
- Expandable listing details.
- Request button that pre-fills the contact form.
- Contact form that opens a `mailto:` draft.
- Software design document.

## 6. Core Functional Requirements

### 6.1 Search Entry

- Users can enter city, move-in date, and guest count from the hero.
- Submitting the hero search scrolls to the results section and applies available filters.
- City defaults to Zaragoza.

### 6.2 Filters

Users can filter by:

- City.
- Check-in date.
- Check-out date.
- Guest count.
- Property type: apartment, room, house, or all.
- Maximum monthly budget.
- Required amenities: wifi, desk, lift, air conditioning.
- Quick flags: verified, bills included, deposit protected.

Validation:

- Check-out must be after check-in.
- Empty dates are allowed, but if both dates exist the unavailable ranges must be checked.

### 6.3 Sorting

Users can sort results by:

- Best match.
- Lowest price.
- New arrivals.

### 6.4 Listings

Each listing card must show:

- Property image or placeholder visual.
- Availability badge.
- Save/favorite button.
- Property type.
- Neighborhood.
- Listing name.
- Monthly price.
- Short description.
- Trust badges.
- Capacity.
- Rating.
- Available-from date.
- Amenities.
- Expandable detail text.
- Request button.

### 6.5 Availability

MVP:

- Availability is calculated from blocked date ranges in `site.js`.
- A listing is hidden if the requested date range overlaps a blocked range.

Production:

- Availability should come from iCal feeds, PMS/calendar integration, or a backend database.
- Blocking rules should support pending requests, confirmed bookings, owner holds, cleaning buffers, and minimum stay rules.

### 6.6 Inquiry Flow

- Requesting a listing pre-fills the contact form.
- Contact form collects name, email, property/area, and message.
- Submitting opens an email draft to `hello@ebrostay.com`.

Production options:

- Send to CRM.
- Send to Google Sheets or Airtable.
- Create a lead in an internal dashboard.
- Trigger email notifications.

## 7. Future Functional Requirements

### Property Detail Page

- Photo gallery.
- Video or virtual tour.
- Floor plan.
- Full amenities list.
- House rules.
- Deposit, fees, and utility policy.
- Minimum stay.
- Availability calendar.
- Neighborhood guide.
- Similar homes.

### Booking Or Request Workflow

- Selected dates and guests.
- Tenant profile.
- Identity/contact details.
- Terms acceptance.
- Deposit/fee explanation.
- Payment or request-to-book step.
- Confirmation email.

### Owner Onboarding

- Owner lead form.
- Property details.
- Upload photos.
- Rental goal and availability.
- Service plan selection.
- Follow-up workflow for Ebrostay.

### Admin

- CRUD for properties.
- Photo manager.
- Availability calendar editor.
- Price editor.
- Inquiry management.
- Owner management.
- Audit log.

## 8. Data Model

### Property

- `id`
- `city`
- `type`
- `name`
- `neighborhood`
- `description`
- `details`
- `capacity`
- `monthlyPrice`
- `rating`
- `availableFrom`
- `isNew`
- `isVerified`
- `depositProtected`
- `billsIncluded`
- `amenities`
- `images`
- `blockedDates`
- `minimumStay`
- `fees`
- `ownerId`

### Inquiry

- `id`
- `createdAt`
- `language`
- `name`
- `email`
- `phone`
- `propertyId`
- `city`
- `checkIn`
- `checkOut`
- `guests`
- `budget`
- `message`
- `status`

### Owner

- `id`
- `name`
- `email`
- `phone`
- `properties`
- `servicePlan`
- `notes`

## 9. Non-Functional Requirements

- Mobile responsive.
- Fast static page load.
- No private credentials in frontend code.
- Works on GitHub Pages.
- Accessible labels for form controls.
- Cache-busted CSS and JS when deploying changes.
- Avoid visual copying from Spotahome; build an Ebrostay-owned brand system.
- SEO-ready metadata and canonical URL.
- Multilingual structure must support Spanish and English.

## 10. Suggested Architecture

### MVP

- `index.html`: static structure and translatable keys.
- `styles.css`: responsive marketplace UI.
- `site.js`: translations, sample data, filtering, sorting, favorites, details, inquiry prefill.
- GitHub Pages: static hosting.

### Production

- Frontend: Next.js, Astro, or similar.
- Backend: Supabase, Firebase, Rails, Laravel, or Node API.
- Database: PostgreSQL.
- Calendar sync: iCal ingestion plus manual holds.
- Storage: image bucket/CDN.
- Email: transactional email provider.
- CRM: HubSpot, Airtable, Notion, or custom admin dashboard.

## 11. Acceptance Criteria

- User can switch Spanish/English without page reload.
- User can filter listings by dates, people, type, budget, amenities, and quick flags.
- User can sort listings.
- User sees a result count or empty state.
- User can expand listing details.
- User can save favorites locally.
- User can click request and see the contact form pre-filled.
- Header logo is present and not oversized.
- Footer logo is present.
- Site works on desktop and mobile.
- Site deploys to `https://ebrostay.com/`.

## 12. Open Questions

- What real properties should replace the sample listings?
- Should Ebrostay show exact monthly prices or "from" prices?
- Should the booking path be instant booking, request-to-book, or inquiry-only?
- What email or CRM should receive inquiries?
- Will Ebrostay use real calendar feeds from Airbnb, Booking.com, Google Calendar, or a PMS?
- Should the brand target tenants first, owners first, or balance both?
