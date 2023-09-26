class Garage {

    constructor(id, parkingSpacesPerVehicle) {

        this.id = id
        this.vehiclesParked = this.loadFromLocalStorage()

        for (const key in parkingSpacesPerVehicle) {
            this[key] = parkingSpacesPerVehicle[key]
            if (Object.keys(this.vehiclesParked).length < Object.keys(parkingSpacesPerVehicle).length)
                this.vehiclesParked[key] = []
        }
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

    static placeholderArr = ['motorcycle', 'car', 'bicycle', 'bus', 'truck', 'plane']

    static createNewInput = () => {
        const typeInput = document.createElement('input')
        const slotInput = document.createElement('input')
        const trashCan = document.createElement('i')

        listCreatedVehiclesDiv.append(typeInput)
        listCreatedVehiclesDiv.append(slotInput)
        listCreatedVehiclesDiv.append(trashCan)

        typeInput.classList.add('added-inputs')
        slotInput.classList.add('added-inputs')

        typeInput.type = 'text'
        typeInput.maxLength = 10
        typeInput.placeholder = this.placeholderArr[Math.floor(Math.random() * this.placeholderArr.length)]
        slotInput.type = 'number'
        slotInput.value = 1
        slotInput.min = 1

        trashCan.classList.add('fa-regular', 'fa-trash-can')

        console.log(trashCans)
    }

    static createGarageProperties = () => {
        const garageSlots = {}

        const addedInputs = document.querySelectorAll('.added-inputs')

        for (let i = 0; i < addedInputs.length; i += 2) {
            if (addedInputs[i].value !== '' && addedInputs[i + 1] !== '')
                garageSlots[addedInputs[i].value] = addedInputs[i + 1].value
        }

        return garageSlots
    }
}

class Vehicle {
    constructor({ registration, model, brand, numberOfWheels }) {
        this.registration = registration
        this.model = model
        this.brand = brand
        this.numberOfWheels = numberOfWheels
    }

    static createNewType = (typeName) => {
        return class extends Vehicle {
            static name = typeName
            constructor(args) {
                super(args)
            }
        }
    }
}

const Car = Vehicle.createNewType('Car')
const Bike = Vehicle.createNewType('Bike')
const Truck = Vehicle.createNewType('Truck')

const addVehicleSlotBtn = document.querySelector('#add-vehicle-slot-btn')
const createGarageBtn = document.querySelector('#create-garage-btn')
const vehicleNameInput = document.querySelector('#vehicle-name-input')
const vehicleSlotsInput = document.querySelector('#vehicle-slots-input')
const confirmCreationButton = document.querySelector('#confirm-creation-button')
const newVehicleSlotDialog = document.querySelector('#new-vehicle-slot-dialog')
const listCreatedVehiclesDiv = document.querySelector('#list-of-created-vehicles-div')
const form = document.querySelector('#form')

const addedVehiclesObj = {}

addVehicleSlotBtn.addEventListener('click', Garage.createNewInput)

const trashCans = document.getElementsByClassName('fa-trash-can')

Array.from(trashCans).forEach(can => {
    can.addEventListener('click', () => {
    })
})

createGarageBtn.addEventListener('click', () => {
    const garageIDInput = document.querySelector('#garage-id-input')
    if (garageIDInput.value) {
        const newGarage = new Garage(garageIDInput.value, Garage.createGarageProperties())
        console.log(newGarage)
    }
})

const bigGarage = new Garage(123, {
    car: 10,
    bike: 5,
    truck: 2,
})

const car1 = new Car({
    registration: 12788,
    model: 'altima',
    brand: 'nissan',
    numberOfWheels: 4,
})

const car2 = new Car({
    registration: 63124,
    model: 'polo',
    brand: 'volkswagen',
    numberOfWheels: 4,
})

const truck1 = new Truck({
    registration: 124124,
    model: 'xc40',
    brand: 'volvo',
    numberOfWheels: 4,
})

const bike1 = new Bike({
    registration: 66224,
    model: 'wmn',
    brand: 'canyon',
    numberOfWheels: 2,
})

bigGarage.add(car1)
bigGarage.add(car2)
bigGarage.add(bike1)
bigGarage.add(truck1)

bigGarage.remove(car1)
bigGarage.remove(bike1)

// bigGarage.findVehicleByRegistrationNumber(66224)
bigGarage.showAllVehiclesParked()
// bigGarage.showFreeParkingSpaces()

// bigGarage.resetGarageWithNewSlots = {
//     truck: 1,
//     car: 1,
// }



