export const ICON_MAP = new Map()

addMapping([0, 1], "sun-solid")
addMapping([2], "cloud-sun-solid")
addMapping([3], "cloud-solid")
addMapping([45, 48], "smog-solid")
addMapping([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 85, 86], "cloud-showers-heavy-solid")
addMapping([71, 73, 75, 77, 85, 86], "snowflake-solid")
addMapping([95, 96, 99], "cloud-bolt-solid")

function addMapping(values, icon) {
    values.forEach(value => {
        ICON_MAP.set(value, icon)
    })
}

