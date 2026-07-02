import url from "url"

let addrr = "https://localhost:5000/default.html?year=2017&month=february"

let content = url.parse(addrr)
console.log(content)

console.log(content.query)