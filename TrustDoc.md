# TrustDoc
## Blockchain-Inspired Government Document Verification System

**Module:** Emerging Technologies  
**Coursework:** Emerging Technology for a Smarter Future  
**Group members:** Bhanuka Hewawasam and Semitha Binuk  
**Index numbers:** Add both index numbers here  
**Class:** HNDSE25.3F / HNDSE26.1F  
**Submission date:** 29 October 2026  

> **Student editing note:** This is a working report draft. Before submission, replace the marked items with your own screenshots, test results, index numbers, references used by your group, and wording based on what you actually did.

## 1. Introduction

Government institutions issue many certificates and official documents. Examples include education certificates, business registrations, land documents, and professional licences. These documents are often used for employment, further education, business activities, and legal work. Therefore, it is important to confirm whether a document is genuine.

At present, a person may need to contact the issuing institution or visit an office to confirm a document. This process can take time. It can also be difficult to identify a document that has been edited after it was issued. TrustDoc is our proposed software solution for this problem.

TrustDoc allows an administrator to register a document and create a digital fingerprint for it. A user can later use a verification ID or QR reference to check the document. The prototype shows whether the record is verified, modified, or unknown.

## 2. Problem identification

The main problem is the slow and difficult verification of government documents. Fake certificates can be used when an organisation does not have a simple way to check them. A genuine document can also be edited, for example by changing a name, date, result, or registration number.

The current manual process has several weaknesses:

- It may require phone calls, emails, or visits to an office.
- The verification process can take several days.
- Different organisations may keep records in separate systems.
- A changed copy of a document may not be easy to identify.
- There may be no clear history of who checked a document and when.

## 3. Aim and objectives

The aim of TrustDoc is to provide a simple digital method for checking the integrity of government documents.

The objectives are to:

1. Register a document with important metadata.
2. Generate a SHA-256 hash from the uploaded file.
3. Create a unique verification reference for each document.
4. Provide a QR-style reference for quick public checking.
5. Compare a document fingerprint with the registered fingerprint.
6. Show clear results for verified, modified, and unknown documents.
7. Keep a verification history for audit purposes.
8. Demonstrate a blockchain-inspired linked ledger in the prototype.

## 4. Proposed solution

TrustDoc has two main parts. The first part is an administrator area. An administrator can upload a certificate, enter details such as the document type and holder name, and register the document. The system creates a hash that represents the original file.

The second part is the verification area. A public user enters a verification ID or uses the QR reference printed on a certificate. The system finds the registered record and compares the document information or hash. The result is shown using a simple status message.

The three main results are:

- **Verified:** The reference is found and the document fingerprint matches the registered fingerprint.
- **Modified:** The reference is known, but the supplied document is different from the original registered version.
- **Unknown:** No registered record is found for the entered reference.

## 5. Emerging technologies used

### 5.1 Blockchain-inspired ledger

Blockchain is relevant because it can provide a linked and difficult-to-change record of transactions. In TrustDoc, a document registration or verification event is represented as a ledger entry. Each entry can contain its own hash and a link to the previous entry hash.

For this coursework prototype, we have not claimed that a real public blockchain network is being used. The ledger is a **blockchain-inspired simulation** created to demonstrate the idea. A production version could use a permissioned blockchain operated by authorised government institutions.

### 5.2 Cloud computing

A real TrustDoc system could use cloud computing to make document records available to authorised institutions and public verification users. Cloud storage and a managed database could support document metadata, hashes, verification events, and access from different locations.

The current prototype mainly demonstrates the user interface and workflow. It uses demonstration records so that the main features can be shown during the presentation. Cloud database and secure file storage would be added for a production implementation.

### 5.3 Cryptographic hashing

A hash is a fixed-length value generated from digital content. The same file should produce the same hash. If the file is changed, the hash should also change. TrustDoc uses SHA-256 hashing in the prototype to create a document fingerprint.

The complete document should not need to be placed in a public ledger. Instead, the system can store the original file in secure storage and store the hash as an integrity reference. During verification, the new hash can be compared with the registered hash.

## 6. System workflow

The proposed workflow is as follows:

1. The administrator signs in to the administration area.
2. The administrator selects a certificate file.
3. The administrator enters document details.
4. TrustDoc calculates the SHA-256 hash.
5. The system creates a verification ID.
6. A ledger-style registration entry is created.
7. The system provides a QR verification reference.
8. A user enters the verification ID or scans the QR reference.
9. TrustDoc checks the registered record.
10. The system displays the result and records the verification event.

## 7. Prototype features

The prototype includes the following screens:

### 7.1 Dashboard

The dashboard shows the number of registered documents, verified records, monthly checks, and records that need attention. It also shows recent documents and a trust-signal panel.

**Add screenshot here:** Dashboard screenshot.

### 7.2 Upload certificate page

This page contains a file selection area and fields for document type, holder name, issue date, and issuing authority. After a file is selected, the prototype calculates a hash and adds a new demonstration record.

**Add screenshot here:** Upload certificate screenshot.

### 7.3 Verify document page

