import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import manifestData from "@/data/downloads_manifest.json";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = (url.searchParams.get("q") || "").toLowerCase();
    const readFilename = url.searchParams.get("file");

    // If requesting full content of a file
    if (readFilename) {
      // 1. Try local filesystem if accessible
      const localPath = path.join("/Users/ericmiller/Downloads", readFilename);
      if (fs.existsSync(localPath)) {
        try {
          const content = fs.readFileSync(localPath, "utf8");
          return NextResponse.json({
            filename: readFilename,
            content,
            source: "Local Downloads Directory",
            retrieved_at: new Date().toISOString()
          }, { headers: corsHeaders });
        } catch (readErr) {
          // fallback to manifest
        }
      }

      // 2. Check manifest
      const item = manifestData.find(m => m.filename.toLowerCase() === readFilename.toLowerCase());
      if (item) {
        return NextResponse.json({
          filename: item.filename,
          content: item.excerpt,
          source: "Downloads Indexed Manifest",
          retrieved_at: item.retrieved_at
        }, { headers: corsHeaders });
      }

      return NextResponse.json({ error: "File not found" }, { status: 404, headers: corsHeaders });
    }

    // Otherwise return listing
    let files = [...manifestData];

    // If local Downloads exists, check for any newly added md/txt files
    const downloadsDir = "/Users/ericmiller/Downloads";
    if (fs.existsSync(downloadsDir)) {
      try {
        const localEntries = fs.readdirSync(downloadsDir);
        localEntries.forEach(entry => {
          if (entry.endsWith(".md") || entry.endsWith(".txt")) {
            if (!files.some(f => f.filename === entry)) {
              try {
                const stat = fs.statSync(path.join(downloadsDir, entry));
                files.push({
                  id: `dl-${entry.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
                  filename: entry,
                  category: entry.includes("REPORT") ? "Regulatory / Audit" : "Workspace Document",
                  size_bytes: stat.size,
                  modified_time: stat.mtimeMs,
                  summary: `Discovered from local Downloads: ${entry}`,
                  excerpt: "Local document available for ingestion.",
                  source_url: `file:///Users/ericmiller/Downloads/${entry}`,
                  retrieved_at: new Date().toISOString()
                });
              } catch (e) {}
            }
          }
        });
      } catch (dirErr) {}
    }

    if (query) {
      files = files.filter(f =>
        f.filename.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query) ||
        f.summary.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      total: files.length,
      files,
      timestamp: new Date().toISOString()
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to list downloads" }, { status: 500, headers: corsHeaders });
  }
}
