# Rodme Health

Aplicación web para organizar información personal de salud familiar. Interfaz estática en React 18, publicada mediante GitHub Pages. Diseño unificado en **toda la aplicación** (portada, pacientes, citas, medicamentos, expediente, centro de salud, seguimiento y configuración) inspirado en el lenguaje visual de la plantilla Wix «Clínica médica» (html/1820): turquesa, azul, fondos claros, tipografía Manrope/Plus Jakarta Sans y tarjetas clínicas. Se mantiene la lógica original y no se integran los servicios ni sistemas comerciales de Wix. La fotografía decorativa del encabezado muestra un espacio médico, no una persona.

## Funciones
- Panel de salud familiar y buscador local.
- Pacientes y expedientes independientes por persona.
- Citas médicas: calendario mensual/semanal, estados, preparación y exportación iCalendar (`.ics`).
- Medicamentos: horarios anotados, registro de dosis administradas/omitidas, inventario manual y seguimiento.
- Laboratorios con resultados fechados y comparaciones descriptivas (sin interpretación clínica).
- Vacunas con fechas de aplicación y próxima dosis.
- Documentos: metadatos y adjuntos pequeños guardados localmente.
- Seguimiento por paciente de seis signos vitales, gráficos descriptivos sin interpretación diagnóstica y diario de síntomas.
- Pendientes consolidados de laboratorios, resultados aún sin revisar, vacunación, citas sin confirmar y tareas de seguimiento.
- Indicaciones posteriores a consultas, vinculadas opcionalmente con su cita y con los resultados de laboratorio.
- Ficha de emergencia imprimible con autorización del usuario antes de abrirla.
- Historial cronológico por paciente, resumen imprimible, buscador y copias de seguridad cifradas.
- PWA instalable con caché de archivos estáticos; avisos locales opcionales únicamente mientras se utiliza la aplicación.

## Almacenamiento y privacidad
Los datos de pacientes se guardan mediante `localStorage` **sin cifrar en reposo**. El modo predeterminado continúa siendo LOCAL. Se preparó un modo en línea con Firebase Auth y Firestore, pero no funcionará hasta conectar un proyecto Firebase real y publicar las reglas de seguridad. Sin la configuración, no hay sincronización, autenticación familiar, auditoría segura, respaldo automático remoto ni notificaciones push persistentes. Un tercero con acceso al dispositivo/perfil del navegador podría leer los datos. **No utilizar para datos médicos sensibles en un entorno no confiable ni como expediente clínico oficial.**

Las nuevas mediciones, síntomas y tareas de seguimiento se guardan y se eliminan junto con el paciente correspondiente, y se incluyen en los respaldos. Los archivos antiguos de respaldo siguen siendo compatibles.

Las copias exportadas en formato `.rhbackup` se cifran con una contraseña mediante AES-GCM y PBKDF2 antes de descargarse. La contraseña no se almacena ni se puede recuperar. Hay que exportar y conservar las copias manualmente. La restauración reemplaza los registros locales después de confirmar.

Los documentos locales adjuntos se limitan a PDF/JPG/PNG/WebP de máximo 600 KB cada uno y están incluidos en la copia cifrada exportable. La caché del Service Worker almacena solamente recursos públicos estáticos, nunca información del paciente.

Los recordatorios dentro de la aplicación dependen del permiso del navegador y de que la aplicación permanezca abierta. La exportación `.ics` permite añadir avisos al calendario del dispositivo.

## Para un uso clínico real
Antes de utilizar datos médicos reales de familiares o pacientes, implementar un backend privado autenticado, cifrado de datos en reposo, permisos familiares y auditoría, control de sesiones, copias automatizadas verificables, eliminación segura y políticas de protección de datos aplicables en Costa Rica. No se debe considerar que GitHub Pages por sí solo proporciona estas funciones.

