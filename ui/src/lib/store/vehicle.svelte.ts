export const vehicleState = $state({
	showing: false,
	ignition: false,
	nos: 0,
	speed: 0,
	rpm: 0,
	speedMeasure: 'MPH',
	seatbelt: false,
	seatbeltHide: false,
	cruise: false,
	checkEngine: false,
	fuel: 0,
	fuelHide: false,
	leftSignal: false,
	rightSignal: false,
	headlights: false,
	doorLock: false,
	mileage: null as number | null,
});

export function handleVehicleMessage(type: string, data: Record<string, unknown>) {
	switch (type) {
		case 'SHOW_VEHICLE':
			vehicleState.showing = true;
			break;
		case 'HIDE_VEHICLE':
			vehicleState.showing = false;
			break;
		case 'UPDATE_IGNITION':
			vehicleState.ignition = !!data.ignition;
			break;
		case 'UPDATE_RPM':
			vehicleState.rpm = data.rpm as number;
			break;
		case 'UPDATE_SPEED':
			vehicleState.speed = data.speed as number;
			break;
		case 'UPDATE_SPEED_MEASURE':
			vehicleState.speedMeasure = data.measurement as string;
			break;
		case 'UPDATE_SEATBELT':
			vehicleState.seatbelt = !!data.seatbelt;
			break;
		case 'SHOW_SEATBELT':
			vehicleState.seatbeltHide = false;
			break;
		case 'HIDE_SEATBELT':
			vehicleState.seatbeltHide = true;
			break;
		case 'UPDATE_CRUISE':
			vehicleState.cruise = !!data.cruise;
			break;
		case 'UPDATE_ENGINELIGHT':
			vehicleState.checkEngine = !!data.checkEngine;
			break;
		case 'UPDATE_FUEL':
			if (data.fuel) vehicleState.fuel = data.fuel as number;
			if (typeof data.fuelHide === 'boolean') vehicleState.fuelHide = data.fuelHide;
			break;
		case 'SHOW_FUEL':
			vehicleState.fuelHide = false;
			break;
		case 'HIDE_FUEL':
			vehicleState.fuelHide = true;
			break;
		case 'UPDATE_NOS':
			vehicleState.nos = data.nos as number;
			break;
		case 'UPDATE_SIGNALS':
			vehicleState.leftSignal = !!data.leftSignal;
			vehicleState.rightSignal = !!data.rightSignal;
			vehicleState.headlights = !!data.headlights;
			vehicleState.doorLock = !!data.doorLock;
			vehicleState.mileage = typeof data.mileage === 'number' ? data.mileage : null;
			break;
	}
}
