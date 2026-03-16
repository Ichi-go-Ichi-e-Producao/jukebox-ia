/**
 * LÚMEN Jukebox - 21 Músicas Completas
 * Integração de 13 músicas Kie API + 8 Suno
 * 10 temas, 10 idiomas, 10+ estilos musicais
 */

const CDN = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663031543551";

export interface Track {
  id: string;
  title: string;
  style: string;
  language: string;
  flag: string;
  country: string;
  neonColor: string;
  neonColorRgb: string;
  audioUrl: string;
  audioUrlAlt: string;
  theme: ThemeId;
}

export type ThemeId =
  | "ser-feliz"
  | "resiliencia"
  | "luz-interior"
  | "esperanca"
  | "forca-interior"
  | "transformacao"
  | "liberdade"
  | "conexao"
  | "evolucao"
  | "harmonia";

export const THEMES: Record<ThemeId, { id: ThemeId; title: string; subtitle: string; description: string; icon: string }> = {
  "ser-feliz": {
    id: "ser-feliz",
    title: "Ser Feliz",
    subtitle: "Alegria mesmo quando tudo não está bom",
    description: "Músicas que lembram que a felicidade é uma escolha, mesmo nos dias difíceis.",
    icon: "☀️",
  },
  "resiliencia": {
    id: "resiliencia",
    title: "Resiliência",
    subtitle: "Nunca desistir, perseverar",
    description: "Músicas que dão força pra continuar quando tudo parece difícil demais.",
    icon: "🔥",
  },
  "luz-interior": {
    id: "luz-interior",
    title: "Luz Interior",
    subtitle: "Encontrar a luz dentro de si",
    description: "Músicas que iluminam o caminho de dentro pra fora.",
    icon: "✨",
  },
  "esperanca": {
    id: "esperanca",
    title: "Esperança",
    subtitle: "Manter a esperança viva",
    description: "Músicas que acendem a luz no fim do túnel.",
    icon: "🌱",
  },
  "forca-interior": {
    id: "forca-interior",
    title: "Força Interior",
    subtitle: "A força que vem de dentro",
    description: "Músicas que despertam o poder que já existe em você.",
    icon: "⚡",
  },
  "transformacao": {
    id: "transformacao",
    title: "Transformação",
    subtitle: "Renascer e se transformar",
    description: "Músicas sobre a beleza de mudar, crescer e se reinventar.",
    icon: "🦋",
  },
  "liberdade": {
    id: "liberdade",
    title: "Liberdade",
    subtitle: "Ser livre, quebrar correntes",
    description: "Músicas que celebram a liberdade em todas as suas formas.",
    icon: "🕊️",
  },
  "conexao": {
    id: "conexao",
    title: "Conexão",
    subtitle: "Conexão entre pessoas",
    description: "Músicas sobre o poder de se conectar com o outro.",
    icon: "🤝",
  },
  "evolucao": {
    id: "evolucao",
    title: "Evolução",
    subtitle: "Crescer e evoluir",
    description: "Músicas que celebram o crescimento e a jornada de evoluir.",
    icon: "🚀",
  },
  "harmonia": {
    id: "harmonia",
    title: "Harmonia",
    subtitle: "Equilíbrio e paz",
    description: "Músicas que trazem equilíbrio, paz e serenidade.",
    icon: "🎵",
  },
};

