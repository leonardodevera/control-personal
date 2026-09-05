(()=>{
  const localConfig=()=>{try{return JSON.parse(localStorage.getItem('cp-logistics-config')||'null')}catch(e){return null}};
  const localRecords=()=>{try{let x=JSON.parse(localStorage.getItem('cp-logistics-records')||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}};

  window.cloudSnapshot=function(){
    return {accounts,currentAccountId,logisticsConfig,logisticsRecords};
  };

  const originalSaveLogistics=window.saveLogistics;
  window.saveLogistics=function(){
    if(typeof originalSaveLogistics==='function')originalSaveLogistics();
    if(typeof queueCloudSave==='function')queueCloudSave();
  };

  const originalSaveLogRecords=window.saveLogRecords;
  window.saveLogRecords=function(){
    if(typeof originalSaveLogRecords==='function')originalSaveLogRecords();
    if(typeof queueCloudSave==='function')queueCloudSave();
  };

  window.loadCloud=async function(user){
    setSyncStatus('Sincronizando...');
    let{data,error}=await db.from('app_state').select('data').eq('user_id',user.id).maybeSingle();
    if(error){$('loginMsg').textContent='No se pudo cargar la información de la nube.';return false}

    let needsUpload=false;
    if(data&&data.data&&data.data.accounts){
      accounts=data.data.accounts;
      Object.values(accounts).forEach(normalize);
      let wanted=data.data.currentAccountId;
      if(wanted&&accounts[wanted])currentAccountId=wanted;else currentAccountId=Object.keys(accounts)[0];
      persistLocal();

      if(data.data.logisticsConfig&&data.data.logisticsConfig.brands&&data.data.logisticsConfig.stores){
        logisticsConfig=data.data.logisticsConfig;
        localStorage.setItem('cp-logistics-config',JSON.stringify(logisticsConfig));
      }else{
        let lc=localConfig();
        if(lc&&lc.brands&&lc.stores)logisticsConfig=lc;
        needsUpload=true;
      }

      if(Array.isArray(data.data.logisticsRecords)){
        logisticsRecords=data.data.logisticsRecords;
        localStorage.setItem('cp-logistics-records',JSON.stringify(logisticsRecords));
      }else{
        logisticsRecords=localRecords();
        needsUpload=true;
      }
    }else{
      let{error:createError}=await db.from('app_state').upsert({user_id:user.id,data:cloudSnapshot()},{onConflict:'user_id'});
      if(createError){$('loginMsg').textContent='No se pudo crear el respaldo inicial.';return false}
    }

    cloudReady=true;
    document.body.classList.add('signedIn');
    $('authGate').style.display='none';
    $('loginMsg').textContent='';
    setSyncStatus(needsUpload?'Guardando logística...':'Guardado en la nube');
    render();tab('today');
    if(needsUpload)queueCloudSave();
    return true;
  };
})();
