(()=>{
  const LOG_EXPORT_ACTIVITIES=[
    {key:'impulsacion',label:'IMPULSACION',category:'IMPULSADORA'},
    {key:'insumos',label:'INSUMOS',category:'INSUMOS'},
    {key:'supervision',label:'SUPERVISION',category:'SUPERVISOR'},
    {key:'logistica',label:'LOGISTICA',category:'LOGISTICA'}
  ];
  function recIndex(r){return logisticsRecords.indexOf(r)}
  function nextDay(a,b){let x=new Date(a+'T12:00:00'),y=new Date(b+'T12:00:00');return Math.round((y-x)/86400000)===1}
  function monthVisitBlocks(month){
    let rows=logisticsRecords.filter(r=>String(r.date||'').slice(0,7)===month);
    let visits=new Map();
    rows.forEach(r=>{
      let key=r.date+'|'+(r.storeId||r.storeName),v=visits.get(key);
      if(!v){v={date:r.date,storeId:r.storeId||'',storeName:r.storeName||'',city:r.city||'',brandId:r.brandId||'',brandName:r.brandName||'',firstIndex:recIndex(r),records:[]};visits.set(key,v)}
      v.records.push(r);v.firstIndex=Math.min(v.firstIndex,recIndex(r));
    });
    let seq=[...visits.values()].sort((a,b)=>a.date.localeCompare(b.date)||a.firstIndex-b.firstIndex),blocks=[];
    seq.forEach(v=>{
      let last=blocks[blocks.length-1];
      if(last&&last.storeId===v.storeId&&nextDay(last.lastDate,v.date)){
        last.visits.push(v);last.lastDate=v.date;last.records.push(...v.records)
      }else blocks.push({storeId:v.storeId,storeName:v.storeName,city:v.city,brandId:v.brandId,brandName:v.brandName,visits:[v],lastDate:v.date,records:[...v.records]})
    });
    return blocks;
  }
  function movementCount(r){
    if(r.activity!=='logistica')return 1;
    if(Number(r.movements)>0)return Number(r.movements);
    let s=String(r.subtype||'').toUpperCase();
    return s.includes('ENTREGA')&&s.includes('RETIRO')?2:1;
  }
  function recordTotal(r){
    if(r.total!==''&&r.total!=null&&!Number.isNaN(Number(r.total)))return Number(r.total);
    let value=r.value===''||r.value==null?0:Number(r.value)||0,viatic=r.viatic===''||r.viatic==null?0:Number(r.viatic)||0;
    return value*movementCount(r)+viatic;
  }
  function activitySummary(block,key){
    let rows=block.records.filter(r=>r.activity===key),values=rows.filter(r=>r.value!==''&&r.value!=null).map(r=>Number(r.value)),unique=[...new Set(values.map(v=>String(v)))];
    let value=unique.length===0?'':unique.length===1?Number(unique[0]):unique.join(' / ');
    let viatics=rows.filter(r=>r.viatic!==''&&r.viatic!=null).map(r=>Number(r.viatic)||0),viatic=viatics.length?viatics.reduce((a,b)=>a+b,0):'';
    let total=rows.length?rows.reduce((s,r)=>s+recordTotal(r),0):'';
    let comments=[...new Set(rows.map(r=>(r.comment||'').trim()).filter(Boolean))].join(' | ');
    return {value,viatic,total,comments};
  }
  function cellStyle(fill,fontColor='000000',bold=false,center=true){let thin={style:'thin',color:{rgb:'000000'}};return{fill:{fgColor:{rgb:fill}},font:{name:'Arial',sz:10,color:{rgb:fontColor},bold},alignment:{horizontal:center?'center':'left',vertical:'center',wrapText:true},border:{top:thin,bottom:thin,left:thin,right:thin}}}
  function exportLogisticsExcel(){
    if(typeof XLSX==='undefined'){alert('No se pudo cargar el módulo de Excel. Revisa la conexión a internet.');return}
    let date=logGet('lrDate')?logGet('lrDate').value:logToday(),month=date.slice(0,7),blocks=monthVisitBlocks(month);
    if(!blocks.length){alert('No hay registros de logística para '+month+'.');return}
    let headers=['CIUDAD','FECHAS','DIAS LABORADOS','ACTIVIDAD REALIZADA','MARCA','CATEGORIA','LOCAL','VALOR POR DIA','VIATICOS FORANEOS','TOTAL A FACTURAR','COMENTARIO'];
    let data=[headers],merges=[],row=1;
    blocks.forEach(block=>{
      let dates=block.visits.map(v=>Number(v.date.slice(8,10))).join(', '),days=block.visits.length,start=row;
      LOG_EXPORT_ACTIVITIES.forEach((a,i)=>{
        let s=activitySummary(block,a.key);
        data.push([
          i===0?block.city:'',i===0?dates:'',i===0?days:'',a.label,i===0?block.brandName:'',a.category,i===0?block.storeName:'',s.value,s.viatic,s.total,s.comments
        ]);row++;
      });
      [0,1,2,4,6].forEach(c=>merges.push({s:{r:start,c},e:{r:start+3,c}}));
    });
    let ws=XLSX.utils.aoa_to_sheet(data);ws['!merges']=merges;
    let headerFills=['D9EAF7','D9EAF7','D9EAF7','F4C7A1','9CC2E5','F4C7A1','9CC2E5','C6E0B4','FFE699','BDD7EE','D9EAD3'];
    for(let c=0;c<headers.length;c++){let a=XLSX.utils.encode_cell({r:0,c});ws[a].s=cellStyle(headerFills[c],'0000FF',true,true)}
    for(let r=1;r<data.length;r++)for(let c=0;c<headers.length;c++){
      let a=XLSX.utils.encode_cell({r,c});if(!ws[a])ws[a]={t:'s',v:''};
      let fill='FFFFFF';if(c===3||c===5)fill='FCE4D6';else if(c===4||c===6)fill='DDEBF7';else if(c===7)fill='E2F0D9';else if(c===8)fill='FFF2CC';else if(c===9)fill='D9EAF7';else if(c===10)fill='E2F0D9';
      ws[a].s=cellStyle(fill,'000000',false,c!==10);
      if(c>=7&&c<=9&&typeof ws[a].v==='number')ws[a].z='$0.00';
    }
    ws['!cols']=[{wch:14},{wch:15},{wch:15},{wch:22},{wch:18},{wch:18},{wch:30},{wch:15},{wch:18},{wch:18},{wch:38}];
    ws['!rows']=[{hpt:34},...Array.from({length:data.length-1},()=>({hpt:24}))];
    ws['!freeze']={xSplit:0,ySplit:1,topLeftCell:'A2',activePane:'bottomLeft',state:'frozen'};
    let wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'LOGISTICA '+month);
    XLSX.writeFile(wb,'Logistica_'+month+'.xlsx');
  }
  window.exportLogisticsExcel=exportLogisticsExcel;
  const oldRender=window.renderLogMonthGroups;
  window.renderLogMonthGroups=function(){
    if(typeof oldRender==='function')oldRender();
    let box=logGet('logMonthGroups');if(!box||box.querySelector('#logExportExcelBtn'))return;
    let date=logGet('lrDate')?logGet('lrDate').value:logToday(),blocks=monthVisitBlocks(date.slice(0,7));
    if(!blocks.length)return;
    let bar=document.createElement('div');bar.style.cssText='display:flex;justify-content:flex-end;margin-top:10px';
    bar.innerHTML='<button id="logExportExcelBtn" class="logAdd" style="background:#ecfdf3;color:#067647;border:0;padding:10px 14px;border-radius:10px;font-weight:800" onclick="exportLogisticsExcel()">Exportar Excel</button>';
    box.appendChild(bar);
  };
  if(logGet('logMonthGroups'))window.renderLogMonthGroups();
})();
