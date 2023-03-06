import SPELLS from 'common/SPELLS';
import TALENTS from 'common/TALENTS/shaman';

//event link attribution strings
export const HARDCAST = 'Hardcast';
export const RIPTIDE_HIT = 'RiptideHit';
export const RIPTIDE_PWAVE = 'PrimordialWave';
export const PWAVE_REMOVAL = 'PrimordialWaveRemoved';
export const HEALING_WAVE_PWAVE = 'HealingWavePrimordialWave';
export const PRIMAL_TIDE_CORE = 'PrimalTideCore';
export const APPLIED_HEAL = 'AppliedHeal';
export const UNLEASH_LIFE = 'UnleashLife';
export const UNLEASH_LIFE_HEALING_WAVE = 'UnleashLifeHealingWave';
export const UNLEASH_LIFE_REMOVE = 'UnleashLifeRemoved';
export const HEALING_RAIN = 'HealingRain';
export const HEALING_RAIN_GROUPING = 'HealingRainGrouping';
export const OVERFLOWING_SHORES = 'OverflowingShores';
export const CHAIN_HEAL = 'ChainHeal';
export const CHAIN_HEAL_GROUPING = 'ChainHealGrouping';
export const FLOW_OF_THE_TIDES = 'FlowOfTheTides';
export const DOWNPOUR = 'Downpour';
//event link ms settings
export const CAST_BUFFER_MS = 100;
export const PWAVE_TRAVEL_MS = 1100;
export const UNLEASH_LIFE_REMOVE_MS = 400;
//healing increases
export const UNLEASH_LIFE_HEALING_INCREASE = 0.35;
export const UNLEASH_LIFE_CHAIN_HEAL_INCREASE = 0.15;
export const FLOW_OF_THE_TIDES_INCREASE = 0.3;
export const UNLEASH_LIFE_EXTRA_TARGETS = 2;
export const HEALING_RAIN_TARGETS = 6;
export const DOWNPOUR_TARGETS = 6;
export const DOWNPOUR_CD_PER_HIT = 5000;
export const CHAIN_HEAL_TARGETS = 4;
export const ANCESTRAL_REACH_TARGET = 1;

export const RESTORATION_COLORS = {
  CHAIN_HEAL: '#203755',
  HEALING_WAVE: '#146585',
  HEALING_SURGE: '#40b3bf',
  RIPTIDE: '#a3dbce',
  HEALING_RAIN: '#21a2d5',
  OVERFLOWING_SHORES: '#0376a3',
  UNLEASH_LIFE: '#1ba691',
  WELLSPRING: '#515c61',
  DOWNPOUR: '#3b6760',
  PRIMORDIAL_WAVE: '#0d2b36',
  UNUSED: '#CC3D20',
};

// Spell Coefficients
export const CHAIN_HEAL_COEFFICIENT = 2.1;
export const HEALING_WAVE_COEFFICIENT = 3;
export const HEALING_SURGE_COEFFICIENT = 2.48;
export const HIGH_TIDE_COEFFICIENT = 2.31;
export const HEALING_WAVE_CAST_TIME = 2.5;

// Your normal healing toolkit, default spells and talents
// TODO: Check all these lists again, maybe restructure to remove repeats
// TODO: Create list for Ancestral Guidance (should be all BASE + Ascendance + CBT)
const SHAMAN_BASE_ABILITIES = [
  SPELLS.HEALING_SURGE,
  // Cannot find any logs with the heal
  // SPELLS.PRIMORDIAL_WAVE_HEAL,

  TALENTS.HEALING_WAVE_TALENT,
  TALENTS.CHAIN_HEAL_TALENT,
  SPELLS.HEALING_SURGE,
  TALENTS.RIPTIDE_TALENT,
  SPELLS.HEALING_RAIN_HEAL,
  SPELLS.WELLSPRING_HEAL,
  TALENTS.UNLEASH_LIFE_TALENT,
  SPELLS.EARTH_SHIELD_HEAL,
  TALENTS.DOWNPOUR_TALENT,
  SPELLS.ASCENDANCE_INITIAL_HEAL,
  SPELLS.NATURES_GUARDIAN_HEAL, // double check
  SPELLS.WELLSPRING_HEAL,
  SPELLS.OVERFLOWING_SHORES_HEAL,
  SPELLS.EARTHLIVING_WEAPON_HEAL,
];

// These often need special handling as the shaman is not the source
const SHAMAN_PET_ABILITIES = [SPELLS.HEALING_TIDE_TOTEM_HEAL, SPELLS.HEALING_STREAM_TOTEM_HEAL];

export const ABILITIES_AFFECTED_BY_HEALING_INCREASES = [
  ...SHAMAN_BASE_ABILITIES,
  ...SHAMAN_PET_ABILITIES,

  // While the following spells don't double dip in healing increases, they gain the same percentual bonus from the transfer
  SPELLS.ANCESTRAL_AWAKENING_HEAL, // double check interactions
  SPELLS.ANCESTRAL_GUIDANCE_HEAL,
  SPELLS.CLOUDBURST_TOTEM_HEAL,
  SPELLS.ASCENDANCE_HEAL,
  SPELLS.LEECH,
];

export const BASE_ABILITIES_AFFECTED_BY_MASTERY = [
  ...SHAMAN_BASE_ABILITIES,
  ...SHAMAN_PET_ABILITIES,
];

export const ABILITIES_AFFECTED_BY_MASTERY = [
  ...BASE_ABILITIES_AFFECTED_BY_MASTERY,
  // While the following spells don't double dip in healing increases, they gain the same percentual bonus from the transfer
  SPELLS.ANCESTRAL_AWAKENING_HEAL,
  SPELLS.ANCESTRAL_GUIDANCE_HEAL,
  SPELLS.CLOUDBURST_TOTEM_HEAL,
  SPELLS.ASCENDANCE_HEAL,
  SPELLS.LEECH,
];

export const ABILITIES_FEEDING_INTO_CBT = [...SHAMAN_BASE_ABILITIES];

export const ABILITIES_NOT_FEEDING_INTO_ASCENDANCE = [
  SPELLS.HEALING_TIDE_TOTEM_HEAL,
  SPELLS.HEALING_STREAM_TOTEM_HEAL,
  SPELLS.SPIRIT_LINK_TOTEM_REDISTRIBUTE,
  SPELLS.LEECH,
  SPELLS.ASCENDANCE_HEAL,
  SPELLS.CLOUDBURST_TOTEM_HEAL,
  SPELLS.ASCENDANCE_INITIAL_HEAL,
  SPELLS.ANCESTRAL_GUIDANCE_HEAL,
];

export const FLASH_FLOOD_CAST_SPEED_MODIFIER = 0.1; // per rank

export const HEALING_RAIN_DURATION = 10000;
export const RIPTIDE_BASE_DURATION = 18000;
export const WAVESPEAKERS_BLESSING = 3000;
