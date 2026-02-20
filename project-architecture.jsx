import { useState } from "react";

const COLORS = {
  page:      { bg: "#dbeafe", border: "#3b82f6", text: "#1e40af" },
  component: { bg: "#dcfce7", border: "#22c55e", text: "#15803d" },
  action:    { bg: "#fef9c3", border: "#eab308", text: "#854d0e" },
  db:        { bg: "#fce7f3", border: "#ec4899", text: "#9d174d" },
  ui:        { bg: "#f3e8ff", border: "#a855f7", text: "#6b21a8" },
  config:    { bg: "#e0f2fe", border: "#0ea5e9", text: "#0369a1" },
  folder:    { bg: "#f1f5f9", border: "#94a3b8", text: "#334155" },
};

const Badge = ({ label, color }) => (
  <span style={{
    background: color.bg,
    border: `1px solid ${color.border}`,
    color: color.text,
    borderRadius: 6,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
  }}>{label}</span>
);

const Box = ({ label, sub, color, children, style = {} }) => (
  <div style={{
    background: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: 10,
    padding: "10px 14px",
    minWidth: 150,
    ...style,
  }}>
    <div style={{ fontWeight: 700, color: color.text, fontSize: 13 }}>{label}</div>
    {sub && <div style={{ color: color.text, opacity: 0.75, fontSize: 11, marginTop: 2 }}>{sub}</div>}
    {children}
  </div>
);

const Arrow = ({ label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, margin: "0 4px" }}>
    {label && <span style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>{label}</span>}
    <span style={{ fontSize: 20, color: "#94a3b8" }}>→</span>
  </div>
);

const DownArrow = ({ label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "4px 0" }}>
    <span style={{ fontSize: 20, color: "#94a3b8" }}>↓</span>
    {label && <span style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>{label}</span>}
  </div>
);

// ─── TAB 1: Folder Tree ──────────────────────────────────────────────────────

const FileNode = ({ icon, name, tag, color, indent = 0 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: indent * 20, padding: `3px 8px 3px ${indent * 20 + 8}px` }}>
    <span style={{ fontSize: 14 }}>{icon}</span>
    <span style={{ fontSize: 13, color: "#1e293b", fontFamily: "monospace" }}>{name}</span>
    {tag && color && <Badge label={tag} color={color} />}
  </div>
);

const FolderNode = ({ name, children, indent = 0 }) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: indent * 20 + 8, cursor: "pointer", padding: `4px 8px 4px ${indent * 20 + 8}px`, background: open ? "#f8fafc" : "transparent", borderRadius: 6 }}
      >
        <span style={{ fontSize: 14 }}>{open ? "📂" : "📁"}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#334155", fontFamily: "monospace" }}>{name}/</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{open ? "▾" : "▸"}</span>
      </div>
      {open && <div style={{ borderLeft: "2px solid #e2e8f0", marginLeft: indent * 20 + 20 }}>{children}</div>}
    </div>
  );
};

