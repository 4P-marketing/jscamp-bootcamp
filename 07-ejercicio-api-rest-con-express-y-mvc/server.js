import app from './app.js';
import { DEFAULTS } from './config.js'

const PORT = DEFAULTS.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`)
});