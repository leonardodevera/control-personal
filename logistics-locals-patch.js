(()=>{
  const VERSION='excel-locals-v1';
  if(localStorage.getItem('cp-logistics-locals-version')===VERSION)return;
  if(typeof logisticsConfig==='undefined')return;
  const brand=logisticsConfig.brands.find(b=>b.name==='LA ITALIANA')||logisticsConfig.brands[0];
  if(!brand)return;
  const base={city:'GUAYAQUIL',brandId:brand.id,active:true,activities:{impulsacion:true,insumos:true,supervision:true,logistica:true},categories:{impulsadora:true,insumos:true,supervisor:true,logistica:true}};
  const names=[
    'DISPROMARKS',
    'LYRYS VILLA CLUB',
    'DISPROMARKS',
    'LYRYS CIUDAD CELESTE',
    'NIKAMAR ANTEPARA Y COLON',
    'NIKAMAR 8 Y COLON',
    'NIKAMAR 25 Y CALLEJON PARRA',
    'NIKAMAR QUISQUIS',
    'NIKAMAR QUISQUIS',
    'LYRY DE PORTAL',
    'NIKAMAR 9VENA Y COLON',
    'NIKAMAR 25 Y CALLEJON PARRA',
    'NIKAMAR QUISQUIS'
  ];
  logisticsConfig.stores=names.map((name,i)=>({id:'excel-'+(i+1),name,...JSON.parse(JSON.stringify(base))}));
  saveLogistics();
  localStorage.setItem('cp-logistics-locals-version',VERSION);
  if(typeof renderLogistics==='function')renderLogistics();
})();
