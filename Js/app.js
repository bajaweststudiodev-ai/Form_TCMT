// --- NAVEGACIÓN Y VALIDACIÓN ESTRICTA ---
function validarYAvanzar(pasoActual, pasoSiguiente) {
    const pasoDiv = document.getElementById(`paso${pasoActual}`);
    const inputs = pasoDiv.querySelectorAll('input, select, textarea');
    let esValido = true;

    inputs.forEach(input => {
        if (!input.checkValidity()) {
            input.classList.add('touched'); 
            esValido = false;
        } else {
            input.classList.remove('touched');
        }
    });

    if (!esValido) {
        pasoDiv.querySelector(':invalid').reportValidity();
        return;
    }

    // Ocultar paso actual y mostrar el siguiente
    document.getElementById(`paso${pasoActual}`).classList.remove('active');
    document.getElementById(`paso${pasoSiguiente}`).classList.add('active');
    document.getElementById('progress').style.width = `${pasoSiguiente * 25}%`;
    
    // ESTA ES LA LÍNEA QUE FALTABA PARA GENERAR EL CONTRATO AL LLEGAR AL PASO 4
    if (pasoSiguiente === 4) {
        generarContrato();
    }

    window.scrollTo(0, 0);
}
// --- PREVISUALIZACIÓN Y VALIDACIÓN ANTI-BASURA DE FOTO ---
document.getElementById('fotoCara').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const mensaje = document.getElementById('fotoMensaje');
    const previewContainer = document.getElementById('previewContainer');
    const checkboxRostro = document.getElementById('confirmaRostro');

    if (!file) return;

    // 1. Validar que sea una imagen real
    if (!file.type.startsWith('image/')) {
        mensaje.innerText = "❌ Por favor, sube un formato de imagen válido (JPG o PNG).";
        mensaje.style.color = "red";
        this.value = ''; // Borra el archivo malo
        previewContainer.style.display = 'none';
        return;
    }

    // 2. Validar el peso (Máximo 5MB para no saturar tu base de datos)
    if (file.size > 5 * 1024 * 1024) {
        mensaje.innerText = "❌ La imagen es demasiado pesada. Máximo 5MB.";
        mensaje.style.color = "red";
        this.value = ''; 
        previewContainer.style.display = 'none';
        return;
    }

    // 3. Mostrar la foto y el candado de seguridad
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('fotoPreview').src = e.target.result;
        previewContainer.style.display = 'block';
        mensaje.innerText = "✅ Imagen cargada.";
        mensaje.style.color = "green";
        
        // Desmarcar el checkbox por si están subiendo una foto nueva
        checkboxRostro.checked = false; 
    }
    reader.readAsDataURL(file);
});

function retroceder(pasoAnterior) {
    document.querySelector('.form-step.active').classList.remove('active');
    document.getElementById(`paso${pasoAnterior}`).classList.add('active');
    document.getElementById('progress').style.width = `${pasoAnterior * 25}%`;
    window.scrollTo(0,0);
}


