// ==========================================
// ARREGLOS GLOBALES DE ESTADO (Con soporte localStorage opcional)
// ==========================================
let registrosMantenimiento = JSON.parse(localStorage.getItem('simtele_mantenimiento')) || [];
let registrosSensores = JSON.parse(localStorage.getItem('simtele_sensores')) || [];

// ==========================================
// MÓDULO 1: DETENCIÓN DE EMERGENCIA
// ==========================================
function calcularDetencion(evento) {
  evento.preventDefault();

  const velocidad = parseFloat(document.getElementById('velocidad').value);
  const tiempo = parseFloat(document.getElementById('tiempo').value);
  const cajaResultado = document.getElementById('resultado-detencion');

  // Validaciones
  if (isNaN(velocidad) || isNaN(tiempo) || velocidad <= 0 || tiempo <= 0) {
    cajaResultado.className = 'resultado-box activo alerta-peligro';
    cajaResultado.textContent = 'Error: Ingrese valores numéricos válidos mayores a 0 para velocidad y tiempo.';
    return;
  }

  // Cálculo: d = (v / 3.6) * t
  const distancia = (velocidad / 3.6) * tiempo;
  const distanciaFormateada = Number.isInteger(distancia) ? distancia : distancia.toFixed(2);

  // Umbral ficticio didáctico: 50 metros
  if (distancia > 50) {
    cajaResultado.className = 'resultado-box activo alerta-peligro';
    cajaResultado.innerHTML = `Distancia estimada: <strong>${distanciaFormateada} m</strong>.<br>⚠️ Aviso Simulado: Supera el umbral didáctico de 50 m. Se requiere mayor distancia de seguridad.`;
  } else {
    cajaResultado.className = 'resultado-box activo alerta-ok';
    cajaResultado.innerHTML = `Distancia estimada: <strong>${distanciaFormateada} m</strong>.<br>✅ Aviso Simulado: Dentro del rango didáctico permitido (≤ 50 m).`;
  }
}

// ==========================================
// MÓDULO 2: MANTENIMIENTO (Arreglo de objetos + Tabla DOM)
// ==========================================
function agregarMantenimiento(evento) {
  evento.preventDefault();

  const inputComponente = document.getElementById('componente');
  const inputHoras = document.getElementById('horas');
  const selectEstado = document.getElementById('estado');
  const divError = document.getElementById('error-mantenimiento');

  const componente = inputComponente.value.trim();
  const horas = parseFloat(inputHoras.value);
  const estado = selectEstado.value;

  // Validación
  if (componente === '' || isNaN(horas) || horas < 0 || estado === '') {
    divError.textContent = 'Error: Complete todos los campos correctamente (horas deben ser ≥ 0).';
    return;
  }

  divError.textContent = '';

  // Crear objeto y agregarlo con push
  const nuevoRegistro = {
    id: Date.now(),
    componente: componente,
    horas: horas,
    estado: estado
  };

  registrosMantenimiento.push(nuevoRegistro);
  guardarYRenderizarMantenimiento();

  // Limpiar formulario
  document.getElementById('form-mantenimiento').reset();
}

function eliminarMantenimiento(id) {
  // Filtrar el arreglo excluyendo el ID eliminado
  registrosMantenimiento = registrosMantenimiento.filter(item => item.id !== id);
  guardarYRenderizarMantenimiento();
}

