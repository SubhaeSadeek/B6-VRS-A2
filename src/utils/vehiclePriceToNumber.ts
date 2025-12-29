export interface Vehicle {
	id: number;
	vehicle_name: string;
	type: "car" | "bike" | "van" | "SUV";
	registration_number: string;
	daily_rent_price: string;
	availability_status: "available" | "booked";
}

export const convertVehicleRentPriceIntoNumber = (vehicleData: Vehicle[]) => {
	const vehicles = vehicleData.map((vehicle: Vehicle) => {
		return { ...vehicle, daily_rent_price: Number(vehicle.daily_rent_price) };
	});
	return vehicles;
};
