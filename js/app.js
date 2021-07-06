const criptomonedasSelect = document.querySelector('#criptomonedas')
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado')

const objBusqueda ={
    moneda: '',
    criptomoneda: ''
}


// promise

const obtenerCriptomonedas = criptomonedas => new Promise (resolve => {
    resolve(criptomonedas)
} )

document.addEventListener('DOMContentLoaded', ()=>{
    consultarCritpomonedas()

    formulario.addEventListener('submit', submitFormulario)

    criptomonedasSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)
})

// Consulta a la API para traer un listado las 100 cripto segun marketcap
async function consultarCritpomonedas (){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD'

    try{
        const respuesta = await fetch(url)
        const resultado = await respuesta.json()
        const criptomonedas = await obtenerCriptomonedas(resultado.Data)
        selectCriptomonedas(criptomonedas)
    } catch(error){
        console.log(error)
    }
}

// llenar el select con las 100 cripto
function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const { FullName, Name} = cripto.CoinInfo

        const option = document.createElement('option')
        option.value = Name
        option.textContent = FullName
        criptomonedasSelect.appendChild(option)
    });
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value
}

function submitFormulario(e) {
    e.preventDefault()
    // extraer valores del obj de busqueda
    const {moneda, criptomoneda} = objBusqueda
    // validar
    if (moneda ==='' || criptomoneda===''){
        mostrarAlerta('ambos campos son obligatorios')
        return
    }
    // Consultar la API con los resultados
    consultarAPI()
}

function mostrarAlerta(msg){
    const divMensaje = document.createElement('div')
    divMensaje.classList.add('error')
    divMensaje.textContent= msg
    formulario.appendChild(divMensaje)

    setTimeout(() =>{
        divMensaje.remove()
    },3000)
}

async function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner()

    try {
        const respuesta = await fetch (url)
        const cotizacion = await respuesta.json()
        MostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
    } catch (error) {
        console.log(error)
    }
}

function MostrarCotizacionHTML(cotizacion){
    limpiarHTML()

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR} = cotizacion

    const precio = document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML = `El precio es: <span> ${PRICE} </span>`

    const precioHigh = document.createElement('p')
    precioHigh.innerHTML = `El precio mas alto del dia fue <span> ${HIGHDAY} </span>`

    const precioLow = document.createElement('p')
    precioLow.innerHTML = `El precio mas bajo del dia fue <span> ${LOWDAY} </span>`

    const variacion = document.createElement('p')
    variacion.innerHTML = `La variacion al momento del dia es: <span> ${CHANGEPCT24HOUR}% </span>`



    resultado.appendChild(precio)
    resultado.appendChild(precioHigh)
    resultado.appendChild(precioLow)
    resultado.appendChild(variacion)
}

function limpiarHTML (){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;

    resultado.appendChild(spinner);
}