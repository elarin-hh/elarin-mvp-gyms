export interface Gym {
	id: number;  // ID sequencial (1, 2, 3...)
	name: string;
	cnpj: string;
	email: string;
	phone: string;
	address: string;
	responsible_name: string;
	is_active: boolean;
	created_at: string;
}

export interface GymSession {
	access_token: string;
	refresh_token?: string;
	gym: Gym;
}

export interface GymUser {
	id: string;  // UUID do usuário (profiles)
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
