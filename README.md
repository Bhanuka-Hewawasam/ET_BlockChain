# TrustDoc

### Blockchain-Inspired Government Document Verification System

TrustDoc is a frontend prototype for registering, tracking, and verifying official documents. It demonstrates how cryptographic hashing and a blockchain-inspired audit trail can help organisations detect whether a document matches its registered original.

> **Prototype notice:** TrustDoc currently runs as a client-side demonstration. It uses sample records and a simulated ledger; it is not connected to a production blockchain, government database, cloud storage service, or authentication provider.

![TrustDoc dashboard](Files/Screenshot%202026-10-28%20204817.png)

## Why TrustDoc?

Employers, universities, banks, and government organisations often need to confirm whether a certificate or official document is genuine. Manual checks can be slow, difficult to audit, and vulnerable to edited copies.

TrustDoc demonstrates a simpler flow:

1. An authorised issuer selects a document and enters its metadata.

1. The application generates a SHA-256 fingerprint from the file.

1. The document receives a unique verification ID and a QR-style reference.

1. A verifier enters the ID and optionally uploads a copy of the document.

1. TrustDoc compares the file fingerprint with the registered record and displays the result.

## Features

- **Overview dashboard** with registered document counts, verification statistics, recent records, and trust signals.

- **Document registration** for PDF, PNG, and JPG files up to 10 MB.

- **SHA-256 hashing** using the browser's Web Crypto API to create a document fingerprint.

- **Document verification** using a verification ID and optional file upload.

- **Clear verification outcomes:** `Verified`, `Modified`, and `Unknown`.

- **QR-style verification reference** for the selected document.

- **Verification history** showing sample audit events and lookup methods.

- **Responsive civic-administration interface** designed for desktop and smaller screens.

- **Blockchain-inspired disclosure** that makes the prototype's simulation explicit.

## Demo verification IDs

The verification page includes quick demo buttons for the following sample records:

| Verification ID | Example document | Expected result |
| --- | --- | --- |
| `TD-2026-00482` | Advanced Diploma Certificate | Verified |
| `TD-2026-00480` | Land Ownership Extract | Modified |
| `TD-2026-00000` | Unknown reference | Unknown |

You can also open the verification page directly at `/verify` and enter an ID manually.

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
│   └── main.tsx           # React entry point
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

1. Open the **Upload certificate** view.

1. Choose a PDF, PNG, or JPG file.

1. Enter or update the document details.

1. TrustDoc calculates a SHA-256 fingerprint in the browser.

1. The new record is added to the current prototype session and a success notification is displayed.

### Verify a document

1. Open the **Verify document** view.

1. Enter a verification ID, such as `TD-2026-00482`.

1. Optionally upload the document copy you want to compare.

1. Select **Verify document**.

1. Review the result and the registered hash details.

The prototype's sample records are held in application state, so newly added records are not persisted to a backend database after a full page reload.

## Verification logic

TrustDoc uses a file fingerprint rather than exposing the complete document in the verification record:

```
file bytes → SHA-256 → document fingerprint
```

If the supplied file produces the same fingerprint as the registered file, the prototype can report a match. If the reference exists but the fingerprint differs, it reports a modified document. If no record matches the entered ID, it reports an unknown document.

A matching hash confirms that the supplied file matches the registered file. It does **not**, by itself, prove that the document was originally issued by a legitimate institution. A production system must restrict registration to authorised issuers and protect the registration process.

## Current limitations

This repository is an educational prototype and should not be used to verify real government documents. In particular:

- The ledger is simulated; no real blockchain network is used.

- Records are demonstration data and client-side state is not backed by a database.

- There is no production authentication, authorisation, or role-based access control.

- The QR graphic is a visual prototype and is not currently generated by a QR encoder.

- Files are hashed in the browser but are not uploaded to secure object storage.

- There are no production privacy, encryption-at-rest, backup, revocation, or monitoring controls.

- Dashboard metrics and some history entries are sample presentation data.

## Roadmap

Potential next steps for a production-oriented version include:

- Add a secure backend API and managed database.

- Add issuer authentication and role-based permissions.

- Store files in encrypted object storage and retain only the required metadata and hash references.

- Generate real QR codes that open a public verification URL.

- Add document revocation and expiry workflows.

- Replace the simulated ledger with an auditable permissioned ledger where appropriate.

- Add automated tests, server-side validation, monitoring, and backup procedures.

- Provide an API for universities, employers, and other authorised organisations.

## Academic context

TrustDoc was developed as an Emerging Technologies coursework prototype under the theme **“Emerging Technology for a Smarter Future.”** The project explores practical uses of cryptographic hashing, cloud-ready record management, and blockchain-inspired linked records for document integrity verification.

## Contributors

- **Bhanuka Hewawasam**

- **Semitha Binuk**

## License

No open-source license has been specified for this repository. Unless the repository owner adds a license, all rights remain with the copyright holder.
