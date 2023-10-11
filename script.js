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
const returnToSelectBtns = document.querySelectorAll('.return-to-select-btns')
const refreshSelectionBtn = document.querySelector('#refresh-selection-btn')
const garageID = document.querySelector('#garage-id-input')
const continueBtn = document.querySelector('#continue-btn')
const faShopSlash = document.querySelector('.fa-shop-slash')
const createVehicleBtn = document.querySelector('#create-vehicle-btn')
const vehicleRegistration = document.querySelector('#vehicle-registration')
const vehicleReadyToEnterGarage = document.querySelector('#vehicles-ready-to-enter-garage')
const vehicleType = document.querySelector('#vehicle-type')
const vehicleBrand = document.querySelector('#vehicle-brand')
const vehicleModel = document.querySelector('#vehicle-model')
const vehicleNumOfWheels = document.querySelector('#vehicle-number-of-wheels')
const builtGarage = document.querySelector('#built-garage')
const garageSlotsContainer = document.querySelector('#garage-slots-container')
const garageSlot = document.getElementsByClassName('garage-slot')
const garageManagementContainer = document.querySelector('#garage-management-container')
const displaySelectedGarageId = document.querySelector('#display-selected-garage-id')
const returnToSelectGarageCointerBtn = document.querySelector('#return-to-select-garage-cointer-btn')

const VEHICLE_TYPES = []
const CREATED_VEHICLES_ARR = []

class Garage {

    constructor(id, parkingSpacesPerVehicle) {

        this.id = id
        this.vehiclesParked = this.loadGarageFromLocalStorage()?.id || {}

        for (const key in parkingSpacesPerVehicle) {
            this[key] = parkingSpacesPerVehicle[key]
            if (Object.keys(this.vehiclesParked).length < Object.keys(parkingSpacesPerVehicle).length)
                this.vehiclesParked[key] = []
        }
    }

    loadGarageFromLocalStorage(){
        return JSON.parse(localStorage.getItem('garages'))
    }

    saveGarageToLocalStorage(){
        const data = this.loadGarageFromLocalStorage()
        data.push(this.vehiclesParked)
        localStorage.setItem('garages', JSON.stringify(data))

        console.log('saved garages', data)
    }

    park = (vehicle) => {
        const vehicleType = vehicle.constructor.name.toLowerCase()
        const allVehiclesParked = this.vehiclesParked // da li se moze vani deklarisati da se ne bi svaki put deklarisalo unutar metoda

        console.log(allVehiclesParked)

        if (allVehiclesParked[vehicleType]?.length < this[vehicleType]
            && allVehiclesParked[vehicleType]?.every(el => el.registration !== vehicle.registration)) {
            allVehiclesParked[vehicleType].push(vehicle)
            console.log(`${vehicleType[0].toUpperCase() + vehicleType.slice(1)} is parked with registration number: ${vehicle.registration}`)
            this.saveGarageToLocalStorage()
        }
        else if (allVehiclesParked[vehicleType]?.length > this[vehicleType]) console.log(`There is no more parking space for ${vehicleType}s`)

    }


    removeParked = (vehicle) => {
        const vehicleType = vehicle.constructor.name.toLowerCase()
        const allVehiclesParked = this.vehiclesParked

        allVehiclesParked[vehicleType] = allVehiclesParked[vehicleType]?.filter(el => {
            if (el.registration === vehicle.registration) {
                console.log(`${vehicle.constructor.name} is removed with registration number: ${vehicle.registration}`)
                return false
            }
            return true
        })

        this.saveGarageToLocalStorage()
    }

