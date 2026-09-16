(()=>{
  let activeTab='staff';
  function applyEventTabs(){
    const box=document.getElementById('eventsModule');
    if(!box||document.getElementById('eventDetailTabs'))return;
    const heads=[...box.querySelectorAll('h3')];
    const staffHead=heads.find(h=>h.textContent.includes('Personal y turnos'));
    const materialHead=heads.find(h=>h.textContent.includes('Materiales e insumos'));
    if(!staffHead||!materialHead)return;
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
  if(typeof old==='function')window.renderEventsHome=function(){old.apply(this,arguments);setTimeout(applyEventTabs,0)};
  document.addEventListener('click',()=>setTimeout(applyEventTabs,0));
  setTimeout(applyEventTabs,0);
})();