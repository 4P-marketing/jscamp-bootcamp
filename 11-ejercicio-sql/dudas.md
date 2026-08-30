# Dudas

## Duda 1

No tengo nada claro para que sirve el `id` de la tabla `job_content`, ya que el `job_id` es único y no se repite,para qué necesitamos otro `id`? De todas formas, para seguir el mismo criterio he usado `crypto.randomUUID()` para generar un id único para cada contenido.

## Duda 2

Una de las pruebas es del `README.md` es:

```bash
curl -X PUT http://localhost:3000/jobs/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Senior Frontend Developer"}'
```

Pero no hay `PUT` definido en `11-ejercicio-sql/controllers/jobs.ts`
Tampoco hay un `put` en las rutas `11-ejercicio-sql/routes/jobs.ts` 
Con esto en cuenta aunque no sea lo correcto, solo he desarrollado la función equivalente a un put y a un patch en el `update` de `11-ejercicio-sql/models/job.ts`.
