import style from './style.css';
import magic from './magic.min.css';
import background from './assets/background.jpg';

import { 
        flipCard,
        getPokemon,
        arrayPokemons, 
        paintCard,
        dataPokemon,
        preload, 
        removeLoad,
        init,
} from './functions';

//add preload
preload(document.querySelector('.pre-container'));

document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            removeLoad();      
            init();
        },500);   
});


