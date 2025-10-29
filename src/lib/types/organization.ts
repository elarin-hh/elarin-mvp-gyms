/**
 * Organization Types
 * Based on backend API at: C:\Users\Guilherme\Documents\Elarin-projects\elarin-backend-api
 */

export interface Organization {
	id: number;
	name: string;
	code: string;
	federal_tax_id: string;
	email: string;
	phone: string;
	address: string;
	responsible_name: string;
	plan_id: number | null;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface OrganizationSession {
	access_token: string;
	organization: Organization;
}

export type MembershipStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE';

export interface OrganizationUser {
	id: number;
	user_id: number;
	organization_id: number;
	role: string;
	status: MembershipStatus;
	is_active: boolean; // Kept for backward compatibility
	created_at: string;
	users: {
		id: number;
		email: string;
		full_name: string;
		avatar_url: string | null;
		created_at: string;
	};
}

export interface OrganizationStats {
	total_users: number;
	active_users: number;
	inactive_users: number;
	pending_users: number;
}

export interface RegisterOrganizationData {
	name: string;
	federal_tax_id: string;
	email: string;
	password: string;
	phone: string;
	address: string;
	responsible_name: string;
	plan_id: number;
}

export interface LoginOrganizationData {
	email: string;
	password: string;
}
