export type TemaApp = "claro" | "oscuro";

export interface Colores {
  // Fondos
  fondoPrincipal: string;
  fondoSecundario: string;
  fondoCard: string;
  fondoInput: string;

  // Textos
  textoPrincipal: string;
  textoSecundario: string;
  textoTerciario: string;
  textoInverso: string;

  // Botones y acentos
  btnPrimario: string;
  btnSecundario: string;
  btnGoogleFondo: string;
  btnGoogleTexto: string;

  // Bordes y líneas
  borde: string;
  bordeInput: string;

  // Iconos y elementos
  iconoColorGris: string;
  enlaces: string;

  // Avatar
  avatarFondo: string;
  avatarIcono: string;

  // Elementos especiales
  fabColor: string;
  cardElevacion: string;
}

export const temasColors: Record<TemaApp, Colores> = {
  claro: {
    // Fondos - Blanco con toque azul claro
    fondoPrincipal: "#f5f9fc",
    fondoSecundario: "#ffffff",
    fondoCard: "#fafbfd",
    fondoInput: "#f0f4f8",

    // Textos - Azul oscuro deportivo
    textoPrincipal: "#0d3d7a",
    textoSecundario: "#4a6fa5",
    textoTerciario: "#7a8fb3",
    textoInverso: "#ffffff",

    // Botones y acentos - Naranja energético y azul vibrante
    btnPrimario: "#ff6b35",
    btnSecundario: "#1e90ff",
    btnGoogleFondo: "#ffffff",
    btnGoogleTexto: "#0d3d7a",

    // Bordes y líneas
    borde: "#d4dce8",
    bordeInput: "#c0cde0",

    // Iconos
    iconoColorGris: "#6b8fa3",
    enlaces: "#ff6b35",

    // Avatar - Naranja vibrante
    avatarFondo: "#ff8855",
    avatarIcono: "#ffffff",

    // Elementos especiales
    fabColor: "#ff6b35",
    cardElevacion: "rgba(255, 107, 53, 0.1)",
  },

  oscuro: {
    // Fondos - Azul noche oscuro deportivo
    fondoPrincipal: "#0a1929",
    fondoSecundario: "#132f4c",
    fondoCard: "#132f4c",
    fondoInput: "#1e3a5f",

    // Textos - Azul claro y blanco
    textoPrincipal: "#e3f2fd",
    textoSecundario: "#b3d9ff",
    textoTerciario: "#7a99b8",
    textoInverso: "#0a1929",

    // Botones y acentos - Naranja vibrante y amarillo lima
    btnPrimario: "#ff7b54",
    btnSecundario: "#00d084",
    btnGoogleFondo: "#132f4c",
    btnGoogleTexto: "#e3f2fd",

    // Bordes y líneas
    borde: "#1e3a5f",
    bordeInput: "#2a4a7f",

    // Iconos
    iconoColorGris: "#b3d9ff",
    enlaces: "#ff7b54",

    // Avatar - Verde lima deportivo
    avatarFondo: "#00d084",
    avatarIcono: "#0a1929",

    // Elementos especiales
    fabColor: "#ff7b54",
    cardElevacion: "rgba(255, 123, 84, 0.2)",
  },
};

export const obtenerColores = (tema: TemaApp): Colores => temasColors[tema];