A user can enter a verification ID. The page includes demo buttons for a verified document, a modified document, and an unknown ID. This makes it possible to demonstrate the main outcomes during the five-minute presentation.

**Add screenshot here:** Verification page showing a verified result.

**Add screenshot here:** Verification page showing a modified result.

### 7.4 QR verification reference

Each demonstration certificate has a QR-style visual and a verification ID. In the current prototype, this visual is used to demonstrate the interface and verification flow. A production system should generate a real QR code that opens a public verification URL.

### 7.5 Verification history

The history page shows verification references, document titles, verification methods, outcomes, and approximate verification times. This can help an organisation audit the use of its document records.

**Add screenshot here:** Verification history screenshot.

### 7.6 Simulated ledger disclosure

The application clearly states that the ledger is a blockchain-inspired simulation. This is important because the current prototype does not operate a real blockchain network. The disclosure avoids overstating the technical implementation.

## 8. User interface and design

We used a simple civic administration style. The dark blue navigation area represents trust and public administration. Green is used for successful verification, amber is used for modified records, and red is used for records that need attention. The interface is responsive so that the verification page can also be viewed on a mobile phone.

The main design goal was to make the result understandable to a normal user. Instead of showing only a technical hash, the system displays words such as “Verified”, “Modified”, and “Unknown”. The technical fingerprint and reference are still available for an administrator or technical reviewer.

## 9. Testing and results

The following tests were completed on the prototype. The group should replace the notes with the exact results observed during its own testing.

| Test | Expected result | Actual result | Status |
|---|---|---|---|
| Open dashboard | Dashboard loads with summary cards | Add actual result | Pass / Fail |
| Select a PDF or image | File name is shown and a hash is generated | Add actual result | Pass / Fail |
| Verify TD-2026-00482 | Verified result is shown | Add actual result | Pass / Fail |
| Verify TD-2026-00480 | Modified result is shown | Add actual result | Pass / Fail |
| Verify TD-2026-00000 | Unknown result is shown | Add actual result | Pass / Fail |
| Open history page | Verification records are listed | Add actual result | Pass / Fail |
| Use a mobile-sized screen | Main content remains readable | Add actual result | Pass / Fail |

## 10. Benefits of the proposed solution

TrustDoc can reduce the time needed to check a certificate. It can also reduce the chance of accepting a changed or fake document. A digital verification process can help government institutions, universities, employers, banks, and other organisations.

The system gives users a clear result and gives administrators an audit trail. A cloud-based version can allow authorised organisations to use the system from different locations. The use of hashes also means that the integrity reference can be checked without exposing the complete document in a public ledger.

## 11. Limitations

The current prototype has several limitations. It uses demonstration records and is not yet connected to a production government database. The blockchain ledger is simulated rather than deployed on a real blockchain network. The QR visual is a presentation feature and should be replaced by a real QR encoder in a production version. Strong authentication, role permissions, encryption, backup procedures, privacy controls, and secure file storage would also be required.

Another limitation is that a matching hash proves that a file matches the registered file, but it does not by itself prove that the original document was issued by a real government institution. The issuing institution must control the registration process.

## 12. Future improvements

Future versions could use a real QR code library, a managed cloud database, secure object storage, government identity authentication, role-based permissions, document revocation, email notifications, and a permissioned blockchain network. The system could also provide an API so that universities and employers can verify documents from their own systems.

## 13. Individual contributions

### Bhanuka Hewawasam

Bhanuka worked on problem identification, research about document verification, the proposed system workflow, and the report sections related to the problem and benefits. Bhanuka also participated in testing the verification screens.

### Semitha Binuk

Semitha worked on the interface design, prototype screens, upload and verification flow, and the verification history. Semitha also participated in testing the user interface and preparing the presentation demonstration.

> Edit these contribution paragraphs so they accurately describe the real work completed by each member.

## 14. Conclusion

TrustDoc is a software-based solution for a real problem faced by organisations that need to verify government documents. The prototype combines cryptographic hashing, cloud-ready record management, QR-style verification, and a blockchain-inspired simulated ledger. It demonstrates how emerging technologies can improve speed, transparency, and document integrity.

Although the current version is a student prototype, it shows the main workflow of a future production system. With secure cloud storage, stronger authentication, a real QR encoder, and a permissioned blockchain network, TrustDoc could be developed into a more complete government document verification service.

## References

1. National Institute of Standards and Technology, “Secure Hash Standard (SHS), FIPS PUB 180-4.” Add the URL and access date used by the group.
2. Add the official documentation used for the SHA-256 implementation.
3. Add one reliable source explaining blockchain blocks, hashes, and linked records.
4. Add any source used for cloud storage, document verification, or QR codes.

## Appendix A – Prototype screenshots

Add the dashboard, upload, verification, modified-result, and history screenshots here with short captions.

## Appendix B – Presentation questions to practise

- Why did you select document verification as the problem?
- Why is hashing useful for identifying document changes?
- Is your prototype using a real blockchain network?
- What happens when a document is modified?
- What would you add before using this system in a government office?
- What was your individual contribution?
