// Travidex UI kit — Share a hidden gem (submission flow + moderation guardrails)
// Flow: form (photo REQUIRED + name + why + auto location) → "Submitted for review".
// Moderation model: automated checks at submit, then a review queue; the gem only
// appears publicly once approved. In this prototype the new gem shows "IN REVIEW".
const { useState: useStateSG } = React;

function ShareGem({ location, onSubmit, onClose }) {
  const [photo, setPhoto] = useStateSG(false);
  const [name, setName] = useStateSG("");
  const [note, setNote] = useStateSG("");
  const [sent, setSent] = useStateSG(false);
  const ready = photo && name.trim().length >= 3;

  function submit() {
    onSubmit({ name: name.trim(), note: note.trim() || "—" });
    setSent(true);
  }

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 47, background: "var(--surface-scrim)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface-1)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-sheet)", borderTop: "1px solid var(--border-default)", padding: "10px 20px 30px", maxHeight: "88%", overflowY: "auto" }}>
        <div style={{ width: 38, height: 5, borderRadius: 999, background: "var(--border-strong)", margin: "0 auto 16px" }} />

        {sent ? (
          /* ── submitted state ── */
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "18px 8px 6px" }}>
            <span style={{ width: 84, height: 84, borderRadius: "50%", background: "var(--amber-dim)", boxShadow: "inset 0 0 0 2px var(--amber-line), 0 0 28px var(--amber-glow)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="clock" size={34} color="var(--amber)" />
            </span>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.01em", color: "var(--text-1)", marginTop: 18 }}>Submitted for review</h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-2)", lineHeight: 1.55, marginTop: 10, maxWidth: 300 }}>
              Automated checks passed. A moderator will review your gem before it appears to others — usually within 24 hours. You'll be notified either way.
            </p>
            <div style={{ width: "100%", marginTop: 20 }}>
              <Btn variant="secondary" full onClick={onClose}>Done</Btn>
            </div>
          </div>
        ) : (
          /* ── form ── */
          <React.Fragment>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 21, letterSpacing: "-0.01em", color: "var(--text-1)" }}>Share a hidden gem</h2>
              <Press scale={0.9} onClick={onClose} style={{ width: 34, height: 34, borderRadius: "50%", border: "none", background: "var(--surface-2)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="x" size={18} color="var(--text-2)" />
              </Press>
            </div>

            {/* photo — required */}
            <Press scale={0.99} onClick={() => setPhoto(!photo)} style={{ width: "100%", height: 120, marginTop: 16, borderRadius: "var(--radius-lg)", border: photo ? "1px solid var(--green-line)" : "1.5px dashed var(--border-strong)", background: photo ? "var(--surface-2)" : "transparent", backgroundImage: photo ? "repeating-linear-gradient(135deg, var(--ph-stripe) 0 2px, transparent 2px 11px)" : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7, cursor: "pointer", position: "relative" }}>
              {photo ? (
                <React.Fragment>
                  <span style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "var(--green)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check c="var(--text-on-accent)" w={8} t={2} /></span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", color: "var(--text-3)" }}>photo attached</span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Icon name="camera" size={22} color="var(--text-3)" />
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--text-2)" }}>Add a photo of the spot</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--amber)" }}>required</span>
                </React.Fragment>
              )}
            </Press>

            {/* name + note */}
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name the spot"
              style={{ width: "100%", boxSizing: "border-box", height: 48, padding: "0 14px", marginTop: 12, background: "var(--surface-2)", border: "none", borderRadius: "var(--radius-md)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", outline: "none", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: 15 }} />
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why is it special? What should travelers look for?" rows={3}
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", marginTop: 10, background: "var(--surface-2)", border: "none", borderRadius: "var(--radius-md)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", outline: "none", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.45, resize: "none" }} />

            {/* auto location */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "10px 14px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", boxShadow: "inset 0 0 0 1px var(--border-subtle)" }}>
              <Flag code={location.code} size={20} radius={4} />
              <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-1)" }}>{location.city}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>auto · from map</span>
            </div>

            {/* guidelines / moderation notice */}
            <div style={{ marginTop: 12, padding: "12px 14px", background: "var(--blue-dim)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--blue-line)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="shield-check" size={15} color="var(--blue)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--blue)" }}>Reviewed before it appears</span>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5, marginTop: 7 }}>
                No private property or exact home addresses, unsafe or restricted areas, ads, or off-topic content. Submissions run automated checks, then a moderator approves them.
              </p>
            </div>

            <div style={{ marginTop: 14 }}>
              <Btn variant="primary" full icon="send" disabled={!ready} onClick={submit}>Submit for review</Btn>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ShareGem });
