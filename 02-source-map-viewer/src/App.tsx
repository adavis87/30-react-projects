import { useState } from "react";
import { SourceMapConsumer } from "source-map";
import "./App.css";

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.readAsText(file);
  });
}

function simpleLineDiff(a: string, b: string) {
  const aLines = a.split(/\r?\n/);
  const bLines = b.split(/\r?\n/);
  const max = Math.max(aLines.length, bLines.length);
  const rows = [] as { i: number; aLine: string; bLine: string; equal: boolean }[];
  for (let i = 0; i < max; i++) {
    const aLine = aLines[i] ?? "";
    const bLine = bLines[i] ?? "";
    rows.push({ i: i + 1, aLine, bLine, equal: aLine === bLine });
  }
  return rows;
}

export default function App() {
  const [sourceMapJson, setSourceMapJson] = useState<any | null>(null);
  const [uploadedOriginalText, setUploadedOriginalText] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedSourceContent, setSelectedSourceContent] = useState<string | null>(null);
  const [diffRows, setDiffRows] = useState<ReturnType<typeof simpleLineDiff> | null>(null);
  const [genLine, setGenLine] = useState<number | null>(null);
  const [genColumn, setGenColumn] = useState<number | null>(null);
  const [lookupResult, setLookupResult] = useState<any | null>(null);

  async function handleSourceMapFile(f?: File) {
    if (!f) return;
    try {
      const txt = await readFileAsText(f);
      const parsed = JSON.parse(txt);
      setSourceMapJson(parsed);
      // pick first source if sourcesContent available
      if (parsed.sourcesContent && Array.isArray(parsed.sourcesContent) && parsed.sources?.length) {
        const firstIndex = 0;
        const src = parsed.sources[firstIndex];
        const content = parsed.sourcesContent[firstIndex] ?? null;
        setSelectedSource(src ?? null);
        setSelectedSourceContent(content);
        if (content && uploadedOriginalText !== null) {
          setDiffRows(simpleLineDiff(content, uploadedOriginalText));
        }
      } else {
        setSelectedSource(null);
        setSelectedSourceContent(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to read/parse source map JSON.");
    }
  }

  async function handleOriginalFile(f?: File) {
    if (!f) return;
    try {
      const txt = await readFileAsText(f);
      setUploadedOriginalText(txt);
      // if we already have selected source content, compute diff
      if (selectedSourceContent) {
        setDiffRows(simpleLineDiff(selectedSourceContent, txt));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to read original file.");
    }
  }

  async function inspectMappings() {
    if (!sourceMapJson) {
      alert("Load a source map first.");
      return;
    }
    // Use SourceMapConsumer to demonstrate mapping lookup for a sample generated position.
    try {
      // source-map-js typings may not include `with`; cast to any to call it safely
      const SMC: any = SourceMapConsumer as any;
      await SMC.with(sourceMapJson, null, (consumer: any) => {
        // take a sample: first mapping returned by each generated position if available
        const mappings: Array<{ generatedLine: number; generatedColumn: number; source?: string; originalLine?: number; originalColumn?: number; name?: string }> = [];
        // iterate over generated mappings
        consumer.eachMapping((m: any) => {
          // collect a few (limit 20)
          if (mappings.length < 20) {
            mappings.push({
              generatedLine: m.generatedLine,
              generatedColumn: m.generatedColumn,
              source: m.source,
              originalLine: m.originalLine ?? undefined,
              originalColumn: m.originalColumn ?? undefined,
              name: m.name ?? undefined,
            });
          }
        });
        console.log("sample mappings:", mappings);
        alert(`Logged ${mappings.length} sample mappings to console.`);
      });
    } catch (err) {
      console.error(err);
      alert("Failed to inspect mappings (see console).");
    }
  }

  async function lookupOriginalPosition() {
    if (!sourceMapJson) {
      alert("Load a source map first.");
      return;
    }
    if (!genLine || genLine <= 0) {
      alert("Enter a valid generated line (1-based).");
      return;
    }

    try {
      const SMC: any = SourceMapConsumer as any;
      await SMC.with(sourceMapJson, null, (consumer: any) => {
        const pos = consumer.originalPositionFor({ line: Number(genLine), column: genColumn ? Number(genColumn) : 0 });
        setLookupResult(pos ?? null);
        // if the original source is available in sourcesContent, open it
        if (pos && pos.source && sourceMapJson.sources && sourceMapJson.sourcesContent) {
          const idx = sourceMapJson.sources.indexOf(pos.source);
          if (idx >= 0) {
            setSelectedSource(pos.source);
            setSelectedSourceContent(sourceMapJson.sourcesContent?.[idx] ?? null);
            // optional: compute a diff with uploaded original if present
            if (uploadedOriginalText && sourceMapJson.sourcesContent?.[idx]) {
              setDiffRows(simpleLineDiff(sourceMapJson.sourcesContent[idx], uploadedOriginalText));
            }
          }
        }
      });
    } catch (err) {
      console.error(err);
      alert("Lookup failed (see console).");
    }
  }

  return (
    <div className="app-root">
      <h1>Source Map Viewer</h1>

      <section className="uploader">
        <label>
          Load source map (*.map):
          <input
            type="file"
            accept="application/json,.map"
            onChange={(e) => handleSourceMapFile(e.target.files?.[0])}
          />
        </label>

        <label>
          (Optional) Load original source file to compare:
          <input type="file" accept="text/*" onChange={(e) => handleOriginalFile(e.target.files?.[0])} />
        </label>

        <div style={{ marginTop: 8 }}>
          <button onClick={inspectMappings} disabled={!sourceMapJson}>
            Inspect sample mappings
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Lookup original position from generated position:
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="number"
              placeholder="generated line"
              value={genLine ?? ""}
              onChange={(e) => setGenLine(e.target.value ? Number(e.target.value) : null)}
              style={{ width: 120 }}
            />
            <input
              type="number"
              placeholder="generated column"
              value={genColumn ?? ""}
              onChange={(e) => setGenColumn(e.target.value ? Number(e.target.value) : null)}
              style={{ width: 140 }}
            />
            <button onClick={lookupOriginalPosition} disabled={!sourceMapJson}>
              Lookup
            </button>
          </div>
          {lookupResult ? (
            <div style={{ marginTop: 8, background: "#f3f7ff", padding: 8 }}>
              <div><strong>Original source:</strong> {String(lookupResult.source ?? "(none)")}</div>
              <div><strong>Line:</strong> {String(lookupResult.line ?? "(none)")}</div>
              <div><strong>Column:</strong> {String(lookupResult.column ?? "(none)")}</div>
              <div><strong>Name:</strong> {String(lookupResult.name ?? "(none)")}</div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="info">
        <h2>Source map summary</h2>
        {sourceMapJson ? (
          <div>
            <div>file: {String(sourceMapJson.file ?? "(none)")}</div>
            <div>version: {String(sourceMapJson.version ?? "?")}</div>
            <div>sources: {Array.isArray(sourceMapJson.sources) ? sourceMapJson.sources.length : 0}</div>
            <div>sourcesContent: {Array.isArray(sourceMapJson.sourcesContent) ? sourceMapJson.sourcesContent.length : 0}</div>
            {Array.isArray(sourceMapJson.sources) && (
              <div style={{ marginTop: 8 }}>
                <label>
                  Select source:
                  <select
                    value={selectedSource ?? ""}
                    onChange={(e) => {
                      const src = e.target.value || null;
                      setSelectedSource(src);
                      if (src && sourceMapJson.sources && sourceMapJson.sourcesContent) {
                        const idx = sourceMapJson.sources.indexOf(src);
                        setSelectedSourceContent(sourceMapJson.sourcesContent?.[idx] ?? null);
                        if (uploadedOriginalText) {
                          setDiffRows(simpleLineDiff(sourceMapJson.sourcesContent?.[idx] ?? "", uploadedOriginalText));
                        }
                      } else {
                        setSelectedSourceContent(null);
                        setDiffRows(null);
                      }
                    }}
                  >
                    <option value="">(choose)</option>
                    {sourceMapJson.sources.map((s: string) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>
        ) : (
          <div>No source map loaded.</div>
        )}
      </section>

      <section className="compare">
        <h2>Comparison</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h3>From source map</h3>
            <pre style={{ whiteSpace: "pre-wrap", maxHeight: 400, overflow: "auto", background: "#f7f7f7", padding: 8, color: 'black' }}>
              {selectedSourceContent ?? "(no content available)"}
            </pre>
          </div>
          <div style={{ flex: 1 }}>
            <h3>Uploaded original</h3>
            <pre style={{ whiteSpace: "pre-wrap", maxHeight: 400, overflow: "auto", background: "#f7f7f7", padding: 8, color: 'black' }}>
              {uploadedOriginalText ?? "(no original uploaded)"}
            </pre>
          </div>
        </div>

        {diffRows ? (
          <div style={{ marginTop: 12 }}>
            <h4>Line-by-line comparison</h4>
            <div style={{ maxHeight: 300, overflow: "auto", border: "1px solid #ddd" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>From map</th>
                    <th>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {diffRows.map((r) => (
                    <tr key={r.i} style={{ background: r.equal ? undefined : "#fff4f0" }}>
                      <td style={{ verticalAlign: "top", padding: 6 }}>{r.i}</td>
                      <td style={{ whiteSpace: "pre-wrap", padding: 6 }}>{r.aLine}</td>
                      <td style={{ whiteSpace: "pre-wrap", padding: 6 }}>{r.bLine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 12 }}>No comparison available.</div>
        )}
      </section>
    </div>
  );
}
