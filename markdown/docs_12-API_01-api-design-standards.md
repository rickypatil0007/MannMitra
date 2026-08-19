# MANNMITRA — API DESIGN STANDARDS

Document: `12-API/01-api-design-standards.md`
Status: Production Specification
Version: 1.0
Audience: Backend Engineers, Frontend Engineers
Platform: System Architecture

---

# 1. PURPOSE

To ensure the REST API and Serverless Functions are predictable, secure, and easy to consume by the frontend application.

---

# 2. DESIGN CONVENTIONS

- **Base Path:** `/api/v1/`
- **Format:** All requests and responses (except streaming text/audio) MUST use `application/json`.
- **Status Codes:**
  - `200 OK`: Success (Read/Update)
  - `201 Created`: Success (Create)
  - `400 Bad Request`: Validation failure (e.g., missing fields)
  - `401 Unauthorized`: Missing or invalid JWT
  - `403 Forbidden`: Valid JWT, but lacking permissions (e.g., Student trying to access Counsellor endpoint)
  - `404 Not Found`: Resource does not exist or is hidden by RLS
  - `429 Too Many Requests`: Rate limit exceeded

---

# 3. RESPONSE STRUCTURE

To simplify frontend error handling, all JSON responses should follow a standardized envelope:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 45 } // Optional
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Title is required for a task."
  }
}
```

---

# 4. DATA VALIDATION

- All incoming request bodies MUST be validated against a strict schema (e.g., using **Zod**) before hitting the database or AI orchestrator.
- Never trust client input, even if the frontend has validation.
