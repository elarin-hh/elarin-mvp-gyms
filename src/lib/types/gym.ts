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
	id: string;
	full_name: string;
	email: string;
	status: 'active' | 'inactive';
	linked_at: string;
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
