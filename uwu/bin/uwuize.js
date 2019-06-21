let inputStringSplit = process.argv.slice(2).join(' ')

function uwuize (input) {
    output = input

    output = output.replace(/your/g, "you")
    output = output.replace(/Your/g, "You")
    output = output.replace(/you/g, "youw")
    output = output.replace(/You/g, "Youw")
    
    output = output.replace(/ th/g, " d")
    output = output.replace(/Th/g, "D")
    output = output.replace(/th /g, "f ")
    output = output.replace(/th/g, "d")
    output = output.replace(/l/g, "w")
    output = output.replace(/L/g, "W")
    output = output.replace(/r/g, "w")
    output = output.replace(/R/g, "W")
    output = output.replace(/R/g, "W")

    return output
}

input = "Cringe ass nae nae baby has been found after re-atomizing from accidentally hitting the woah sources near the event have confirmed the situation is no longer cringe however it is sus and not epic, live subscriber count feed to follow"

console.log(uwuize(input))