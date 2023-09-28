const addVehicleSlotBtn = document.querySelector('#add-vehicle-slot-btn')
const createGarageBtn = document.querySelector('#create-garage-btn')
const vehicleNameInput = document.querySelector('#vehicle-name-input')
const vehicleSlotsInput = document.querySelector('#vehicle-slots-input')
const confirmCreationButton = document.querySelector('#confirm-creation-button')
const newVehicleSlotDialog = document.querySelector('#new-vehicle-slot-dialog')
const listOfCreatedVehiclesDiv = document.querySelector('#list-of-created-vehicles-div')
const faTrashCans = document.getElementsByClassName('fa-trash-can')
const createNewGarageBtn = document.querySelector('#build-new-garage-btn')
const garageSelector = document.querySelector('#garage-selector')
const selectGarageContainer = document.querySelector('#select-garage-container')
const setupGarageContainer = document.querySelector('#setup-garage-container')
const returnToSelectBtn = document.querySelector('#return-to-select-btn')
const refreshSelectionBtn = document.querySelector('#refresh-selection-btn')
const garageID = document.querySelector('#garage-id-input')
const faShopSlash = document.querySelector('.fa-shop-slash')

class Garage {

    constructor(id, parkingSpacesPerVehicle) {

        this.id = id
        this.vehiclesParked = {}

        for (const key in parkingSpacesPerVehicle) {
            this[key] = parkingSpacesPerVehicle[key]
            if (Object.keys(this.vehiclesParked).length < Object.keys(parkingSpacesPerVehicle).length)
                this.vehiclesParked[key] = []
        }
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
        const { vehiclesParked } = this

        if (Object.values(vehiclesParked).length < 1) {
            console.log('There are no vehicles parked')
            return
        }

        for (const vehicleType in vehiclesParked) {
            vehiclesParked[vehicleType].forEach(vehicle => {
                console.log(JSON.stringify(vehicle,
                    (key, value) => {
                        return key === '' ? { type: vehicleType, ...value } : value
                    }, 2))
            })
        }
    }

    showFreeParkingSpaces = () => {
        const { vehiclesParked } = this
        for (const vehicleType in vehiclesParked) {
            console.log(`${vehicleType}: ${this[vehicleType] - vehiclesParked[vehicleType]?.length}`)
        }
    }

    set resetGarageWithNewSlots(newValues) {

        const { vehiclesParked } = this

        for (const vehicleType in vehiclesParked) {
            delete this[vehicleType]
            delete vehiclesParked[vehicleType]
        }

        for (const key in newValues) {
            this[key] = newValues[key]
            vehiclesParked[key] = []
        }
    }
}

class Form {

    static placeholderArr = ['motorcycle', 'car', 'bicycle', 'bus', 'truck', 'plane', 'tank']

    static updateTrashCanListeners = () => {
        Array.from(faTrashCans).forEach(can => {
            can.addEventListener('click', (e) => {

                const numberInput = e.target.previousElementSibling
                const textInput = numberInput.previousElementSibling

                listOfCreatedVehiclesDiv.removeChild(e.target)
                listOfCreatedVehiclesDiv.removeChild(numberInput)
                listOfCreatedVehiclesDiv.removeChild(textInput)

                e.stopImmediatePropagation()
            }, { once: true })
        })
    }

    static createNewInput = () => {
        const typeInput = document.createElement('input')
        const slotInput = document.createElement('input')
        const trashCan = document.createElement('i')

        listOfCreatedVehiclesDiv.append(typeInput)
        listOfCreatedVehiclesDiv.append(slotInput)
        listOfCreatedVehiclesDiv.append(trashCan)

        typeInput.classList.add('added-inputs')
        slotInput.classList.add('added-inputs')

        typeInput.type = 'text'
        typeInput.maxLength = 10
        typeInput.placeholder = this.placeholderArr[Math.floor(Math.random() * this.placeholderArr.length)]
        slotInput.type = 'number'
        slotInput.value = 1
        slotInput.min = 1
        slotInput.max = 1000

        trashCan.classList.add('fa-regular', 'fa-trash-can')
        this.updateTrashCanListeners()
    }

    static refreshInputs = () => {

        document.querySelector('#first-garage-input').value = ''
        document.querySelector('#second-garage-input').value = 1
        garageID.value = ''
        createGarageBtn.disabled = true

        while (listOfCreatedVehiclesDiv.childElementCount > 3) {
            listOfCreatedVehiclesDiv.removeChild(listOfCreatedVehiclesDiv.lastElementChild)
        }
    }

