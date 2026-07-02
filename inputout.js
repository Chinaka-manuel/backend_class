import readline from "readline"

const rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
})

rl.question("What is your name : ", (name)=>{
    console.log(`Your name is ${name}`)
    rl.close()
})

rl.on("close", ()=>{
    console.log("interface  closed")
    process.exit(0);
})