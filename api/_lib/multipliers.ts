export const MULTIPLIERS: Record<string, Record<string, number>> = {
  opening_possession: { seahawks: 1.8, patriots: 2.0 },
  first_score_method: { sea_td: 2.0, sea_fg: 2.5, ne_td: 2.2, ne_fg: 2.7, safety: 12.0 },
  first_td_position: { wr: 1.6, rb: 2.0, te: 2.8, qb_rush: 5.0, def_st: 8.0 },
  scoring_pace: { under_35: 2.3, '35_to_50': 1.5, over_50: 2.8 },
  first_field_goal: { seahawks: 1.6, patriots: 2.2, no_fgs: 3.5 },
  final_outcome: { seahawks: 2.1, patriots: 1.9 },
  victory_margin: { '1_to_7': 2.0, '8_to_14': 1.8, '15_plus': 2.5 },
  overtime: { no: 1.2, yes: 5.0 },
  consecutive_scores: { '2_in_row': 2.0, '3_in_row': 3.0, '4_plus': 5.0 },
  seahawks_powerup: { super_speed: 2.0, force_field: 2.5, laser_arm: 3.0 },
  patriots_powerup: { super_speed: 2.0, magnet_hands: 2.5, xray_vision: 3.5 },
  powerup_timing: { opening_drive: 1.5, halftime: 2.5, clutch_time: 3.0 },
}

export const BASE_XP = 100

export function calculateXP(category: string, selection: string): number {
  const multiplier = MULTIPLIERS[category]?.[selection] || 1.0
  return Math.round(BASE_XP * multiplier)
}
