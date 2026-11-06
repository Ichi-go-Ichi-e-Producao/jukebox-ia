import { describe, expect, it } from "vitest";
import { familiaAmizadeTracks } from "./familiaAmizadeTracks";
import { getTracksByTheme, THEMES, tracks } from "./musicData";

describe("Coleção Família e Amizade", () => {
  it("inclui sete faixas com ids e URLs distintos", () => {
    expect(familiaAmizadeTracks).toHaveLength(7);
    expect(new Set(familiaAmizadeTracks.map(t => t.id)).size).toBe(7);
    expect(new Set(familiaAmizadeTracks.map(t => t.audioUrl)).size).toBe(7);
    expect(new Set(tracks.map(t => t.id)).size).toBe(tracks.length);
  });

  it("separa Família, Amizade e o bônus nordestino", () => {
    expect(getTracksByTheme("familia")).toHaveLength(3);
    expect(getTracksByTheme("amizade")).toHaveLength(3);
    expect(getTracksByTheme("brasil-em-festa")).toHaveLength(1);
    expect(getTracksByTheme("brasil-em-festa")[0].country).toBe("Brasil — Nordeste");
  });

  it("usa áudios tocáveis em português com durações reais", () => {
    for (const track of familiaAmizadeTracks) {
      expect(track.audioUrl).toMatch(/^https:\/\/files\.manuscdn\.com\//);
      expect(track.durationSeconds).toBeGreaterThan(120);
      expect(track.durationSeconds).toBeLessThan(190);
      expect(track.language).toBe("Português");
    }
  });

  it("não atribui distribuição ou exclusividade às novas composições", () => {
    for (const track of tracks.filter(t => t.id.startsWith("familia-amizade-mundo-"))) {
      expect(track.isOfficial).toBeUndefined();
      expect(track.isExclusive).toBeUndefined();
      expect(track.isStreamingOnly).toBeUndefined();
      expect(track.spotifyUrl).toBeUndefined();
      expect(track.appleMusicUrl).toBeUndefined();
    }
    expect(THEMES.familia.description).toContain("ainda não distribuídas");
    expect(THEMES.amizade.description).toContain("ainda não distribuídas");
  });

  it("preserva os treze cards oficiais e as sete faixas somente de streaming", () => {
    const official = tracks.filter(t => t.isOfficial);
    expect(official).toHaveLength(13);
    expect(official.filter(t => t.isStreamingOnly)).toHaveLength(7);
    expect(official.every(t => t.theme === "lumen-trap-oficiais")).toBe(true);
  });

  it("usa a segunda geração japonesa, não o rascunho cortado", () => {
    const japan = familiaAmizadeTracks.find(t => t.country === "Japão");
    expect(japan?.audioUrl).toContain("pzKRkqEwBbUUMTNw.mp3");
    expect(japan?.audioUrl).not.toContain("FCogLVBzuogufYff.mp3");
  });
});
