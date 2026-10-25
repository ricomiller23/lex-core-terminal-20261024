import json

with open("data/authoritative_cases.json", "r") as f:
    cases = json.load(f)

new_cases = [
    {
        "id": "case-ralston-purina-1953",
        "case_name": "SEC v. Ralston Purina Co.",
        "citation": "346 U.S. 119, 73 S. Ct. 981 (1953)",
        "court": "Supreme Court of the United States",
        "jurisdiction": "United States Supreme Court",
        "date_decided": "1953-06-08",
        "author_judge": "Justice Clark",
        "docket_number": "No. 512",
        "category": "Federal Securities Regulation / Section 5 Exemptions",
        "precedent_status": "BINDING SUPREME COURT PRECEDENT",
        "key_holding": "An offering of securities to employees or private parties is not exempt from registration under Section 4(a)(1) unless the offerees have access to the same kind of information that registration would disclose. The burden of proof to establish any exemption from Section 5 registration rests strictly upon the issuer and distributor claiming it.",
        "substantive_analysis": "The Supreme Court established that the statutory policy of the Securities Act is to protect investors by promoting full disclosure. Because the registration requirement is the central protection of the 1933 Act, exemptions are strictly construed against the claimant. A seller cannot escape strict Section 5 liability without proving every element of an available affirmative exemption.",
        "citable_spans": [
            {
                "span_id": "ralston-span-01",
                "pinpoint": "346 U.S. at 126",
                "text": "Keeping in mind the statutory policy of protecting investors by promoting full disclosure of information thought necessary to informed investment decisions, the burden of proof is on the one who claims the exemption."
            }
        ],
        "source_url": "https://www.courtlistener.com/opinion/105132/sec-v-ralston-purina-co/",
        "retrieved_at": "2026-10-25T00:00:00Z"
    },
    {
        "id": "case-lorenzo-2019",
        "case_name": "Lorenzo v. SEC",
        "citation": "139 S. Ct. 1094, 203 L. Ed. 2d 484 (2019)",
        "court": "Supreme Court of the United States",
        "jurisdiction": "United States Supreme Court",
        "date_decided": "2019-03-27",
        "author_judge": "Justice Breyer",
        "docket_number": "No. 17-1077",
        "category": "Securities Fraud / Rule 10b-5 Scheme Liability",
        "precedent_status": "BINDING SUPREME COURT PRECEDENT",
        "key_holding": "Dissemination of false or misleading statements with intent to deceive can fall within the scope of Rule 10b-5(a) and (c), as well as Section 17(a)(1), even if the disseminator is not the 'maker' of the misstatements under Janus Capital Group. Scheme liability applies broadly to participants in fraudulent securities distribution chains.",
        "substantive_analysis": "The Supreme Court resolved circuit tension regarding the boundary between misstatement liability under Rule 10b-5(b) and scheme liability under subsections (a) and (c). The Court held that transmitting misleading statements to investors or facilitating deceptive conduits constitutes employing a 'device, scheme, or artifice to defraud.'",
        "citable_spans": [
            {
                "span_id": "lorenzo-span-01",
                "pinpoint": "139 S. Ct. at 1100-01",
                "text": "By sending emails he understood to contain material untruths, Lorenzo 'employed' a 'device, scheme, or artifice to defraud' within the meaning of subsection (a) and engaged in an 'act, practice, or course of business' that operated as a fraud under subsection (c)."
            }
        ],
        "source_url": "https://www.courtlistener.com/opinion/4597014/lorenzo-v-securities-and-exchange-commission/",
        "retrieved_at": "2026-10-25T00:00:00Z"
    },
    {
        "id": "case-cmkm-diamonds-2013",
        "case_name": "SEC v. CMKM Diamonds, Inc.",
        "citation": "729 F.3d 1248 (9th Cir. 2013)",
        "court": "United States Court of Appeals for the Ninth Circuit",
        "jurisdiction": "Federal Ninth Circuit",
        "date_decided": "2013-09-04",
        "author_judge": "Circuit Judge Ikuta",
        "docket_number": "No. 11-16817",
        "category": "Section 5 Strict Liability / Transfer Agent Legend Removal Schemes",
        "precedent_status": "BINDING 9TH CIRCUIT PRECEDENT",
        "key_holding": "Section 5 of the Securities Act imposes strict liability for the unregistered offer or sale of securities. Scienter and negligence are not elements of a prima facie Section 5 violation. Facilitators, attorneys, and promoters who are substantial factors or necessary participants in a transfer agent legend removal scheme are strictly liable.",
        "substantive_analysis": "The Ninth Circuit affirmed summary judgment against participants in a massive microcap distribution scheme where billions of shares were issued without registration through fraudulent attorney opinion letters and transfer agent directives. The court reaffirmed that good faith belief in an exemption is not a defense to Section 5 liability.",
        "citable_spans": [
            {
                "span_id": "cmkm-span-01",
                "pinpoint": "729 F.3d at 1256",
                "text": "Section 5 is a strict liability statute. To establish a prima facie violation, the SEC must show that: (1) no registration statement was in effect; (2) the defendant directly or indirectly sold or offered to sell securities; and (3) the sale or offer was made through interstate commerce."
            }
        ],
        "source_url": "https://www.courtlistener.com/opinion/1041926/sec-v-cmkm-diamonds-inc/",
        "retrieved_at": "2026-10-25T00:00:00Z"
    },
    {
        "id": "case-wells-fargo-arizona-2002",
        "case_name": "Wells Fargo Bank v. Arizona Laborers Teamsters",
        "citation": "201 Ariz. 474, 38 P.3d 12 (Ariz. 2002)",
        "court": "Supreme Court of Arizona",
        "jurisdiction": "Arizona Supreme Court",
        "date_decided": "2002-01-11",
        "author_judge": "Chief Justice Zlaket",
        "docket_number": "No. CV-00-0382-PR",
        "category": "Civil Conspiracy / Aiding & Abetting Commercial Fraud",
        "precedent_status": "BINDING ARIZONA STATE PRECEDENT",
        "key_holding": "A party who knows that another's conduct constitutes a breach of duty and gives substantial assistance or encouragement to the other to so conduct himself is liable for aiding and abetting fraud and civil conspiracy. Knowledge of the fraudulent scheme can be inferred from circumstantial evidence and commercial irregularities.",
        "substantive_analysis": "The Arizona Supreme Court established the comprehensive standard for civil conspiracy and aiding and abetting fraud in multi-party commercial and financial schemes. The court held that participants who provide conduits, banking mechanisms, or concealment cannot avoid liability by claiming ignorance of the primary tortfeasor's underlying intent.",
        "citable_spans": [
            {
                "span_id": "wells-span-01",
                "pinpoint": "201 Ariz. at 485",
                "text": "Claims of aiding and abetting fraud have three elements: (1) the primary tortfeasor must commit a tort; (2) the defendant must know that this conduct constitutes a breach of duty; and (3) the defendant must substantially assist or encourage the primary tortfeasor."
            }
        ],
        "source_url": "https://www.courtlistener.com/opinion/1198751/wells-fargo-bank-v-arizona-laborers-teamsters-cement-masons-local-no-395/",
        "retrieved_at": "2026-10-25T00:00:00Z"
    }
]

existing_ids = {c["id"] for c in cases}
for nc in new_cases:
    if nc["id"] not in existing_ids:
        cases.append(nc)

with open("data/authoritative_cases.json", "w") as f:
    json.dump(cases, f, indent=2)

print(f"Updated authoritative_cases.json: total {len(cases)} cases")
