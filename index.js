const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// declaring canvas dimensions
canvas.width = 1024
canvas.height = 576

// setting background
c.fillRect(0, 0, canvas.width, canvas.height)

// gravity 
const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Game assets/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './Game assets/shop.png',
    scale: 2.75,
    framesMax: 6
})

// player
const player = new Fighter({
    position: {
        x: 250,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "./Game assets/Samurai/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: "./Game assets/Samurai/Idle.png",
            framesMax: 8           
        },
        run: {
            imageSrc: "./Game assets/Samurai/Run.png",
            framesMax: 8           
        },
        jump: {
            imageSrc: "./Game assets/Samurai/Jump.png",
            framesMax: 2          
        },
        fall: {
            imageSrc: "./Game assets/Samurai/Fall.png",
            framesMax: 2 
        },
        attack1: {
            imageSrc: "./Game assets/Samurai/Attack1.png",
            framesMax: 6 
        },
        takeHit: {
            imageSrc: "./Game assets/Samurai/Take Hit.png",
            framesMax: 4
        },
        death: {
            imageSrc: "./Game assets/Samurai/Death.png",
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 160,
            y: 50  
        },
        width: 100,
        height: 50
    }

})

// enemy
const enemy = new Fighter({
    position: {
        x: 750,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: "./Game assets/Hero/Idle.png",
    framesMax: 11,
    scale: 2.5,
    offset: {
        x: 260,
        y: 138
    },
    sprites: {
        idle: {
            imageSrc: "./Game assets/Hero/Idle.png",
            framesMax: 11           
        },
        run: {
            imageSrc: "./Game assets/Hero/Run.png",
            framesMax: 8           
        },
        jump: {
            imageSrc: "./Game assets/Hero/Jump.png",
            framesMax: 3          
        },
        fall: {
            imageSrc: "./Game assets/Hero/Fall.png",
            framesMax: 3 
        },
        attack1: {
            imageSrc: "./Game assets/Hero/Attack1.png",
            framesMax: 7 
        },
        takeHit: {
            imageSrc: "./Game assets/Hero/Take Hit.png",
            framesMax: 4
        },
        death: {
            imageSrc: "./Game assets/Hero/Death.png",
            framesMax: 11
        }
    },
    attackBox: {
        offset: {
            x: -200,
            y: 50  
        },
        width: 100,
        height: 50
    }
 
    
})

// rendering


console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    c.fillStyle = 'rgba(0,0,0,0.4)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    
    if(keys.a.pressed && player.lastKey === 'a') {
       player.velocity.x = -5 
    player.switchSprite('run')   
    } else if (keys.d.pressed && player.lastKey === 'd') {
       player.velocity.x = 5
    player.switchSprite('run')
    } else {
       player.switchSprite('idle')
    }
    if (player.velocity.y < 0) {
    player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')    
    }


    // enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5 
        enemy.switchSprite('run')
     } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
     } else {
        enemy.switchSprite('idle')
     }

     if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
        } else if (enemy.velocity.y > 0) {
            enemy.switchSprite('fall')    
        }

     // detect collision

     if (rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
     }) && 
     player.isAttacking && player.framesCurrent === 4) {
        enemy.takeHit()
        player.isAttacking = false
        
        gsap.to("#enemyHealth", {
            width: enemy.health + '%'
        }) 
    } 

    if ( player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false  
     }

     if (rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
     }) && enemy.isAttacking && enemy.framesCurrent === 3) {
        player.takeHit()
        enemy.isAttacking = false
        
        gsap.to("#playerHealth", {
            width: player.health + '%'
        })
     }

     //if miss

     if ( enemy.isAttacking && enemy.framesCurrent === 3) {
        enemy.isAttacking = false  
     }

     // end game
     if (enemy.health === 0 || player.health === 0) {
        determineWinner({player, enemy, timerId}) 
     }
}

animate()


// event.listeners 
window.addEventListener("keydown", (event) => {
    if (!player.dead) {
    switch (event.key) {
        case 'd': 
        keys.d.pressed = true
        player.lastKey = 'd'
        break
        case 'a': 
        keys.a.pressed = true
        player.lastKey = 'a'
        break
        case 'w': 
        player.velocity.y = -20
        break
        case ' ': 
        player.attack()
        break       

    }
}   
    if (!enemy.dead) {
    switch(event.key) {
        case 'ArrowRight': 
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
        case 'ArrowLeft': 
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
        case 'ArrowUp': 
        enemy.velocity.y = -20
        break
        case 'ArrowDown': 
        enemy.attack()
        break
    }
}
    
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case 'd': 
        keys.d.pressed = false
        break
        case 'a': 
        keys.a.pressed = false
        break
        case 'w': 
        keys.w.pressed = false
        break
    }

    switch (event.key) {
        case 'ArrowRight': 
        keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft': 
        keys.ArrowLeft.pressed = false
        break
    
    }
})




decreaseTimer()






