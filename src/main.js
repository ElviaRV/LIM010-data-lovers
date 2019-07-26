const inputcorreo = document.getElementById('inputcorreo');
const inputcontraseña = document.getElementById('inputcontrasena');
const ingresa = document.getElementById('ingresa');
const error = document.getElementById('error');
const segundapantalla = document.getElementById('segundapantalla');
const login = document.getElementById('login');
const selectElementIndicador = document.getElementById('select-element-indicador');
const selectElementPais = document.getElementById('select-element-pais');
const selectElementPaisIndicator = document.getElementById('select-element-pais-indicator');
const tabladedatos = document.getElementById('tabladedatos');
const selectOrderYears = document.getElementById('select-order-years');
const inputdesde = document.getElementById('inputdesde');
const inputhasta = document.getElementById('inputhasta');
const rango = document.getElementById('rango');
const promedio = document.getElementById('promedio');
const contenedorPromedio = document.getElementById('contenedor-promedio');

ingresa.addEventListener('click', () => {
  if (inputcorreo.value === 'LABORATORIA' && inputcontraseña.value === 'LABORATORIA') {
    segundapantalla.classList.toggle('show');
    login.classList.toggle('hide');
  } else {
    error.innerHTML = 'contraseña incorrecta';
  }
});

// Voy a utilizar las propiedad del objeto worldbank para utilizarlo como array de paises

const arrPaises = worldbank.formarArrayDePaises(WORLDBANK);
console.log(arrPaises);

const pintaOpcionesEnElementoSelect = (arr, elemento, msg) => {
  let string = `<option>Seleccionar un ${msg}</option>`;
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'object') {
      string += `<option id=${i} value=${i}>${arr[i].indicatorName}</option>`;
    } else {
      string += `<option value=${arr[i]}>${arr[i]}</option>`;
    }
  }
  elemento.innerHTML = string;
};

// Pintamos los paises de manera dinámica
pintaOpcionesEnElementoSelect(arrPaises, selectElementPais, 'pais');
let arrayIndicadores = [];

// Evento para seleccionar un pais desde la pantalla

selectElementPais.addEventListener('change', (event) => {
  const paisSeleccionado = event.target.value;
  const arrIndicadores = worldbank.obtenerIndicadoresPorPais(WORLDBANK, paisSeleccionado);
  console.log(arrIndicadores);
  // Pintamos los indicadores de manera dinámica
  pintaOpcionesEnElementoSelect(arrIndicadores, selectElementIndicador, 'indicador');

  // CREANDO LA FUNCIÓN DE LA TABLA 

  const creandoTabla = (datajunta) => {
    let template = `
      <th>Año</th>
      <th>Porcentaje</th> `;

    for (let j = 0; j < datajunta.length; j++) {
      template += `
        <tr class='tabla'>
      <td class='celda'>${datajunta[j].anio}</td>
      <td class='celda'>${datajunta[j].porcentaje}</td>
      </tr>`;
    };
    tabladedatos.innerHTML = template;
  };

  // EVENTO PARA MOSTRAR TABLA POR INDICADOR

  selectElementIndicador.addEventListener('change', (event) => {
    const indicadorSeleccionado = event.target.value;
    const objectData = worldbank.obtenerObjetoData(WORLDBANK, paisSeleccionado, indicadorSeleccionado);
    console.log(worldbank.obtenerObjetoData(WORLDBANK, paisSeleccionado, indicadorSeleccionado));
    const arraydeObjetos = worldbank.obtenerdata(objectData);
    console.log(arraydeObjetos);
    creandoTabla(arraydeObjetos);

    // EVENTO PARA ORDENAR ASCENDENTE Y DESCENDENTE

    selectOrderYears.addEventListener('change', (event) => {
      const ordenSelected = event.target.value;
      console.log(ordenSelected);
      const condicionalOrden = worldbank.funcionOrdenAnios(ordenSelected, arraydeObjetos);
      console.log(condicionalOrden);
      creandoTabla(condicionalOrden);
    });

    // EVENTO PARA FILTRAR POR RANGO DE AÑOS
    rango.addEventListener('click', () => {
      const arrayDeObjetosRango = worldbank.filtroaños(inputdesde.value, inputhasta.value, objectData);
      creandoTabla(arrayDeObjetosRango);
    });
    promedio.addEventListener('click', () => {
      contenedorPromedio.innerHTML = worldbank.funcionPromedio(arraydeObjetos);
      console.log(worldbank.funcionPromedio(arraydeObjetos));
    });
  });
});

