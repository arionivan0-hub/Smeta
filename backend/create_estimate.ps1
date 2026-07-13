$baseUrl = "http://localhost:8000/api"
$estId = 1

# Helper function
function Add-Chapter($code, $name, $order) {
    $body = @{code=$code; name=$name; order=$order; estimate_id=$estId} | ConvertTo-Json
    $ch = Invoke-RestMethod -Uri "$baseUrl/estimates/$estId/chapters" -Method POST -ContentType "application/json" -Body $body
    return $ch.id
}

function Add-Position($chapterId, $code, $desc, $unit, $qty, $price) {
    $total = [math]::Round($qty * $price, 2)
    $body = @{code=$code; description=$desc; unit=$unit; quantity=$qty; unit_price=$price; total_price=$total; chapter_id=$chapterId} | ConvertTo-Json
    Invoke-RestMethod -Uri "$baseUrl/estimates/chapters/$chapterId/positions" -Method POST -ContentType "application/json" -Body $body | Out-Null
    Write-Host "  $code $desc | $qty $unit x EUR$price = EUR$total"
}

# ============================================
# CAP 0: TRABAJOS PRELIMINARES
# ============================================
Write-Host "`n=== CAP 0: TRABAJOS PRELIMINARES ==="
$ch0 = Add-Chapter "0" "Trabajos Preliminares" 0

Add-Position $ch0 "0-008" "Licencia de obra menor" "ud" 1 300
Add-Position $ch0 "0-009" "Proyecto tecnico (arquitecto)" "ud" 1 1500
Add-Position $ch0 "0-001" "Senalizacion y balizamiento" "ud" 1 200
Add-Position $ch0 "0-002" "Vallado perimetral" "m" 20 30
Add-Position $ch0 "0-006" "Contenedor escombros (alquiler)" "ud" 2 180
Add-Position $ch0 "0-003" "Limpieza y preparacion" "m2" 110 4.50
Add-Position $ch0 "MO-027" "Peon general (jornada)" "dia" 3 100
Add-Position $ch0 "GG-002" "Carga y descarga materiales" "ud" 1 200

# ============================================
# CAP 1: DEMOLICIONES
# ============================================
Write-Host "`n=== CAP 1: DEMOLICIONES ==="
$ch1 = Add-Chapter "1" "Demoliciones" 1

Add-Position $ch1 "MO-027" "Peon general (jornada)" "dia" 8 100
Add-Position $ch1 "1-008" "Demolicion suelo antiguo" "m2" 110 10
Add-Position $ch1 "1-002" "Retirada azulejos 3 banos" "m2" 60 12
Add-Position $ch1 "1-001" "Demolicion tabiques" "m2" 15 18
Add-Position $ch1 "1-003" "Retirada pavimento laminado" "m2" 65 9
Add-Position $ch1 "1-004" "Retirada puertas interiores" "ud" 8 25
Add-Position $ch1 "1-005" "Retirada ventanas" "ud" 6 40
Add-Position $ch1 "1-006" "Retirada mobiliario cocina" "ud" 1 150
Add-Position $ch1 "1-007" "Retirada sanitarios (3 banos)" "ud" 8 60
Add-Position $ch1 "0-007" "Transporte escombros a vertedero" "m3" 8 35
Add-Position $ch1 "MQ-001" "Excavadora (hora)" "hora" 4 65

# ============================================
# CAP 2: ALBANILERIA
# ============================================
Write-Host "`n=== CAP 2: ALBANILERIA ==="
$ch2 = Add-Chapter "2" "Albanileria" 2

