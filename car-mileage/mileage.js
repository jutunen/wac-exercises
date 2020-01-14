const readline = require("readline-sync");
const fuelLitrePrice = 1.5

main()

function main() {
  let cars = []
  initCars(cars)

  while(true) {
    console.log("Please type car and operation:      ( or press q to quit )")
    let input = readline.question(":")
    if(!processInput(input,cars)) {
      process.exit()
    }
  }
}

function processInput(inputStr,cars) {

  // quit program:
  if(inputStr === 'q') {
    return false
  }
  // print cars:
  if(inputStr === 'p') {
    cars.forEach( x => console.log(JSON.stringify(x)) )
    return true
  }

  let splitInput = inputStr.split(" ")
  let carName = splitInput[0]
  let carObj = getCarByName(carName,cars)

  if(carObj === undefined) {
    console.log('Car ' + carName + ' not found.')
    return true
  }

  let operation = splitInput[1]

  if(operation.toLowerCase() !== 'drive' && operation.toLowerCase() !== 'fill') {
    console.log("Invalid operation " + operation + '.')
    return true
  }

  if(operation.toLowerCase() === 'fill') {
    carObj.pumpGas()
    return true
  }

  if(operation.toLowerCase() === 'drive' && typeof splitInput[2] === 'undefined') {
    console.log("Mileage missing.")
    return true
  } else {
    let mileage = parseFloat(splitInput[2])

    if(isNaN(mileage)) {
      console.log("Invalid mileage.")
      return true
    } else {
      carObj.drive(mileage)
      return true
    }
  }
  console.log("Oops, something went wrong, this really shouldn't happen!")
  return true
}

function getCarByName(name,cars) {
  return cars.find( x => x.name.toLowerCase() === name.toLowerCase() )
}

function initCars(cars) {
  let car = {}
  cars.push(createCar('Volkswagen', 50, 5.2))
  cars.push(createCar('Peugeot', 53, 4.6))
  cars.push(createCar('Toyota', 55, 6.6))
}

function drive(mileage) {
  let fuelNeeded = mileage * this.consumption / 100
  if( fuelNeeded >= this.fuelLeft ) {
    console.log("Not enough fuel.")
    return false
  } else {
    this.fuelLeft -= fuelNeeded
    this.totalMileage += mileage
    console.log(this.name + ' - ' + roundFloat(this.fuelLeft) + ' litres left - ' + roundFloat(this.totalMileage) + 'km driven')
    return true
  }
}

function pumpGas() {
  let amountToBeFilled = this.tankSize - this.fuelLeft
  let cost = amountToBeFilled * fuelLitrePrice
  this.fuelLeft = this.tankSize
  console.log("Filling the tank with " + roundFloat(amountToBeFilled) + " litres cost " + roundFloat(cost) + " €.")
}

function createCar(name,tankSize,consumption,fuelLeft = tankSize) {
  let car = {}
  car.drive = drive
  car.pumpGas = pumpGas
  car.totalMileage = 0
  car.name = name
  car.tankSize = tankSize
  car.consumption = consumption
  car.fuelLeft = fuelLeft
  return car
}

function roundFloat(input) {
  input = Math.round(input * 100) / 100
  return input
}
