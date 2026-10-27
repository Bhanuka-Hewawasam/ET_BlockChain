import { useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Check,
  ChevronRight,
  ClipboardCheck,
  Cloud,
  Copy,
  FileCheck2,
  FilePlus2,
  Fingerprint,
  History,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  QrCode,
  Search,
  ShieldCheck,
  UploadCloud,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

type DocStatus = "Verified" | "Modified" | "Unknown";
type DocumentRecord = {
  id: string;
  title: string;
  holder: string;
  type: string;
  issued: string;
  hash: string;
  fullHash?: string;
  status: DocStatus;
  verified: string;
};

const initialDocs: DocumentRecord[] = [
  { id: "TD-2026-00482", title: "Advanced Diploma Certificate", holder: "Nethmi Perera", type: "Education", issued: "18 Sep 2026", hash: "a98c...e210", fullHash: "a98c1f3b7d2e4a6c8f0b1d3e5a7c9f0b1d3e5a7c9f0b1d3e5a7c9f0b1d3e210", status: "Verified", verified: "Today, 09:42" },
  { id: "TD-2026-00481", title: "Business Registration", holder: "Lanka Harvest (Pvt) Ltd", type: "Business", issued: "12 Sep 2026", hash: "7bf2...91ad", fullHash: "7bf2a1c3d5e7f9b1a3c5d7e9f1b3a5c7d9e1f3b5a7c9d1e3f5b7a9c1d3e591ad", status: "Verified", verified: "Today, 08:18" },
  { id: "TD-2026-00480", title: "Land Ownership Extract", holder: "Kavindu Fernando", type: "Land & property", issued: "10 Sep 2026", hash: "31aa...c09f", fullHash: "31aab2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6c09f", status: "Modified", verified: "Yesterday, 16:05" },
  { id: "TD-2026-00479", title: "Professional License", holder: "Dr. S. Jayawardena", type: "Professional", issued: "06 Sep 2026", hash: "0f4d...2a98", fullHash: "0f4d1e2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d2a98", status: "Verified", verified: "Yesterday, 14:32" },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/" },
  { label: "Upload certificate", icon: FilePlus2, path: "/upload" },
  { label: "Verify document", icon: ShieldCheck, path: "/verify" },
  { label: "Verification history", icon: History, path: "/history" },
];

function shortHash(input: string) {
  return `${input.slice(0, 4)}...${input.slice(-4)}`;
}

function StatusBadge({ status }: { status: DocStatus }) {
  const styles = {
    Verified: "status verified",
    Modified: "status modified",
    Unknown: "status unknown",
  };
  return <span className={styles[status]}><span className="status-dot" />{status}</span>;
}

function QrVisual({ value }: { value: string }) {
  const cells = useMemo(() => Array.from({ length: 81 }, (_, index) => {
    const finder = (x: number, y: number) => (x < 7 && y < 7) || (x > 7 && y < 7) || (x < 7 && y > 7);
    const x = index % 9;
    const y = Math.floor(index / 9);
    return finder(x, y) ? ((x === 0 || x === 6 || y === 0 || y === 6 || (x > 1 && x < 5 && y > 1 && y < 5)) ? 1 : 0) : ((value.charCodeAt(index % value.length) + index * 7) % 3 === 0 ? 1 : 0);
  }), [value]);
  return <div className="qr-code" aria-label="QR verification code">{cells.map((cell, index) => <span key={index} className={cell ? "qr-on" : "qr-off"} />)}</div>;
}

export default function Home() {
  const [location, navigate] = useLocation();
  const [docs, setDocs] = useState(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState(initialDocs[0]);
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState<DocumentRecord | null>(null);
  const [verifyFile, setVerifyFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const verifyFileRef = useRef<HTMLInputElement>(null);

  const active = location === "/" ? "Overview" : navItems.find(item => item.path === location)?.label ?? "Overview";
  const verifiedCount = docs.filter(doc => doc.status === "Verified").length;
  const modifiedCount = docs.filter(doc => doc.status === "Modified").length;

  const hashFile = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", buffer);
    return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    const hash = await hashFile(file).catch(() => `demo-${Date.now().toString(16)}-hash`);
    window.setTimeout(() => {
      const newDoc: DocumentRecord = {
        id: `TD-2026-${String(483 + docs.length - initialDocs.length).padStart(5, "0")}`,
        title: file.name.replace(/\.[^/.]+$/, "") || "New Government Certificate",
        holder: "Demo certificate holder",
        type: "New registration",
        issued: "25 Oct 2026",
        hash: shortHash(hash),
        fullHash: hash,
        status: "Verified",
        verified: "Just now",
      };
      setDocs(current => [newDoc, ...current]);
      setSelectedDoc(newDoc);
      setUploading(false);
      toast.success("Certificate registered", { description: "SHA-256 hash created and ledger entry added." });
    }, 700);
  };

  const runVerification = async (id: string) => {
    const trimmedId = id.trim();
    const record = docs.find(doc => doc.id.toLowerCase() === trimmedId.toLowerCase());

    // Case 1: ID එක database එකේ නැහැ → Unknown
    if (!record) {
      setVerifyResult({
        id: trimmedId || "UNKNOWN",
        title: "No matching record",
        holder: "—",
        type: "—",
        issued: "—",
        hash: "—",
        status: "Unknown",
        verified: "Just now",
      });
      toast.error("Unknown document", { description: "No record found for this ID." });
      return;
    }

    // Case 2: ID තියෙනවා, file එකක් නැහැ → record එක පෙන්වනවා (ID lookup only)
    if (!verifyFile) {
      setVerifyResult(record);
      toast.info("Record found", { description: "Upload the file to confirm integrity." });
      return;
    }

    // Case 3: Hash comparison කරනවා
    setVerifying(true);
    try {
      const uploadedHash = await hashFile(verifyFile);
      const isMatch = uploadedHash === record.fullHash;

      setVerifyResult({
        ...record,
        status: isMatch ? "Verified" : "Modified",
        verified: "Just now",
      });

      if (isMatch) {
        toast.success("Document is authentic", { description: "Hash matches the registered original." });
      } else {
        toast.error("Document has been modified", { description: "The file's fingerprint does not match." });
      }
    } catch {
      toast.error("Verification failed", { description: "Could not read the uploaded file." });
    } finally {
      setVerifying(false);
    }
  };

  const copyId = () => {
    navigator.clipboard?.writeText(selectedDoc.id);
    toast.success("Verification ID copied");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <div className="brand-lockup"><div className="brand-mark"><LockKeyhole size={18} /></div><div><strong>TrustDoc</strong><span>PUBLIC RECORDS / 01</span></div></div>
        <div className="workspace-label">ADMIN WORKSPACE</div>
        <nav>{navItems.map(item => <Link key={item.path} href={item.path} onClick={() => setMobileNav(false)} className={`nav-item ${active === item.label ? "active" : ""}`}><item.icon size={17} /><span>{item.label}</span>{active === item.label && <ChevronRight className="nav-chevron" size={15} />}</Link>)}</nav>
        <div className="sidebar-bottom"><div className="ledger-card"><div className="eyebrow"><Blocks size={14} /> LEDGER STATUS</div><strong>Simulation active</strong><span>Hash-linked audit trail</span><div className="ledger-line"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="user-card"><div className="avatar">AR</div><div><strong>Amara Raj</strong><span>Records administrator</span></div><span className="online-dot" /></div></div>
      </aside>
      {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
      <main className="main-content">
        <header className="topbar"><button className="menu-button" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div className="breadcrumb"><span>TrustDoc</span><ChevronRight size={14} /><strong>{active}</strong></div><div className="topbar-actions"><span className="secure-pill"><span className="pulse" /> Secure session</span><button className="icon-button"><Search size={18} /></button><div className="avatar small">AR</div></div></header>
        <div className="page-wrap">
          <section className="page-heading"><div><p className="eyebrow accent">FRIDAY, 25 OCTOBER 2026</p><h1>{active === "Overview" ? <>Good morning, Amara<span className="heading-period">.</span></> : active}</h1><p className="subheading">{active === "Overview" ? "A clear record of what has been issued, checked, and changed." : active === "Upload certificate" ? "Register a certificate and create its evidence trail." : active === "Verify document" ? "Check a government document against its registered fingerprint." : "Every verification attempt, in one auditable place."}</p></div><div className="heading-actions"><button className="button secondary" onClick={() => navigate("/verify")}><QrCode size={16} /> Scan / verify</button><button className="button primary" onClick={() => navigate("/upload")}><UploadCloud size={16} /> Upload document</button></div></section>

          {active === "Overview" && <>
            <section className="stat-grid"><div className="stat-card"><div className="stat-icon blue"><FileCheck2 size={18} /></div><span className="stat-label">Registered documents</span><strong>{docs.length.toString().padStart(2, "0")}</strong><span className="stat-note up">↗ 12.4% <em>vs last month</em></span></div><div className="stat-card"><div className="stat-icon green"><BadgeCheck size={18} /></div><span className="stat-label">Verified records</span><strong>{verifiedCount.toString().padStart(2, "0")}</strong><span className="stat-note up">↗ 8.2% <em>vs last month</em></span></div><div className="stat-card"><div className="stat-icon amber"><ClipboardCheck size={18} /></div><span className="stat-label">Checks this month</span><strong>186</strong><span className="stat-note up">↗ 21.8% <em>vs last month</em></span></div><div className="stat-card"><div className="stat-icon red"><Fingerprint size={18} /></div><span className="stat-label">Attention needed</span><strong>{modifiedCount.toString().padStart(2, "0")}</strong><span className="stat-note down">↗ Review required</span></div></section>
            <section className="dashboard-grid"><div className="panel recent-panel"><div className="panel-head"><div><p className="eyebrow">LIVE REGISTER</p><h2>Recent documents</h2></div><Link href="/history" className="text-link">View full history <ArrowUpRight size={14} /></Link></div><div className="table-wrap"><table><thead><tr><th>DOCUMENT</th><th>HOLDER</th><th>ISSUED</th><th>STATUS</th><th /></tr></thead><tbody>{docs.slice(0, 4).map(doc => <tr key={doc.id} onClick={() => { setSelectedDoc(doc); navigate("/verify"); }}><td><div className="doc-cell"><div className="doc-icon"><FileCheck2 size={16} /></div><div><strong>{doc.title}</strong><span>{doc.id}</span></div></div></td><td>{doc.holder}</td><td>{doc.issued}</td><td><StatusBadge status={doc.status} /></td><td><ChevronRight size={16} className="row-arrow" /></td></tr>)}</tbody></table></div></div><div className="panel trust-panel"><div className="panel-head"><div><p className="eyebrow">INTEGRITY LAYER</p><h2>Trust signals</h2></div><ShieldCheck className="panel-head-icon" size={20} /></div><div className="trust-score"><div className="score-ring"><strong>98</strong><span>/100</span></div><div><strong>Healthy register</strong><p>All active records have a linked hash and audit trail.</p></div></div><div className="signal-list"><div><span className="signal-dot mint" /> Hash integrity <strong>100%</strong></div><div><span className="signal-dot blue-dot" /> Ledger continuity <strong>100%</strong></div><div><span className="signal-dot amber-dot" /> Pending review <strong>{modifiedCount} record</strong></div></div><div className="disclosure"><Blocks size={15} /><span><strong>Blockchain-inspired prototype</strong> — ledger entries are simulated for demonstration.</span></div></div></section>
          </>}

          {active === "Upload certificate" && <section className="content-grid"><div className="panel form-panel"><div className="panel-head"><div><p className="eyebrow">NEW REGISTRATION</p><h2>Add a certificate</h2></div><FilePlus2 className="panel-head-icon" size={20} /></div><div className="upload-zone" onClick={() => fileRef.current?.click()}><input ref={fileRef} type="file" hidden accept=".pdf,.png,.jpg,.jpeg" onChange={event => handleFile(event.target.files?.[0])} />{uploading ? <div className="spinner" /> : <div className="upload-icon"><UploadCloud size={23} /></div>}<strong>{uploading ? "Creating evidence trail..." : fileName || "Drop a document here"}</strong><span>{uploading ? "Calculating SHA-256 fingerprint" : "PDF, PNG or JPG up to 10 MB"}</span><button className="button secondary small" type="button">Browse files</button></div><div className="form-divider"><span>DOCUMENT DETAILS</span></div><div className="form-grid"><label>Document type<select defaultValue="Advanced Diploma"><option>Advanced Diploma</option><option>Business Registration</option><option>Land Ownership Extract</option><option>Professional License</option></select></label><label>Holder name<input defaultValue="Demo certificate holder" /></label><label>Issue date<input type="date" defaultValue="2026-10-25" /></label><label>Issuing authority<input defaultValue="Department of Examinations" /></label></div><button className="button primary wide" onClick={() => fileRef.current?.click()}><Fingerprint size={16} /> Select file & generate hash</button></div><div className="panel explainer-panel"><div className="mini-icon mint-bg"><Fingerprint size={18} /></div><h3>What happens next?</h3><p>TrustDoc generates a unique SHA-256 fingerprint for the original file. The fingerprint, not the private document content, becomes the integrity reference.</p><div className="step-list"><div><b>01</b><span><strong>Hash</strong> Create a digital fingerprint.</span></div><div><b>02</b><span><strong>Register</strong> Link the record to a ledger entry.</span></div><div><b>03</b><span><strong>Verify</strong> Share a public QR reference.</span></div></div></div></section>}

          {active === "Verify document" && <section className="content-grid verify-layout">
            <div className="panel verify-panel">
              <div className="panel-head"><div><p className="eyebrow">PUBLIC CHECK</p><h2>Verify a document</h2></div><ShieldCheck className="panel-head-icon" size={20} /></div>
              <p className="panel-intro">Enter the unique verification ID and upload the document file to compare its fingerprint with the registered record.</p>
              <div className="verify-input">
                <Search size={18} />
                <input value={verifyId} onChange={event => setVerifyId(event.target.value)} placeholder="e.g. TD-2026-00482" onKeyDown={event => event.key === "Enter" && runVerification(verifyId)} />
                <button className="button primary" onClick={() => runVerification(verifyId)} disabled={verifying}>{verifying ? "Verifying..." : "Verify now"}</button>
              </div>

              <div className="upload-zone compact" onClick={() => verifyFileRef.current?.click()} style={{ marginTop: "1rem", cursor: "pointer" }}>
                <input ref={verifyFileRef} type="file" hidden accept=".pdf,.png,.jpg,.jpeg" onChange={event => setVerifyFile(event.target.files?.[0] ?? null)} />
                <div className="upload-icon"><UploadCloud size={20} /></div>
                <strong>{verifyFile?.name ?? "Upload the document to compare"}</strong>
                <span>{verifyFile ? "Ready for hash comparison" : "Optional — needed to detect modifications"}</span>
                {verifyFile && (
                  <button
                    className="button secondary small"
                    type="button"
                    onClick={event => { event.stopPropagation(); setVerifyFile(null); if (verifyFileRef.current) verifyFileRef.current.value = ""; }}
                  >
                    Remove file
                  </button>
                )}
              </div>

              <div className="demo-hint"><span>Try a demo</span><button onClick={() => { setVerifyId("TD-2026-00482"); runVerification("TD-2026-00482"); }}>Verified document</button><button onClick={() => { setVerifyId("TD-2026-00480"); runVerification("TD-2026-00480"); }}>Modified document</button><button onClick={() => { setVerifyId("TD-2026-00000"); runVerification("TD-2026-00000"); }}>Unknown ID</button></div>

              {verifyResult ? <div className={`result-card ${verifyResult.status.toLowerCase()}`}>
                <div className="result-top">
                  <div className="result-symbol">{verifyResult.status === "Verified" ? <Check size={25} /> : <XCircle size={25} />}</div>
                  <div>
                    <span className="eyebrow">VERIFICATION RESULT</span>
                    <h3>{verifyResult.status === "Verified" ? "Document is authentic" : verifyResult.status === "Modified" ? "Document has been modified" : "Document not recognised"}</h3>
                    <p>{verifyResult.status === "Verified" ? "The uploaded file's fingerprint matches the registered original." : verifyResult.status === "Modified" ? "The ID is registered, but the uploaded file's fingerprint does not match the original." : "No record exists for the supplied verification ID."}</p>
                  </div>
                </div>
                <div className="result-meta">
                  <div><span>REFERENCE</span><strong>{verifyResult.id}</strong></div>
                  <div><span>HOLDER</span><strong>{verifyResult.holder}</strong></div>
                  <div><span>REGISTERED HASH</span><strong>{verifyResult.hash}</strong></div>
                </div>
                <div className="result-footer"><span><span className="status-dot" /> Checked just now</span><button className="text-link" onClick={copyId}><Copy size={14} /> Copy reference</button></div>
              </div> : <div className="empty-result"><QrCode size={25} /><strong>Awaiting a document reference</strong><span>A verification result will appear here with the matching evidence trail.</span></div>}
            </div>
            <div className="panel qr-panel"><p className="eyebrow">QR REFERENCE</p><h2>{selectedDoc.id}</h2><QrVisual value={selectedDoc.id} /><strong>Scan to verify publicly</strong><span className="qr-caption">This visual represents the QR destination encoded on the certificate.</span><button className="button secondary wide" onClick={copyId}><Copy size={15} /> Copy verification ID</button></div>
          </section>}

          {active === "Verification history" && <section className="panel history-panel"><div className="panel-head"><div><p className="eyebrow">AUDIT TRAIL</p><h2>Verification history</h2></div><div className="history-filter">All outcomes <ChevronRight size={14} /></div></div><div className="history-list">{[...docs, ...docs.slice(0, 2)].map((doc, index) => <div className="history-row" key={`${doc.id}-${index}`}><div className={`history-icon ${doc.status.toLowerCase()}`}>{doc.status === "Verified" ? <Check size={17} /> : <X size={17} />}</div><div className="history-main"><strong>{doc.id}</strong><span>{doc.title} · {index % 2 ? "QR scan" : "ID lookup"}</span></div><StatusBadge status={doc.status} /><div className="history-time">{index === 0 ? "Just now" : doc.verified}</div><ChevronRight size={16} className="row-arrow" /></div>)}</div></section>}
        </div>
      </main>
    </div>
  );
}