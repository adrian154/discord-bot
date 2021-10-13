const plural = unit => unit.plural || (unit.name + "s");
const quantity = (qty, unit) => qty == 1 ? unit.name : plural(unit);

const toDict = units => Object.fromEntries(units.flatMap(unit => [
    [unit.name.toLowerCase(), unit],
    [(unit.symbol || unit.name).toLowerCase(), unit],
    [plural(unit).toLowerCase(), unit]
]));

// base unit: meter
const LengthUnits = toDict([
    {name: "kilometer", symbol: "km", value: 1000},
    {name: "meter", symbol: "m", value: 1},
    {name: "centimeter", symbol: "cm", value: 0.01},
    {name: "millimeter", symbol: "mm", value: 0.001},
    {name: "micron", symbol: "um", vlaue: 1e-6},
    {name: "nanometer", symbol: "nm", value: 1e-9},
    {name: "angstrom", symbol: "Å", value: 1e-10},
    {name: "mile", symbol: "mi", value: 1609.344},
    {name: "yard", symbol: "yd", value: 0.9144},
    {name: "foot", plural: "feet", symbol: "ft", value: 0.3048},
    {name: "inch", plural: "inches", symbol: "in", value: 0.0254},
    {name: "league", symbol: "lea", value: 4828.032},
    {name: "nautical mile", symbol: "nmi", value: 1852},
    {name: "light-year", symbol: "ly", value: 9460730472580800},
    {name: "astronomical unit", symbol: "au", value: 149597870700},
    {name: "parsec", symbol: "pc", value: 3.0856775814913673}
]);

const squareUnit = unit => ({name: "square " + unit.name, plural: unit.plural && "square " + unit.plural, symbol: unit.symbol + "2", value: unit.value ** 2});

// area
// base unit: square meter
const AreaUnits = toDict([
    squareUnit(LengthUnits["kilometer"]),
    squareUnit(LengthUnits["meter"]),
    squareUnit(LengthUnits["mile"]),
    squareUnit(LengthUnits["yard"]),
    squareUnit(LengthUnits["foot"]),
    squareUnit(LengthUnits["inch"]),
    squareUnit(LengthUnits["millimeter"]),
    squareUnit(LengthUnits["centimeter"]),
    {name: "acre", symbol: "ac", value: 4046.8564224},
    {name: "hectare", symbol: "ha", value: 10000}
]);

const cubicUnit = unit => ({name: "cubic " + unit.name, plural: unit.plural && "cubic " + unit.plural, symbol: unit.symbol + "3", value: unit.value ** 3 / 1000});

// TODO: fix volume units - massive shitstorm
// base unit: liter (NOT cubic meter)
// uses US customary because fuck the british
const VolumeUnits = toDict([
    {name: "liter", symbol: "L", value: 1},
    {name: "mililiter", symbol: "mL", value: 0.001},
    cubicUnit(LengthUnits["meter"]),
    cubicUnit(LengthUnits["centimeter"]),
    cubicUnit(LengthUnits["foot"]),
    cubicUnit(LengthUnits["inch"]),
    {name: "fluid ounce", symbol: "floz", value: 0.0295735295625},
    {name: "cup", symbol: "c", value: 0.2365882365},
    {name: "pint", symbol: "pt", value: 0.473176473},
    {name: "quart", symbol: "qt", value: 0.946352946},
    {name: "gallon", symbol: "gal", value: 3.785411784},
    {name: "teaspoon", symbol: "tsp", value: 0.00493},
    {name: "tablespoon", symbol: "tbsp", value: 0.01479}
]);

// needs special handling
// base unit: celsius
const TemperatureUnits = toDict([
    {name: "°C", symbol: "C", plural: "°C", value: 1, offset: 0},
    {name: "°F", symbol: "F", plural: "°F", value: 5/9, offset: 32},
    {name: "K", symbol: "K", plural: "K", value: 1, offset: 273.15},
    {name: "°Ra", symbol: "Ra", plural: "°Ra", value: 5/9, offset: 491.67}
]);

