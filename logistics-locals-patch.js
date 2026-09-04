(()=>{
  const VERSION='excel-locals-v2';
  if(localStorage.getItem('cp-logistics-locals-version')===VERSION)return;
  if(typeof logisticsConfig==='undefined')return;
  const brand=logisticsConfig.brands.find(b=>b.name==='LA ITALIANA')||logisticsConfig.brands[0];
  if(!brand)return;
  const base={city:'GUAYAQUIL',brandId:brand.id,active:true,activities:{impulsacion:true,insumos:true,supervision:true,logistica:true},categories:{impulsadora:true,insumos:true,supervisor:true,logistica:true}};
  const names=[
    'DISPROMARK',
    'LYRYS VILLA CLUB',
    'LYRIS CIUDAD CELESTE',
    'NIKAMAR 9VENA Y COLON',
    'NIKAMAR 25 Y CALLEJON PARRA',
    'NIKAMAR QUISQUIS',
    'LYRIS DE PORTAL'
  ];
  logisticsConfig.stores=names.map((name,i)=>({id:'local-'+(i+1),name,...JSON.parse(JSON.stringify(base))}));
  saveLogistics();
  localStorage.setItem('cp-logistics-locals-version',VERSION);
  if(typeof renderLogistics==='function')renderLogistics();
})();
