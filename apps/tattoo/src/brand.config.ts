export const tattooBrand = {
  name: 'Juanjo Tattoo Studio',
  locale: 'es-AR' as const,
  social: {
    instagram: 'https://www.instagram.com/juanjo.tattoos/',
    handle: '@juanjo.tattoos',
  },
  heroMedia: {
    src: undefined as string | undefined,
    alt: undefined as string | undefined,
  },
  palette: {
    ink: '#0E0E0E',
    red: '#A61E1E',
    ivory: '#EADCC6',
    gold: '#C9A96B',
    charcoal: '#2C2C2C',
  },
  typography: {
    display: '/fonts/Rye-Regular.ttf',
    editorial: '/fonts/DejaVuSerif.ttf',
    functional: '/fonts/DejaVuSans.ttf',
    functionalBold: '/fonts/DejaVuSans-Bold.ttf',
  },
  marks: {
    principal: {
      src: '/brand/logo-principal.png',
      role: 'Full brand introduction',
      width: 1254,
      height: 1254,
      sha256: 'c66d7dc0fa4c99daefadab6200f55ed9f750819d7ecaab1055e3b0609c80a237',
    },
    seal: {
      src: '/brand/sello-circular.png',
      role: 'Portfolio empty-state seal',
      width: 1254,
      height: 1254,
      sha256: '8bb1da4d3b7cb300fd7d741a481928f07d4056e5fe9a28e65e42d4ca6666d92d',
    },
    oni: {
      src: '/brand/icono-oni.png',
      role: 'Hero protagonist',
      width: 1313,
      height: 1198,
      sha256: '576f730d5f44aaf2840e78413e99f0aafa733918d148d629756be16e9f149b01',
    },
    jt: {
      src: '/brand/monograma-jt.png',
      role: 'Mobile header mark and favicon',
      width: 1489,
      height: 1056,
      sha256: '971090d517b7ad5236be56e2010e864b03b18826091ae63197b22c48aa0ca002',
    },
    signature: {
      src: '/brand/wordmark.png',
      role: 'Header and footer signature',
      width: 1774,
      height: 887,
      sha256: 'ce40f98a9c935642e56d66021513fd2680b75225cd75e2e100593a4a42dfe1c4',
    },
  },
  attribution: {
    label: 'Powered by',
    brand: 'Littzite',
    href: undefined,
    logoSrc: '/littzite/horizontal-dark.svg',
  },
} as const;

export const tattooActions = {
  turnsHref: 'https://cal.com/juanjo-pereyra-mkzgce/turnos-tattoos?overlayCalendar=true',
  consultHref: tattooBrand.social.instagram,
  instagramHref: tattooBrand.social.instagram,
} as const;

export const tattooLocation = {
  directionsHref: 'https://maps.app.goo.gl/SrLiJA1dutozzdKn7',
  embedUrl:
    'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3401.3042722461555!2d-68.571153!3d-31.515802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDMwJzU2LjkiUyA2OMKwMzQnMTYuMiJX!5e0!3m2!1ses!2sar!4v1791429708287!5m2!1ses!2sar',
} as const;

export const tattooReleaseState = {
  temporaryHeroImage: true,
  temporaryPortfolioImages: true,
  temporaryAftercareImage: true,
} as const;

export const tattooIdentity = {
  surface: tattooBrand.palette.ink,
  text: tattooBrand.palette.ivory,
  accent: tattooBrand.palette.red,
  accentText: tattooBrand.palette.ivory,
  border: tattooBrand.palette.gold,
  focus: tattooBrand.palette.gold,
} as const;
