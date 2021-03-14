const units = [
    {name: "pound", abbrev: "lb", to: "kilograms", factor: 0.45359237},
    {name: "ounce", abbrev: "oz", to: "grams", factor: 28.349523124},
    {name: "ton", to: "metric tonnes", factor: 1.0160469088},
    {name: "pint", to: "litres", factor: 0.58626125},
    {name: "quart", to: "litres", factor: 1.1365225},
    {name: "gallon", to: "litres",  factor: 4.54609},
    {name: "acre", to: "hectares", factor: 0.40468564224},
    {name: "inch", abbrev: "in", to: "centimeters", factor: 25.4},
    {name: "foot", abbrev: "ft", to: "meters", factor: 0.3048},
    {name: "yard", abbrev: "yd", to: "meters", factor: 0.9144},
    {name: "mile", abbrev: "mi", to: "kilometers", factor: 1.609344}
];

module.exports = {
    name: "metricfy", 
    handle: (bot, message) => {
        for(const unit of units) {
            const regex = unit.regex ?? (unit.regex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${unit.name}s?${unit.abbrev ? "|" + unit.abbrev : ""})\\b`, "i"));
            const parsed = regex.exec(message.content);
            if(parsed) {
                const qty = Number(parsed[1]);
                message.channel.send(`${qty.toFixed(2)} ${unit.name}s is ${(qty * unit.factor).toFixed(2)} ${unit.to}`).catch(console.error);
                return true;
            }
        }
    }
};