import SPELLS from 'common/SPELLS';
import EventLinkNormalizer, { EventLink } from 'parser/core/EventLinkNormalizer';
import { Options } from 'parser/core/Module';
import {
  CastEvent,
  DamageEvent,
  EventType,
  GetRelatedEvent,
  GetRelatedEvents,
  HasRelatedEvent,
  HealEvent,
  RemoveBuffEvent,
  AnyEvent,
} from 'parser/core/Events';
import { PUPIL_OF_ALEXSTRASZA_LINK } from 'analysis/retail/evoker/augmentation/modules/normalizers/CastLinkNormalizer';
import SPECS from 'game/SPECS';

export const LEAPING_FLAMES_HITS = 'leapingFlamesHits';
export const LEAPING_FLAMES_CONSUME = 'leapingFlamesConsume';
const LEAPING_FLAMES_CONSUME_BUFFER = 35;

export const LIVING_FLAME_CAST_HIT = 'livingFlameCastHit';
const LIVING_FLAME_HIT_BUFFER = 1000; // LF has travel time

export const EB_FROM_LF_CAST = 'ebFromLFCast';
export const EB_FROM_LF_HEAL = 'ebFromLFHeal';
export const EB_WASTE_FROM_LF_CAST = 'ebWasteFromLFCast';
export const EB_WASTE_FROM_LF_HEAL = 'ebWasteFromLFHeal';
const BACKWARDS_BUFFER = 10;

const EVENT_LINKS: EventLink[] = [
  {
    linkRelation: LEAPING_FLAMES_CONSUME,
    reverseLinkRelation: LEAPING_FLAMES_CONSUME,
    linkingEventId: SPELLS.LIVING_FLAME_CAST.id,
    linkingEventType: EventType.Cast,
    referencedEventId: SPELLS.LEAPING_FLAMES_BUFF.id,
    referencedEventType: EventType.RemoveBuff,
    anyTarget: true,
    forwardBufferMs: LEAPING_FLAMES_CONSUME_BUFFER,
    backwardBufferMs: LEAPING_FLAMES_CONSUME_BUFFER,
  },
  {
    linkRelation: LIVING_FLAME_CAST_HIT,
    reverseLinkRelation: LIVING_FLAME_CAST_HIT,
    linkingEventId: SPELLS.LIVING_FLAME_CAST.id,
    linkingEventType: EventType.Cast,
    referencedEventId: [SPELLS.LIVING_FLAME_DAMAGE.id, SPELLS.LIVING_FLAME_HEAL.id],
    referencedEventType: [EventType.Damage, EventType.Heal],
    forwardBufferMs: LIVING_FLAME_HIT_BUFFER,
    backwardBufferMs: BACKWARDS_BUFFER,
    maximumLinks: 1,
    additionalCondition(_linkingEvent, referencedEvent) {
      /** Condition to ensure that we only ever link unique hits to cast
       * LF has travel time so you can technically cast back-to-back before
       * the first LF hits */
      return !HasRelatedEvent(referencedEvent, LIVING_FLAME_CAST_HIT);
    },
  },
  {
    linkRelation: LEAPING_FLAMES_HITS,
    reverseLinkRelation: LEAPING_FLAMES_HITS,
    linkingEventId: SPELLS.LIVING_FLAME_CAST.id,
    linkingEventType: EventType.Cast,
    referencedEventId: [SPELLS.LIVING_FLAME_DAMAGE.id, SPELLS.LIVING_FLAME_HEAL.id],
    referencedEventType: [EventType.Damage, EventType.Heal],
    anyTarget: true,
    forwardBufferMs: LIVING_FLAME_HIT_BUFFER,
    // Specifically heal hits on yourself / really close targets can show up prior
    // can be seen here at 0:30
    // /report/vDVJKnwGmAM9tCQN/48-Mythic+Volcoross+-+Kill+(2:49)/Vollmer/standard/events
    backwardBufferMs: BACKWARDS_BUFFER,
    additionalCondition(linkingEvent, referencedEvent) {
      if (!HasRelatedEvent(linkingEvent, LEAPING_FLAMES_CONSUME)) {
        return false;
      }

      return (
        !HasRelatedEvent(referencedEvent, PUPIL_OF_ALEXSTRASZA_LINK) &&
        !HasRelatedEvent(referencedEvent, LIVING_FLAME_CAST_HIT)
      );
    },
  },
];

class LeapingFlamesNormalizer extends EventLinkNormalizer {
  constructor(options: Options) {
    super(options, EVENT_LINKS);

    /** To more easily avoid adding extra unwanted links for what generated an EB
     * we need to make sure that this normalizer runs after Devas and Augs CastLinkNormalizers
     * This is due to us defining EB sources from talents such as Arcane Vigor and Anachronism
     * I think a more ideal solution in the long term is to make a shared EB normalizer so we
     * wouldn't need to worry about setting priority and could set a dependency directly
     * (we can't set dependencies to the different normalizers since we will only ever run one of them)
     *
     * Preservation CastLinkNormalizer relies on the links set in this normalizer so we don't
     * change the priority for them */
    const curSpec = this.selectedCombatant.spec;
    if (curSpec === SPECS.DEVASTATION_EVOKER || curSpec === SPECS.AUGMENTATION_EVOKER) {
      this.priority = 101;
    }
  }
}
export function getLeapingEvents<T extends EventType.Damage | EventType.Heal>(
  event: CastEvent,
  filter?: T,
): AnyEvent<T>[] {
  const events = GetRelatedEvents<AnyEvent<T>>(
    event,
    LEAPING_FLAMES_HITS,
    filter ? (e): e is AnyEvent<T> => e.type === filter : undefined,
  );

  return events;
}
export function getLivingFlameCastHit(event: CastEvent): HealEvent | DamageEvent | undefined {
  return GetRelatedEvent(
    event,
    LIVING_FLAME_CAST_HIT,
    (e): e is HealEvent | DamageEvent => e.type === EventType.Heal || e.type === EventType.Damage,
  );
}

export function isFromLeapingFlames(event: CastEvent | DamageEvent | HealEvent) {
  return (
    HasRelatedEvent(event, LEAPING_FLAMES_CONSUME) || HasRelatedEvent(event, LEAPING_FLAMES_HITS)
  );
}

export function getLeapingCast(event: RemoveBuffEvent): CastEvent | undefined {
  return GetRelatedEvent(
    event,
    LEAPING_FLAMES_CONSUME,
    (e): e is CastEvent => e.type === EventType.Cast,
  );
}

export default LeapingFlamesNormalizer;
