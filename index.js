const gameContainer = document.querySelector('.game-container');
const basket = document.querySelector(".basket");
const timeLayout = document.querySelector(".time");
const scoreLayout = document.querySelector(".score");
const egg = document.querySelector(".egg");
const boom = document.querySelector(".boom");
let score = 0;
let isHolding = false; 
let time = 0
let gameover = false
let fallInterval = null
const state = {
    basketX:0,
    speed:0,
}
// Bắt sự kiện di chuyển chuột để di chuyển rổ
document.addEventListener("mousemove", (e) => {
    const x = e.clientX;
    basket.style.left = x + "px";
});
basket.addEventListener('touchstart',function(e) {
    isHolding=true;
})
basket.addEventListener('touchmove', (e) => {
    if (isHolding) {
        const touch = e.touches[0];
        basket.style.left = touch.clientX - basket.clientWidth / 2 + 'px';
        basket.style.right = touch.clientX - basket.clientWidth / 2 + 'px';
    }
  });
// Bắt sự kiện khi quả trứng chạm vào rổ
function checkCollisionEgg() {
    const basketRect = basket.getBoundingClientRect();
    const basketLeft = basketRect.left;
    const basketRight = basketRect.right;
    const basketTop = basketRect.top;
    const basketBottom = basketRect.bottom;

    const eggs = document.querySelectorAll('.egg');
    eggs.forEach((egg) => {
        const eggRect = egg.getBoundingClientRect();
        const eggLeft = eggRect.left;
        const eggRight = eggRect.right;
        const eggTop = eggRect.top;
        const eggBottom = eggRect.bottom;
        if (
            eggBottom >= basketTop &&
            eggTop <= basketBottom &&
            eggRight >= basketLeft &&
            eggLeft <= basketRight
        ) {
            // Trứng va chạm vào cái giỏ
            score++;
            document.querySelector('.score').innerText = `Score: ${score}`;
            egg.remove();
        } else if (eggTop > gameContainer.clientHeight) {
            // Trứng rơi xuống dưới màn hình, loại bỏ nó
            egg.remove();
        }
    });
}

function checkCollisionBoom() {
    const basketRect = basket.getBoundingClientRect();
    const basketLeft = basketRect.left;
    const basketRight = basketRect.right;
    const basketTop = basketRect.top;
    const basketBottom = basketRect.bottom;

    const booms = document.querySelectorAll('.boom');
    booms.forEach((boom) => {
        const boomRect = boom.getBoundingClientRect();
        const boomLeft = boomRect.left;
        const boomRight = boomRect.right;
        const boomTop = boomRect.top;
        const boomBottom = boomRect.bottom;
        if (
            boomBottom >= basketTop &&
            boomTop <= basketBottom &&
            boomRight >= basketLeft &&
            boomLeft <= basketRight
        ) {
            // Trứng va chạm vào cái giỏ
            gameover=true
            basket.remove()
            scoreLayout.remove()
            timeLayout.remove()
            document.querySelector('.gameOver').style.display = "block"
        } else if (boomTop > gameContainer.clientHeight) {
            // Trứng rơi xuống dưới màn hình, loại bỏ nó
            boom.remove();
        }
    });
}
function createEgg() {
    const egg = document.createElement('img');
    egg.classList.add('egg');
    egg.src = "./chanh.png"
    egg.style.left = `${Math.random() * (gameContainer.clientWidth - 30)}px`;
    gameContainer.appendChild(egg);
    fallInterval = setInterval(() => {
        const eggY = egg.getBoundingClientRect().top;
        const basketY = basket.getBoundingClientRect().top;
        if (eggY > basketY && eggY < basketY + basket.clientHeight) {
            document.querySelector('.score').innerText = `Score: ${score}`;
            // egg.remove();
            clearInterval(fallInterval);
        } else if (eggY >= gameContainer.clientHeight) {
            // egg.remove();
        } else {
            newY = eggY + 30 * (state.speed / 2)
            egg.style.top = `${newY}px`;
        }
        checkCollisionEgg();
    }, 20);

    // Gọi hàm createEgg lại sau một khoảng thời gian
    setTimeout(createEgg,state.speed==0?4000:4000/state.speed);
}
setInterval(() => {
    if(gameover==true) {
        document.querySelectorAll(".egg").forEach(item=>{
            item.style.animation="none"
            item.style.zIndex=-1
            item.remove()
        })
        document.querySelectorAll(".boom").forEach(item=>{
            item.remove()
        })
        clearInterval(fallInterval)
    }
}, 20);
function createBoom() {
    const boom = document.createElement('img');
    boom.classList.add('boom');
    boom.src = "./boom.png"
    boom.style.left = `${Math.random() * (gameContainer.clientWidth - 30)}px`;
    gameContainer.appendChild(boom);
    fallInterval = setInterval(() => {
        const boomY = boom.getBoundingClientRect().top;
        const basketY = basket.getBoundingClientRect().top;
        if (boomY > basketY && boomY < basketY + basket.clientHeight) {
            
            document.querySelector('.score').innerText = `Score: ${score}`;
            boom.remove();
            clearInterval(fallInterval);
        } else if (boomY > gameContainer.clientHeight) {
            boom.remove();
        } else {
            newY = boomY+30*(state.speed/2)
            boom.style.top = `${newY}px`;
        }
        // Kiểm tra va chạm sau mỗi khung thời gian
        checkCollisionBoom();
    }, 20);
    setTimeout(createBoom, state.speed==0?8000:8000/state.speed);
}

// Đặt lại vị trí của quả trứng
// const resetEgg = () => {
//     egg.style.top = "0";
//     egg.style.left = Math.random() * window.innerWidth + "px";
// };
// Kiểm tra va chạm mỗi khi quả trứng di chuyển
// const gameLoop = () => {
//     checkCollisionEgg();
//     if (parseInt(egg.style.top) >= window.innerHeight) {
//         // Quả trứng đã rơi xuống dưới màn hình, đặt lại vị trí
//         resetEgg();
//     } else {
//         egg.style.top = parseInt(egg.style.top) + 1 + "px";
//     }
//     requestAnimationFrame(gameLoop);
// };

// Khởi tạo trò chơi
// resetEgg();
// gameLoop();
let handleTime = setInterval(() => {
    if(gameover==false) {
        const check=(index)=> {
            if(Number.isInteger(index) && index%2==0) {
                return true
            }
            return false
        }
        if(check(time/10)) {
            state.speed=state.speed+0.5
        }
        time=time+1;
        document.querySelector('.time').innerHTML=time
    }
}, 1000);
    // let handleMainEgg = setInterval(createEgg, state.speed==0?4000:4000/state.speed);
    createEgg()
    // let handleMainBoom = setInterval(createBoom, state.speed==0?8000:8000/state.speed);
    createBoom()
function handlereturn() {
    location.reload()
}