// mmHg assumed to be identical to Torr even though theres an EXTREMELY small difference
// base unit: pascal
const PressureUnits = toDict([
    {name: "atmosphere", symbol: "atm", value: 101325},
    {name: "pascal", symbol: "Pa", value: 1},
    {name: "kilopascal", symbol: "kPa", value: 1000},
    {name: "megapascal", symbol: "MPa", value: 1e6},
    {name: "bar", plural: "bar", symbol: "bar", value: 100000},
    {name: "millibar", symbol: "mbar", value: 100},
    {name: "millimeter of mercury", plural: "millimeters of mercury", symbol: "mmHg", value: 101325/760},
    {name: "torr", plural: "torr", symbol: "Torr", value: 101325/760},
    {name: "pound per square inch", plural: "pounds per square inch", symbol: "psi", value: 6894.75729}
]);

// base unit: joule
const EnergyUnits = toDict([
    {name: "joule", symbol: "J", value: 1},
    {name: "calorie", symbol: "cal", value: 4.184},
    {name: "kilocalorie", symbol: "kcal", value: 4184},
    {name: "British thermal unit", symbol: "btu", value: 1055},
    {name: "kilowatt-hour", symbol: "kWh", value: 3.6e6},
    {name: "erg", symbol: "erg", value: 1e-7}
]);

// yes, *also* weight 
// base unit: kg
const MassWeightUnits = toDict([
    {name: "kilogram", symbol: "kg", value: 1},
    {name: "gram", symbol: "g", value: 0.001},
    {name: "milligram", symbol: "mg", value: 0.000001},
    {name: "short ton", symbol: "ton", value: 907.18474},
    {name: "metric ton", symbol: "t", value: 1000},
    {name: "ounce", symbol: "oz", value: 0.028349523125},
    {name: "pound", symbol: "lb", value: 0.45359237},
    {name: "troy ounce", symbol: "oz t", value: 0.0311034768},
    {name: "troy pound", symbol: "lb t", value: 0.3732417216}
]);

// base unit: meter per second
const SpeedUnits = toDict([
    {name: "mile per hour", plural: "miles per hour", symbol: "mph", value: 0.44704},
    {name: "kilometer per hour", plural: "kilometers per hour", symbol: "km/h", value: 0.2777777777777778},
    {name: "meter per second", plural: "meters per second", symbol: "m/s", value: 1}
]);

// Anything calendaresque (day and beyond) will be APPROXIMATIONS
// base unit: second
const TimeUnits = toDict([
    {name: "second", symbol: "s", value: 1},
    {name: "millisecond", symbol: "ms", value: 0.001},
    {name: "minute", symbol: "min", value: 60},
    {name: "hour", symbol: "h", value: 3600},
    {name: "day", symbol: "d", value: 86400},
    {name: "week", symbol: "wk", value: 604800},
    {name: "month", symbol: "mo", value: 2628000},
    {name: "year", symbol: "yr", value: 31536000},
    {name: "decade", value: 315360000},
    {name: "century", plural: "centuries", value: 3153600000},
    {name: "millenium", plural: "millenia", value: 31536000000}
]);

module.exports = (source, sourceUnitName, targetUnitName) => {

    for(const category of [LengthUnits, AreaUnits, TemperatureUnits, VolumeUnits, PressureUnits, EnergyUnits, MassWeightUnits, SpeedUnits, TimeUnits]) {    
        const srcUnit = category[sourceUnitName.toLowerCase()];
        if(srcUnit) {
            const destUnit = category[targetUnitName.toLowerCase()];
            if(destUnit) {
                const common = (source - (srcUnit.offset || 0)) * srcUnit.value;
                const result = common / destUnit.value + (destUnit.offset || 0);
                return `${source} ${quantity(source, srcUnit)} is ${result} ${quantity(result, destUnit)}`;
            } else {
                throw new Error(`Can't convert ${plural(srcUnit)} to unknown unit "${targetUnitName}"`);
            }
        }
    }

    throw new Error(`There's no known unit with the name "${sourceUnitName}"!`);

};