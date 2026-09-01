# Dudas

## Duda 1

No tengo nada claro para que sirve el `id` de la tabla `job_content`, ya que el `job_id` es único y no se repite,para qué necesitamos otro `id`? De todas formas, para seguir el mismo criterio he usado `crypto.randomUUID()` para generar un id único para cada contenido.

**Respuesta:**

Muy buena pregunta! Que `job_content` sea un `NOT NULL` y que tenga `FOREIGN KEY` con `job_id` no implica que cada dato sea único. Una cosa es que el contenido de una tabla sea único y otra cosa es que haya un job_content único para cada job.

Para definir que cada `job_content` sea único, lo que podemos hacer es:
- Agregar un `id` (lo que hicimos)
- O aún mejor, que viendo tu consulta es una mejor idea: pasar el `job_id` como `PRIMARY KEY` o marcarlo como `UNIQUE`. De esta manera no necesitamos un `id` extra.

Muy bien visto!

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

**Respuesta:**

Perfecto! Si, fue error nuestro al hacer la letra del ejercicio, contamos con que estaba definido y no. Muy bien resuelto!
