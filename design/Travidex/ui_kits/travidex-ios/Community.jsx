// Travidex UI kit — Community finds feed
const { useState: useStateComm } = React;

function Community({ feed }) {
  const [filter, setFilter] = useStateComm("global");
  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg)", overflowY: "auto" }}>
      <div style={{ padding: `${SAFE_TOP + 10}px 16px ${TAB_H + 20}px` }}>
        <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 27, letterSpacing: "-0.015em", color: "var(--text-1)", marginBottom: 14 }}>Community</h1>
        <Seg options={[{ value: "friends", label: "Friends" }, { value: "global", label: "Global" }, { value: "nearby", label: "Nearby" }]} value={filter} onChange={setFilter} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {feed.map((f) => <FeedCard key={f.id} f={f} />)}
        </div>
      </div>
    </div>
  );
}

function FeedCard({ f }) {
  const [liked, setLiked] = useStateComm(f.liked);
  const [likes, setLikes] = useStateComm(f.likes);
  return (
    <article style={{ display: "flex", gap: 12, padding: 12, borderRadius: "var(--radius-lg)", background: "var(--surface-1)", boxShadow: "inset 0 0 0 1px var(--border-subtle)" }}>
      <span style={{ width: 38, height: 38, flex: "none", borderRadius: "50%", background: "var(--surface-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-2)" }}>{f.user[0]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-2)", lineHeight: 1.35 }}>
          <b style={{ color: "var(--text-1)" }}>{f.user}</b> found <b style={{ color: "var(--green)" }}>{f.sight}</b> <span style={{ color: "var(--text-3)" }}>in {f.city}</span>
        </p>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-3)" }}>{f.date}</span>
        <div className="tvx-photo-ph" data-label="" style={{ height: 128, marginTop: 10, borderRadius: "var(--radius-md)" }} />
        <div style={{ display: "flex", gap: 18, marginTop: 11 }}>
          <Press scale={0.9} onClick={() => { setLiked(!liked); setLikes(likes + (liked ? -1 : 1)); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: liked ? "var(--green)" : "var(--text-3)" }}>
            <Icon name="heart" size={15} color={liked ? "var(--green)" : "var(--text-3)"} /> {likes}
          </Press>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--text-3)" }}>
            <Icon name="message-circle" size={15} color="var(--text-3)" /> {f.comments}
          </span>
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { Community });
