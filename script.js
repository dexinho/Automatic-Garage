class Garage {
    constructor(id, parkingSpacesPerVehicle) {

        this.id = id
        this.vehiclesParked = this.loadFromLocalStorage()

        for (const key in parkingSpacesPerVehicle) {
            this[key] = parkingSpacesPerVehicle[key]
            if (Object.keys(this.vehiclesParked).length < Object.keys(parkingSpacesPerVehicle).length)
                this.vehiclesParked[key] = []
        }

        // this.freezeObject()
    }

    loadFromLocalStorage() {
        return JSON.parse(localStorage.getItem(this.id)) || {}
    }

    saveToLocalStorage = () => {
        localStorage.setItem(this.id, JSON.stringify(this.vehiclesParked))
    }

    add = (vehicle) => {
        const vehicleType = vehicle.constructor.name.toLowerCase()
        const allVehiclesParked = this.vehiclesParked // da li se moze vani deklarisati da se ne bi svaki put deklarisalo unutar metoda

        if (allVehiclesParked[vehicleType]?.length < this[vehicleType]
            && allVehiclesParked[vehicleType]?.every(el => el.registration !== vehicle.registration)) {
            allVehiclesParked[vehicleType].push(vehicle)
            console.log(`${vehicleType[0].toUpperCase() + vehicleType.slice(1)} is parked with registration number: ${vehicle.registration}`)
        }
        else if (allVehiclesParked[vehicleType]?.length > this[vehicleType]) console.log(`There is no more parking space for ${vehicleType}s`)
        else console.log(`${vehicleType} already parked!`)

        this.saveToLocalStorage()
    }


    remove = (vehicle) => {
        const vehicleType = vehicle.constructor.name.toLowerCase()
        const allVehiclesParked = this.vehiclesParked

        allVehiclesParked[vehicleType] = allVehiclesParked[vehicleType]?.filter(el => {
            if (el.registration === vehicle.registration) {
                console.log(`${vehicle.constructor.name} is removed with registration number: ${vehicle.registration}`)
                return false
            }
            return true
        })

        this.saveToLocalStorage()
    }

    findVehicleByRegistrationNumber = (registrationNumber) => {
        const allVehiclesParked = this.vehiclesParked
        for (const vehicleType in allVehiclesParked) {
            if (allVehiclesParked[vehicleType].find(vehicle => vehicle.registration === registrationNumber)) {
                console.log(JSON.stringify(allVehiclesParked[vehicleType].find(vehicle => vehicle.registration === registrationNumber),
                    (key, value) => {
                        return key === '' ? { type: vehicleType, ...value } : value
                    }, 2))
                return
            }
        }

        return `There is no vehicle parked with ${registrationNumber} registration number`
    }

    showAllVehiclesParked = () => {
        const allVehiclesParked = this.vehiclesParked

        if (Object.values(allVehiclesParked).length < 1) {
            console.log('There are no vehicles parked')
            return
        }

        for (const vehicleType in allVehiclesParked) {
            allVehiclesParked[vehicleType].forEach(vehicle => {
                console.log(JSON.stringify(vehicle,
                    (key, value) => {
                        return key === '' ? { type: vehicleType, ...value } : value
                    }, 2))
            })
        }
    }

    showFreeParkingSpaces = () => {
        const allVehiclesParked = this.vehiclesParked
        for (const vehicleType in allVehiclesParked) {
            console.log(`${vehicleType}: ${this[vehicleType] - allVehiclesParked[vehicleType]?.length}`)
        }
    }

    set resetGarageWithNewSlots(newValues) {

        const allVehiclesParked = this.vehiclesParked

        for (const vehicleType in allVehiclesParked) {
            delete this[vehicleType]
            delete allVehiclesParked[vehicleType]
        }

        for (const key in newValues) {
            this[key] = newValues[key]
            allVehiclesParked[key] = []
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
}

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

class Helicopter extends Vehicle {
    constructor(heliProperties) {
        super(heliProperties)
    }
}

const bigGarage = new Garage(111, {
    bike: 10,
    car: 10,
    truck: 5,
    helicopter: 2,
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

const heli1 = new Helicopter({
    registration: 66224,
    model: '2aa',
    brand: 's',
    numberOfWheels: 20,
})

bigGarage.add(car1)
bigGarage.add(car2)
bigGarage.add(truck1)
bigGarage.add(heli1)

// bigGarage.findVehicleByRegistrationNumber(66224)
// bigGarage.showAllVehiclesParked()
// bigGarage.showFreeParkingSpaces()

// bigGarage.resetGarageWithNewSlots = {
//     truck: 1,
//     car: 1,
// }