    static createProperties = () => {
        const addedInputs = document.querySelectorAll('.added-inputs')
        const garageSlots = {}

        if (garageID.value === '') return

        for (let i = 0; i < addedInputs.length; i += 2) {
            if (addedInputs[i].value !== '' && addedInputs[i + 1] !== '')
                garageSlots[addedInputs[i].value] = addedInputs[i + 1].value
        }

        return garageSlots
    }

    static removeChildren = (element) => {
        while (element.childElementCount > 1)
            element.removeChild(element.lastElementChild)
    }

    static showOrHideContinueAndSlashBtn = (garageSelector, continueBtn) => {
        if (garageSelector.value === 'select-garage') {
            faShopSlash.style.visibility = 'hidden'
            continueBtn.style.display = 'none'
        }
        else {
            continueBtn.style.display = 'block'
            faShopSlash.style.visibility = 'visible'
        }
    }

    static appendOptions = (garages) => {

        const garageSelector = document.querySelector('#garage-selector')
        const continueBtn = document.querySelector('#continue-btn')
        this.removeChildren(garageSelector)
        this.showOrHideContinueAndSlashBtn(garageSelector, continueBtn)

        garages.forEach(garage => {
            const newOption = document.createElement('option')
            newOption.value = garage.id
            newOption.innerText = garage.id
            garageSelector.appendChild(newOption)
        })

        garageSelector.addEventListener('change', (e) => {
            console.log(e.target.value)
            this.showOrHideContinueAndSlashBtn(garageSelector, continueBtn)
            e.stopImmediatePropagation()

            continueBtn.addEventListener('click', (e) => {
                e.stopImmediatePropagation()
            })
        })

        console.log(garages)

        this.saveToLocalStorage(garages)
    }

    static loadGaragesFromLocalStorage = () => {
        const garages = JSON.parse(localStorage.getItem('garages')) || []

        this.appendOptions(garages)
    }

    static saveToLocalStorage = (garages) => {
        localStorage.setItem('garages', JSON.stringify(garages))
    }

    static deleteFromLocalStorage = () => {
        const garageSelector = document.querySelector('#garage-selector')
        const filteredGarages = JSON.parse(localStorage.getItem('garages'))
            .filter(garage => garage.id !== garageSelector.value)

        this.appendOptions(filteredGarages)
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

const deleteDecisionDialog = document.querySelector('#delete-decision-dialog')
Form.loadGaragesFromLocalStorage()

faShopSlash.addEventListener('click', () => {
    const deletionChoiceButtons = document.querySelectorAll('.deletion-choice-btns')
    deleteDecisionDialog.showModal()

    deletionChoiceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.target.id === 'delete-yes-btn') {
                Form.deleteFromLocalStorage()
                deleteDecisionDialog.close()
            }
            else if (e.target.id === 'delete-no-btn') deleteDecisionDialog.close()

            e.stopImmediatePropagation()
        }, { once: true })
    })
})


addVehicleSlotBtn.addEventListener('click', Form.createNewInput)

garageID.addEventListener('change', () => {
    createGarageBtn.disabled = garageID.value === ''
})

createGarageBtn.addEventListener('click', () => {

    const GARAGES_IN_LOCAL_STORAGE = JSON.parse(localStorage.getItem('garages')) || []

    if (GARAGES_IN_LOCAL_STORAGE.every(garage => garage.id !== garageID.value)) {
        const properties = Form.createProperties()
        if (properties) {
            GARAGES_IN_LOCAL_STORAGE.push(new Garage(garageID.value, properties))
            Form.saveToLocalStorage(GARAGES_IN_LOCAL_STORAGE)
        }
    }

    console.log(GARAGES_IN_LOCAL_STORAGE)
})

createNewGarageBtn.addEventListener('click', () => {
    selectGarageContainer.style.display = 'none'
    setupGarageContainer.style.display = 'flex'
})

returnToSelectBtn.addEventListener('click', () => {
    setupGarageContainer.style.display = 'none'
    selectGarageContainer.style.display = 'flex'
    Form.loadGaragesFromLocalStorage()
})

refreshSelectionBtn.addEventListener('click', Form.refreshInputs)

// const bigGarage = new Garage(123, {
//     car: 10,
//     bike: 5,
//     truck: 2,
// })

// const car1 = new Car({
//     registration: 12788,
//     model: 'altima',
//     brand: 'nissan',
//     numberOfWheels: 4,
// })

// bigGarage.add(car1)

// bigGarage.remove(car1)

// bigGarage.findVehicleByRegistrationNumber(66224)
// bigGarage.showAllVehiclesParked()
// bigGarage.showFreeParkingSpaces()

// bigGarage.resetGarageWithNewSlots = {
//     truck: 1,
//     car: 1,
// }