function guardarYRenderizarMantenimiento() {
  localStorage.setItem('simtele_mantenimiento', JSON.stringify(registrosMantenimiento));
  const tbody = document.getElementById('tbody-mantenimiento');
  tbody.innerHTML = '';

  registrosMantenimiento.forEach(registro => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${registro.componente}</td>
      <td>${registro.horas} hrs</td>
      <td><strong>${registro.estado}</strong></td>
      <td>
        <button type="button" class="btn-delete" onclick="eliminarMantenimiento(${registro.id})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

// ==========================================
// MÓDULO 3: VIENTO Y OSCILACIÓN
// ==========================================
function analizarViento(evento) {
  evento.preventDefault();

  const inputs = document.querySelectorAll('.input-viento');
  const cajaResultado = document.getElementById('resultado-viento');
  const mediciones = [];

  // Recolectar y validar las 5 mediciones
  for (let i = 0; i < inputs.length; i++) {
    const valor = parseFloat(inputs[i].value);
    if (isNaN(valor) || valor < 0) {
      cajaResultado.className = 'resultado-box activo alerta-peligro';
      cajaResultado.textContent = `Error: La medición ${i + 1} debe ser un número válido igual o mayor a 0.`;
      return;
    }
    mediciones.push(valor);
  }

  // Calcular suma y máximo usando forEach
  let suma = 0;
  let maximo = mediciones[0];

  mediciones.forEach(velocidad => {
    suma += velocidad;
    if (velocidad > maximo) {
      maximo = velocidad;
    }
  });

  const promedio = suma / mediciones.length;
  const promedioFormateado = Number.isInteger(promedio) ? promedio : promedio.toFixed(2);

  // Clasificación con umbrales didácticos
  let clasificacion = '';
  let claseAlerta = '';

  if (promedio < 25) {
    clasificacion = 'Viento Estable (Operación simulada normal)';
    claseAlerta = 'alerta-ok';
  } else if (promedio <= 45) {
    clasificacion = 'Precaución (Monitorear oscilación de cabinas)';
    claseAlerta = 'alerta-precaucion';
  } else {
    clasificacion = 'Oscilación Alta (Simulación de reducción de velocidad)';
    claseAlerta = 'alerta-peligro';
  }

  cajaResultado.className = `resultado-box activo ${claseAlerta}`;
  cajaResultado.innerHTML = `
    Promedio: <strong>${promedioFormateado} km/h</strong> | Máximo registrado: <strong>${maximo} km/h</strong><br>
    Clasificación didáctica: <strong>${clasificacion}</strong>
  `;
}

// ==========================================
// MÓDULO 4: SENSORES (Expresión Regular + Validación)
// ==========================================
function registrarSensor(evento) {
  evento.preventDefault();

  const codigo = document.getElementById('codigo-sensor').value.trim();
  const tipo = document.getElementById('tipo-sensor').value;
  const lectura = parseFloat(document.getElementById('lectura-sensor').value);
  const divError = document.getElementById('error-sensores');

  // Expresión regular obligatoria: SEN- seguido de 3 dígitos
  const regexCodigo = /^SEN-\d{3}$/;

  if (!regexCodigo.test(codigo)) {
    divError.textContent = 'Error: El código debe cumplir el formato exacto SEN-000 (Ej: SEN-001).';
    return;
  }

  if (tipo === '') {
    divError.textContent = 'Error: Seleccione un tipo de sensor.';
    return;
  }

  if (isNaN(lectura)) {
    divError.textContent = 'Error: La lectura debe ser un valor numérico válido y no estar vacía.';
    return;
  }

  divError.textContent = '';

  // Guardar sensor válido
  registrosSensores.push({ codigo, tipo, lectura });
  guardarYRenderizarSensores();

  document.getElementById('form-sensores').reset();
}

function guardarYRenderizarSensores() {
  localStorage.setItem('simtele_sensores', JSON.stringify(registrosSensores));
  const tbody = document.getElementById('tbody-sensores');
  tbody.innerHTML = '';

  registrosSensores.forEach(sensor => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td><strong>${sensor.codigo}</strong></td>
      <td>${sensor.tipo}</td>
      <td>${sensor.lectura}</td>
    `;
    tbody.appendChild(fila);
  });
}

// ==========================================
// INICIALIZACIÓN DE EVENTOS AL CARGAR EL DOM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form-detencion').addEventListener('submit', calcularDetencion);
  document.getElementById('form-mantenimiento').addEventListener('submit', agregarMantenimiento);
  document.getElementById('form-viento').addEventListener('submit', analizarViento);
  document.getElementById('form-sensores').addEventListener('submit', registrarSensor);

  // Cargar datos previos si existen en localStorage
  guardarYRenderizarMantenimiento();
  guardarYRenderizarSensores();
});