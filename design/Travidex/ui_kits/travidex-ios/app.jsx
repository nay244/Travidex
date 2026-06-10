// Travidex UI kit — App controller (navigation + state)
const { useState: useStateApp } = React;

function App() {
  const [screen, setScreen] = useStateApp("welcome");   // welcome | app
  const [tab, setTab] = useStateApp("map");
  const [overlay, setOverlay] = useStateApp(null);       // {kind:'sight',s} | {kind:'success',s,badge}
  const [sightsByCity, setSightsByCity] = useStateApp(() => ({ "JP/Kyoto": KYOTO_SIGHTS.map((s) => ({ ...s })) }));
  const [theme, setTheme] = useStateApp("light");        // light (default) | dark (premium)
  const [premium, setPremium] = useStateApp(false);
  const [appearance, setAppearance] = useStateApp(false);
  const [artOpen, setArtOpen] = useStateApp(false);
  const [profileArtId, setProfileArtId] = useStateApp("trailhead");
  const [profilePage, setProfilePage] = useStateApp(null);  // 'badges' | 'achievements'
  const [achDetail, setAchDetail] = useStateApp(null);
  const [mapSelected, setMapSelected] = useStateApp(null);  // selected sight on Map (enables Log-find FAB)
  const [mapLocation, setMapLocation] = useStateApp({ code: "JP", city: "Kyoto" }); // active Map location
  const [locationOpen, setLocationOpen] = useStateApp(false); // location switcher sheet
  const [regionDex, setRegionDex] = useStateApp(null);      // city object → region dex list

  // progress drives both profile-art unlocks and achievement bars
  const progress = { sights: 62, cities: 2, countries: 3, photos: 11 };

  React.useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);

  // Active Map city's sights (cached per city so finds persist across switches).
  const mapKey = `${mapLocation.code}/${mapLocation.city}`;
  const sights = sightsByCity[mapKey] || [];
  const foundCount = sights.filter((s) => s.found).length;

  // Switch the Map to another city: seed its sights on first visit, then activate.
  function goToLocation(code, city) {
    const k = `${code}/${city}`;
    setSightsByCity((m) => (m[k] ? m : { ...m, [k]: mapSights(code, city) }));
    setMapLocation({ code, city });
    setMapSelected(null);
    setLocationOpen(false);
  }

  function badgeFor(n) {
    if (n >= sights.length) return { name: "City claimer", icon: "trophy" };
    if (n === 4) return { name: "Kyoto explorer", icon: "compass" };
    return null;
  }

  function logFind(s) {
    setSightsByCity((m) => ({ ...m, [mapKey]: (m[mapKey] || []).map((x) => (x.id === s.id ? { ...x, found: true } : x)) }));
    const newCount = sights.filter((x) => x.found || x.id === s.id).length;
    setMapSelected(null);
    setOverlay({ kind: "success", s: { ...s, found: true }, badge: badgeFor(newCount), count: newCount });
  }

  // Stamp action: already-found → "already logged" notice (no progress/badge); else log it.
  function attemptLog(s) {
    if (!s) return;
    if (s.found) { setMapSelected(null); setOverlay({ kind: "success", s, already: true }); }
    else logFind(s);
  }

  function onFind() {
    const next = sights.find((s) => !s.found);
    if (next) logFind(next);
  }

  // base tab content
  let base = null;
  if (tab === "map") base = <MapHome sights={sights} selected={mapSelected} onSelect={setMapSelected} onSight={(s) => setOverlay({ kind: "sight", s })} location={mapLocation} onOpenLocation={() => setLocationOpen(true)} />;
  else if (tab === "explore") base = <ChunkMap countries={COUNTRIES} onCity={(c) => setRegionDex(c)} />;
  else if (tab === "community") base = <Community feed={FEED} friends={FRIENDS} location={mapLocation} />;
  else if (tab === "profile") base = <Profile achievements={ACHIEVEMENTS} badgeYears={BADGE_YEARS} sightsFound={progress.sights} citiesClaimed={progress.cities} countries={progress.countries} theme={theme} premium={premium} artId={profileArtId} onOpenAppearance={() => setAppearance(true)} onOpenArt={() => setArtOpen(true)} onOpenBadges={() => setProfilePage("badges")} onOpenAchievements={() => setProfilePage("achievements")} />;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {screen === "welcome" ? (
        <Welcome onEnter={() => setScreen("app")} />
      ) : (
        <React.Fragment>
          {base}
          <TabBar active={tab} onChange={setTab} onFind={() => attemptLog(mapSelected)} findEnabled={tab === "map" && !!mapSelected} />

          {locationOpen && (
            <LocationPicker
              countries={COUNTRIES}
              location={mapLocation}
              onPick={(code, city) => goToLocation(code, city)}
              onClose={() => setLocationOpen(false)}
            />
          )}

          {regionDex && (
            <RegionDex
              city={regionDex}
              entries={cityEntries(regionDex)}
              onBack={() => setRegionDex(null)}
              onSight={(e) => setOverlay({ kind: "sight", s: e })}
            />
          )}

          {overlay?.kind === "sight" && (
            <SightDetail
              s={overlay.s}
              onBack={() => setOverlay(null)}
              onNavigate={() => {}}
              onLog={(s) => attemptLog(s)}
            />
          )}
          {overlay?.kind === "success" && (
            <FindSuccess
              s={overlay.s}
              foundCount={overlay.count}
              total={sights.length}
              badge={overlay.badge}
              already={overlay.already}
              onView={() => setOverlay({ kind: "sight", s: overlay.s })}
              onDone={() => { setOverlay(null); setTab("map"); }}
            />
          )}

          {appearance && (
            <Appearance
              theme={theme}
              premium={premium}
              onPick={(t) => { setTheme(t); }}
              onUnlock={() => { setPremium(true); setTheme("dark"); }}
              onClose={() => setAppearance(false)}
            />
          )}

          {artOpen && (
            <ProfileArt
              selected={profileArtId}
              progress={progress}
              onPick={(id) => setProfileArtId(id)}
              onClose={() => setArtOpen(false)}
            />
          )}

          {profilePage === "badges" && <BadgesPage years={BADGE_YEARS} onBack={() => setProfilePage(null)} />}
          {profilePage === "achievements" && <AchievementsPage achievements={ACHIEVEMENTS} onBack={() => setProfilePage(null)} onSelect={(a) => setAchDetail(a)} />}
          {achDetail && <AchievementDetail a={achDetail} onClose={() => setAchDetail(null)} />}
        </React.Fragment>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(function Root() {
    const [dark, setDark] = React.useState(false);
    React.useEffect(() => {
      const obs = new MutationObserver(() => setDark(document.documentElement.getAttribute("data-theme") === "dark"));
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => obs.disconnect();
    }, []);
    return React.createElement(window.IOSDevice, { dark, width: 402, height: 874 }, React.createElement(App));
  })
);
