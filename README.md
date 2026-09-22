# ShimmerShine — Catálogo de Joyería

Catálogo web tipo revista de ShimmerShine (joyería en plata 925), migrado desde
un único HTML autónomo a un proyecto Next.js. Los productos se leen desde una
hoja de Google Sheets publicada como CSV y las fotos se sirven desde
Cloudinary. No hay ningún campo editable en la página pública: todo el
contenido sale de la planilla, y el botón de contacto abre WhatsApp al número
fijo `+56966129549`.

## Cómo funciona

- `app/page.tsx` pide el CSV publicado (`GOOGLE_SHEET_CSV_URL`) en el
  servidor y lo vuelve a pedir cada 5 minutos (ISR), así que basta con editar
  la planilla para que el catálogo se actualice — sin volver a desplegar.
- `lib/products.ts` interpreta el CSV, agrupa los productos por `categoria`
  (en el orden en que aparecen en la planilla) y arma "páginas" de revista:
  una por categoría, con todos sus productos.
- `components/Catalog.tsx` maneja la navegación (pestañas de categoría,
  flechas anterior/siguiente, teclado, swipe en celular) y abre la ficha de
  detalle de cada pieza (foto con zoom, descripción, disponibilidad, talla,
  botón "Consultar por WhatsApp").

## 1. Columnas esperadas en el Google Sheet

| Columna                | Obligatoria | Notas                                                                 |
| ----------------------- | :---------: | ---------------------------------------------------------------------- |
| `categoria`             | Sí          | Define las pestañas y el orden de las páginas (orden de aparición).   |
| `nombre`                | Sí          | Filas sin nombre se ignoran.                                          |
| `material`              | No          |                                                                          |
| `precio`                | No          | Solo números (se formatea como CLP automáticamente).                  |
| `url_imagen` o `url_imagen_cloudinary` | No | URL completa de Cloudinary. Varias fotos: sepáralas con `\|`.   |
| `archivo_imagen` o `archivo_imagen_local` | No | Si no hay URL, se arma sola a partir del nombre de archivo (ver más abajo). |
| `descripcion`           | No          |                                                                          |
| `disponibilidad`        | No          | "Disponible" se resalta; "última"/"agotado" se marca en rojo.         |
| `talla`                 | No          |                                                                          |

El proyecto acepta encabezados con o sin tildes/mayúsculas, y detecta solo si
el CSV viene separado por `,` o por `;`.

### Publicar la hoja como CSV

1. En Google Sheets: **Archivo → Compartir → Publicar en la web**.
2. Elige la hoja con los productos y el formato **Valores separados por comas (.csv)**.
3. Publica y copia el link que te da Google (termina en `output=csv`).
4. Pégalo como `GOOGLE_SHEET_CSV_URL` en `.env.local` (local) y en Vercel
   (producción).

Cualquier cambio que hagas en la planilla se refleja en el sitio en un
máximo de 5 minutos, sin necesidad de hacer `git push`.

## 2. Fotos en Cloudinary

Tienes dos formas de resolver las imágenes:

**A) Poner la URL completa de Cloudinary** en la columna `url_imagen` /
`url_imagen_cloudinary` de cada fila. Es la forma más explícita.

**B) Solo poner el nombre del archivo** (columna `archivo_imagen` /
`archivo_imagen_local`, como ya tienes en `productos_shimmershine.csv`) y
dejar que el sitio arme la URL solo. Para esto:

1. Sube las fotos a Cloudinary usando el mismo nombre de archivo (sin
   extensión) como `public_id`, dentro de una carpeta fija (por defecto
   `shimmershine`). El script de abajo hace esto automáticamente.
2. Define `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (tu cloud name de Cloudinary)
   en `.env.local` y en Vercel. El sitio arma la URL como:
   `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto/shimmershine/<archivo-sin-extension>`.

### Subir las fotos con un script (recomendado)

Ya dejé las 36 fotos extraídas en `datos-fuente/imagenes/` y el CSV en
`datos-fuente/productos_shimmershine.csv` (esa carpeta no se sube a git, es
solo para este paso).

1. Copia `.env.local.example` a `.env.local` y completa las credenciales de
   Cloudinary (están en tu dashboard de Cloudinary, sección "API Keys"):
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
2. Corre:
   ```bash
   npm run subir-fotos
   ```
3. El script sube cada foto a Cloudinary (o reutiliza si ya la subió antes) y
   genera `datos-fuente/productos_shimmershine.con-urls.csv` con la columna
   `url_imagen_cloudinary` completada.
4. Copia esas filas a tu Google Sheet publicado (o usa **Archivo → Importar**
   para reemplazar la hoja completa con ese CSV).

Si prefieres subir las fotos a mano desde el dashboard de Cloudinary, también
funciona: solo asegúrate de que el `public_id` de cada foto sea el nombre de
archivo sin extensión (opción B) o pega la URL completa que te da Cloudinary
en la columna `url_imagen` (opción A).

## 3. Desarrollo local

Requiere Node.js 18 o superior.

```bash
npm install
cp .env.local.example .env.local   # completa GOOGLE_SHEET_CSV_URL como mínimo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 4. Subir a GitHub desde VSCode

1. Abre esta carpeta (`shimmershine-catalogo`) en VSCode.
2. Ya está inicializado como repositorio git local con un primer commit.
3. En VSCode: panel de **Control de código fuente** → **Publish Branch** (o
   `Publish to GitHub`), elige el nombre del repo (puede ser privado) y
   confirma. Eso crea el repo en GitHub y sube el código.
4. Para cambios futuros: edita, luego **Commit** y **Sync/Push** desde el
   mismo panel (o `git add`, `git commit`, `git push` por terminal).

## 5. Desplegar en Vercel (Git integration)

1. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el
   repo de GitHub que acabas de crear.
2. Framework se detecta solo como Next.js. No cambies build command ni output.
3. En **Environment Variables** agrega, para el entorno de Production (y
   Preview si quieres):
   - `GOOGLE_SHEET_CSV_URL`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `NEXT_PUBLIC_CLOUDINARY_FOLDER` (opcional, por defecto `shimmershine`)
   - `NEXT_PUBLIC_WHATSAPP_PHONE` (opcional, por defecto `+56966129549`)
4. Deploy. Desde ahí, cada `git push` a la rama principal despliega
   automáticamente (integración Git de Vercel).

Las credenciales `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` **no** se
necesitan en Vercel — solo se usan localmente para correr
`npm run subir-fotos`.

## Estructura del proyecto

```
app/                  Rutas de Next.js (App Router)
  layout.tsx           Fuentes (Cormorant Garamond + Work Sans) y metadata
  page.tsx              Carga el CSV y arma la página
  globals.css           Todo el diseño (paleta, tema oscuro, layout tipo revista)
components/            Componentes de UI (tabs, paginación, tarjetas, modal)
lib/
  csv.ts                Parser de CSV (detecta , o ;)
  products.ts            Lee el CSV y arma las páginas por categoría
  format.ts              Formato de precio en CLP
  whatsapp.ts             Link y número de WhatsApp
scripts/
  subir-fotos-a-cloudinary.mjs   Sube fotos locales y regenera el CSV con URLs
datos-fuente/           CSV y fotos de origen (no se sube a git)
```
