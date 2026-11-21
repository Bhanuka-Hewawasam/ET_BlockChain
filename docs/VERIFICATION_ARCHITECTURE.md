# TrustDoc — Verification Architecture

## Purpose

TrustDoc is an educational prototype that demonstrates how a document issuer can register a document fingerprint and how a verifier can check a presented copy against that registered fingerprint.

The important distinction is that a matching fingerprint proves that the file is byte-for-byte identical to the file registered in TrustDoc. It does not independently prove that the issuer was legitimate or that the information in the original document was truthful.

## Recommended real-world workflow

### 1. Registration by an authorised issuer

1. A university or other trusted issuing organisation signs in through an authenticated issuer account.
2. An authorised officer uploads the final certificate and enters its metadata: document title/type, holder name, issuing organisation, issue date, and an optional expiry date.
3. The backend validates the file type and size, checks the officer's permission, and calculates SHA-256 from the exact file bytes.
4. The backend creates a unique, unpredictable verification reference.
5. The original file is stored in private cloud object storage. Access is controlled; the file is not made public merely because a QR code exists.
6. The database stores the reference, metadata, storage key, issuer identity, registration time, status, and blockchain transaction reference.
7. A blockchain transaction records the document reference (or a privacy-preserving identifier), SHA-256 digest, issuer reference, and registration timestamp. Personal details and the PDF itself should not be written to a public blockchain.
8. The system creates a real QR code containing an HTTPS verification URL for that reference. The QR code is a locator, not proof of authenticity.

### 2. Verification by an employer or other verifier

1. The verifier scans the QR code or manually enters the document reference on the official TrustDoc website.
2. The backend looks up the record and checks its current status, including whether it has been revoked or expired.
3. TrustDoc displays the registered certificate details (for example, holder, qualification, issuing organisation, issue date, and reference) so the verifier can compare them with the presented certificate.
4. For a strong file-integrity check, the verifier uploads the presented PDF. The backend calculates a fresh SHA-256 digest from that exact file.
5. The backend retrieves the registered digest and verifies the corresponding blockchain transaction/proof.
6. The system compares the fresh digest with the registered digest and returns a clear result.

### 3. Interpreting results

- **Verified / Hash match:** the uploaded file has the same bytes as the file registered under that reference, and the registration record passes its integrity checks.
- **Modified / Hash mismatch:** the reference exists, but the uploaded file differs from the registered file.
- **Details mismatch:** the displayed registered metadata does not match the details printed on the presented certificate. This should be a separate warning from the hash result.
- **Revoked:** the issuer has formally withdrawn the document.
- **Expired:** the document has passed its validity date, where expiry applies.
- **Unknown reference:** no registration exists for the supplied reference.

A QR code copied from one certificate to another only points to the original record. It does not change that record. The verifier should see the registered holder and qualification details, compare them with the presented certificate, and upload the candidate file for a hash check. A copied QR code alone must never produce a “Verified” result.

## Why use both SHA-256 and Blockchain?

SHA-256 is a hashing algorithm. It produces a fixed-length digest from the file bytes and helps detect any change to those bytes.

Blockchain is a ledger for recording and independently checking registration events. It does not calculate whether a certificate is genuine, and it cannot correct false information entered at registration.

Together:
- SHA-256 answers: “Does this file match the registered file?”
- Blockchain helps answer: “Has the registered fingerprint record been secretly changed after registration?”

A normal database is still useful for searchable metadata, user accounts, status, and storage references. A hybrid design is usually more practical than putting the whole application or every PDF on-chain.

## Recommended component responsibilities

| Component | Responsibility |
| --- | --- |
| Web frontend | Issuer registration and verifier lookup/upload screens |
| Backend API | Authentication, permissions, validation, hashing, comparison, status checks |
| Cloud object storage | Private storage of original documents |
| Managed database | Metadata, users/roles, references, status, audit indexes |
| Blockchain network | Tamper-resistant registration/revocation evidence |
| QR encoder | Generates a scannable HTTPS verification URL |

## Security and privacy requirements

- Only approved issuers may register documents; issuer onboarding must verify the organisation.
- Use role-based access control and multi-factor authentication for issuer accounts.
- Keep original PDFs private and encrypt data in transit and at rest.
- Do not place student names, NIC numbers, or complete certificate files on a public blockchain.
- Use unguessable references, rate limiting, audit logs, backups, and monitoring.
- Define a revocation process for certificates registered in error or later withdrawn.
- Treat QR codes as public lookup references, not as access credentials.
- Avoid revealing more personal information than the verifier needs.

## Current repository status

This repository is a frontend demonstration, not a deployed production service.

- SHA-256 hashing is performed in the browser using the Web Crypto API.
- Real QR codes are generated with `qrcode.react`. Each QR encodes a URL on the current application origin with the document reference in a query parameter.
- Opening that URL loads the verification view and automatically looks up the reference.
- Newly registered demo records are persisted in the same browser using `localStorage`.
- Browser-local records are not synchronised across devices. A shared backend/database is required for an employer using another phone or computer to retrieve newly registered documents.
- The ledger is simulated; there is no live blockchain network or smart contract.
- There is no backend API, managed database, cloud object storage, or production authentication.
- The seeded sample records are display examples and do not contain original file digests for real hash comparison. To demonstrate a successful comparison, register a file and verify it using the same file in the same browser; then try a changed copy.
- The verification view displays registered metadata for manual comparison. It does not automatically extract and validate text from the uploaded PDF.

These limitations are intentionally stated so the prototype does not claim security or integrations that have not been implemented.