## Organización y mejoras de interfaz
- Diseño de Wix 1820 unificado en todas las pantallas y estilos anteriores sin uso eliminados.
- Perfil familiar organizado por pestañas de Resumen, Citas, Tratamientos, Historial y Documentos.
- Formularios con comprobación de datos y confirmación antes de descartar cambios.
- Menú móvil, zonas táctiles accesibles y portada compacta para visualizar acciones sin desplazarse tanto.
- Archivos de estilos y código por separado para favorecer la reutilización de caché.
- Copias cifradas con comprobación de descifrado antes de exportar; recordatorio local si no se inició una exportación reciente. La fecha de exportación no garantiza que el usuario haya guardado el archivo.

## Archivos
- `index.html`: estructura HTML reducida.
- `styles.css`: diseño unificado y estilos responsivos.
- `app.js`: lógica React y almacenamiento local.
- `manifest.webmanifest`: instalación como PWA.
- `app-icon.svg`: icono original de la aplicación.
- `sw.js`: caché limitada a recursos públicos estáticos, incluidos CSS y JS.

No incluir nunca expedientes ni datos reales de pacientes en el repositorio público.

## Modo familiar en línea (preparado; requiere activación)

**IMPORTANTE: la sincronización todavía no está activa.** Este sitio se aloja públicamente en GitHub Pages. No coloques datos médicos reales en un proyecto Firebase en modo de prueba o con reglas que permitan acceso público.

### Pasos de puesta en marcha

1. Crear un proyecto propio en la consola Firebase; activar Authentication con proveedor Email/Password y Cloud Firestore en modo de reglas privadas.
2. Publicar el archivo firestore.rules en Firestore Database > Rules. No usar reglas de lectura o escritura pública.
3. Añadir mariarodme.github.io a Authentication > Settings > Authorized domains.
4. Registrar una aplicación web en Firebase y copiar SOLAMENTE su configuración web pública (apiKey, authDomain, projectId, appId) al archivo firebase-config.js, sustituyendo el valor null. Nunca publicar credenciales privadas ni un service account.
5. Verificar las reglas con Firebase Emulator Suite: cuenta no verificada, persona no invitada, lectura solamente, editor, propietaria, acceso revocado y sesión caducada.
6. Abrir Rodme Health, crear una cuenta, verificar el correo y crear una familia. Desde Configuración se pueden invitar familiares por correo, elegir permiso y copiar el código familiar; cada familiar usa su propia cuenta.
7. Si se poseen registros anteriores en un navegador, la propietaria puede importarlos a un espacio en línea vacío. Se conserva la copia local anterior. Comprobar primero que los registros hayan llegado a la nube.

### Diseño técnico

- El módulo cloud.js inicializa Firebase solo si está configurado; en caso contrario la web sigue funcionando en modo local y muestra claramente que no sincroniza.
- Firestore guarda por ID pacientes, citas, medicamentos, dosis, laboratorios, vacunas, documentos con sus adjuntos pequeños, signos vitales, síntomas, pendientes y expedientes individuales. Las preferencias se almacenan en documentos separados.
- Las personas invitadas usan correo verificado. El propietario invita con rol editor o solo lectura; las reglas de Firestore comprueban el rol en el servidor. Revocar un miembro elimina su autorización de acceso.
- El cliente escucha cambios en tiempo real. Durante una sesión en línea los registros se mantienen en memoria, no se duplican automáticamente al almacenamiento local; los registros previos del modo local no se borran.
- Exportar una copia cifrada sigue disponible. Restaurar la copia al espacio remoto está deshabilitado intencionalmente para evitar borrar cambios de otros familiares.
- El navegador sin conexión bloquea nuevas ediciones, se muestran errores de escritura y se evita afirmar que los cambios han terminado de sincronizarse mientras hay escrituras pendientes.

### Límites y protección de datos

Esta integración NO se ha probado todavía contra un proyecto Firebase real, por falta de conexión y credenciales del propietario. Debe verificarse antes de depender de ella. Dos ediciones simultáneas del mismo registro pueden entrar en conflicto (prevalece la última). Los datos almacenados en Firebase no llevan cifrado extremo a extremo; administradores con permisos sobre el proyecto podrían acceder a ellos. Mantener copias de seguridad verificadas, control de sesiones y accesos, auditoría, consentimiento familiar, política de privacidad y cumplimiento normativo aplicable en Costa Rica. No es un expediente clínico certificado.
