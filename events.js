(()=>{
  function renderEventsHome(){
    const box=document.getElementById('eventsModule');
    if(!box)return;
    box.innerHTML='<div class="eventsHead"><div><h2>Eventos</h2><div class="muted">Planificación de activaciones, personal y materiales.</div></div><button class="eventsNew" type="button" onclick="alert(\'El registro de eventos será el siguiente paso.\')">+ Nuevo evento</button></div><div class="eventsEmpty"><div class="eventsIcon">📅</div><strong>Aún no hay eventos registrados</strong><div class="muted">Aquí aparecerán las fechas, marcas, locales, personal asignado, horarios, materiales, insumos y observaciones de cada evento.</div></div>';
  }
  window.renderEventsHome=renderEventsHome;
  renderEventsHome();
})();
