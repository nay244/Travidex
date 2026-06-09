import React from "react";

/**
 * FindFeedItem — a community feed entry: "[user] found [sight] · date",
 * with avatar, optional photo thumb, and like/comment counts.
 * Pass `avatar` and `thumb` nodes (or use the built-in placeholders).
 */
export function FindFeedItem({ user, sight, city, date, avatar = null, thumb, liked = false, likes = 0, comments = 0, onClick, onLike, style }) {
  return (
    <article
      style={{
        display: "flex", gap: 12, padding: "12px", borderRadius: "var(--radius-lg)",
        background: "var(--surface-1)", boxShadow: "inset 0 0 0 1px var(--border-subtle)",
        ...style,
      }}
    >
      {avatar || (
        <span style={{ width: 38, height: 38, flex: "none", borderRadius: "50%", background: "var(--surface-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-2)" }}>
          {(user || "?").slice(0, 1).toUpperCase()}
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <button type="button" onClick={onClick} style={{ display: "block", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer", width: "100%" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-2)", lineHeight: 1.35 }}>
            <span style={{ fontWeight: 600, color: "var(--text-1)" }}>{user}</span>
            {" found "}
            <span style={{ fontWeight: 600, color: "var(--green)" }}>{sight}</span>
            {city && <span style={{ color: "var(--text-3)" }}>{" in "}{city}</span>}
          </p>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", color: "var(--text-3)", textTransform: "uppercase" }}>{date}</span>
        </button>

        {thumb !== undefined && (
          <div style={{
            marginTop: 10, height: 132, borderRadius: "var(--radius-md)", overflow: "hidden",
            background: "var(--surface-2)",
            backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 11px)",
          }}>
            {thumb && <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
          </div>
        )}

        <div style={{ display: "flex", gap: 18, marginTop: 11 }}>
          <button type="button" onClick={onLike} style={metaBtn(liked ? "var(--green)" : "var(--text-3)")}>
            <Heart filled={liked} /> {likes}
          </button>
          <span style={metaBtn("var(--text-3)")}><Bubble /> {comments}</span>
        </div>
      </div>
    </article>
  );
}

function metaBtn(color) {
  return {
    display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0,
    fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color, cursor: "pointer",
  };
}
function Heart({ filled }) {
  return <span style={{ fontSize: 13, lineHeight: 1 }}>{filled ? "♥" : "♡"}</span>;
}
function Bubble() {
  return <span style={{ width: 13, height: 11, border: "2px solid currentColor", borderRadius: 4, display: "inline-block" }} />;
}
