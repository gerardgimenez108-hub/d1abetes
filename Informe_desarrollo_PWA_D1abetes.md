# Informe Detallado para el Desarrollo de la PWA para Diabetes Tipo 1 (Pauta de Bolos Fijos)

## 1. Visión General
Desarrollar una **Progressive Web App (PWA)** personalizada para tu padre, que vive con diabetes tipo 1 y sigue una **pauta de bolos fijos** de insulina. La app se centrará en:

- Ayudarle a **mantener la consistencia en la ingesta de carbohidratos** para que su dosis fija de insulina funcione correctamente.
- **Educarle** con contenido extraído de libros de referencia y fuentes confiables.
- **Registrar y visualizar** glucemias, comidas e insulina administrada.
- **Detectar patrones** y generar alertas cuando se desvíe de los hábitos establecidos.
- **Generar informes** para compartir con su endocrino.

La app será **offline-first**, respetará la privacidad (datos almacenados localmente) y será accesible (letra grande, botones amplios, colores de alto contraste).

---

## 2. Perfil del Usuario y Contexto
- **Usuario**: Persona mayor con diabetes tipo 1, en pauta de bolos fijos (dosis de insulina rápida fija en cada comida, generalmente combinada con una insulina basal).
- **Necesidades principales**:
  - Saber qué cantidad de carbohidratos corresponde a cada comida para no desviarse de la dosis fija.
  - Contar con equivalencias de alimentos (ej. cambiar arroz por quinoa manteniendo los mismos HC).
  - Recordar horarios de comidas, inyecciones y mediciones.
  - Reconocer hipoglucemias y saber cómo actuar.
  - Llevar un registro sencillo que pueda mostrar al médico.

- **Entorno técnico**: Dispositivo móvil (Android o iOS) con navegador moderno que soporte PWA.

---

## 3. Funcionalidades por Módulo

### 3.1 Registro de Comidas con Equivalencias en Carbohidratos
- Catálogo de alimentos habituales con:
  - Nombre del alimento
  - Peso por porción (g, taza, unidad)
  - Carbohidratos (g) por porción
  - Índice glucémico (bajo/medio/alto) – opcional
- **Sustitución guiada**: Al seleccionar un alimento, mostrar alternativas con el mismo contenido de HC (ej. “150g arroz cocido = 40 HC → puedes cambiarlo por 200g quinoa cocida”).
- Historial de comidas registradas (fecha, hora, alimentos, total HC, notas).

### 3.2 Registro de Glucemias e Insulina
- Entrada rápida de glucemia capilar (valor, fecha/hora, tipo: ayunas, preprandial, postprandial, nocturna).
- Registro de dosis de insulina administrada (basal, bolo comida, corrección – aunque en bolos fijos la corrección será excepcional).
- Gráficas de tendencias (línea temporal) con marcadores de comidas y eventos (hipo/hiper).
- Visor de datos en tabla con filtros por día/semana/mes.

### 3.3 Recordatorios y Alarmas
- Notificaciones push para:
  - Horarios de comidas (desayuno, almuerzo, cena, snacks)
  - Toma de insulina basal y bolos
  - Control postprandial (2h después de comer)
  - Renovación de material (tiras, lancetas, insulina)
- Configuración personalizable de horarios y días.

### 3.4 Detección de Patrones con Bolos Fijos
- Comparador de comidas: si el total de HC registrado se desvía más de un umbral configurable (ej. ±10g) respecto a su porción habitual, mostrar aviso.
- Detección de hipoglucemias recurrentes en misma franja horaria (ej. varias veces a las 11am) y sugerir revisar sección educativa o consultar médico.
- Informe semanal automático con:
  - Media de glucemias por franja
  - Porcentaje de tiempo en rango (objetivo personalizado)
  - Variabilidad (desviación estándar)
  - Cumplimiento de horarios

### 3.5 Zona de Aprendizaje / Biblioteca
- Contenido educativo estructurado en temas:
  - ¿Qué es la diabetes tipo 1?
  - Tipos de insulina y su acción
  - Nutrición y conteo de carbohidratos
  - Hipoglucemia e hiperglucemia
  - Ejercicio y diabetes
  - Tecnología (sensores, bombas)
  - Aspectos psicológicos