Add-Position $ch2 "MO-001" "Albanil (jornada)" "dia" 15 150
Add-Position $ch2 "MO-003" "Peon albanileria (jornada)" "dia" 15 100
Add-Position $ch2 "2-002" "Tabique yeso laminado doble placa" "m2" 30 28
Add-Position $ch2 "MOB-018" "Placa yeso laminado 12.5mm" "ud" 40 12
Add-Position $ch2 "MOB-019" "Perfil metalico U/C (3m)" "ud" 50 4
Add-Position $ch2 "MOB-020" "Tornillo placa yeso (200ud)" "ud" 4 5
Add-Position $ch2 "2-003" "Enfoscado interior satinado" "m2" 300 15
Add-Position $ch2 "MOB-016" "Yeso de albanileria (saco 25kg)" "ud" 30 10
Add-Position $ch2 "2-005" "Falso techo yeso laminado" "m2" 90 30
Add-Position $ch2 "MO-012" "Yesista/Escayolista (jornada)" "dia" 12 125
Add-Position $ch2 "2-006" "Solado ceramico mano de obra" "m2" 85 25
Add-Position $ch2 "2-007" "Alicatado ceramico mano de obra" "m2" 80 28
Add-Position $ch2 "MO-014" "Azulejero/Frio (jornada)" "dia" 12 135
Add-Position $ch2 "MO-013" "Yesista/Escayolista (jornada)" "dia" 6 125
Add-Position $ch2 "2-009" "Aislamiento termico lana roca" "m2" 60 18
Add-Position $ch2 "MOB-004" "Imprimacion para yeso" "ud" 5 15

# ============================================
# CAP 3: INSTALACIONES - ELECTRICIDAD
# ============================================
Write-Host "`n=== CAP 3: INSTALACIONES ELECTRICIDAD ==="
$ch3 = Add-Chapter "3" "Instalaciones Electricidad" 3

Add-Position $ch3 "MO-004" "Electricista cualificado (hora)" "hora" 80 32
Add-Position $ch3 "3-001" "Renovacion instalacion electrica" "m2" 110 28
Add-Position $ch3 "3-002" "Cuadro electrico nuevo" "ud" 1 350
Add-Position $ch3 "ME-014" "Diferencial 25A 30mA" "ud" 2 35
Add-Position $ch3 "ME-015" "PIA Magnetotermico 16A" "ud" 6 12
Add-Position $ch3 "ME-016" "PIA Magnetotermico 20A" "ud" 4 12
Add-Position $ch3 "3-003" "Punto de luz nuevo" "ud" 25 45
Add-Position $ch3 "ME-007" "Mecanismo interruptor simple" "ud" 15 4.50
Add-Position $ch3 "ME-009" "Mecanismo conmutador" "ud" 8 7
Add-Position $ch3 "ME-008" "Mecanismo toma corriente 2P+T" "ud" 30 5
Add-Position $ch3 "3-004" "Toma de corriente nueva" "ud" 30 40
Add-Position $ch3 "3-005" "Conmutador / interruptor" "ud" 15 35
Add-Position $ch3 "ME-010" "Placa mecanismo 1 post" "ud" 15 2.50
Add-Position $ch3 "ME-011" "Placa mecanismo 2 post" "ud" 10 3.50
Add-Position $ch3 "ME-012" "Placa mecanismo 3 post" "ud" 5 4.50
Add-Position $ch3 "3-006" "Mecanismo persiana electrica" "ud" 6 85
Add-Position $ch3 "ME-001" "Cable electrico 2.5mm (rollo)" "ud" 4 45
Add-Position $ch3 "ME-002" "Cable electrico 4mm (rollo)" "ud" 2 65
Add-Position $ch3 "ME-003" "Tubo corrugado 20mm" "ud" 6 12
Add-Position $ch3 "ME-004" "Tubo corrugado 25mm" "ud" 4 15
Add-Position $ch3 "ME-005" "Caja empotrada" "ud" 50 0.80
Add-Position $ch3 "ME-017" "Bornas de conexion" "ud" 50 1.50
Add-Position $ch3 "ME-018" "Cinta aislante" "ud" 5 2

