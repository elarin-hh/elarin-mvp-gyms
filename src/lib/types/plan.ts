/**
 * Plan Types
 * Based on backend API plans table
 */

export interface PlanFeatures {
	features: string[];
}

export interface Plan {
	id: number;
	name: string;
	registrations_limit: number;
	features: PlanFeatures;
	price_cents: number;
	is_active: boolean;
	created_at: string;
}

export interface PlanDisplay extends Plan {
	price_formatted: string;
	features_list: string[];
}
