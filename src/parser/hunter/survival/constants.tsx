import SPELLS from 'common/SPELLS';

//region Spells
/** Butchery / Carve */
//Butchery and Carve can hit up to 5 people
export const BUTCHERY_CARVE_MAX_TARGETS_HIT = 5;
/** Coordinated Assault */
//Coordinated Assault increases all damage done by 20%
export const COORDINATED_ASSAULT_DMG_MOD = 0.2;
/** Wildfire Bomb */
//People aren't robots, give them a bit of leeway in terms of when they cast WFB to avoid capping on charges
export const WILDFIRE_BOMB_LEEWAY_BUFFER = 500;
/** Kill Command */
//Kill Command for Survival regenerates 15 focus
export const SV_KILL_COMMAND_FOCUS_GAIN = 15;
/** Serpent Sting */
//Serpent Sting costs 20 focus
export const SV_SERPENT_STING_COST = 20;
//Serpent Sting for SV pandemics at 30%
export const SERPENT_STING_SV_PANDEMIC = 0.3;
//The baseduration of Serpent Sting before any haste reduction
export const SERPENT_STING_SV_BASE_DURATION = 12000;
/** Raptor Strike / Mongoose Bite */
//Raptor Strike turns into MongAoose Bite when talented into it, and during Aspect of the Eagle they change spellIDs.
export const RAPTOR_MONGOOSE_VARIANTS = [
  SPELLS.RAPTOR_STRIKE,
  SPELLS.RAPTOR_STRIKE_AOTE,
  SPELLS.MONGOOSE_BITE_TALENT,
  SPELLS.MONGOOSE_BITE_TALENT_AOTE,
];
/** Aspect of the Eagle */
//This is the baseline cooldown of Aspect of the Eagle
export const BASELINE_AOTE_CD = 90000;
//endregion

//region Talents
/** Vipers Venom */
//Serpent Sting costs 0 when Vipers Venom is active
export const VIPERS_VENOM_COST_MULTIPLIER = 0;
//The increased damage of the initial hit of Serpent Sting from Viper's Venom
export const VIPERS_VENOM_DAMAGE_MODIFIER = 2.5;
/** Bird of Prey */
//Bird of Prey extends Coordinated Assault by 1.5 seconds per trigger
export const BOP_CA_EXTENSION_PER_CAST = 1500;
/** Chakrams */
//Chakrams has a bunch of different spellIDs for damage
export const SURVIVAL_CHAKRAM_TYPES = [
  SPELLS.CHAKRAMS_TO_MAINTARGET.id,
  SPELLS.CHAKRAMS_BACK_FROM_MAINTARGET.id,
  SPELLS.CHAKRAMS_NOT_MAINTARGET.id,
];
/** Flanking Strike */
//Flanking Strikes regenerates 30 focus
export const FLANKING_STRIKE_FOCUS_GAIN = 30;
/** Mongoose Bite */
//Mongoose Bite has traveltime, so if used during Aspect of the Eagle it can have up to 700ms travel time
export const MONGOOSE_BITE_MAX_TRAVEL_TIME = 700;
//Mongoose Bite can have a maximum of 5 stacks
export const MONGOOSE_BITE_MAX_STACKS = 5;
/** Guerilla Tactics */
//The initial hit modifier for Guerrilla Tactics talent
export const GUERRILLA_TACTICS_INIT_HIT_MODIFIER = 1;
//Spells affected by Guerrilla Tactics talent
export const AFFECTED_BY_GUERRILLA_TACTICS = [
  SPELLS.WILDFIRE_BOMB_IMPACT,
  SPELLS.VOLATILE_BOMB_WFI_IMPACT,
  SPELLS.PHEROMONE_BOMB_WFI_IMPACT,
  SPELLS.SHRAPNEL_BOMB_WFI_IMPACT,
];
/** Tip of the Spear */
//Tip of the Spear damage increase
export const TIP_DAMAGE_INCREASE = 0.25;
//Tip maximum stacks
export const TIP_MAX_STACKS = 3;
/** Alpha Predator */
//The damage increase from Alpha Predator
export const ALPHA_DAMAGE_KC_MODIFIER = 0.3;
/** Bloodseeker */
//Attack speed gain per bleeding enemy from Bloodseeker
export const BLOODSEEKER_ATTACK_SPEED_GAIN = 0.1;
/** Hydra's Bite */
//Hydra's Bite DOT damage increase
export const HYDRAS_BITE_DOT_MODIFIER = 0.2;
//endregion

//region Resources
export const LIST_OF_FOCUS_SPENDERS_SV = [
  SPELLS.BUTCHERY_TALENT,
  SPELLS.CARVE,
  SPELLS.WING_CLIP,
  SPELLS.CHAKRAMS_TALENT,
  SPELLS.SERPENT_STING_SV,
  ...RAPTOR_MONGOOSE_VARIANTS,
];
export const BASE_FOCUS_REGEN_SV = 2.5;
export const BASE_MAX_FOCUS_SV = 100;
//endregion

//region Azerite Traits
/** Blur of Talons */
//Blur of Talons cannot get more than 5 stacks at a time
export const MAX_BLUR_OF_TALONS_STACKS = 5;
/** Latent Poison */
//Latent Poison stacks up to 10 times
export const LATENT_POISON_MAX_STACKS = 10;
/** Primeval Intuition */
//Primeval Intuition increases max focus to 120
export const PRIMEVAL_INTUITION_MAX_FOCUS_SV = 120;
//Primeval Intuition increased crit stacks up to 5 times
export const MAX_PRIMEVAL_INTUITION_STACKS = 5;
//endregion