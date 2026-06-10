// Travidex UI kit — CSS flag assets.
// Reusable, theme-safe country flags drawn with CSS (no images). Recognizable at
// small sizes; used on the Welcome collector's board and available anywhere a flag
// is needed (Explore pill, country picker, etc.).
//
//   <Flag code="JP" />            → fills its (positioned) parent
//   <Flag code="FR" size={28} radius={4} />  → fixed-size box
//
// Spec DSL (compact):
//   ['v', [colors]]              vertical equal stripes (left→right)
//   ['h', [colors]]              horizontal equal stripes (top→bottom)
//   ['vu', [[color, weight]...]] vertical unequal stripes
//   ['hu', [[color, weight]...]] horizontal unequal stripes
//   ['circle', bg, dot, pct]     centered disc (Japan, Bangladesh)
//   ['nordic', bg, cross, inner] off-center Scandinavian cross (+ optional inner)
//   ['plus', bg, cross]          centered cross (Switzerland)

const FLAGS = {
  JP: { name: "Japan",         spec: ["circle", "#ffffff", "#BC002D", 42] },
  BD: { name: "Bangladesh",    spec: ["circle", "#006A4E", "#F42A41", 40] },
  FR: { name: "France",        spec: ["v", ["#0055A4", "#ffffff", "#EF4135"]] },
  IT: { name: "Italy",         spec: ["v", ["#009246", "#ffffff", "#CE2B37"]] },
  IE: { name: "Ireland",       spec: ["v", ["#169B62", "#ffffff", "#FF883E"]] },
  BE: { name: "Belgium",       spec: ["v", ["#000000", "#FAE042", "#ED2939"]] },
  RO: { name: "Romania",       spec: ["v", ["#002B7F", "#FCD116", "#CE1126"]] },
  DE: { name: "Germany",       spec: ["h", ["#000000", "#DD0000", "#FFCE00"]] },
  NL: { name: "Netherlands",   spec: ["h", ["#AE1C28", "#ffffff", "#21468B"]] },
  RU: { name: "Russia",        spec: ["h", ["#ffffff", "#0039A6", "#D52B1E"]] },
  HU: { name: "Hungary",       spec: ["h", ["#CE2939", "#ffffff", "#477050"]] },
  ID: { name: "Indonesia",     spec: ["h", ["#FF0000", "#ffffff"]] },
  PL: { name: "Poland",        spec: ["h", ["#ffffff", "#DC143C"]] },
  UA: { name: "Ukraine",       spec: ["h", ["#0057B7", "#FFD700"]] },
  AT: { name: "Austria",       spec: ["h", ["#ED2939", "#ffffff", "#ED2939"]] },
  LT: { name: "Lithuania",     spec: ["h", ["#FDB913", "#006A44", "#C1272D"]] },
  ES: { name: "Spain",         spec: ["hu", [["#AA151B", 1], ["#F1BF00", 2], ["#AA151B", 1]]] },
  TH: { name: "Thailand",      spec: ["hu", [["#A51931", 1], ["#F4F5F8", 1], ["#2D2A4A", 2], ["#F4F5F8", 1], ["#A51931", 1]]] },
  PT: { name: "Portugal",      spec: ["vu", [["#006600", 2], ["#FF0000", 3]]] },
  SE: { name: "Sweden",        spec: ["nordic", "#006AA7", "#FECC00"] },
  DK: { name: "Denmark",       spec: ["nordic", "#C8102E", "#ffffff"] },
  FI: { name: "Finland",       spec: ["nordic", "#ffffff", "#003580"] },
  NO: { name: "Norway",        spec: ["nordic", "#BA0C2F", "#ffffff", "#00205B"] },
  CH: { name: "Switzerland",   spec: ["plus", "#D52B1E", "#ffffff"] },
  US: { name: "United States", spec: ["usa"] },
};

function stripeBg(dir, parts) {
  const total = parts.reduce((a, p) => a + p[1], 0);
  let acc = 0;
  const stops = parts.map(([c, w]) => {
    const start = (acc / total) * 100; acc += w; const end = (acc / total) * 100;
    return `${c} ${start}% ${end}%`;
  });
  return `linear-gradient(${dir === "h" ? "180deg" : "90deg"}, ${stops.join(", ")})`;
}

function flagInner(spec) {
  const fill = { position: "absolute", inset: 0 };
  const kind = spec[0];
  if (kind === "v" || kind === "h") return <div style={{ ...fill, background: stripeBg(kind, spec[1].map((c) => [c, 1])) }} />;
  if (kind === "vu" || kind === "hu") return <div style={{ ...fill, background: stripeBg(kind === "hu" ? "h" : "v", spec[1]) }} />;
  if (kind === "circle") {
    const [, bg, dot, pct] = spec;
    return <div style={{ ...fill, background: bg }}><div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: `${pct}%`, aspectRatio: "1", borderRadius: "50%", background: dot }} /></div>;
  }
  if (kind === "nordic") {
    const [, bg, cross, inner] = spec;
    return (
      <div style={{ ...fill, background: bg }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "30%", width: "16%", background: cross }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "42%", height: "16%", background: cross }} />
        {inner && <React.Fragment>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "34%", width: "8%", background: inner }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: "46%", height: "8%", background: inner }} />
        </React.Fragment>}
      </div>
    );
  }
  if (kind === "plus") {
    const [, bg, cross] = spec;
    return (
      <div style={{ ...fill, background: bg }}>
        <div style={{ position: "absolute", top: "18%", bottom: "18%", left: "40%", width: "20%", background: cross }} />
        <div style={{ position: "absolute", left: "18%", right: "18%", top: "40%", height: "20%", background: cross }} />
      </div>
    );
  }
  if (kind === "usa") {
    // 13 stripes (red first/last) + blue canton with a simplified star grid
    const stripes = "repeating-linear-gradient(180deg, #B22234 0 7.6923%, #ffffff 7.6923% 15.3846%)";
    const stars = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) {
      if ((r + c) % 2 !== 0) continue; // staggered
      stars.push(<span key={`${r}-${c}`} style={{ position: "absolute", top: `${8 + r * 19}%`, left: `${7 + c * 15}%`, width: "3.2%", aspectRatio: "1", borderRadius: "50%", background: "#fff" }} />);
    }
    return (
      <div style={{ ...fill, background: stripes }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "40%", height: "53.85%", background: "#3C3B6E" }}>{stars}</div>
      </div>
    );
  }
  return null;
}

function Flag({ code, size, radius = 0, style }) {
  const f = FLAGS[code];
  if (!f) return null;
  const wrap = size != null
    ? { position: "relative", width: size, height: size, borderRadius: radius, overflow: "hidden", flex: "none" }
    : { position: "absolute", inset: 0, overflow: "hidden" };
  return <div role="img" aria-label={f.name} style={{ ...wrap, ...style }}>{flagInner(f.spec)}</div>;
}

const FLAG_CODES = Object.keys(FLAGS);

Object.assign(window, { FLAGS, FLAG_CODES, Flag });
