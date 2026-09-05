(()=>{
  function movementCount(){
    if(!logGet('lrActivity')||logGet('lrActivity').value!=='logistica')return 1;
    return (logGet('lrDelivery')&&logGet('lrDelivery').checked?1:0)+(logGet('lrPickup')&&logGet('lrPickup').checked?1:0);
  }
  window.renderLogDaily=function(){
    let view=logGet('logDailyView');if(!view)return;
    let oldDate=logGet('lrDate')?logGet('lrDate').value:logToday();
    let activeStores=logisticsConfig.stores.filter(s=>s.active&&logisticsConfig.brands.some(b=>b.id===s.brandId&&b.active));
    let storeOpts=activeStores.map(s=>'<option value="'+s.id+'">'+logEsc(s.name)+'</option>').join('');
    view.innerHTML='<div class="logCard" style="text-align:left"><div class="logTitle">Registro diario</div><div class="logMeta" style="margin-bottom:10px">Registra una actividad realizada en una fecha y local.</div><div class="logForm"><label>Fecha</label><input id="lrDate" type="date" value="'+logEsc(oldDate)+'" onchange="renderLogDailyList()"><label>Local</label><select id="lrStore" onchange="logDailyStoreChanged()"><option value="">Seleccionar local</option>'+storeOpts+'</select><label>Actividad</label><select id="lrActivity" onchange="logDailyActivityChanged()"><option value="">Primero selecciona un local</option></select><label>Categoría</label><input id="lrCategory" readonly placeholder="Se completa según la actividad"><div id="lrSubtypeWrap" style="display:none"><label>Movimientos de logística</label><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px"><label class="logToggle" style="margin:0"><span>Entrega</span><input id="lrDelivery" type="checkbox" onchange="logDailyMovementChanged()"></label><label class="logToggle" style="margin:0"><span>Retiro</span><input id="lrPickup" type="checkbox" onchange="logDailyMovementChanged()"></label></div><div class="logMeta" style="margin-top:-4px;margin-bottom:8px">Puedes marcar uno o ambos movimientos en el mismo día.</div></div><div id="lrValueWrap" style="display:none"><label id="lrValueLabel">Valor por día</label><input id="lrValue" type="number" min="0" step="0.01" placeholder="Dejar en blanco si no corresponde" oninput="logDailyTotal()"><div id="lrDefaultHint" class="logMeta" style="margin-top:-7px;margin-bottom:8px"></div></div><label>Viáticos foráneos</label><input id="lrViatic" type="number" min="0" step="0.01" placeholder="Opcional; dejar en blanco si no corresponde" oninput="logDailyTotal()"><div class="logToggle" style="margin:4px 0 10px"><div><div style="font-size:11px;color:#667085">TOTAL A FACTURAR</div><b id="lrTotal">—</b></div></div><label>Comentario</label><input id="lrComment" placeholder="Opcional"><button class="primary" style="width:100%;border:0;border-radius:10px;padding:11px;font-weight:800" onclick="addLogRecord()">Guardar registro</button></div></div><div id="logDailyList"></div><div id="logMonthGroups"></div>';
    renderLogDailyList();
  };
  window.logDailyStoreChanged=function(){
    let s=logisticsConfig.stores.find(x=>x.id===logGet('lrStore').value),sel=logGet('lrActivity');if(!sel)return;
    let pairs=s?LOG_PAIRS.filter(p=>logPairEnabled(s,p)):[];
    sel.innerHTML='<option value="">Seleccionar actividad</option>'+pairs.map(p=>'<option value="'+p.a+'">'+p.aLabel+'</option>').join('');
    logGet('lrCategory').value='';logGet('lrSubtypeWrap').style.display='none';logGet('lrValueWrap').style.display='none';logGet('lrValue').value='';
    if(logGet('lrDelivery'))logGet('lrDelivery').checked=false;if(logGet('lrPickup'))logGet('lrPickup').checked=false;
    logDailyTotal();
  };
  window.logDailyActivityChanged=function(){
    let key=logGet('lrActivity').value,p=LOG_PAIRS.find(x=>x.a===key),value=logGet('lrValue'),hint=logGet('lrDefaultHint'),label=logGet('lrValueLabel');
    logGet('lrCategory').value=p?p.cLabel:'';
    logGet('lrSubtypeWrap').style.display=key==='logistica'?'block':'none';
    logGet('lrValueWrap').style.display=key?'block':'none';
    if(logGet('lrDelivery'))logGet('lrDelivery').checked=false;if(logGet('lrPickup'))logGet('lrPickup').checked=false;
    if(key==='impulsacion'){
      value.value='20';label.textContent='Valor por día';hint.textContent='Valor predeterminado: $20 por día. Puedes modificarlo.';
    }else if(key==='logistica'){
      value.value='10';label.textContent='Valor por movimiento';hint.textContent='Valor predeterminado: $10 por cada entrega o retiro. Puedes modificarlo.';
    }else{
      value.value='';label.textContent='Valor por día';hint.textContent='Valor manual; puede quedar en blanco.';
    }
    value.readOnly=false;logDailyTotal();
  };
  window.logDailyMovementChanged=function(){logDailyTotal()};
  window.logDailyPriceChanged=function(){logDailyTotal()};
  window.logDailyTotal=function(){
    let value=logNum('lrValue'),viatic=logNum('lrViatic'),activity=logGet('lrActivity')?logGet('lrActivity').value:'',moves=activity==='logistica'?movementCount():1;
    let has=value!==''||viatic!=='';
    let total=(value===''?0:value)*(activity==='logistica'?moves:1)+(viatic===''?0:viatic),el=logGet('lrTotal');
    if(el)el.textContent=has?logMoney(total):'—';
  };
  window.addLogRecord=function(){
    let date=logGet('lrDate').value,storeId=logGet('lrStore').value,activity=logGet('lrActivity').value,p=LOG_PAIRS.find(x=>x.a===activity),s=logisticsConfig.stores.find(x=>x.id===storeId);
    if(!date||!s||!p){alert('Selecciona fecha, local y actividad.');return}
    let delivery=activity==='logistica'&&logGet('lrDelivery')&&logGet('lrDelivery').checked;
    let pickup=activity==='logistica'&&logGet('lrPickup')&&logGet('lrPickup').checked;
    if(activity==='logistica'&&!delivery&&!pickup){alert('Marca Entrega, Retiro o ambos.');return}
    let moves=activity==='logistica'?(delivery?1:0)+(pickup?1:0):1;
    let subtype=activity==='logistica'?(delivery&&pickup?'ENTREGA + RETIRO':delivery?'ENTREGA':'RETIRO'):'';
    let b=logisticsConfig.brands.find(x=>x.id===s.brandId),value=logNum('lrValue'),viatic=logNum('lrViatic'),has=value!==''||viatic!=='',total=has?(value===''?0:value)*moves+(viatic===''?0:viatic):'';
    logisticsRecords.push({id:'r-'+Date.now(),date,storeId,storeName:s.name,city:s.city,brandId:s.brandId,brandName:b?b.name:'',activity:p.a,activityLabel:p.aLabel,category:p.c,categoryLabel:p.cLabel,subtype,movements:moves,delivery,pickup,value,viatic,total,comment:logGet('lrComment').value.trim()});
    saveLogRecords();logGet('lrComment').value='';logGet('lrViatic').value='';
    if(logGet('lrDelivery'))logGet('lrDelivery').checked=false;if(logGet('lrPickup'))logGet('lrPickup').checked=false;
    renderLogDailyList();logDailyTotal();
  };
})();
