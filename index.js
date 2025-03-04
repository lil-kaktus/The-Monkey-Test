    const startBtn = document.querySelector('#startBtn'),
    startMenu = document.querySelector('#begin-menu'),
    finalMatrixDiv = document.querySelector('#finalMatrix'),
    endMenu = document.querySelector('#endMenu'),
    endScore = document.querySelector('#endScore'),
    endMonkeyImg = document.querySelector('#endMonkeyImg'),
    endMonkeyCommentary = document.querySelector('#endMonkeyCommentary'),
    endTitle = document.querySelector('#endTitle'),
    matrixWidth = 6,
    matrixHeight = 5,
    initialScore = 4,

    adminGodMonkeyPermission = false;

    let score = initialScore,
    randoms = [],
    orderOfBoxes = 0,
    audioOn = true

    if(score > matrixHeight * matrixWidth) score = matrixHeight * matrixWidth;

    startBtn.addEventListener('click',

    function start(){
        startMenu.classList.toggle('hidden')

        checkAudioPermission('./audio/start.mp3')

        generateMatrix(score)
    })

    function generateMatrix(s){
        let container = document.createElement('div')
        container.classList = "container"
        let x, y;

        for(let i = 0; i < s; i++){
            do{
                x = Math.round(Math.random() * (matrixWidth - 1)) + 1;
                y = Math.round(Math.random() * (matrixHeight - 1)) + 1;
            }while(randoms.some(arr => arr[0] === x && arr[1] === y))

            randoms.push([x,y])
        }

        for(let i = 1; i <= matrixHeight; i++){
            let row = document.createElement('div')
            row.classList = 'row'
            row.id = `row${i}`

            for(let j = 1; j <= matrixWidth; j++){
                let box = document.createElement('div')
                box.classList = 'box'
                box.id = `box-x${j}-y${i}`

                row.appendChild(box)
            }
            container.appendChild(row)
        }

        finalMatrixDiv.appendChild(container)

        for(let i = 0; i < randoms.length; i++){
            let box = document.querySelector(`#box-x${String(randoms[i][0])}-y${String(randoms[i][1])}`)

            let spanBox = document.createElement('span')
            spanBox.textContent = i + 1

            box.appendChild(spanBox)
            box.classList = 'foundableBox'

            box.addEventListener('click',(e) => {

                if(box.classList != 'box'){

                    let x = randoms[orderOfBoxes][0]
                    let y = randoms[orderOfBoxes][1]

                    if(box.id !== `box-x${x}-y${y}`){
                        wrongBoxClicked()
                    }
                    else{
                        if(orderOfBoxes === 0){
                            for(let j = 1; j < randoms.length; j++){
                                let box = document.querySelector(`#box-x${String(randoms[j][0])}-y${String(randoms[j][1])}`)
                                let span = box.querySelector('span')
                                span.textContent = ""
                                box.classList.remove('foundableBox')
                                box.classList.add('foundableHiddenBox')
                            }
                        }

                        orderOfBoxes++
                        box.classList = 'box'

                        if(orderOfBoxes == randoms.length){
                            roundFinished()
                        }
                        else{
                            checkAudioPermission('./audio/foundBox.mp3')
                        }
                    }
                }
            })
        }
    }

    function wrongBoxClicked(){
        checkAudioPermission('./audio/wrongBox.mp3')
        finalMatrixDiv.innerHTML = ""
        orderOfBoxes = 0
        randoms = []
        
        endMenu.classList.replace('hidden','active')

        endGame(false)
    }

    function roundFinished(){
        if(score === matrixHeight * matrixWidth){
            endGame(true)
        }
        else{
            checkAudioPermission('./audio/finalBox.mp3')
            orderOfBoxes = 0
            randoms = []
            finalMatrixDiv.innerHTML = ""
            score++
            generateMatrix(score)
        }
    }

    function checkAudioPermission(audioPath){
        if(audioOn){
            let audio = new Audio()
            audio.src = audioPath
            audio.play()
        }
    }

    function getFinalMonkey(s, isFinished){
        let final = {}

        if(s <= 6){
            final.src = './img/babyMonkey.png'
            final.comment = "You have the level of a <b>baby monkey</b>.  Don\'t worry, you\'ll progress quicly... I hope."
        }
        else if(s >= 7 && s <= 13){
            final.src = './img/teenMonkey.png'
            final.comment = "You are like the <b>Teen Monkey</b> : not <i>that</i> good, but becoming stronger everytime."
        }
        else if(s >= 14 && s <= 18){
            final.src = './img/adultMonkey.png'
            final.comment = "You have the level of the <b>Adult Monkey</b>. You're pretty strong, congrats !"
        }
        else if(s >= 19 && s <= 23){
            final.src = './img/kingMonkey.png'
            final.comment = "You have the level of the <b>Monkey King</b>. Thanks to your power, you have reached a very high social status. Good job !"
        }
        else{
            if((s == matrixHeight * matrixWidth && isFinished) || adminGodMonkeyPermission){
                final.src = './img/godMonkey.png'
                final.comment = "<i>Wow.</i> You are the literal <b>Monkey God</b>. You finished the game, congratulations !"
            }
            else{
                final.src = './img/nftMonkey.png'
                final.comment = "You have the level of the <b>NFT Monkey</b>. Congratulations, you've reached a very high state of the monkey mind !"
            }
        }

        return final
    }

    function endGame(isFinished){
        endTitle.textContent = isFinished ? 'You won !' : 'You lost !'
        endScore.innerHTML = `Score : <b>${score}</b> <i>(${score - initialScore} round${score - initialScore <= 1 ? "" : "s"})</i>`;

        const finalMonkeyObject = getFinalMonkey(score, isFinished)
        endMonkeyImg.src = finalMonkeyObject.src
        endMonkeyCommentary.innerHTML = finalMonkeyObject.comment
    }

    endMenu.addEventListener('click',(e) => {
        console.log('btn clicked')
        endMenu.classList.replace('active','hidden')
        startMenu.classList.remove('hidden')
        score = initialScore
    })

    document.querySelector('#copyrightsDiv').addEventListener('click',(e) => {
        document.querySelector('#copyright-box').classList.toggle('hidden')
    })

    document.querySelector('#audioBtnDiv').addEventListener('click',(e) => {
        audioOn ? audioOn = false : audioOn = true;
        document.getElementById('audioOnIcon').classList.toggle('hidden')
        document.getElementById('audioOffIcon').classList.toggle('hidden')
    })