# ============================================
# CAP 4: INSTALACIONES - FONTANERIA
# ============================================
Write-Host "`n=== CAP 4: INSTALACIONES FONTANERIA ==="
$ch4 = Add-Chapter "4" "Instalaciones Fontaneria" 4

Add-Position $ch4 "MO-006" "Fontanero (hora)" "hora" 60 30
Add-Position $ch4 "3-010" "Renovacion fontaneria completa" "m2" 110 22
Add-Position $ch4 "3-014" "Punto de agua nuevo" "ud" 12 80
Add-Position $ch4 "3-015" "Desague nuevo" "ud" 10 90
Add-Position $ch4 "MF-001" "Tubo cobre 15mm (barra 6m)" "ud" 8 12
Add-Position $ch4 "MF-002" "Tubo cobre 22mm (barra 6m)" "ud" 6 18
Add-Position $ch4 "MF-005" "Tubo PVC evacuate 40mm" "ud" 10 8
Add-Position $ch4 "MF-006" "Tubo PVC evacuate 100mm" "ud" 6 15
Add-Position $ch4 "MF-007" "Codo cobre 15mm 90" "ud" 15 1.20
Add-Position $ch4 "MF-008" "Codo cobre 22mm 90" "ud" 12 1.80
Add-Position $ch4 "MF-009" "Tee cobre 15mm" "ud" 10 1.50
Add-Position $ch4 "MF-010" "Tee cobre 22mm" "ud" 8 2.20
Add-Position $ch4 "MF-013" "Llave de paso 1/2" "ud" 8 8
Add-Position $ch4 "MF-014" "Llave de paso 3/4" "ud" 4 12
Add-Position $ch4 "MF-015" "Llave de paso con filtro" "ud" 3 15
Add-Position $ch4 "MF-018" "Sifon de lavabo" "ud" 5 8
Add-Position $ch4 "MF-019" "Sifon de fregadero" "ud" 1 12
Add-Position $ch4 "MF-020" "Desague de suelo" "ud" 4 18
Add-Position $ch4 "MF-021" "Flexo de conexion" "ud" 5 6
Add-Position $ch4 "MF-022" "Junta teflon" "ud" 5 2
Add-Position $ch4 "MF-023" "Pasta de soldar" "ud" 2 8
Add-Position $ch4 "MF-024" "Grapas fijacion tubo" "ud" 100 0.15
Add-Position $ch4 "MF-003" "Tubo CPVC 16mm" "ud" 8 5
Add-Position $ch4 "MF-004" "Tubo CPVC 20mm" "ud" 6 6.50

# ============================================
# CAP 5: INSTALACIONES - GAS Y CALEFACCION
# ============================================
Write-Host "`n=== CAP 5: GAS Y CALEFACCION ==="
$ch5 = Add-Chapter "5" "Gas y Calefaccion" 5

Add-Position $ch5 "MO-006" "Fontanero (hora)" "hora" 30 30
Add-Position $ch5 "3-020" "Instalacion de gas" "ud" 1 450
Add-Position $ch5 "3-025" "Suelo radiante mano de obra + material" "m2" 75 55
Add-Position $ch5 "3-026" "Caldera de gas (suministro + instalacion)" "ud" 1 1800
Add-Position $ch5 "3-027" "Radiador aluminio (suministro + colocacion)" "ud" 8 250

# ============================================
# CAP 6: INSTALACIONES - AIRE ACONDICIONADO
# ============================================
Write-Host "`n=== CAP 6: AIRE ACONDICIONADO ==="
$ch6 = Add-Chapter "6" "Aire Acondicionado" 6

Add-Position $ch6 "3-030" "Split aire acondicionado (sum + inst)" "ud" 3 900
Add-Position $ch6 "MO-004" "Electricista cualificado (hora)" "hora" 12 32

# ============================================
# CAP 7: BANO 1 (principal con ducha)
# ============================================
Write-Host "`n=== CAP 7: BANO 1 (Principal) ==="
$ch7 = Add-Chapter "7" "Bano 1 - Principal (8m2)" 7

