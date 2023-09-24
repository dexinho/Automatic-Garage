class Vehicle {
    constructor({ registration, model, brand, numberOfWheels }) {
        this.registration = registration
        this.model = model
        this.brand = brand
        this.numberOfWheels = numberOfWheels
    }
}

class Car extends Vehicle {
    constructor(carProperties) {
        super(carProperties)
    }
}

class Bike extends Vehicle {
    constructor(bikeProperties) {
        super(bikeProperties)
    }
}

class Truck extends Vehicle {
    constructor(truckProperties) {
        super(truckProperties)
    }
}

class Helikopter extends Vehicle {
    constructor(heliProperties) {
        super(heliProperties)
    }
}

class Garage {
    constructor(id, parkingSpacesPerVehicle) {

        this.allVehiclesParked = this.loadFromLocalStorage()

        for (const key in parkingSpacesPerVehicle) {
            this[key] = parkingSpacesPerVehicle[key]
            if (Object.keys(this.allVehiclesParked).length < Object.keys(parkingSpacesPerVehicle).length)
                this.allVehiclesParked[key] = []
        }

        this.id = id
        // this.freezeObject()
    }

    loadFromLocalStorage() {
        return JSON.parse(localStorage.getItem(this.id)) || {}
    }

    saveToLocalStorage = () => {
        localStorage.setItem(this.id, JSON.stringify(this.allVehiclesParked))
    }

    add = (vehicle) => {
        const vehicleType = vehicle.constructor.name.toLowerCase()
        const allVehiclesParked = this.allVehiclesParked // da li se moze vani deklarisati da se ne bi svaki put deklarisala unutar metoda

        if (allVehiclesParked[vehicleType].length <= this[vehicleType]
            && allVehiclesParked[vehicleType].every(el => el.registration !== vehicle.registration)) {
            allVehiclesParked[vehicleType].push(vehicle)
            console.log(`${vehicleType[0].toUpperCase() + vehicleType.slice(1)} is parked with registration number: ${vehicle.registration}`)
        }
        else console.log(`There is no more parking space for ${vehicleType}s`)


        this.saveToLocalStorage()
    }


    remove = (vehicle) => {
        const vehicleType = vehicle.constructor.name.toLowerCase()
        const allVehiclesParked = this.allVehiclesParked

        allVehiclesParked[vehicleType] = allVehiclesParked[vehicleType].filter(el => {
            if (el.registration === vehicle.registration) {
                console.log(`${vehicle.constructor.name} is removed with registration number: ${vehicle.registration}`)
                return false
            }
            return true
        })

        this.saveToLocalStorage()
    }

    findVehicleByRegistrationNumber = (registrationNumber) => {
        const allVehiclesParked = this.allVehiclesParked
        for (const vehicleType in allVehiclesParked) {
            if (allVehiclesParked[vehicleType].find(vehicle => vehicle.registration === registrationNumber))
                return JSON.stringify(allVehiclesParked[vehicleType].find(vehicle => vehicle.registration === registrationNumber),
                    (key, value) => {
                        return key === '' ? { type: vehicleType, ...value } : value
                    }, 2)
        }

        return `There is no vehicle parked with ${registrationNumber} registration number`
    }

    showAllVehiclesParked = () => {
        const allVehiclesParked = this.allVehiclesParked
        for (const vehicleType in allVehiclesParked) {
            allVehiclesParked[vehicleType].forEach(vehicle => {
                console.log(JSON.stringify(vehicle,
                    (key, value) => {
                        return key === '' ? { type: vehicleType, ...value } : value
                    }, 2))
            })
        }
    }

    freezeObject() {
        // for (const key in this) {
        //     Object.defineProperties(this, {
        //         [key]: {
        //             configurable: false,
        //             writable: false,
        //             enumerable: false,
        //         },
        //     })
        // }
        Object.freeze(this)
    }

    showFreeParkingSpaces = () => {
        const allVehiclesParked = this.allVehiclesParked
        for (const vehicleType in allVehiclesParked) {
            console.log(`${vehicleType}: ${this[vehicleType] - allVehiclesParked[vehicleType].length}`)
        }
    }

    set updateGarageSlots(newValues) {

        const allVehiclesParked = this.allVehiclesParked

        for (const vehicleType in allVehiclesParked) {
            delete this[vehicleType]
            if (!newValues.hasOwnProperty(vehicleType)) delete allVehiclesParked[vehicleType]
        }

        for (const key in newValues) {
            this[key] = newValues[key]
        }
    }
}

const bigGarage = new Garage(111, {
    bike: 10,
    car: 10,
    truck: 5,
})

const car1 = new Car({
    registration: 123124124124,
    model: '22',
    brand: '2111',
    numberOfWheels: 20,
})

const car2 = new Car({
    registration: 13224124,
    model: 'aa',
    brand: 's',
    numberOfWheels: 20,
})

const truck1 = new Truck({
    registration: 124124,
    model: 'BB',
    brand: 's',
    numberOfWheels: 20,
})

const bike1 = new Bike({
    registration: 6624,
    model: '2aa',
    brand: 's',
    numberOfWheels: 20,
})


bigGarage.add(car1)
bigGarage.add(car2)
bigGarage.add(truck1)
bigGarage.add(bike1)

bigGarage.remove(car2)

// bigGarage.showAllVehiclesParked()

bigGarage.updateGarageSlots = {
    truck: 0
}

bigGarage.showAllVehiclesParked()

// bigGarage.updateGarageSlots = {
//     helikopter: 44,
//     car: 55,
//     truck: 66,
// }

// bigGarage.showFreeParkingSpaces()
