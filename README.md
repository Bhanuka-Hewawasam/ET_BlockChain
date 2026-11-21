# TrustDoc

### Blockchain-Inspired Government Document Verification System

TrustDoc is an educational frontend prototype for registering, tracking, and verifying official documents. It demonstrates how SHA-256 hashing and a blockchain-inspired audit trail can help organisations detect whether a presented file matches a previously registered original.

> **Prototype notice:** This repository currently runs as a client-side demonstration. It uses sample records and a simulated ledger. It is not connected to a production blockchain, government database, backend API, cloud storage service, or authentication provider.

![TrustDoc dashboard](Files/Screenshot%202026-10-28%20204817.png)

## Why TrustDoc?

Employers, universities, banks, and government organisations often need to confirm whether a certificate or official document matches a record supplied by its issuing organisation. Manual checks can be slow and difficult to audit.

TrustDoc demonstrates a possible workflow:

1. An authorised issuer registers a document and its details.
2. The application calculates a SHA-256 fingerprint from the exact file bytes.
3. The document receives a unique verification reference.
4. A verifier looks up the reference, reviews the registered details, and uploads the presented file.
5. TrustDoc compares the uploaded file fingerprint with the registered fingerprint and displays the outcome.

A QR code should act only as a convenient link to the verification record. Copying a QR code does not make another certificate genuine: the verifier must compare the registered holder/details and, for file-integrity verification, upload the presented file.

## Features in this prototype

- **Overview dashboard** with registered document counts, sample verification statistics, recent records, and trust signals.
- **Document registration** for PDF, PNG, and JPG files up to 10 MB.
- **SHA-256 hashing** using the browser's Web Crypto API.
- **Document lookup** using a verification ID.
- **File integrity check** for records created during the current browser session.
- **Verification outcomes:** `Verified`, `Modified`, `Registered`, and `Unknown`.
- **Real QR code generation** using `qrcode.react`; each QR encodes a verification URL containing the document reference.
- **QR deep-link lookup**: opening a QR URL loads the Verify Document view and looks up the reference automatically.
- **QR export**: download the generated code as an SVG file for placing on a sample certificate.
- **Local demo persistence**: newly registered records are saved in the current browser using `localStorage`.
- **Sample verification history** and a responsive administration interface.
- **Prototype disclosure** so simulated blockchain functionality is not mistaken for a live network.

## Demo verification IDs

The verification page includes sample reference IDs:

| Verification ID | Example document | Current prototype behaviour |
| --- | --- | --- |
| `TD-2026-00482` | Advanced Diploma Certificate | Finds a sample record; it has no trusted original file hash |
| `TD-2026-00480` | Land Ownership Extract | Finds a sample record; it has no trusted original file hash |
| `TD-2026-00000` | Unknown reference | Returns Unknown |

To demonstrate an actual hash match, register a file and then verify that same file using the newly generated reference. A modified copy should produce a different hash. New demo records persist in the same browser through `localStorage`, so a QR link can reopen the record on that browser after a refresh. The browser-local record is not shared with other devices.

You can open the verification page directly at `/verify`.

## Technology stack

- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Wouter](https://github.com/molefrog/wouter) for lightweight routing
- [Lucide React](https://lucide.dev/) for icons
- [Sonner](https://sonner.emilkowal.ski/) for toast notifications
- Browser Web Crypto API for SHA-256 hashing
- pnpm for package management

## Project structure

```
.
├── src/
│   ├── pages/
│   │   └── Home.tsx       # Dashboard, upload, verify, and history views
│   ├── App.tsx            # Client-side routes
│   ├── index.css          # Application styles and responsive layout
│   └── main.tsx           # Application entry point
├── docs/
│   └── VERIFICATION_ARCHITECTURE.md
├── Files/                 # Project screenshots and supporting coursework files
├── index.html             # Vite HTML entry point
├── package.json           # Scripts and dependencies
├── pnpm-lock.yaml         # Locked dependency versions
└── vite.config.ts         # Vite configuration
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- pnpm 9 or newer

Check your installed versions:

```bash
node --version
pnpm --version
```

### Installation

```bash
git clone https://github.com/Bhanuka-Hewawasam/ET_BlockChain.git
cd ET_BlockChain
pnpm install
```

### Run the development server

```bash
pnpm dev
```

Vite will print the local URL in the terminal, normally:

```
http://localhost:5173
```

### Create a production build

```bash
pnpm build
```

### Preview the production build locally

```bash
pnpm preview
```

## Using the prototype

### Register a document

1. Open the **Upload certificate** view and enter the certificate metadata.
2. Choose a PDF, PNG, or JPG file.
3. TrustDoc calculates a SHA-256 fingerprint in the browser.
4. A demonstration record is saved in the current browser and a unique reference is created.
5. Open **Verify document** to display a real QR code for that reference. Download the QR as SVG, share the verification URL, or scan it with a phone camera.

### Verify a document

1. Open the **Verify document** view.
2. Enter a verification ID.
3. Upload the candidate document file.
4. Select **Verify now**.
5. Review the result and the registered hash details.

## Verification logic

The prototype fingerprints file bytes:

```
file bytes → SHA-256 → document fingerprint
```

If the supplied file produces the same fingerprint as the registered file, the prototype reports a match. If the reference exists but the fingerprint differs, it reports a modified file. If no record matches the entered ID, it reports an unknown document.

A matching hash confirms that the supplied file is byte-for-byte identical to the file registered in the prototype. It does **not**, by itself, prove that the document was originally issued by a legitimate institution. A production system must verify issuers and protect the registration process. The verifier page displays registered metadata for human comparison; the prototype does not automatically extract and validate text inside a PDF.

## Current limitations

This repository is an educational prototype and must not be used to verify real government documents.

- The ledger is simulated; no live blockchain network or smart contract is connected.
- Records are demonstration data and client-side state is not backed by a database.
- There is no production authentication, authorisation, or role-based access control.
- QR codes are real and scannable, but contain a link to the current application origin plus a reference ID; they do not contain the certificate itself.
- Demo records are stored in the browser that registered them. A different phone or computer cannot retrieve a newly registered record until a shared backend/database is implemented.
- Cross-device scanning requires the application to be deployed on a reachable HTTPS host. A localhost link only works on the same device.
- Files are hashed in the browser but are not uploaded to secure cloud object storage.
- Seeded sample records do not include trusted original file digests for hash comparison.
- There are no production privacy, encryption-at-rest, backup, revocation, or monitoring controls.
- Dashboard metrics and some history entries are sample presentation data.

## Recommended next steps

A production-oriented version should be developed in stages:

1. Add a secure backend API and managed database.
2. Add verified issuer onboarding, authentication, and role-based permissions.
3. Store original files in private encrypted cloud object storage.
4. Connect QR verification links to a shared backend API and database so authorised verifiers on different devices can retrieve the same registration.
5. Display registered certificate details and clearly distinguish details mismatch from file hash mismatch.
6. Replace the simulated ledger with an auditable permissioned blockchain network where the use case justifies it.
7. Store only the minimum required hash and registration evidence on-chain; keep personal details and PDFs off-chain.
8. Add document revocation/expiry, audit logging, automated tests, monitoring, and backup procedures.
9. Provide an API for universities, employers, and other authorised organisations.

See [docs/VERIFICATION_ARCHITECTURE.md](docs/VERIFICATION_ARCHITECTURE.md) for the proposed issuer-to-verifier workflow, component responsibilities, security requirements, and QR-copy scenario.

## Academic context

TrustDoc was developed as an Emerging Technologies coursework prototype under the theme **“Emerging Technology for a Smarter Future.”** The project explores practical uses of cryptographic hashing, cloud-ready record management, and blockchain-based integrity evidence for document verification.

## Contributors

- **Bhanuka Hewawasam**
- **Semitha Binuk**
- **Dulaj Adhikari**

## License

No open-source license has been specified for this repository. Unless the repository owner adds a license, all rights remain with the copyright holder.
