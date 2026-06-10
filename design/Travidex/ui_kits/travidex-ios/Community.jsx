// Travidex UI kit — Community: Friends (feed + friends list) · Hidden gems (user-shared off-dex sights, region-specific)
const { useState: useStateComm } = React;

function Community({ feed, friends, location }) {
  const [tabC, setTabC] = useStateComm("friends");
  const [friendsOpen, setFriendsOpen] = useStateComm(false);

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg)" }}>
      <div style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
        <div style={{ padding: `${SAFE_TOP + 10}px 16px ${TAB_H + 20}px` }}>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 27, letterSpacing: "-0.015em", color: "var(--text-1)", marginBottom: 14 }}>Community</h1>
          <Seg options={[{ value: "friends", label: "Friends" }, { value: "gems", label: "Hidden gems" }]} value={tabC} onChange={setTabC} />

          {tabC === "friends" ? (
            <React.Fragment>
              {/* friends list entry */}
              <Press scale={0.99} onClick={() => setFriendsOpen(true)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginTop: 16, background: "var(--surface-1)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ display: "inline-flex" }}>
                  {friends.slice(0, 3).map((f, i) => (
                    <span key={f.id} style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--surface-3)", boxShadow: "0 0 0 2px var(--surface-1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12, color: "var(--text-2)", marginLeft: i ? -8 : 0 }}>{f.name[0]}</span>
                  ))}
                </span>
                <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>Your friends</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--text-3)" }}>{friends.length}</span>
                <Icon name="chevron-right" size={16} color="var(--text-3)" />
              </Press>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
                {feed.map((f) => <FeedCard key={f.id} f={f} />)}
              </div>
            </React.Fragment>
          ) : (
            <GemsTab key={`${location.code}/${location.city}`} location={location} />
          )}
        </div>
      </div>

      {friendsOpen && <FriendsList friends={friends} onBack={() => setFriendsOpen(false)} />}
    </div>
  );
}

/* ── Hidden gems: region-specific sights shared by users, not in the dex ── */
function GemsTab({ location }) {
  const [sort, setSort] = useStateComm("favs"); // favs | new | near
  const [items, setItems] = useStateComm(() => hiddenGems(location.code, location.city));
  const [shareOpen, setShareOpen] = useStateComm(false);

  const sorted = [...items].sort((a, b) =>
    (b.status === "review" ? 1 : 0) - (a.status === "review" ? 1 : 0) ||
    (sort === "favs" ? b.favs - a.favs : sort === "new" ? a.days - b.days : a.distance - b.distance)
  );

  function toggleFav(id) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, faved: !s.faved, favs: s.favs + (s.faved ? -1 : 1) } : s)));
  }
  function report(id) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, reported: !s.reported } : s)));
  }
  function addGem({ name, note }) {
    setItems((prev) => [{ id: Date.now(), name, note, by: "You", distance: 0.1, date: "Just now", days: -1, favs: 0, faved: false, status: "review" }, ...prev]);
  }

  return (
    <React.Fragment>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-3)", lineHeight: 1.45, margin: "14px 2px 0" }}>Hidden gems near <b style={{ color: "var(--text-2)" }}>{location.city}</b> — spotted by travelers, not yet in the dex.</p>

      {/* share + sort */}
      <Press scale={0.98} onClick={() => setShareOpen(true)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 46, marginTop: 12, borderRadius: "var(--radius-pill)", border: "none", background: "var(--amber)", color: "var(--text-on-accent)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, boxShadow: "var(--glow-fab)", cursor: "pointer" }}>
        <Icon name="camera" size={17} color="var(--text-on-accent)" /> Share a hidden gem
      </Press>
      <div style={{ marginTop: 12 }}>
        <Seg options={[{ value: "favs", label: "Most favorited" }, { value: "new", label: "Newest" }, { value: "near", label: "Nearest" }]} value={sort} onChange={setSort} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
        {sorted.map((s) => (
          <article key={s.id} style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--surface-1)", boxShadow: s.status === "review" ? "inset 0 0 0 1px var(--amber-line)" : "inset 0 0 0 1px var(--border-subtle)", opacity: s.reported ? 0.55 : 1 }}>
            <div className="tvx-photo-ph" data-label="gem photo" style={{ height: 118 }} />
            <div style={{ padding: "12px 14px 13px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-1)", lineHeight: 1.25 }}>{s.name}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-3)", marginTop: 4 }}>{s.by} · {s.distance.toFixed(1)} km · {s.date}</p>
                </div>
                {s.status === "review" ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 24, padding: "0 9px", borderRadius: 999, background: "var(--amber-dim)", boxShadow: "inset 0 0 0 1px var(--amber-line)", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--amber)", flexShrink: 0 }}>
                    <Icon name="clock" size={11} color="var(--amber)" /> In review
                  </span>
                ) : (
                  <Press scale={0.88} onClick={() => toggleFav(s.id)} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 10px", borderRadius: "var(--radius-md)", border: "none", background: s.faved ? "var(--amber-dim)" : "var(--surface-2)", boxShadow: s.faved ? "inset 0 0 0 1px var(--amber-line)" : "inset 0 0 0 1px var(--border-subtle)", cursor: "pointer", flexShrink: 0 }}>
                    <Icon name="star" size={16} color={s.faved ? "var(--amber)" : "var(--text-3)"} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: s.faved ? "var(--amber)" : "var(--text-3)" }}>{s.favs}</span>
                  </Press>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-2)", lineHeight: 1.5, marginTop: 8 }}>{s.note}</p>
              {s.status !== "review" && (
                <Press scale={0.92} onClick={() => report(s.id)} style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 9, padding: 0, border: "none", background: "none", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: s.reported ? "var(--danger)" : "var(--text-3)" }}>
                  <Icon name="flag" size={11} color={s.reported ? "var(--danger)" : "var(--text-3)"} /> {s.reported ? "Reported · under review" : "Report"}
                </Press>
              )}
            </div>
          </article>
        ))}
      </div>

      {shareOpen && <ShareGem location={location} onSubmit={addGem} onClose={() => setShareOpen(false)} />}
    </React.Fragment>
  );
}