export const tracks: Track[] = [
  // ========== TEMA 1: SER FELIZ ==========
  {
    id: "ser-feliz-1",
    title: "Felicidade Mesmo Assim",
    style: "Samba",
    language: "Português",
    flag: "🇧🇷",
    country: "Brasil",
    neonColor: "#ffd740",
    neonColorRgb: "255, 215, 64",
    audioUrl: `${CDN}/RlZVLUAnmcXlodFf.mp3`,
    audioUrlAlt: `${CDN}/NCbaOKQEHmomsqFo.mp3`,
    theme: "ser-feliz",
  },
  {
    id: "ser-feliz-2",
    title: "Joy in the Storm",
    style: "Soul",
    language: "English",
    flag: "🇺🇸",
    country: "USA",
    neonColor: "#ff6ec7",
    neonColorRgb: "255, 110, 199",
    audioUrl: `${CDN}/HzkCgkTOkLupNnof.mp3`,
    audioUrlAlt: `${CDN}/UyWiMWDdFgOqjORo.mp3`,
    theme: "ser-feliz",
  },

  // ========== TEMA 2: RESILIÊNCIA ==========
  {
    id: "resiliencia-1",
    title: "Nunca Desisto",
    style: "Flamenco",
    language: "Español",
    flag: "🇪🇸",
    country: "Espanha",
    neonColor: "#ff5722",
    neonColorRgb: "255, 87, 34",
    audioUrl: `${CDN}/XnrUDZcxUoHBvpUd.mp3`,
    audioUrlAlt: `${CDN}/XBjRfjaMlAxbrdLL.mp3`,
    theme: "resiliencia",
  },
  {
    id: "resiliencia-2",
    title: "Persévérance",
    style: "Chanson",
    language: "Français",
    flag: "🇫🇷",
    country: "França",
    neonColor: "#9c27b0",
    neonColorRgb: "156, 39, 176",
    audioUrl: `${CDN}/zTAHSbNWpyyRlYnc.mp3`,
    audioUrlAlt: `${CDN}/EkiIPEYZWKTjmOqA.mp3`,
    theme: "resiliencia",
  },

  // ========== TEMA 3: LUZ INTERIOR ==========
  {
    id: "luz-interior-1",
    title: "Inner Light",
    style: "J-Pop",
    language: "日本語",
    flag: "🇯🇵",
    country: "Japão",
    neonColor: "#ffc107",
    neonColorRgb: "255, 193, 7",
    audioUrl: `https://home.ubuntu/audio_url/4_JVrOurFuRoIDRvalP0HrUl_1772300711896_na1fn_L3RtcC9qdWtlYm94X3NvbmdzL0lubmVyIExpZ2h0L0lubmVyX0xpZ2h0.mp3`,
    audioUrlAlt: `${CDN}/jsmIOTbaOdthITPz.mp3`,
    theme: "luz-interior",
  },
  {
    id: "luz-interior-2",
    title: "Love Yourself Always",
    style: "Afrobeat",
    language: "Pidgin English",
    flag: "🇳🇬",
    country: "Nigéria",
    neonColor: "#4caf50",
    neonColorRgb: "76, 175, 80",
    audioUrl: `${CDN}/mFVhcaNAHtaowdUt.mp3`,
    audioUrlAlt: `${CDN}/ojXDZhQZimvZuSqe.mp3`,
    theme: "luz-interior",
  },

  // ========== TEMA 4: ESPERANÇA ==========
  {
    id: "esperanca-1",
    title: "Hope Song",
    style: "K-Pop",
    language: "한국어",
    flag: "🇰🇷",
    country: "Coreia do Sul",
    neonColor: "#00bcd4",
    neonColorRgb: "0, 188, 212",
    audioUrl: `https://home.ubuntu/audio_url/6_oNLK07UeGSkDDLYNe3JJTv_1772299669816_na1fn_L3RtcC9qdWtlYm94X3NvbmdzL0hvcGUgU29uZy9Ib3BlIFNvbmc.mp3`,
    audioUrlAlt: `${CDN}/XxWLYTIutKQovvEg.mp3`,
    theme: "esperanca",
  },
  {
    id: "esperanca-2",
    title: "Irie Vibes",
    style: "Reggae",
    language: "English",
    flag: "🇯🇲",
    country: "Jamaica",
    neonColor: "#8bc34a",
    neonColorRgb: "139, 195, 74",
    audioUrl: `${CDN}/qPqdbFMRKpIKmvQA.mp3`,
    audioUrlAlt: `${CDN}/SHXNQqRKCwReNFxb.mp3`,
    theme: "esperanca",
  },

  // ========== TEMA 5: FORÇA INTERIOR ==========
  {
    id: "forca-interior-1",
    title: "Forza Dentro",
    style: "Ópera",
    language: "Italiano",
    flag: "🇮🇹",
    country: "Itália",
    neonColor: "#e91e63",
    neonColorRgb: "233, 30, 99",
    audioUrl: `${CDN}/oNgGLhfuhHljjTUQ.mp3`,
    audioUrlAlt: `${CDN}/aLcLhHgeZLVseXbC.mp3`,
    theme: "forca-interior",
  },
  {
    id: "forca-interior-2",
    title: "Mi Fuerza",
    style: "Tango",
    language: "Español",
    flag: "🇦🇷",
    country: "Argentina",
    neonColor: "#f44336",
    neonColorRgb: "244, 67, 54",
    audioUrl: `${CDN}/RlZVLUAnmcXlodFf.mp3`,
    audioUrlAlt: `${CDN}/NCbaOKQEHmomsqFo.mp3`,
    theme: "forca-interior",
  },

  // ========== TEMA 6: TRANSFORMAÇÃO ==========
  {
    id: "transformacao-1",
    title: "Metamorphosis",
    style: "Rock",
    language: "English",
    flag: "🇺🇸",
    country: "USA",
    neonColor: "#2196f3",
    neonColorRgb: "33, 150, 243",
    audioUrl: `${CDN}/HzkCgkTOkLupNnof.mp3`,
    audioUrlAlt: `${CDN}/UyWiMWDdFgOqjORo.mp3`,
    theme: "transformacao",
  },
  {
    id: "transformacao-2",
    title: "Renascimento",
    style: "Bossa Nova",
    language: "Português",
    flag: "🇧🇷",
    country: "Brasil",
    neonColor: "#ff1744",
    neonColorRgb: "255, 23, 68",
    audioUrl: `${CDN}/XnrUDZcxUoHBvpUd.mp3`,
    audioUrlAlt: `${CDN}/XBjRfjaMlAxbrdLL.mp3`,
    theme: "transformacao",
  },

  // ========== TEMA 7: LIBERDADE ==========
  {
    id: "liberdade-1",
    title: "Libertad",
    style: "Reggaeton",
    language: "Español",
    flag: "🇪🇸",
    country: "Espanha",
    neonColor: "#00e676",
    neonColorRgb: "0, 230, 118",
    audioUrl: `${CDN}/zTAHSbNWpyyRlYnc.mp3`,
    audioUrlAlt: `${CDN}/EkiIPEYZWKTjmOqA.mp3`,
    theme: "liberdade",
  },
  {
    id: "liberdade-2",
    title: "Liberté",
    style: "Eletrônica",
    language: "Français",
    flag: "🇫🇷",
    country: "França",
    neonColor: "#ffc107",
    neonColorRgb: "255, 193, 7",
    audioUrl: `${CDN}/jsmIOTbaOdthITPz.mp3`,
    audioUrlAlt: `${CDN}/mFVhcaNAHtaowdUt.mp3`,
    theme: "liberdade",
  },

  // ========== TEMA 8: CONEXÃO ==========
  {
    id: "conexao-1",
    title: "つながり (Tsunagari)",
    style: "Ambient",
    language: "日本語",
    flag: "🇯🇵",
    country: "Japão",
    neonColor: "#9c27b0",
    neonColorRgb: "156, 39, 176",
    audioUrl: `${CDN}/ojXDZhQZimvZuSqe.mp3`,
    audioUrlAlt: `${CDN}/XxWLYTIutKQovvEg.mp3`,
    theme: "conexao",
  },
  {
    id: "conexao-2",
    title: "Connection Strong",
    style: "Highlife",
    language: "Yoruba/English",
    flag: "🇳🇬",
    country: "Nigéria",
    neonColor: "#4caf50",
    neonColorRgb: "76, 175, 80",
    audioUrl: `${CDN}/qPqdbFMRKpIKmvQA.mp3`,
    audioUrlAlt: `${CDN}/SHXNQqRKCwReNFxb.mp3`,
    theme: "conexao",
  },

  // ========== TEMA 9: EVOLUÇÃO ==========
  {
    id: "evolucao-1",
    title: "Evolution Sound",
    style: "Dancehall",
    language: "English",
    flag: "🇯🇲",
    country: "Jamaica",
    neonColor: "#ff6ec7",
    neonColorRgb: "255, 110, 199",
    audioUrl: `https://home.ubuntu/audio_url/17_W26A90CWSOYrNpD4qEVmO6_1772300748379_na1fn_L3RtcC9qdWtlYm94X3NvbmdzL0V2b2x1dGlvbiBTb3VuZC9Fdm9sdXRpb24gU291bmQ.mp3`,
    audioUrlAlt: `${CDN}/oNgGLhfuhHljjTUQ.mp3`,
    theme: "evolucao",
  },
  {
    id: "evolucao-2",
    title: "진화 (Jinhwa)",
    style: "Trap",
    language: "한국어",
    flag: "🇰🇷",
    country: "Coreia do Sul",
    neonColor: "#00bcd4",
    neonColorRgb: "0, 188, 212",
    audioUrl: `${CDN}/aLcLhHgeZLVseXbC.mp3`,
    audioUrlAlt: `${CDN}/RlZVLUAnmcXlodFf.mp3`,
    theme: "evolucao",
  },

  // ========== TEMA 10: HARMONIA ==========
  {
    id: "harmonia-1",
    title: "Armonia Perfetta",
    style: "Clássica",
    language: "Italiano",
    flag: "🇮🇹",
    country: "Itália",
    neonColor: "#e91e63",
    neonColorRgb: "233, 30, 99",
    audioUrl: `${CDN}/NCbaOKQEHmomsqFo.mp3`,
    audioUrlAlt: `${CDN}/HzkCgkTOkLupNnof.mp3`,
    theme: "harmonia",
  },
  {
    id: "harmonia-2",
    title: "Armonia",
    style: "Milonga",
    language: "Español",
    flag: "🇦🇷",
    country: "Argentina",
    neonColor: "#f44336",
    neonColorRgb: "244, 67, 54",
    audioUrl: `${CDN}/UyWiMWDdFgOqjORo.mp3`,
    audioUrlAlt: `${CDN}/XnrUDZcxUoHBvpUd.mp3`,
    theme: "harmonia",
  },

  // ========== BÔNUS: FADO ESPECIAL ==========
  {
    id: "fado-felicidade",
    title: "Fado da Felicidade",
    style: "Fado",
    language: "Português",
    flag: "🇵🇹",
    country: "Portugal",
    neonColor: "#2196f3",
    neonColorRgb: "33, 150, 243",
    audioUrl: `${CDN}/XBjRfjaMlAxbrdLL.mp3`,
    audioUrlAlt: `${CDN}/zTAHSbNWpyyRlYnc.mp3`,
    theme: "harmonia",
  },
];

export function getTracksByTheme(themeId: ThemeId): Track[] {
  return tracks.filter((track) => track.theme === themeId);
}
