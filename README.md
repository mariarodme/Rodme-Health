# Rodme Health

Aplicación web para organizar información personal de salud familiar. Interfaz estática en React 18, publicada mediante GitHub Pages. Diseño de la portada y de la interfaz renovado con inspiración visual en la plantilla Wix «Clínica médica» (html/1820), adaptada para uso personal sin integrar los servicios comerciales ni sistemas de Wix.

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
Los datos de pacientes se guardan mediante `localStorage` **sin cifrar en reposo**. No hay servidor, inicio de sesión, sincronización entre dispositivos, autenticación familiar, permisos de acceso verificables, auditoría segura, respaldo automático remoto ni notificaciones push persistentes. Un tercero con acceso al dispositivo/perfil del navegador podría leer los datos. **No utilizar para datos médicos sensibles en un entorno no confiable ni como expediente clínico oficial.**

Las nuevas mediciones, síntomas y tareas de seguimiento se guardan y se eliminan junto con el paciente correspondiente, y se incluyen en los respaldos. Los archivos antiguos de respaldo siguen siendo compatibles.

Las copias exportadas en formato `.rhbackup` se cifran con una contraseña mediante AES-GCM y PBKDF2 antes de descargarse. La contraseña no se almacena ni se puede recuperar. Hay que exportar y conservar las copias manualmente. La restauración reemplaza los registros locales después de confirmar.

Los documentos locales adjuntos se limitan a PDF/JPG/PNG/WebP de máximo 600 KB cada uno y están incluidos en la copia cifrada exportable. La caché del Service Worker almacena solamente recursos públicos estáticos, nunca información del paciente.

Los recordatorios dentro de la aplicación dependen del permiso del navegador y de que la aplicación permanezca abierta. La exportación `.ics` permite añadir avisos al calendario del dispositivo.

## Para un uso clínico real
Antes de utilizar datos médicos reales de familiares o pacientes, implementar un backend privado autenticado, cifrado de datos en reposo, permisos familiares y auditoría, control de sesiones, copias automatizadas verificables, eliminación segura y políticas de protección de datos aplicables en Costa Rica. No se debe considerar que GitHub Pages por sí solo proporciona estas funciones.

## Archivos
- `index.html`: interfaz, estilos y lógica local.
- `manifest.webmanifest`: instalación como PWA.
- `app-icon.svg`: icono original de la aplicación.
- `sw.js`: caché limitada a recursos estáticos.

No incluir nunca expedientes ni datos reales de pacientes en el repositorio público.
