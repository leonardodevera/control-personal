(()=>{
  function setupEventsTab(){
    const sw=document.querySelector('.moduleSwitch');
    const personal=document.getElementById('personalModule');
    const logistics=document.getElementById('logisticsModule');
    if(!sw||!personal||!logistics||document.getElementById('moduleEventsBtn'))return;
    sw.style.gridTemplateColumns='repeat(3,1fr)';
    const btn=document.createElement('button');
    btn.id='moduleEventsBtn';btn.textContent='📅 Eventos';sw.appendChild(btn);
    const events=document.createElement('div');
    events.id='eventsModule';events.className='logisticsPlaceholder';events.style.display='none';
    logistics.insertAdjacentElement('afterend',events);
    const oldSwitch=window.switchModule;
    btn.onclick=()=>{
      personal.style.display='none';logistics.style.display='none';events.style.display='block';
      document.getElementById('modulePersonalBtn').classList.remove('active');
      document.getElementById('moduleLogisticsBtn').classList.remove('active');btn.classList.add('active');
      const nav=document.querySelector('nav');if(nav)nav.style.display='none';
      const h=document.querySelector('.hero h1'),sub=document.querySelector('.hero .muted'),icon=document.querySelector('.heroIcon');
      if(h)h.textContent='Eventos';if(sub)sub.textContent='Planificación de activaciones';if(icon)icon.textContent='📅';
      if(typeof renderEventsHome==='function')renderEventsHome();
    };
    window.switchModule=function(m){
      if(m==='eventos'){btn.click();return}
      events.style.display='none';btn.classList.remove('active');
      return oldSwitch.apply(this,arguments);
    };
    if(typeof renderEventsHome==='function')renderEventsHome();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setupEventsTab);else setupEventsTab();
})();
