/* eslint-disable @typescript-eslint/no-unused-vars */
import SPELLS from 'common/SPELLS/evoker';
import TALENTS from 'common/TALENTS/evoker';
import EventLinkNormalizer, { EventLink } from 'parser/core/EventLinkNormalizer';
import {
  AnyEvent,
  ApplyBuffEvent,
  ApplyBuffStackEvent,
  EventType,
  GetRelatedEvent,
  GetRelatedEvents,
  HasRelatedEvent,
  HealEvent,
  RefreshBuffEvent,
  RemoveBuffEvent,
  RemoveBuffStackEvent,
} from 'parser/core/Events';
import { Options } from 'parser/core/Module';
import { EB_BUFF_IDS } from '../../constants';

export const EB_GENERATION_EVENT_TYPES = [
  EventType.RefreshBuff,
  EventType.ApplyBuffStack,
  EventType.ApplyBuff,
];
type AnyBuffEvent =
  | ApplyBuffEvent
  | RefreshBuffEvent
  | ApplyBuffStackEvent
  | RemoveBuffEvent
  | RemoveBuffStackEvent;

export const EB_FROM_PRESCIENCE = 'ebFromPrescience';
export const EB_FROM_ARCANE_VIGOR = 'ebFromArcaneVigor';
export const EB_FROM_LF_CAST = 'ebFromLFCast';
export const EB_FROM_LF_HEAL = 'ebFromLFHeal'; // Specifically used for Leaping Flames analysis
const ESSENCE_BURST_BUFFER = 40; // Sometimes the EB comes a bit early/late
const EB_LF_CAST_BUFFER = 1000;

const EVENT_LINKS: EventLink[] = [
  {
    linkRelation: EB_FROM_ARCANE_VIGOR,
    reverseLinkRelation: EB_FROM_ARCANE_VIGOR,
    linkingEventId: SPELLS.SHATTERING_STAR.id,
    linkingEventType: EventType.Cast,
    referencedEventId: EB_BUFF_IDS,
    referencedEventType: EB_GENERATION_EVENT_TYPES,
    anyTarget: true,
    forwardBufferMs: ESSENCE_BURST_BUFFER,
    backwardBufferMs: ESSENCE_BURST_BUFFER,
    maximumLinks: 1,
    isActive(c) {
      return c.hasTalent(TALENTS.ARCANE_VIGOR_TALENT);
    },
  },
  {
    linkRelation: EB_FROM_PRESCIENCE,
    reverseLinkRelation: EB_FROM_PRESCIENCE,
    linkingEventId: TALENTS.PRESCIENCE_TALENT.id,
    linkingEventType: EventType.Cast,
    referencedEventId: EB_BUFF_IDS,
    referencedEventType: EB_GENERATION_EVENT_TYPES,
    anyTarget: true,
    forwardBufferMs: ESSENCE_BURST_BUFFER,
    backwardBufferMs: ESSENCE_BURST_BUFFER,
    maximumLinks: 1,
    isActive: (c) => c.hasTalent(TALENTS.ANACHRONISM_TALENT),
  },
  {
    linkRelation: EB_FROM_LF_CAST,
    reverseLinkRelation: EB_FROM_LF_CAST,
    linkingEventId: SPELLS.LIVING_FLAME_CAST.id,
    linkingEventType: EventType.Cast,
    referencedEventId: EB_BUFF_IDS,
    referencedEventType: EB_GENERATION_EVENT_TYPES,
    forwardBufferMs: EB_LF_CAST_BUFFER,
    backwardBufferMs: ESSENCE_BURST_BUFFER,
    anyTarget: true,
    additionalCondition(_linkingEvent, referencedEvent) {
      return hasNoGenerationLink(referencedEvent as AnyBuffEvent);
    },
  },
  /** Link used for Leaping Flames analysis */
  {
    linkRelation: EB_FROM_LF_HEAL,
    reverseLinkRelation: EB_FROM_LF_HEAL,
    linkingEventId: SPELLS.LIVING_FLAME_HEAL.id,
    linkingEventType: EventType.Heal,
    referencedEventId: EB_BUFF_IDS,
    referencedEventType: EB_GENERATION_EVENT_TYPES,
    anyTarget: true,
    forwardBufferMs: ESSENCE_BURST_BUFFER,
    backwardBufferMs: ESSENCE_BURST_BUFFER,
    maximumLinks: 1,
    additionalCondition(linkingEvent, referencedEvent) {
      if (
        !hasNoGenerationLink(referencedEvent as AnyBuffEvent) ||
        (linkingEvent as HealEvent).amount <= 0
      ) {
        // Only effective heals can generated EB
        return false;
      }
      const lfCastEvent = GetRelatedEvent(referencedEvent, EB_FROM_LF_CAST);
      if (!lfCastEvent) {
        return true;
      }

      /** This is essentially just a simple check to see if the heal hit is more likely to have
       * generated the EB rather than a damage hit. */
      const castProcDiff = Math.abs(lfCastEvent.timestamp - referencedEvent.timestamp);
      const healProcDiff = Math.abs(linkingEvent.timestamp - referencedEvent.timestamp);

      return healProcDiff < castProcDiff;
    },
  },
  // link essence burst remove to a cast to track expirations vs consumptions
  /* {
    linkRelation: ESSENCE_BURST_CONSUME,
    reverseLinkRelation: ESSENCE_BURST_CONSUME,
    linkingEventId: SPELLS.ESSENCE_BURST_BUFF.id,
    linkingEventType: [EventType.RemoveBuff, EventType.RemoveBuffStack],
    referencedEventId: [
      SPELLS.EMERALD_BLOSSOM_CAST.id,
      SPELLS.DISINTEGRATE.id,
      TALENTS_EVOKER.ECHO_TALENT.id,
    ],
    referencedEventType: EventType.Cast,
    anyTarget: true,
    forwardBufferMs: CAST_BUFFER_MS,
    backwardBufferMs: CAST_BUFFER_MS,
    isActive(c) {
      return c.hasTalent(TALENTS_EVOKER.ESSENCE_BURST_PRESERVATION_TALENT);
    },
  },
  {
    linkRelation: ESSENCE_BURST_LINK,
    reverseLinkRelation: ESSENCE_BURST_LINK,
    linkingEventId: SPELLS.ESSENCE_BURST_BUFF.id,
    linkingEventType: [EventType.ApplyBuffStack, EventType.ApplyBuff],
    referencedEventId: SPELLS.ESSENCE_BURST_BUFF.id,
    referencedEventType: [EventType.RemoveBuff, EventType.RemoveBuffStack],
    forwardBufferMs: MAX_ESSENCE_BURST_DURATION,
    maximumLinks: 1,
    isActive(c) {
      return c.hasTalent(TALENTS_EVOKER.ESSENCE_BURST_PRESERVATION_TALENT);
    },
    additionalCondition(linkingEvent, referencedEvent) {
      return !HasRelatedEvent(referencedEvent, ESSENCE_BURST_LINK);
    },
  }, */
];

