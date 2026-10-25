import json, os

with open("data/downloads_manifest.json", "r") as f:
    manifest = json.load(f)

grnh_entries = [
    {
        "id": "dl-ira-gaines-grnh-master-package-md",
        "filename": "IRA_GAINES_GRNH_SECURITIES_LITIGATION_MASTER_PACKAGE.md",
        "category": "Litigation Master Package / Trial Brief",
        "size_bytes": os.path.getsize("/Users/ericmiller/Downloads/IRA_GAINES_GRNH_SECURITIES_LITIGATION_MASTER_PACKAGE.md"),
        "modified_time": os.path.getmtime("/Users/ericmiller/Downloads/IRA_GAINES_GRNH_SECURITIES_LITIGATION_MASTER_PACKAGE.md"),
        "summary": "Comprehensive Trial Counsel Litigation Manual regarding civil securities fraud, Section 5 strict liability (107,361,209 shares), Scheme Liability under Lorenzo, deposition scripts, and UVTA clawback against Ira Jeffrey Gaines and conduits.",
        "excerpt": open("/Users/ericmiller/Downloads/IRA_GAINES_GRNH_SECURITIES_LITIGATION_MASTER_PACKAGE.md").read()[:6000],
        "source_url": "file:///Users/ericmiller/Downloads/IRA_GAINES_GRNH_SECURITIES_LITIGATION_MASTER_PACKAGE.md",
        "retrieved_at": "2026-10-25T00:00:00Z"
    },
    {
        "id": "dl-grnh-lawyer-guide-highway-map-md",
        "filename": "LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md",
        "category": "Litigation Highway Map / Fraud Conduits",
        "size_bytes": os.path.getsize("/Users/ericmiller/Downloads/GRNH Forensics & Securities Fraud/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md"),
        "modified_time": os.path.getmtime("/Users/ericmiller/Downloads/GRNH Forensics & Securities Fraud/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md"),
        "summary": "Detailed breakdown of the 6 Fraud On-Ramps, 4 Laundering Interchanges, and 4 Retail Exit Off-Ramps tracking 107.3M GreenGro shares through Casa de Dinero, Big Thunder, and Paula Marie Poe.",
        "excerpt": open("/Users/ericmiller/Downloads/GRNH Forensics & Securities Fraud/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md").read()[:6000],
        "source_url": "file:///Users/ericmiller/Downloads/GRNH Forensics & Securities Fraud/LAWYER_GUIDE_AND_HIGHWAY_MAP_OF_GRNH_FRAUD.md",
        "retrieved_at": "2026-10-25T00:00:00Z"
    },
    {
        "id": "dl-grnh-forensic-audit-brief-md",
        "filename": "GRNH_Forensic_Securities_Audit_Brief.md",
        "category": "Forensic Ledger / Banking Receipts",
        "size_bytes": os.path.getsize("/Users/ericmiller/Downloads/GRNH Forensics & Securities Fraud/GRNH_Forensic_Securities_Audit_Brief.md"),
        "modified_time": os.path.getmtime("/Users/ericmiller/Downloads/GRNH Forensics & Securities Fraud/GRNH_Forensic_Securities_Audit_Brief.md"),
        "summary": "38-transaction forensic ledger cross-referencing stock certificates CS1-7750 through CS1-8172 against BBVA Compass wire confirmations and Wedbush brokerage deposits.",
        "excerpt": open("/Users/ericmiller/Downloads/GRNH Forensics & Securities Fraud/GRNH_Forensic_Securities_Audit_Brief.md").read()[:6000],
        "source_url": "file:///Users/ericmiller/Downloads/GRNH Forensics & Securities Fraud/GRNH_Forensic_Securities_Audit_Brief.md",
        "retrieved_at": "2026-10-25T00:00:00Z"
    }
]

existing_ids = {m["id"] for m in manifest}
for ge in grnh_entries:
    if ge["id"] not in existing_ids:
        manifest.append(ge)

with open("data/downloads_manifest.json", "w") as f:
    json.dump(manifest, f, indent=2)

print(f"Updated downloads_manifest.json: total {len(manifest)} items")
