// Snap points for the map's dex sheet, measured as distance from the top of
// the window (smaller number = taller sheet).
//
//   peek — only the grabber + header poke above the tab bar. When the amber
//          selection banner is showing it renders ABOVE the sheet header, so
//          peek rises by the banner's height (`selectionOffset`) to keep the
//          grabber reachable. Offset is 0 when nothing is selected.
//   half — sheet covers the bottom 40% of the screen (device feedback round 3)
//   full — sheet expands to just below the status area
export function sheetSnapPoints(usableHeight: number, topInset: number, selectionOffset: number) {
  return {
    peek: usableHeight - 140 - selectionOffset,
    half: usableHeight * 0.6,
    full: topInset + 60,
  };
}
