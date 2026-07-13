import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import engine, SessionLocal, Base
from models import CatalogItem

Base.metadata.create_all(bind=engine)

db = SessionLocal()
db.query(CatalogItem).delete()
db.commit()
db.close()

CATALOG_DATA = [
    # =============================================
    # GRUPO 0: TRABAJOS PRELIMINARES
    # =============================================
    {"code": "0-001", "description": "Senalizacion y balizamiento de obra", "unit": "ud", "category": "0", "price": 350.00},
    {"code": "0-002", "description": "Vallado perimetral de obra", "unit": "m", "category": "0", "price": 45.00},
    {"code": "0-003", "description": "Limpieza y preparacion del terreno", "unit": "m2", "category": "0", "price": 6.50},
    {"code": "0-004", "description": "Derribo de estructuras existentes", "unit": "m3", "category": "0", "price": 35.00},
    {"code": "0-005", "description": "Proteccion de edificios colindantes", "unit": "m2", "category": "0", "price": 22.00},
    {"code": "0-006", "description": "Contenedor de escombros (alquiler)", "unit": "ud", "category": "0", "price": 280.00},
    {"code": "0-007", "description": "Transporte y vertido de escombros", "unit": "m3", "category": "0", "price": 50.00},
    {"code": "0-008", "description": "Licencia de obra menor", "unit": "ud", "category": "0", "price": 500.00},
    {"code": "0-009", "description": "Proyecto tecnico (arquitecto)", "unit": "ud", "category": "0", "price": 2500.00},

    # =============================================
    # GRUPO 1: DEMOLICIONES (material + mano de obra)
    # =============================================
    {"code": "1-001", "description": "Demolicion de tabiques (material + MO)", "unit": "m2", "category": "1", "price": 25.00},
    {"code": "1-002", "description": "Retirada de azulejos y revestimientos (MO)", "unit": "m2", "category": "1", "price": 16.00},
    {"code": "1-003", "description": "Retirada de pavimento (baldosa/laminado) (MO)", "unit": "m2", "category": "1", "price": 12.00},
    {"code": "1-004", "description": "Retirada de puertas y marcos (MO)", "unit": "ud", "category": "1", "price": 35.00},
    {"code": "1-005", "description": "Retirada de ventanas (MO)", "unit": "ud", "category": "1", "price": 55.00},
    {"code": "1-006", "description": "Retirada de mobiliario cocina (MO)", "unit": "ud", "category": "1", "price": 200.00},
    {"code": "1-007", "description": "Retirada de sanitarios (MO)", "unit": "ud", "category": "1", "price": 80.00},
    {"code": "1-008", "description": "Demolicion de suelo antiguo (MO)", "unit": "m2", "category": "1", "price": 14.00},
    {"code": "1-009", "description": "Vaciado de escombros a contenedor (MO)", "unit": "m3", "category": "1", "price": 45.00},

    # =============================================
    # GRUPO 2: ALBANILERIA (material + mano de obra)
    # =============================================
    {"code": "2-001", "description": "Tabique de ladrillo hueco (mat + MO)", "unit": "m2", "category": "2", "price": 50.00},
    {"code": "2-002", "description": "Tabique de yeso laminado doble placa (mat + MO)", "unit": "m2", "category": "2", "price": 42.00},
    {"code": "2-003", "description": "Enfoscado interior satinado (mat + MO)", "unit": "m2", "category": "2", "price": 22.00},
    {"code": "2-004", "description": "Enfoscado exterior mortero traslucido (mat + MO)", "unit": "m2", "category": "2", "price": 32.00},
    {"code": "2-005", "description": "Falso techo de yeso laminado (mat + MO)", "unit": "m2", "category": "2", "price": 45.00},
    {"code": "2-006", "description": "Solado ceramico (mat + MO)", "unit": "m2", "category": "2", "price": 38.00},
    {"code": "2-007", "description": "Alicatado ceramico (mat + MO)", "unit": "m2", "category": "2", "price": 42.00},
    {"code": "2-008", "description": "Reparacion de humedades (MO + material)", "unit": "ud", "category": "2", "price": 500.00},
    {"code": "2-009", "description": "Aislamiento termico lana roca (mat + MO)", "unit": "m2", "category": "2", "price": 28.00},

    # =============================================
    # GRUPO 3: INSTALACIONES (material + mano de obra)
    # =============================================
    # Electricidad
    {"code": "3-001", "description": "Renovacion completa instalacion electrica (mat + MO)", "unit": "m2", "category": "3", "price": 45.00},
    {"code": "3-002", "description": "Cuadro electrico nuevo (suministro + inst)", "unit": "ud", "category": "3", "price": 550.00},
    {"code": "3-003", "description": "Punto de luz nuevo (mat + MO)", "unit": "ud", "category": "3", "price": 65.00},
    {"code": "3-004", "description": "Toma de corriente nueva (mat + MO)", "unit": "ud", "category": "3", "price": 55.00},
    {"code": "3-005", "description": "Conmutador / interruptor (mat + MO)", "unit": "ud", "category": "3", "price": 50.00},
    {"code": "3-006", "description": "Mecanismo de persiana electrica (mat + MO)", "unit": "ud", "category": "3", "price": 120.00},
    # Fontaneria
    {"code": "3-010", "description": "Renovacion fontaneria completa (mat + MO)", "unit": "m2", "category": "3", "price": 38.00},
    {"code": "3-011", "description": "Tuberias agua fria cobre/CPVC (mat + MO)", "unit": "ml", "category": "3", "price": 18.00},
    {"code": "3-012", "description": "Tuberias agua caliente cobre (mat + MO)", "unit": "ml", "category": "3", "price": 22.00},
    {"code": "3-013", "description": "Evacuacion aguas residuales PVC (mat + MO)", "unit": "ml", "category": "3", "price": 22.00},
    {"code": "3-014", "description": "Punto de agua nuevo (mat + MO)", "unit": "ud", "category": "3", "price": 120.00},
    {"code": "3-015", "description": "Desagüe nuevo (mat + MO)", "unit": "ud", "category": "3", "price": 130.00},
    # Gas
    {"code": "3-020", "description": "Instalacion de gas (suministro + inst)", "unit": "ud", "category": "3", "price": 650.00},
    # Calefaccion
    {"code": "3-025", "description": "Suelo radiante (mat + MO)", "unit": "m2", "category": "3", "price": 80.00},
    {"code": "3-026", "description": "Caldera de gas (suministro + instalacion)", "unit": "ud", "category": "3", "price": 2500.00},
    {"code": "3-027", "description": "Radiador de aluminio (suministro + colocacion)", "unit": "ud", "category": "3", "price": 380.00},
    # Aire acondicionado
    {"code": "3-030", "description": "Split aire acondicionado (suministro + inst)", "unit": "ud", "category": "3", "price": 1200.00},

    # =============================================
    # GRUPO 4: ACABADOS (material + mano de obra)
    # =============================================
    # Pintura
    {"code": "4-001", "description": "Pintura interior 2 manos (mat + MO)", "unit": "m2", "category": "4", "price": 14.00},
    {"code": "4-002", "description": "Pintura exterior 2 manos (mat + MO)", "unit": "m2", "category": "4", "price": 18.00},
    {"code": "4-003", "description": "Pintura decorativa efecto especial (mat + MO)", "unit": "m2", "category": "4", "price": 28.00},
    {"code": "4-004", "description": "Reparacion de superficies previa a pintar (MO)", "unit": "m2", "category": "4", "price": 7.00},
    {"code": "4-005", "description": "Imprimacion / fixador (mat + MO)", "unit": "m2", "category": "4", "price": 3.50},
    # Ceramica
    {"code": "4-010", "description": "Baldosa ceramica suelo basica (mat + MO)", "unit": "m2", "category": "4", "price": 38.00},
    {"code": "4-011", "description": "Azulejo ceramico pared basico (mat + MO)", "unit": "m2", "category": "4", "price": 40.00},
    {"code": "4-012", "description": "Baldosa ceramica suelo media (mat + MO)", "unit": "m2", "category": "4", "price": 55.00},
    {"code": "4-013", "description": "Azulejo ceramico pared media (mat + MO)", "unit": "m2", "category": "4", "price": 60.00},
    {"code": "4-014", "description": "Baldosa ceramica suelo alta (mat + MO)", "unit": "m2", "category": "4", "price": 80.00},
    {"code": "4-015", "description": "Rejilla de desague ceramica (mat + MO)", "unit": "ud", "category": "4", "price": 45.00},
    # Pavimentos
    {"code": "4-020", "description": "Pavimento laminado basico (mat + MO)", "unit": "m2", "category": "4", "price": 28.00},
    {"code": "4-021", "description": "Pavimento laminado medio (mat + MO)", "unit": "m2", "category": "4", "price": 40.00},
    {"code": "4-022", "description": "Suelo de parquet (mat + MO)", "unit": "m2", "category": "4", "price": 55.00},
    {"code": "4-023", "description": "Vinilico (mat + MO)", "unit": "m2", "category": "4", "price": 32.00},
    {"code": "4-024", "description": "Microcemento (mat + MO)", "unit": "m2", "category": "4", "price": 85.00},
    # Carpinteria interior
    {"code": "4-030", "description": "Puerta interior de paso completa (mat + MO)", "unit": "ud", "category": "4", "price": 350.00},
    {"code": "4-031", "description": "Puerta interior de paso media (mat + MO)", "unit": "ud", "category": "4", "price": 500.00},
    {"code": "4-032", "description": "Puerta de armario corredera (mat + MO)", "unit": "m2", "category": "4", "price": 120.00},
    {"code": "4-033", "description": "Marco de puerta (mat + MO)", "unit": "ud", "category": "4", "price": 85.00},
    {"code": "4-034", "description": "Colocacion de puerta completa (MO)", "unit": "ud", "category": "4", "price": 120.00},
    # Carpinteria exterior
    {"code": "4-040", "description": "Ventana aluminio doble cristal RPT (mat + MO)", "unit": "m2", "category": "4", "price": 280.00},
    {"code": "4-041", "description": "Ventana PVC doble cristal (mat + MO)", "unit": "m2", "category": "4", "price": 350.00},
    {"code": "4-042", "description": "Persiana motorizada (mat + MO)", "unit": "ud", "category": "4", "price": 500.00},
    {"code": "4-043", "description": "Cristalera / mampara de ducha (mat + MO)", "unit": "m2", "category": "4", "price": 220.00},

    # =============================================
    # GRUPO 5: BANO (material + mano de obra)
    # =============================================
    {"code": "5-001", "description": "Inodoro completo (mat + MO)", "unit": "ud", "category": "5", "price": 380.00},
    {"code": "5-002", "description": "Lavabo con mueble (mat + MO)", "unit": "ud", "category": "5", "price": 500.00},
    {"code": "5-003", "description": "Lavabo empotrado con columna (mat + MO)", "unit": "ud", "category": "5", "price": 600.00},
    {"code": "5-004", "description": "Plato de ducha resina/compacto (mat + MO)", "unit": "ud", "category": "5", "price": 420.00},
    {"code": "5-005", "description": "Banera completa (mat + MO)", "unit": "ud", "category": "5", "price": 650.00},
    {"code": "5-006", "description": "Grifo de ducha (mat + MO)", "unit": "ud", "category": "5", "price": 180.00},
    {"code": "5-007", "description": "Grifo de lavabo (mat + MO)", "unit": "ud", "category": "5", "price": 120.00},
    {"code": "5-008", "description": "Mampara de ducha (mat + MO)", "unit": "ud", "category": "5", "price": 450.00},
    {"code": "5-009", "description": "Espejo de bano con luz (mat + MO)", "unit": "ud", "category": "5", "price": 280.00},
    {"code": "5-010", "description": "Toallero electrico (mat + MO)", "unit": "ud", "category": "5", "price": 380.00},
    {"code": "5-011", "description": "Accesorios de bano juego completo (mat + MO)", "unit": "ud", "category": "5", "price": 120.00},

    # =============================================
    # GRUPO 6: COCINA (material + mano de obra)
    # =============================================
    {"code": "6-001", "description": "Mueble de cocina bajo + encimera por ml (mat + MO)", "unit": "ml", "category": "6", "price": 500.00},
    {"code": "6-002", "description": "Mueble de cocina alto por ml (mat + MO)", "unit": "ml", "category": "6", "price": 300.00},
    {"code": "6-003", "description": "Encimera granito/laminado (mat + MO)", "unit": "ml", "category": "6", "price": 180.00},
    {"code": "6-004", "description": "Fregadero acero inoxidable (mat + MO)", "unit": "ud", "category": "6", "price": 220.00},
    {"code": "6-005", "description": "Grifo de cocina extractable (mat + MO)", "unit": "ud", "category": "6", "price": 180.00},
    {"code": "6-006", "description": "Campana extractora (mat + MO)", "unit": "ud", "category": "6", "price": 380.00},
    {"code": "6-007", "description": "Horno empotrado (mat + MO)", "unit": "ud", "category": "6", "price": 500.00},
    {"code": "6-008", "description": "Fogon / vitroceramica (mat + MO)", "unit": "ud", "category": "6", "price": 400.00},
    {"code": "6-009", "description": "Lavavajillas empotrado (mat + MO)", "unit": "ud", "category": "6", "price": 550.00},
    {"code": "6-010", "description": "Refrigerador punta de agua (mat + MO)", "unit": "ud", "category": "6", "price": 70.00},
    {"code": "6-011", "description": "Azulejo backsplash cocina (mat + MO)", "unit": "m2", "category": "6", "price": 50.00},
    {"code": "6-012", "description": "Falso techo con luz LED (mat + MO)", "unit": "m2", "category": "6", "price": 65.00},

    # =============================================
    # GRUPO 7: MANO DE OBRA (solo trabajador, para desglose)
    # =============================================
    {"code": "MO-001", "description": "Albanil (jornada)", "unit": "dia", "category": "7", "price": 180.00},
    {"code": "MO-002", "description": "Oficial de albanileria (hora)", "unit": "hora", "category": "7", "price": 27.00},
    {"code": "MO-003", "description": "Peon de albanileria (jornada)", "unit": "dia", "category": "7", "price": 120.00},
    {"code": "MO-004", "description": "Electricista cualificado (hora)", "unit": "hora", "category": "7", "price": 35.00},
    {"code": "MO-005", "description": "Electricista (jornada)", "unit": "dia", "category": "7", "price": 190.00},
    {"code": "MO-006", "description": "Fontanero (hora)", "unit": "hora", "category": "7", "price": 32.00},
    {"code": "MO-007", "description": "Fontanero (jornada)", "unit": "dia", "category": "7", "price": 170.00},
    {"code": "MO-008", "description": "Carpintero de obra (hora)", "unit": "hora", "category": "7", "price": 28.00},
    {"code": "MO-009", "description": "Carpintero de obra (jornada)", "unit": "dia", "category": "7", "price": 150.00},
    {"code": "MO-010", "description": "Pintor (hora)", "unit": "hora", "category": "7", "price": 25.00},
    {"code": "MO-011", "description": "Pintor (jornada)", "unit": "dia", "category": "7", "price": 135.00},
    {"code": "MO-012", "description": "Yesista / Escayolista (hora)", "unit": "hora", "category": "7", "price": 27.00},
    {"code": "MO-013", "description": "Yesista / Escayolista (jornada)", "unit": "dia", "category": "7", "price": 145.00},
    {"code": "MO-014", "description": "Azulero / Frio (hora)", "unit": "hora", "category": "7", "price": 29.00},
    {"code": "MO-015", "description": "Azulero / Frio (jornada)", "unit": "dia", "category": "7", "price": 155.00},
    {"code": "MO-016", "description": "Hormigonero (hora)", "unit": "hora", "category": "7", "price": 24.00},
    {"code": "MO-017", "description": "Hormigonero (jornada)", "unit": "dia", "category": "7", "price": 130.00},
    {"code": "MO-018", "description": "Soldador (hora)", "unit": "hora", "category": "7", "price": 30.00},
    {"code": "MO-019", "description": "Soldador (jornada)", "unit": "dia", "category": "7", "price": 160.00},
    {"code": "MO-020", "description": "Montador de estructuras (hora)", "unit": "hora", "category": "7", "price": 28.00},
    {"code": "MO-021", "description": "Montador de estructuras (jornada)", "unit": "dia", "category": "7", "price": 150.00},
    {"code": "MO-022", "description": "Jardinero (hora)", "unit": "hora", "category": "7", "price": 20.00},
    {"code": "MO-023", "description": "Jardinero (jornada)", "unit": "dia", "category": "7", "price": 110.00},
    {"code": "MO-024", "description": "Maquinista de obra (hora)", "unit": "hora", "category": "7", "price": 27.00},
    {"code": "MO-025", "description": "Maquinista de obra (jornada)", "unit": "dia", "category": "7", "price": 145.00},
    {"code": "MO-026", "description": "Peon general (hora)", "unit": "hora", "category": "7", "price": 16.00},
    {"code": "MO-027", "description": "Peon general (jornada)", "unit": "dia", "category": "7", "price": 115.00},
    {"code": "MO-028", "description": "Montador de carpinteria (hora)", "unit": "hora", "category": "7", "price": 26.00},
    {"code": "MO-029", "description": "Montador de carpinteria (jornada)", "unit": "dia", "category": "7", "price": 140.00},

    # =============================================
    # GRUPO 8: MAQUINARIA
    # =============================================
    {"code": "MQ-001", "description": "Excavadora (hora)", "unit": "hora", "category": "8", "price": 85.00},
    {"code": "MQ-002", "description": "Mini excavadora (hora)", "unit": "hora", "category": "8", "price": 45.00},
    {"code": "MQ-003", "description": "Plataforma elevadora (dia)", "unit": "dia", "category": "8", "price": 130.00},
    {"code": "MQ-004", "description": "Grua torre (dia)", "unit": "dia", "category": "8", "price": 400.00},
    {"code": "MQ-005", "description": "Betonera / Hormigonera (hora)", "unit": "hora", "category": "8", "price": 22.00},
    {"code": "MQ-006", "description": "Compactador / Vibrador (hora)", "unit": "hora", "category": "8", "price": 18.00},
    {"code": "MQ-007", "description": "Generador electrico (dia)", "unit": "dia", "category": "8", "price": 70.00},
    {"code": "MQ-008", "description": "Andamios (m2/dia)", "unit": "m2", "category": "8", "price": 2.50},
    {"code": "MQ-009", "description": "Hormigonera portatil (hora)", "unit": "hora", "category": "8", "price": 12.00},
    {"code": "MQ-010", "description": "Sierra de corte (hora)", "unit": "hora", "category": "8", "price": 8.00},

    # =============================================
    # GRUPO 9: GASTOS GENERALES
    # =============================================
    {"code": "GG-001", "description": "IVA (21%)", "unit": "%", "category": "9", "price": 21.00},
    {"code": "GG-002", "description": "Carga y descarga de materiales", "unit": "ud", "category": "9", "price": 350.00},
    {"code": "GG-003", "description": "Limpieza final de obra", "unit": "m2", "category": "9", "price": 5.00},
    {"code": "GG-004", "description": "Direccion de obra (arquitecto)", "unit": "%", "category": "9", "price": 7.00},

    # =============================================
    # GRUPO 11: MATERIALES ELECTRICOS (solo material)
    # =============================================
    {"code": "ME-001", "description": "Cable electrico 2.5mm (rollo 100m)", "unit": "ud", "category": "11", "price": 45.00},
    {"code": "ME-002", "description": "Cable electrico 4mm (rollo 100m)", "unit": "ud", "category": "11", "price": 65.00},
    {"code": "ME-003", "description": "Tubo corrugado 20mm (rollo 50m)", "unit": "ud", "category": "11", "price": 12.00},
    {"code": "ME-004", "description": "Tubo corrugado 25mm (rollo 50m)", "unit": "ud", "category": "11", "price": 15.00},
    {"code": "ME-005", "description": "Caja empotrada 60", "unit": "ud", "category": "11", "price": 0.80},
    {"code": "ME-006", "description": "Caja empotrada grande", "unit": "ud", "category": "11", "price": 2.50},
    {"code": "ME-007", "description": "Mecanismo interruptor simple", "unit": "ud", "category": "11", "price": 4.50},
    {"code": "ME-008", "description": "Mecanismo toma de corriente 2P+T", "unit": "ud", "category": "11", "price": 5.00},
    {"code": "ME-009", "description": "Mecanismo conmutador", "unit": "ud", "category": "11", "price": 7.00},
    {"code": "ME-010", "description": "Placa de mecanismo 1 post", "unit": "ud", "category": "11", "price": 2.50},
    {"code": "ME-011", "description": "Placa de mecanismo 2 post", "unit": "ud", "category": "11", "price": 3.50},
    {"code": "ME-012", "description": "Placa de mecanismo 3 post", "unit": "ud", "category": "11", "price": 4.50},
    {"code": "ME-013", "description": "Portafusibles / IGCUR", "unit": "ud", "category": "11", "price": 8.00},
    {"code": "ME-014", "description": "Diferencial 25A 30mA", "unit": "ud", "category": "11", "price": 35.00},
    {"code": "ME-015", "description": "PIA / Magnetotermico 16A", "unit": "ud", "category": "11", "price": 12.00},
    {"code": "ME-016", "description": "PIA / Magnetotermico 20A", "unit": "ud", "category": "11", "price": 12.00},
    {"code": "ME-017", "description": "Bornas de conexion", "unit": "ud", "category": "11", "price": 1.50},
    {"code": "ME-018", "description": "Cinta aislante", "unit": "ud", "category": "11", "price": 2.00},
    {"code": "ME-019", "description": "Taco + tornillo para empotrado", "unit": "ud", "category": "11", "price": 0.10},
    {"code": "ME-020", "description": "Regleta de aluminio (3m)", "unit": "ud", "category": "11", "price": 5.00},
    {"code": "ME-021", "description": "Chapa de registro", "unit": "ud", "category": "11", "price": 3.00},

    # =============================================
    # GRUPO 12: MATERIALES FONTANERIA (solo material)
    # =============================================
    {"code": "MF-001", "description": "Tubo cobre 15mm (barra 6m)", "unit": "ud", "category": "12", "price": 12.00},
    {"code": "MF-002", "description": "Tubo cobre 22mm (barra 6m)", "unit": "ud", "category": "12", "price": 18.00},
    {"code": "MF-003", "description": "Tubo CPVC 16mm (barra 4m)", "unit": "ud", "category": "12", "price": 5.00},
    {"code": "MF-004", "description": "Tubo CPVC 20mm (barra 4m)", "unit": "ud", "category": "12", "price": 6.50},
    {"code": "MF-005", "description": "Tubo PVC evacuacion 40mm (barra 4m)", "unit": "ud", "category": "12", "price": 8.00},
    {"code": "MF-006", "description": "Tubo PVC evacuacion 100mm (barra 4m)", "unit": "ud", "category": "12", "price": 15.00},
    {"code": "MF-007", "description": "Codo cobre 15mm 90", "unit": "ud", "category": "12", "price": 1.20},
    {"code": "MF-008", "description": "Codo cobre 22mm 90", "unit": "ud", "category": "12", "price": 1.80},
    {"code": "MF-009", "description": "Tee cobre 15mm", "unit": "ud", "category": "12", "price": 1.50},
    {"code": "MF-010", "description": "Tee cobre 22mm", "unit": "ud", "category": "12", "price": 2.20},
    {"code": "MF-011", "description": "Acoplamiento cobre 15mm", "unit": "ud", "category": "12", "price": 0.80},
    {"code": "MF-012", "description": "Acoplamiento cobre 22mm", "unit": "ud", "category": "12", "price": 1.20},
    {"code": "MF-013", "description": "Llave de paso 1/2", "unit": "ud", "category": "12", "price": 8.00},
    {"code": "MF-014", "description": "Llave de paso 3/4", "unit": "ud", "category": "12", "price": 12.00},
    {"code": "MF-015", "description": "Llave de paso con filtro", "unit": "ud", "category": "12", "price": 15.00},
    {"code": "MF-016", "description": "Codo PVC evacuacion 40mm 87", "unit": "ud", "category": "12", "price": 1.50},
    {"code": "MF-017", "description": "Codo PVC evacuacion 100mm 87", "unit": "ud", "category": "12", "price": 3.00},
    {"code": "MF-018", "description": "Sifon de lavabo", "unit": "ud", "category": "12", "price": 8.00},
    {"code": "MF-019", "description": "Sifon de fregadero", "unit": "ud", "category": "12", "price": 12.00},
    {"code": "MF-020", "description": "Desague de suelo 100", "unit": "ud", "category": "12", "price": 18.00},
    {"code": "MF-021", "description": "Flexo de conexion (0.5m)", "unit": "ud", "category": "12", "price": 6.00},
    {"code": "MF-022", "description": "Junta teflon", "unit": "ud", "category": "12", "price": 2.00},
    {"code": "MF-023", "description": "Pasta de soldar", "unit": "ud", "category": "12", "price": 8.00},
    {"code": "MF-024", "description": "Grapas de fijacion tubo", "unit": "ud", "category": "12", "price": 0.15},

    # =============================================
    # GRUPO 13: MATERIALES DE OBRA (solo material)
    # =============================================
    {"code": "MOB-001", "description": "Hormigon listo para usar (saco 25kg)", "unit": "ud", "category": "13", "price": 8.00},
    {"code": "MOB-002", "description": "Mortero cola para baldosa (saco 25kg)", "unit": "ud", "category": "13", "price": 12.00},
    {"code": "MOB-003", "description": "Lechada de juntas (saco 2kg)", "unit": "ud", "category": "13", "price": 5.00},
    {"code": "MOB-004", "description": "Imprimacion para yeso", "unit": "ud", "category": "13", "price": 15.00},
    {"code": "MOB-005", "description": "Espuma poliuretano", "unit": "ud", "category": "13", "price": 6.00},
    {"code": "MOB-006", "description": "Silicona sanitaria transparente", "unit": "ud", "category": "13", "price": 5.00},
    {"code": "MOB-007", "description": "Silicona sanitaria blanca", "unit": "ud", "category": "13", "price": 5.00},
    {"code": "MOB-008", "description": "Cinta de telar (pintura)", "unit": "ud", "category": "13", "price": 4.00},
    {"code": "MOB-009", "description": "Plastico de proteccion (rollo)", "unit": "ud", "category": "13", "price": 8.00},
    {"code": "MOB-010", "description": "Clavos de acero various (kg)", "unit": "kg", "category": "13", "price": 5.00},
    {"code": "MOB-011", "description": "Tornillos various (caja)", "unit": "ud", "category": "13", "price": 8.00},
    {"code": "MOB-012", "description": "Anclajes quimicos", "unit": "ud", "category": "13", "price": 12.00},
    {"code": "MOB-013", "description": "Taco + tornillo madera", "unit": "ud", "category": "13", "price": 0.30},
    {"code": "MOB-014", "description": "Grapas para cable", "unit": "ud", "category": "13", "price": 0.10},
    {"code": "MOB-015", "description": "Cinta americana (papel)", "unit": "ud", "category": "13", "price": 6.00},
    {"code": "MOB-016", "description": "Yeso de albanileria (saco 25kg)", "unit": "ud", "category": "13", "price": 10.00},
    {"code": "MOB-017", "description": "Mortero de cemento (saco 25kg)", "unit": "ud", "category": "13", "price": 7.00},
    {"code": "MOB-018", "description": "Placa de yeso laminado 12.5mm", "unit": "ud", "category": "13", "price": 12.00},
    {"code": "MOB-019", "description": "Perfil metalico U/C (3m)", "unit": "ud", "category": "13", "price": 4.00},
    {"code": "MOB-020", "description": "Tornillo placa yeso (200ud)", "unit": "ud", "category": "13", "price": 5.00},

    # =============================================
    # GRUPO 14: MATERIALES PINTURA (solo material)
    # =============================================
    {"code": "MP-001", "description": "Pintura plastica blanca (15L)", "unit": "ud", "category": "14", "price": 35.00},
    {"code": "MP-002", "description": "Pintura plastica blanca (4L)", "unit": "ud", "category": "14", "price": 15.00},
    {"code": "MP-003", "description": "Pintura plastica color (4L)", "unit": "ud", "category": "14", "price": 18.00},
    {"code": "MP-004", "description": "Imprimacion pared (5L)", "unit": "ud", "category": "14", "price": 12.00},
    {"code": "MP-005", "description": "Masilla para grietas (1kg)", "unit": "ud", "category": "14", "price": 5.00},
    {"code": "MP-006", "description": "Masilla preparacion (25kg)", "unit": "ud", "category": "14", "price": 18.00},
    {"code": "MP-007", "description": "Lija pared grano 120", "unit": "ud", "category": "14", "price": 3.00},
    {"code": "MP-008", "description": "Rodillo pintor (normal)", "unit": "ud", "category": "14", "price": 5.00},
    {"code": "MP-009", "description": "Pincel 2'' (punta redonda)", "unit": "ud", "category": "14", "price": 6.00},
    {"code": "MP-010", "description": "Bandeja de pintura", "unit": "ud", "category": "14", "price": 4.00},
    {"code": "MP-011", "description": "Extension para rodillo", "unit": "ud", "category": "14", "price": 5.00},

    # =============================================
    # GRUPO 15: MATERIALES CERAMICA / PAVIMENTOS (solo material)
    # =============================================
    {"code": "MC-001", "description": "Baldosa ceramica suelo basica (m2)", "unit": "m2", "category": "15", "price": 15.00},
    {"code": "MC-002", "description": "Baldosa ceramica suelo media (m2)", "unit": "m2", "category": "15", "price": 25.00},
    {"code": "MC-003", "description": "Baldosa ceramica suelo alta (m2)", "unit": "m2", "category": "15", "price": 45.00},
    {"code": "MC-004", "description": "Azulejo pared basico (m2)", "unit": "m2", "category": "15", "price": 18.00},
    {"code": "MC-005", "description": "Azulejo pared medio (m2)", "unit": "m2", "category": "15", "price": 30.00},
    {"code": "MC-006", "description": "Azulejo pared alto (m2)", "unit": "m2", "category": "15", "price": 55.00},
    {"code": "MC-007", "description": "Liston decorativo ceramico (ml)", "unit": "ml", "category": "15", "price": 8.00},
    {"code": "MC-008", "description": "Zocalo ceramico (ml)", "unit": "ml", "category": "15", "price": 6.00},
    {"code": "MC-009", "description": "Solecera de ventana (ud)", "unit": "ud", "category": "15", "price": 25.00},
    {"code": "MC-010", "description": "Peldano de escalera (ud)", "unit": "ud", "category": "15", "price": 30.00},
    {"code": "MC-011", "description": "Laminado suelo basico (m2)", "unit": "m2", "category": "15", "price": 12.00},
    {"code": "MC-012", "description": "Laminado suelo medio (m2)", "unit": "m2", "category": "15", "price": 20.00},
    {"code": "MC-013", "description": "Laminado suelo alto (m2)", "unit": "m2", "category": "15", "price": 32.00},
    {"code": "MC-014", "description": "Vinilico (m2)", "unit": "m2", "category": "15", "price": 15.00},
    {"code": "MC-015", "description": "Tarima flotante (m2)", "unit": "m2", "category": "15", "price": 22.00},
    {"code": "MC-016", "description": "Forro de laminado rodapie (ml)", "unit": "ml", "category": "15", "price": 5.00},
    {"code": "MC-017", "description": "Pintura ceramica (1L)", "unit": "ud", "category": "15", "price": 15.00},
]

db = SessionLocal()
try:
    for item_data in CATALOG_DATA:
        existing = db.query(CatalogItem).filter(CatalogItem.code == item_data["code"]).first()
        if not existing:
            db.add(CatalogItem(**item_data))
    db.commit()
    print(f"Catalog seeded with {len(CATALOG_DATA)} items (bundled pricing 2025)")
finally:
    db.close()