Add-Position $ch7 "5-001" "Inodoro completo" "ud" 1 180
Add-Position $ch7 "5-003" "Lavabo empotrado con columna" "ud" 1 320
Add-Position $ch7 "5-004" "Plato de ducha compacto" "ud" 1 200
Add-Position $ch7 "5-006" "Grifo de ducha" "ud" 1 120
Add-Position $ch7 "5-007" "Grifo de lavabo" "ud" 1 80
Add-Position $ch7 "5-008" "Mampara de ducha" "ud" 1 300
Add-Position $ch7 "5-009" "Espejo de bano con luz LED" "ud" 1 180
Add-Position $ch7 "5-010" "Toallero electrico" "ud" 1 250
Add-Position $ch7 "5-011" "Accesorios de bano (juego)" "ud" 1 80
Add-Position $ch7 "MC-002" "Baldosa ceramica suelo (media)" "m2" 8 25
Add-Position $ch7 "MC-005" "Azulejo pared (medio)" "m2" 35 30
Add-Position $ch7 "MC-008" "Zocalo ceramico" "ml" 12 6
Add-Position $ch7 "MO-014" "Azulejero/Frio (jornada)" "dia" 3 135
Add-Position $ch7 "MOB-002" "Mortero cola baldosa (saco 25kg)" "ud" 4 12
Add-Position $ch7 "MOB-003" "Lechada juntas (saco 2kg)" "ud" 2 5
Add-Position $ch7 "MOB-006" "Silicona sanitaria transparente" "ud" 2 5
Add-Position $ch7 "MF-020" "Desague de suelo" "ud" 1 18

# ============================================
# CAP 8: BANO 2 (completo)
# ============================================
Write-Host "`n=== CAP 8: BANO 2 (Completo) ==="
$ch8 = Add-Chapter "8" "Bano 2 - Completo (6m2)" 8

Add-Position $ch8 "5-001" "Inodoro completo" "ud" 1 180
Add-Position $ch8 "5-002" "Lavabo con mueble" "ud" 1 250
Add-Position $ch8 "5-005" "Banoera" "ud" 1 350
Add-Position $ch8 "5-006" "Grifo de ducha" "ud" 1 120
Add-Position $ch8 "5-007" "Grifo de lavabo" "ud" 1 80
Add-Position $ch8 "5-008" "Mampara de ducha" "ud" 1 300
Add-Position $ch8 "5-009" "Espejo de bano" "ud" 1 180
Add-Position $ch8 "5-011" "Accesorios de bano (juego)" "ud" 1 80
Add-Position $ch8 "MC-002" "Baldosa ceramica suelo (media)" "m2" 6 25
Add-Position $ch8 "MC-005" "Azulejo pared (medio)" "m2" 28 30
Add-Position $ch8 "MC-008" "Zocalo ceramico" "ml" 10 6
Add-Position $ch8 "MO-014" "Azulejero/Frio (jornada)" "dia" 2 135
Add-Position $ch8 "MOB-002" "Mortero cola baldosa (saco 25kg)" "ud" 3 12
Add-Position $ch8 "MOB-003" "Lechada juntas (saco 2kg)" "ud" 2 5
Add-Position $ch8 "MOB-006" "Silicona sanitaria transparente" "ud" 2 5
Add-Position $ch8 "MF-020" "Desague de suelo" "ud" 1 18

# ============================================
# CAP 9: BANO 3 (aseo)
# ============================================
Write-Host "`n=== CAP 9: BANO 3 (Aseo) ==="
$ch9 = Add-Chapter "9" "Bano 3 - Aseo (3m2)" 9