export const EBSources = {
  Prescience: EB_FROM_PRESCIENCE,
  ArcaneVigor: EB_FROM_ARCANE_VIGOR,
  LivingFlameCast: EB_FROM_LF_CAST,
  LivingFlameHeal: EB_FROM_LF_HEAL,
} as const;
export type EBSource = typeof EBSources[keyof typeof EBSources];

const ebSourcesValues = Object.values(EBSources);
/** Get the source type for EB event */
export function getEBSource(event: AnyEvent): EBSource | undefined {
  return ebSourcesValues.find((source) => HasRelatedEvent(event, source));
}

/** Check if EB was generated by specific source type */
export function isEBFrom(event: AnyBuffEvent, source: EBSource): boolean {
  return HasRelatedEvent(event, source);
}

/** Get the source event for EB event */
export function getEBSourceEvent<T extends AnyEvent>(
  event: AnyEvent,
  source?: EBSource,
): T | undefined {
  const link = source ?? getEBSource(event);

  if (!link) {
    return;
  }
  return GetRelatedEvent(event, link);
}

export function getAllEBEvents(event: AnyEvent, source?: EBSource): AnyBuffEvent[] {
  const link = source ?? getEBSource(event);
  if (!link) {
    return [];
  }

  const ebEvents: AnyBuffEvent[] = GetRelatedEvents(event, link);
  return ebEvents;
}
export function getGeneratedEBEvents(
  event: AnyEvent,
  source?: EBSource,
): (ApplyBuffEvent | ApplyBuffStackEvent)[] {
  const ebEvents = getAllEBEvents(event, source);

  const generatedEbEvents = ebEvents.filter(
    (e): e is ApplyBuffEvent | ApplyBuffStackEvent =>
      e.type === EventType.ApplyBuff || e.type === EventType.ApplyBuffStack,
  );
  return generatedEbEvents;
}
export function getWastedEBEvents(event: AnyEvent, source?: EBSource): RefreshBuffEvent[] {
  const ebEvents = getAllEBEvents(event, source);

  const wastedEbEvents = ebEvents.filter(
    (e): e is RefreshBuffEvent => e.type === EventType.RefreshBuff,
  );
  return wastedEbEvents;
}

export function eventGeneratedEB(event: AnyEvent, source?: EBSource) {
  return Boolean(getGeneratedEBEvents(event, source).length);
}
export function eventWastedEB(event: AnyEvent, source?: EBSource) {
  return Boolean(getWastedEBEvents(event, source).length);
}

/** More deterministic links should be placed above less deterministic links and be added to this filter
 * eg.
 * Arcane Vigor from Devastation makes Shattering Star casts produce a guaranteed EB.
 *
 * Whilst Living Flame has a chance to produce an EB on cast/heal hits, which shouldn't inherently be a problem,
 * but due to LF having travel time and how the EB calculation for it works the damage procced EB will always
 * come on cast, but the heal hits will come on the actual hits (sometimes it will proc on cast even when there is travel time).
 * There are also talents/tier sets that produce extra LFs which only makes it harder to specify the exact source.
 *
 * example:
 * 1. LF Heal hit lands just as you use Shattering Star, generating an EB that potentially could be from both.
 *    In this example Arcane Vigor makes the EB gen 100% and as such would take precedence.
 *    Any subsequent EB would then be attributed to the LF hit.
 *
 * Therefore to ensure proper link association, you would place the Arcane Vigor link above the LF link
 * and add it to this filter.
 *
 * Note that the links from LF are not added here, this is deliberate, due to LF gen being less deterministic
 * when trying to ascertain whether the EB was from cast(damage hit) or heal hit, both could be possible.
 * And for analysis for talents such as Leaping Flames, we want to be able to tell if it could be from both. */
function hasNoGenerationLink(event: AnyBuffEvent) {
  const curLink = getEBSource(event);
  return curLink !== EBSources.ArcaneVigor && curLink !== EBSources.Prescience;
}

class EssenceBurstCastLinkNormalizer extends EventLinkNormalizer {
  constructor(options: Options) {
    super(options, EVENT_LINKS);
  }
}

export default EssenceBurstCastLinkNormalizer;
