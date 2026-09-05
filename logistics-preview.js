(()=>{
  function cell(v){return logEsc(v==null?'':v)}
  function money(v){return v===''||v==null?'':Number(v).toFixed(2)}
  function activityText(r){return r.activity==='logistica'&&r.subtype?r.activityLabel+' - '+r.subtype:r.activityLabel}
  window.renderLogMonthGroups=function(){
    let box=logGet('logMonthGroups'),date=logGet('lrDate')?logGet('lrDate').value:logToday();
    if(!box)return;
    let blocks=logMonthBlocks(date),month=date.slice(0,7);
    let rows=blocks.map(g=>{
      let r=g.records[0],days=g.records.map(x=>logDateDay(x.date)).join(', ');
      let value=r.value===''||r.value==null?'':r.value;
      let viatic=r.viatic===''||r.viatic==null?'':r.viatic;
      let total='';
      if(value!==''||viatic!=='') total=(value===''?0:Number(value))+(viatic===''?0:Number(viatic));
      return '<tr><td>'+cell(r.city)+'</td><td>'+cell(days)+'</td><td>'+g.records.length+'</td><td>'+cell(activityText(r))+'</td><td>'+cell(r.brandName)+'</td><td>'+cell(r.categoryLabel)+'</td><td>'+cell(r.storeName)+'</td><td>'+money(value)+'</td><td>'+money(viatic)+'</td><td>'+money(total)+'</td><td>'+cell(r.comment)+'</td></tr>';
    }).join('');
    box.innerHTML='<div class="logRow" style="margin:18px 0 8px"><div><b>Vista previa del Excel</b><div class="logMeta">'+cell(month)+' · '+blocks.length+' fila(s)</div></div></div>'+
      (blocks.length?'<div style="overflow-x:auto;border:1px solid #e4e7ec;border-radius:12px;background:#fff"><table style="border-collapse:collapse;min-width:1250px;width:100%;font-size:12px;text-align:left"><thead><tr style="background:#f2f4f7"><th>CIUDAD</th><th>FECHAS</th><th>DÍAS LABORADOS</th><th>ACTIVIDAD REALIZADA</th><th>MARCA</th><th>CATEGORÍA</th><th>LOCAL</th><th>VALOR POR DÍA</th><th>VIÁTICOS FORÁNEOS</th><th>TOTAL A FACTURAR</th><th>COMENTARIO</th></tr></thead><tbody>'+rows+'</tbody></table></div>':'<div class="logCard"><div class="logMeta">Aún no hay filas para este mes.</div></div>');
    let table=box.querySelector('table');
    if(table){table.querySelectorAll('th,td').forEach(x=>{x.style.padding='9px';x.style.borderBottom='1px solid #eaecf0';x.style.whiteSpace='nowrap'});table.querySelectorAll('th').forEach(x=>x.style.fontWeight='800')}
  };
  if(logGet('logMonthGroups'))renderLogMonthGroups();
})();