// --- GENERADOR DE CONTRATO DINÁMICO Y BLINDADO ---
function generarContrato() {
    // 1. Recolectar datos del usuario
    const nombre = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const nombreCompleto = `${nombre} ${apellidos}` || "[Nombre no ingresado]";
    const nombreTutor = document.getElementById('nombreTutor').value.trim();
    const membresia = document.getElementById('tipoMembresia').value;
    
    // Saber si es menor de edad revisando si la sección del tutor está visible
    const esMenor = !document.getElementById('seccionTutor').classList.contains('oculto');
    
    // 2. Obtener la fecha de hoy en formato legal (ej. 14 de marzo de 2026)
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaHoy = new Date().toLocaleDateString('es-MX', opcionesFecha);

    let textoLegal = "";

    // 3. Crear el texto dependiendo del tipo de membresía y edad
    if (membresia === 'dia' || membresia === 'semana') {
        
        // --- CONTRATO EVENTUAL (Súper estricto, 0% responsabilidad del gimnasio) ---
        const declarante = esMenor ? 
            `Yo, <strong>${nombreTutor}</strong>, como tutor y responsable legal del menor <strong>${nombreCompleto}</strong>` : 
            `Yo, <strong>${nombreCompleto}</strong>, por mi propio derecho y siendo mayor de edad`;

        textoLegal = `
            <p style="text-align: center; font-weight: bold; margin-top: 0;">ACUERDO DE LIBERACIÓN DE RESPONSABILIDAD (PASE EVENTUAL)</p>
            ${declarante}, he leído, comprendido y en fecha <strong>${fechaHoy}</strong> doy consentimiento expreso a lo siguiente:<br><br>
            Entiendo que la práctica de deportes de contacto implica un alto riesgo inherente de lesiones físicas. Al adquirir un pase temporal o eventual, reconozco y acepto expresamente que <strong>Team Cota's Muay Thai NO provee ningún tipo de cobertura médica, seguro de gastos médicos, ni asume responsabilidad económica o legal alguna</strong> por accidentes, lesiones o fatalidades que ocurran dentro de sus instalaciones.<br><br>
            Asumo el 100% del riesgo y de la responsabilidad civil y penal de mis acciones (o las del menor a mi cargo). Libero de manera absoluta e irrevocable a Team Cota's Muay Thai, a sus dueños, instructores y empleados de cualquier reclamación, demanda, compensación o gasto médico derivado de este entrenamiento.
        `;

    } else {
        
        // --- CONTRATO REGULAR (El original, pero blindado legalmente) ---
        const declarante = esMenor ? 
            `Yo, <strong>${nombreTutor}</strong>, en mi calidad de padre/madre o tutor legal del menor <strong>${nombreCompleto}</strong>` : 
            `Yo, <strong>${nombreCompleto}</strong>, mayor de 18 años`;

        textoLegal = `
            <p style="text-align: center; font-weight: bold; margin-top: 0;">ACUERDO Y LIBERACIÓN DE RESPONSABILIDAD</p>
            ${declarante}, he leído, comprendido y en fecha <strong>${fechaHoy}</strong> doy consentimiento expreso e irrevocable a lo siguiente:<br><br>
            Entiendo que el participante está haciendo parte en un deporte que tiene contacto corporal y el cual requerirá que el participante participe en ejercicios de acondicionamiento, combate formal y otras actividades que implican un riesgo real. El participante asume la plena responsabilidad de todas sus acciones y condición de salud durante estas actividades.<br><br>
            Entiendo el riesgo de entrenar Boxeo / Artes Marciales y/o de usar el equipo del gimnasio, y por tanto, <strong>libero absolutamente a Team Cota's Muay Thai, a todos sus empleados, dueños y asociados</strong>, de toda responsabilidad legal, civil o penal por cualquier lesión física leve o grave (incluyendo abrasiones, contusiones, hemorragias, fracturas de huesos/cartílagos o daño en órganos), la muerte o daños materiales sufridos durante su participación.<br><br>
            Renuncio de manera explícita a mi derecho de iniciar cualquier acción legal o demanda de indemnización contra el gimnasio por incidentes ocurridos en sus instalaciones, asumiendo cualquier costo médico que pudiera generarse.
        `;
    }

    // 4. Inyectar el texto en la pantalla
    document.getElementById('contenedorContrato').innerHTML = textoLegal;
}

// --- LÓGICA DE MENOR DE EDAD (TUTOR) ---
document.getElementById('fechaNacimiento').addEventListener('change', function() {
    const fechaNac = new Date(this.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) { edad--; }

    const seccionTutor = document.getElementById('seccionTutor');
    const inputNombreTutor = document.getElementById('nombreTutor');
    const inputTelTutor = document.getElementById('telefonoTutor');

    if (edad < 18) {
        seccionTutor.classList.remove('oculto');
        inputNombreTutor.setAttribute('required', 'true');
        inputTelTutor.setAttribute('required', 'true');
    } else {
        seccionTutor.classList.add('oculto');
        inputNombreTutor.removeAttribute('required');
        inputTelTutor.removeAttribute('required');
        inputNombreTutor.value = '';
        inputTelTutor.value = '';
    }
});

