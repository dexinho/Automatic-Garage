const addVehicleSlotBtn = document.querySelector('#add-vehicle-slot-btn')
const createGarageBtn = document.querySelector('#create-garage-btn')
const vehicleNameInput = document.querySelector('#vehicle-name-input')
const vehicleSlotsInput = document.querySelector('#vehicle-slots-input')
const confirmCreationButton = document.querySelector('#confirm-creation-button')
const newVehicleSlotDialog = document.querySelector('#new-vehicle-slot-dialog')
const listOfCreatedVehiclesDiv = document.querySelector('#list-of-created-vehicles-div')
const faTrashCans = document.getElementsByClassName('fa-trash-can')
const buildNewGarage = document.querySelector('#build-new-garage-btn')
const garageSelector = document.getElementById('garage-selector')
const selectGarageContainer = document.querySelector('#select-garage-container')
const setupGarageContainer = document.querySelector('#setup-garage-container')
const returnToSelectBtn = document.querySelector('#return-to-select-btn')
const refreshSelectionBtn = document.querySelector('#refresh-selection-btn')
const garageID = document.querySelector('#garage-id-input')
const continueBtn = document.querySelector('#continue-btn')
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
        [...faTrashCans].forEach(can => {
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

        this.removeChildren(listOfCreatedVehiclesDiv, 3)
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

    static removeChildren = (element, limit = 1) => {
        while (element.childElementCount > limit)
            element.removeChild(element.lastElementChild)
    }

    static showOrHideContinueAndSlashBtn = () => {

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

        this.removeChildren(garageSelector)
        this.showOrHideContinueAndSlashBtn()

        garages.forEach(garage => {
            const newOption = document.createElement('option')
            newOption.value = garage.id
            newOption.innerText = garage.id
            garageSelector.appendChild(newOption)
        })

        console.log(garages)
    }

    static loadFromLocalStorage = (key) => {
        return JSON.parse(localStorage.getItem(key)) || []
    }

    static saveToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    }

    static deleteGarageFromLocalStorage = (ID) => {
        const filteredData =  JSON.parse(localStorage.getItem('garages'))
            .filter(garage => garage.id !== ID)
        
        this.saveToLocalStorage('garages', filteredData)

        return filteredData

    }

    static buildGarage = (garageID) => {
        const garages = this.loadFromLocalStorage('garages')
        console.log(garages)
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
const createdGarages = Form.loadFromLocalStorage('garages')
Form.appendOptions(createdGarages)

faShopSlash.addEventListener('click', () => {
    const deletionChoiceButtons = document.querySelectorAll('.deletion-choice-btns')
    deleteDecisionDialog.showModal()

    deletionChoiceButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.target.id === 'delete-yes-btn') {
                const garageSelector = document.querySelector('#garage-selector')
                const filteredData = Form.deleteGarageFromLocalStorage(garageSelector.value)
                Form.appendOptions(filteredData)
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
            Form.saveToLocalStorage('garages', GARAGES_IN_LOCAL_STORAGE)
            Form.buildGarage(garageID.value)
        }
    } else

        console.log(GARAGES_IN_LOCAL_STORAGE)
})

buildNewGarage.addEventListener('click', () => {
    selectGarageContainer.style.display = 'none'
    setupGarageContainer.style.display = 'flex'
})

returnToSelectBtn.addEventListener('click', () => {
    setupGarageContainer.style.display = 'none'
    selectGarageContainer.style.display = 'flex'
    const garages = Form.loadFromLocalStorage('garages')
    Form.appendOptions(garages)
})

refreshSelectionBtn.addEventListener('click', Form.refreshInputs)
garageSelector.addEventListener('change', Form.showOrHideContinueAndSlashBtn)
continueBtn.addEventListener('click', Form.buildGarage)
createGarageBtn.addEventListener('click', Form.buildGarage)



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