function FolderTree() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: "#0f172a" }}>📁 Project Folder Structure</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
        Click any folder to collapse it. Colors show what role each file plays.
      </p>
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 16, fontFamily: "monospace" }}>
        <FileNode icon="📦" name="match-up" tag="root" color={COLORS.folder} />
        <div style={{ borderLeft: "2px solid #e2e8f0", marginLeft: 20 }}>

          <FolderNode name="app" indent={0}>
            <FileNode icon="📄" name="layout.tsx" tag="Layout" color={COLORS.page} indent={1} />
            <FileNode icon="🎨" name="globals.css" tag="Styles" color={COLORS.config} indent={1} />
            <FileNode icon="🏠" name="page.tsx" tag="Page · /" color={COLORS.page} indent={1} />
            <FolderNode name="matches" indent={1}>
              <FolderNode name="new" indent={2}>
                <FileNode icon="📝" name="page.tsx" tag="Page · /matches/new" color={COLORS.page} indent={3} />
              </FolderNode>
            </FolderNode>
            <FolderNode name="players" indent={1}>
              <FolderNode name="[id]" indent={2}>
                <FileNode icon="👤" name="page.tsx" tag="Page · /players/:id" color={COLORS.page} indent={3} />
              </FolderNode>
            </FolderNode>
            <FolderNode name="preview" indent={1}>
              <FileNode icon="👁️" name="page.tsx" tag="Page · /preview" color={COLORS.page} indent={2} />
            </FolderNode>
          </FolderNode>

          <FolderNode name="components" indent={0}>
            <FileNode icon="⚙️" name="add-player-dialog.tsx" tag="Component" color={COLORS.component} indent={1} />
            <FileNode icon="⚙️" name="delete-player-button.tsx" tag="Component" color={COLORS.component} indent={1} />
            <FileNode icon="⚙️" name="ladder-group.tsx" tag="Component" color={COLORS.component} indent={1} />
            <FileNode icon="⚙️" name="match-form.tsx" tag="Component" color={COLORS.component} indent={1} />
            <FileNode icon="⚙️" name="match-table.tsx" tag="Component" color={COLORS.component} indent={1} />
            <FolderNode name="ui" indent={1}>
              <FileNode icon="🎛️" name="button.tsx" tag="shadcn/ui" color={COLORS.ui} indent={2} />
              <FileNode icon="🎛️" name="card.tsx" tag="shadcn/ui" color={COLORS.ui} indent={2} />
              <FileNode icon="🎛️" name="dialog.tsx" tag="shadcn/ui" color={COLORS.ui} indent={2} />
              <FileNode icon="🎛️" name="dropdown-menu.tsx" tag="shadcn/ui" color={COLORS.ui} indent={2} />
              <FileNode icon="🎛️" name="input.tsx" tag="shadcn/ui" color={COLORS.ui} indent={2} />
              <FileNode icon="🎛️" name="label.tsx" tag="shadcn/ui" color={COLORS.ui} indent={2} />
              <FileNode icon="🎛️" name="select.tsx" tag="shadcn/ui" color={COLORS.ui} indent={2} />
              <FileNode icon="🎛️" name="table.tsx" tag="shadcn/ui" color={COLORS.ui} indent={2} />
            </FolderNode>
          </FolderNode>

          <FolderNode name="lib" indent={0}>
            <FileNode icon="⚡" name="actions.ts" tag="Server Actions" color={COLORS.action} indent={1} />
            <FileNode icon="🔧" name="utils.ts" tag="Utility" color={COLORS.config} indent={1} />
          </FolderNode>

          <FolderNode name="db" indent={0}>
            <FileNode icon="🔌" name="index.ts" tag="DB Connection" color={COLORS.db} indent={1} />
            <FileNode icon="📐" name="schema.ts" tag="DB Schema" color={COLORS.db} indent={1} />
          </FolderNode>

          <FolderNode name="drizzle" indent={0}>
            <FileNode icon="🗃️" name="(migrations)" tag="SQL migrations" color={COLORS.db} indent={1} />
          </FolderNode>

          <div style={{ marginTop: 4 }}>
            <FileNode icon="⚙️" name="drizzle.config.ts" tag="ORM Config" color={COLORS.config} indent={0} />
            <FileNode icon="⚙️" name="next.config.js" tag="Next.js Config" color={COLORS.config} indent={0} />
            <FileNode icon="⚙️" name="tailwind.config.ts" tag="Styling Config" color={COLORS.config} indent={0} />
            <FileNode icon="📋" name="package.json" tag="Dependencies" color={COLORS.config} indent={0} />
            <FileNode icon="🔒" name=".env.local" tag="Secrets" color={COLORS.config} indent={0} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TAB 2: Pages & Components ──────────────────────────────────────────────