- Formato accesible: texto con opción de **lectura en voz alta** (SpeechSynthesis API).
- Referencias bibliográficas (para generar confianza y basarse en evidencia).

### 3.6 Configuración Personalizada
- Objetivos de glucosa (en mg/dL o mmol/L)
- Rangos de hipo/hiper (personalizables)
- Unidades de medida
- Tipo de insulina y horarios fijos
- Umbrales de alerta de desviación de HC

### 3.7 Informes para el Médico
- Exportar datos a CSV o PDF (resumen semanal/mensual).
- Incluir observaciones manuales y gráficas.
- Opción de compartir por WhatsApp, correo, etc.

---

## 4. Arquitectura Técnica

### 4.1 Tecnologías Propuestas
- **Frontend**: HTML5, CSS3, JavaScript (TypeScript opcional)
- **Framework**: React (con Vite o Next.js) – recomendado por la cantidad de componentes reutilizables y soporte PWA.
- **Base de datos local**: IndexedDB con wrapper **Dexie.js** (facilita consultas y versionado).
- **Gráficos**: Chart.js (sencillo) o ApexCharts (más opciones).
- **Notificaciones**: API Notifications + Service Worker.
- **PWA**: Manifest.json, Service Worker (Workbox), HTTPS obligatorio.
- **Exportación**: jspdf + html2canvas para PDF, y Blob + download para CSV.

### 4.2 Estructura de Datos (Tablas IndexedDB con Dexie)

```javascript
// Glucemias
{
  id: 'auto',
  date: Date,
  value: Number,          // mg/dL o mmol/L
  type: 'ayunas' | 'preprandial' | 'postprandial' | 'nocturna' | 'otra',
  notes: String
}

// Comidas
{
  id: 'auto',
  date: Date,
  mealType: 'desayuno' | 'almuerzo' | 'cena' | 'snack',
  foods: [                 // array de alimentos seleccionados del catálogo
    { name: String, portion: Number, carbs: Number }
  ],
  totalCarbs: Number,
  notes: String
}

// Insulinas
{
  id: 'auto',
  date: Date,
  type: 'basal' | 'bolo_comida' | 'correccion',
  dose: Number,            // unidades
  notes: String
}

// Alimentos (catálogo)
{
  id: 'auto',
  name: String,
  portionSize: Number,     // gramos o ml
  portionUnit: 'g' | 'ml' | 'taza' | 'unidad',
  carbs: Number,           // gramos de HC por porción
  gi: 'bajo' | 'medio' | 'alto'   // opcional
}

// Recordatorios
{
  id: 'auto',
  name: String,
  time: String,            // "08:00"
  days: [0,1,2,3,4,5,6],  // 0=domingo
  enabled: Boolean
}
```

### 4.3 Catálogo de Alimentos: Uso del Dataset MyFoodData
- Extraer del repositorio `erinmitt123/Glucose_MR` el archivo CSV/JSON con datos nutricionales.
- Filtrar los alimentos más comunes (arroz, quinoa, pan, frutas, etc.) y guardarlos en IndexedDB como tabla `alimentos`.
- Implementar búsqueda y selección rápida.

### 4.4 Offline-First y Sincronización
- Todo el registro se almacena localmente.
- No se requiere sincronización con servidor en esta fase, pero puede añadirse en el futuro (Firebase, etc.).
- El Service Worker cacheará los assets estáticos y la base de conocimiento.

---

## 5. Integración de Conocimiento de Libros Clave

