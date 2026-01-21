# Venezuela Dolar Tracker 💵

Dashboard en tiempo real para monitorear tasas del dólar en Venezuela.

## ✅ Funcionalidades

- 🏛️ **Tasa BCV Oficial** - Banco Central de Venezuela
- 💚 **Binance P2P** - Compra y venta USDT/VES
- 🔢 **Calculadora** - Conversión USD ↔ VES
- 📊 **Estadísticas** - Spreads y análisis
- 👁️ **Contador de visitas**
- 📱 **Diseño responsivo**
- 💰 **Espacios para publicidad** (monetización)

## 🛠️ Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite + TailwindCSS + Recharts |
| Backend | NestJS + Axios |
| APIs | PyDolarVe (BCV) + Binance P2P |

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
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/rates

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /rates | Todas las tasas (BCV + Binance) |
| GET | /rates/bcv | Solo tasa BCV |
| GET | /visits | Contador de visitas |
| POST | /visits/increment | Incrementar visitas |

## 💰 Monetización

Espacios reservados para Google AdSense:
- Banner superior (728x90)
- Banner inferior (970x90)
- Sidebar (300x250)