const PageCard = ({ route, file, icon, components, actions, description }) => (
  <div style={{ background: "#fff", border: `2px solid ${COLORS.page.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: 700, color: COLORS.page.text, fontSize: 16 }}>{route}</div>
        <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>{file}</div>
      </div>
    </div>
    <div style={{ fontSize: 13, color: "#475569", marginBottom: 12 }}>{description}</div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#334155", minWidth: 90 }}>Components:</span>
      {components.map(c => <Badge key={c} label={c} color={COLORS.component} />)}
    </div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#334155", minWidth: 90 }}>Server Actions:</span>
      {actions.map(a => <Badge key={a} label={a} color={COLORS.action} />)}
    </div>
  </div>
);

function PagesView() {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#0f172a" }}>📄 Pages & Their Components</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Each page (route) in the app, what it renders, and which server actions it calls.</p>

      <PageCard
        icon="🏠" route="/ — Ladder Standings" file="app/page.tsx"
        description="The homepage. Fetches the full ladder, groups players by win-loss record, and displays them ranked by wins."
        components={["LadderGroup", "AddPlayerDialog", "Button"]}
        actions={["getLadder()"]}
      />
      <PageCard
        icon="📝" route="/matches/new — Submit Match" file="app/matches/new/page.tsx"
        description="Form to enter a completed match result (set scores for 2 or 3 sets). Validates tennis scoring rules before submitting."
        components={["MatchForm", "Button", "Input", "Select", "Label"]}
        actions={["getPlayers()", "submitMatch()"]}
      />
      <PageCard
        icon="👤" route="/players/[id] — Player Profile" file="app/players/[id]/page.tsx"
        description="Individual player page showing their record, win %, total matches, and full match history. Includes delete option."
        components={["MatchTable", "DeletePlayerButton", "Card", "Button"]}
        actions={["getPlayerWithMatches()", "getLadder()", "deleteMatch()", "deletePlayer()"]}
      />
      <PageCard
        icon="👁️" route="/preview — Mock Preview" file="app/preview/page.tsx"
        description="A static design preview page using hardcoded mock data. Great for showing someone what the app looks like without real data."
        components={["LadderGroup", "Button"]}
        actions={["(none — uses mock data)"]}
      />

      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, marginTop: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#334155", marginBottom: 8 }}>🗂️ app/layout.tsx — Root Layout (wraps every page)</div>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
          Sets the page <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: 4 }}>&lt;html&gt;</code> and <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: 4 }}>&lt;body&gt;</code> tags, applies
          the <strong>globals.css</strong> stylesheet, sets the browser tab title ("Hit Deep Practice Standings"), and wraps all page content in a centered container.
          Every route inherits from this file.
        </p>
      </div>
    </div>
  );
}

// ─── TAB 3: Data Flow ────────────────────────────────────────────────────────

function DataFlow() {
  const layers = [
    {
      label: "🌐 Browser (Client)",
      color: COLORS.page,
      items: [
        { name: "User visits a page / clicks a button", note: "HTTP request or client event" },
      ],
    },
    {
      label: "📄 Next.js Pages (Server Components)",
      color: COLORS.page,
      items: [
        { name: "app/page.tsx", note: "calls getLadder()" },
        { name: "app/matches/new/page.tsx", note: "calls getPlayers()" },
        { name: "app/players/[id]/page.tsx", note: "calls getPlayerWithMatches() + getLadder()" },
      ],
    },
    {
      label: "⚡ lib/actions.ts (Server Actions)",
      color: COLORS.action,
      items: [
        { name: "getLadder()", note: "Reads all players + matches, computes win/loss" },
        { name: "getPlayers()", note: "Returns all players alphabetically" },
        { name: "getPlayerWithMatches(id)", note: "Player + full match history with opponent names" },
        { name: "createPlayer(name)", note: "INSERT player, revalidate /" },
        { name: "deletePlayer(id)", note: "DELETE player + their matches, revalidate /" },
        { name: "submitMatch(data)", note: "Auto-calculates winner, INSERT match, revalidate pages" },
        { name: "deleteMatch(id)", note: "DELETE match, revalidate affected player pages" },
      ],
    },
    {
      label: "🔌 db/index.ts (Drizzle ORM + postgres.js)",
      color: COLORS.db,
      items: [
        { name: "db.select() / db.insert() / db.delete()", note: "Type-safe SQL via Drizzle ORM" },
        { name: "DATABASE_URL from .env.local", note: "PostgreSQL connection string" },
      ],
    },
    {
      label: "🗄️ PostgreSQL Database",
      color: COLORS.db,
      items: [
        { name: "players table", note: "id, name (unique), created_at" },
        { name: "matches table", note: "id, player1_id, player2_id, set scores (6 cols), winner_id, created_at" },
      ],
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#0f172a" }}>🔄 Data Flow — How a Request Travels</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Trace the path from a user action all the way down to the database and back up.</p>

      {layers.map((layer, i) => (
        <div key={layer.label}>
          <div style={{
            background: layer.color.bg,
            border: `2px solid ${layer.color.border}`,
            borderRadius: 10,
            padding: "12px 16px",
          }}>
            <div style={{ fontWeight: 700, color: layer.color.text, fontSize: 14, marginBottom: 8 }}>{layer.label}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {layer.items.map(item => (
                <div key={item.name} style={{
                  background: "rgba(255,255,255,0.7)",
                  border: `1px solid ${layer.color.border}`,
                  borderRadius: 8,
                  padding: "6px 10px",
                  minWidth: 180,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: layer.color.text, fontFamily: "monospace" }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{item.note}</div>
                </div>
              ))}
            </div>
          </div>
          {i < layers.length - 1 && (
            <div style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 2, height: 16, background: "#cbd5e1" }} />
                <span style={{ fontSize: 16, color: "#94a3b8" }}>▼</span>
                <div style={{ width: 2, height: 8, background: "#cbd5e1" }} />
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop: 20, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#334155", marginBottom: 8 }}>🔁 After a Write (create/submit/delete)</div>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
          After any mutation, the action calls Next.js's <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: 4 }}>revalidatePath()</code> to invalidate
          the cached HTML for affected pages. This means the next visit to <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: 4 }}>/</code> or <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: 4 }}>/players/[id]</code> will
          re-run the server component and fetch fresh data from the database — keeping the standings always up to date.
        </p>
      </div>
    </div>
  );
}

// ─── TAB 4: Database Schema ──────────────────────────────────────────────────

function SchemaView() {
  const playersFields = [
    { name: "id", type: "serial PRIMARY KEY", note: "Auto-increment unique ID" },
    { name: "name", type: "text NOT NULL UNIQUE", note: "Player's display name — must be unique" },
    { name: "created_at", type: "timestamp DEFAULT now()", note: "When the player was added" },
  ];
  const matchesFields = [
    { name: "id", type: "serial PRIMARY KEY", note: "Auto-increment unique ID" },
    { name: "player1_id", type: "integer → players.id", note: "Foreign key: the first player" },
    { name: "player2_id", type: "integer → players.id", note: "Foreign key: the second player" },
    { name: "set1_p1", type: "integer NOT NULL", note: "Player 1's games in Set 1" },
    { name: "set1_p2", type: "integer NOT NULL", note: "Player 2's games in Set 1" },
    { name: "set2_p1", type: "integer NOT NULL", note: "Player 1's games in Set 2" },
    { name: "set2_p2", type: "integer NOT NULL", note: "Player 2's games in Set 2" },
    { name: "set3_p1", type: "integer (nullable)", note: "Player 1's points in Set 3 tiebreaker (if needed)" },
    { name: "set3_p2", type: "integer (nullable)", note: "Player 2's points in Set 3 tiebreaker (if needed)" },
    { name: "winner_id", type: "integer → players.id", note: "Foreign key: auto-calculated winner" },
    { name: "created_at", type: "timestamp DEFAULT now()", note: "When the match was recorded" },
  ];

  const TableView = ({ title, icon, color, fields }) => (
    <div style={{ background: "#fff", border: `2px solid ${color.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ background: color.bg, padding: "10px 16px", borderBottom: `1px solid ${color.border}` }}>
        <span style={{ fontSize: 16, marginRight: 8 }}>{icon}</span>
        <span style={{ fontWeight: 700, color: color.text, fontSize: 15, fontFamily: "monospace" }}>{title}</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            <th style={{ textAlign: "left", padding: "8px 14px", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0", width: "22%" }}>Column</th>
            <th style={{ textAlign: "left", padding: "8px 14px", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0", width: "32%" }}>Type / Constraint</th>
            <th style={{ textAlign: "left", padding: "8px 14px", color: "#64748b", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>What it stores</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f, i) => (
            <tr key={f.name} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
              <td style={{ padding: "7px 14px", fontFamily: "monospace", fontWeight: 600, color: color.text, borderBottom: "1px solid #f1f5f9" }}>{f.name}</td>
              <td style={{ padding: "7px 14px", fontFamily: "monospace", fontSize: 12, color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{f.type}</td>
              <td style={{ padding: "7px 14px", color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{f.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#0f172a" }}>🗄️ Database Schema</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
        Two tables in PostgreSQL, managed by <strong>Drizzle ORM</strong>. The schema lives in <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: 4 }}>db/schema.ts</code>.
      </p>

      <TableView title="players" icon="👥" color={COLORS.component} fields={playersFields} />
      <TableView title="matches" icon="🎾" color={COLORS.action} fields={matchesFields} />

      <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#15803d", marginBottom: 6 }}>🔗 How the tables relate</div>
        <p style={{ fontSize: 13, color: "#166534", margin: 0 }}>
          <strong>players</strong> ← <strong>matches.player1_id</strong> and <strong>matches.player2_id</strong> and <strong>matches.winner_id</strong>.
          Deleting a player also deletes all their matches (handled manually in <code style={{ background: "rgba(255,255,255,0.6)", padding: "1px 4px", borderRadius: 4 }}>deletePlayer()</code> in actions.ts).
          The winner is auto-calculated by counting sets won — whoever wins 2 of 3 sets wins the match.
        </p>
      </div>
    </div>
  );
}

// ─── TAB 5: Tech Stack ───────────────────────────────────────────────────────

function TechStack() {
  const stack = [
    { emoji: "▲", name: "Next.js 14", role: "Framework", note: "App Router with Server Components. Pages are rendered on the server by default; only interactive components use 'use client'." },
    { emoji: "🔷", name: "TypeScript", role: "Language", note: "Strict types throughout — DB schema types (Player, Match) are inferred directly from the Drizzle table definitions." },
    { emoji: "🐉", name: "Drizzle ORM", role: "Database ORM", note: "Type-safe SQL queries. Schema defined in code, migrations generated with `npm run db:generate`." },
    { emoji: "🐘", name: "PostgreSQL", role: "Database", note: "Stores all players and match results. Connected via the DATABASE_URL in .env.local using postgres.js." },
    { emoji: "🎨", name: "Tailwind CSS", role: "Styling", note: "Utility-first CSS. All styles are inline class names — no separate CSS files except globals.css." },
    { emoji: "🧩", name: "shadcn/ui", role: "Component Library", note: "Pre-built accessible components (Button, Card, Dialog, Select, etc.) living in components/ui/. Built on Radix UI primitives." },
    { emoji: "🔮", name: "Radix UI", role: "UI Primitives", note: "The headless accessibility layer under shadcn/ui — handles focus traps, ARIA roles, keyboard nav in dialogs and dropdowns." },
    { emoji: "✨", name: "lucide-react", role: "Icons", note: "Icon library used in components (e.g., trash/delete icons)." },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#0f172a" }}>🛠️ Tech Stack</h2>
      <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Every major library in the project and the job it does.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {stack.map(item => (
          <div key={item.name} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{item.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{item.name}</div>
                <Badge label={item.role} color={COLORS.config} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LEGEND ─────────────────────────────────────────────────────────────────

const Legend = () => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", alignSelf: "center" }}>Legend:</span>
    {[
      ["Page/Route", COLORS.page],
      ["Component", COLORS.component],
      ["Server Action", COLORS.action],
      ["Database", COLORS.db],
      ["shadcn/ui", COLORS.ui],
      ["Config", COLORS.config],
    ].map(([label, color]) => (
      <Badge key={label} label={label} color={color} />
    ))}
  </div>
);

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "tree",   label: "📁 Folder Tree" },
  { id: "pages",  label: "📄 Pages & Components" },
  { id: "flow",   label: "🔄 Data Flow" },
  { id: "schema", label: "🗄️ Database Schema" },
  { id: "tech",   label: "🛠️ Tech Stack" },
];

export default function App() {
  const [tab, setTab] = useState("tree");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 860, margin: "0 auto", padding: 20, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>🎾 Match-Up — Project Architecture</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
          A tennis ladder standings app built with Next.js 14, Drizzle ORM, and PostgreSQL.
        </p>
      </div>

      <Legend />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: tab === t.id ? "2px solid #3b82f6" : "2px solid #e2e8f0",
              background: tab === t.id ? "#dbeafe" : "#fff",
              color: tab === t.id ? "#1e40af" : "#475569",
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {tab === "tree"   && <FolderTree />}
        {tab === "pages"  && <PagesView />}
        {tab === "flow"   && <DataFlow />}
        {tab === "schema" && <SchemaView />}
        {tab === "tech"   && <TechStack />}
      </div>
    </div>
  );
}
