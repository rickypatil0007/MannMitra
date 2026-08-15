# Maps & Location Services

## 1. Purpose
Defines the technical approach for implementing the "Quiet Space Finder" (Feature 08), allowing students to discover calming campus locations.

## 2. Scope
Covers map rendering, geocoding, and privacy-preserving location tracking.

## 3. Map Rendering
- **Library**: `react-map-gl` (Mapbox GL JS wrapper) or `leaflet` (via `react-leaflet`).
- **Provider**: Mapbox (preferred for custom, calming styling) or OpenStreetMap.
- **Styling**: The map must be styled to match the MannMitra aesthetic (clean, white/green, removing unnecessary POI clutter to avoid sensory overload).

## 4. Quiet Space Data Model
- Spaces are stored in a `quiet_spaces` table with `latitude`, `longitude`, `name`, `noise_level`, and `capacity`.
- PostGIS extension in PostgreSQL can be used if complex radius queries ("Find spaces within 500m") are required, though simple bounding box queries usually suffice for a single campus.

## 5. Privacy-Preserving Location Tracking
- **Hard Rule**: MannMitra does NOT track a student's continuous GPS location in the background.
- **Implementation**: The app requests `navigator.geolocation.getCurrentPosition()` ONLY when the user actively opens the Quiet Space Finder.
- The coordinates are kept entirely on the client-side to center the map. They are NEVER saved to the database or sent to the backend.

## 6. Edge Cases
- **Location Denied**: If the user denies GPS permissions, the map must gracefully fall back to centering on the default coordinates of the institution's main campus, allowing the user to pan manually.

## 7. Testing
- Mock the Geolocation API in the browser to return coordinates outside the campus bounds and ensure the UI correctly alerts the user: "You appear to be off-campus. Showing default campus view."