// --- AUTOCOMPLETADO DE CIUDAD Y COLONIAS (ESCALABLE A TODO MÉXICO) ---
document.getElementById('cp').addEventListener('input', async function() {
    const cp = this.value;
    const ciudadInput = document.getElementById('ciudad');
    const coloniaSelect = document.getElementById('colonia');

    if(cp.length === 5) {
        ciudadInput.value = "Buscando...";
        coloniaSelect.innerHTML = '<option value="">Cargando colonias...</option>';

        try {
            // Usamos una API 100% Mexicana basada en SEPOMEX
            const response = await fetch(`https://sepomex.nitrostudio.com.mx/api/20241116/cp/${cp}.json`);
            
            if(!response.ok) throw new Error("CP no encontrado");

            const result = await response.json();
            const datos = result.data.postcodes;

            if (!datos || datos.length === 0) throw new Error("Sin datos de SEPOMEX");

            // SEPOMEX devuelve Municipio (d_mnpio) y Estado (d_estado)
            const municipio = datos[0].d_mnpio;
            const estado = datos[0].d_estado;
            
            // Inyectamos la ciudad real, no importa en qué parte de México estén
            ciudadInput.value = `${municipio}, ${estado}`;

            // Limpiamos el select y lo llenamos con las colonias (d_asenta)
            coloniaSelect.innerHTML = '<option value="" disabled selected>Seleccione su colonia</option>';
            datos.forEach(lugar => {
                const opcion = document.createElement('option');
                opcion.value = lugar.d_asenta;
                opcion.textContent = lugar.d_asenta;
                coloniaSelect.appendChild(opcion);
            });

        } catch (error) {
            // Si el CP es demasiado nuevo o falla el internet, se vuelve manual para que no se trabe el cliente
            ciudadInput.value = '';
            ciudadInput.placeholder = 'Escribe tu Municipio y Estado';
            coloniaSelect.outerHTML = '<input type="text" id="colonia" required placeholder="Escriba su colonia">';
        }
    } else {
        // Si borran números o tienen menos de 5 dígitos
        ciudadInput.value = '';
        coloniaSelect.innerHTML = '<option value="">Ingrese su CP de 5 dígitos primero</option>';
    }
});

// --- ESCÁNER DE INE (OCR con Tesseract.js) ---
document.getElementById('ineInput').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const statusMsg = document.getElementById('ineStatus');
    statusMsg.innerText = "⏳ Analizando credencial... (puede tardar unos segundos)";
    
    try {
        // Ejecuta el OCR en la imagen
        const result = await Tesseract.recognize(file, 'spa');
        const text = result.data.text.toUpperCase();
        console.log("Texto extraído:", text);

        // Lógica básica para buscar Nombres (La INE mexicana tiene NOMBRE, DOMICILIO, etc.)
        // Nota: El OCR puede tener errores de lectura dependiendo de la luz.
        let lineas = text.split('\n').filter(l => l.trim().length > 2);
        
        // Busca la palabra NOMBRE y toma las siguientes líneas
        let indiceNombre = lineas.findIndex(l => l.includes('NOMBRE'));
        if(indiceNombre !== -1 && lineas.length > indiceNombre + 2) {
            document.getElementById('apellidos').value = lineas[indiceNombre + 1].trim(); // Apellido Paterno/Materno
            document.getElementById('nombres').value = lineas[indiceNombre + 2].trim();   // Nombre(s)
            statusMsg.innerText = "✅ Datos extraídos (Por favor verifica que sean correctos)";
            statusMsg.style.color = "green";
        } else {
            statusMsg.innerText = "⚠️ No se pudo leer bien el nombre. Intenta con más luz o llena a mano.";
            statusMsg.style.color = "red";
        }
    } catch (error) {
        statusMsg.innerText = "❌ Error al leer la imagen.";
    }
});

// --- LÓGICA DE LA PIZARRA DE FIRMA ---
const canvas = document.getElementById('pizarraFirma');
const ctx = canvas.getContext('2d');
let pintando = false;
let firmaVacia = true; // Para validar que sí firmaron

ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.strokeStyle = '#000';

function iniciarTrazo(x, y) {
    pintando = true;
    firmaVacia = false;
    ctx.beginPath();
    ctx.moveTo(x, y);
}
function dibujarTrazo(x, y) {
    if (!pintando) return;
    ctx.lineTo(x, y);
    ctx.stroke();
}

// Touch (Celular)
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    iniciarTrazo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
}, { passive: false });
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    dibujarTrazo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
}, { passive: false });
canvas.addEventListener('touchend', () => pintando = false);

// Mouse (PC)
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    iniciarTrazo(e.clientX - rect.left, e.clientY - rect.top);
});
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    dibujarTrazo(e.clientX - rect.left, e.clientY - rect.top);
});
canvas.addEventListener('mouseup', () => pintando = false);
canvas.addEventListener('mouseleave', () => pintando = false);

function limpiarFirma() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    firmaVacia = true;
}

// --- ENVÍO FINAL ---
function enviarFormulario() {
    const aceptoTerminos = document.getElementById('aceptoTerminos').checked;
    
    if (!aceptoTerminos) {
        alert("⚠️ Debes aceptar los términos de liberación de responsabilidad.");
        return;
    }
    if (firmaVacia) {
        alert("⚠️ Por favor, firma en el recuadro antes de enviar.");
        return;
    }

    // Aquí convertimos la firma y la foto a Base64 para enviarlas a la base de datos después
    const fotoBase64 = document.getElementById('fotoPreview').src;
    const firmaBase64 = canvas.toDataURL();

    alert('✅ ¡Registro validado con éxito! Listo para enviarse a la base de datos.');
    window.location.reload();
}