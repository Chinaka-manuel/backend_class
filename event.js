import events from "events"


// create the eventEmitter object
const EventEmitter = new events.EventEmitter()

let shout = ()=>{
    console.log("waaaaaoooooooooh")
}

EventEmitter.on("scream", shout)
EventEmitter.emit("scream")