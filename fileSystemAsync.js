import fs from "fs"
// read file asynchronously

fs.readFile('./text2.txt', "utf-8", (err, data)=>{
    if(err){
        console.log(err)
    }else{
        console.log(data)
    }
})


// write content to a file asynchronously
let content = "i just coded my first script"
fs.writeFile('./text2.txt', content, err => err && console.log(err))


// append content into an existing file with content
let content2 = "\ni am adding this to a file"
fs.appendFile('./text2.txt', content2, err => err && console.log(err))

// Rename a file Asynchronously 
fs.rename('./text3.txt', './text33.txt', err=> err && console.log(err))


// Delete a file Asynchronously
fs.unlink('./text33.txt', ()=> err => err && console.log(err))