/* ── Friends list page ── */
function FriendsList({ friends, onBack }) {
  const [q, setQ] = useStateComm("");
  const list = friends.filter((f) => !q || f.name.toLowerCase().includes(q.toLowerCase()) || f.handle.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 46, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <header style={{ flex: "none", display: "flex", alignItems: "center", height: 52, padding: `${SAFE_TOP - 8}px 8px 0`, background: "var(--surface-overlay)", backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))", borderBottom: "1px solid var(--border-subtle)", boxSizing: "content-box" }}>
        <Press scale={0.9} onClick={onBack} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="chevron-left" size={22} color="var(--text-1)" />
        </Press>
        <h1 style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: "var(--text-1)" }}>Friends</h1>
        <span style={{ width: 40 }} />
      </header>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 46, padding: "0 14px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", boxShadow: "inset 0 0 0 1px var(--border-subtle)" }}>
          <Icon name="search" size={16} color="var(--text-3)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search friends" style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: 15 }} />
        </div>

        <Press scale={0.99} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginTop: 12, background: "var(--surface-1)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--green-line)", border: "none", cursor: "pointer", textAlign: "left" }}>
          <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--green-dim)", boxShadow: "inset 0 0 0 1px var(--green-line)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="user-plus" size={17} color="var(--green)" />
          </span>
          <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>Add a friend</span>
          <Icon name="chevron-right" size={16} color="var(--text-3)" />
        </Press>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", margin: "16px 4px 8px" }}>{list.length} friends</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {list.map((f) => (
            <Press key={f.id} scale={0.99} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface-1)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ width: 42, height: 42, flex: "none", borderRadius: "50%", background: "var(--surface-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-2)" }}>{f.name.split(" ").map((w) => w[0]).join("")}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>{f.name} <span style={{ fontWeight: 400, color: "var(--text-3)", fontSize: 13 }}>{f.handle}</span></p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-3)", marginTop: 3 }}>{f.recent}</p>
              </div>
              <div style={{ textAlign: "right", flex: "none" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--green)" }}>{f.sights}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", marginTop: 2 }}>sights</p>
              </div>
            </Press>
          ))}
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
