export interface CategoryOption {
  id: string
  label: string
  multiplier: number
}

export interface Category {
  id: string
  question: string
  options: CategoryOption[]
  tier: 'free' | 'superfan'
}

export const CATEGORIES: Category[] = [
  // Free Tier Categories
  {
    id: 'opening_possession',
    question: 'Who should score first in your story?',
    options: [
      { id: 'seahawks', label: 'Seattle Seahawks', multiplier: 1.8 },
      { id: 'patriots', label: 'New England Patriots', multiplier: 2.0 },
    ],
    tier: 'free',
  },
  {
    id: 'first_score_method',
    question: 'How does the first score happen?',
    options: [
      { id: 'sea_td', label: 'Seahawks Touchdown', multiplier: 2.0 },
      { id: 'sea_fg', label: 'Seahawks Field Goal', multiplier: 2.5 },
      { id: 'ne_td', label: 'Patriots Touchdown', multiplier: 2.2 },
      { id: 'ne_fg', label: 'Patriots Field Goal', multiplier: 2.7 },
      { id: 'safety', label: 'Safety', multiplier: 12.0 },
    ],
    tier: 'free',
  },
  {
    id: 'first_td_position',
    question: 'Who scores the first TD?',
    options: [
      { id: 'wr', label: 'Wide Receiver', multiplier: 1.6 },
      { id: 'rb', label: 'Running Back', multiplier: 2.0 },
      { id: 'te', label: 'Tight End', multiplier: 2.8 },
      { id: 'qb_rush', label: 'Quarterback Rush', multiplier: 5.0 },
      { id: 'def_st', label: 'Defensive/Special Teams', multiplier: 8.0 },
    ],
    tier: 'free',
  },
  {
    id: 'scoring_pace',
    question: 'How high-scoring should the game be?',
    options: [
      { id: 'under_35', label: 'Under 35 points (defensive battle)', multiplier: 2.3 },
      { id: '35_to_50', label: '35-50 points (balanced)', multiplier: 1.5 },
      { id: 'over_50', label: 'Over 50 points (shootout!)', multiplier: 2.8 },
    ],
    tier: 'free',
  },
  {
    id: 'first_field_goal',
    question: 'Who kicks the first field goal?',
    options: [
      { id: 'seahawks', label: 'Seattle Seahawks', multiplier: 1.6 },
      { id: 'patriots', label: 'New England Patriots', multiplier: 2.2 },
      { id: 'no_fgs', label: 'No field goals in the show', multiplier: 3.5 },
    ],
    tier: 'free',
  },
  {
    id: 'final_outcome',
    question: 'Who wins in your story?',
    options: [
      { id: 'seahawks', label: 'Seattle Seahawks', multiplier: 2.1 },
      { id: 'patriots', label: 'New England Patriots', multiplier: 1.9 },
    ],
    tier: 'free',
  },
  {
    id: 'victory_margin',
    question: 'How close is the final score?',
    options: [
      { id: '1_to_7', label: '1-7 points (nail-biter!)', multiplier: 2.0 },
      { id: '8_to_14', label: '8-14 points (solid win)', multiplier: 1.8 },
      { id: '15_plus', label: '15+ points (blowout)', multiplier: 2.5 },
    ],
    tier: 'free',
  },
  {
    id: 'overtime',
    question: 'Should the game go to overtime?',
    options: [
      { id: 'no', label: 'No - ends in regulation', multiplier: 1.2 },
      { id: 'yes', label: 'Yes - overtime drama!', multiplier: 5.0 },
    ],
    tier: 'free',
  },
  // Superfan Only Categories
  {
    id: 'consecutive_scores',
    question: 'Longest scoring streak by one team?',
    options: [
      { id: '2_in_row', label: '2 in a row', multiplier: 2.0 },
      { id: '3_in_row', label: '3 in a row', multiplier: 3.0 },
      { id: '4_plus', label: '4+ in a row', multiplier: 5.0 },
    ],
    tier: 'superfan',
  },
  {
    id: 'seahawks_powerup',
    question: 'Which superpower does Seattle unleash?',
    options: [
      { id: 'super_speed', label: '⚡ Super Speed - Player moves 2x faster', multiplier: 2.0 },
      { id: 'force_field', label: '🛡️ Force Field - Block any tackle', multiplier: 2.5 },
      { id: 'laser_arm', label: '🔥 Laser Arm - Throws can\'t be intercepted', multiplier: 3.0 },
    ],
    tier: 'superfan',
  },
  {
    id: 'patriots_powerup',
    question: 'Which superpower does New England unleash?',
    options: [
      { id: 'super_speed', label: '⚡ Super Speed - Player moves 2x faster', multiplier: 2.0 },
      { id: 'magnet_hands', label: '🧲 Magnet Hands - 100% catch success', multiplier: 2.5 },
      { id: 'xray_vision', label: '👁️ X-Ray Vision - Perfect play read, guaranteed sack/INT', multiplier: 3.5 },
    ],
    tier: 'superfan',
  },
  {
    id: 'powerup_timing',
    question: 'When does the superpower activate?',
    options: [
      { id: 'opening_drive', label: '🎬 Opening Drive - Start strong', multiplier: 1.5 },
      { id: 'halftime', label: '⏰ Halftime Heroics - Final 2 min of 2nd quarter', multiplier: 2.5 },
      { id: 'clutch_time', label: '🏆 Clutch Time - 4th quarter only', multiplier: 3.0 },
    ],
    tier: 'superfan',
  },
]

export const FREE_CATEGORIES = CATEGORIES.filter(c => c.tier === 'free')
export const SUPERFAN_CATEGORIES = CATEGORIES.filter(c => c.tier === 'superfan')
