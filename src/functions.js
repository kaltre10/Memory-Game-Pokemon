import bola from './assets/bola.png';

function flipCard(e, par, dataGame){

    //flipped card do nothing
    if(e.target.className == 'card-back') return; 

    if(e.target.className === 'card-base' || e.target.parentNode.className === 'card-base'){

        //we load the varible par
        let nodo;
        let cardId;
        let value;
        if(e.target.parentNode.className === 'card-base'){
            nodo = e.target.parentNode.parentNode.parentNode;
            cardId= e.target.parentNode.parentNode.dataset.id;
            value= e.target.parentNode.nextSibling.textContent;   
        }else{
            nodo = e.target.parentNode.parentNode;
            cardId= e.target.parentNode.dataset.id;
            value= e.target.nextSibling.textContent;
        }
        
        nodo.classList.add('container-item-selected');
    
        loadPar(cardId, value, par, dataGame);

    }
}

function loadPar(cardId, value, par, dataGame){

    if(par.card1.value === ''){

        par.card1.value = value;
        par.card1.id = cardId;

    }else if(par.card2.value === ''){

        par.card2.value = value;
        par.card2.id = cardId;

        checkPar(par, dataGame)
            .then(res => resetPar(par));
        
    }
}

function checkPar(par, dataGame){

    return new Promise((res, rej) => {
        if(par.card1.value !== '' && par.card2.value !== ''){

            
            dataGame.checkClick = false;
            if(par.card1.value  === par.card2.value){
                dataGame.count++;
                setTimeout(() => {
                    dataGame.checkClick = true;
                }, 500)
                   
            }else{
                flipBack(par.card1.id, par)
                    .then(res => flipBack(par.card2.id, par)
                                    .then(res => {
                                        setTimeout(() => {
                                            dataGame.checkClick = true;
                                        }, 500)
                                    }))
                    
                    
            }
    
            
            
            if(dataGame.count === dataGame.countPart){
                setTimeout(() => {
                    dataGame.count = 0;
                    gameOver();
                }, 500)
            }
            
        }
        res()
    }) 
}

function flipBack(id, par){
    return new Promise((res, rej) => {
        let cards = document.querySelectorAll('.card');

        cards.forEach( card => {
            if(card.dataset.id === id){
                //flip card
                setTimeout(() => {
                    card.parentNode.classList.remove('container-item-selected');
                }, 600)
            }
        });
        res();
    })
    
    
}

function resetPar(par){

    par.card1.value = '';
    par.card1.id = '';
    par.card2.value = '';
    par.card2.id = ''; 

}   

