const units = [
    {name: "pound", abbrev: "lb", to: "kilograms", factor: 0.45359237},
    {name: "ounce", abbrev: "oz", to: "grams", factor: 28.349523124},
    {name: "ton", to: "metric tonnes", factor: 1.0160469088},
    {name: "pint", to: "litres", factor: 0.58626125},
    {name: "quart", to: "litres", factor: 1.1365225},
    {name: "gallon", to: "litres",  factor: 4.54609},
    {name: "acre", to: "hectares", factor: 0.40468564224},
    {name: "inch", plural: "inches", abbrev: "in", to: "centimeters", factor: 2.54},
    {name: "foot", abbrev: "ft", to: "meters", factor: 0.3048},
    {name: "yard", abbrev: "yd", to: "meters", factor: 0.9144},
    {name: "mile", abbrev: "mi", to: "kilometers", factor: 1.609344},
    {name: "degrees Fahrenheit", plural: "degrees Fahrenheit", abbrev: "f", to: "degrees Celsius", factor: 5/9, offset: -32}
];

const createRegex = unit => new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${unit.plural ? `${unit.plural}|${unit.name}` : `${unit.name}s?`}${unit.abbrev ? "|" + unit.abbrev : ""})\\b`, "i")

module.exports = {
    name: "metricfy", 
    priority: 100,
    handle: (bot, message) => {
        for(const unit of units) {
            const regex = unit.regex ?? (unit.regex = createRegex(unit));
            const parsed = regex.exec(message.content);
            if(parsed) {
                const quantity = Number(parsed[1]);
                const converted = (quantity + (unit.offset ?? 0)) * unit.factor;
                message.channel.send(`${quantity.toFixed(2)} ${unit.plural ?? unit.name + "s"} is ${converted.toFixed(2)} ${unit.to}`).catch(console.error);
                return true;
            }
        }
    }
};