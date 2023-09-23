class Vehicle {
    constructor({type, registrationNumber, model, brand, numberOfWheels }) {
        // this.type = type
        // this.registrationNumber = registrationNumber
        // this.model = model
        // this.brand = brand
        // this.numberOfWheels = numberOfWheels
        for (const key in arguments[0])
            this[key] = arguments[0][key]
    }
}

class Car extends Vehicle {
    constructor(characteristics) {
        super(characteristics)
    }
}

class Bike extends Vehicle {
    constructor(characteristics) {
        super(characteristics)
    }
}

class Truck extends Vehicle {
    constructor(characteristics) {
        super(characteristics)
    }
}

class Garage {
    #parkedCars = []
    #parkedBikes = []
    #parkedTrucks = []

    constructor({id, carParkingSpaces, bikeParkingSpaces, truckParkingSpaces }) {
        // this.id = id
        // this.carParkingSpaces = carParkingSpaces
        // this.bikeParkingSpaces = bikeParkingSpaces
        // this.truckParkingSpaces = truckParkingSpaces

        this.parkedVehicles = JSON.parse(localStorage.getItem(id)) || []
        for (const key in arguments[0]) {
            this[key] = arguments[0][key]
        }
    }

    add = (vehicle) => {
        if (vehicle instanceof Car && this.#parkedCars.length <= this.carParkingSpaces)
            this.#parkedCars.push(vehicle)
        else if (vehicle instanceof Bike && this.#parkedBikes.length <= this.carParkingSpaces)
            this.#parkedCars.push(vehicle)
        else if (vehicle instanceof Truck && this.#parkedTrucks.length <= this.carParkingSpaces)
            this.#parkedCars.push(vehicle)
        else console.log("There is no parking space")
    }

    remove = (vehicle) => {
        if (vehicle instanceof Car) {
            this.#parkedCars = this.#parkedCars
            .filter(machine => machine.registrationNumber !== vehicle.registrationNumber)
        }            
        else if (vehicle instanceof Bike) {
            this.#parkedBikes = this.#parkedBikes
            .filter(machine => machine.registrationNumber !== vehicle.registrationNumber)
        } 
        else if (vehicle instanceof Truck) {
            this.#parkedTrucks = this.#parkedTrucks
            .filter(machine => machine.registrationNumber !== vehicle.registrationNumber)
        }
    }

    findVehicleByRegistrationNumber = (number) => {
        return this.#parkedCars.find(vehicle => number === vehicle.registrationNumber)
        ?? this.#parkedBikes.find(vehicle => number === vehicle.registrationNumber)
        ?? this.#parkedTrucks.find(vehicle => number === vehicle.registrationNumber)
        ?? `There is no vehicle with ${number} registration number parked in the garage!`
    }

    showAllVehiclesParked = () => {

    }

    freeParkingSpaces = () => {

    }
}

const bigGarage = new Garage({
    id: 1,
    carParkingSpaces: 50,
    bikeParkingSpaces: 20,
    truckParkingSpaces: 10
})

const car1 = new Car({
    type: 'car',
    registrationNumber: 1251521431232,
    model: 'sedan',
    brand: 'x5',
    numberOfWheels: 4,
})

const car2 = new Car({
    type: 'car',
    registrationNumber: 8512051215512,
    model: 'sedan',
    brand: 'x7',
    numberOfWheels: 4,
})

bigGarage.add(car1)
bigGarage.add(car2)

bigGarage.remove(car2)

console.log('GARAZA', bigGarage)
console.log(bigGarage.findVehicleByRegistrationNumber(1251521431232))
// console.log(bigGarage)