export interface Gym {
	id: number;
	name: string;
	cnpj: string;
	email: string;
	phone: string;
	address: string;
	responsible_name: string;
	is_active: boolean;
}

export interface GymSession {
	access_token: string;
	gym: Gym;
}

export interface GymUser {
	link_id: number;
	gym_id: number;
	user_id: string;
	full_name: string;
	email: string;
	avatar_url: string | null;
	height_cm: number | null;
	weight_kg: number | null;
	locale: string;
	status: 'active' | 'inactive';
	linked_at: string;
	link_updated_at: string;
	user_created_at: string;
}

export interface GymStats {
	total_users: number;
	active_users: number;
	inactive_users: number;
}

export interface RegisterGymData {
	name: string;
	cnpj: string;
	email: string;
	password: string;
	phone: string;
	address: string;
	responsible_name: string;
}

export interface LoginGymData {
	email: string;
	password: string;
}
