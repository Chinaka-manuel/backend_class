import fs from "fs"

// read file synchronously 
let textContent = fs.readFileSync('./text.txt', "utf-8")
console.log(textContent)

// Write file synchronously 
let content = "Hello everyone i love coding, and its fun"
fs.writeFileSync('./text.txt', content, "utf-8") //write removes and replace the existing content of a file

// Append file synchronously 
let content2 = '\nlets keep coding'
fs.appendFileSync('./text.txt', content2, 'utf-8' ) // adds to the content of a file 

// open  file synchronously 

fs.openSync('text2.txt', 'w') // use to create an empty file

// fs.closeSync(2)

// delete a file synchronously
fs.unlinkSync('./text2.txt')

fs.renameSync("./text.txt", "./texting.txt")