Add-Position $ch9 "5-001" "Inodoro completo" "ud" 1 180
Add-Position $ch9 "5-002" "Lavabo con mueble" "ud" 1 250
Add-Position $ch9 "5-007" "Grifo de lavabo" "ud" 1 80
Add-Position $ch9 "5-009" "Espejo de bano" "ud" 1 180
Add-Position $ch9 "5-011" "Accesorios de bano (juego)" "ud" 1 80
Add-Position $ch9 "MC-001" "Baldosa ceramica suelo (basica)" "m2" 3 15
Add-Position $ch9 "MC-004" "Azulejo pared (basico)" "m2" 12 18
Add-Position $ch9 "MO-014" "Azulejero/Frio (jornada)" "dia" 1 135
Add-Position $ch9 "MOB-002" "Mortero cola baldosa (saco 25kg)" "ud" 1 12
Add-Position $ch9 "MOB-003" "Lechada juntas (saco 2kg)" "ud" 1 5
Add-Position $ch9 "MOB-006" "Silicona sanitaria" "ud" 1 5

# ============================================
# CAP 10: COCINA
# ============================================
Write-Host "`n=== CAP 10: COCINA GRANDE ==="
$ch10 = Add-Chapter "10" "Cocina (12m2)" 10

Add-Position $ch10 "MO-028" "Montador carpinteria (hora)" "hora" 24 24
Add-Position $ch10 "6-001" "Mueble cocina bajo + encimera (ml)" "ml" 5 350
Add-Position $ch10 "6-002" "Mueble cocina alto (ml)" "ml" 4 200
Add-Position $ch10 "6-003" "Encimera granito/laminado" "ml" 5 120
Add-Position $ch10 "6-004" "Fregadero acero inoxidable" "ud" 1 150
Add-Position $ch10 "6-005" "Grifo de cocina extractable" "ud" 1 120
Add-Position $ch10 "6-006" "Campana extractora" "ud" 1 250
Add-Position $ch10 "6-007" "Horno empotrado" "ud" 1 350
Add-Position $ch10 "6-008" "Fogon / vitroceramica" "ud" 1 280
Add-Position $ch10 "6-009" "Lavavajillas empotrado" "ud" 1 400
Add-Position $ch10 "6-011" "Azulejo backsplash cocina" "m2" 5 35
Add-Position $ch10 "6-012" "Falso techo con luz LED" "m2" 12 45
Add-Position $ch10 "MO-014" "Azulejero/Frio (jornada)" "dia" 1 135
Add-Position $ch10 "MOB-002" "Mortero cola baldosa (saco 25kg)" "ud" 2 12
Add-Position $ch10 "MOB-003" "Lechada juntas (saco 2kg)" "ud" 1 5

# ============================================
# CAP 11: ACABADOS - PINTURA
# ============================================
Write-Host "`n=== CAP 11: PINTURA ==="
$ch11 = Add-Chapter "11" "Pintura" 11

Add-Position $ch11 "MO-010" "Pintor (jornada)" "dia" 12 115
Add-Position $ch11 "4-001" "Pintura interior 2 manos" "m2" 280 8
Add-Position $ch11 "4-004" "Reparacion superficies previa pintar" "m2" 280 5
Add-Position $ch11 "4-005" "Imprimacion / fixador" "m2" 280 2.50
Add-Position $ch11 "MP-001" "Pintura plastica blanca 15L" "ud" 3 35
Add-Position $ch11 "MP-002" "Pintura plastica blanca 4L" "ud" 4 15
Add-Position $ch11 "MP-003" "Pintura plastica color 4L" "ud" 4 18
Add-Position $ch11 "MP-004" "Imprimacion pared 5L" "ud" 4 12
Add-Position $ch11 "MP-005" "Masilla grietas 1kg" "ud" 5 5
Add-Position $ch11 "MP-006" "Masilla preparacion 25kg" "ud" 3 18
Add-Position $ch11 "MP-007" "Lija pared grano 120" "ud" 8 3
Add-Position $ch11 "MP-008" "Rodillo pintor" "ud" 4 5
Add-Position $ch11 "MP-009" "Pincel 2 puntta redonda" "ud" 4 6
Add-Position $ch11 "MP-010" "Bandeja de pintura" "ud" 2 4
Add-Position $ch11 "MOB-008" "Cinta telar (pintura)" "ud" 8 4
Add-Position $ch11 "MOB-009" "Plastico proteccion (rollo)" "ud" 4 8

