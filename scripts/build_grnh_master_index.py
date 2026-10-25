import os, json

downloads_folder = "/Users/ericmiller/Downloads/GRNH Forensics & Securities Fraud"
desktop_folder = "/Users/ericmiller/Desktop/Organized/Finance/Investment & Trading"

evidence_list = []
seen_names = set()

# Scan downloads fraud folder first
if os.path.exists(downloads_folder):
    for f in sorted(os.listdir(downloads_folder)):
        if f.startswith(".") or f.startswith("~$"):
            continue
        full_path = os.path.join(downloads_folder, f)
        if os.path.isfile(full_path):
            stat = os.stat(full_path)
            cat = "Litigation Brief / Regulatory Filing" if "Report" in f or "Complaint" in f or "GUIDE" in f or "Audit" in f else "Legal Memo / Opinion"
            evidence_list.append({
                "id": f"grnh-ev-{len(evidence_list)+1:03d}",
                "filename": f,
                "category": cat,
                "path": full_path,
                "size_bytes": stat.st_size,
                "modified_time": stat.st_mtime,
                "provenance": "Downloads/GRNH Forensics & Securities Fraud",
                "source_url": f"file://{full_path}",
                "retrieved_at": "2026-10-24T23:55:00Z"
            })
            seen_names.add(f.lower())

# Scan desktop folders for primary GRNH certificate and account scans
for root_dir in [os.path.join(desktop_folder, "BACKUP/Stocks - GRNH"), os.path.join(desktop_folder, "untitled folder"), os.path.join(desktop_folder, "BACKUP/Accounts - Gaines (IRA)")]:
    if not os.path.exists(root_dir):
        continue
    for root, dirs, files in os.walk(root_dir):
        for f in sorted(files):
            if f.startswith(".") or f.startswith("~$"):
                continue
            low = f.lower()
            if "grnh" in low or ("gaines" in low and ("wire" in low or "check" in low or "cert" in low or "stock" in low or "fedex" in low or "app" in low or "poe" in low or "manning" in low or "adac" in low)):
                if low in seen_names:
                    continue
                seen_names.add(low)
                full_path = os.path.join(root, f)
                try:
                    stat = os.stat(full_path)
                    if "cert" in low or "shares" in low or "mm" in low or "pos" in low:
                        cat = "Stock Certificate & DTC Allocation"
                    elif "wire" in low or "check" in low or "bank" in low or "bbva" in low:
                        cat = "Banking & Wire Transfer Confirmation"
                    elif "app" in low or "broker" in low or "wedbush" in low or "pershing" in low:
                        cat = "Brokerage & Clearance Record"
                    elif "opinion" in low or "req for legal" in low:
                        cat = "Legal Opinion & Legend Removal"
                    else:
                        cat = "Transactional Evidentiary Exhibit"

                    evidence_list.append({
                        "id": f"grnh-ev-{len(evidence_list)+1:03d}",
                        "filename": f,
                        "category": cat,
                        "path": full_path,
                        "size_bytes": stat.st_size,
                        "modified_time": stat.st_mtime,
                        "provenance": os.path.relpath(full_path, "/Users/ericmiller"),
                        "source_url": f"file://{full_path}",
                        "retrieved_at": "2026-10-24T23:55:00Z"
                    })
                except Exception:
                    pass

print(f"Total structured GRNH evidence items: {len(evidence_list)}")
with open("/Users/ericmiller/.gemini/antigravity-ide/scratch/lex-core-terminal-20261024/data/grnh_master_evidence.json", "w") as f:
    json.dump(evidence_list, f, indent=2)
print("Saved data/grnh_master_evidence.json successfully")
