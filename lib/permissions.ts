
export type Tier = 'FREE' | 'BASIC' | 'VIP' | 'GOLD' | 'ADMIN';

const TIER_LEVELS: Record<string, number> = {
    'FREE': 0,
    'BASIC': 1,
    'VIP': 2,
    'GOLD': 2, // Equivalent to VIP
    'ADMIN': 99
};

export function hasAccess(userTier: string | null | undefined, minTier: string): boolean {
    const userLevel = TIER_LEVELS[userTier || 'FREE'] || 0;
    const requiredLevel = TIER_LEVELS[minTier || 'FREE'] || 0;
    return userLevel >= requiredLevel;
}
