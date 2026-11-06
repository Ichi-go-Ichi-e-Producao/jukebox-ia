import { describe, expect, it } from "vitest";
import { familiaAmizadeIdiomasTracks } from "./familiaAmizadeIdiomasTracks";
import { familiaAmizadeTracks } from "./familiaAmizadeTracks";
import { getTracksByTheme, THEMES, tracks } from "./musicData";

describe("Edição internacional de Família e Amizade", () => {
  it("tem seis gravações novas com IDs e áudios distintos", () => {
    expect(familiaAmizadeIdiomasTracks).toHaveLength(6);
    expect(new Set(familiaAmizadeIdiomasTracks.map(t => t.id)).size).toBe(6);
    expect(new Set(familiaAmizadeIdiomasTracks.map(t => t.audioUrl)).size).toBe(6);
    const oldUrls = new Set(familiaAmizadeTracks.map(t => t.audioUrl));
    for (const track of familiaAmizadeIdiomasTracks) expect(oldUrls.has(track.audioUrl)).toBe(false);
    expect(new Set(tracks.map(t => t.id)).size).toBe(tracks.length);
  });

  it("organiza os países em três faixas por tema internacional", () => {
    expect(getTracksByTheme("familia-mundo").map(t => t.country)).toEqual(["Cabo Verde", "Cuba", "África do Sul"]);
    expect(getTracksByTheme("amizade-mundo").map(t => t.country)).toEqual(["Jamaica", "Colômbia", "Japão"]);
  });

  it("identifica as línguas e variedades escolhidas", () => {
    expect(familiaAmizadeIdiomasTracks.map(t => t.language)).toEqual([
      "Kriolu · Santiago", "Español · Cuba", "isiZulu", "English · Jamaica", "Español · Colombia", "日本語 · Japonês",
    ]);
  });

  it("mantém seis versões PT-BR separadas e o forró brasileiro", () => {
    expect(THEMES.familia.title).toContain("PT-BR");
    expect(THEMES.amizade.title).toContain("PT-BR");
    expect(getTracksByTheme("familia")).toHaveLength(3);
    expect(getTracksByTheme("amizade")).toHaveLength(3);
    expect(familiaAmizadeTracks).toHaveLength(7);
    expect(familiaAmizadeTracks.every(t => t.language === "Português")).toBe(true);
    expect(getTracksByTheme("brasil-em-festa")).toHaveLength(1);
    expect(getTracksByTheme("brasil-em-festa")[0].language).toBe("Português");
  });

  it("mostra a revisão linguística pendente das demos em Kriolu e isiZulu", () => {
    for (const id of ["familia-amizade-idiomas-01", "familia-amizade-idiomas-03"]) {
      expect(tracks.find(t => t.id === id)?.reviewNote).toContain("revisão linguística pendente");
    }
  });

  it("não simula lançamento comercial ou streaming nas novas versões", () => {
    for (const track of tracks.filter(t => t.id.startsWith("familia-amizade-idiomas-"))) {
      expect(track.audioUrl).toMatch(/^https:\/\/files\.manuscdn\.com\//);
      expect(track.durationSeconds).toBeGreaterThan(100);
      expect(track.durationSeconds).toBeLessThan(190);
      expect(track.isOfficial).toBeUndefined();
      expect(track.isExclusive).toBeUndefined();
      expect(track.isStreamingOnly).toBeUndefined();
      expect(track.spotifyUrl).toBeUndefined();
      expect(track.appleMusicUrl).toBeUndefined();
    }
    expect(tracks.filter(t => t.isOfficial)).toHaveLength(13);
    expect(THEMES["familia-mundo"].description).toContain("ainda não distribuídas");
    expect(THEMES["amizade-mundo"].description).toContain("ainda não distribuídas");
  });
});
