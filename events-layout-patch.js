(()=>{
  let activeTab='staff';
  function applyEventEnhancements(){
    const box=document.getElementById('eventsModule');
    if(!box)return;
    const heads=[...box.querySelectorAll('h3')];
    const staffHead=heads.find(h=>h.textContent.includes('Personal y turnos'));
    const materialHead=heads.find(h=>h.textContent.includes('Materiales e insumos'));
    if(!staffHead||!materialHead)return;

    const addBtn=[...materialHead.parentElement.querySelectorAll('button')].find(b=>b.textContent.includes('Agregar al evento'));
    if(addBtn)addBtn.textContent='+ Agregar insumo';

    const back=[...box.querySelectorAll('button')].find(b=>b.textContent.includes('← Eventos'));
    const title=box.querySelector('h2');
    if(back&&title&&!document.getElementById('eventRenameBtn')){
      const row=document.createElement('div');
      row.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:10px';
      title.parentElement.insertBefore(row,title);row.appendChild(title);
      const edit=document.createElement('button');
      edit.id='eventRenameBtn';edit.type='button';edit.textContent='✏️ Cambiar nombre';
      edit.style.cssText='border:1px solid #d0d5dd;background:#fff;border-radius:9px;padding:8px 10px;font-weight:800;font-size:12px;white-space:nowrap';
      edit.onclick=()=>{
        const current=title.textContent.trim();
        const next=prompt('Nuevo nombre del evento:',current);
        if(next===null)return;
        const clean=next.trim();if(!clean){alert('El nombre no puede quedar vacío.');return}
        const raw=localStorage.getItem('cp-events');let list=[];try{list=JSON.parse(raw||'[]')||[]}catch(e){}
        const ev=list.find(x=>x.name===current);
        if(!ev){alert('No se pudo identificar el evento.');return}
        ev.name=clean;localStorage.setItem('cp-events',JSON.stringify(list));title.textContent=clean;
      };
      row.appendChild(edit);
    }

    if(document.getElementById('eventDetailTabs'))return;
    const staff=staffHead.parentElement,materials=materialHead.parentElement;
    const tabs=document.createElement('div');
    tabs.id='eventDetailTabs';
    tabs.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:6px;background:#eef2f7;padding:5px;border-radius:12px;margin-top:18px';
    tabs.innerHTML='<button id="eventStaffTab" type="button">👥 Personal</button><button id="eventMaterialsTab" type="button">📦 Materiales</button>';
    staff.parentElement.insertBefore(tabs,staff);
    [staff,materials].forEach(x=>{x.style.marginTop='12px'});
    function show(tab){
      activeTab=tab;staff.style.display=tab==='staff'?'block':'none';materials.style.display=tab==='materials'?'block':'none';
      const a=document.getElementById('eventStaffTab'),b=document.getElementById('eventMaterialsTab');
      [a,b].forEach(x=>x.style.cssText='border:0;border-radius:9px;padding:10px 6px;font-weight:850;background:transparent;color:#667085');
      const on=tab==='staff'?a:b;on.style.background='#2563eb';on.style.color='#fff';
    }
    document.getElementById('eventStaffTab').onclick=()=>show('staff');
    document.getElementById('eventMaterialsTab').onclick=()=>show('materials');
    show(activeTab);
  }
  const old=window.renderEventsHome;
  if(typeof old==='function')window.renderEventsHome=function(){old.apply(this,arguments);setTimeout(applyEventEnhancements,0)};
  document.addEventListener('click',()=>setTimeout(applyEventEnhancements,0));
  setTimeout(applyEventEnhancements,0);
})();