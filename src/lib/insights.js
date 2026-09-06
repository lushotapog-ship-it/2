import { MASTERS } from './masterIndex';
import { isDue, daysOverdue } from './srs';

// Cards due for review today (either English or Chinese mode), most overdue first.
export function dueToday(perMaster, poolIds) {
  const pool = new Set(poolIds);
  const due = [];
  for (const id of Object.keys(perMaster)) {
    if (!pool.has(id)) continue;
    const rec = perMaster[id];
    for (const mode of ['en', 'zh']) {
      const card = rec?.[mode];
      if (isDue(card)) due.push({ id, mode, overdue: daysOverdue(card) });
    }
  }
  return due.sort((a, b) => b.overdue - a.overdue);
}

// Masters the learner rarely practises or gets wrong often — a gentle nudge list,
// not a hard block. Never-attempted masters (in the current pool) come first,
// tier 1/2 (higher priority) masters are surfaced before tier 3.
export function unfamiliarMasters(perMaster, poolIds, limit = 10) {
  const byId = new Map(MASTERS.map((m) => [m.id, m]));
  const scored = [];
  for (const id of poolIds) {
    const master = byId.get(id);
    if (!master) continue;
    const rec = perMaster[id] || {};
    const enCard = rec.en;
    const zhCard = rec.zh;
    const totalSeen = (enCard?.seen || 0) + (zhCard?.seen || 0);
    const totalWrong = (enCard?.wrong || 0) + (zhCard?.forgot || 0);
    const wrongRate = totalSeen ? totalWrong / totalSeen : 0;
    if (totalSeen === 0) {
      scored.push({ id, reason: 'never', tier: master.tier, weight: 100 - master.tier });
    } else if (totalSeen >= 2 && wrongRate >= 0.5) {
      scored.push({ id, reason: 'weak', tier: master.tier, weight: wrongRate * 50 - master.tier });
    }
  }
  return scored.sort((a, b) => b.weight - a.weight).slice(0, limit);
}

export function topMisspellings(misspellings, limit = 20) {
  return Object.entries(misspellings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export function overallStats(perMaster, poolIds) {
  let attempted = 0;
  let mastered = 0; // box >= 3 in either mode
  for (const id of poolIds) {
    const rec = perMaster[id];
    if (!rec) continue;
    const enSeen = rec.en?.seen || 0;
    const zhSeen = rec.zh?.seen || 0;
    if (enSeen || zhSeen) attempted += 1;
    if ((rec.en?.box || 0) >= 3 || (rec.zh?.box || 0) >= 3) mastered += 1;
  }
  return { total: poolIds.length, attempted, mastered };
}
