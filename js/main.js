const canvas = document.getElementById("canvas1")
const ctx = canvas.getContext("2d")

//setting canvas size
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particleArray = []

let mouse = {
    x: null,
    y: null,

    //area around mouse that particles will react to
    radius: 150
}

window.addEventListener("mousemove",function(event){

    //setting mouse x,y to where the mouse is
    mouse.x = event.x
    mouse.y = event.y
})

//setting text color
ctx.fillStyle = "white";

//specifying font and size
ctx.font = "30px futura"

//takes 3 arguments, text, x, y, optional 4th max size in px
ctx.fillText("WHAT IT DO",20,60)

// //visiulize scan area
// ctx.strokeStyle = "white";
// ctx.strokeRect(0,0,300,100)

//scanning canvas to store pixel information 0,0 is first point, 100,100 is last point, 2 makes a rectangle of scan area
const textCoordinates = ctx.getImageData(0,0,500,100)

class Particle{
    constructor(x,y){
        this.x = x
        this.y = y

        //size is radius of particle
        this.size = 3

        //storing the initial position of particle
        this.baseX = this.x
        this.baseY = this.y

        //determines how heavy particle is and how fast it moves, random makes some fast and some slow
        this.density = (Math.random()*30)+1
    }

    //method to draw particle on screen
    draw(){
        ctx.fillStyle = "red"

        //start drawing
        ctx.beginPath()
        //drawing a 360 deg arc which is a circle, 0 is start angle, Math.PI*2 is 360 deg
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2)

        //finishe path
        ctx.closePath()

        //fill the circle
        ctx.fill()
    }

    update(){
        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        //pythagoras theorem c^2 = a^2+b^2
        let distance = Math.sqrt(dx*dx+dy*dy)

        //pass this point particles will stop moving
        let maxDistance = mouse.radius

        //sin cos thing to find direction
        let forceDirectionX = dx/distance
        let forceDirectionY = dy/distance

        //closer to maxdistance, slower the move if distance = max distance then speed = 0
        let force = (maxDistance - distance)/maxDistance

        //forcedirection x controls direction, force controls distance speed, density controls weight speed
        let directionX = forceDirectionX * force * this.density
        let directionY = forceDirectionY * force * this.density


        if(distance < mouse.radius){
            //+= sucks to mouse, -= pushes from mouse
            this.x -= directionX
            this.y -= directionY
        }else{
            //move particle back to original place if it's not at the baseX
            if(this.x != this.baseX){
                let dx = this.x - this.baseX
                this.x -= dx/50
            }
            if(this.y != this.baseY){
                let dy = this.y - this.baseY
                // dy/10 to gradually slow down particle as it approaches the end 
                this.y -= dy/50
            }
        }

    }
}

//passing particles to array
function init(){
    particleArray = []

    //for loop to push random particles into array for testing
//     for(let i = 0; i < 1000; i++){
//     let x = Math.random()*canvas.width
//     let y = Math.random()*canvas.height
//     particleArray.push(new Particle(x,y))
// }

    //render text on canvas as particles, keep drawing particles on screen until it hits the height of text
    for(let y = 0, y2 = textCoordinates.height; y<y2; y++){

        //render text on canvas as particles keep drawing until it finished one row
        for(let x = 0, x2 = textCoordinates.width; x<x2; x++){

            // checking opacity is greater than 128 or not because in getimagedata opacity ranges from 0 to 255, 128 means 0.5 opacity
            // because text coordinates contains rgba values so (y * 4 *textCoordinates.width) + (x*4)+3] makes sure we only get the alpha value not rgb
            if (textCoordinates.data[(y * 4 *textCoordinates.width) + (x*4)+3] > 128){
                let positionX = x
                let positionY = y

                // multiplied by 10 can adjust size and shape of text and particles
                particleArray.push(new Particle(positionX*10,positionY*10))
            }
        }
    }


}

init()

function animate(){
    //clearing background as you move particles like screen.fill
    ctx.clearRect(0,0,canvas.width,canvas.height)
    
    //loop through all items in array
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].draw()
        particleArray[i].update()
    }

    //recursion to keep animating to keep animation happening like while true loop
    requestAnimationFrame(animate)

}

animate()