async function getPokemon(dataGame){
    let data = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=${dataGame.nivel}`)
    let pokemons = await data.json();
    return pokemons;
    
}

async function dataPokemon(url){
    let data = await fetch(url);
    let pokemon = await data.json();
    return(pokemon);
}

async function arrayPokemons(pokemons){
    return await pokemons
                    .then(res => {
                        let array = res.results.map( pokemon => pokemon );
                        array = [ ...array, ...array ];
                        let newArray = arrayRandom(array);
                        return newArray;
                    });
}

function arrayRandom(array){
    let min = 0;
    let max = array.length - 1;
    const newArray = [];
    array.forEach( ( element, e) => {
        let numberRandom = random(min, max);

        while(typeof newArray[numberRandom] != 'undefined'){
            numberRandom = random(min, max);
        }       

        newArray[numberRandom] = array[e];
    })

    return newArray;
}

const random = (min, max) => {
    return Math.round(Math.random() * (max - min) - min);
}

function paintCard(pokemon){

    const $container = document.querySelector('.container');
    $container.style.display = 'grid';
    const $fragment = document.createDocumentFragment();
    //create div
    const $divContainer = document.createElement('div');
    const $divCard = document.createElement('div');
    const $cardBase = document.createElement('div');
    const $divBack = document.createElement('div');
    const $img = document.createElement('img');
    const $h4 = document.createElement('h4');
    const $h5 = document.createElement('h5');

    //add style css
    $divContainer.classList.add('container-item');
    $divCard.classList.add('card');
    $cardBase.classList.add('card-base');
    $divBack.classList.add('card-back');

    //add data
    $divContainer.appendChild($divCard);
    $divCard.dataset.id = pokemon.id;
    $h4.textContent = 'Pokémon';
    $cardBase.appendChild($h4);
    $h5.textContent = pokemon.name;
    $divBack.appendChild($h5);
    $img.src = pokemon.sprites.front_default;

    //add fragment
    $divContainer.appendChild($divCard);
    $divCard.appendChild($cardBase);
    $divCard.appendChild($divBack);
    $divBack.appendChild($img);
    $container.appendChild($divContainer);

}

function preload(nodo){

    let $preload = document.createElement('div');
    $preload.classList.add('lds-ripple');
    $preload.innerHTML = `<div></div><div></div>`;
    nodo.insertBefore($preload, nodo.children[0]);

}

function removeLoad(){
    document.querySelector('.pre-container').children[0].remove();
}

function init(){

    let  $modal = document.querySelectorAll('.modal') || null;

    $modal.forEach( m => {
        m.remove();
    })

    let $main = document.getElementById('main');
    $main.classList.remove('pre-container');
    $main.classList.add('card-container', 'puffIn');
    document.querySelector('.title').innerHTML = `<h1>Memory Game <img src="${bola}"></h1>`;
    let $btnPlay = document.createElement('button');
    $btnPlay.classList.add('btn-play');
    $btnPlay.textContent = 'Play';
    $main.insertBefore($btnPlay, $main.children[1]);

    $btnPlay.addEventListener('click', () => {
        $main.classList.remove('puffIn');
        $main.classList.add('puffOut');
        setTimeout(() => {
            $main.classList.remove('card-container', 'puffOut');
            $btnPlay.remove();
            $main.classList.add('pre-container');
            document.querySelector('h1').remove();
            preload($main);
            playGame();
        }, 500);
    })

}

function playGame(){
    setTimeout(() => {
        removeLoad();
        let $main = document.getElementById('main');
        $main.classList.remove('pre-container');
        $main.classList.add('game-container', 'puffIn');
        let $title = document.querySelector('.title');
        $title.innerHTML = `<h1>Memory Game <img src="${bola}"></h1>`; 

        //btc
        let $btn = document.createElement('button');
        $btn.classList.add('btn-restart');
        $btn.textContent = 'Restart';
        
        $title.insertBefore($btn, $title.children[0]);

        $btn.addEventListener('click', () => {
            document.querySelector('.game-container').classList.remove('puffIn');
            document.querySelector('.game-container').classList.add('puffOut');
            
            setTimeout(()=> {
                restart();
            }, 500);
        });

        play();
    },500);
    
    
}

async function play(){

    //we initialize variable par
    let dataGame = {
        count: 0,
        countPart: 8,
        nivel: 8,
        checkClick: true
    }
    
    const par = {
            card1 : {
                value: '',
                id: '',
            },
            card2 : {
                value: '',
                id: '',
            },
    }
    
    document.addEventListener('click', e => {
        if(dataGame.checkClick){
            flipCard(e, par, dataGame);
        }
    });
    
    arrayPokemons(getPokemon(dataGame))
        
        .then(res => res.forEach( pokemon => {
            dataPokemon( pokemon.url )
                .then( res => paintCard( res ))
        }))
        
    ;
    
}

function gameOver(){
    let $modal = document.createElement('div');
    $modal.classList.add('modal', 'magictime', 'puffIn');
    $modal.innerHTML = "<h3>Game Over</h3>";

    //btc
    let $btn = document.createElement('button');
    $btn.classList.add('btn-restart');
    $btn.textContent = 'Restart';

    $modal.appendChild($btn);

    document.body.appendChild($modal);

    document.querySelector('.game-container').classList.remove('puffIn');

    $btn.addEventListener('click', () => {
        $modal.classList.remove('puffIn');
        $modal.classList.add('puffOut');
        document.querySelector('.game-container').classList.add('puffOut');
        
        setTimeout(()=> {
            restart();
            $modal.remove();
        }, 500);

       
    });
}

function restart(){    
    
    let $main = document.getElementById('main');
    $main.classList.remove('game-container', 'puffOut');
    $main.classList.add('pre-container');
    let $container = document.querySelector('.container');
    $container.innerHTML = '';
    let $title = document.querySelector('.title');
    $title.innerHTML = '';

    //add preload
    preload(document.querySelector('.pre-container'));

    setTimeout(() => {
        removeLoad();      
        init();
    },500);
}

export {
    flipCard,
    getPokemon,
    arrayPokemons,
    paintCard,
    dataPokemon,
    preload,
    removeLoad,
    init,
}