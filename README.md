# Venezuela Dolar Tracker 💵

Dashboard en tiempo real para monitorear tasas del dólar y euro en Venezuela.

🔗 **Demo en vivo**: [bolivar-tracker.onrender.com](https://bolivar-tracker.onrender.com)

## ✅ Funcionalidades

### 📊 Tasas en Tiempo Real
- 🏛️ **BCV USD** - Tasa oficial del Banco Central de Venezuela
- 💶 **BCV EUR** - Tasa euro calculada (USD × EUR/USD)
- 💵 **Paralelo (Compra Físico)** - Fórmula: `(EUR + Promedio Binance) / 2`
- 💚 **Binance Compra** - USDT/VES P2P (mejor precio de compra)
- 🔶 **Binance Venta** - USDT/VES P2P (mejor precio de venta)
- 📊 **Promedio Binance** - Promedio top 10 ofertas

### 📈 Estadísticas y Análisis
- **Brecha Cambiaria (Spread)** - Porcentaje de diferencia entre tasas
  - BCV vs Binance Compra
  - BCV vs Binance Venta
  - BCV vs Paralelo
  - Binance Venta vs Compra

### 📉 Historial Semanal
- Gráfico interactivo con Recharts
- Filtros: Todas | BCV | Binance
- Datos guardados cada 30 minutos
- Visualización de 7 días

### 🔢 Calculadora de Divisas
- Conversión USD ↔ VES
- Resultados simultáneos:
  - Tasa BCV
  - Tasa Paralelo (Compra Físico)
  - Binance Compra
  - Binance Venta

### 🏦 Bancos con Sistema de Divisas al Menudeo
- Banesco, BBVA Provincial, BNC, Bancaribe, Banco Exterior, Banplus

### 📱 Otras Características
- 👁️ Contador de visitas
- 🔄 Auto-actualización cada 5 minutos
- 📱 Diseño responsivo
- 💰 Espacios para publicidad (Google AdSense)

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite + TypeScript + TailwindCSS v4 + Recharts |
| Backend | NestJS + Axios |
| APIs | [DolarAPI.com](https://ve.dolarapi.com) (BCV) + [ExchangeRate-API](https://exchangerate-api.com) (EUR/USD) + Binance P2P |
| Deploy | Render.com (Static Site + Web Service) |

## 🚀 Inicio Rápido

### Windows (PowerShell)
```powershell
./start.ps1
```

### Linux/macOS
```bash
./run_app.sh
```

### Manual
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

## 🌐 URLs

| Ambiente | URL |
|----------|-----|
| Frontend Local | http://localhost:5173 |
| Backend Local | http://localhost:3000 |
| Frontend Producción | https://bolivar-tracker.onrender.com |
| Backend Producción | https://bolivar-tracker-api.onrender.com |

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/rates` | Todas las tasas (BCV + Binance + Paralelo + Spreads) |
| GET | `/rates/bcv` | Solo tasa BCV |
| GET | `/rates/history` | Historial de tasas (query: `?limit=336`) |
| GET | `/rates/history/daily` | Historial agrupado por día |
| GET | `/visits` | Contador de visitas |
| POST | `/visits/increment` | Incrementar visitas |

### Ejemplo de respuesta `/rates`:
```json
{
  "bcv": { "usd": 344.51, "eur": 403.08, "date": "2026-01-21" },
  "binance": { "buy": 458, "sell": 470, "avgBuy": 459.79, "avgSell": 462.59 },
  "paralelo": { "rate": 432.94, "formula": "(EUR + Promedio Binance) / 2" },
  "spread": {
    "bcvVsBinanceBuy": 32.93,
    "bcvVsBinanceSell": 36.42,
    "bcvVsParalelo": 25.67,
    "binanceSellVsBuy": 2.62
  },
  "timestamp": "2026-01-21T18:03:34.875Z"
}
```

## 💰 Monetización

Espacios reservados para Google AdSense:
- Banner superior (728x90)
- Banner inferior (970x90)

## 📐 Fórmulas

```
Tasa Paralelo = (BCV EUR + Promedio Binance) / 2

Spread (%) = ((Tasa A - Tasa B) / Tasa B) × 100
```

## 👨‍💻 Autor

**Albert Guacaran**
- GitHub: [@albertguacaranguacaran-ops](https://github.com/albertguacaranguacaran-ops)

## 📄 Licencia

Este proyecto es para uso informativo. Los datos provienen de fuentes públicas.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
