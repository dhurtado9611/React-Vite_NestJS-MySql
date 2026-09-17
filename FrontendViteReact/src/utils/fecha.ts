// Fecha calendario LOCAL en formato YYYY-MM-DD.
//
// `date.toISOString().split('T')[0]` usa UTC: en Colombia (UTC-5), cualquier
// reserva o turno creado entre las 19:00 y las 23:59 hora local cae ya en el
// día siguiente en UTC, así que quedaba guardado con la fecha equivocada
// (un día adelantado). Esto hacía que el contador de tiempo de la habitación
// pareciera sumar un día extra tras la medianoche. Usar esta función en su
// lugar evita el corrimiento.
export const getFechaLocal = (date: Date = new Date()): string => {
  const anio = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};
