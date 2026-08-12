// ============================================================================
//  한국어 / English i18n — UI 문자열만 노출, 식별자는 절대 건드리지 않음
// ============================================================================

const KO = {
  // ---- 앱 / 부트 ----
  appTitle: '절차적 빌딩 컨피규레이터 (한글판)',
  loading: '에셋 키트 로딩 중…',
  loadingFailed: '키트 로딩 실패:',

  // ---- GUI 최상위 ----
  guiTitle: '빌딩 컨피규레이터',

  // ---- GUI 폴더 ----
  folderBuilding: '빌딩',
  folderEnvironment: '환경',
  folderCinematic: '시네마틱',
  folderSnow: '눈',
  folderSnowfall: '내리는 눈',
  folderAccumulation: '쌓인 눈',
  folderRain: '비',
  folderRainfall: '내리는 비',
  folderWetness: '젖음',

  // ---- 빌딩 매개변수 ----
  width: '너비',
  length: '길이',
  height: '높이',
  windowSeed: '창문 시드',
  groundFloor: '1층 스타일',

  // ---- 1층 스타일 옵션 ----
  groundAlternate: '교차',
  groundDoors: '문',
  groundShopWindows: '상점 창문',

  // ---- 환경 매개변수 ----
  timeOfDay: '시간대',
  autoOrbit: '자동 회전',
  orbitSpeed: '회전 속도',
  clouds: '구름',

  // ---- 시네마틱 ----
  bloom: '블룸',
  vignette: '비네트',
  filmGrain: '필름 그레인',
  chromaticAberration: '색수차',
  saturation: '채도',
  contrast: '대비',

  // ---- 눈 / 비 / 젖음 공통 ----
  enabled: '켜기',

  // ---- 내리는 눈 ----
  density: '밀도',
  fallSpeed: '낙하 속도',
  flakeSize: '눈송이 크기',
  sway: '흔들림',
  opacity: '불투명도',
  color: '색상',
  fallHeight: '낙하 높이',
  wind: '바람',
  windDir: '바람 방향',

  // ---- 쌓인 눈 ----
  coverage: '범위',
  patchScale: '패치 크기',
  patchSoftness: '패치 부드러움',
  heightVariation: '높이 변화',
  seedX: '시드 X',
  seedY: '시드 Y',
  randomizeSeed: '🎲 시드 무작위화',
  flatness: '평평함',
  roughness: '거칠기',
  reliefStrength: '기복 강도',
  reliefScale: '기복 크기',
  sparkle: '반짝임',
  sparkleDensity: '반짝임 밀도',

  // ---- 내리는 비 ----
  streakLength: '줄기 길이',
  streakWidth: '줄기 너비',

  // ---- 젖음 ----
  maskScale: '마스크 크기',
  maskSoftness: '마스크 부드러움',
  surfaceWetness: '표면 젖음',
  wetDarkness: '젖은 어둠',
  reflectionRoughness: '반사 거칠기',
  dropletBeading: '물방울 맺힘',
  dropletDensity: '물방울 밀도',
  topPuddles: '위쪽 웅덩이',
  rippleStrength: '물결 강도',
  rippleScale: '물결 크기',
  rippleSpeed: '물결 속도',
  rippleDensity: '물결 밀도',

  // ---- 시간대 프리셋 (표시 이름만 — 내부 키 'golden hour' / 'day' / 'night' 보존) ----
  presetGoldenHour: '황혼 시간',
  presetDay: '낮',
  presetNight: '밤',
};

const EN = {
  appTitle: 'Procedural Building Configurator',
  loading: 'loading kit…',
  loadingFailed: 'FAILED TO LOAD KIT:',

  guiTitle: 'building configurator',

  folderBuilding: 'building',
  folderEnvironment: 'environment',
  folderCinematic: 'cinematic',
  folderSnow: 'snow',
  folderSnowfall: 'snowfall',
  folderAccumulation: 'accumulation',
  folderRain: 'rain',
  folderRainfall: 'rainfall',
  folderWetness: 'wetness',

  width: 'width',
  length: 'length',
  height: 'height',
  windowSeed: 'window seed',
  groundFloor: 'ground floor',

  groundAlternate: 'alternate',
  groundDoors: 'doors',
  groundShopWindows: 'shop windows',

  timeOfDay: 'time of day',
  autoOrbit: 'auto orbit',
  orbitSpeed: 'orbit speed',
  clouds: 'clouds',

  bloom: 'bloom',
  vignette: 'vignette',
  filmGrain: 'film grain',
  chromaticAberration: 'chromatic aberration',
  saturation: 'saturation',
  contrast: 'contrast',

  enabled: 'enabled',

  density: 'density',
  fallSpeed: 'fall speed',
  flakeSize: 'flake size',
  sway: 'sway',
  opacity: 'opacity',
  color: 'color',
  fallHeight: 'fall height',
  wind: 'wind',
  windDir: 'wind dir',

  coverage: 'coverage',
  patchScale: 'patch scale',
  patchSoftness: 'patch softness',
  heightVariation: 'height variation',
  seedX: 'seed x',
  seedY: 'seed y',
  randomizeSeed: '🎲 randomize seed',
  flatness: 'flatness',
  roughness: 'roughness',
  reliefStrength: 'relief strength',
  reliefScale: 'relief scale',
  sparkle: 'sparkle',
  sparkleDensity: 'sparkle density',

  streakLength: 'streak length',
  streakWidth: 'streak width',

  maskScale: 'mask scale',
  maskSoftness: 'mask softness',
  surfaceWetness: 'surface wetness',
  wetDarkness: 'wet darkness',
  reflectionRoughness: 'reflection roughness',
  dropletBeading: 'droplet beading',
  dropletDensity: 'droplet density',
  topPuddles: 'top puddles',
  rippleStrength: 'ripple strength',
  rippleScale: 'ripple scale',
  rippleSpeed: 'ripple speed',
  rippleDensity: 'ripple density',

  presetGoldenHour: 'golden hour',
  presetDay: 'day',
  presetNight: 'night',
};

let current = KO;

export function setLanguage(lang: 'ko' | 'en'): void {
  current = lang === 'en' ? EN : KO;
}

export function t(key: string): string {
  const v = (current as Record<string, string>)[key];
  if (v !== undefined) return v;
  const e = (EN as Record<string, string>)[key];
  if (e !== undefined) return e;
  return key;
}

export const L = {
  KO,
  EN,
  current: () => current,
};