# ============================================
# CAP 12: ACABADOS - CARPINTERIA
# ============================================
Write-Host "`n=== CAP 12: CARPINTERIA ==="
$ch12 = Add-Chapter "12" "Carpinteria" 12

Add-Position $ch12 "MO-029" "Montador carpinteria (jornada)" "dia" 5 120
Add-Position $ch12 "4-031" "Puerta interior paso (media)" "ud" 7 280
Add-Position $ch12 "4-033" "Marco de puerta" "ud" 7 60
Add-Position $ch12 "4-034" "Colocacion puerta completa" "ud" 7 80
Add-Position $ch12 "4-032" "Puerta armario corredera" "m2" 8 85
Add-Position $ch12 "4-040" "Ventana aluminio doble cristal rotura pt" "m2" 15 180
Add-Position $ch12 "4-042" "Persiana motorizada" "ud" 6 350
Add-Position $ch12 "4-043" "Cristalera / mampara ducha" "m2" 4 150
Add-Position $ch12 "MOB-012" "Anclajes quimicos" "ud" 20 12
Add-Position $ch12 "MOB-013" "Taco + tornillo madera" "ud" 100 0.30

# ============================================
# CAP 13: ACABADOS - PAVIMENTOS
# ============================================
Write-Host "`n=== CAP 13: PAVIMENTOS ==="
$ch13 = Add-Chapter "13" "Pavimentos" 13

Add-Position $ch13 "MC-012" "Laminado suelo (medio)" "m2" 65 20
Add-Position $ch13 "MC-016" "Forro laminado rodapie" "ml" 60 5
Add-Position $ch13 "MO-009" "Carpintero obra (jornada)" "dia" 4 130
Add-Position $ch13 "MC-017" "Pintura ceramica 1L" "ud" 3 15

# ============================================
# CAP 14: GASTOS GENERALES
# ============================================
Write-Host "`n=== CAP 14: GASTOS GENERALES ==="
$ch14 = Add-Chapter "14" "Gastos Generales" 14

Add-Position $ch14 "GG-003" "Limpieza final de obra" "m2" 110 3
Add-Position $ch14 "GG-004" "Direccion de obra (arquitecto)" "%" 1 7

# ============================================
# SUMMARY
# ============================================
Write-Host "`n============================================="
Write-Host "RESUMEN - REFORMA INTEGRAL PISO 3 HAB 3 BANOS"
Write-Host "110m2 | Madrid, Spain"
Write-Host "============================================="

$est = Invoke-RestMethod -Uri "$baseUrl/estimates/$estId"
$totalGeneral = 0
$totalManoObra = 0
$totalMateriales = 0

foreach ($ch in $est.chapters) {
    $chTotal = 0
    foreach ($pos in $ch.positions) { $chTotal += $pos.total_price }
    $totalGeneral += $chTotal
    Write-Host "Cap $($ch.code) $($ch.name): EUR $([math]::Round($chTotal,2))"
}

Write-Host "============================================="
$iva = [math]::Round($totalGeneral * 0.21, 2)
Write-Host "Subtotal: EUR $([math]::Round($totalGeneral,2))"
Write-Host "IVA (21%): EUR $iva"
Write-Host "TOTAL CON IVA: EUR $([math]::Round($totalGeneral + $iva,2))"
Write-Host "============================================="
Write-Host "Precio por m2: EUR $([math]::Round(($totalGeneral + $iva) / 110, 2))/m2"
