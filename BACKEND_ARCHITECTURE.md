# Sunday School Finance Management — Backend Architecture

> **Stack:** Spring Boot 3.x · PostgreSQL · M-Pesa Daraja API · Africa's Talking SMS  
> **Scope:** Single-admin church finance portal — contribution ingestion, smart allocation, birthday fund, expenses, triage

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Technology Stack](#3-technology-stack)
4. [Spring Boot Project Structure](#4-spring-boot-project-structure)
5. [Database Schema](#5-database-schema)
6. [Authentication & Session Management](#6-authentication--session-management)
7. [Smart Allocation Engine](#7-smart-allocation-engine)
8. [M-Pesa Integration](#8-m-pesa-integration)
9. [SMS Integration — Africa's Talking](#9-sms-integration--africas-talking)
10. [API Reference](#10-api-reference)
11. [Payment Processing Flows](#11-payment-processing-flows)
12. [Admin Triage Workflow](#12-admin-triage-workflow)
13. [Birthday Fund Module](#13-birthday-fund-module)
14. [Reports Module](#14-reports-module)
15. [Edge Cases & Error Handling](#15-edge-cases--error-handling)
16. [Environment Configuration](#16-environment-configuration)
17. [Security Considerations](#17-security-considerations)
18. [Implementation Phases](#18-implementation-phases)

---

## 1. System Overview

This backend powers a Sunday School contribution management portal. Parents pay via M-Pesa (through the normal M-Pesa app or SIM Toolkit) against a registered PayBill shortcode. Safaricom Daraja sends a C2B webhook to this backend, which then:

1. Identifies the parent by phone number.
2. Runs the Smart Allocation Engine to distribute funds across their children.
3. Sends an SMS confirmation via Africa's Talking.
4. Flags unresolvable payments for admin triage.

There is one admin user. The admin manages children, parents, expenses, and resolves flagged payments through the dashboard.

**Key Principles:**
- No parent-facing login or portal — parents only interact via M-Pesa.
- Allocation is fully automatic in the majority of cases.
- Admin only intervenes for edge cases (triage queue).
- All M-Pesa transactions are idempotent — duplicate callbacks are safely ignored.

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL ACTORS                             │
│                                                                     │
│  Parent (M-Pesa App / SIM Toolkit)        Admin (Next.js Dashboard) │
│           │                                         │               │
│           │ pays to PayBill shortcode               │ HTTPS/JWT     │
│           │                                         │               │
└───────────┼─────────────────────────────────────────┼───────────────┘
            │                                         │
            ▼                                         ▼
┌───────────────────────────┐           ┌─────────────────────────────┐
│   Safaricom Daraja API    │           │    Next.js Frontend          │
│                           │           │    (sunday-school-mgmt)      │
│  • C2B Confirmation POST  │           │                              │
│  • STK Push initiation    │           │  Routes consumed:            │
│  • STK Push callback POST │           │  /dashboard  /children       │
└───────────┬───────────────┘           │  /reports    /birthdays      │
            │                           │  /triage     /auth/login     │
            │ POST /api/mpesa/...       └──────────────┬───────────────┘
            │                                          │
            ▼                                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Spring Boot Backend (REST API)                  │
│                                                                     │
│  ┌─────────────┐  ┌──────────────────┐  ┌───────────────────────┐  │
│  │ Auth Layer  │  │  Webhook Layer   │  │   Admin API Layer     │  │
│  │  (JWT)      │  │  (Mpesa C2B/STK) │  │   (CRUD + Triage)    │  │
│  └──────┬──────┘  └────────┬─────────┘  └──────────┬────────────┘  │
│         │                  │                        │               │
│         └──────────────────┴────────────────────────┘               │
│                            │                                        │
│                  ┌─────────▼──────────┐                             │
│                  │  Allocation Engine │                             │
│                  │  (Core Business    │                             │
│                  │   Logic)           │                             │
│                  └─────────┬──────────┘                             │
│                            │                                        │
│              ┌─────────────┴───────────────┐                        │
│              ▼                             ▼                        │
│   ┌──────────────────┐        ┌────────────────────────┐            │
│   │  PostgreSQL DB   │        │  Africa's Talking SMS  │            │
│   │  (JPA/Hibernate) │        │  (Notification Layer)  │            │
│   └──────────────────┘        └────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Spring Boot | 3.2.x |
| Language | Java | 21 (LTS) |
| Database | PostgreSQL | 16.x |
| ORM | Spring Data JPA / Hibernate | (bundled) |
| Security | Spring Security + JWT | JJWT 0.12.x |
| Build Tool | Maven | 3.9.x |
| HTTP Client | Spring WebClient (Reactor) | (bundled) |
| SMS | Africa's Talking Java SDK | 1.x |
| Password Hashing | BCrypt | (Spring Security) |
| Validation | Jakarta Bean Validation | (bundled) |
| Migrations | Flyway | 10.x |
| Containerisation | Docker + Docker Compose | - |
| Testing | JUnit 5 + Mockito | (bundled) |

### Key Maven Dependencies

```xml
<dependencies>
    <!-- Core -->
    <dependency>spring-boot-starter-web</dependency>
    <dependency>spring-boot-starter-data-jpa</dependency>
    <dependency>spring-boot-starter-security</dependency>
    <dependency>spring-boot-starter-validation</dependency>

    <!-- Database -->
    <dependency>postgresql</dependency>
    <dependency>flyway-core</dependency>

    <!-- JWT -->
    <dependency>jjwt-api</dependency>
    <dependency>jjwt-impl</dependency>
    <dependency>jjwt-jackson</dependency>

    <!-- HTTP (for Daraja API calls) -->
    <dependency>spring-boot-starter-webflux</dependency>

    <!-- Africa's Talking -->
    <dependency>africastalking-java</dependency>

    <!-- Utilities -->
    <dependency>lombok</dependency>

    <!-- Testing -->
    <dependency>spring-boot-starter-test</dependency>
    <dependency>spring-security-test</dependency>
</dependencies>
```

---

## 4. Spring Boot Project Structure

```
src/main/java/com/sundayschool/finance/
│
├── SundaySchoolApplication.java              # Entry point
│
├── config/
│   ├── SecurityConfig.java                   # Spring Security filter chain, CORS
│   ├── JwtConfig.java                        # JWT secret, expiry config
│   ├── MpesaConfig.java                      # Daraja API credentials & URLs
│   ├── AfricasTalkingConfig.java             # AT API credentials
│   └── WebClientConfig.java                  # WebClient bean for outbound HTTP
│
├── controller/
│   ├── AuthController.java                   # POST /api/auth/login|refresh|logout
│   ├── ChildController.java                  # GET|POST|PUT|DELETE /api/children
│   ├── ParentController.java                 # GET|POST /api/parents
│   ├── PaymentController.java                # GET /api/payments
│   ├── AllocationController.java             # GET /api/allocations, POST /api/allocate
│   ├── TriageController.java                 # GET /api/triage, POST /api/triage/resolve
│   ├── ExpenseController.java                # GET|POST|DELETE /api/expenses
│   ├── ReportController.java                 # GET /api/reports/...
│   ├── DashboardController.java              # GET /api/dashboard
│   ├── BirthdayController.java               # GET /api/birthdays
│   └── MpesaController.java                  # Webhook receivers (public endpoints)
│
├── service/
│   ├── AuthService.java                      # Login, token issuance, refresh, logout
│   ├── ChildService.java                     # Child CRUD, DOB/birthday queries
│   ├── ParentService.java                    # Parent lookup and registration
│   ├── PaymentService.java                   # Payment persistence, duplicate check
│   ├── AllocationEngine.java                 # Core allocation decision logic
│   ├── AllocationService.java                # Persistence of allocation results
│   ├── TriageService.java                    # Triage queue management
│   ├── StkPushService.java                   # Initiate STK push via Daraja
│   ├── MpesaCallbackService.java             # Handle C2B & STK callbacks
│   ├── ExpenseService.java                   # Expense CRUD
│   ├── ReportService.java                    # Aggregated financial queries
│   ├── DashboardService.java                 # Dashboard metrics assembly
│   ├── BirthdayService.java                  # Birthday queries & fund balance
│   └── SmsService.java                       # Africa's Talking dispatch
│
├── repository/
│   ├── AdminRepository.java
│   ├── RefreshTokenRepository.java
│   ├── ParentRepository.java
│   ├── ChildRepository.java
│   ├── PaymentRepository.java
│   ├── AllocationRepository.java
│   ├── ExpenseRepository.java
│   └── SpecialFundRepository.java
│
├── model/                                    # JPA entities
│   ├── Admin.java
│   ├── RefreshToken.java
│   ├── Parent.java
│   ├── Child.java
│   ├── Payment.java
│   ├── Allocation.java
│   ├── Expense.java
│   └── SpecialFund.java
│
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RefreshTokenRequest.java
│   │   ├── CreateChildRequest.java
│   │   ├── UpdateChildRequest.java
│   │   ├── ManualAllocationRequest.java      # Triage resolution payload
│   │   ├── StkPushRequest.java               # Admin-initiated STK push
│   │   ├── CreateExpenseRequest.java
│   │   ├── MpesaC2bConfirmation.java         # Daraja C2B callback body
│   │   └── MpesaStkCallback.java             # Daraja STK callback body
│   │
│   └── response/
│       ├── AuthResponse.java                 # access_token + refresh_token
│       ├── ChildResponse.java
│       ├── ParentResponse.java
│       ├── PaymentResponse.java
│       ├── AllocationResponse.java
│       ├── TriagePaymentResponse.java
│       ├── ExpenseResponse.java
│       ├── DashboardResponse.java
│       ├── ReportResponse.java
│       └── BirthdayResponse.java
│
├── security/
│   ├── JwtTokenProvider.java                 # Sign, validate, extract claims
│   ├── JwtAuthFilter.java                    # OncePerRequestFilter
│   └── AdminUserDetailsService.java          # Load admin by email
│
├── exception/
│   ├── GlobalExceptionHandler.java           # @RestControllerAdvice
│   ├── ResourceNotFoundException.java
│   ├── DuplicateTransactionException.java
│   ├── AllocationException.java
│   └── MpesaException.java
│
└── util/
    ├── PhoneNormalizer.java                  # Normalize to 254XXXXXXXXX format
    └── DateUtil.java                         # DOB / birthday helpers
```

```
src/main/resources/
├── application.yml                           # Main config
├── application-dev.yml                       # Dev profile
├── application-prod.yml                      # Production profile
└── db/migration/
    ├── V1__create_admin.sql
    ├── V2__create_parents_children.sql
    ├── V3__create_payments_allocations.sql
    ├── V4__create_expenses.sql
    ├── V5__create_special_funds.sql
    ├── V6__create_refresh_tokens.sql
    └── V7__seed_admin.sql                    # Seeds the one admin account
```

---

## 5. Database Schema

All primary keys are `UUID` (generated by the application). All timestamps are `TIMESTAMPTZ` stored in UTC.

### 5.1 Admin

```sql
CREATE TABLE admin (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
```

One row only. Seeded via Flyway migration `V7__seed_admin.sql` with a bcrypt-hashed password.

### 5.2 Refresh Tokens

```sql
CREATE TABLE refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id   UUID         NOT NULL REFERENCES admin(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,   -- SHA-256 of the raw token
    expires_at TIMESTAMPTZ  NOT NULL,
    revoked    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_admin ON refresh_tokens(admin_id);
```

### 5.3 Parents

```sql
CREATE TABLE parents (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(255),                  -- nullable for unknown senders
    phone_number VARCHAR(20) NOT NULL UNIQUE,   -- normalised: 254XXXXXXXXX
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parents_phone ON parents(phone_number);
```

> **Phone number** is the primary M-Pesa matching key. All phone numbers are stored and compared in the normalised `254XXXXXXXXX` format (no `+` prefix, no leading `0`).

### 5.4 Children

```sql
CREATE TABLE children (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    date_of_birth DATE         NOT NULL,
    parent_id     UUID REFERENCES parents(id) ON DELETE SET NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_children_parent ON children(parent_id);
```

### 5.5 Payments

```sql
CREATE TYPE payment_status AS ENUM ('PROCESSING', 'ALLOCATED', 'UNALLOCATED');
CREATE TYPE payment_source AS ENUM ('C2B', 'STK_PUSH');

CREATE TABLE payments (
    id                UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number      VARCHAR(20)    NOT NULL,         -- normalised sender MSISDN
    amount            NUMERIC(12,2)  NOT NULL,
    mpesa_ref         VARCHAR(50)    NOT NULL UNIQUE,  -- TransID / MpesaReceiptNumber
    account_reference VARCHAR(100),                    -- BillRefNumber from C2B
    source            payment_source NOT NULL,
    status            payment_status NOT NULL DEFAULT 'PROCESSING',
    parent_id         UUID REFERENCES parents(id) ON DELETE SET NULL,
    received_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_phone    ON payments(phone_number);
CREATE INDEX idx_payments_mpesa_ref ON payments(mpesa_ref);
CREATE INDEX idx_payments_status   ON payments(status);
```

### 5.6 Allocations

```sql
CREATE TABLE allocations (
    id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id       UUID          NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    child_id         UUID          NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    amount_allocated NUMERIC(12,2) NOT NULL,
    allocated_by     VARCHAR(20)   NOT NULL DEFAULT 'AUTO',  -- 'AUTO' or 'ADMIN'
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    UNIQUE (payment_id, child_id)
);

CREATE INDEX idx_allocations_payment ON allocations(payment_id);
CREATE INDEX idx_allocations_child   ON allocations(child_id);
```

### 5.7 Special Funds

```sql
CREATE TABLE special_funds (
    id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100)  NOT NULL UNIQUE,  -- e.g. 'BIRTHDAY'
    balance    NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Seeded with one row: ('BIRTHDAY', 0.00)
```

### 5.8 Special Fund Transactions

```sql
CREATE TABLE special_fund_transactions (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    fund_id        UUID          NOT NULL REFERENCES special_funds(id),
    payment_id     UUID          REFERENCES payments(id) ON DELETE SET NULL,
    amount         NUMERIC(12,2) NOT NULL,
    direction      VARCHAR(5)    NOT NULL CHECK (direction IN ('IN', 'OUT')),
    description    TEXT,
    transacted_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

### 5.9 Expenses

```sql
CREATE TYPE expense_category AS ENUM (
    'SUPPLIES', 'EVENT', 'WELFARE', 'UTILITIES', 'TRAINING', 'OTHER'
);

CREATE TABLE expenses (
    id          UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    amount      NUMERIC(12,2)    NOT NULL,
    description TEXT             NOT NULL,
    category    expense_category NOT NULL,
    expense_date DATE            NOT NULL,
    approved_by VARCHAR(255),                -- Free text, e.g. "Teacher Grace"
    created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);
```

### 5.10 Entity Relationship Summary

```
admin ──< refresh_tokens

parents ──< children
parents ──< payments

payments ──< allocations >── children
payments ──< special_fund_transactions >── special_funds

expenses (standalone — no FK, admin-managed)
```

---

## 6. Authentication & Session Management

### 6.1 Design Decisions

- **Single admin.** There is no signup endpoint. The admin account is seeded by Flyway. Only the password can be changed.
- **Stateless JWT access tokens.** The backend does not store access tokens. Validity is proven by signature verification.
- **Stateful refresh tokens.** Stored (as SHA-256 hash) in `refresh_tokens` table to enable revocation (logout).
- **Token rotation.** Each `/api/auth/refresh` call issues a new refresh token and revokes the old one.

### 6.2 Token Lifetimes

| Token | Lifetime | Storage |
|---|---|---|
| Access Token (JWT) | 15 minutes | Frontend memory / `Authorization` header |
| Refresh Token (opaque UUID) | 7 days | Frontend `httpOnly` cookie OR local storage; hash stored in DB |

### 6.3 Auth Endpoints

#### `POST /api/auth/login`

**Public endpoint.** Validates credentials, issues tokens.

Request:
```json
{
  "email": "admin@school.com",
  "password": "YourSecurePassword"
}
```

Response `200 OK`:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "expiresIn": 900,
  "admin": {
    "id": "uuid",
    "name": "Teacher Grace",
    "email": "admin@school.com"
  }
}
```

Response `401 Unauthorized`:
```json
{ "error": "Invalid email or password" }
```

#### `POST /api/auth/refresh`

**Public endpoint.** Exchanges a valid refresh token for a new access token and rotated refresh token.

Request:
```json
{ "refreshToken": "550e8400-e29b-41d4-a716-446655440000" }
```

Response `200 OK`:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "new-uuid-here",
  "expiresIn": 900
}
```

Response `401 Unauthorized`: token expired, revoked, or not found.

#### `POST /api/auth/logout`

**Protected endpoint.** Revokes the refresh token.

Request:
```json
{ "refreshToken": "550e8400-e29b-41d4-a716-446655440000" }
```

Response `204 No Content`.

### 6.4 Protecting Endpoints

All endpoints under `/api/**` except:
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/mpesa/**` (webhook receivers — validated by IP allowlist, not JWT)

...require a valid `Authorization: Bearer <accessToken>` header.

### 6.5 JWT Claims Structure

```json
{
  "sub": "admin-uuid",
  "email": "admin@school.com",
  "role": "ADMIN",
  "iat": 1700000000,
  "exp": 1700000900
}
```

---

## 7. Smart Allocation Engine

`AllocationEngine.java` is a pure decision service — it takes a `Payment` + available context and returns a list of `AllocationResult` records. It does **not** write to the database; `AllocationService` handles persistence inside a transaction.

### 7.1 Decision Tree

```
Payment received
      │
      ▼
1. Normalise phone number (254XXXXXXXXX)
      │
      ▼
2. Lookup parent by phone_number in parents table
      │
      ├── NOT FOUND ──────────────────────────────────────────────────────────►  UNALLOCATED
      │                                                                         (create ghost parent row
      │                                                                          with phone only)
      ▼
3. Parent found → check account_reference
      │
      ├── account_reference == "BIRTHDAY" (case-insensitive) ─────────────────►  BIRTHDAY FUND
      │
      ├── account_reference matches a child name (fuzzy: contains / starts-with)
      │   AND that child belongs to this parent ───────────────────────────────►  FULL AMOUNT → that child
      │
      ├── account_reference matches a child name
      │   BUT child does NOT belong to this parent ────────────────────────────►  UNALLOCATED (flag: wrong parent)
      │
      └── account_reference is blank / unrecognised
            │
            ▼
        4. Count children of this parent
              │
              ├── 0 children ──────────────────────────────────────────────────►  UNALLOCATED (flag: no children linked)
              │
              ├── 1 child ───────────────────────────────────────────────────►  FULL AMOUNT → that child
              │
              └── N children (N ≥ 2)
                    │
                    ▼
                5. amount / N == whole number? ──► YES ──► split equally → each child
                                                   │
                                                   NO
                                                   │
                                                   ▼
                                              Distribute floor(amount/N) to each,
                                              add remainder (amount mod N) to first child
                                              Mark split_adjusted = true (for audit log)
```

### 7.2 Allocation Results

```java
public enum AllocationOutcome {
    ALLOCATED,            // fully resolved
    ALLOCATED_BIRTHDAY,   // routed to birthday special fund
    UNALLOCATED           // needs admin triage
}

public record AllocationResult(
    AllocationOutcome outcome,
    List<ChildAllocation> childAllocations,   // empty if BIRTHDAY / UNALLOCATED
    SpecialFundAllocation fundAllocation,     // null unless BIRTHDAY
    String flagReason                         // null unless UNALLOCATED
) {}

public record ChildAllocation(UUID childId, BigDecimal amount) {}
```

### 7.3 Triage Flag Reasons (stored on payment record)

| Code | Description |
|---|---|
| `UNKNOWN_PHONE` | Phone number not in parents table |
| `NO_CHILDREN_LINKED` | Parent found but has no children registered |
| `AMBIGUOUS_REFERENCE` | account_reference not blank but does not resolve |
| `CROSS_PARENT_REFERENCE` | Named child does not belong to this parent |
| `SPLIT_ERROR` | Unexpected arithmetic error during split (defensive catch) |

### 7.4 Transaction Safety

`AllocationService.processAllocation()` is annotated `@Transactional`. It:
1. Persists `Payment` with status `PROCESSING`.
2. Calls `AllocationEngine.decide()`.
3. Persists `Allocation` rows (or `SpecialFundTransaction` for BIRTHDAY).
4. Updates `Payment.status` to `ALLOCATED` or `UNALLOCATED`.
5. If any step throws, the entire transaction rolls back and the payment is not double-counted.

---

## 8. M-Pesa Integration

### 8.1 Flow Types

| Type | Direction | Who triggers | Endpoint |
|---|---|---|---|
| C2B Confirmation | Inbound | Safaricom → Backend | `POST /api/mpesa/c2b/confirm` |
| C2B Validation | Inbound (optional) | Safaricom → Backend | `POST /api/mpesa/c2b/validate` |
| STK Push | Outbound + Inbound | Admin triggers → Safaricom → Parent's phone → Backend callback | `POST /api/mpesa/stk/callback` |

### 8.2 Daraja API Configuration

```yaml
mpesa:
  consumer-key:       ${MPESA_CONSUMER_KEY}
  consumer-secret:    ${MPESA_CONSUMER_SECRET}
  shortcode:          ${MPESA_SHORTCODE}           # PayBill business short code
  passkey:            ${MPESA_PASSKEY}             # For STK push
  environment:        sandbox                       # sandbox | production
  base-url:
    sandbox:    https://sandbox.safaricom.co.ke
    production: https://api.safaricom.co.ke
  oauth-url:          /oauth/v1/generate?grant_type=client_credentials
  c2b-register-url:   /mpesa/c2b/v1/registerurl
  stk-push-url:       /mpesa/stkpush/v1/processrequest
  callback-base-url:  ${APP_BASE_URL}              # Your public HTTPS URL
```

### 8.3 C2B URL Registration (One-time Setup)

Before going live, register your callback URLs with Safaricom once:

**Endpoint (called by backend at startup or via a setup admin endpoint):**
```
POST https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl
Authorization: Bearer <oauth_token>
Content-Type: application/json

{
  "ShortCode":        "600XXX",
  "ResponseType":     "Completed",
  "ConfirmationURL":  "https://your-domain.com/api/mpesa/c2b/confirm",
  "ValidationURL":    "https://your-domain.com/api/mpesa/c2b/validate"
}
```

`ResponseType: "Completed"` means Safaricom proceeds even if our validation URL is slow/down.

### 8.4 C2B Validation Endpoint

**`POST /api/mpesa/c2b/validate`** — Public, no JWT.

Safaricom calls this **before** completing the transaction. We can accept or reject.

Safaricom request body:
```json
{
  "TransactionType":  "Pay Bill",
  "TransID":          "RKTQDM7W6S",
  "TransTime":        "20241015083045",
  "TransAmount":      "1500.00",
  "BusinessShortCode":"600638",
  "BillRefNumber":    "BRIAN",
  "InvoiceNumber":    "",
  "MSISDN":           "254708374149",
  "FirstName":        "Joyce",
  "MiddleName":       "",
  "LastName":         "Odhiambo"
}
```

Our response (always accept — we handle edge cases ourselves):
```json
{
  "ResultCode": "0",
  "ResultDesc": "Accepted"
}
```

> We always return `ResultCode: "0"` here. Even if the phone is unknown, we accept the payment and handle it as `UNALLOCATED` in our system. We never reject at validation.

### 8.5 C2B Confirmation Endpoint

**`POST /api/mpesa/c2b/confirm`** — Public, no JWT.

Safaricom calls this after a successful transaction. This is the primary ingestion point.

Safaricom request body:
```json
{
  "TransactionType":  "Pay Bill",
  "TransID":          "RKTQDM7W6S",
  "TransTime":        "20241015083045",
  "TransAmount":      "1500.00",
  "BusinessShortCode":"600638",
  "BillRefNumber":    "BRIAN",
  "InvoiceNumber":    "",
  "OrgAccountBalance":"",
  "ThirdPartyTransID":"",
  "MSISDN":           "254708374149",
  "FirstName":        "Joyce",
  "MiddleName":       "",
  "LastName":         "Odhiambo"
}
```

Processing steps in `MpesaCallbackService.handleC2bConfirmation()`:

```
1. Map DTO from request body

2. Check payments table WHERE mpesa_ref = TransID
   → If exists: return 200 OK immediately (idempotency — duplicate callback)

3. Normalise phone: MSISDN → 254XXXXXXXXX (PhoneNormalizer.normalise())

4. Build Payment entity:
   - phone_number     = normalised MSISDN
   - amount           = TransAmount
   - mpesa_ref        = TransID
   - account_reference= BillRefNumber (trimmed, uppercase)
   - source           = C2B
   - status           = PROCESSING

5. Call AllocationService.processAllocation(payment)
   → This runs the AllocationEngine and persists everything transactionally

6. Call SmsService.sendAllocationSms(payment, allocationResult) [async]

7. Return 200 OK to Safaricom
```

Required Safaricom response (must be returned within 5 seconds):
```json
{
  "ResultCode": "00000000",
  "ResultDesc": "Success"
}
```

### 8.6 STK Push (Admin-Initiated)

Admin triggers a payment request to a parent's phone. The parent receives a prompt and enters their M-Pesa PIN.

**Step 1 — Admin calls:**

`POST /api/payments/stk-push` (Protected, JWT required)

Request body:
```json
{
  "parentId":       "uuid-of-parent",
  "amount":         1000,
  "accountReference": "SUNDAY SCHOOL",
  "description":    "Monthly contribution — July 2025"
}
```

**Step 2 — Backend calls Daraja STK Push API:**

```
POST https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest
Authorization: Bearer <oauth_token>
Content-Type: application/json

{
  "BusinessShortCode": "600XXX",
  "Password":          "<base64(shortcode + passkey + timestamp)>",
  "Timestamp":         "20241015083045",
  "TransactionType":   "CustomerPayBillOnline",
  "Amount":            1000,
  "PartyA":            "254708374149",
  "PartyB":            "600XXX",
  "PhoneNumber":       "254708374149",
  "CallBackURL":       "https://your-domain.com/api/mpesa/stk/callback",
  "AccountReference":  "SUNDAY SCHOOL",
  "TransactionDesc":   "Monthly contribution — July 2025"
}
```

**Step 3 — Daraja immediate response:**
```json
{
  "MerchantRequestID":  "29115-34620561-1",
  "CheckoutRequestID":  "ws_CO_191220191020363925",
  "ResponseCode":       "0",
  "ResponseDescription":"Success. Request accepted for processing",
  "CustomerMessage":    "Success. Request accepted for processing"
}
```
Store `CheckoutRequestID` alongside the pending payment record for correlation.

**Step 4 — Safaricom calls STK callback after parent responds:**

`POST /api/mpesa/stk/callback` — Public, no JWT.

Success callback:
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_191220191020363925",
      "ResultCode":        0,
      "ResultDesc":        "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount",              "Value": 1000.00 },
          { "Name": "MpesaReceiptNumber",  "Value": "NLJ7RT61SV" },
          { "Name": "TransactionDate",     "Value": 20241015083045 },
          { "Name": "PhoneNumber",         "Value": 254708374149 }
        ]
      }
    }
  }
}
```

Failed/cancelled callback:
```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "29115-34620561-1",
      "CheckoutRequestID": "ws_CO_191220191020363925",
      "ResultCode":        1032,
      "ResultDesc":        "Request cancelled by user."
    }
  }
}
```

Processing steps in `MpesaCallbackService.handleStkCallback()`:

```
1. Parse ResultCode
   → ResultCode != 0: mark pending STK record as CANCELLED, return

2. Extract Amount, MpesaReceiptNumber, PhoneNumber from CallbackMetadata

3. Check payments table WHERE mpesa_ref = MpesaReceiptNumber (idempotency)

4. Normalise PhoneNumber → 254XXXXXXXXX

5. Build Payment entity:
   - source = STK_PUSH
   - account_reference = original AccountReference stored in pending record

6. Call AllocationService.processAllocation(payment)

7. Call SmsService.sendAllocationSms(payment, allocationResult) [async]
```

### 8.7 OAuth Token Management

Daraja APIs require a Bearer token obtained via:
```
GET https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
Authorization: Basic base64(consumerKey:consumerSecret)
```

Response:
```json
{ "access_token": "...", "expires_in": "3599" }
```

`MpesaConfig` should cache the token in memory and refresh it 60 seconds before expiry using a `@Scheduled` task.

---

## 9. SMS Integration — Africa's Talking

### 9.1 Configuration

```yaml
africastalking:
  api-key:  ${AT_API_KEY}
  username: ${AT_USERNAME}
  sender-id: ${AT_SENDER_ID}   # e.g. "SUNDAYSCH" — must be registered with AT
  environment: sandbox          # sandbox | production
```

### 9.2 Dispatch Triggers

SMS is dispatched **asynchronously** (via `@Async`) after every payment outcome.

| Trigger | Recipient | Template |
|---|---|---|
| Successful allocation (1 child) | Parent | Template A |
| Successful allocation (N children) | Parent | Template B |
| Birthday fund routed | Parent | Template C |
| Payment marked UNALLOCATED | Parent | Template D |
| Manual allocation resolved by admin | Parent | Template A or B |

### 9.3 Message Templates

**Template A — Single child allocation:**
```
KES {amount} received. Allocated to {childName}. Thank you for supporting Sunday School. - Grace Church SS
```

**Template B — Multiple children (split):**
```
KES {amount} received. Allocated: {child1} (KES {amt1}), {child2} (KES {amt2}). Thank you. - Grace Church SS
```

**Template C — Birthday fund:**
```
KES {amount} received and added to the Birthday Fund. Thank you. - Grace Church SS
```

**Template D — Unallocated (admin will resolve):**
```
KES {amount} received. Your payment is being reviewed and will be allocated shortly. For help contact your Sunday School admin. - Grace Church SS
```

### 9.4 SmsService Contract

```java
@Service
public class SmsService {

    @Async
    public void sendAllocationSms(Payment payment, AllocationResult result) {
        String phone = payment.getPhoneNumber();
        String message = buildMessage(payment, result);
        dispatch(phone, message);
    }

    private void dispatch(String phoneNumber, String message) {
        // Africa's Talking SDK call
        // Log success/failure — do not throw; SMS failure must not affect allocation
    }
}
```

> SMS failures are logged as warnings but never propagate. The allocation is already committed to the DB before SMS is attempted.

---

## 10. API Reference

All protected endpoints require `Authorization: Bearer <accessToken>`.  
Base URL: `https://your-domain.com`

### 10.1 Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login |
| POST | `/api/auth/refresh` | Public | Refresh access token |
| POST | `/api/auth/logout` | Protected | Revoke refresh token |

---

### 10.2 Children

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/children` | Protected | List all children |
| GET | `/api/children/{id}` | Protected | Get single child |
| POST | `/api/children` | Protected | Register a new child |
| PUT | `/api/children/{id}` | Protected | Update child details |
| DELETE | `/api/children/{id}` | Protected | Remove child |

#### `GET /api/children`

Query params: `?search=&page=0&size=20&sort=firstName`

Response `200 OK`:
```json
{
  "content": [
    {
      "id":          "uuid",
      "firstName":   "Amara",
      "lastName":    "Odhiambo",
      "dateOfBirth": "2017-03-12",
      "age":         8,
      "parent": {
        "id":          "uuid",
        "name":        "Joyce Odhiambo",
        "phoneNumber": "+254712345678"
      }
    }
  ],
  "totalElements": 15,
  "totalPages":    2,
  "page":          0,
  "size":          20
}
```

#### `POST /api/children`

Request:
```json
{
  "firstName":   "Amara",
  "lastName":    "Odhiambo",
  "dateOfBirth": "2017-03-12",
  "parentName":  "Joyce Odhiambo",
  "parentPhone": "+254712345678"
}
```

> Backend normalises `parentPhone`, then looks up the parents table by phone. If no matching parent exists, a new parent row is created. If the parent exists, the child is linked to the existing parent. This ensures siblings share one parent row.

Response `201 Created`: full `ChildResponse`.

#### `PUT /api/children/{id}`

Same body shape as POST. Partial update supported — only provided fields are changed.

#### `DELETE /api/children/{id}`

Response `204 No Content`.
> Allocations are not deleted; they remain as historical records with `child_id` set to null (FK ON DELETE SET NULL).

---

### 10.3 Parents

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/parents` | Protected | List all parents |
| GET | `/api/parents/{id}` | Protected | Get parent + their children |
| PUT | `/api/parents/{id}` | Protected | Update parent details |

#### `GET /api/parents/{id}`

Response `200 OK`:
```json
{
  "id":          "uuid",
  "name":        "Joyce Odhiambo",
  "phoneNumber": "+254712345678",
  "children": [
    { "id": "uuid", "firstName": "Amara", "lastName": "Odhiambo" }
  ],
  "totalContributions": 45000.00,
  "createdAt": "2024-01-10T08:00:00Z"
}
```

---

### 10.4 Payments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/payments` | Protected | List all payments (paginated) |
| GET | `/api/payments/{id}` | Protected | Get single payment + allocations |
| POST | `/api/payments/stk-push` | Protected | Initiate STK push to parent |

#### `GET /api/payments`

Query params: `?status=ALLOCATED&source=C2B&from=2025-01-01&to=2025-12-31&page=0&size=20`

Response `200 OK`:
```json
{
  "content": [
    {
      "id":               "uuid",
      "mpesaRef":         "RKTQDM7W6S",
      "phoneNumber":      "+254708374149",
      "amount":           1500.00,
      "accountReference": "BRIAN",
      "source":           "C2B",
      "status":           "ALLOCATED",
      "parent": {
        "id":   "uuid",
        "name": "Joyce Odhiambo"
      },
      "receivedAt": "2025-07-02T08:14:22Z"
    }
  ],
  "totalElements": 120,
  "totalPages":    6,
  "page":          0,
  "size":          20
}
```

#### `POST /api/payments/stk-push`

Request:
```json
{
  "parentId":        "uuid",
  "amount":          1000,
  "accountReference":"SUNDAY SCHOOL",
  "description":     "Monthly contribution — July 2025"
}
```

Response `202 Accepted`:
```json
{
  "checkoutRequestId": "ws_CO_191220191020363925",
  "message":           "STK push sent. Awaiting parent confirmation."
}
```

---

### 10.5 Allocations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/allocations` | Protected | All allocations (paginated) |
| GET | `/api/allocations/payment/{paymentId}` | Protected | Allocations for a specific payment |
| GET | `/api/allocations/child/{childId}` | Protected | Contribution history for a child |

#### `GET /api/allocations/payment/{paymentId}`

Response `200 OK`:
```json
{
  "paymentId": "uuid",
  "mpesaRef":  "RKTQDM7W6S",
  "totalAmount": 1500.00,
  "allocations": [
    {
      "id":              "uuid",
      "child": {
        "id":        "uuid",
        "firstName": "Brian",
        "lastName":  "Mwangi"
      },
      "amountAllocated": 750.00,
      "allocatedBy":     "AUTO",
      "createdAt":       "2025-07-02T08:14:25Z"
    },
    {
      "id":              "uuid",
      "child": {
        "id":        "uuid",
        "firstName": "Cynthia",
        "lastName":  "Mwangi"
      },
      "amountAllocated": 750.00,
      "allocatedBy":     "AUTO",
      "createdAt":       "2025-07-02T08:14:25Z"
    }
  ]
}
```

---

### 10.6 Triage (Admin Payment Resolution)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/triage` | Protected | List all UNALLOCATED payments |
| POST | `/api/triage/resolve` | Protected | Manually allocate a payment |

#### `GET /api/triage`

Returns payments with `status = UNALLOCATED`, sorted by `received_at` ascending (oldest first).

Response `200 OK`:
```json
[
  {
    "id":               "uuid",
    "mpesaRef":         "QHF2P9RT5W",
    "phoneNumber":      "+254711987654",
    "amount":           500.00,
    "accountReference": "XX",
    "flagReason":       "AMBIGUOUS_REFERENCE",
    "source":           "C2B",
    "receivedAt":       "2025-07-02T10:31:05Z"
  }
]
```

#### `POST /api/triage/resolve`

Admin allocates the payment manually. The sum of all allocation amounts must equal the payment amount.

Request:
```json
{
  "paymentId": "uuid",
  "allocations": [
    { "childId": "uuid-1", "amount": 250.00 },
    { "childId": "uuid-2", "amount": 250.00 }
  ]
}
```

Validation rules (enforced server-side):
- `allocations` must not be empty.
- Sum of `amount` fields must equal the payment's `amount` (±0.01 tolerance for rounding).
- Each `childId` must exist.

Response `200 OK`:
```json
{
  "paymentId": "uuid",
  "status":    "ALLOCATED",
  "allocations": [ ... ]
}
```

On success:
1. Persists `Allocation` rows with `allocated_by = 'ADMIN'`.
2. Updates `Payment.status = ALLOCATED`.
3. Dispatches SMS to parent asynchronously.

---

### 10.7 Expenses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/expenses` | Protected | List expenses (paginated) |
| GET | `/api/expenses/{id}` | Protected | Get single expense |
| POST | `/api/expenses` | Protected | Record a new expense |
| DELETE | `/api/expenses/{id}` | Protected | Delete an expense |

#### `GET /api/expenses`

Query params: `?category=EVENT&from=2025-01-01&to=2025-12-31&page=0&size=20`

Response `200 OK`:
```json
{
  "content": [
    {
      "id":          "uuid",
      "amount":      3500.00,
      "description": "Craft materials — July term",
      "category":    "SUPPLIES",
      "expenseDate": "2025-07-02",
      "approvedBy":  "Teacher Grace",
      "createdAt":   "2025-07-02T09:00:00Z"
    }
  ],
  "totalElements": 8,
  "totalPages": 1
}
```

#### `POST /api/expenses`

Request:
```json
{
  "amount":      3500.00,
  "description": "Craft materials — July term",
  "category":    "SUPPLIES",
  "expenseDate": "2025-07-02",
  "approvedBy":  "Teacher Grace"
}
```

Response `201 Created`: full `ExpenseResponse`.

---

### 10.8 Dashboard

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/dashboard` | Protected | Aggregate metrics for the dashboard |

Response `200 OK`:
```json
{
  "totalGeneralContributions": 184500.00,
  "birthdayFundBalance":       23750.00,
  "pendingTriageCount":        4,
  "recentActivity": [
    {
      "id":          "uuid",
      "description": "KES 1,000 auto-split: Brian & Cynthia Mwangi",
      "timestamp":   "2025-07-02T08:14:25Z",
      "type":        "ALLOCATION"
    },
    {
      "id":          "uuid",
      "description": "BDAY deposit — Amara Odhiambo routed to birthday fund",
      "timestamp":   "2025-07-02T07:10:12Z",
      "type":        "BIRTHDAY"
    },
    {
      "id":          "uuid",
      "description": "Unallocated payment flagged: KES 500 from +254711987654",
      "timestamp":   "2025-07-02T06:31:05Z",
      "type":        "TRIAGE"
    }
  ]
}
```

---

### 10.9 Reports

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/reports/summary` | Protected | All-time financial summary |
| GET | `/api/reports/monthly` | Protected | Month-by-month breakdown |
| GET | `/api/reports/child/{childId}` | Protected | Contribution history for one child |
| GET | `/api/reports/parent/{parentId}` | Protected | Payment history for one parent |

#### `GET /api/reports/summary`

Response `200 OK`:
```json
{
  "totalContributions": 376450.00,
  "totalExpenses":      89200.00,
  "netBalance":         287250.00,
  "birthdayFundBalance":23750.00,
  "period": {
    "from": "2024-01-01",
    "to":   "2025-07-02"
  }
}
```

#### `GET /api/reports/monthly`

Query params: `?year=2025`

Response `200 OK`:
```json
{
  "year": 2025,
  "months": [
    {
      "month":         "2025-01",
      "contributions": 28000.00,
      "expenses":      5000.00,
      "net":           23000.00
    }
  ]
}
```

---

### 10.10 Birthdays

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/birthdays` | Protected | Children with birthdays in the current month |
| GET | `/api/birthdays/fund` | Protected | Birthday fund balance + recent deposits |

#### `GET /api/birthdays`

Response `200 OK`:
```json
{
  "month": "2025-07",
  "birthdays": [
    {
      "id":        "uuid",
      "name":      "Amara Odhiambo",
      "birthDate": "2017-07-08",
      "age":       8,
      "daysUntil": 5
    }
  ]
}
```

#### `GET /api/birthdays/fund`

Response `200 OK`:
```json
{
  "balance": 23750.00,
  "recentDeposits": [
    {
      "id":          "uuid",
      "childName":   "Amara Odhiambo",
      "amount":      500.00,
      "receivedAt":  "2025-07-01T09:12:00Z"
    }
  ]
}
```

---

### 10.11 M-Pesa Webhooks (Public, No JWT)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/mpesa/c2b/validate` | IP allowlist | C2B validation callback |
| POST | `/api/mpesa/c2b/confirm` | IP allowlist | C2B confirmation callback |
| POST | `/api/mpesa/stk/callback` | IP allowlist | STK push result callback |

> These endpoints are not protected by JWT. They are secured by verifying the source IP matches Safaricom's known IP ranges (configured in `SecurityConfig`).

---

## 11. Payment Processing Flows

### 11.1 C2B Automatic Payment Flow (Happy Path)

```
Parent (M-Pesa App)
    │  pays KES 1000 to shortcode 600XXX, ref: BRIAN
    ▼
Safaricom Daraja
    │  POST /api/mpesa/c2b/validate → { ResultCode: "0" }
    │  POST /api/mpesa/c2b/confirm
    ▼
MpesaController.confirmC2b()
    │  deserialise body → MpesaC2bConfirmation DTO
    ▼
MpesaCallbackService.handleC2bConfirmation()
    │  1. Idempotency check on mpesa_ref → not duplicate
    │  2. Normalise phone: 254708374149
    │  3. Save payment (status = PROCESSING)
    │  4. AllocationService.processAllocation()
    │       AllocationEngine.decide():
    │         - parent found (Joyce Odhiambo)
    │         - account_reference "BRIAN" matches child Brian Mwangi
    │         → FULL AMOUNT to Brian Mwangi
    │       Persist Allocation row
    │       Update payment.status = ALLOCATED
    │  5. Async: SmsService.sendAllocationSms()
    │       → "KES 1000 received. Allocated to Brian Mwangi. Thank you."
    ▼
Response 200 OK → { ResultCode: "00000000", ResultDesc: "Success" }
```

### 11.2 Admin STK Push Flow

```
Admin Dashboard
    │  POST /api/payments/stk-push
    │  { parentId, amount: 1000, accountReference: "SUNDAY SCHOOL" }
    ▼
StkPushService.initiate()
    │  1. Lookup parent phone from parentId
    │  2. Get Daraja OAuth token (cached)
    │  3. POST to Daraja STK Push API
    │  4. Receive { CheckoutRequestID: "ws_CO_..." }
    │  5. Save pending Payment:
    │       source = STK_PUSH, status = PROCESSING
    │       checkout_request_id stored for correlation
    │  6. Return 202 to admin
    ▼
Parent's phone (M-Pesa prompt)
    │  Parent enters PIN → confirms
    ▼
Safaricom Daraja
    │  POST /api/mpesa/stk/callback { ResultCode: 0, ... }
    ▼
MpesaCallbackService.handleStkCallback()
    │  1. ResultCode == 0? → proceed
    │  2. Extract MpesaReceiptNumber, Amount, PhoneNumber
    │  3. Idempotency check on mpesa_ref
    │  4. Update pending payment with mpesa_ref, mark source confirmed
    │  5. AllocationService.processAllocation()
    │  6. Async SMS
```

### 11.3 Unknown Parent Flow (Triage)

```
Unknown phone pays KES 2000
    ▼
C2B confirmation received
    ▼
AllocationEngine.decide():
    → phone lookup returns null
    → create ghost parent row: { phone_number: "254733445566", name: null }
    → return UNALLOCATED, flagReason: UNKNOWN_PHONE
    ▼
AllocationService:
    → payment.status = UNALLOCATED
    → no Allocation rows created
    ▼
Async SMS → Template D: "payment being reviewed..."
    ▼
Admin sees payment in Triage queue
    ▼
Admin: registers parent + children for that phone number
    ▼
Admin: POST /api/triage/resolve
    → allocations created, payment.status = ALLOCATED, SMS sent
```

---

## 12. Admin Triage Workflow

When a payment cannot be automatically allocated, it enters the triage queue. The frontend shows this in the **Payment Allocation** panel on the dashboard.

### States

```
PROCESSING ──► ALLOCATED    (auto or manual resolution)
           └─► UNALLOCATED  (placed in triage queue)
```

### Resolution Options Available to Admin

1. **Assign to existing child(ren):** Admin picks one or more children and enters amounts. Backend validates the sum equals the payment total.
2. **Register parent first, then resolve:** Admin goes to Children Directory → adds child (which auto-creates or links parent by phone). The ghost parent row is updated with the real name. Then resolves the triage payment.

---

## 13. Birthday Fund Module

### How It Works

Parents send M-Pesa payments with `BillRefNumber = "BDAY"` (case-insensitive). The AllocationEngine detects this keyword and routes the full payment to the Birthday special fund instead of any child.

### Balance Tracking

`special_funds.balance` is updated on every BIRTHDAY allocation. It is **not** recalculated from transactions on each request — the running balance is maintained incrementally.

When an expense is paid from the birthday fund (e.g., a birthday cake), admin records it via a separate UI action (future phase):
```
POST /api/birthdays/fund/expense
{ "amount": 1500, "description": "Birthday cake for Amara", "childId": "uuid" }
```

### Birthday Display Logic

`GET /api/birthdays` returns children whose `date_of_birth` day+month falls within the current calendar month, sorted by day ascending.

`daysUntil` is computed in the service layer, not stored.

---

## 14. Reports Module

`ReportService` uses aggregate JPA queries (not in-memory computation) for efficiency.

### Total General Contributions

Sum of `allocations.amount_allocated` where the allocation links to a `children` record (excludes birthday fund).

### Net Balance

`totalContributions - totalExpenses` where expenses are from the `expenses` table.

### Monthly Breakdown

```sql
SELECT
    DATE_TRUNC('month', p.received_at) AS month,
    SUM(a.amount_allocated)            AS contributions,
    (SELECT COALESCE(SUM(e.amount), 0)
     FROM expenses e
     WHERE DATE_TRUNC('month', e.expense_date) = DATE_TRUNC('month', p.received_at)
    )                                  AS expenses
FROM payments p
JOIN allocations a ON a.payment_id = p.id
WHERE p.status = 'ALLOCATED'
GROUP BY DATE_TRUNC('month', p.received_at)
ORDER BY month DESC;
```

---

## 15. Edge Cases & Error Handling

### 15.1 Duplicate M-Pesa Callbacks

Safaricom may send the same callback more than once. `payments.mpesa_ref` has a `UNIQUE` constraint. The service checks for existence before processing:

```java
if (paymentRepository.existsByMpesaRef(transId)) {
    return; // silently ignore duplicate
}
```

### 15.2 Phone Number Normalisation

All phone numbers are normalised to `254XXXXXXXXX` format before any DB operation. `PhoneNormalizer.normalise()` handles:

| Input Format | Normalised |
|---|---|
| `+254712345678` | `254712345678` |
| `0712345678` | `254712345678` |
| `254712345678` | `254712345678` |
| `712345678` | `254712345678` |

### 15.3 Unequal Split Remainder

If `amount / childCount` produces a remainder (e.g., KES 1000 ÷ 3 children), the engine distributes:
- `floor(1000 / 3) = 333` KES to children 2 and 3
- `1000 - 333 - 333 = 334` KES to child 1 (first child absorbs remainder)

This is deterministic and auditable.

### 15.4 STK Push Cancellation or Timeout

If `ResultCode != 0` in the STK callback (user cancelled, timed out, insufficient balance):
- The pending payment record is marked `CANCELLED` (add this status to the enum).
- No allocation is created.
- No SMS is sent.
- The admin dashboard does not show cancelled pushes in the triage queue.

### 15.5 M-Pesa API Timeouts

If the Daraja API is unreachable when processing STK push initiation, the `StkPushService` throws `MpesaException`. The admin receives a `503 Service Unavailable` response. No payment record is created in this case.

### 15.6 Africa's Talking Failure

SMS dispatch is `@Async` and failures are caught and logged as `WARN`. They do not affect the allocation transaction.

### 15.7 Global Exception Handler

`GlobalExceptionHandler` maps common exceptions to HTTP responses:

| Exception | HTTP Status | Response |
|---|---|---|
| `ResourceNotFoundException` | 404 | `{ "error": "..." }` |
| `DuplicateTransactionException` | 200 | (silent accept for Safaricom) |
| `AllocationException` | 422 | `{ "error": "..." }` |
| `MethodArgumentNotValidException` | 400 | `{ "errors": [ ... ] }` |
| `AccessDeniedException` | 403 | `{ "error": "Access denied" }` |
| `JwtException` | 401 | `{ "error": "Invalid or expired token" }` |
| `Exception` (fallback) | 500 | `{ "error": "Internal server error" }` |

---

## 16. Environment Configuration

### `application.yml`

```yaml
spring:
  application:
    name: sunday-school-finance
  datasource:
    url:      jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:sundayschool}
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 10
      minimum-idle:      2
  jpa:
    hibernate:
      ddl-auto:    validate          # Flyway manages schema
    show-sql:      false
    properties:
      hibernate.dialect: org.hibernate.dialect.PostgreSQLDialect
  flyway:
    enabled:       true
    locations:     classpath:db/migration

server:
  port: ${PORT:8080}

jwt:
  secret:                   ${JWT_SECRET}         # min 256-bit base64-encoded string
  access-token-expiry-ms:   900000                 # 15 minutes
  refresh-token-expiry-days: 7

mpesa:
  consumer-key:     ${MPESA_CONSUMER_KEY}
  consumer-secret:  ${MPESA_CONSUMER_SECRET}
  shortcode:        ${MPESA_SHORTCODE}
  passkey:          ${MPESA_PASSKEY}
  environment:      ${MPESA_ENV:sandbox}
  callback-base-url:${APP_BASE_URL}

africastalking:
  api-key:      ${AT_API_KEY}
  username:     ${AT_USERNAME}
  sender-id:    ${AT_SENDER_ID}
  environment:  ${AT_ENV:sandbox}

logging:
  level:
    com.sundayschool: INFO
    org.hibernate.SQL: WARN
```

### Required Environment Variables

| Variable | Description |
|---|---|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port (default 5432) |
| `DB_NAME` | Database name |
| `DB_USER` | DB username |
| `DB_PASSWORD` | DB password |
| `JWT_SECRET` | Base64-encoded 256+ bit secret for JWT signing |
| `MPESA_CONSUMER_KEY` | Daraja app consumer key |
| `MPESA_CONSUMER_SECRET` | Daraja app consumer secret |
| `MPESA_SHORTCODE` | PayBill short code |
| `MPESA_PASSKEY` | Daraja passkey (for STK push) |
| `MPESA_ENV` | `sandbox` or `production` |
| `APP_BASE_URL` | Public HTTPS base URL (for Daraja callbacks) |
| `AT_API_KEY` | Africa's Talking API key |
| `AT_USERNAME` | Africa's Talking username |
| `AT_SENDER_ID` | Registered SMS sender name |
| `AT_ENV` | `sandbox` or `production` |

### Docker Compose (Development)

```yaml
version: "3.9"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB:       sundayschool
      POSTGRES_USER:     ssadmin
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db
    environment:
      DB_HOST:               db
      DB_PORT:               5432
      DB_NAME:               sundayschool
      DB_USER:               ssadmin
      DB_PASSWORD:           secret
      JWT_SECRET:            <generate-with-openssl-rand-base64-32>
      MPESA_CONSUMER_KEY:    sandbox_key
      MPESA_CONSUMER_SECRET: sandbox_secret
      MPESA_SHORTCODE:       174379
      MPESA_PASSKEY:         sandbox_passkey
      MPESA_ENV:             sandbox
      APP_BASE_URL:          https://your-ngrok-url.io
      AT_API_KEY:            sandbox
      AT_USERNAME:           sandbox
      AT_SENDER_ID:          SUNDAYSCH
      AT_ENV:                sandbox

volumes:
  pgdata:
```

---

## 17. Security Considerations

### 17.1 Webhook Endpoint Protection

The M-Pesa webhook endpoints are public (no JWT). They must be protected by:
- **IP allowlist** in `SecurityConfig`: only accept requests from Safaricom's known IP ranges.
- **HTTPS only**: the `APP_BASE_URL` must be HTTPS; Safaricom will not call HTTP endpoints in production.

Safaricom's IP ranges (verify latest from Safaricom developer documentation):
```
196.201.214.0/24
196.201.216.0/24
```

### 17.2 JWT Security

- JWT secret must be at least 256 bits. Generate with: `openssl rand -base64 32`
- Access tokens are short-lived (15 min) to limit exposure.
- Refresh tokens are stored as SHA-256 hashes — the raw token is never stored.
- On logout, the refresh token is revoked immediately.
- A scheduled job (`@Scheduled`) cleans expired refresh token rows daily.

### 17.3 Password Management

- Admin password stored as BCrypt hash (strength 12).
- No password reset endpoint in scope. Password is changed directly via a migration script or a future `/api/auth/change-password` endpoint.

### 17.4 Input Validation

- All request bodies are validated with Jakarta Bean Validation annotations.
- `phoneNumber` fields are normalised and validated against a `^254[17]\d{8}$` pattern.
- `amount` fields must be `> 0` and `≤ 1,000,000` (Safaricom per-transaction limit).
- SQL injection is not possible via JPA parameterised queries.

### 17.5 CORS

CORS is configured in `SecurityConfig` to allow only the frontend origin:
```java
.cors(cors -> cors.configurationSource(request -> {
    var config = new CorsConfiguration();
    config.setAllowedOrigins(List.of(frontendOrigin));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    return config;
}))
```

### 17.6 Rate Limiting

Consider adding Spring's `bucket4j` or a reverse-proxy rate limit on:
- `POST /api/auth/login` — prevent brute force (max 5 attempts per 15 min per IP).
- `POST /api/mpesa/**` — already naturally rate-limited by Safaricom volume.

---

## 18. Implementation Phases

### Phase 1 — Core MVP

- [ ] Spring Boot project scaffold with Flyway migrations
- [ ] PostgreSQL schema (all tables)
- [ ] Admin seed (Flyway V7)
- [ ] JWT auth: login, refresh, logout
- [ ] Children CRUD
- [ ] Parents auto-create/link on child registration
- [ ] M-Pesa C2B confirmation endpoint
- [ ] AllocationEngine (all 5 rules)
- [ ] AllocationService with `@Transactional`
- [ ] Basic APIs: `/api/payments`, `/api/allocations`, `/api/dashboard`

### Phase 2 — Triage + Expenses + STK

- [ ] Triage queue endpoint (`GET /api/triage`)
- [ ] Manual allocation endpoint (`POST /api/triage/resolve`)
- [ ] STK Push initiation + callback
- [ ] Expenses CRUD
- [ ] SMS integration (Africa's Talking) — all templates
- [ ] Birthday fund routing + balance tracking
- [ ] Birthday module endpoints

### Phase 3 — Reports + Polish

- [ ] Monthly breakdown report
- [ ] Child contribution history
- [ ] Parent payment history
- [ ] All-time financial summary
- [ ] IP allowlist for webhook endpoints
- [ ] Rate limiting on auth endpoints
- [ ] Logging and monitoring (structured JSON logs)
- [ ] Docker production image + deployment documentation

---
