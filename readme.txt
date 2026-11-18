# SIMTELE-WEB

Panel interactivo educativo de prevención y monitoreo para un sistema de transporte por cable, desarrollado con **HTML5**, **CSS3** y **JavaScript** puro.

> **Nota académica:** Todos los datos, cálculos y umbrales incluidos en esta aplicación son simulaciones didácticas y no representan límites operativos reales de Mi Teleférico.

---

## Integrantes del Grupo
1.Joel Esquivel Castillo
2.Jhoel Abdias Callejas Villegas
3.Nick Bryan Quispe Lipa
4.Ariane Saucedo

---

## Estructura del Proyecto
* `index.html`: Estructura semántica de la página con los cuatro módulos interactivos.
* `styles.css`: Estilos visuales, diseño de tarjetas, tablas y adaptación a dispositivos móviles.
* `script.js`: Lógica de cálculos, manejo del DOM, validaciones, expresiones regulares y almacenamiento local.
* `README.md`: Documentación general del proyecto.

---

## Módulos y Funcionamiento

1. **Detención de Emergencia**
   * **Uso:** Ingrese la velocidad de la cabina (km/h) y el tiempo de reacción (s).
   * **Funcionamiento:** Calcula la distancia recorrida durante la reacción mediante `d = (v / 3.6) * t` y muestra una alerta visual si supera el umbral didáctico de 50 m.

2. **Registro de Mantenimiento**
   * **Uso:** Escriba el nombre del componente, las horas de uso acumuladas y seleccione su estado (*Normal*, *Revisión* o *Urgente*).
   * **Funcionamiento:** Guarda el registro en un arreglo de objetos, lo muestra dinámicamente en una tabla y permite eliminar filas individualmente.

3. **Viento y Oscilación**
   * **Uso:** Ingrese cinco mediciones simuladas de velocidad del viento (km/h).
   * **Funcionamiento:** Calcula el promedio, identifica el valor máximo y clasifica el nivel de alerta (*Estable*, *Precaución* u *Oscilación Alta*) según umbrales didácticos.

4. **Monitoreo de Sensores**
   * **Uso:** Ingrese un código de sensor, seleccione el tipo y digite una lectura numérica.
   * **Funcionamiento:** Valida mediante expresión regular que el código tenga el formato estricto `SEN-000` (ej. `SEN-001`) y que la lectura sea un número válido antes de agregarlo a la tabla de registros.