### 5.1 Fuentes Legales
1. **NIDDK (NIH) – Guía para personas con diabetes**: dominio público, en español. Descarga desde [NIDDK](https://www.niddk.nih.gov/health-information/informacion-de-la-salud/diabetes/guia-personas-diabetes).
2. **Fast Facts: Type 1 Diabetes in Adults** (Zaidi et al., 2021) – adquirir legalmente en ebook.
3. **Atlas of Diabetes Mellitus** (Scobie & Hopkins, 2024) – adquirir legalmente.

### 5.2 Extracción y Estructuración del Conocimiento
- Crear un archivo JSON `knowledgeBase.json` con la siguiente estructura:

```json
{
  "hypoglycemia": {
    "title": "Hipoglucemia (bajo nivel de azúcar)",
    "symptoms": ["sudoración", "temblor", "confusión", "hambre"],
    "causes": ["exceso de insulina", "retraso en comida", "ejercicio no planificado"],
    "treatment": "Regla 15-15: consumir 15g de carbohidratos de acción rápida, esperar 15 minutos, re-evaluar.",
    "prevention": "Mantener horarios regulares, ajustar insulina antes del ejercicio...",
    "source": "Fast Facts: Type 1 Diabetes in Adults, 2021, p. 34"
  },
  "carb_counting": { ... },
  ...
}
```

- Cada sección educativa se renderizará desde este JSON, permitiendo actualizaciones sin modificar código.
- Incluir referencias bibliográficas en cada sección.

### 5.3 Integración en la App
- Cargar `knowledgeBase.json` en el cliente (puede estar cacheado).
- En el módulo de Educación, mostrar las secciones.
- En las alertas de patrones, vincular con contenido educativo (ej. si detecta hipoglucemias, mostrar enlace a la sección correspondiente).

---

## 6. Recursos de GitHub para Reutilizar

### 6.1 Repositorios Clave

| Nombre | URL para clonar | Uso principal |
|--------|-----------------|---------------|
| **Glucose_MR** | `https://github.com/erinmitt123/Glucose_MR.git` | Dataset MyFoodData (carbohidratos, porciones). También contiene lógica de detección de alimentos (YOLO) para futura expansión. |
| **SaludControl** | `https://github.com/parchemil/SaludControl.git` | Estructura base PWA con registro de mediciones, gráficas y recordatorios. Ideal para empezar. |
| **stanford-hypoglycemia-forecasting** | `https://github.com/flaviagiammarino/stanford-hypoglycemia-forecasting.git` | Modelos de predicción de hipoglucemia con TensorFlow Lite. Útil para referencia futura. |

### 6.2 Cómo Empezar con Estos Recursos
1. **Clonar SaludControl** y estudiar su estructura de componentes, servicio de notificaciones y base de datos local.
2. **Extraer el dataset** de Glucose_MR: buscar el archivo `data/MyFoodData.csv` (o similar) y convertirlo a JSON para cargarlo en IndexedDB.
3. **Adaptar la interfaz** para enfocarse en bolos fijos: reemplazar el conteo variable de HC por un sistema de “porciones habituales” y alertas de desviación.

---

## 7. Plan de Desarrollo por Fases

### Fase 1: MVP (1-2 semanas)
- **Objetivo**: PWA instalable con registro de glucemias y catálogo básico de alimentos.
- **Tareas**:
  - Configurar proyecto con React + Vite + PWA (vite-plugin-pwa).
  - Implementar IndexedDB con Dexie.js.
  - Crear formularios de registro de glucemias y comidas (sin equivalencias avanzadas).
  - Mostrar gráfica simple (Chart.js) con glucemias de los últimos 7 días.
  - Añadir un par de recordatorios fijos (ej. comidas).
  - PWA funcional offline.

### Fase 2: Consistencia de Carbohidratos (1 semana)
- **Objetivo**: Implementar el catálogo de alimentos completo con equivalencias.
- **Tareas**:
  - Importar dataset de MyFoodData y poblar tabla `alimentos`.
  - Crear selector de alimentos con búsqueda.
  - Calcular total de HC de la comida y comparar con la porción “habitual” configurada por el usuario.
  - Mostrar alerta si se desvía (ej. “Hoy has tomado 55 HC en el almuerzo, lo habitual son 40 HC. ¿Quieres ajustar algo?”).
  - Permitir al usuario definir su “porción habitual” por tipo de comida.

### Fase 3: Educación e Informes (1 semana)
- **Objetivo**: Integrar base de conocimiento y generar informes.
- **Tareas**:
  - Crear archivo `knowledgeBase.json` con contenido extraído de fuentes legales.
  - Construir componente de Educación (secciones, texto con posibilidad de lectura en voz alta).
  - Desarrollar generador de informes (CSV y PDF) con resumen semanal.
  - Incluir en el informe los patrones detectados y enlaces a secciones educativas.

### Fase 4: Pulido y Pruebas con el Usuario (1 semana)
- **Objetivo**: Adaptar la app a las necesidades reales de tu padre.
- **Tareas**:
  - Mejorar accesibilidad (tamaño de letra, contraste, botones grandes).
  - Añadir tutorial introductorio.
  - Realizar pruebas con tu padre, recoger feedback y ajustar.
  - Preparar la app para producción (optimizar, comprimir assets, generar build).

---

## 8. Configuración Técnica Detallada

### 8.1 Entorno de Desarrollo
```bash
# Crear proyecto con Vite + React + TypeScript (opcional)
npm create vite@latest diabetes-app -- --template react-ts
cd diabetes-app
npm install dexie chart.js react-chartjs-2 workbox-window

# Instalar plugin PWA
npm install vite-plugin-pwa -D
```

### 8.2 Configuración de PWA (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'DiApp',
        short_name: 'DiApp',
        description: 'Asistente para diabetes tipo 1',
        theme_color: '#ffffff',
        icons: [...]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ]
});
```

### 8.3 Estructura de Carpetas Recomendada
```
src/
├── assets/
├── components/
│   ├── GlucoseForm.tsx
│   ├── MealForm.tsx
│   ├── FoodSelector.tsx
│   ├── Charts.tsx
│   └── ...
├── db/
│   ├── db.ts          // configuración Dexie
│   └── seedFoods.ts   // importar dataset
├── hooks/
│   └── useNotifications.ts
├── pages/
│   ├── Home.tsx
│   ├── GlucoseLog.tsx
│   ├── MealLog.tsx
│   ├── Education.tsx
│   ├── Reports.tsx
│   └── Settings.tsx
├── knowledge/
│   └── knowledgeBase.json
├── utils/
│   ├── export.ts
│   └── alerts.ts
├── App.tsx
├── main.tsx
└── serviceWorker.ts
```

### 8.4 Uso del Dataset MyFoodData
- En el repositorio `Glucose_MR`, buscar el archivo `data/MyFoodData.csv` (puede estar en otra ubicación).
- Convertirlo a JSON con un script simple o usando herramientas online.
- Cargarlo al inicializar la app (si es la primera vez) y almacenarlo en IndexedDB.

---

## 9. Consideraciones de Seguridad y Privacidad
- Todos los datos se almacenan únicamente en el dispositivo del usuario. No se envían a ningún servidor.
- En futuras versiones, si se implementa sincronización, usar cifrado y autenticación segura.
- Incluir un descargo de responsabilidad claro: “Esta app no reemplaza el consejo médico. Consulte siempre a su endocrino antes de realizar cambios en su tratamiento.”

---

## 10. Próximos Pasos para el Agente

1. **Clonar los repositorios** indicados y examinar su código.
2. **Configurar el entorno de desarrollo** con Vite + React + PWA.
3. **Crear las tablas de IndexedDB** con Dexie basándose en los modelos propuestos.
4. **Implementar el registro de glucemias y comidas** como primera funcionalidad.
5. **Extraer y procesar el dataset MyFoodData** para poblar el catálogo de alimentos.
6. **Construir la lógica de alertas** por desviación de HC.
7. **Integrar la base de conocimiento** y el componente de Educación.
8. **Probar con el usuario real y ajustar**.
9. **Generar build de producción y publicar** (puede ser en GitHub Pages, Vercel, Netlify, o servidor propio).

---

## 11. Documentación Adicional
- [Dexie.js Documentation](https://dexie.org/docs/)
- [Workbox Documentation](https://developer.chrome.com/docs/workbox/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Chart.js with React](https://www.chartjs.org/docs/latest/getting-started/integration.html)

---

Este informe proporciona al agente todos los elementos necesarios para iniciar la construcción de la PWA. Si durante el desarrollo surgen preguntas específicas (cómo implementar la lectura en voz alta, cómo estructurar las alertas, etc.), no dudes en pedir más detalles. ¡Éxito con este proyecto tan significativo!