    findByRegistrationNumber = (registrationNumber) => {
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

    freeParkingSpaces = () => {
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
            })
        })
    }

    static createNewVehicleInput = () => {
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

    static loadItemFromLocalStorage = (key) => {
        return JSON.parse(localStorage.getItem(key)) || []
    }

    static saveItemToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    }

    static deleteGarageFromLocalStorage = (ID) => {
        const filteredData = JSON.parse(localStorage.getItem('garages'))
            .filter(garage => garage.id !== ID)

        this.saveItemToLocalStorage('garages', filteredData)

        return filteredData

    }

    static openGarageManagement = (garageID) => {

        const garages = new Garage({id: garageID ?? garageSelector.value})

        setupGarageContainer.style.display = 'none'
        selectGarageContainer.style.display = 'none'
        garageManagementContainer.style.display = 'grid'

        displaySelectedGarageId.innerText = garageID ? 'Garage ' + garageID : 'Garage ' + garageSelector.value

        console.log(garages)
    }

    static isVehicleDuplicate = () => {
        return CREATED_VEHICLES_ARR.every(vehicle => vehicle.registration !== vehicleRegistration.value)
    }

    static pushCreatedVehicle = () => {
        if (this.isVehicleDuplicate()) {
            CREATED_VEHICLES_ARR.push({
                type: vehicleType.value,
                registration: vehicleRegistration.value,
                brand: vehicleBrand.value,
                model: vehicleModel.value,
                wheels: vehicleNumOfWheels.value,
            })
        }
    }

    static attachDeleteVehicleEventListener = (vehicle, id) => {
        vehicle.addEventListener('click', () => {
            const indexOfVehicleToDelete = CREATED_VEHICLES_ARR.findIndex(vehicle => vehicle.registration === id)
            const vehicleSlot = vehicle.parentElement
            vehicleSlot.parentElement.removeChild(vehicleSlot)
            CREATED_VEHICLES_ARR.splice(indexOfVehicleToDelete, 1)
            console.log(CREATED_VEHICLES_ARR)
        }, { once: true })
    }

    static createDragAndDrop = (vehicle) => {
        vehicle.addEventListener('dragstart', (e) => {
            console.log(vehicle)
            e.dataTransfer.setData('car', e.target.id)
            console.log('started')
        })
        vehicle.addEventListener('dragend', () => {
            builtGarage.classList.remove('change-garage')
        })
    }

    static garageDropEnabled = () => {

        builtGarage.addEventListener('drop', (e) => {
            let data = e.dataTransfer.getData('car')
            const car = document.getElementById(data)
            garageSlotsContainer.append(car)

            const Type = Vehicle.createNewType(vehicleType.value)

            const vehicle = new Type({
                registration: vehicleRegistration,
                model: vehicleModel,
                brand: vehicleBrand,
                numberOfWheels: vehicleNumOfWheels,
            })

            const garage = new Garage({id: garageSelector.value})
            garage.park(vehicle)
            console.log(garage)

            Array.from(garageSlotsContainer.children).forEach(slot => {
                slot.draggable = false
                slot.style.width = '49%'
                slot.classList.add('garage-slot')
            })
        })

        builtGarage.addEventListener('dragover', (e) => {
            e.preventDefault()
            builtGarage.classList.add('change-garage')
        })

        
    }

    static createDraggableVehicle = () => {

        if (vehicleRegistration.value !== '' && this.isVehicleDuplicate()) {

            const createdVehicleSlot = document.createElement('div')
            const createdVehicle = document.createElement('div')
            const idForNewVehicle = document.createElement('span')
            const deleteVehicle = document.createElement('i')
            const topVehiclePart = document.createElement('div')
            const wheelOne = document.createElement('div')
            const wheelTwo = document.createElement('div')
            const innerWheelOne = document.createElement('div')
            const innerWheelTwo = document.createElement('div')

            vehicleReadyToEnterGarage.append(createdVehicleSlot)
            createdVehicleSlot.append(createdVehicle)
            createdVehicle.append(idForNewVehicle)
            createdVehicle.append(deleteVehicle)
            createdVehicle.append(topVehiclePart)
            createdVehicle.append(wheelOne)
            createdVehicle.append(wheelTwo)
            wheelOne.append(innerWheelOne)
            wheelTwo.append(innerWheelTwo)

            createdVehicleSlot.classList.add('created-vehicle-slot')
            createdVehicle.classList.add('created-vehicle')
            idForNewVehicle.classList.add('created-vehicle-id-span')
            deleteVehicle.classList.add('fa-solid', 'fa-ban')
            topVehiclePart.classList.add('top-vehicle-part')
            wheelOne.classList.add('wheel-one')
            wheelTwo.classList.add('wheel-two')
            innerWheelOne.classList.add('inner-wheel')
            innerWheelTwo.classList.add('inner-wheel')

            createdVehicleSlot.draggable = true
            idForNewVehicle.textContent = vehicleRegistration.value
            createdVehicleSlot.id = CREATED_VEHICLES_ARR.length

            this.pushCreatedVehicle()
            this.attachDeleteVehicleEventListener(createdVehicle, idForNewVehicle.textContent)
            this.createDragAndDrop(createdVehicleSlot)

            console.log(CREATED_VEHICLES_ARR)
        }
    }
}


class Vehicle {

    static createdTypes = []

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

    // static storeType = (newType) => {
    //     if (this.createdTypes.every(type => type.name !== newType.name))
    //         this.createdTypes.push(newType)

    //     console.log(this.createdTypes)
    // }
}

const deleteDecisionDialog = document.querySelector('#delete-decision-dialog')
const createdGarages = Form.loadItemFromLocalStorage('garages')
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

addVehicleSlotBtn.addEventListener('click', Form.createNewVehicleInput)

garageID.addEventListener('change', () => {
    createGarageBtn.disabled = garageID.value === ''
})

createGarageBtn.addEventListener('click', () => {

    const garagesStoredInLocalStorage = JSON.parse(localStorage.getItem('garages')) || []

    if (garagesStoredInLocalStorage.every(garage => garage.id !== garageID.value)) {
        const properties = Form.createProperties()
        if (properties) {
            garagesStoredInLocalStorage.push(new Garage(garageID.value, properties))

            Form.saveItemToLocalStorage('garages', garagesStoredInLocalStorage)
            Form.openGarageManagement(garageID.value)
        }
    }

    console.log(garagesStoredInLocalStorage)
    console.log(JSON.parse(localStorage.getItem('garages')))
})

buildNewGarage.addEventListener('click', () => {
    selectGarageContainer.style.display = 'none'
    setupGarageContainer.style.display = 'flex'
})

returnToSelectBtns.forEach(button => {
    button.addEventListener('click', () => {
        setupGarageContainer.style.display = 'none'
        selectGarageContainer.style.display = 'flex'
        const garages = Form.loadItemFromLocalStorage('garages')
        console.log(garages)
        Form.appendOptions(garages)
    })
})

refreshSelectionBtn.addEventListener('click', Form.refreshInputs)
garageSelector.addEventListener('change', Form.showOrHideContinueAndSlashBtn)
continueBtn.addEventListener('click', () => {
    Form.openGarageManagement()
})
createVehicleBtn.addEventListener('click', Form.createDraggableVehicle)
Form.garageDropEnabled()
returnToSelectGarageCointerBtn.addEventListener('click', () => {
    setupGarageContainer.style.display = 'none'
    garageManagementContainer.style.display = 'none'
    selectGarageContainer.style.display = 'flex'
})



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



