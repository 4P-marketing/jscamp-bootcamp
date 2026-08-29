/*
 * Aquí debes crear el schema de validación con Zod para los jobs
 *
 * Recuerda:
 * - Importar zod
 * - Crear un schema que valide la estructura de un job
 * - Exportar funciones validateJob() y validatePartialJob()
 * - Usar safeParse() para validar sin lanzar excepciones
 * - Definir reglas de validación (min, max, required, optional, etc.)
 */

import { z } from 'zod';

const jobSchema = z.object({
  titulo: z
    .string('El título es obligatorio y debe ser un string')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede tener más de 100 caracteres'),
  empresa: z
    .string('La empresa es obligatoria y debe ser un string')
    .min(1, 'La empresa no puede estar vacía'),
  ubicacion: z
    .string('La ubicación es obligatoria y debe ser un string')
    .min(1, 'La ubicación no puede estar vacía'),
  descripcion: z.string('La descripción debe ser un string').optional(),
  content: z.string('El content debe ser un string').optional(),
  data: z
    .object({
      technology: z.array(
        z.string('Cada tecnología debe ser un string'),
        'technology debe ser un array de strings'
      ),
      modalidad: z.string('La modalidad debe ser un string').optional(),
      nivel: z.string('El nivel debe ser un string').optional(),
    })
    .optional(),
});

export function validateJob(job) {
  return jobSchema.safeParse(job);
}

export function validatePartialJob(job) {
  return jobSchema.partial().safeParse(job);
}