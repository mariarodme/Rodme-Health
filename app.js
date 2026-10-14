
var h=React.createElement,useState=React.useState,useEffect=React.useEffect,useRef=React.useRef;
var fmtD=function(d){if(!d)return'';return new Date(d+'T00:00:00').toLocaleDateString('es-CR',{day:'2-digit',month:'short',year:'numeric'});};
var fmtDL=function(d){if(!d)return'';return new Date(d+'T00:00:00').toLocaleDateString('es-CR',{day:'2-digit',month:'long',year:'numeric'});};
var fmtT=function(t){if(!t)return'';var p=t.split(':'),hr=parseInt(p[0]);return(hr>12?hr-12:(hr||12))+':'+p[1]+' '+(hr>=12?'PM':'AM');};
var du=function(d){if(!d)return null;var today=new Date();today.setHours(0,0,0,0);return Math.round((new Date(d+'T00:00:00')-today)/86400000);};
var b64=function(f){return new Promise(function(r,j){var x=new FileReader();x.onload=function(){r(x.result);};x.onerror=j;x.readAsDataURL(f);});};
var uid=function(){return Math.random().toString(36).slice(2,10);};
var ini=function(n){return(n||'').split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase()||'?';};
var xt=function(a,b){return Object.assign({},a,b);};
var lsg=function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):(d!==undefined?d:null);}catch(e){return d!==undefined?d:null;}};
var rhStorageWarned=false;
var lss=function(k,v){
  try{localStorage.setItem(k,JSON.stringify(v));return true;}
  catch(e){if(!rhStorageWarned){rhStorageWarned=true;window.alert('No fue posible guardar los datos en este navegador. Revisa el espacio disponible o la configuración de almacenamiento.');}return false;}
};
var uk=function(u,s){return'rh_'+(u||'x').replace(/[^a-z0-9]/gi,'_').toLowerCase()+'_'+s;};

function useStore(user){
  var keys={patients:'p',appointments:'a',medications:'m',doseLogs:'d',labs:'labs',vaccines:'vaccines',documents:'docs',vitals:'vitals',symptoms:'symptoms',followups:'followups'};
  var values=Object.keys(keys).map(function(name){return useState(function(){return lsg(uk(user,keys[name]))||[];});});
  useEffect(function(){Object.keys(keys).forEach(function(name,i){values[i][1](lsg(uk(user,keys[name]))||[]);});},[user]);
  function setter(state,key){return function(next){state(function(prev){var value=typeof next==='function'?next(prev):next;
    if(lss(uk(user,key),value)===false)return prev;return value;});};}
  var result={};
  Object.keys(keys).forEach(function(name,i){
    result[name]=values[i][0];
    result['set'+name.charAt(0).toUpperCase()+name.slice(1)]=setter(values[i][1],keys[name]);
  });
  return result;
}

function sv2(s,c,sw,ch){return h('svg',{width:s,height:s,fill:'none',stroke:c||'currentColor',strokeWidth:sw||'1.6',viewBox:'0 0 24 24',strokeLinecap:'round',strokeLinejoin:'round'},ch);}
var IC={
  home:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'}),h('polyline',{key:'b',points:'9 22 9 12 15 12 15 22'})]);},
  user:function(s,c){return sv2(s,c,1.6,[h('circle',{key:'c',cx:'12',cy:'8',r:'4'}),h('path',{key:'p',d:'M4 20c0-4 3.6-7 8-7s8 3 8 7'})]);},
  calendar:function(s,c){return sv2(s,c,1.6,[h('rect',{key:'r',x:'3',y:'4',width:'18',height:'18',rx:'2'}),h('path',{key:'p',d:'M16 2v4M8 2v4M3 10h18'})]);},
  pill:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M4.5 12.5L12.5 4.5a4.95 4.95 0 017 7l-8 8a4.95 4.95 0 01-7-7z'}),h('line',{key:'b',x1:'9',y1:'9',x2:'15',y2:'15'})]);},
  settings:function(s,c){return sv2(s,c,1.6,[h('circle',{key:'c',cx:'12',cy:'12',r:'3'}),h('path',{key:'p',d:'M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'})]);},
  plus:function(s,c){return sv2(s,c,2,[h('line',{key:'a',x1:'12',y1:'5',x2:'12',y2:'19'}),h('line',{key:'b',x1:'5',y1:'12',x2:'19',y2:'12'})]);},
  check:function(s,c){return sv2(s,c,2.2,h('polyline',{points:'20 6 9 17 4 12'}));},
  close:function(s,c){return sv2(s,c,1.6,[h('line',{key:'a',x1:'18',y1:'6',x2:'6',y2:'18'}),h('line',{key:'b',x1:'6',y1:'6',x2:'18',y2:'18'})]);},
  edit:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7'}),h('path',{key:'b',d:'M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z'})]);},
  trash:function(s,c){return sv2(s,c,1.6,[h('polyline',{key:'a',points:'3 6 5 6 21 6'}),h('path',{key:'b',d:'M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2'})]);},
  bell:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9'}),h('path',{key:'b',d:'M10.3 21a1.94 1.94 0 003.4 0'})]);},
  clock:function(s,c){return sv2(s,c,1.6,[h('circle',{key:'c',cx:'12',cy:'12',r:'9'}),h('polyline',{key:'p',points:'12 7 12 12 15 15'})]);},
  hospital:function(s,c){return sv2(s,c,1.6,[h('rect',{key:'r',x:'2',y:'6',width:'20',height:'15',rx:'1'}),h('path',{key:'p',d:'M8 21V12h8v9M9 9h6M12 6V3'})]);},
  file:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'}),h('polyline',{key:'b',points:'14 2 14 8 20 8'})]);},
  money:function(s,c){return sv2(s,c,1.6,[h('rect',{key:'a',x:'1',y:'4',width:'22',height:'16',rx:'2'}),h('line',{key:'b',x1:'1',y1:'10',x2:'23',y2:'10'})]);},
  alert:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'}),h('line',{key:'b',x1:'12',y1:'9',x2:'12',y2:'13'}),h('line',{key:'c',x1:'12',y1:'17',x2:'12.01',y2:'17'})]);},
  camera:function(s,c){return sv2(s,c,1.6,[h('path',{key:'p',d:'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z'}),h('circle',{key:'c',cx:'12',cy:'13',r:'4'})]);},
  back:function(s,c){return sv2(s,c,1.6,[h('line',{key:'a',x1:'19',y1:'12',x2:'5',y2:'12'}),h('polyline',{key:'b',points:'12 19 5 12 12 5'})]);},
  shield:function(s,c){return sv2(s,c,1.6,h('path',{d:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'}));},
  globe:function(s,c){return sv2(s,c,1.6,[h('circle',{key:'c',cx:'12',cy:'12',r:'9'}),h('line',{key:'a',x1:'3.6',y1:'9',x2:'20.4',y2:'9'}),h('line',{key:'b',x1:'3.6',y1:'15',x2:'20.4',y2:'15'}),h('path',{key:'p',d:'M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18'})]);},
  mail:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'}),h('polyline',{key:'b',points:'22,6 12,13 2,6'})]);},
  phone:function(s,c){return sv2(s,c,1.6,h('path',{d:'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72 11 11 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 11 11 0 002.81.7A2 2 0 0122 14.92z'}));},
  key:function(s,c){return sv2(s,c,1.6,h('path',{d:'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'}));},
  chevron:function(s,c){return sv2(s,c,1.6,h('polyline',{points:'9 18 15 12 9 6'}));},
  activity:function(s,c){return sv2(s,c,1.6,h('polyline',{points:'22 12 18 12 15 21 9 3 6 12 2 12'}));},
  eye:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'}),h('circle',{key:'b',cx:'12',cy:'12',r:'3'})]);},
  eyeoff:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24'}),h('line',{key:'b',x1:'1',y1:'1',x2:'23',y2:'23'})]);},
  record:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M9 11l3 3L22 4'}),h('path',{key:'b',d:'M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11'})]);},
  search:function(s,c){return sv2(s,c,1.6,[h('circle',{key:'c',cx:'11',cy:'11',r:'8'}),h('line',{key:'l',x1:'21',y1:'21',x2:'16.65',y2:'16.65'})]);},
  menu:function(s,c){return sv2(s,c,1.6,[h('line',{key:'a',x1:'3',y1:'12',x2:'21',y2:'12'}),h('line',{key:'b',x1:'3',y1:'6',x2:'21',y2:'6'}),h('line',{key:'c',x1:'3',y1:'18',x2:'21',y2:'18'})]);},
  sun:function(s,c){return sv2(s,c,1.6,[h('circle',{key:'c',cx:'12',cy:'12',r:'5'}),h('line',{key:'a',x1:'12',y1:'1',x2:'12',y2:'3'}),h('line',{key:'b',x1:'12',y1:'21',x2:'12',y2:'23'}),h('line',{key:'c2',x1:'4.22',y1:'4.22',x2:'5.64',y2:'5.64'}),h('line',{key:'d',x1:'18.36',y1:'18.36',x2:'19.78',y2:'19.78'}),h('line',{key:'e',x1:'1',y1:'12',x2:'3',y2:'12'}),h('line',{key:'f',x1:'21',y1:'12',x2:'23',y2:'12'}),h('line',{key:'g',x1:'4.22',y1:'19.78',x2:'5.64',y2:'18.36'}),h('line',{key:'i',x1:'18.36',y1:'5.64',x2:'19.78',y2:'4.22'})]);},
  moon:function(s,c){return sv2(s,c,1.6,h('path',{d:'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z'}));},
  logout:function(s,c){return sv2(s,c,1.6,[h('path',{key:'a',d:'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4'}),h('polyline',{key:'b',points:'16 17 21 12 16 7'}),h('line',{key:'c',x1:'21',y1:'12',x2:'9',y2:'12'})]);},
  heart:function(s,c){return sv2(s,c,1.6,h('path',{d:'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'}));},
  whatsapp:function(s,c){return h('svg',{width:s,height:s,viewBox:'0 0 24 24',fill:c||'currentColor'},h('path',{d:'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'}));}
};
function Ic(p){return (IC[p.n]||IC.close)(p.s||18,p.c||'currentColor');}
function Fld(p){return h('div',null,h('label',null,p.label),p.children);}
function upd(sf,k){return function(e){var v=e.target.value;sf(function(f){var n=xt(f,{});n[k]=v;return n;});};}

// ── SHEET ──────────────────────────────────────────────────────────────────
function Sheet(p){
  var panel=useRef(null);
  var closeRef=useRef(null);
  function requestClose(){
    if(p.dirty&&!window.confirm('Hay cambios sin guardar. ¿Cerrar y descartar esos cambios?'))return;
    if(p.onClose)p.onClose();
  }
  closeRef.current=requestClose;
  useEffect(function(){
    var previous=document.activeElement;
    var oldOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    var close=panel.current&&panel.current.querySelector('.sheet-hd .btn-icon');
    if(close)close.focus();
    function keydown(e){
      if(e.key==='Escape'&&closeRef.current){e.preventDefault();closeRef.current();return;}
      if(e.key!=='Tab'||!panel.current)return;
      var els=Array.from(panel.current.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]')).filter(function(el){return el.getClientRects().length>0;});
      if(!els.length)return;
      if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els[els.length-1].focus();}
      else if(!e.shiftKey&&document.activeElement===els[els.length-1]){e.preventDefault();els[0].focus();}
    }
    document.addEventListener('keydown',keydown);
    return function(){document.removeEventListener('keydown',keydown);document.body.style.overflow=oldOverflow;
      if(previous&&previous.isConnected&&previous.focus)previous.focus();};
  },[]);
  return h('div',{className:'overlay fi',onClick:function(e){if(e.target===e.currentTarget&&p.onClose)requestClose();}},
    h('div',{className:'sheet med1820-sheet',ref:panel,role:'dialog','aria-modal':true,'aria-label':p.title},
      h('div',{className:'sheet-grip'}),
      h('div',{className:'sheet-hd'},
        h('div',null,p.sub&&h('div',{className:'sheet-sub'},p.sub),h('div',{className:'sheet-title'},p.title)),
        h('button',{className:'btn-icon',onClick:requestClose,'aria-label':'Cerrar ventana'},h(Ic,{n:'close',s:17,c:'var(--text2)'}))
      ),
      h('div',{className:'sheet-bd'},p.children)
    )
  );
}

// ── PANEL DE SALUD ─────────────────────────────────────────────────────────
function HomeView(p){
  var store=p.store,sv=p.sv,sm=p.sm,ssa=p.ssa,ssp=p.ssp;
  var today=rhCalDay(new Date());
  var all=store.appointments||[],patients=store.patients||[],medications=store.medications||[];
  var upcoming=all.filter(function(a){return rhAppointmentActive(a)&&a.date>=today;}).sort(function(a,b){
    return (a.date+'T'+(a.time||'23:59')).localeCompare(b.date+'T'+(b.time||'23:59'));
  });
  var next=upcoming[0]||null,pending=rhPendingList(store,'all');
  var treatments=medications.filter(function(m){return m.status!=='completed'&&m.status!=='paused';});
  var overdue=all.filter(function(a){return rhAppointmentActive(a)&&a.date<today;}).length;
  var backupLast=lsg(uk(p.user,'last_backup_export'));
  var backupAge=backupLast?Math.floor((Date.now()-new Date(backupLast).getTime())/86400000):null;
  var backupDue=backupAge===null||!Number.isFinite(backupAge)||backupAge>=30;
  var prefs=lsg(uk(p.user,'prefs'))||{},firstName=(prefs.ownerName||'').trim().split(/\s+/)[0];
  function person(id){return patients.find(function(x){return x.id===id;});}
  function openA(a){ssa(a);sm('view-apt');}
  function openP(pt){ssp(pt);sv('patient');}
  var services=[
    {id:'patients',label:'Pacientes',icon:'user',count:patients.length,helper:'Perfiles familiares',tone:'aqua',go:function(){sv('patients');}},
    {id:'appointments',label:'Citas',icon:'calendar',count:upcoming.length,helper:'Próximas citas',tone:'blue',go:function(){sv('appointments');}},
    {id:'medications',label:'Medicamentos',icon:'pill',count:treatments.length,helper:'Tratamientos activos',tone:'mint',go:function(){sv('medications');}},
    {id:'health',label:'Centro de salud',icon:'file',count:(store.labs||[]).length+(store.vaccines||[]).length+(store.documents||[]).length,helper:'Registros y documentos',tone:'lavender',go:function(){sv('health');}}
  ];
  return h('main',{className:'med1820-home rh-board-home',id:'contenido-principal'},
    h('section',{className:'rh-board-hero','aria-label':'Bienvenida a Rodme Health'},
      h('div',{className:'rh-board-hero-copy'},
        h('span',{className:'rh-board-greeting'},firstName?'Hola, '+firstName:'Tu espacio de salud'),
        h('h1',null,'Rodme ',h('em',null,'Health')),
        h('h2',null,'Organiza la salud de toda tu familia, en un solo lugar.'),
        h('p',null,'Gestiona citas, tratamientos y documentos médicos de manera clara y organizada.'),
        h('div',{className:'rh-board-hero-buttons'},
          h('button',{className:'rh-board-primary',onClick:function(){sm('add-patient');}},
            'Agregar paciente',h(Ic,{n:'plus',s:16,c:'currentColor'})),
          h('button',{className:'rh-board-secondary',onClick:function(){next?openA(next):sv('appointments');}},
            next?'Ver próxima cita':'Ver calendario',h(Ic,{n:'calendar',s:16,c:'currentColor'}))
        )
      ),
      h('div',{className:'rh-board-hero-image','aria-hidden':true},
        h('img',{src:'https://images.pexels.com/photos/8459996/pexels-photo-8459996.jpeg?auto=compress&cs=tinysrgb&w=1300',alt:'',loading:'eager',decoding:'async'}),
        h('span',{className:'rh-board-hero-quote'},'Tu familia,',h('br'),'tu prioridad.')
      )
    ),
    h('section',{className:'rh-board-summary','aria-label':'Resumen de salud familiar'},
      services.map(function(item){return h('button',{key:item.id,className:'rh-board-summary-card tone-'+item.tone,onClick:item.go},
        h('span',{className:'rh-board-stat-icon'},h(Ic,{n:item.icon,s:21,c:'currentColor'})),
        h('span',{className:'rh-board-stat-copy'},
          h('strong',null,item.label),
          h('b',null,item.count),
          h('small',null,item.helper)
        ),
        h('span',{className:'rh-board-stat-chevron','aria-hidden':true},'›')
      );})
    ),
    h('section',{className:'rh-board-cards','aria-label':'Actividad de salud'},
      h('article',{className:'rh-board-panel rh-board-next'},
        h('div',{className:'rh-board-panel-head'},h('h2',null,'Próxima cita'),
          h('button',{onClick:function(){sv('appointments');}},'Ver todas ›')),
        next?h('div',{className:'rh-board-next-body'},
          h('div',{className:'rh-board-date'},
            h('span',null,rhCalDate(next.date).toLocaleDateString('es-CR',{month:'short'})),
            h('strong',null,rhCalDate(next.date).getDate()),
            h('span',null,rhCalDate(next.date).toLocaleDateString('es-CR',{weekday:'short'}))
          ),
          h('div',{className:'rh-board-next-info'},
            h('strong',null,next.reason||next.specialty||next.doctor||'Cita médica'),
            h('span',null,(next.time?fmtT(next.time)+' · ':'')+(person(next.patientId)?.name||'Paciente')),
            h('small',null,next.clinic||'Ubicación por confirmar')
          ),
          h('button',{className:'rh-board-round-arrow',onClick:function(){openA(next);},'aria-label':'Abrir detalles de próxima cita'},'→')
        ):h('div',{className:'rh-board-empty'},
          h(Ic,{n:'calendar',s:23,c:'var(--accent)'}),h('p',null,'Aún no tienes citas próximas.'),
          h('button',{onClick:function(){sm('add-apt');}},'+ Agregar cita')
        ),
        overdue>0&&h('button',{className:'rh-board-overdue',onClick:function(){sv('appointments');}},
          overdue+' cita'+(overdue===1?'':'s')+' pasada'+(overdue===1?'':'s')+' por revisar')
      ),
      h('article',{className:'rh-board-panel rh-board-treatments'},
        h('div',{className:'rh-board-panel-head'},h('h2',null,'Tratamientos activos'),
          h('button',{onClick:function(){sv('medications');}},'Ver todos ›')),
        treatments.length?treatments.slice(0,4).map(function(m,i){
          return h('button',{key:m.id,className:'rh-board-treat-row',onClick:function(){sv('medications');}},
            h('span',{className:'rh-board-treat-icon tone-'+(i%3)},h(Ic,{n:'pill',s:17,c:'currentColor'})),
            h('span',{className:'rh-board-treat-name'},h('strong',null,m.name),
              h('small',null,[m.frequency||m.doseTimes,person(m.patientId)?.name].filter(Boolean).join(' · '))),
            h('span',{className:'rh-board-row-chevron','aria-hidden':true},'›')
          );
        }):h('div',{className:'rh-board-empty'},h(Ic,{n:'pill',s:23,c:'var(--accent)'}),
          h('p',null,'No hay tratamientos activos.'),
          h('button',{onClick:function(){sm('add-med');}},'+ Agregar medicamento'))
      ),
      h('article',{className:'rh-board-panel rh-board-pendings'},
        h('div',{className:'rh-board-panel-head'},h('h2',null,'Pendientes de salud'),
          pending.length>0&&h('span',{className:'rh-board-pending-count'},pending.length),
          h('button',{onClick:p.onPending},'Ver todos ›')),
        pending.length?pending.slice(0,4).map(function(item){
          return h('button',{key:item.id,className:'rh-board-pending-row',onClick:p.onPending},
            h('span',{className:'rh-board-pending-circle'},h(Ic,{n:'check',s:13,c:'currentColor'})),
            h('span',{className:'rh-board-pending-main'},h('strong',null,item.title),
              h('small',null,item.detail)),
            h('span',{className:'rh-board-pending-date'},item.date?fmtD(item.date):'')
          );
        }):h('div',{className:'rh-board-empty'},
          h(Ic,{n:'check',s:22,c:'var(--accent)'}),h('p',null,'Sin pendientes registrados.'))
      )
    ),
    h('section',{className:'rh-board-family','aria-label':'Pacientes y próximos eventos'},
      h('div',{className:'rh-board-section-head'},h('h2',null,'Mis pacientes'),
        h('button',{onClick:function(){sv('patients');}},'Ver todos ›')),
      h('div',{className:'rh-board-family-grid'},
        patients.length?patients.slice(0,5).map(function(pt){
          var count=upcoming.filter(function(a){return a.patientId===pt.id;}).length;
          return h('button',{key:pt.id,className:'rh-board-family-person',onClick:function(){openP(pt);}},
            h('span',{className:'rh-board-avatar'},pt.avatar?h('img',{src:pt.avatar,alt:''}):ini(pt.name)),
            h('span',null,h('strong',null,pt.name),h('small',null,count+' cita'+(count===1?'':'s')+' próxima'+(count===1?'':'s'))),
            h('span',{'aria-hidden':true},'›')
          );
        }):h('div',{className:'rh-board-family-empty'},'No hay pacientes registrados.',
          h('button',{onClick:function(){sm('add-patient');}},'Agregar paciente'))
      )
    ),
    backupDue&&h('div',{className:'rh-backup-reminder'},
      h(Ic,{n:'shield',s:20,c:'currentColor'}),
      h('div',null,h('strong',null,'Revisa tu copia de seguridad'),
        h('p',null,'Este navegador no tiene un respaldo automático de los registros.')),
      h('button',{onClick:function(){sv('settings');}},'Crear copia →')
    ),
    h('div',{className:'rh-board-privacy'},
      h(Ic,{n:'shield',s:17,c:'currentColor'}),
      h('span',null,'Tus datos se guardan en este navegador y no están protegidos por una cuenta.'),
      h('button',{onClick:function(){sv('settings');}},'Configuración')
    )
  );
}

// ── PATIENTS ───────────────────────────────────────────────────────────────
function rhEmergencyCard(patient,medical,medications){
  if(!patient)return;
  if(!window.confirm('La ficha de emergencia contiene información personal. Se abrirá para imprimir y cualquier persona con acceso a la impresión podría verla. ¿Continuar?'))return;
  function esc(v){return String(v===undefined||v===null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  var meds=(medications||[]).filter(function(m){return m.patientId===patient.id&&m.status!=='completed';});
  function row(name,value){return '<div class="rh-erow"><small>'+esc(name)+'</small><strong>'+esc(value||'No registrado')+'</strong></div>';}
  var html='<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Ficha de emergencia</title>'+
    '<style>*{box-sizing:border-box}body{font-family:Arial,system-ui,sans-serif;color:#27352C;max-width:780px;margin:22px auto;padding:16px;background:#fff}header{background:#E7EFE5;padding:25px;border-radius:13px}h1{margin:0 0 12px;font-size:24px}h2{font-size:17px;margin:24px 0 13px}.rh-erow{display:flex;flex-direction:column;gap:6px;padding:12px 0;border-bottom:1px solid #E5E9E4}.rh-erow small{color:#697469;font-size:12px}.rh-erow strong{font-size:16px;white-space:pre-wrap;overflow-wrap:anywhere}section{margin:18px 0}p{font-size:12px;color:#647167;line-height:1.6}.np{display:flex;gap:9px;margin-top:22px}.np button{padding:13px 20px;background:#344A37;border:0;color:white;border-radius:99px;cursor:pointer}@media print{.np{display:none}body{margin:0;padding:0}}<\/style></head><body>'+
    '<header><h1>Ficha de emergencia · Rodme Health</h1><strong>'+esc(patient.name)+'</strong><p>Generada el '+esc(new Date().toLocaleDateString('es-CR'))+' · Información proporcionada por el usuario</p></header>'+
    '<section><h2>Información importante</h2>'+
    row('Grupo sanguíneo',medical.bloodType)+row('Alergias y reacciones registradas',medical.allergies)+row('Condiciones conocidas',medical.chronicConditions)+
    row('Contacto de emergencia',medical.emergencyContact)+row('Teléfono de emergencia',medical.emergencyPhone)+'</section>'+
    '<section><h2>Tratamientos actuales anotados</h2>'+
    (meds.length?meds.map(function(m){return row(m.name,(m.dosage||'')+' · '+(m.frequency||''));}).join(''):'<p>No hay tratamientos activos registrados.</p>')+'</section>'+
    '<p>Esta ficha no es un expediente oficial; los datos no están verificados. En caso de emergencia, solicita atención médica profesional. Conserva el documento en un lugar privado.</p>'+
    '<div class="np"><button onclick="window.print()">Imprimir / Guardar PDF</button><button onclick="window.close()">Cerrar</button></div></body></html>';
  var win=window.open('','_blank');
  if(!win){window.alert('Permite ventanas emergentes para abrir la ficha.');return;}
  win.opener=null;win.document.write(html);win.document.close();
}


function RhPatientSummaryBoard(p){
  var pt=p.patient,med=p.medical||{},events=p.events||[],apts=p.appointments||[],meds=p.medications||[];
  var active=meds.filter(function(m){return m.status!=='completed'&&m.status!=='paused';});
  function detail(label,value){return h('div',{className:'rh-board-patient-field',key:label},
    h('span',null,label),h('strong',null,value||'Sin registrar')); }
  return h('div',{className:'rh-board-patient-columns'},
    h('section',{className:'rh-board-patient-panel rh-board-patient-general'},
      h('div',{className:'rh-board-panel-head'},h('h2',null,'Información importante'),
        h('button',{onClick:p.onRecord},'Editar ›')),
      detail('Fecha de nacimiento',pt.birthdate?fmtD(pt.birthdate):''),
      detail('Grupo sanguíneo',med.bloodType),
      detail('Alergias registradas',med.allergies),
      detail('Condiciones conocidas',med.chronicConditions),
      detail('Contacto de emergencia',[med.emergencyContact,med.emergencyPhone].filter(Boolean).join(' · ')),
      h('button',{className:'rh-board-ghost-action',onClick:p.onEmergency},'Ficha de emergencia ↗')
    ),
    h('div',{className:'rh-board-patient-center'},
      h('section',{className:'rh-board-patient-panel'},
        h('div',{className:'rh-board-panel-head'},h('h2',null,'Resumen de salud'),
          h('button',{onClick:p.onHistory},'Ver historial ›')),
        h('div',{className:'rh-board-patient-mini-stats'},
          [['Citas',apts.length],['Tratamientos activos',active.length],['Registros médicos',p.recordCount]].map(function(v){
            return h('div',{key:v[0]},h('span',null,v[0]),h('strong',null,v[1]));
          })
        )
      ),
      h('section',{className:'rh-board-patient-panel'},
        h('div',{className:'rh-board-panel-head'},h('h2',null,'Tratamientos activos'),
          h('button',{onClick:p.onMedications},'Ver todos ›')),
        active.length?active.slice(0,4).map(function(m){
          return h('div',{className:'rh-board-patient-med',key:m.id},
            h('span',{className:'rh-board-med-icon'},h(Ic,{n:'pill',s:16,c:'currentColor'})),
            h('span',null,h('strong',null,m.name),h('small',null,[m.dosage,m.frequency].filter(Boolean).join(' · '))),
            h('span',{className:'rh-board-tag'},'Activo')
          );
        }):h('p',{className:'rh-board-patient-empty'},'Sin tratamientos activos registrados.')
      ),
      pt.notes&&h('section',{className:'rh-board-patient-panel'},
        h('div',{className:'rh-board-panel-head'},h('h2',null,'Notas personales')),
        h('p',{className:'rh-board-patient-note'},pt.notes))
    ),
    h('section',{className:'rh-board-patient-panel rh-board-patient-timeline'},
      h('div',{className:'rh-board-panel-head'},h('h2',null,'Línea de tiempo'),
        h('button',{onClick:p.onHistory},'Ver todo ›')),
      events.length?events.slice(0,6).map(function(ev){
        return h('div',{className:'rh-board-timeline-row',key:ev.id},
          h('span',{className:'rh-board-timeline-pin'},h(Ic,{n:ev.kind==='apt'?'calendar':ev.kind==='dose'?'check':'file',s:13,c:'currentColor'})),
          h('div',null,h('small',null,fmtD(ev.at.slice(0,10))),
            h('strong',null,ev.title),
            ev.meta&&h('span',null,ev.meta)),
          ev.apt&&h('button',{onClick:function(){p.onApt(ev.apt);},'aria-label':'Abrir cita'},'›')
        );
      }):h('p',{className:'rh-board-patient-empty'},'Sin actividad registrada.')
    )
  );
}

function PatientProfile(p){
  var store=p.store,pt=p.patient;
  var user=p.user;
  var medical=pt?rhReadRecord(user,pt.id,store.patients):{};
  var countState=useState(15),limit=countState[0],setLimit=countState[1];
  var tabState=useState('summary'),profileTab=tabState[0],setProfileTab=tabState[1];
  if(!pt)return h('div',{className:'rh-profile-empty'},'Selecciona un paciente.');
  var apts=store.appointments.filter(function(a){return a.patientId===pt.id;});
  var meds=store.medications.filter(function(m){return m.patientId===pt.id;});
  var medName=function(id){var m=meds.find(function(x){return x.id===id;});return m?m.name:'Medicamento';};
  var doses=(store.doseLogs||[]).filter(function(d){return d.patientId===pt.id;});
  var labs=(store.labs||[]).filter(function(v){return v.patientId===pt.id;});
  var vaccines=(store.vaccines||[]).filter(function(v){return v.patientId===pt.id;});
  var documents=(store.documents||[]).filter(function(v){return v.patientId===pt.id;});
  var vitals=(store.vitals||[]).filter(function(v){return v.patientId===pt.id;});
  var symptoms=(store.symptoms||[]).filter(function(v){return v.patientId===pt.id;});
  var followups=(store.followups||[]).filter(function(v){return v.patientId===pt.id;});
  var events=[];
  apts.forEach(function(a){events.push({id:'a'+a.id,at:a.date+(a.time?'T'+a.time:'T12:00'),title:a.reason||a.specialty||(a.doctor?'Consulta con Dr. '+a.doctor:'Cita médica'),
    meta:(a.clinic||'')+(a.time?' · '+fmtT(a.time):''),status:rhAppointmentLabel(a),kind:'apt',apt:a});});
  doses.forEach(function(d){events.push({id:'d'+d.id,at:d.at,title:d.status==='missed'?'Dosis omitida':'Dosis administrada',meta:medName(d.medicationId),kind:'dose'});});
  meds.forEach(function(m){if(m.startDate)events.push({id:'m'+m.id,at:m.startDate+'T08:00',title:'Inicio de tratamiento',meta:m.name,kind:'med'});});
  labs.forEach(function(x){events.push({id:'l'+x.id,at:x.date+'T12:00',title:'Laboratorio: '+x.title,meta:x.provider||'',kind:'med'});});
  vaccines.forEach(function(x){events.push({id:'v'+x.id,at:x.date+'T12:00',title:'Vacuna: '+x.title,meta:x.dose||'',kind:'med'});});
  documents.forEach(function(x){events.push({id:'doc'+x.id,at:x.date+'T12:00',title:'Documento: '+x.title,meta:x.fileName||'',kind:'med'});});
  vitals.forEach(function(x){var metric=RH_METRICS.find(function(m){return m.id===x.metric;});
    events.push({id:'vital'+x.id,at:x.date+'T12:00',title:metric?metric.label:'Medición',meta:x.value+(x.metric==='pressure'?'/'+x.value2:'')+' '+(x.unit||''),kind:'med'});});
  symptoms.forEach(function(x){events.push({id:'symptom'+x.id,at:x.date+'T12:00',title:'Síntoma: '+x.title,meta:'Intensidad '+x.severity+'/10',kind:'med'});});
  followups.forEach(function(x){events.push({id:'followup'+x.id,at:x.date+'T12:00',title:'Seguimiento: '+x.title,meta:x.status==='done'?'Completado':'Pendiente',kind:'med'});});
  events.sort(function(a,b){return b.at.localeCompare(a.at);});
  var next=apts.filter(function(a){return rhAppointmentActive(a)&&a.date>=rhCalDay(new Date());}).sort(function(a,b){return a.date.localeCompare(b.date);});
  return h('div',{className:'rh-profile med1820-section'},
    h('div',{className:'rh-profile-back'},h('button',{onClick:p.onBack},'← Volver a pacientes')),
    h('div',{className:'rh-profile-hero'},
      h('div',{className:'rh-profile-photo'},pt.avatar?h('img',{src:pt.avatar,alt:''}):ini(pt.name)),
      h('div',{className:'rh-profile-info'},h('span',null,'EXPEDIENTE FAMILIAR'),
        h('h1',null,pt.name),
        h('p',null,[pt.birthdate?'Nacimiento: '+fmtD(pt.birthdate):'',pt.whatsapp||''].filter(Boolean).join(' · '))),
      h('div',{className:'rh-profile-tools'},
        h('button',{className:'rh-mini-btn',onClick:function(){p.onEdit(pt);}},h(Ic,{n:'edit',s:14,c:'currentColor'}),' Editar'),
        h('button',{className:'rh-mini-btn rh-mini-primary',onClick:p.onAddApt},h(Ic,{n:'plus',s:14,c:'currentColor'}),' Nueva cita')
      )
    ),
    h('div',{className:'rh-profile-counts'},
      [[apts.length,'Citas'],[meds.length,'Medicamentos'],[labs.length+vaccines.length+documents.length,'Otros registros']].map(function(x,i){
        return h('div',{key:i},h('strong',null,x[0]),h('span',null,x[1]));
      })
    ),
    h('nav',{className:'rh-profile-tabbar','aria-label':'Secciones del paciente',role:'tablist'},
      [['summary','Resumen'],['appointments','Citas'],['medications','Tratamientos'],['history','Historial'],['documents','Documentos']].map(function(item){
        return h('button',{key:item[0],type:'button',role:'tab','aria-selected':profileTab===item[0],
          className:'rh-profile-tab'+(profileTab===item[0]?' active':''),
          onClick:function(){setProfileTab(item[0]);}},item[1]);
      })
    ),
    profileTab==='summary'&&h(RhPatientSummaryBoard,{patient:pt,medical:medical,events:events,
      appointments:apts,medications:meds,recordCount:labs.length+vaccines.length+documents.length,
      onRecord:p.onRecord,onEmergency:p.onEmergency,onHistory:function(){setProfileTab('history');},
      onMedications:function(){setProfileTab('medications');},onApt:p.onApt}),
    profileTab==='history'&&h('div',{className:'rh-patient-track-actions'},
      h('button',{className:'rh-mini-btn rh-mini-primary',onClick:p.onTracking},'Ver signos vitales y síntomas →'),
      h('button',{className:'rh-mini-btn',onClick:p.onEmergency},'Imprimir ficha de emergencia')
    ),
    (profileTab==='appointments'||profileTab==='medications')&&h('div',{className:'rh-profile-columns'},
      profileTab==='appointments'&&h('section',{className:'rh-profile-panel'},
        h('div',{className:'rh-profile-panel-head'},h('h2',null,'Próximas citas')),
        next.length?next.slice(0,6).map(function(a){return h('button',{className:'rh-profile-next',key:a.id,onClick:function(){p.onApt(a);}},
          h('span',null,fmtD(a.date)+(a.time?' · '+fmtT(a.time):'')),
          h('strong',null,a.reason||a.specialty||a.doctor||'Cita médica'),
          h('small',null,a.clinic||'Sin ubicación')
        );}):h('p',{className:'rh-profile-muted'},'Sin citas próximas.')
      ),
      profileTab==='medications'&&h('section',{className:'rh-profile-panel'},
        h('div',{className:'rh-profile-panel-head'},h('h2',null,'Tratamientos'),
          h('button',{onClick:p.onAddMed},'+ Agregar')),
        meds.length?meds.map(function(m){
          return h('div',{className:'rh-profile-med',key:m.id},
            h('strong',null,m.name),
            h('p',null,(m.dosage||'')+(m.frequency?' · '+m.frequency:'')),
            h('span',null,m.status==='completed'?'Finalizado':m.status==='paused'?'Pausado':'Activo')
          );
        }):h('p',{className:'rh-profile-muted'},'Sin medicamentos.')
      )
    ),
    profileTab==='documents'&&h('section',{className:'rh-profile-panel rh-center-profile-summary'},
      h('div',{className:'rh-profile-panel-head'},h('h2',null,'Otros registros'),
        h('button',{onClick:p.onHealth},'Ver centro de salud ↗')),
      h('div',{className:'rh-profile-counts'},
        [[labs.length,'Laboratorios'],[vaccines.length,'Vacunas'],[documents.length+vitals.length+symptoms.length+followups.length,'Otros registros']].map(function(x){
          return h('div',{key:x[1]},h('strong',null,x[0]),h('span',null,x[1]));
        })
      )
    ),
    profileTab==='documents'&&h('div',{className:'rh-profile-doc-actions'},
      h('button',{className:'rh-mini-btn rh-mini-primary',onClick:p.onHealth},'Ver laboratorios, vacunas y documentos →'),
      h('p',null,'Los archivos y resultados están organizados por paciente en Centro de salud.')
    ),
    profileTab==='history'&&h('section',{className:'rh-profile-panel rh-profile-timeline'},
      h('div',{className:'rh-profile-panel-head'},h('h2',null,'Historial cronológico')),
      events.length?events.slice(0,limit).map(function(ev){
        return h('div',{className:'rh-timeline-row',key:ev.id},
          h('div',{className:'rh-timeline-rail'},h('span',{className:ev.kind})),
          h('div',{className:'rh-timeline-item'},
            h('span',{className:'rh-timeline-date'},new Date(ev.at).toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'})),
            h('strong',null,ev.title),
            ev.meta&&h('small',null,ev.meta),
            ev.status&&h('span',{className:'rh-timeline-status'},ev.status),
            ev.apt&&h('button',{onClick:function(){p.onApt(ev.apt);}},'Ver detalles ↗')
          )
        );
      }):h('p',{className:'rh-profile-muted'},'Todavía no hay actividad registrada.'),
      events.length>limit&&h('button',{className:'rh-mini-btn',onClick:function(){setLimit(limit+20);}},'Mostrar más')
    )
  );
}

function PatientsView(p){
  var store=p.store,sm=p.sm,ssp=p.ssp,sv=p.sv;
  var qs=useState('');var q=qs[0],sq=qs[1];
  var filtered=store.patients.filter(function(pt){return !q||pt.name.toLowerCase().includes(q.toLowerCase());});
  return h('div',null,
    h('div',{className:'ph',style:{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}},
      h('div',null,h('p',{className:'ph-sub'},'Familia'),h('h1',{className:'ph-title'},'Pacientes')),
      h('button',{className:'btn btn-primary',style:{borderRadius:'var(--r-full)',padding:'9px 16px',fontSize:'.8rem'},onClick:function(){sm('add-patient');}},h(Ic,{n:'plus',s:14,c:'white'}),'Nuevo')
    ),
    h('div',{className:'srch',style:{marginBottom:13}},h('span',{className:'srch-ico'},h(Ic,{n:'search',s:14,c:'var(--text3)'})),h('input',{value:q,onChange:function(e){sq(e.target.value);},placeholder:'Buscar paciente...'})),
    filtered.length===0
      ?h('div',{className:'empty su'},h('div',{className:'empty-ico'},h(Ic,{n:'user',s:20,c:'var(--text3)'})),h('p',{style:{fontWeight:700,color:'var(--text2)',marginBottom:3}},q?'Sin resultados':'Sin pacientes'),h('p',{style:{fontSize:'.8rem'}},q?'Prueba otro nombre':'Agrega miembros de tu familia'))
      :filtered.map(function(pt,i){
          var apts=store.appointments.filter(function(a){return a.patientId===pt.id&&!a.attended;}).length;
          var meds=store.medications.filter(function(m){return m.patientId===pt.id;}).length;
          var age=pt.birthdate?Math.floor((new Date()-new Date(pt.birthdate))/(365.25*24*3600*1000)):null;
          return h('div',{key:pt.id,className:'pt-card su d'+Math.min(i+1,5)},
            h('div',{className:'av',style:{width:46,height:46,fontSize:'.85rem'}},pt.avatar?h('img',{src:pt.avatar,style:{width:'100%',height:'100%',objectFit:'cover'}}):ini(pt.name)),
            h('div',{style:{flex:1,minWidth:0}},
              h('p',{style:{fontWeight:700,fontSize:'.9rem',marginBottom:3}},pt.name),
              h('div',{style:{display:'flex',gap:5,flexWrap:'wrap',marginBottom:4}},
                age&&h('span',{className:'chip chip-gray'},age+' a\u00f1os'),
                pt.gender&&h('span',{className:'chip chip-gray'},pt.gender==='F'?'Femenino':pt.gender==='M'?'Masculino':'Otro')
              ),
              pt.whatsapp&&h('p',{style:{fontSize:'.72rem',color:'#22C55E',display:'flex',alignItems:'center',gap:4,marginBottom:4}},h(Ic,{n:'whatsapp',s:11,c:'#22C55E'}),pt.whatsapp),
              h('div',{style:{display:'flex',gap:5}},
                h('span',{className:'chip chip-accent'},apts+' pendiente'+(apts!==1?'s':'')),
                h('span',{style:{display:'inline-flex',alignItems:'center',gap:4,padding:'3px 10px',borderRadius:'var(--r-full)',fontSize:'.7rem',fontWeight:700,background:'var(--purple-bg)',color:'var(--purple)'}},meds+' med.')
              )
            ),
            h('div',{style:{display:'flex',flexDirection:'column',gap:5}},
              h('button',{className:'rh-patient-history',onClick:function(e){e.stopPropagation();ssp(pt);sv('patient');}},'Historial'),
              h('button',{className:'btn-icon',title:'Exportar PDF de '+pt.name,'aria-label':'Exportar PDF de '+pt.name,style:{background:'var(--red-bg)'},onClick:function(e){e.stopPropagation();generatePDF(rhReadRecord(p.user||'',pt.id,store.patients),store,pt);}},h(Ic,{n:'file',s:14,c:'var(--red)'})),
              h('button',{className:'btn-icon',title:'Editar '+pt.name,'aria-label':'Editar '+pt.name,onClick:function(e){e.stopPropagation();ssp(pt);sm('edit-patient');}},h(Ic,{n:'edit',s:14,c:'var(--text3)'}))
            )
          );
        })
  );
}


function rhAppointmentStatus(a){
  if(a.attended||a.status==='completed')return 'completed';
  return ['confirmed','rescheduled','cancelled'].includes(a.status)?a.status:'pending';
}
function rhAppointmentActive(a){return !['completed','cancelled'].includes(rhAppointmentStatus(a));}
function rhAppointmentLabel(a){return ({pending:'Pendiente',confirmed:'Confirmada',rescheduled:'Reprogramada',cancelled:'Cancelada',completed:'Realizada'})[rhAppointmentStatus(a)];}
function rhAppointmentUpdate(store,appt,status){
  store.setAppointments(function(list){return list.map(function(v){return v.id===appt.id?xt(v,{status:status,attended:status==='completed'}):v;});});
}
function rhCalDay(date){return date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
function rhCalDate(v){var d=new Date(v+'T12:00:00');return isNaN(d.getTime())?new Date():d;}
function rhIcsEscape(s){return String(s||'').replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function rhDownload(content,name,type){
  var blob=new Blob([content],{type:type||'application/octet-stream'}),url=URL.createObjectURL(blob);
  var a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(url);},10000);
}
function rhExportCalendar(apts,patients){
  var lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Rodme Health//Calendario personal//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
  var stamp=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  (apts||[]).forEach(function(a){
    if(!a.date||!/^20\d\d-\d\d-\d\d$/.test(a.date)||!rhAppointmentActive(a))return;
    var patient=(patients||[]).find(function(p){return p.id===a.patientId;});
    var title=(a.reason||a.specialty||'Cita médica')+(patient?' · '+patient.name:'');
    var description=[a.doctor?'Doctor: '+a.doctor:'',a.notes?'Notas: '+a.notes:'',a.prepInstructions?'Indicaciones: '+a.prepInstructions:''].filter(Boolean).join('\n');
    var start=a.date.replace(/-/g,''),timed=a.time&&/^\d\d:\d\d$/.test(a.time),end;
    if(timed){
      var d=rhCalDate(a.date);d.setHours(Number(a.time.slice(0,2))+1,Number(a.time.slice(3,5)),0);
      end=rhCalDay(d).replace(/-/g,'')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00';
      start+='T'+a.time.replace(':','')+'00';
    }else{var dn=rhCalDate(a.date);dn.setDate(dn.getDate()+1);end=rhCalDay(dn).replace(/-/g,'');}
    lines.push('BEGIN:VEVENT','UID:rodme-'+String(a.id||uid()).replace(/[^a-zA-Z0-9_-]/g,'')+'@local','DTSTAMP:'+stamp,
      'SUMMARY:'+rhIcsEscape(title),'LOCATION:'+rhIcsEscape(a.clinic||''),'DESCRIPTION:'+rhIcsEscape(description),
      (timed?'DTSTART:':'DTSTART;VALUE=DATE:')+start,(timed?'DTEND:':'DTEND;VALUE=DATE:')+end);
    if(timed&&!a.attended){
      var minutes=Number(a.reminderMinutes);
      if(![0,60,180,1440,2880].includes(minutes))minutes=1440;
      if(minutes>0)lines.push('BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+rhIcsEscape(title),'TRIGGER:-PT'+minutes+'M','END:VALARM');
    }
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  rhDownload(lines.join('\r\n')+'\r\n','rodme-citas.ics','text/calendar;charset=utf-8');
}

// ── APPOINTMENTS ───────────────────────────────────────────────────────────

function ApptsView(p){
  var modeState=useState('month'),mode=modeState[0],setMode=modeState[1];
  var dState=useState(function(){return rhCalDay(new Date());}),focus=dState[0],setFocus=dState[1];
  var current=rhCalDate(focus),today=rhCalDay(new Date());
  var all=p.store.appointments||[];
  var selectedEvents=all.filter(function(a){return a.date===focus;}).sort(function(a,b){return (a.time||'23:59').localeCompare(b.time||'23:59');});
  var weekdays=['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
  var first=new Date(current.getFullYear(),current.getMonth(),1,12);
  var offset=(first.getDay()+6)%7;
  var beginning=new Date(first);beginning.setDate(first.getDate()-offset);
  var count=mode==='week'?7:42;
  var weekBegin=rhCalDate(focus);weekBegin.setDate(weekBegin.getDate()-(weekBegin.getDay()+6)%7);
  function move(dir){var d=rhCalDate(focus);if(mode==='month'){d.setDate(1);d.setMonth(d.getMonth()+dir);}else d.setDate(d.getDate()+7*dir);setFocus(rhCalDay(d));}
  function openA(a){p.ssa(a);p.sm('view-apt');}
  function patient(a){return (p.store.patients||[]).find(function(x){return x.id===a.patientId;});}
  return h('div',{className:'rh-calendar-area med1820-section'},
    h('div',{className:'rh-calendar-toolbar'},
      h('div',null,h('h1',null,'Citas y calendario'),h('span',null,all.filter(rhAppointmentActive).length+' citas pendientes')),
      h('div',{className:'rh-calendar-toolbar-actions'},
        h('button',{className:'rh-mini-btn',onClick:function(){rhExportCalendar(all.filter(rhAppointmentActive),p.store.patients);},
          disabled:!all.some(rhAppointmentActive)},h(Ic,{n:'calendar',s:15,c:'currentColor'}),' Exportar .ics'),
        h('button',{className:'rh-mini-btn rh-mini-primary',onClick:function(){if(p.setDraftDate)p.setDraftDate('');p.sm('add-apt');}},h(Ic,{n:'plus',s:15,c:'currentColor'}),' Nueva cita')
      )
    ),
    h('div',{className:'rh-calendar-mode',role:'group','aria-label':'Vista de citas'},
      [['month','Mes'],['week','Semana'],['list','Lista']].map(function(x){
        return h('button',{key:x[0],className:mode===x[0]?'active':'',onClick:function(){setMode(x[0]);}},x[1]);
      })
    ),
    mode==='list'?h(LegacyApptsList,p):
    h('div',{className:'rh-calendar-shell'},
      h('div',{className:'rh-calendar-switcher'},
        h('button',{onClick:function(){move(-1);},'aria-label':'Periodo anterior'},'‹'),
        h('strong',null,mode==='month'?current.toLocaleDateString('es-CR',{month:'long',year:'numeric'}):
          rhCalDate(rhCalDay(weekBegin)).toLocaleDateString('es-CR',{day:'numeric',month:'long',year:'numeric'})),
        h('button',{onClick:function(){move(1);},'aria-label':'Periodo siguiente'},'›'),
        h('button',{className:'rh-calendar-today',onClick:function(){setFocus(today);}},'Hoy')
      ),
      h('div',{className:'rh-calendar-grid',role:'grid','aria-label':'Calendario de citas'},
        weekdays.map(function(w){return h('div',{key:w,className:'rh-calendar-weekday'},w);}),
        Array.from({length:count},function(_,i){
          var d=new Date(mode==='week'?weekBegin:beginning);d.setDate(d.getDate()+i);
          var day=rhCalDay(d),events=all.filter(function(a){return a.date===day;});
          return h('div',{key:day,className:'rh-calendar-cell'+(day===today?' is-today':'')+(d.getMonth()!==current.getMonth()&&mode==='month'?' is-outside':'')},
            h('button',{className:'rh-calendar-day',onClick:function(){setFocus(day);},'aria-pressed':day===focus,
              title:'Ver citas del '+day},d.getDate()),
            events.slice(0,mode==='week'?8:3).map(function(a){
              return h('button',{key:a.id,className:'rh-calendar-event'+(!rhAppointmentActive(a)?' is-done':''),
                title:(a.reason||a.doctor||'Cita')+' · '+(patient(a)?.name||''),
                onClick:function(){openA(a);}},
                h('span',null,a.time?a.time+' · ':'',a.reason||a.specialty||a.doctor||'Cita'),
                h('small',null,patient(a)?.name||'')
              );
            }),
            events.length>(mode==='week'?8:3)&&h('small',{className:'rh-cal-more'},'+'+(events.length-(mode==='week'?8:3))+' más')
          );
        })
      ),
      h('section',{className:'rh-board-calendar-day-panel','aria-label':'Citas del día seleccionado'},
        h('div',{className:'rh-board-panel-head'},
          h('h2',null,rhCalDate(focus).toLocaleDateString('es-CR',{weekday:'long',day:'numeric',month:'long'})),
          h('button',{onClick:function(){if(p.setDraftDate)p.setDraftDate(focus);p.sm('add-apt');}},'+ Agregar cita')
        ),
        selectedEvents.length?selectedEvents.map(function(a){
          return h('button',{className:'rh-board-cal-item',key:a.id,onClick:function(){openA(a);}},
            h('span',{className:'rh-board-cal-time'},a.time?fmtT(a.time):'Sin hora'),
            h('span',{className:'rh-board-cal-color','aria-hidden':true}),
            h('span',{className:'rh-board-cal-text'},h('strong',null,a.reason||a.specialty||a.doctor||'Cita médica'),
              h('small',null,[patient(a)?.name,a.clinic].filter(Boolean).join(' · '))),
            h('span',{className:'rh-board-cal-state'},rhAppointmentLabel(a)),
            h('span',{'aria-hidden':true},'›')
          );
        }):h('p',{className:'rh-board-cal-empty'},'No hay citas registradas en esta fecha.')
      ),
      h('p',{className:'rh-cal-hint'},'Selecciona un día para consultar sus citas; usa «Agregar cita» para programar una nueva.')
    )
  );
}

function LegacyApptsList(p){
  var store=p.store,sm=p.sm,tab=p.tab,stab=p.stab,ssa=p.ssa;
  var qs=useState('');var q=qs[0],sq=qs[1];
  var filtered=store.appointments.filter(function(a){return tab==='pending'?rhAppointmentActive(a):tab==='cancelled'?rhAppointmentStatus(a)==='cancelled':rhAppointmentStatus(a)==='completed';}).sort(function(a,b){return tab==='pending'?new Date(a.date)-new Date(b.date):new Date(b.date)-new Date(a.date);});
  var gp=function(id){return store.patients.find(function(x){return x.id===id;})||null;};
  var shown=filtered.filter(function(a){if(!q)return true;var pt=gp(a.patientId);return [a.doctor,a.reason,a.specialty,a.clinic,pt&&pt.name].some(function(t){return String(t||'').toLowerCase().includes(q.toLowerCase());});});
  return h('div',null,
    h('div',{className:'ph'},
      h('div',{style:{display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}},
        h('div',{className:'tab-group',style:{flex:'none'}},
          h('button',{className:'tab-btn'+(tab==='pending'?' on':''),onClick:function(){stab('pending');}},'Pendientes ('+store.appointments.filter(rhAppointmentActive).length+')'),
          h('button',{className:'tab-btn'+(tab==='attended'?' on':''),onClick:function(){stab('attended');}},'Realizadas ('+store.appointments.filter(function(a){return rhAppointmentStatus(a)==='completed';}).length+')'),
          h('button',{className:'tab-btn'+(tab==='cancelled'?' on':''),onClick:function(){stab('cancelled');}},'Canceladas ('+store.appointments.filter(function(a){return rhAppointmentStatus(a)==='cancelled';}).length+')')
        ),
        h('div',{className:'srch',style:{flex:1,minWidth:160}},h('span',{className:'srch-ico'},h(Ic,{n:'search',s:14,c:'var(--text3)'})),h('input',{value:q,onChange:function(e){sq(e.target.value);},placeholder:'Buscar...'}))
      )
    ),
    shown.length===0
      ?h('div',{className:'empty su'},h('div',{className:'empty-ico'},h(Ic,{n:'calendar',s:20,c:'var(--text3)'})),h('p',{style:{fontWeight:700,color:'var(--text2)',marginBottom:3}},'Sin citas'),h('p',{style:{fontSize:'.8rem'}},tab==='pending'?'No hay pendientes':tab==='cancelled'?'No hay canceladas':'No hay realizadas'))
      :shown.map(function(apt,i){
          var pt=gp(apt.patientId),d=du(apt.date),isT=d===0,urg=d!==null&&d<=3&&d>=0&&!apt.attended;
          var ac=isT?'var(--red)':urg?'var(--amber)':'var(--accent)';
          var aptIni=apt.doctor?apt.doctor.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase():'Dr';
          return h('div',{key:apt.id,className:'apt-row su d'+Math.min(i+1,5),style:{borderLeft:'3px solid '+(apt.attended?'var(--border)':ac)},onClick:function(){ssa(apt);sm('view-apt');}},
            h('div',{className:'apt-time'},apt.time?h('span',null,fmtT(apt.time).split(' ')[0],h('br'),h('span',{style:{fontSize:'.58rem'}},fmtT(apt.time).split(' ')[1])):null),
            h('div',{className:'apt-avatar'},aptIni),
            h('div',{style:{flex:1,minWidth:0}},
              h('p',{style:{fontWeight:700,fontSize:'.875rem',marginBottom:2}},apt.doctor?'Dr. '+apt.doctor:(apt.reason||'Cita médica')),
              apt.specialty&&h('p',{style:{fontSize:'.7rem',color:'var(--accent)',fontWeight:700,marginBottom:2}},apt.specialty),
              h('p',{style:{fontSize:'.72rem',color:'var(--text2)'}},fmtD(apt.date)+(apt.clinic?' \u00b7 '+apt.clinic:''))
            ),
            h('div',{style:{display:'flex',flexDirection:'column',gap:4,alignItems:'flex-end'}},
              pt&&h('div',{style:{display:'flex',alignItems:'center',gap:5}},h('div',{className:'av',style:{width:18,height:18,fontSize:'.52rem'}},pt.avatar?h('img',{src:pt.avatar,style:{width:'100%',height:'100%',objectFit:'cover'}}):ini(pt.name)),h('span',{style:{fontSize:'.7rem',color:'var(--text2)',fontWeight:600,maxWidth:65,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}},pt.name)),
              rhAppointmentStatus(apt)==='completed'?h('span',{className:'chip chip-green'},'\u2713'):rhAppointmentStatus(apt)==='cancelled'?h('span',{className:'chip chip-gray'},'Cancelada'):isT?h('span',{className:'chip chip-red'},'HOY'):d!==null&&!apt.attended?h('span',{className:'chip',style:{background:ac+'15',color:ac,fontSize:'.68rem',fontWeight:800}},d+'d'):null,
              rhAppointmentActive(apt)&&h('button',{className:'btn',style:{padding:'4px 10px',borderRadius:'var(--r-full)',background:'var(--green-bg)',color:'var(--green)',fontSize:'.68rem',fontWeight:700,border:'1px solid var(--green-border)',marginTop:2},onClick:function(e){e.stopPropagation();store.setAppointments(function(arr){return arr.map(function(a){return a.id===apt.id?xt(a,{attended:true,status:'completed'}):a;});});}},'\u2713 Asisti')
            )
          );
        })
  );
}

// ── MEDICATIONS ────────────────────────────────────────────────────────────
function MedsView(p){
  var store=p.store,sm=p.sm,ssm=p.ssm;
  var fstate=useState('all'),filter=fstate[0],setFilter=fstate[1];
  var displayed=store.medications.filter(function(m){return filter==='all'||(m.status||'active')===(filter==='active'?'active':filter==='paused'?'paused':'completed');});
  var grouped={};
  displayed.forEach(function(m){if(!grouped[m.patientId])grouped[m.patientId]=[];grouped[m.patientId].push(m);});
  return h('div',null,
    h('div',{className:'ph',style:{display:'flex',justifyContent:'space-between',alignItems:'flex-end'}},
      h('div',null,h('p',{className:'ph-sub'},'Tratamientos'),h('h1',{className:'ph-title'},'Medicamentos')),
      h('button',{className:'btn btn-primary',style:{borderRadius:'var(--r-full)',padding:'9px 16px',fontSize:'.8rem'},onClick:function(){sm('add-med');}},h(Ic,{n:'plus',s:14,c:'white'}),'Agregar')
    ),
    h('div',{className:'rh-board-med-filters',role:'group','aria-label':'Filtrar tratamientos'},
      [['all','Todos'],['active','Activos'],['paused','Pausados'],['completed','Finalizados']].map(function(v){
        return h('button',{key:v[0],className:filter===v[0]?'active':'',
          onClick:function(){setFilter(v[0]);},'aria-pressed':filter===v[0]},v[1]);
      })
    ),
    displayed.length===0
      ?h('div',{className:'empty su'},h('div',{className:'empty-ico'},h(Ic,{n:'pill',s:20,c:'var(--text3)'})),h('p',{style:{fontWeight:700,color:'var(--text2)',marginBottom:3}},filter==='all'?'Sin medicamentos':'Sin tratamientos en esta categoría'),h('p',{style:{fontSize:'.8rem'}},'Puedes cambiar el filtro o agregar un medicamento.'))
      :h('div',null,Object.keys(grouped).map(function(pid,gi){
          var pt=store.patients.find(function(x){return x.id===pid;});if(!pt)return null;
          return h('div',{key:pid,className:'su d'+Math.min(gi+1,5),style:{marginBottom:20}},
            h('div',{style:{display:'flex',alignItems:'center',gap:8,marginBottom:9,paddingBottom:8,borderBottom:'1px solid var(--border)'}},
              h('div',{className:'av',style:{width:24,height:24,fontSize:'.58rem'}},pt.avatar?h('img',{src:pt.avatar,style:{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}):ini(pt.name)),
              h('p',{style:{fontSize:'.72rem',fontWeight:800,color:'var(--text2)',textTransform:'uppercase',letterSpacing:'.06em'}},'Medicamentos de '+pt.name),
              h('span',{className:'chip chip-gray',style:{marginLeft:'auto'}},grouped[pid].length)
            ),
            grouped[pid].map(function(med){return h(MedCard,{key:med.id,med:med,store:store,onEdit:function(){ssm(med);sm('edit-med');}});})
          );
        }))
  );
}
function MedCard(p){
  var med=p.med,store=p.store,onEdit=p.onEdit;
  var es=useState(false),exp=es[0],setExpanded=es[1];
  var logs=(store.doseLogs||[]).filter(function(x){return x.medicationId===med.id;}).sort(function(a,b){return b.at.localeCompare(a.at);});
  var today=rhCalDay(new Date()),count=logs.filter(function(x){return x.status!=='missed'&&rhCalDay(new Date(x.at))===today;}).length;
  var missed=logs.filter(function(x){return x.status==='missed'&&rhCalDay(new Date(x.at))===today;}).length;
  var times=String(med.doseTimes||'').split(',').map(function(v){return v.trim();}).filter(function(v){return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);});
  var stock=med.stockQty!==''&&med.stockQty!==undefined&&med.stockQty!==null?Number(med.stockQty):null;
  var threshold=med.stockThreshold!==''&&med.stockThreshold!==undefined&&med.stockThreshold!==null?Number(med.stockThreshold):null;
  var pct=med.totalDays&&med.startDate?Math.max(0,Math.min(100,Math.round(Math.floor((new Date()-new Date(med.startDate))/86400000)/Number(med.totalDays)*100))):null;
  function recordDose(e){
    e.stopPropagation();
    if(med.status==='paused'||med.status==='completed')return;
    if(logs.length&&Date.now()-new Date(logs[0].at).getTime()<90000){window.alert('Ya registraste una dosis hace un momento.');return;}
    store.setDoseLogs(function(arr){return arr.concat([{id:uid(),medicationId:med.id,patientId:med.patientId,at:new Date().toISOString(),status:'taken'}]);});
  }
  function recordMissed(e){
    e.stopPropagation();
    if(med.status==='paused'||med.status==='completed')return;
    if(!confirm('¿Registrar una dosis omitida? Esto no significa que se haya administrado.'))return;
    store.setDoseLogs(function(arr){return arr.concat([{id:uid(),medicationId:med.id,patientId:med.patientId,at:new Date().toISOString(),status:'missed'}]);});
  }
  function undo(e){e.stopPropagation();if(!logs.length||!confirm('¿Eliminar el último registro de dosis?'))return;
    store.setDoseLogs(function(arr){return arr.filter(function(x){return x.id!==logs[0].id;});});
  }
  function del(e){e.stopPropagation();if(!confirm('¿Eliminar el medicamento y sus registros de dosis?'))return;
    store.setMedications(function(arr){return arr.filter(function(x){return x.id!==med.id;});});
    store.setDoseLogs(function(arr){return arr.filter(function(x){return x.medicationId!==med.id;});});
  }
  return h('div',{className:'med-card',onClick:function(){setExpanded(!exp);}},
    h('div',{className:'rh-med-top'},
      h('div',{className:'rh-board-med-card-heading'},
        h('span',{className:'rh-board-med-pill-icon'},h(Ic,{n:'pill',s:19,c:'currentColor'})),
        h('div',null,h('strong',null,med.name),
          h('p',null,[med.dosage,med.frequency].filter(Boolean).join(' · ')))),
      h('span',{className:'chip '+(med.status==='completed'?'chip-gray':med.status==='paused'?'chip-amber':'chip-green')},
        med.status==='completed'?'Finalizado':med.status==='paused'?'Pausado':'Activo')
    ),
    pct!==null&&h('div',{className:'prog-bar',style:{marginTop:10}},h('div',{className:'prog-fill',style:{width:pct+'%'}})),
    h('div',{className:'rh-dose-actions'},
      h('span',null,count+' dosis registrada'+(count===1?'':'s')+' hoy'),
      h('button',{className:'rh-dose-btn',onClick:recordDose,disabled:med.status==='completed'||med.status==='paused'},
        h(Ic,{n:'check',s:14,c:'currentColor'}),' Registrar dosis')
    ),
    exp&&h('div',{className:'rh-med-expanded',onClick:function(e){e.stopPropagation();}},
      times.length>0&&h('div',{className:'rh-med-schedule'},
        h('strong',null,'Horarios registrados'),
        h('span',null,times.join(' · ')),
        h('small',null,'Horarios informativos; esta página no envía alertas cuando está cerrada.')
      ),
      stock!==null&&Number.isFinite(stock)&&h('div',{className:'rh-med-inventory'},
        h('span',null,'Cantidad disponible: ',h('strong',null,stock)),
        threshold!==null&&stock<=threshold&&h('span',{className:'rh-med-low'},' Revisar reposición')
      ),
      h('button',{className:'rh-med-missed',onClick:recordMissed,disabled:med.status==='paused'||med.status==='completed'},'Registrar dosis omitida'),
      med.notes&&h('p',{className:'rh-med-notes'},med.notes),
      med.prescriptionImg&&h('img',{src:med.prescriptionImg,style:{width:'100%',maxHeight:170,objectFit:'cover',borderRadius:9}}),
      h('h4',null,'Registro de dosis ('+logs.length+') · '+count+' administrada(s) y '+missed+' omitida(s) hoy'),
      logs.slice(0,6).map(function(x,i){return h('div',{className:'rh-dose-line',key:x.id},
        h('span',null,(x.status==='missed'?'Omitida · ':'Administrada · ')+new Date(x.at).toLocaleString('es-CR',{dateStyle:'medium',timeStyle:'short'})),
        i===0&&h('button',{onClick:undo},'Deshacer')
      );}),
      !logs.length&&h('p',{className:'rh-med-notes'},'Sin dosis registradas.'),
      h('div',{className:'rh-med-actions'},
        h('button',{className:'rh-mini-btn',onClick:function(){onEdit();}},h(Ic,{n:'edit',s:14,c:'currentColor'}),' Editar'),
        h('button',{className:'rh-mini-btn',onClick:del},h(Ic,{n:'trash',s:14,c:'currentColor'}),' Eliminar')
      )
    )
  );
}

// ── SETTINGS ───────────────────────────────────────────────────────────────
// Copias de seguridad locales cifradas, independientes de servicios externos.
function rhToB64(bytes){
  var chunks=[];
  for(var i=0;i<bytes.length;i+=8192)chunks.push(String.fromCharCode.apply(null,bytes.subarray(i,i+8192)));
  return btoa(chunks.join(''));
}
function rhFromB64(str){
  if(typeof str!=='string'||str.length>26000000||!/^[A-Za-z0-9+/]*={0,2}$/.test(str))throw Error('Archivo inválido');
  var raw=atob(str),out=new Uint8Array(raw.length);
  for(var i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);
  return out;
}
async function rhDeriveBackupKey(password,salt){
  var base=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:250000,hash:'SHA-256'},
    base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
function rhBackupPayload(user){
  var patients=lsg(uk(user,'p'))||[];
  var raw=lsg(uk(user,'records'))||{},records={};
  patients.forEach(function(p){if(p&&typeof p.id==='string'&&Object.prototype.hasOwnProperty.call(raw,p.id)){records[p.id]=raw[p.id];}});
  return {
    app:'rodme-health',version:1,createdAt:new Date().toISOString(),
    data:{
      p:patients,
      a:lsg(uk(user,'a'))||[],
      m:lsg(uk(user,'m'))||[],
      d:lsg(uk(user,'d'))||[],
      labs:lsg(uk(user,'labs'))||[],
      vaccines:lsg(uk(user,'vaccines'))||[],
      docs:lsg(uk(user,'docs'))||[],
      vitals:lsg(uk(user,'vitals'))||[],
      symptoms:lsg(uk(user,'symptoms'))||[],
      followups:lsg(uk(user,'followups'))||[],
      prefs:lsg(uk(user,'prefs'))||{},
      rec:lsg(uk(user,'rec'))||{},
      records:records
    }
  };
}
function rhValidateBackup(data){
  if(!data||data.app!=='rodme-health'||data.version!==1||!data.data||typeof data.data!=='object')throw Error('El archivo no es una copia compatible');
  ['p','a','m','d'].forEach(function(k){if(!Array.isArray(data.data[k])||data.data[k].length>20000)throw Error('Datos inválidos: '+k);});
  ['labs','vaccines','docs','vitals','symptoms','followups'].forEach(function(k){
    if(data.data[k]===undefined)data.data[k]=[];
    if(!Array.isArray(data.data[k])||data.data[k].length>5000)throw Error('Registros inválidos: '+k);
  });
  ['prefs','rec'].forEach(function(k){var v=data.data[k];if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Datos inválidos: '+k);});
  if(data.data.records!==undefined&&(!data.data.records||typeof data.data.records!=='object'||Array.isArray(data.data.records)))throw Error('Expedientes incompatibles');
  if(data.data.records){Object.keys(data.data.records).forEach(function(pid){
    if(!data.data.p.some(function(p){return p.id===pid}))throw Error('Expediente sin paciente');
    var v=data.data.records[pid];if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Expediente inválido');
  });}
  // Verificar asociaciones antes de restaurar.
  var patientIds=new Set();
  data.data.p.forEach(function(v){if(!v||typeof v.id!=='string'||!v.id||typeof v.name!=='string')throw Error('Paciente inválido');patientIds.add(v.id);});
  data.data.a.forEach(function(v){if(!v||typeof v.id!=='string'||!v.id||typeof v.date!=='string'||typeof v.patientId!=='string'||!patientIds.has(v.patientId))throw Error('Cita inválida');});
  var medIds=new Set();
  data.data.m.forEach(function(v){if(!v||typeof v.id!=='string'||!v.id||typeof v.name!=='string'||!patientIds.has(v.patientId))throw Error('Medicamento inválido');medIds.add(v.id);});
  data.data.d.forEach(function(v){if(!v||typeof v.id!=='string'||typeof v.at!=='string'||!medIds.has(v.medicationId))throw Error('Registro de dosis inválido');});
  ['vitals','symptoms','followups'].forEach(function(k){data.data[k].forEach(function(v){
    if(!v||typeof v.id!=='string'||!v.id||!patientIds.has(v.patientId)||typeof v.date!=='string'||!/^20\d\d-\d\d-\d\d$/.test(v.date))throw Error('Registro de seguimiento inválido: '+k);
    if(k==='vitals'&&(!['weight','pressure','glucose','oxygen','pulse','temperature'].includes(v.metric)||!Number.isFinite(Number(v.value))||
      (v.value2!==undefined&&v.value2!==''&&!Number.isFinite(Number(v.value2)))))throw Error('Signos vitales incompatibles');
    if(k==='symptoms'&&typeof v.title!=='string')throw Error('Síntoma incompatible');
    if(k==='followups'&&typeof v.title!=='string')throw Error('Pendiente incompatible');
  });});
  ['labs','vaccines','docs'].forEach(function(k){data.data[k].forEach(function(v){
    if(!v||typeof v.id!=='string'||!v.id||typeof v.title!=='string'||!v.title||
      !patientIds.has(v.patientId)||typeof v.date!=='string')throw Error('Registro inválido: '+k);
    if(k==='docs'&&v.fileData&&(!/^data:(image\/jpeg|image\/png|image\/webp|application\/pdf);base64,/.test(v.fileData)||
      v.fileData.length>900000))throw Error('Adjunto incompatible');
  });});
  return data.data;
}
function BackupPanel(p){
  var passState=useState(''),password=passState[0],setPassword=passState[1];
  var againState=useState(''),again=againState[0],setAgain=againState[1];
  var fileState=useState(null),file=fileState[0],setFile=fileState[1];
  var statusState=useState(''),status=statusState[0],setStatus=statusState[1];
  var busyState=useState(false),busy=busyState[0],setBusy=busyState[1];
  var modeState=useState('export'),mode=modeState[0],setMode=modeState[1];
  var lastExport=lsg(uk(p.user,'last_backup_export'));
  async function exportBackup(){
    if(busy)return;
    if(!window.crypto||!crypto.subtle){setStatus('Este navegador no admite copias cifradas.');return;}
    if(password.length<10){setStatus('Elige una contraseña de al menos 10 caracteres.');return;}
    if(password!==again){setStatus('Las contraseñas no coinciden.');return;}
    setBusy(true);setStatus('');
    try{
      var salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
      var key=await rhDeriveBackupKey(password,salt);
      var plaintext=new TextEncoder().encode(JSON.stringify(rhBackupPayload(p.user)));
      var encrypted=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv:iv},key,plaintext));
      // Verify that the encrypted archive can be decrypted and validated
      // before making it available for download.
      var verified=await crypto.subtle.decrypt({name:'AES-GCM',iv:iv},key,encrypted);
      var verifiedPayload=JSON.parse(new TextDecoder().decode(verified));
      rhValidateBackup(verifiedPayload);
      var wrapper={format:'rodme-health-encrypted',version:1,kdf:'PBKDF2-SHA256',iterations:250000,
        cipher:'AES-256-GCM',createdAt:new Date().toISOString(),
        salt:rhToB64(salt),iv:rhToB64(iv),payload:rhToB64(encrypted)};
      rhDownload(JSON.stringify(wrapper,null,2),'rodme-backup-'+rhCalDay(new Date())+'.rhbackup','application/json');
      lss(uk(p.user,'last_backup_export'),new Date().toISOString());
      setStatus('Copia cifrada descargada. Guarda la contraseña en un lugar seguro: no podremos recuperarla.');
      setPassword('');setAgain('');
    }catch(e){setStatus('No se pudo generar la copia. Comprueba el espacio disponible y los permisos del navegador.');}
    finally{setBusy(false);}
  }
  async function restore(){
    if(busy)return;
    if(!file||!password){setStatus('Selecciona un archivo y escribe su contraseña.');return;}
    if(file.size>19000000){setStatus('El archivo supera el límite de 19 MB.');return;}
    if(!window.crypto||!crypto.subtle){setStatus('Este navegador no permite descifrar la copia.');return;}
    setBusy(true);setStatus('');
    try{
      var envelope=JSON.parse(await file.text());
      if(!envelope||envelope.format!=='rodme-health-encrypted'||envelope.version!==1||
        envelope.cipher!=='AES-256-GCM'||envelope.iterations!==250000)throw Error('Formato no compatible');
      var salt=rhFromB64(envelope.salt),iv=rhFromB64(envelope.iv);
      if(salt.length!==16||iv.length!==12)throw Error('Parámetros inválidos');
      var key=await rhDeriveBackupKey(password,salt);
      var plaintext=await crypto.subtle.decrypt({name:'AES-GCM',iv:iv},key,rhFromB64(envelope.payload));
      var payload=JSON.parse(new TextDecoder().decode(plaintext)),data=rhValidateBackup(payload);data.records=data.records||{};
      if(!window.confirm('La restauración reemplazará los registros de este espacio en este navegador. ¿Ya guardaste una copia de los datos actuales y deseas continuar?')){setStatus('Restauración cancelada; no se cambió ningún dato.');return;}
      var keys=['p','a','m','d','labs','vaccines','docs','vitals','symptoms','followups','prefs','rec','records'],old={};
      keys.forEach(function(k){old[k]=localStorage.getItem(uk(p.user,k));});
      try{keys.forEach(function(k){localStorage.setItem(uk(p.user,k),JSON.stringify(data[k]));});}
      catch(e){
        keys.forEach(function(k){try{if(old[k]===null)localStorage.removeItem(uk(p.user,k));else localStorage.setItem(uk(p.user,k),old[k]);}catch(ignored){}});
        throw Error('No hay suficiente espacio para restaurar los registros');
      }
      setPassword('');setAgain('');window.alert('Copia restaurada correctamente.');window.location.reload();
    }catch(e){
      setStatus(e.name==='OperationError'?'Contraseña incorrecta o archivo dañado.':(e.message||'No se pudo leer la copia.'));
    }finally{setBusy(false);}
  }
  function switchMode(m){setMode(m);setStatus('');setPassword('');setAgain('');}
  return h('section',{className:'rh-backup-panel'},
    h('div',{className:'rh-backup-title'},h(Ic,{n:'shield',s:19,c:'var(--accent)'}),
      h('div',null,h('h2',null,'Copias de seguridad'),h('p',null,'Protege tus registros con una copia cifrada y recuperable.'),
        h('p',{className:'rh-backup-last'},lastExport
          ?'Última exportación iniciada: '+new Date(lastExport).toLocaleDateString('es-CR')+
            ' (comprueba que guardaste el archivo).'
          :'Todavía no hay una exportación registrada en este navegador.'))),
    h('div',{className:'rh-backup-tabs',role:'group','aria-label':'Copia o restauración'},
      h('button',{className:mode==='export'?'active':'',onClick:function(){switchMode('export');}},'Guardar copia'),
      h('button',{className:mode==='import'?'active':'',onClick:function(){switchMode('import');}},'Restaurar copia')
    ),
    mode==='export'?h('p',{className:'rh-backup-description'},'Descarga un archivo cifrado con pacientes, expedientes, citas, tratamientos, signos vitales, síntomas, seguimientos, laboratorios, vacunas, documentos y preferencias. La copia se comprueba mediante descifrado antes de descargarla. No se envía a ningún servidor.')
      :h('p',{className:'rh-backup-description'},'Selecciona un archivo .rhbackup generado en Rodme Health. Antes de reemplazar información se solicitará confirmación.'),
    mode==='import'&&h('label',{className:'rh-backup-field'},h('span',null,'Archivo de copia'),
      h('input',{type:'file',accept:'.rhbackup,application/json',onChange:function(e){setFile(e.target.files&&e.target.files[0]||null);setStatus('');}})),
    h('label',{className:'rh-backup-field'},h('span',null,mode==='export'?'Contraseña para cifrar':'Contraseña de la copia'),
      h('input',{type:'password',autoComplete:'new-password',value:password,onChange:function(e){setPassword(e.target.value);setStatus('');},
        placeholder:mode==='export'?'Mínimo 10 caracteres':'Contraseña del archivo'})),
    mode==='export'&&h('label',{className:'rh-backup-field'},h('span',null,'Repetir contraseña'),
      h('input',{type:'password',value:again,onChange:function(e){setAgain(e.target.value);setStatus('');},placeholder:'Repetir contraseña'})),
    status&&h('p',{className:'rh-backup-message',role:'status'},status),
    h('button',{className:'rh-backup-main',disabled:busy,onClick:mode==='export'?exportBackup:restore},
      busy?'Procesando…':mode==='export'?'Descargar copia cifrada':'Restaurar desde archivo'),
    h('p',{className:'rh-backup-foot'},'Sin la contraseña no es posible recuperar la copia. Estos archivos contienen información privada: guárdalos en un lugar protegido.')
  );
}

// Centro de registros de salud: entradas locales por paciente, nunca se envían al servidor.
// Seguimiento individual: valores capturados manualmente, sin diagnóstico automático.
var RH_METRICS=[
  {id:'pressure',label:'Presión arterial',unit:'mmHg',secondary:'Diastólica',min:1,max:400},
  {id:'glucose',label:'Glucosa',unit:'mg/dL',min:1,max:1500},
  {id:'weight',label:'Peso',unit:'kg',min:0.1,max:700},
  {id:'temperature',label:'Temperatura',unit:'°C',min:20,max:50},
  {id:'oxygen',label:'Oxígeno',unit:'%',min:0,max:100},
  {id:'pulse',label:'Frecuencia cardíaca',unit:'lpm',min:1,max:300}
];
function rhPendingList(store,patientId){
  var today=rhCalDay(new Date()),result=[],name=function(pid){var p=(store.patients||[]).find(function(x){return x.id===pid;});return p?p.name:'Paciente';};
  function include(item){if(!patientId||patientId==='all'||item.patientId===patientId)result.push(item);}
  (store.followups||[]).forEach(function(f){if(f.status==='done')return;
    include({id:'f'+f.id,kind:'followup',patientId:f.patientId,title:f.title,date:f.dueDate||f.date,detail:'Seguimiento · '+name(f.patientId),source:f});});
  (store.labs||[]).forEach(function(x){if(x.status==='reviewed')return;
    include({id:'l'+x.id,kind:'lab',patientId:x.patientId,title:x.title,date:x.date,
      detail:(x.status==='done'?'Resultado pendiente de revisión':'Laboratorio pendiente')+' · '+name(x.patientId),source:x});});
  (store.vaccines||[]).forEach(function(x){if(!x.nextDate)return;
    include({id:'v'+x.id,kind:'vaccine',patientId:x.patientId,title:x.title,date:x.nextDate,detail:'Próxima vacuna · '+name(x.patientId),source:x});});
  (store.appointments||[]).forEach(function(x){if(!rhAppointmentActive(x)||x.date<today)return;
    if(rhAppointmentStatus(x)==='confirmed')return;
    include({id:'a'+x.id,kind:'appointment',patientId:x.patientId,title:x.reason||x.specialty||'Cita médica',date:x.date,detail:'Confirmar cita · '+name(x.patientId),source:x});});
  return result.sort(function(a,b){return String(a.date||'9999').localeCompare(String(b.date||'9999'));});
}
function rhSparkline(points,second){
  if(points.length<2)return null;
  var values=points.map(function(x){return Number(second?x.value2:x.value);}).filter(Number.isFinite);
  if(values.length<2)return null;
  var lo=Math.min.apply(null,values),hi=Math.max.apply(null,values);
  var span=hi-lo||1;
  var coords=values.map(function(v,i){return (11+i*290/(values.length-1)).toFixed(1)+','+(64-(v-lo)/span*48).toFixed(1);}).join(' ');
  return h('svg',{className:'rh-trend-svg',viewBox:'0 0 314 77',role:'img','aria-label':'Tendencia de valores registrados, sin interpretación clínica'},
    h('line',{x1:9,y1:66,x2:305,y2:66,stroke:'var(--border)',strokeWidth:1}),
    h('polyline',{points:coords,fill:'none',stroke:'var(--accent)',strokeWidth:3,strokeLinecap:'round',strokeLinejoin:'round'}));
}
function TrackingView(p){
  var store=p.store,patients=store.patients||[];
  var tabs=[['vitals','Signos vitales'],['symptoms','Síntomas'],['followups','Seguimiento'],['pending','Pendientes']];
  var ts=useState(p.initialTab||'pending'),tab=ts[0],setTab=ts[1];
  var ps=useState(p.initialPatientId||'all'),pid=ps[0],setPid=ps[1];
  var ms=useState('pressure'),metric=ms[0],setMetric=ms[1];
  var es=useState(p.initialAppointmentId?'new':null),editing=es[0],setEditing=es[1];
  var fs=useState(function(){return p.initialAppointmentId?{patientId:p.initialPatientId,date:rhCalDay(new Date()),appointmentId:p.initialAppointmentId,title:'',status:'pending'}:{};}),form=fs[0],setForm=fs[1];
  var ws=useState(''),warning=ws[0],setWarning=ws[1];
  var lists={vitals:store.vitals||[],symptoms:store.symptoms||[],followups:store.followups||[]};
  var setList=tab==='vitals'?store.setVitals:tab==='symptoms'?store.setSymptoms:store.setFollowups;
  var list=tab==='pending'?rhPendingList(store,pid):
    (lists[tab]||[]).filter(function(x){return pid==='all'||x.patientId===pid;})
      .sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''));});
  var selectedMetric=RH_METRICS.find(function(x){return x.id===metric;})||RH_METRICS[0];
  var readings=(store.vitals||[]).filter(function(v){return v.metric===metric&&pid!=='all'&&v.patientId===pid;})
    .sort(function(a,b){return a.date.localeCompare(b.date);}).slice(-15);
  function patientName(id){var pt=patients.find(function(x){return x.id===id;});return pt?pt.name:'Paciente no encontrado';}
  function field(k,label,type,placeholder){
    return h('label',{className:'rh-track-field'},h('span',null,label),
      type==='textarea'?h('textarea',{rows:3,value:form[k]||'',maxLength:2000,placeholder:placeholder||'',onChange:function(e){var value=e.target.value;setForm(function(f){return xt(f,{[k]:value});});}}):
      h('input',{type:type||'text',value:form[k]??'',maxLength:170,placeholder:placeholder||'',onChange:function(e){var value=e.target.value;setForm(function(f){return xt(f,{[k]:value});});}})
    );
  }
  function start(item){
    if(!patients.length){setWarning('Primero agrega un paciente.');return;}
    setWarning('');setEditing(item?item.id:'new');
    if(item)setForm(xt({},item));else setForm({patientId:pid==='all'?patients[0].id:pid,date:rhCalDay(new Date()),
      metric:metric,status:'pending',severity:5});
  }
  function save(){
    var item=xt({},form);
    if(!item.patientId||!patients.some(function(x){return x.id===item.patientId;})||
       !/^20\d\d-\d\d-\d\d$/.test(item.date||'')||
       rhCalDay(rhCalDate(item.date))!==item.date){setWarning('Elige un paciente y una fecha válida.');return;}
    if(tab==='vitals'){
      var cfg=RH_METRICS.find(function(x){return x.id===item.metric;});
      if(!cfg||item.value===''||item.value===undefined||!Number.isFinite(Number(item.value))||
        Number(item.value)<cfg.min||Number(item.value)>cfg.max){setWarning('Revisa el valor de la medición.');return;}
      if(cfg.secondary&&(item.value2===''||item.value2===undefined||!Number.isFinite(Number(item.value2))||
        Number(item.value2)<1||Number(item.value2)>400)){setWarning('Agrega ambos valores de presión arterial.');return;}
      item.value=String(item.value);item.value2=cfg.secondary?String(item.value2):'';
      item.unit=cfg.unit;
    }else if(tab==='symptoms'){
      if(!String(item.title||'').trim()){setWarning('Escribe el síntoma.');return;}
      if(!Number.isInteger(Number(item.severity))||Number(item.severity)<1||Number(item.severity)>10){setWarning('La intensidad debe ser de 1 a 10.');return;}
      item.title=item.title.trim();item.severity=Number(item.severity);
    }else if(tab==='followups'){
      if(!String(item.title||'').trim()){setWarning('Describe el seguimiento pendiente.');return;}
      if(item.appointmentId&&!(store.appointments||[]).some(function(x){return x.id===item.appointmentId&&x.patientId===item.patientId;})){setWarning('La cita seleccionada no corresponde a este paciente.');return;}
      item.title=item.title.trim();item.status=item.status==='done'?'done':'pending';
    }
    item.id=editing==='new'?uid():editing;item.updatedAt=new Date().toISOString();
    setList(function(all){return editing==='new'?all.concat([item]):all.map(function(x){return x.id===editing?item:x;});});
    setEditing(null);setWarning('');
  }
  function remove(item){
    if(!window.confirm('¿Eliminar este registro? No se puede deshacer.'))return;
    setList(function(all){return all.filter(function(x){return x.id!==item.id;});});
  }
  function mark(item,done){
    store.setFollowups(function(all){return all.map(function(x){return x.id===item.id?xt(x,{status:done?'done':'pending'}):x;});});
  }
  function linked(item){
    if(!item.appointmentId)return null;
    var appt=(store.appointments||[]).find(function(x){return x.id===item.appointmentId;});
    return appt?'Cita: '+(appt.reason||appt.specialty||'Consulta')+' · '+fmtD(appt.date):null;
  }
  return h('div',{className:'rh-tracking med1820-section'},
    h('div',{className:'rh-track-head'},
      h('div',null,h('span',{className:'rh-center-kicker'},'HISTORIAL PERSONAL'),h('h1',null,'Seguimiento de salud'),p.onRecords&&h('button',{className:'rh-track-switch',onClick:p.onRecords},'← Laboratorios, vacunas y documentos')),
      tab!=='pending'&&h('button',{className:'rh-mini-btn rh-mini-primary',onClick:function(){start(null);}},'+ Agregar registro')
    ),
    h('div',{className:'rh-track-tabs',role:'group','aria-label':'Tipos de seguimiento'},
      tabs.map(function(t){return h('button',{key:t[0],className:tab===t[0]?'active':'',onClick:function(){setTab(t[0]);setEditing(null);setWarning('');}},t[1]);})
    ),
    h('label',{className:'rh-track-patient'},'Paciente',h('select',{value:pid,onChange:function(e){setPid(e.target.value);}},
      h('option',{value:'all'},'Todos los pacientes'),
      patients.map(function(pt){return h('option',{key:pt.id,value:pt.id},pt.name);})
    )),
    tab==='vitals'&&h('div',{className:'rh-track-trends'},
      h('label',null,'Gráfico de mediciones',h('select',{value:metric,onChange:function(e){setMetric(e.target.value);}},
        RH_METRICS.map(function(m){return h('option',{value:m.id,key:m.id},m.label);})
      )),
      readings.length>=2?rhSparkline(readings):h('p',null,pid==='all'?'Selecciona un paciente para ver su gráfico individual.':'Agrega dos o más mediciones para visualizar la tendencia.'),
      readings.length>=2&&h('p',null,readings.length+' mediciones · Valores registrados, sin interpretación clínica.')
    ),
    warning&&!editing&&h('p',{className:'rh-track-warning',role:'status'},warning),
    h('div',{className:'rh-track-list'},
      list.length?list.map(function(item){
        var source=tab==='pending'?item.source:item;
        var title=tab==='vitals'?(RH_METRICS.find(function(x){return x.id===item.metric;})||RH_METRICS[0]).label:
          tab==='pending'?item.title:item.title;
        var info=tab==='vitals'?item.value+(item.metric==='pressure'?'/'+item.value2:'')+' '+(item.unit||''):
          tab==='symptoms'?'Intensidad '+item.severity+'/10':tab==='pending'?item.detail:
          item.status==='done'?'Completado':'Pendiente';
        var date=tab==='pending'?item.date:item.date;
        return h('article',{className:'rh-track-item',key:(tab==='pending'?item.id:item.id)},
          h('div',{className:'rh-track-item-top'},h('div',null,
            h('span',null,tab==='pending'?item.detail:patientName(item.patientId)),
            h('strong',null,title),
            h('small',null,(date?fmtD(date):'Sin fecha')+' · '+info)
          )),
          (item.notes||item.description)&&h('p',{className:'rh-track-note'},item.notes||item.description),
          tab==='followups'&&linked(item)&&h('button',{className:'rh-track-link rh-track-related',onClick:function(){
            var appt=(store.appointments||[]).find(function(x){return x.id===item.appointmentId;});if(appt&&p.onAppointment)p.onAppointment(appt);
          }},linked(item)+' →'),
          h('div',{className:'rh-track-actions'},
            tab==='followups'&&h('button',{onClick:function(){mark(item,item.status!=='done');}},item.status==='done'?'Reabrir':'Marcar completado'),
            tab==='pending'&&item.kind==='followup'&&h('button',{onClick:function(){mark(source,true);}},'Completar'),
            tab==='pending'&&item.kind!=='followup'&&h('button',{onClick:function(){if(p.onOpenPending)p.onOpenPending(item);}},'Abrir registro'),
            tab!=='pending'&&h('button',{onClick:function(){start(item);}},'Editar'),
            tab!=='pending'&&h('button',{className:'danger',onClick:function(){remove(item);}},'Eliminar')
          )
        );
      }):h('div',{className:'rh-track-empty'},
        h('strong',null,tab==='pending'?'No hay pendientes en esta selección.':'Sin registros todavía.'),
        tab!=='pending'&&h('button',{onClick:function(){start(null);}},'Agregar registro ↗')
      )
    ),
    h('p',{className:'rh-center-footnote'},'Información anotada por el usuario; no reemplaza la evaluación profesional. Los valores se muestran sin clasificar resultados como normales o anormales.'),
    editing&&h(Sheet,{title:editing==='new'?'Nuevo registro':'Editar registro',sub:tabs.find(function(t){return t[0]===tab;})[1],onClose:function(){setEditing(null);setWarning('');}},
      h('div',{className:'rh-track-form'},
        h('label',{className:'rh-track-field'},'Paciente',h('select',{value:form.patientId||'',onChange:function(e){var id=e.target.value;setForm(function(v){return xt(v,{patientId:id,appointmentId:''});});}},
          patients.map(function(x){return h('option',{key:x.id,value:x.id},x.name);})
        )),
        field('date','Fecha','date'),
        tab==='vitals'&&h('label',{className:'rh-track-field'},'Medición',h('select',{value:form.metric||'pressure',onChange:function(e){var value=e.target.value;setForm(function(f){return xt(f,{metric:value,value:'',value2:''});});}},
          RH_METRICS.map(function(x){return h('option',{key:x.id,value:x.id},x.label+' ('+x.unit+')');})
        )),
        tab==='vitals'&&field('value',form.metric==='pressure'?'Sistólica':'Valor','number'),
        tab==='vitals'&&form.metric==='pressure'&&field('value2','Diastólica','number'),
        tab==='symptoms'&&field('title','Síntoma','text','Por ejemplo: dolor de cabeza'),
        tab==='symptoms'&&h('label',{className:'rh-track-field'},'Intensidad percibida (1–10)',h('input',{type:'range',min:1,max:10,value:form.severity||5,onChange:function(e){var x=Number(e.target.value);setForm(function(f){return xt(f,{severity:x});});}}),
          h('strong',null,String(form.severity||5))
        ),
        tab==='symptoms'&&field('duration','Duración (opcional)','text','Ej. 2 horas'),
        tab==='followups'&&field('title','Tarea o indicación posterior','text','Ej. Llevar resultados a consulta'),
        tab==='followups'&&field('dueDate','Fecha límite (opcional)','date'),
        tab==='followups'&&h('label',{className:'rh-track-field'},'Cita relacionada',h('select',{value:form.appointmentId||'',onChange:function(e){var id=e.target.value;setForm(function(v){return xt(v,{appointmentId:id});});}},
          h('option',{value:''},'Sin cita relacionada'),
          (store.appointments||[]).filter(function(a){return a.patientId===form.patientId;})
            .map(function(a){return h('option',{key:a.id,value:a.id},fmtD(a.date)+' · '+(a.reason||a.specialty||'Cita'));})
        )),
        tab==='followups'&&h('label',{className:'rh-track-field'},'Estado',h('select',{value:form.status||'pending',onChange:function(e){var x=e.target.value;setForm(function(v){return xt(v,{status:x});});}},
          h('option',{value:'pending'},'Pendiente'),h('option',{value:'done'},'Completado')
        )),
        field('notes','Observaciones (opcional)','textarea'),
        warning&&h('p',{className:'rh-track-warning',role:'status'},warning),
        h('button',{className:'rh-center-save',onClick:save},'Guardar registro')
      )
    )
  );
}

function HealthCenterView(p){
  var store=p.store,patients=store.patients||[];
  var tabs=[{id:'labs',title:'Laboratorios',icon:'activity'},{id:'vaccines',title:'Vacunas',icon:'shield'},{id:'documents',title:'Documentos',icon:'file'}];
  var ts=useState(p.initialTab||'labs'),tab=ts[0],setTab=ts[1];
  var ps=useState(p.initialPatientId||'all'),pid=ps[0],setPid=ps[1];
  var qs=useState(''),query=qs[0],setQuery=qs[1];
  var os=useState(false),open=os[0],setOpen=os[1];
  var fs=useState({}),form=fs[0],setForm=fs[1];
  var edit=useState(null),editId=edit[0],setEditId=edit[1];
  var notice=useState(''),msg=notice[0],setMsg=notice[1];
  var title=tab==='labs'?'Laboratorios':tab==='vaccines'?'Vacunas':'Documentos';
  var dataset=store[tab]||[];
  var setter=tab==='labs'?store.setLabs:tab==='vaccines'?store.setVaccines:store.setDocuments;
  var matches=dataset.filter(function(e){
    if(pid!=='all'&&e.patientId!==pid)return false;
    var text=[e.title,e.name,e.provider,e.notes,e.date,e.unit,e.value].join(' ').toLowerCase();
    return !query||text.includes(query.trim().toLowerCase());
  }).sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''));});
  function patientName(id){var pt=patients.find(function(v){return v.id===id;});return pt?pt.name:'Paciente no encontrado';}
  function field(key,label,type,placeholder){
    return h('label',{className:'rh-center-field'},h('span',null,label),
      type==='textarea'?h('textarea',{rows:2,value:form[key]||'',placeholder:placeholder||'',maxLength:1500,
        onChange:function(e){var v=e.target.value;setForm(function(f){return xt(f,{[key]:v});});}}):
        h('input',{type:type||'text',value:form[key]||'',placeholder:placeholder||'',maxLength:180,
          onChange:function(e){var v=e.target.value;setForm(function(f){return xt(f,{[key]:v});});}})
    );
  }
  function newEntry(){if(!patients.length){setMsg('Primero agrega un paciente desde la sección Pacientes.');return;}
    setForm({patientId:pid!=='all'?pid:patients[0].id,date:rhCalDay(new Date()),status:tab==='labs'?'pending':'recorded'});
    setEditId(null);setMsg('');setOpen(true);
  }
  function startEdit(item){setForm(xt({},item));setEditId(item.id);setMsg('');setOpen(true);}
  function saveEntry(){
    var f=xt({},form),label=(f.title||'').trim();
    if(!label||!f.patientId||!f.date||!patients.some(function(pt){return pt.id===f.patientId;})){
      setMsg('Selecciona paciente, nombre y fecha.');return;
    }
    if(label.length>130){setMsg('El nombre supera el límite permitido.');return;}
    f.title=label;
    if(tab==='labs'){
      if(f.value&&!f.unit){setMsg('Indica la unidad del resultado, si corresponde.');return;}
      if(f.value&&!Number.isFinite(Number(f.value))){setMsg('El resultado numérico no es válido.');return;}
    }
    if(f.appointmentId&&!(store.appointments||[]).some(function(a){return a.id===f.appointmentId&&a.patientId===f.patientId;})){
      setMsg('La cita vinculada no pertenece al paciente seleccionado.');return;
    }
    if(tab==='documents'&&!f.fileData)f.fileData='';
    f.id=editId||uid();f.kind=tab;f.updatedAt=new Date().toISOString();
    setter(function(list){return editId?list.map(function(v){return v.id===editId?f:v;}):list.concat([f]);});
    setOpen(false);setEditId(null);setForm({});setMsg('');
  }
  function removeEntry(item){
    if(!confirm('¿Eliminar este registro de '+title.toLowerCase()+'? Esta acción no se puede deshacer.'))return;
    setter(function(list){return list.filter(function(v){return v.id!==item.id;});});
  }
  function readAttachment(event){
    var file=event.target.files&&event.target.files[0];if(!file)return;
    if(!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type)||file.size>600000){
      setMsg('Adjunta solo PDF, JPG, PNG o WebP de hasta 600 KB.');return;
    }
    var reader=new FileReader();
    reader.onload=function(){
      if(typeof reader.result!=='string'||!/^data:(image\/jpeg|image\/png|image\/webp|application\/pdf);base64,/.test(reader.result))return;
      setForm(function(v){return xt(v,{fileData:reader.result,fileName:file.name.replace(/[^\w .()áéíóúÁÉÍÓÚñÑ-]/g,'').slice(0,95)});});
      setMsg('');
    };
    reader.onerror=function(){setMsg('No se pudo leer el archivo.');};
    reader.readAsDataURL(file);
  }
  function downloadEntry(item){
    if(!item.fileData||!/^data:(image\/jpeg|image\/png|image\/webp|application\/pdf);base64,/.test(item.fileData))return;
    var a=document.createElement('a');a.href=item.fileData;a.download=(item.fileName||'documento').replace(/[\/\\]/g,'');
    document.body.appendChild(a);a.click();a.remove();
  }
  function trend(item){
    if(tab!=='labs'||!item.value||!item.unit)return null;
    var previous=dataset.filter(function(x){return x.id!==item.id&&x.patientId===item.patientId&&
      String(x.title||'').toLowerCase()===String(item.title||'').toLowerCase()&&x.unit===item.unit&&
      x.value!==''&&x.value!==undefined&&x.date<item.date&&Number.isFinite(Number(x.value));})
      .sort(function(a,b){return b.date.localeCompare(a.date);})[0];
    if(!previous)return null;
    var delta=Number(item.value)-Number(previous.value);
    return h('small',{className:'rh-center-compare'},'Comparación anterior: '+(delta>0?'+':'')+delta.toLocaleString('es-CR')+
      ' '+item.unit+' (respecto al '+fmtD(previous.date)+'). Sin interpretación clínica.');
  }
  return h('div',{className:'rh-center med1820-section'},
    h('div',{className:'rh-center-header'},
      h('div',null,h('span',{className:'rh-center-kicker'},'REGISTROS POR PACIENTE'),h('h1',null,'Centro de salud')),
      h('div',{className:'rh-center-head-actions'},p.onTracking&&h('button',{className:'rh-mini-btn',onClick:p.onTracking},'Signos vitales y seguimiento →'),h('button',{className:'rh-mini-btn rh-mini-primary',onClick:newEntry},h(Ic,{n:'plus',s:16,c:'currentColor'}),' Nuevo registro'))
    ),
    h('div',{className:'rh-center-tabs',role:'group','aria-label':'Tipo de registro'},
      tabs.map(function(t){return h('button',{key:t.id,className:tab===t.id?'active':'',onClick:function(){setTab(t.id);setOpen(false);setMsg('');}},
        h(Ic,{n:t.icon,s:16,c:'currentColor'}),t.title,
        h('span',null,(store[t.id]||[]).length)
      );})
    ),
    h('div',{className:'rh-center-toolbar'},
      h('label',null,'Paciente',h('select',{value:pid,onChange:function(e){setPid(e.target.value);}},
        h('option',{value:'all'},'Todos los pacientes'),
        patients.map(function(pt){return h('option',{key:pt.id,value:pt.id},pt.name);})
      )),
      h('label',null,'Buscar',h('input',{value:query,placeholder:'Buscar '+title.toLowerCase()+'…',onChange:function(e){setQuery(e.target.value);}}))
    ),
    h('div',{className:'rh-center-records'},
      matches.length?matches.map(function(item){
        var badge=tab==='labs'?(item.status==='reviewed'?'Revisado':item.status==='done'?'Con resultado':'Pendiente'):
          tab==='vaccines'?'Registrada':'Archivo local';
        return h('article',{className:'rh-center-item',key:item.id},
          h('div',{className:'rh-center-item-head'},h('div',null,
            h('span',{className:'rh-center-patient'},patientName(item.patientId)),
            h('h2',null,item.title)),
            h('span',{className:'rh-center-pill'},badge)
          ),
          h('p',{className:'rh-center-meta'},[fmtD(item.date),item.provider].filter(Boolean).join(' · ')),
          item.appointmentId&&h('button',{className:'rh-center-related-link',onClick:function(){
              var appt=(store.appointments||[]).find(function(a){return a.id===item.appointmentId;});
              if(appt&&p.onAppointment)p.onAppointment(appt);
            }},'Abrir cita relacionada → '+((store.appointments||[]).find(function(a){return a.id===item.appointmentId;})?.reason||'Consulta')),
          tab==='labs'&&item.value!==undefined&&item.value!==''&&h('div',{className:'rh-center-result'},
            h('strong',null,item.value+' '+(item.unit||'')),
            item.reference&&h('small',null,'Referencia indicada: '+item.reference),
            trend(item)
          ),
          tab==='vaccines'&&h('p',{className:'rh-center-meta'},
            [item.dose?'Dosis: '+item.dose:'',item.nextDate?'Próxima fecha: '+fmtD(item.nextDate):''].filter(Boolean).join(' · ')),
          tab==='documents'&&h('p',{className:'rh-center-meta'},item.fileName||'Sin archivo adjunto'),
          item.notes&&h('p',{className:'rh-center-note'},item.notes),
          h('div',{className:'rh-center-item-actions'},
            tab==='documents'&&item.fileData&&h('button',{onClick:function(){downloadEntry(item);}},'Descargar archivo'),
            h('button',{onClick:function(){startEdit(item);}},'Editar'),
            h('button',{onClick:function(){removeEntry(item);},className:'danger'},'Eliminar')
          )
        );
      }):h('div',{className:'rh-center-empty'},h(Ic,{n:tab==='labs'?'activity':tab==='vaccines'?'shield':'file',s:27,c:'var(--accent)'}),
        h('strong',null,'Sin registros de '+title.toLowerCase()),
        h('button',{onClick:newEntry},'Agregar registro ↗'))
    ),
    h('p',{className:'rh-center-footnote'},'Los registros son manuales y no se verifican con centros de salud. No constituyen diagnóstico ni sustituyen la revisión profesional. Se guardan en este navegador.'),
    open&&h(Sheet,{title:editId?'Editar '+title.toLowerCase():'Nuevo registro de '+title.toLowerCase(),sub:'Registro local',onClose:function(){setOpen(false);}},
      h('div',{className:'rh-center-form'},
        h('label',{className:'rh-center-field'},h('span',null,'Paciente'),
          h('select',{value:form.patientId||'',onChange:function(e){var v=e.target.value;setForm(function(x){return xt(x,{patientId:v});});}},
            patients.map(function(pt){return h('option',{key:pt.id,value:pt.id},pt.name);})
          )
        ),
        field('title',tab==='labs'?'Nombre del análisis':tab==='vaccines'?'Nombre de la vacuna':'Nombre del documento','text',
          tab==='labs'?'Hemoglobina, glucosa…':tab==='vaccines'?'Influenza, tétanos…':'Orden médica…'),
        field('date',tab==='labs'?'Fecha del análisis':tab==='vaccines'?'Fecha de aplicación':'Fecha del documento','date'),
        field('provider','Centro o profesional','text','Opcional'),
        h('label',{className:'rh-center-field'},h('span',null,'Cita relacionada (opcional)'),
          h('select',{value:form.appointmentId||'',onChange:function(e){var id=e.target.value;setForm(function(v){return xt(v,{appointmentId:id});});}},
            h('option',{value:''},'Sin cita relacionada'),
            (store.appointments||[]).filter(function(a){return a.patientId===form.patientId;}).map(function(a){
              return h('option',{key:a.id,value:a.id},fmtD(a.date)+' · '+(a.reason||a.specialty||'Cita'));
            })
          )
        ),
        tab==='labs'&&h('div',{className:'rh-center-form-grid'},
          field('value','Valor numérico','number','Ej. 5.2'),
          field('unit','Unidad','text','mg/dL, mmol/L…')
        ),
        tab==='labs'&&field('reference','Rango de referencia del laboratorio','text','Solo si aparece en el resultado'),
        tab==='labs'&&h('label',{className:'rh-center-field'},h('span',null,'Estado'),
          h('select',{value:form.status||'pending',onChange:function(e){setForm(xt(form,{status:e.target.value}));}},
            h('option',{value:'pending'},'Pendiente'),h('option',{value:'done'},'Resultado recibido'),
            h('option',{value:'reviewed'},'Marcado como revisado')
          )
        ),
        tab==='vaccines'&&h('div',{className:'rh-center-form-grid'},
          field('dose','Número de dosis','text','Ej. 2 de 3'),
          field('nextDate','Próxima fecha (opcional)','date')
        ),
        tab==='documents'&&h('div',{className:'rh-center-upload'},
          h('label',null,'Archivo opcional (máximo 600 KB)'),
          h('input',{type:'file',accept:'.pdf,image/jpeg,image/png,image/webp,application/pdf',onChange:readAttachment}),
          form.fileName&&h('p',null,'Adjunto: '+form.fileName),
          form.fileData&&h('button',{onClick:function(){setForm(function(v){return xt(v,{fileData:'',fileName:''});});}},'Quitar archivo'),
          h('small',null,'Archivos guardados localmente sin cifrado. No agregues documentos médicos sensibles en dispositivos compartidos.')
        ),
        field('notes','Notas (opcional)','textarea','Solo información que quieras conservar'),
        msg&&h('p',{className:'rh-center-msg',role:'status'},msg),
        h('button',{className:'rh-center-save',onClick:saveEntry},'Guardar registro')
      )
    ),
    !open&&msg&&h('p',{className:'rh-center-msg',role:'status'},msg)
  );
}

// Avisos opcionales SOLO con la aplicación abierta. Sin mensajes médicos en pantalla de bloqueo.
function rhReminderScan(user,store){
  if(!lsg(uk(user,'notifications')))return;
  if(!('Notification' in window)||Notification.permission!=='granted'||document.visibilityState!=='visible')return;
  var today=rhCalDay(new Date()),tomorrow=rhCalDate(today);tomorrow.setDate(tomorrow.getDate()+1);
  var tomorrowKey=rhCalDay(tomorrow),notes=lsg(uk(user,'notices_sent'))||{};
  var now=new Date(),clock=now.getHours()*60+now.getMinutes();
  var appointments=(store.appointments||[]).filter(function(a){return rhAppointmentActive(a)&&[today,tomorrowKey].includes(a.date);});
  var medications=(store.medications||[]).filter(function(m){
    if(m.status==='paused'||m.status==='completed'||!m.doseTimes)return false;
    var scheduled=String(m.doseTimes).split(',').map(function(v){return v.trim();}).filter(function(v){return /^([01]\d|2[0-3]):[0-5]\d$/.test(v);});
    var taken=(store.doseLogs||[]).filter(function(d){return d.medicationId===m.id&&d.status!=='missed'&&rhCalDay(new Date(d.at))===today;}).length;
    return scheduled.some(function(time,index){var due=Number(time.slice(0,2))*60+Number(time.slice(3,5));return index>=taken&&clock>=due&&clock<due+15;});
  });
  var types=[];
  if(appointments.length&&!notes['appointments-'+today])types.push('appointments');
  if(medications.length){
    var rounded=Math.floor(clock/15),id='medications-'+today+'-'+rounded;
    if(!notes[id])types.push('medications');
  }
  if(!types.length)return;
  var message=types.length>1?'Hay citas y tratamientos que revisar.':types[0]==='appointments'?'Revisa las citas de hoy y mañana.':'Revisa tus horarios de medicamentos.';
  function deliver(){
    if(navigator.serviceWorker&&navigator.serviceWorker.ready){
      navigator.serviceWorker.ready.then(function(reg){
        if(reg.showNotification)return reg.showNotification('Rodme Health',{body:message,tag:'rh-local-check-'+today,icon:'./app-icon.svg'});
        new Notification('Rodme Health',{body:message});
      }).catch(function(){try{new Notification('Rodme Health',{body:message});}catch(e){}});
    }else{try{new Notification('Rodme Health',{body:message});}catch(e){}}
  }
  deliver();
  if(types.includes('appointments'))notes['appointments-'+today]=true;
  if(types.includes('medications'))notes['medications-'+today+'-'+Math.floor(clock/15)]=true;
  Object.keys(notes).forEach(function(k){if(k.indexOf(today)===-1)delete notes[k];});
  lss(uk(user,'notices_sent'),notes);
}
function LocalRemindersPanel(p){
  var enabledState=useState(!!lsg(uk(p.user,'notifications'))),enabled=enabledState[0],setEnabled=enabledState[1];
  var msgState=useState(''),msg=msgState[0],setMsg=msgState[1];
  async function enable(){
    if(!('Notification' in window)){setMsg('Este navegador no admite avisos de este tipo.');return;}
    try{
      var permission=Notification.permission==='granted'?'granted':await Notification.requestPermission();
      if(permission==='granted'){lss(uk(p.user,'notifications'),true);setEnabled(true);setMsg('Avisos activados mientras la página esté abierta.');}
      else setMsg('El navegador no concedió el permiso de notificaciones.');
    }catch(e){setMsg('No se pudieron activar los avisos. Puedes usar los archivos de calendario (.ics).');}
  }
  function disable(){lss(uk(p.user,'notifications'),false);setEnabled(false);setMsg('Avisos desactivados.');}
  return h('section',{className:'rh-local-reminders'},
    h('div',null,h('h2',null,'Avisos de salud'),
      h('p',null,'Alertas opcionales para citas de hoy o mañana y horarios de medicamentos registrados.')),
    h('button',{className:'rh-mini-btn'+(enabled?'':' rh-mini-primary'),onClick:enabled?disable:enable},
      enabled?'Desactivar avisos':'Activar avisos'),
    h('small',null,'Solo funcionan cuando la página está abierta y el navegador permite notificaciones. No enviamos recordatorios con la aplicación cerrada.'),
    msg&&h('p',{className:'rh-local-reminder-msg',role:'status'},msg)
  );
}

function InstallAppPanel(){
  var ps=useState(!!window._rhInstallPrompt),installable=ps[0],setInstallable=ps[1];
  var ss=useState(''),state=ss[0],setState=ss[1];
  useEffect(function(){
    function available(){setInstallable(!!window._rhInstallPrompt);}
    window.addEventListener('rh-install-ready',available);
    return function(){window.removeEventListener('rh-install-ready',available);};
  },[]);
  async function install(){
    var prompt=window._rhInstallPrompt;
    if(!prompt)return;
    window._rhInstallPrompt=null;setInstallable(false);
    try{prompt.prompt();var answer=await prompt.userChoice;setState(answer&&answer.outcome==='accepted'?'Solicitud enviada al navegador.':'Puedes instalarla desde el menú de tu navegador.');}
    catch(e){setState('Usa el menú de tu navegador para instalar la aplicación.');}
  }
  return h('section',{className:'rh-install-panel'},
    h('div',null,h('h2',null,'Rodme Health en tu celular'),
      h('p',null,'Abre tu agenda como aplicación desde la pantalla de inicio, sin usar una cuenta de Google.')),
    installable&&h('button',{className:'rh-mini-btn rh-mini-primary',onClick:install},h(Ic,{n:'plus',s:15,c:'currentColor'}),' Instalar aplicación'),
    !installable&&h('p',{className:'rh-install-help'},'En iPhone: Safari → Compartir → Añadir a pantalla de inicio. En Android: menú del navegador → Instalar aplicación.'),
    h('p',{className:'rh-install-help'},'Puede abrirse sin conexión después de haberla utilizado en línea. Los archivos externos o algunas funciones podrían requerir conexión.'),
    state&&h('p',{className:'rh-install-help',role:'status'},state)
  );
}

function SettingsView(p){
  var user=p.user,sv=p.sv,theme=p.theme,setTheme=p.setTheme;
  var pk=uk(user,'prefs'),saved=lsg(pk)||{};
  var fs=useState(xt({ownerName:'',email:'',phone:'',language:'es',timezone:'America/Costa_Rica'},saved));
  var form=fs[0],sf=fs[1];
  var savedState=useState(false),savedOk=savedState[0],setSavedOk=savedState[1];
  var TZ=[{v:'America/Costa_Rica',l:'Costa Rica'},{v:'America/New_York',l:'Nueva York'},
    {v:'America/Chicago',l:'Chicago'},{v:'America/Los_Angeles',l:'Los Ángeles'},
    {v:'Europe/Madrid',l:'Madrid'},{v:'America/Mexico_City',l:'Ciudad de México'},
    {v:'America/Bogota',l:'Bogotá'}];
  function save(){lss(pk,form);setSavedOk(true);}
  function clearSpace(){
    if(confirm('¿Borrar todos los registros de este espacio en este navegador? Esta acción no se puede deshacer.')){
      ['p','a','m','d','labs','vaccines','docs','vitals','symptoms','followups','rec','records','prefs','record_patient','notifications','notices_sent'].forEach(function(k){localStorage.removeItem(uk(user,k));});
      location.reload();
    }
  }
  function settingInput(title,key,type,placeholder){
    return h('label',{className:'rh-setting-field'},
      h('span',null,title),
      h('input',{type:type||'text',value:form[key]||'',
        onChange:function(e){var val=e.target.value;sf(function(o){var next=xt(o,{});next[key]=val;return next;});setSavedOk(false);},
        placeholder:placeholder||''})
    );
  }
  return h('div',{className:'rh-local-settings med1820-settings'},
    h('div',{className:'ph'},h('p',{className:'ph-sub'},'TU ESPACIO'),h('h1',{className:'ph-title'},'Configuración'),
      h('p',{style:{fontSize:'.81rem',color:'var(--text2)',marginTop:9}},'Personaliza tu espacio. Entras directamente, sin cuenta ni contraseña.')),
    h('div',{className:'rh-settings-grid'},
      h('section',{className:'card-flat rh-settings-section'},
        h('h2',null,'Mi información'),
        settingInput('Nombre','ownerName','text','Cómo quieres aparecer'),
        settingInput('Correo (opcional)','email','email','correo@ejemplo.com'),
        settingInput('Teléfono (opcional)','phone','tel','+506 8888-8888')
      ),
      h('section',{className:'card-flat rh-settings-section'},
        h('h2',null,'Preferencias'),
        h('label',{className:'rh-setting-field'},h('span',null,'Zona horaria'),
          h('select',{value:form.timezone||'America/Costa_Rica',onChange:function(e){sf(xt(form,{timezone:e.target.value}));setSavedOk(false);}},
            TZ.map(function(t){return h('option',{key:t.v,value:t.v},t.l);})
          )
        ),
        h('div',{className:'rh-setting-field'},h('span',null,'Apariencia'),
          h('div',{className:'rh-theme-switch'},
            h('button',{className:'btn '+(theme==='light'?'rh-theme-active':''),onClick:function(){setTheme('light');}},h(Ic,{n:'sun',s:15,c:'currentColor'}),'Claro'),
            h('button',{className:'btn '+(theme==='dark'?'rh-theme-active':''),onClick:function(){setTheme('dark');}},h(Ic,{n:'moon',s:15,c:'currentColor'}),'Oscuro')
          )
        ),
        h('button',{className:'rh-settings-link',onClick:function(){sv('record');}},
          h(Ic,{n:'file',s:18,c:'var(--accent)'}),'Abrir mi expediente',h('span',null,'→'))
      )
    ),
    h('button',{className:'btn btn-primary btn-full',style:{marginTop:17,marginBottom:15,padding:'13px'},onClick:save},
      h(Ic,{n:savedOk?'check':'settings',s:15,c:'white'}),savedOk?'Preferencias guardadas':'Guardar cambios'),
    h(LocalRemindersPanel,{user:user}),
    h(InstallAppPanel),
    h(BackupPanel,{user:user}),
    h('div',{className:'rh-local-warning'},
      h(Ic,{n:'shield',s:19,c:'var(--accent)'}),
      h('p',null,'Este espacio no utiliza inicio de sesión. Los registros quedan guardados solo en este navegador, no se sincronizan entre dispositivos y cualquier persona que use este dispositivo puede verlos. Evita ingresar información médica sensible.')
    ),
    h('div',{className:'rh-settings-danger'},
      h('p',null,'Administrar datos locales'),
      h('button',{className:'btn btn-danger',onClick:clearSpace},h(Ic,{n:'trash',s:14,c:'currentColor'}),'Borrar datos de este espacio')
    )
  );
}

// ── RECORD VIEW ────────────────────────────────────────────────────────────
// Expedientes por paciente. El formato anterior se conserva y solo se atribuye
// a un paciente si existía una vinculación explícita o si era el único paciente.
function rhReadRecord(user,patientId,patients){
  if(!patientId)return {};
  var map=lsg(uk(user,'records'))||{};
  if(Object.prototype.hasOwnProperty.call(map,patientId))return xt({},map[patientId]);
  var legacy=lsg(uk(user,'rec'))||{};
  if(legacy&&typeof legacy==='object'&&!Array.isArray(legacy)&&
    ((legacy.patientId&&legacy.patientId===patientId)||
     (!legacy.patientId&&patients&&patients.length===1&&patients[0].id===patientId))){
    return xt({},legacy);
  }
  return {};
}
function rhSaveRecord(user,patientId,data){
  if(!patientId)return false;
  var map=lsg(uk(user,'records'))||{};
  map[patientId]=xt(data,{patientId:patientId});
  return lss(uk(user,'records'),map);
}

function RecordView(p){
  var store=p.store,sv=p.sv,user=p.user;
  var storedPid=lsg(uk(user,'record_patient'));
  var pid=store.patients.some(function(pt){return pt.id===storedPid;})?storedPid:
    (store.patients.length?store.patients[0].id:'');
  var fs=useState(function(){return xt({patientId:pid},rhReadRecord(user,pid,store.patients));});
  var form=fs[0],sf=fs[1];
  var svs=useState(false);var sv2=svs[0],sSv=svs[1];
  function selectPatient(nextId){
    var original=xt({patientId:form.patientId},rhReadRecord(user,form.patientId,store.patients));
    if(JSON.stringify(form)!==JSON.stringify(original)&&!confirm('Hay cambios sin guardar en este expediente. ¿Cambiar de paciente y descartarlos?'))return;
    sf(xt({patientId:nextId},rhReadRecord(user,nextId,store.patients)));
    lss(uk(user,'record_patient'),nextId);
    sSv(false);
  }
  function save(){
    if(!form.patientId){alert('Primero debes agregar un paciente.');return;}
    if(rhSaveRecord(user,form.patientId,form)){sSv(true);setTimeout(function(){sSv(false);},2200);}
  }
  var BT=['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  var bmi=null,bL='',bC='var(--text2)';
  if(Number(form.weight)>0&&Number(form.height)>0){bmi=(Number(form.weight)/Math.pow(Number(form.height)/100,2)).toFixed(1);bL='Solo valor de referencia; no es una evaluación médica.';bC='var(--text2)';}
  function Blk(icon,col,title,kids){return h('div',{className:'card-flat',style:{marginBottom:11,overflow:'hidden'}},h('div',{style:{display:'flex',alignItems:'center',gap:8,padding:'10px 14px',borderBottom:'1px solid var(--border)',background:'var(--surface2)'}},h('div',{style:{width:22,height:22,borderRadius:6,background:col+'20',display:'flex',alignItems:'center',justifyContent:'center'}},h(Ic,{n:icon,s:12,c:col})),h('p',{style:{fontSize:'.7rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.06em',color:'var(--text2)'}},title)),h('div',{style:{padding:'12px 14px',display:'flex',flexDirection:'column',gap:10}},kids));}
  return h('div',null,
    h('div',{style:{display:'flex',alignItems:'center',gap:11,marginBottom:16}},
      h('button',{className:'btn-icon',style:{background:'var(--surface)',border:'1px solid var(--border)'},onClick:function(){sv('settings');}},h(Ic,{n:'back',s:17,c:'var(--text)'})),
      h('div',null,h('p',{className:'ph-sub'},'Historial'),h('h1',{className:'ph-title',style:{fontSize:'1.3rem'}},'Expediente médico'))
    ),
    store.patients.length>0?h('div',{className:'rh-record-context'},
      h('label',null,'Expediente de'),
      h('select',{value:form.patientId||'',onChange:function(e){selectPatient(e.target.value);},
        'aria-label':'Seleccionar paciente del expediente'},
        store.patients.map(function(pt){return h('option',{key:pt.id,value:pt.id},pt.name);})
      ),
      h('p',null,'Los datos de este formulario corresponden únicamente al paciente seleccionado.')
    ):h('div',{className:'rh-record-context'},'Primero agrega un paciente para crear su expediente.'),
    Blk('activity','var(--red)','Datos vitales',[
      h('div',{key:'bt'},h('label',null,'Tipo de sangre'),h('div',{className:'bt-grid'},BT.map(function(b){return h('button',{key:b,className:'bt-btn'+(form.bloodType===b?' on':''),onClick:function(){sf(function(f){return xt(f,{bloodType:b});})}},b);}))),
      h('div',{key:'hrbp',className:'fg'},
        h(Fld,{label:'Frec. Cardiaca (bpm)'},h('input',{type:'number',value:form.heartRate||'',onChange:upd(sf,'heartRate'),placeholder:'72'})),
        h(Fld,{label:'Presion Arterial'},h('input',{value:form.bloodPressure||'',onChange:upd(sf,'bloodPressure'),placeholder:'120/80'}))
      ),
      h('div',{key:'wh',className:'fg'},h(Fld,{label:'Peso (kg)'},h('input',{type:'number',value:form.weight||'',onChange:upd(sf,'weight'),placeholder:'70'})),h(Fld,{label:'Altura (cm)'},h('input',{type:'number',value:form.height||'',onChange:upd(sf,'height'),placeholder:'170'}))),
      bmi&&h('div',{key:'bmi',className:'imc',style:{background:bC+'12',border:'1px solid '+bC+'30'}},h('p',{style:{fontSize:'.8rem',fontWeight:800,color:bC}},'IMC: '+bmi),h('span',{style:{fontSize:'.72rem',color:bC,fontWeight:700}},bL))
    ]),
    Blk('alert','var(--amber)','Alergias y condiciones',[
      h(Fld,{key:'al',label:'Alergias conocidas'},h('textarea',{value:form.allergies||'',onChange:upd(sf,'allergies'),placeholder:'Penicilina, mariscos...',rows:2})),
      h(Fld,{key:'cr',label:'Condiciones cronicas'},h('textarea',{value:form.chronicConditions||'',onChange:upd(sf,'chronicConditions'),placeholder:'Diabetes, hipertension...',rows:2}))
    ]),
    Blk('file','var(--accent)','Historial medico',[
      h(Fld,{key:'su',label:'Cirugias previas'},h('textarea',{value:form.surgeries||'',onChange:upd(sf,'surgeries'),placeholder:'Apendicectomia 2018...',rows:2})),
      h(Fld,{key:'fh',label:'Antecedentes familiares'},h('textarea',{value:form.familyHistory||'',onChange:upd(sf,'familyHistory'),placeholder:'Diabetes por linea paterna...',rows:2})),
      h(Fld,{key:'va',label:'Vacunas'},h('textarea',{value:form.vaccines||'',onChange:upd(sf,'vaccines'),placeholder:'COVID-19, influenza...',rows:2}))
    ]),
    Blk('shield','var(--purple)','Seguro y emergencias',[
      h('div',{key:'ins',className:'fg'},h(Fld,{label:'Aseguradora'},h('input',{value:form.insurance||'',onChange:upd(sf,'insurance'),placeholder:'INS, CCSS...'})),h(Fld,{label:'No. poliza'},h('input',{value:form.insuranceNumber||'',onChange:upd(sf,'insuranceNumber'),placeholder:'000-0000'}))),
      h('div',{key:'em',className:'fg'},h(Fld,{label:'Contacto emergencia'},h('input',{value:form.emergencyContact||'',onChange:upd(sf,'emergencyContact'),placeholder:'Nombre'})),h(Fld,{label:'Telefono'},h('input',{value:form.emergencyPhone||'',onChange:upd(sf,'emergencyPhone'),placeholder:'+506 8888-8888'})))
    ]),
    h('div',{className:'card-flat',style:{padding:'12px 14px',marginBottom:11}},h(Fld,{label:'Notas'},h('textarea',{value:form.notes||'',onChange:upd(sf,'notes'),placeholder:'Informacion medica adicional...',rows:3}))),
    h('div',{style:{display:'flex',gap:8}},
      h('button',{className:'btn btn-primary',style:{flex:1,borderRadius:'var(--r-full)',padding:'12px'},onClick:save},h(Ic,{n:sv2?'check':'record',s:14,c:'white'}),sv2?'Guardado!':'Guardar expediente'),
      h('button',{className:'btn',style:{padding:'12px 15px',borderRadius:'var(--r-full)',background:'var(--red-bg)',border:'1px solid var(--red-border)',color:'var(--red)',fontWeight:700},onClick:function(){var chosen=store.patients.find(function(x){return x.id===form.patientId;});if(chosen)generatePDF(form,store,chosen);}},h(Ic,{n:'file',s:14,c:'var(--red)'}),'PDF')
    )
  );
}

// ── PATIENT MODAL ──────────────────────────────────────────────────────────
function PatientModal(p){
  var store=p.store,patient=p.patient,onClose=p.onClose;
  var fs=useState(patient?xt(patient,{}):({name:'',whatsapp:'',notes:'',avatar:'',birthdate:'',gender:''}));
  var form=fs[0],sf=fs[1];
  var ref=useRef(null);
  function save(){
    if(!form.name.trim()){window.alert('El nombre del paciente es obligatorio.');return;}
    if(form.name.trim().length>100){window.alert('El nombre debe tener como máximo 100 caracteres.');return;}
    if(form.birthdate&&(rhCalDay(rhCalDate(form.birthdate))!==form.birthdate||form.birthdate>rhCalDay(new Date()))){
      window.alert('La fecha de nacimiento no puede estar en el futuro.');return;
    }
    patient?store.setPatients(function(arr){return arr.map(function(x){return x.id===patient.id?xt(x,form):x;});}):store.setPatients(function(arr){return arr.concat([xt(form,{id:uid()})]);});onClose();}
  function del(){
    if(!patient||!confirm('¿Eliminar este paciente, su expediente, citas, tratamientos y dosis registradas? Esta acción no se puede deshacer.'))return;
    store.setPatients(function(arr){return arr.filter(function(x){return x.id!==patient.id;});});
    store.setAppointments(function(arr){return arr.filter(function(x){return x.patientId!==patient.id;});});
    store.setMedications(function(arr){return arr.filter(function(x){return x.patientId!==patient.id;});});
    store.setDoseLogs(function(arr){return arr.filter(function(x){return x.patientId!==patient.id;});});
    store.setLabs(function(arr){return arr.filter(function(x){return x.patientId!==patient.id;});});
    store.setVaccines(function(arr){return arr.filter(function(x){return x.patientId!==patient.id;});});
    store.setDocuments(function(arr){return arr.filter(function(x){return x.patientId!==patient.id;});});
    store.setVitals(function(arr){return arr.filter(function(x){return x.patientId!==patient.id;});});
    store.setSymptoms(function(arr){return arr.filter(function(x){return x.patientId!==patient.id;});});
    store.setFollowups(function(arr){return arr.filter(function(x){return x.patientId!==patient.id;});});
    if(p.user){
      var key=uk(p.user,'records'),all=lsg(key)||{};
      if(Object.prototype.hasOwnProperty.call(all,patient.id)){delete all[patient.id];lss(key,all);}
      var old=lsg(uk(p.user,'rec'));
      if(old&&old.patientId===patient.id)localStorage.removeItem(uk(p.user,'rec'));
      if(lsg(uk(p.user,'record_patient'))===patient.id)localStorage.removeItem(uk(p.user,'record_patient'));
    }
    if(p.onDelete)p.onDelete(patient);
    onClose();
  }
  function loadAv(e){var f=e.target.files[0];if(!f)return;b64(f).then(function(bv){sf(function(x){return xt(x,{avatar:bv});});});}
  return h(Sheet,{title:patient?'Editar paciente':'Nuevo paciente',sub:'Paciente',onClose:onClose,dirty:JSON.stringify(form)!==JSON.stringify(patient?xt(patient,{}):{name:'',whatsapp:'',notes:'',avatar:'',birthdate:'',gender:''})},
    h('div',{style:{display:'flex',justifyContent:'center',marginBottom:14}},
      h('div',{style:{position:'relative'}},
        h('div',{className:'av',style:{width:62,height:62,fontSize:'1rem',cursor:'pointer'},onClick:function(){ref.current.click();}},form.avatar?h('img',{src:form.avatar,style:{width:'100%',height:'100%',objectFit:'cover'}}):ini(form.name)),
        h('button',{className:'btn-icon',style:{position:'absolute',bottom:0,right:0,background:'var(--accent)',borderRadius:'50%',width:20,height:20,padding:0},onClick:function(){ref.current.click();}},h(Ic,{n:'camera',s:10,c:'white'})),
        h('input',{ref:ref,type:'file',accept:'image/*',style:{display:'none'},onChange:loadAv})
      )
    ),
    h(Fld,{label:'Nombre completo'},h('input',{value:form.name,onChange:upd(sf,'name'),maxLength:100,required:true,'aria-required':true,placeholder:'Nombre y apellidos'})),
    h('div',{className:'fg'},
      h(Fld,{label:'Fecha de nacimiento'},h('input',{type:'date',value:form.birthdate||'',onChange:upd(sf,'birthdate')})),
      h(Fld,{label:'Genero'},h('select',{value:form.gender||'',onChange:upd(sf,'gender')},h('option',{value:''},'Seleccionar'),h('option',{value:'F'},'Femenino'),h('option',{value:'M'},'Masculino'),h('option',{value:'O'},'Otro')))
    ),
    h(Fld,{label:'WhatsApp'},h('div',{style:{position:'relative'}},h('span',{style:{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}},h(Ic,{n:'whatsapp',s:13,c:'#22C55E'})),h('input',{value:form.whatsapp||'',onChange:upd(sf,'whatsapp'),placeholder:'+506 8888-8888',style:{paddingLeft:34}}))),
    h(Fld,{label:'Notas medicas'},h('textarea',{value:form.notes||'',onChange:upd(sf,'notes'),placeholder:'Alergias, condiciones...',rows:3})),
    h('div',{style:{display:'flex',gap:8,marginTop:4}},
      patient&&h('button',{className:'btn btn-danger',style:{padding:'11px 13px',borderRadius:'var(--r-full)'},onClick:del},h(Ic,{n:'trash',s:14,c:'var(--red)'})),
      h('button',{className:'btn btn-primary btn-full',style:{borderRadius:'var(--r-full)',padding:'12px'},onClick:save},h(Ic,{n:'check',s:14,c:'white'}),patient?'Guardar':'Agregar paciente')
    )
  );
}

// ── APT MODAL ──────────────────────────────────────────────────────────────
function AptModal(p){
  var store=p.store,appt=p.appt,onClose=p.onClose;
  var pid=p.initialPatientId||((store.patients[0]||{}).id||'');
  var def={doctor:'',specialty:'',clinic:'',address:'',date:p.initialDate||'',time:'',type:'private',amount:'',deposit:'',notes:'',reason:'',patientId:pid,attended:false,status:'pending',attendedDoc:'',attendedNotes:''};
  var fs=useState(appt?xt(appt,{}):def);var form=fs[0],sf=fs[1];
  var sv=useState(false);var saved=sv[0],sSv=sv[1];
  var ref=useRef(null);
  var prepInputState=useState(''),prepInput=prepInputState[0],setPrepInput=prepInputState[1];
  function addPrep(){var t=prepInput.trim();if(!t||t.length>140||(form.prepItems||[]).length>=30)return;sf(function(prev){return xt(prev,{prepItems:(prev.prepItems||[]).concat([{id:uid(),text:t,done:false}])});});setPrepInput('');}
  function togglePrep(id){sf(function(prev){return xt(prev,{prepItems:(prev.prepItems||[]).map(function(a){return a.id===id?xt(a,{done:!a.done}):a;})});});}
  function removePrep(id){sf(function(prev){return xt(prev,{prepItems:(prev.prepItems||[]).filter(function(a){return a.id!==id;})});});}
  var valid=!!(form.date&&rhCalDay(rhCalDate(form.date))===form.date&&
    form.patientId&&store.patients.some(function(p){return p.id===form.patientId;})&&
    ((form.doctor||'').trim()||(form.reason||'').trim()));
  function validateAppt(){
    if(!valid){window.alert('Selecciona paciente, fecha válida y el nombre del médico o motivo de la cita.');return false;}
    if(form.amount!==''&&form.amount!==undefined&&(!Number.isFinite(Number(form.amount))||Number(form.amount)<0)){
      window.alert('El monto no puede ser negativo.');return false;
    }
    if(form.deposit!==''&&form.deposit!==undefined&&(!Number.isFinite(Number(form.deposit))||Number(form.deposit)<0)){
      window.alert('El depósito no puede ser negativo.');return false;
    }
    return true;
  }
  function setT(t){sf(function(f){return xt(f,{type:t});});}
  function gp(){return store.patients.find(function(x){return x.id===form.patientId;})||null;}
  function buildMsg(pt){var L=['Recordatorio de cita medica','','Paciente: '+pt.name];if(form.doctor)L.push('Doctor: Dr. '+form.doctor);if(form.specialty)L.push('Especialidad: '+form.specialty);L.push('Clinica: '+form.clinic);if(form.address)L.push('Direccion: '+form.address);L.push('Fecha: '+fmtDL(form.date),'Hora: '+fmtT(form.time));if(form.type==='private'&&form.amount)L.push('Monto: CRC '+Number(form.amount).toLocaleString());if(form.reason)L.push('','Motivo: '+form.reason);return encodeURIComponent(L.join('\n'));}
  function persist(){if(!validateAppt())return false;appt?store.setAppointments(function(arr){return arr.map(function(a){return a.id===appt.id?xt(a,form):a;});}):store.setAppointments(function(arr){return arr.concat([xt(form,{id:uid()})]);});return true;}
  function saveOnly(){if(!persist())return;sSv(true);setTimeout(onClose,600);}
  function saveWA(){if(!persist())return;var pt=gp();if(pt&&pt.whatsapp){setTimeout(function(){window.open('https://wa.me/'+pt.whatsapp.replace(/\D/g,'')+'?text='+buildMsg(pt),'_blank');},200);}else{alert('Sin WhatsApp registrado.');}sSv(true);setTimeout(onClose,600);}
  function loadDoc(e){var f=e.target.files[0];if(!f)return;b64(f).then(function(bv){sf(function(x){return xt(x,{attendedDoc:bv});});});}
  var saldo=(form.amount&&form.deposit&&Number(form.amount)>Number(form.deposit))?(Number(form.amount)-Number(form.deposit)):null;
  return h(Sheet,{title:'Cita médica',sub:appt?'Editar':'Nueva',onClose:onClose,dirty:JSON.stringify(form)!==JSON.stringify(appt?xt(appt,{}):def)},
    h(Fld,{label:'Paciente'},
      store.patients.length?h('select',{value:form.patientId,onChange:upd(sf,'patientId')},
        store.patients.map(function(pt){return h('option',{key:pt.id,value:pt.id},pt.name);}))
        :h('p',{className:'rh-no-patient'},'Primero agrega un paciente para poder guardar esta cita.')
    ),
    h('div',{style:{height:1,background:'var(--border)',margin:'4px 0'}}),
    h('div',{className:'fg'},h(Fld,{label:'Doctor'},h('input',{value:form.doctor,onChange:upd(sf,'doctor'),placeholder:'Rodriguez Mora'})),h(Fld,{label:'Especialidad'},h('input',{value:form.specialty||'',onChange:upd(sf,'specialty'),placeholder:'Cardiologia...'}))),
    h(Fld,{label:'Motivo'},h('input',{value:form.reason||'',onChange:upd(sf,'reason'),placeholder:'Control anual...'})),
    h(Fld,{label:'Hospital / Clinica'},h('input',{value:form.clinic||'',onChange:upd(sf,'clinic'),placeholder:'Hospital CIMA...'})),
    h(Fld,{label:'Direccion'},h('input',{value:form.address||'',onChange:upd(sf,'address'),placeholder:'Escazu, costado norte...'})),
    h('div',{className:'fg'},h(Fld,{label:'Fecha'},h('input',{type:'date',value:form.date,onChange:upd(sf,'date')})),h(Fld,{label:'Hora'},h('input',{type:'time',value:form.time||'',onChange:upd(sf,'time')}))),
    h(Fld,{label:'Tipo'},h('div',{className:'tab-group',style:{marginTop:2}},h('button',{className:'tab-btn'+(form.type==='private'?' on':''),onClick:function(){setT('private');}},'Privada'),h('button',{className:'tab-btn'+(form.type==='ccss'?' on':''),onClick:function(){setT('ccss');}},'CCSS'))),
    form.type==='private'&&h('div',{style:{background:'var(--amber-bg)',borderRadius:'var(--r)',padding:'11px 13px',border:'1px solid var(--amber-border)'}},
      h('p',{style:{fontSize:'.67rem',fontWeight:800,color:'var(--amber)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:9}},'Informacion de pago'),
      h('div',{className:'fg'},h(Fld,{label:'Monto (CRC)'},h('input',{type:'number',value:form.amount||'',onChange:upd(sf,'amount'),placeholder:'25000'})),h(Fld,{label:'Deposito (CRC)'},h('input',{type:'number',value:form.deposit||'',onChange:upd(sf,'deposit'),placeholder:'10000'}))),
      saldo&&h('p',{style:{fontSize:'.75rem',color:'var(--amber)',marginTop:6,fontWeight:700}},'Saldo: CRC '+saldo.toLocaleString())
    ),
    h(Fld,{label:'Estado de la cita'},h('select',{value:form.attended?'completed':(form.status||'pending'),onChange:function(e){var next=e.target.value;sf(function(v){return xt(v,{status:next,attended:next==='completed'});});}},
      [['pending','Pendiente'],['confirmed','Confirmada'],['rescheduled','Reprogramada'],['cancelled','Cancelada'],['completed','Realizada']].map(function(x){return h('option',{key:x[0],value:x[0]},x[1]);})
    )),
    h(Fld,{label:'Notas'},h('textarea',{value:form.notes||'',onChange:upd(sf,'notes'),placeholder:'Traer resultados, ayuno de 8h...',rows:2})),
    h('section',{className:'rh-prep-edit'},
      h('h3',null,'Preparación de la cita'),
      h(Fld,{label:'Indicaciones importantes'},h('textarea',{rows:2,value:form.prepInstructions||'',onChange:upd(sf,'prepInstructions'),placeholder:'Indicaciones dadas por el hospital o médico'})),
      h(Fld,{label:'Acompañante (opcional)'},h('input',{value:form.companion||'',onChange:upd(sf,'companion'),placeholder:'Nombre del acompañante'})),
      h(Fld,{label:'Aviso para el calendario'},h('select',{value:String(form.reminderMinutes===undefined?1440:form.reminderMinutes),onChange:function(e){sf(function(v){return xt(v,{reminderMinutes:Number(e.target.value)});});}},
        [[1440,'1 día antes'],[2880,'2 días antes'],[180,'3 horas antes'],[60,'1 hora antes'],[0,'Sin aviso']].map(function(x){return h('option',{key:x[0],value:x[0]},x[1]);})
      )),
      h('p',{className:'rh-prep-caption'},'El aviso se incorpora al archivo de calendario que descargues. No se envía una notificación desde esta página.'),
      h('h4',null,'Lista para llevar'),
      (form.prepItems||[]).map(function(item){
        return h('div',{className:'rh-prep-line',key:item.id},
          h('input',{type:'checkbox',checked:!!item.done,onChange:function(){togglePrep(item.id);},'aria-label':'Marcar '+item.text}),
          h('span',{className:item.done?'is-done':''},item.text),
          h('button',{onClick:function(){removePrep(item.id);},'aria-label':'Eliminar '+item.text},'×')
        );
      }),
      h('div',{className:'rh-prep-add'},
        h('input',{value:prepInput,placeholder:'Documento, orden médica, resultados…',maxLength:140,onChange:function(e){setPrepInput(e.target.value);},onKeyDown:function(e){if(e.key==='Enter'){e.preventDefault();addPrep();}}}),
        h('button',{onClick:addPrep,disabled:!prepInput.trim()},'Agregar')
      )
    ),
    appt&&h('div',{style:{background:'var(--green-bg)',borderRadius:'var(--r)',padding:'11px 13px',border:'1px solid var(--green-border)'}},
      h('p',{style:{fontSize:'.67rem',fontWeight:800,color:'var(--green)',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:9}},'Registrar asistencia'),
      h('div',{style:{display:'flex',gap:8,alignItems:'center',marginBottom:7}},
        h('button',{className:'btn',style:{padding:'7px 12px',borderRadius:'var(--r-full)',background:'white',border:'1.5px dashed var(--green-border)',color:'var(--green)',fontSize:'.75rem',fontWeight:700},onClick:function(){ref.current.click();}},h(Ic,{n:'camera',s:12,c:'var(--green)'}),form.attendedDoc?'Cambiar':'Subir doc'),
        form.attendedDoc&&h('span',{style:{fontSize:'.7rem',color:'var(--green)',fontWeight:700}},'\u2713 Cargado'),
        h('input',{ref:ref,type:'file',accept:'image/*,application/pdf',style:{display:'none'},onChange:loadDoc})
      ),
      form.attendedDoc&&h('img',{src:form.attendedDoc,style:{width:'100%',maxHeight:100,objectFit:'cover',borderRadius:7,marginBottom:7}}),
      h('textarea',{value:form.attendedNotes||'',onChange:upd(sf,'attendedNotes'),placeholder:'Diagnostico, indicaciones...',rows:2})
    ),
    h('div',{style:{marginTop:6,display:'flex',flexDirection:'column',gap:8}},
      !appt&&h('button',{className:'btn btn-full',style:{padding:'13px',borderRadius:'var(--r-full)',background:saved?'var(--green)':'#22C55E',border:'none',color:'white',fontWeight:700,gap:8,opacity:valid?1:.4,cursor:valid&&!saved?'pointer':'not-allowed'},onClick:saveWA,disabled:!valid||saved},h(Ic,{n:'whatsapp',s:16,c:'white'}),'Guardar y enviar WhatsApp'),
      h('button',{className:'btn btn-full',style:{padding:'13px',borderRadius:'var(--r-full)',background:saved?'var(--accent)':'var(--text)',border:'none',color:saved?'white':'var(--bg)',fontWeight:700,gap:8,opacity:valid?1:.4,cursor:valid&&!saved?'pointer':'not-allowed'},onClick:saveOnly,disabled:!valid||saved},h(Ic,{n:saved?'check':'calendar',s:16,c:saved?'white':'var(--bg)'}),saved?'Guardado!':appt?'Guardar cambios':'Solo guardar')
    )
  );
}

// ── APT DETAIL ─────────────────────────────────────────────────────────────
function AptDetail(p){
  var store=p.store,appt=p.appt,onClose=p.onClose,onEdit=p.onEdit;
  var pt=store.patients.find(function(x){return x.id===appt.patientId;})||null;
  var d=du(appt.date);
  var postItems=(store.followups||[]).filter(function(x){return x.appointmentId===appt.id;});
  var linkedLabs=(store.labs||[]).filter(function(x){return x.appointmentId===appt.id;});
  function sendWA(){if(!pt||!pt.whatsapp){alert('Sin WhatsApp.');return;}var msg=encodeURIComponent('Recordatorio cita medica\n\nPaciente: '+pt.name+(appt.doctor?'\nDoctor: Dr. '+appt.doctor:'')+(appt.specialty?'\n'+appt.specialty:'')+'\nClinica: '+appt.clinic+'\nFecha: '+fmtDL(appt.date)+'\nHora: '+fmtT(appt.time)+(appt.type==='private'&&appt.amount?'\nMonto: CRC '+Number(appt.amount).toLocaleString():''));window.open('https://wa.me/'+pt.whatsapp.replace(/\D/g,'')+'?text='+msg,'_blank');}
  function del(){if(confirm('Eliminar cita?')){store.setAppointments(function(arr){return arr.filter(function(a){return a.id!==appt.id;});});onClose();}}
  var dc=d===0?'var(--red)':d!==null&&d<=3?'var(--amber)':'var(--accent)';
  var dT=d===null?null:d===0?'Hoy!':d<0?'Pasada':'Faltan '+d+' dias';
  function IR(icon,label,val,sub,col){if(!val)return null;return h('div',{key:label,className:'ir'},h('div',{className:'ir-ico'},h(Ic,{n:icon,s:13,c:'var(--text3)'})),h('div',null,h('p',{className:'ir-lbl'},label),h('p',{className:'ir-val',style:{color:col||'var(--text)'}},val),sub&&h('p',{style:{fontSize:'.7rem',color:'var(--text2)',marginTop:1}},sub)));}
  return h(Sheet,{title:'Detalle de cita',onClose:onClose},
    h('div',{style:{background:'var(--accent-bg)',borderRadius:'var(--r-lg)',padding:'13px 15px',marginBottom:13,border:'1px solid rgba(196,149,106,.2)',display:'flex',gap:11,alignItems:'center'}},
      h('div',{className:'apt-avatar',style:{width:44,height:44}},appt.doctor?appt.doctor.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase():'Dr'),
      h('div',null,h('p',{style:{fontFamily:'var(--serif)',fontSize:'1.05rem',fontWeight:600,marginBottom:2}},appt.doctor?'Dr. '+appt.doctor:(appt.reason||'Cita médica')),appt.specialty&&h('p',{style:{fontSize:'.75rem',color:'var(--accent)',fontWeight:700}},appt.specialty),appt.attended&&h('span',{className:'chip chip-green',style:{marginTop:5,display:'inline-flex'}},'\u2713 Asistida'))
    ),
    IR('user','Paciente',pt?pt.name:null),
    IR('activity','Motivo',appt.reason),
    IR('check','Estado',rhAppointmentLabel(appt)),
    IR('calendar','Fecha',fmtDL(appt.date)),
    IR('clock','Hora',fmtT(appt.time)),
    IR('hospital','Clinica',appt.clinic),
    IR('alert','Direccion',appt.address),
    appt.type==='private'&&appt.amount?IR('money','Monto','CRC '+Number(appt.amount).toLocaleString(),appt.deposit?'Dep: CRC '+Number(appt.deposit).toLocaleString()+' \u00b7 Saldo: CRC '+(Number(appt.amount)-Number(appt.deposit)).toLocaleString():''):null,
    IR('file','Notas',appt.notes),
    rhAppointmentActive(appt)&&dT?IR('bell','Tiempo',dT,null,dc):null,
    IR('file','Notas e indicaciones posteriores',appt.attendedNotes),
    appt.attendedDoc&&h('div',{style:{margin:'9px 0 5px'}},h('p',{className:'ir-lbl',style:{marginBottom:5}},'Documento'),h('img',{src:appt.attendedDoc,style:{width:'100%',borderRadius:'var(--r)',maxHeight:160,objectFit:'cover'}})),
    h('div',{className:'rh-detail-prep'},
      h('h3',null,'Preparación'),
      appt.prepInstructions&&IR('file','Indicaciones',appt.prepInstructions),
      appt.companion&&IR('user','Acompañante',appt.companion),
      (appt.prepItems||[]).length>0?h('div',{className:'rh-detail-checks'},
        (appt.prepItems||[]).map(function(item){
          return h('label',{key:item.id,className:'rh-prep-line'},
            h('input',{type:'checkbox',checked:!!item.done,onChange:function(){
              store.setAppointments(function(arr){return arr.map(function(a){return a.id===appt.id?xt(a,{prepItems:(a.prepItems||[]).map(function(v){return v.id===item.id?xt(v,{done:!v.done}):v;})}):a;});});
            }}),
            h('span',{className:item.done?'is-done':''},item.text)
          );
        })
      ):h('p',{className:'rh-prep-caption'},'Sin lista de preparación. Puedes agregarla desde Editar.')
    ),
    h('section',{className:'rh-detail-followups'},
      h('div',{className:'rh-profile-panel-head'},h('h3',null,'Seguimiento de la consulta'),
        h('button',{onClick:p.onFollowup},'+ Agregar indicación')),
      postItems.length?postItems.map(function(item){
        return h('div',{className:'rh-detail-followup-row',key:item.id},
          h('span',null,item.title),
          h('small',null,item.status==='done'?'Completada':'Pendiente')
        );
      }):h('p',null,'Sin indicaciones posteriores registradas.'),
      linkedLabs.length&&h('p',null,linkedLabs.length+' laboratorio'+(linkedLabs.length===1?'':'s')+' relacionado'+(linkedLabs.length===1?'':'s')+' con esta cita.')
    ),
    h('div',{className:'rh-appointment-status-actions'},
      [['pending','Pendiente'],['confirmed','Confirmada'],['rescheduled','Reprogramada'],['cancelled','Cancelada'],['completed','Realizada']].map(function(x){
        return h('button',{key:x[0],className:rhAppointmentStatus(appt)===x[0]?'active':'',onClick:function(){rhAppointmentUpdate(store,appt,x[0]);}},x[1]);
      })
    ),
    h('button',{className:'rh-ics-button',onClick:function(){rhExportCalendar([appt],store.patients);}},
      h(Ic,{n:'calendar',s:16,c:'currentColor'}),' Agregar al calendario (.ics)'),
    h('div',{style:{display:'flex',flexDirection:'column',gap:7,marginTop:10}},
      pt&&pt.whatsapp&&h('button',{className:'btn btn-full',style:{padding:'12px',borderRadius:'var(--r-full)',background:'#22C55E',border:'none',color:'white',fontWeight:700,gap:8},onClick:sendWA},h(Ic,{n:'whatsapp',s:15,c:'white'}),'Enviar recordatorio por WhatsApp'),
      h('div',{style:{display:'flex',gap:8}},
        h('button',{className:'btn btn-outline',style:{flex:1,borderRadius:'var(--r-full)',gap:6},onClick:onEdit},h(Ic,{n:'edit',s:14,c:'var(--text)'}),'Editar'),
        h('button',{className:'btn btn-danger',style:{borderRadius:'var(--r-full)',padding:'11px 14px',gap:5},onClick:del},h(Ic,{n:'trash',s:14,c:'var(--red)'}),'Eliminar')
      )
    )
  );
}

// ── MED MODAL ──────────────────────────────────────────────────────────────
function MedModal(p){
  var store=p.store,onClose=p.onClose,existing=p.med;
  var pid=p.initialPatientId||((store.patients[0]||{}).id||'');
  var def={name:'',dosage:'',frequency:'',type:'ccss',notes:'',prescriptionImg:'',patientId:pid,startDate:'',totalDays:'',status:'active',doseTimes:'',stockQty:'',stockThreshold:''};
  var fs=useState(existing?xt(existing,{}):def);var form=fs[0],sf=fs[1];
  var ref=useRef(null);
  function setT(t){sf(function(f){return xt(f,{type:t});});}
  function save(){
    if(!form.name.trim()||!form.patientId){window.alert('Selecciona un paciente e indica el medicamento.');return;}
    if(form.startDate&&rhCalDay(rhCalDate(form.startDate))!==form.startDate){window.alert('Revisa la fecha de inicio.');return;}
    var t=String(form.doseTimes||'').trim();
    if(t&&t.split(',').some(function(v){return !/^([01]\d|2[0-3]):[0-5]\d$/.test(v.trim());})){alert('Usa horarios de 24 horas separados por coma, por ejemplo 08:00, 20:00.');return;}
    if(['stockQty','stockThreshold'].some(function(k){return form[k]!==''&&form[k]!==undefined&&(Number(form[k])<0||!Number.isInteger(Number(form[k])));})){alert('Las cantidades deben ser números enteros iguales o mayores que cero.');return;}
    existing?store.setMedications(function(arr){return arr.map(function(m){return m.id===existing.id?xt(m,form):m;});}):store.setMedications(function(arr){return arr.concat([xt(form,{id:uid()})]);});onClose();}
  function loadImg(e){var f=e.target.files[0];if(!f)return;b64(f).then(function(bv){sf(function(x){return xt(x,{prescriptionImg:bv});});});}
  return h(Sheet,{title:existing?'Editar medicamento':'Nuevo medicamento',sub:'Medicamento',onClose:onClose,dirty:JSON.stringify(form)!==JSON.stringify(existing?xt(existing,{}):def)},
    h(Fld,{label:'Paciente'},
      store.patients.length?h('select',{value:form.patientId,onChange:upd(sf,'patientId')},
        store.patients.map(function(pt){return h('option',{key:pt.id,value:pt.id},pt.name);}))
        :h('p',{className:'rh-no-patient'},'Primero agrega un paciente para poder guardar este medicamento.')
    ),
    h(Fld,{label:'Medicamento'},h('input',{value:form.name,onChange:upd(sf,'name'),placeholder:'Metformina 500mg'})),
    h('div',{className:'fg'},h(Fld,{label:'Dosis'},h('input',{value:form.dosage||'',onChange:upd(sf,'dosage'),placeholder:'500mg'})),h(Fld,{label:'Frecuencia'},h('input',{value:form.frequency||'',onChange:upd(sf,'frequency'),placeholder:'Cada 12h'}))),
    h('div',{className:'fg'},h(Fld,{label:'Fecha de inicio'},h('input',{type:'date',value:form.startDate||'',onChange:upd(sf,'startDate')})),h(Fld,{label:'Duracion (dias)'},h('input',{type:'number',value:form.totalDays||'',onChange:upd(sf,'totalDays'),placeholder:'30'}))),
    h(Fld,{label:'Tipo'},h('div',{className:'tab-group',style:{marginTop:2}},h('button',{className:'tab-btn'+(form.type==='ccss'?' on':''),onClick:function(){setT('ccss');}},'CCSS'),h('button',{className:'tab-btn'+(form.type==='private'?' on':''),onClick:function(){setT('private');}},'Privado'))),
    h(Fld,{label:'Estado del tratamiento'},h('select',{value:form.status||'active',onChange:upd(sf,'status')},h('option',{value:'active'},'Activo'),h('option',{value:'paused'},'Pausado'),h('option',{value:'completed'},'Finalizado'))),
    h('div',{className:'rh-med-extra-settings'},
      h(Fld,{label:'Horarios establecidos (24 h)'},h('input',{value:form.doseTimes||'',placeholder:'08:00, 20:00',onChange:upd(sf,'doseTimes')})),
      h('div',{className:'fg'},
        h(Fld,{label:'Cantidad disponible'},h('input',{type:'number',min:'0',step:'1',value:form.stockQty??'',onChange:upd(sf,'stockQty'),placeholder:'Opcional'})),
        h(Fld,{label:'Avisar reposición desde'},h('input',{type:'number',min:'0',step:'1',value:form.stockThreshold??'',onChange:upd(sf,'stockThreshold'),placeholder:'Opcional'}))
      ),
      h('p',{className:'rh-prep-caption'},'La cantidad es manual: se actualiza al editar el medicamento y no se descuenta automáticamente.')
    ),
    h(Fld,{label:'Instrucciones / Notas'},h('textarea',{value:form.notes||'',onChange:upd(sf,'notes'),placeholder:'Tomar con alimentos...',rows:2})),
    h(Fld,{label:'Foto de receta'},
      h('button',{className:'btn',style:{width:'100%',padding:'10px',borderRadius:'var(--r-full)',background:form.prescriptionImg?'var(--accent-bg)':'var(--surface2)',border:'1.5px dashed '+(form.prescriptionImg?'var(--accent)':'var(--border)'),color:form.prescriptionImg?'var(--accent)':'var(--text2)',fontSize:'.8rem',fontWeight:700,gap:7},onClick:function(){ref.current.click();}},h(Ic,{n:'camera',s:14,c:form.prescriptionImg?'var(--accent)':'var(--text3)'}),form.prescriptionImg?'\u2713 Foto cargada':'Agregar foto de receta'),
      h('input',{ref:ref,type:'file',accept:'image/*',style:{display:'none'},onChange:loadImg})
    ),
    form.prescriptionImg&&h('img',{src:form.prescriptionImg,style:{width:'100%',borderRadius:'var(--r)',maxHeight:110,objectFit:'cover'}}),
    h('div',{style:{marginTop:4}},h('button',{className:'btn btn-primary btn-full',style:{borderRadius:'var(--r-full)',padding:'12px'},onClick:save},h(Ic,{n:'check',s:14,c:'white'}),existing?'Guardar cambios':'Guardar medicamento'))
  );
}

// ── PDF ────────────────────────────────────────────────────────────────────
function generatePDF(record,store,directPt){
  var patient=directPt||null;
  if(!patient){for(var i=0;i<store.patients.length;i++){if(store.patients[i].id===record.patientId){patient=store.patients[i];break;}}}
  if(!patient){alert('Selecciona un paciente primero.');return;}
  // Los valores introducidos por el usuario se convierten en texto inerte antes
  // de insertarlos en el HTML del informe imprimible.
  function safeHTML(v){return String(v===undefined||v===null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function safeObject(obj){var out={};Object.keys(obj||{}).forEach(function(k){
    var v=obj[k];out[k]=typeof v==='string'?safeHTML(v):v;
  });return out;}
  var apts=store.appointments.filter(function(a){return a.patientId===patient.id;}).map(safeObject);
  var meds=store.medications.filter(function(m){return m.patientId===patient.id;}).map(safeObject);
  var labs=(store.labs||[]).filter(function(v){return v.patientId===patient.id;}).map(safeObject);
  var vaccines=(store.vaccines||[]).filter(function(v){return v.patientId===patient.id;}).map(safeObject);
  var docs=(store.documents||[]).filter(function(v){return v.patientId===patient.id;}).map(safeObject);
  var vitals=(store.vitals||[]).filter(function(v){return v.patientId===patient.id;}).map(safeObject);
  var symptoms=(store.symptoms||[]).filter(function(v){return v.patientId===patient.id;}).map(safeObject);
  var followups=(store.followups||[]).filter(function(v){return v.patientId===patient.id;}).map(safeObject);
  patient=safeObject(patient);
  record=safeObject(record);
  var pen=apts.filter(rhAppointmentActive).sort(function(a,b){return new Date(a.date)-new Date(b.date);});
  var att=apts.filter(function(a){return rhAppointmentStatus(a)==='completed';}).sort(function(a,b){return new Date(b.date)-new Date(a.date);});
  function row(l,v){if(!v)return'';return '<tr><td style="padding:6px 12px;font-weight:700;color:#6B7280;font-size:11px;text-transform:uppercase;letter-spacing:.05em;width:140px;vertical-align:top;border-bottom:1px solid #F3F4F6">'+l+'</td><td style="padding:6px 12px;color:#111827;font-size:13px;border-bottom:1px solid #F3F4F6">'+v+'</td></tr>';}
  function sec(title,col,rows){if(!rows.trim())return'';return '<div style="margin-bottom:16px"><div style="background:'+col+';border-radius:8px 8px 0 0;padding:8px 14px"><h3 style="color:white;font-size:11px;font-weight:800;margin:0;letter-spacing:.06em;text-transform:uppercase">'+title+'</h3></div><table style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-top:none">'+rows+'</table></div>';}
  function aptC(a){var d=a.date?new Date(a.date+'T00:00:00').toLocaleDateString('es-CR',{day:'2-digit',month:'short',year:'numeric'}):'';var t=a.time?(function(x){var pp=x.split(':'),hr=parseInt(pp[0]);return(hr>12?hr-12:(hr||12))+':'+pp[1]+' '+(hr>=12?'PM':'AM');})(a.time):'';return '<div style="border:1px solid #E5E7EB;border-radius:7px;padding:9px 12px;margin-bottom:6px"><div style="display:flex;justify-content:space-between;margin-bottom:2px"><strong style="font-size:13px">'+(a.doctor?'Dr. '+a.doctor:(a.reason||'Cita médica'))+'</strong><span style="font-size:10px;background:'+(a.attended?'#ECFDF5':'#FFFBEB')+';color:'+(a.attended?'#065F46':'#92400E')+';padding:2px 8px;border-radius:20px;font-weight:700">'+(a.attended?'Asistida':'Pendiente')+'</span></div>'+(a.specialty?'<div style="font-size:11px;color:#C4956A;font-weight:700">'+a.specialty+'</div>':'')+'<div style="font-size:11px;color:#6B7280">'+d+(t?' \u00b7 '+t:'')+(a.clinic?' \u00b7 '+a.clinic:'')+'</div>'+(a.attendedNotes?'<div style="font-size:11px;color:#047857;font-weight:600">Post-cita: '+a.attendedNotes+'</div>':'')+'</div>';}
  function healthEntry(title,extra,when){
    return '<div style="padding:9px 11px;border:1px solid #E5E7EB;border-radius:7px;margin-bottom:6px"><strong style="font-size:12px">'+title+'</strong>'+
      '<p style="font-size:11px;line-height:1.5;color:#586368;margin-top:5px">'+[when,extra].filter(Boolean).join(' · ')+'</p></div>';
  }
  function medC(m){return '<div style="border:1px solid #E5E7EB;border-radius:7px;padding:9px 12px;margin-bottom:6px"><div style="display:flex;justify-content:space-between"><strong style="font-size:13px">'+m.name+'</strong><span style="font-size:10px;background:'+(m.type==='ccss'?'#ECFDF5':'#FFFBEB')+';color:'+(m.type==='ccss'?'#065F46':'#92400E')+';padding:2px 8px;border-radius:20px;font-weight:700">'+(m.type==='ccss'?'CCSS':'Privado')+'</span></div>'+(m.dosage||m.frequency?'<div style="font-size:11px;color:#6B7280">'+(m.dosage||'')+(m.frequency?' \u00b7 '+m.frequency:'')+'</div>':'')+(m.notes?'<div style="font-size:11px;color:#9CA3AF">'+m.notes+'</div>':'')+'</div>';}
  var today=new Date().toLocaleDateString('es-CR',{day:'2-digit',month:'long',year:'numeric'});
  var bmi='';if(Number(record.weight)>0&&Number(record.height)>0){bmi=(Number(record.weight)/Math.pow(Number(record.height)/100,2)).toFixed(1)+' (referencia, sin interpretación clínica)';}
  var age=patient.birthdate?Math.floor((new Date()-new Date(patient.birthdate))/(365.25*24*3600*1000)):null;
  var html='<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Expediente - '+patient.name+'</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif;background:#fff;color:#111827;padding:28px;font-size:13px}@media print{body{padding:14px}.np{display:none!important}@page{margin:1.5cm;size:A4}}</style></head><body>'
    +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding-bottom:12px;border-bottom:2px solid #C4956A"><div style="display:flex;align-items:center;gap:10px"><div style="width:34px;height:34px;background:#C4956A;border-radius:9px;display:flex;align-items:center;justify-content:center"><svg width="18" height="18" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="10" stroke="white" stroke-width="1.5"/><path d="M9 13l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div><div style="font-size:15px;font-weight:800">Rodme Health</div><div style="font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em">Expediente Medico</div></div></div><div style="text-align:right"><div style="font-size:10px;color:#9CA3AF;text-transform:uppercase">Generado el</div><div style="font-size:12px;font-weight:800">'+today+'</div></div></div>'
    +'<div style="background:linear-gradient(135deg,#C4956A,#E8C4A0);border-radius:10px;padding:14px 18px;margin-bottom:16px;color:white"><div style="font-size:19px;font-weight:800;margin-bottom:2px">'+patient.name+'</div>'+(age?'<div style="font-size:12px;opacity:.85">'+age+' a\u00f1os'+(patient.gender?' \u00b7 '+(patient.gender==='F'?'Femenino':patient.gender==='M'?'Masculino':'Otro'):'')+'</div>':'')+( patient.whatsapp?'<div style="font-size:11px;opacity:.8">WhatsApp: '+patient.whatsapp+'</div>':'')+'</div>'
    +sec('Datos Vitales','#C4956A',row('Tipo de sangre',record.bloodType)+row('Frec. Cardiaca',record.heartRate?record.heartRate+' bpm':'')+row('Presion Arterial',record.bloodPressure)+row('Peso',record.weight?record.weight+' kg':'')+row('Altura',record.height?record.height+' cm':'')+row('IMC',bmi))
    +sec('Alergias y Condiciones','#F59E0B',row('Alergias',record.allergies)+row('Condiciones',record.chronicConditions))
    +sec('Historial Medico','#0EA5E9',row('Cirugias',record.surgeries)+row('Antecedentes',record.familyHistory)+row('Vacunas',record.vaccines))
    +sec('Seguro y Emergencias','#8B5CF6',row('Aseguradora',record.insurance)+row('Poliza',record.insuranceNumber)+row('Contacto',record.emergencyContact)+row('Telefono',record.emergencyPhone))
    +(record.notes?sec('Notas','#6B7280',row('Notas',record.notes)):'')
    +(pen.length>0?'<div style="margin-bottom:16px"><div style="background:#EF4444;border-radius:8px 8px 0 0;padding:8px 14px"><h3 style="color:white;font-size:11px;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:.06em">Citas Pendientes ('+pen.length+')</h3></div><div style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 8px 8px;padding:8px">'+pen.map(aptC).join('')+'</div></div>':'')
    +(att.length>0?'<div style="margin-bottom:16px"><div style="background:#22C55E;border-radius:8px 8px 0 0;padding:8px 14px"><h3 style="color:white;font-size:11px;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:.06em">Citas Asistidas ('+att.length+')</h3></div><div style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 8px 8px;padding:8px">'+att.map(aptC).join('')+'</div></div>':'')
    +(vitals.length>0?'<div style="margin-bottom:16px"><h3 style="margin-bottom:8px;color:#4C6151">Signos vitales ('+vitals.length+')</h3>'+
      vitals.slice().sort(function(a,b){return b.date.localeCompare(a.date);}).slice(0,30).map(function(x){var cfg=RH_METRICS.find(function(m){return m.id===x.metric;});
        return healthEntry(cfg?cfg.label:'Medición',x.value+(x.metric==='pressure'?'/'+x.value2:'')+' '+(x.unit||''),x.date);}).join('')+'</div>':'')
    +(symptoms.length>0?'<div style="margin-bottom:16px"><h3 style="margin-bottom:8px;color:#4C6151">Síntomas registrados ('+symptoms.length+')</h3>'+
      symptoms.slice().sort(function(a,b){return b.date.localeCompare(a.date);}).slice(0,30).map(function(x){return healthEntry(x.title,
        'Intensidad '+x.severity+'/10'+(x.notes?' · '+x.notes:''),x.date);}).join('')+'</div>':'')
    +(followups.length>0?'<div style="margin-bottom:16px"><h3 style="margin-bottom:8px;color:#4C6151">Seguimiento posterior ('+followups.length+')</h3>'+
      followups.map(function(x){return healthEntry(x.title,(x.status==='done'?'Completado':'Pendiente')+
        (x.dueDate?' · Vence: '+x.dueDate:''),x.date);}).join('')+'</div>':'')
    +(labs.length>0?'<div style="margin-bottom:16px"><h3 style="margin-bottom:8px;color:#4C6151">Laboratorios ('+labs.length+')</h3>'+
      labs.map(function(x){return healthEntry(x.title,[x.value!==undefined&&x.value!==''?x.value+' '+(x.unit||''):'',x.provider||''].filter(Boolean).join(' · '),x.date);}).join('')+'</div>':'')
    +(vaccines.length>0?'<div style="margin-bottom:16px"><h3 style="margin-bottom:8px;color:#4C6151">Vacunas ('+vaccines.length+')</h3>'+
      vaccines.map(function(x){return healthEntry(x.title,[x.dose?'Dosis '+x.dose:'',x.provider||''].filter(Boolean).join(' · '),x.date);}).join('')+'</div>':'')
    +(docs.length>0?'<div style="margin-bottom:16px"><h3 style="margin-bottom:8px;color:#4C6151">Documentos registrados ('+docs.length+')</h3>'+
      docs.map(function(x){return healthEntry(x.title,x.fileName||'Archivo no incluido en el informe',x.date);}).join('')+'</div>':'')
    +(meds.length>0?'<div style="margin-bottom:16px"><div style="background:#8B5CF6;border-radius:8px 8px 0 0;padding:8px 14px"><h3 style="color:white;font-size:11px;font-weight:800;margin:0;text-transform:uppercase;letter-spacing:.06em">Medicamentos ('+meds.length+')</h3></div><div style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 8px 8px;padding:8px">'+meds.map(medC).join('')+'</div></div>':'')
    +'<div style="font-size:10px;color:#6B7280;margin-top:10px">Datos introducidos manualmente en Rodme Health. No sustituyen un expediente médico oficial ni un diagnóstico.</div>'
    +'<div style="margin-top:18px;padding-top:10px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between"><span style="font-size:10px;color:#9CA3AF">Rodme Health \u00b7 '+today+'</span><span style="font-size:10px;color:#9CA3AF">Informe personal</span></div>'
    +'<div class="np" style="margin-top:18px;display:flex;gap:10px;justify-content:center"><button onclick="window.print()" style="padding:10px 24px;background:#C4956A;border:none;color:white;font-size:13px;font-weight:800;border-radius:999px;cursor:pointer">Descargar PDF</button><button onclick="window.close()" style="padding:10px 18px;background:#F3F4F6;border:1px solid #E5E7EB;color:#374151;font-size:13px;border-radius:999px;cursor:pointer">Cerrar</button></div>'
    +'</body></html>';
  var win=window.open('','_blank');if(!win){alert('El navegador bloqueó la ventana del informe. Permite ventanas emergentes para imprimir.');return;}win.opener=null;win.document.write(html);win.document.close();
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
// Búsqueda privada dentro de este dispositivo: nunca modifica la URL ni envía consultas.
function GlobalHealthSearch(p){
  var qs=useState(''),query=qs[0],setQuery=qs[1];
  var store=p.store;
  var q=query.trim().toLocaleLowerCase('es');
  var records=[];
  function push(kind,title,subtitle,route,item){records.push({kind:kind,title:title,subtitle:subtitle,route:route,item:item});}
  (store.patients||[]).forEach(function(v){push('Paciente',v.name,'Ficha familiar','patient',v);});
  (store.appointments||[]).forEach(function(v){var person=store.patients.find(function(x){return x.id===v.patientId;});
    push('Cita',v.reason||v.specialty||v.doctor||'Cita médica',[person&&person.name,v.clinic,fmtD(v.date)].filter(Boolean).join(' · '),'appointment',v);});
  (store.medications||[]).forEach(function(v){var person=store.patients.find(function(x){return x.id===v.patientId;});
    push('Medicamento',v.name,[person&&person.name,v.dosage].filter(Boolean).join(' · '),'medications',v);});
  [['vitals','Medición','vitals'],['symptoms','Síntoma','symptoms'],['followups','Seguimiento','followups']].forEach(function(x){
    (store[x[0]]||[]).forEach(function(v){
      var pt=store.patients.find(function(y){return y.id===v.patientId;});
      var label=x[0]==='vitals'?(RH_METRICS.find(function(m){return m.id===v.metric;})?.label||'Medición'):v.title;
      push(x[1],label,[pt?.name,fmtD(v.date)].filter(Boolean).join(' · '),'tracking',v);
    });
  });
  [['labs','Laboratorio'],['vaccines','Vacuna'],['documents','Documento']].forEach(function(pair){
    (store[pair[0]]||[]).forEach(function(v){var person=store.patients.find(function(x){return x.id===v.patientId;});
      push(pair[1],v.title,[person&&person.name,fmtD(v.date)].filter(Boolean).join(' · '),'health',v);});
  });
  var matches=q?records.filter(function(x){return (x.title+' '+x.subtitle+' '+x.kind).toLocaleLowerCase('es').includes(q);}).slice(0,25):[];
  function open(item){p.onSelect(item);p.onClose();}
  return h(Sheet,{title:'Buscar en Rodme Health',sub:'Búsqueda local',onClose:p.onClose},
    h('div',{className:'rh-search-panel'},
      h('label',{className:'rh-search-field'},h(Ic,{n:'search',s:19,c:'var(--text2)'}),
        h('input',{value:query,autoFocus:true,onChange:function(e){setQuery(e.target.value);},
          placeholder:'Paciente, cita, medicamento, laboratorio…','aria-label':'Buscar registros'}),
        query&&h('button',{onClick:function(){setQuery('');},'aria-label':'Borrar búsqueda'},'×')
      ),
      !q&&h('p',{className:'rh-search-hint'},'Busca entre los registros guardados en este navegador.'),
      q&&h('p',{className:'rh-search-hint'},matches.length+' resultado'+(matches.length===1?'':'s')+
        (matches.length===25?' (mostrando los primeros 25)':'')),
      matches.map(function(item,i){return h('button',{className:'rh-search-result',key:i,onClick:function(){open(item);}},
        h('span',{className:'rh-search-kind'},item.kind),h('strong',null,item.title),h('small',null,item.subtitle),
        h('span',{className:'rh-search-arrow','aria-hidden':'true'},'→')
      );}),
      q&&!matches.length&&h('div',{className:'rh-search-empty'},'Sin resultados para esa búsqueda.')
    )
  );
}

function App(){
  var th=useState(function(){return localStorage.getItem('rh_theme')||'light';});
  var theme=th[0],setThState=th[1];
  function setTheme(t){setThState(t);localStorage.setItem('rh_theme',t);document.documentElement.setAttribute('data-theme',t);}
  useEffect(function(){document.documentElement.setAttribute('data-theme',theme);},[theme]);

  // Acceso directo: reutilizar los registros existentes de la última sesión local.
  // No enviar ni verificar identificaciones ante servicios externos.
  function getLocalWorkspace(){
    var saved=lsg('rh_local_workspace');
    if(saved&&typeof saved.u==='string'&&saved.u)return saved;
    var previous=lsg('rh_session');
    if(!previous){try{previous=JSON.parse(sessionStorage.getItem('rh_session')||'null');}catch(e){}}
    var space=(previous&&typeof previous.u==='string'&&previous.u)
      ?{u:previous.u,name:previous.name||'Mi espacio'}
      :{u:'local:rodme',name:'Mi espacio'};
    lss('rh_local_workspace',space);
    return space;
  }
  var sessState=useState(getLocalWorkspace),sess=sessState[0];
  var user=sess.u;
  var store=useStore(user);
  var vs=useState('home');var view=vs[0],sv=vs[1];
  var adt=useState(''),draftDate=adt[0],setDraftDate=adt[1];
  var ms=useState(null);var modal=ms[0],sm=ms[1];
  var ps=useState(null);var selP=ps[0],ssp=ps[1];
  var as2=useState(null);var selA=as2[0],ssa=as2[1];
  var smS=useState(null);var selM=smS[0],ssm=smS[1];
  var ts=useState('pending');var tab=ts[0],stab=ts[1];
  var sbo=useState(false);var sideOpen=sbo[0],setSideOpen=sbo[1];
  var nbs=useState(true);var showNb=nbs[0],sNb=nbs[1];
  var quickState=useState(false),quickOpen=quickState[0],setQuickOpen=quickState[1];
  var healthState=useState('all'),healthPatient=healthState[0],setHealthPatient=healthState[1];
  var healthTabState=useState('labs'),healthTab=healthTabState[0],setHealthTab=healthTabState[1];
  var trackTabState=useState('pending'),trackTab=trackTabState[0],setTrackTab=trackTabState[1];
  var aptForTrackingState=useState(null),aptForTracking=aptForTrackingState[0],setAptForTracking=aptForTrackingState[1];
  function openTracking(patientId,t,appointment){
    setHealthPatient(patientId||'all');setTrackTab(t||'pending');setAptForTracking(appointment||null);sv('tracking');
  }
  var searchState=useState(false),searchOpen=searchState[0],setSearchOpen=searchState[1];
  function selectSearchResult(entry){
    if(entry.route==='patient'){ssp(entry.item);sv('patient');}
    else if(entry.route==='appointment'){ssa(entry.item);sm('view-apt');}
    else if(entry.route==='health'){sv('health');}
    else if(entry.route==='tracking'){
      setHealthPatient(entry.item.patientId||'all');
      setTrackTab(entry.kind==='Medición'?'vitals':entry.kind==='Síntoma'?'symptoms':'followups');
      setAptForTracking(null);sv('tracking');
    }
    else{sv(entry.route);}
  }
  var notifs=store.appointments.filter(function(a){var d=du(a.date);return d!==null&&d>=0&&d<=7&&rhAppointmentActive(a);});
  useEffect(function(){
    rhReminderScan(user,store);
    var timer=window.setInterval(function(){rhReminderScan(user,store);},5*60*1000);
    return function(){window.clearInterval(timer);};
  },[user,store.appointments,store.medications,store.doseLogs]);


  // Generic private-link import: fragment data are never written into the public source.
  function readImport(){
    try{
      var hash=window.location.hash||'';
      if(!hash.startsWith('#rh-import=')||hash.length>4500)return null;
      var x=JSON.parse(decodeURIComponent(hash.slice(11)));
      if(!x||x.v!==1||!Array.isArray(x.appointments)||!x.appointments.length||x.appointments.length>10)return null;
      return x.appointments.map(function(a){
        if(!a||['patient','date','reason','clinic'].some(function(k){return typeof a[k]!=='string';}))throw Error('invalid');
        var item={patient:a.patient.trim(),date:a.date,reason:a.reason.trim(),clinic:a.clinic.trim(),time:''};
        if(!item.patient||item.patient.length>120||!item.reason||item.reason.length>150||item.clinic.length>160
          ||!/^20\d\d-\d\d-\d\d$/.test(item.date)
          ||new Date(item.date+'T12:00:00').toISOString().slice(0,10)!==item.date)throw Error('invalid');
        if(typeof a.time==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(a.time))item.time=a.time;
        return item;
      });
    }catch(e){return null;}
  }
  var istate=useState(readImport),importItems=istate[0],setImportItems=istate[1];
  function closeImport(){
    setImportItems(null);
    if(window.location.hash.startsWith('#rh-import='))window.history.replaceState(null,'',window.location.pathname+window.location.search);
  }
  function addImported(){
    if(!importItems)return;
    try{
      var patients=lsg(uk(user,'p'))||[],appointments=lsg(uk(user,'a'))||[],added=0;
      if(!Array.isArray(patients)||!Array.isArray(appointments))throw Error('invalid');
      function norm(x){return String(x||'').trim().replace(/\s+/g,' ').toLowerCase();}
      importItems.forEach(function(item){
        var name=norm(item.patient);
        var pt=patients.find(function(p){return norm(p.name)===name;});
        if(!pt){
          var matches=patients.filter(function(p){return norm(p.name).startsWith(name+' ');});
          if(matches.length===1)pt=matches[0];
        }
        if(!pt){pt={id:uid(),name:item.patient,whatsapp:'',notes:'',avatar:'',birthdate:'',gender:''};patients.push(pt);}
        var exists=appointments.some(function(a){return a.patientId===pt.id&&a.date===item.date&&norm(a.clinic)===norm(item.clinic)&&norm(a.reason||a.specialty)===norm(item.reason);});
        if(exists)return;
        appointments.push({id:uid(),patientId:pt.id,doctor:'',specialty:'',reason:item.reason,
          clinic:item.clinic,address:'',date:item.date,time:item.time,type:'ccss',amount:'',deposit:'',
          notes:'',attended:false,attendedDoc:'',attendedNotes:''});
        added++;
      });
      store.setPatients(patients);
      store.setAppointments(appointments);
      closeImport();
      sv('appointments');
      window.alert(added?added+' cita'+(added===1?' agregada':'s agregadas')+' a tu agenda.':'Las citas ya estaban registradas.');
    }catch(e){window.alert('No se pudieron guardar las citas. Comprueba que el almacenamiento local esté habilitado.');}
  }

  var navItems=[{id:'home',n:'home',l:'Inicio'},{id:'patients',n:'user',l:'Pacientes'},{id:'appointments',n:'calendar',l:'Citas'},{id:'medications',n:'pill',l:'Medicamentos'},{id:'health',n:'file',l:'Salud'}];
  var prefs=lsg(uk(user,'prefs'))||{};
  var displayName=prefs.ownerName||(sess&&sess.name)||'Mi espacio';
  var uEmail=prefs.email||'';

  function NavBtn(q){
    var it=q.item,active=view===it.id||(view==='patient'&&it.id==='patients')||(view==='tracking'&&it.id==='health'),dot=it.id==='appointments'&&notifs.length>0;
    return h('button',{className:'nav-item'+(active?' active':''),onClick:function(){if(it.id==='health')setHealthPatient('all');sv(it.id);setSideOpen(false);},'aria-current':active?'page':undefined,},
      h('div',{className:'nav-ico'},h(Ic,{n:it.n,s:17,c:active?'white':'var(--text2)'})),
      h('span',null,it.l),
      dot&&h('span',{className:'nav-badge'},notifs.length)
    );
  }
  function Sidebar(){
    return h(React.Fragment,null,
      h('div',{className:'sidebar-logo'},
        h('div',{className:'logo-mark'},h('svg',{width:17,height:17,viewBox:'0 0 26 26',fill:'none'},h('circle',{cx:'13',cy:'13',r:'10',stroke:'white',strokeWidth:'1.5',fill:'none'}),h('path',{d:'M9 13l3 3 5-6',stroke:'white',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'}))),
        h('div',null,h('div',{className:'rh-board-sidebar-name'},'Rodme ',h('em',null,'Health')),null)
      ),
      h('div',{className:'sidebar-nav'},
        navItems.map(function(it){return h(NavBtn,{key:it.id,item:it});}),
        h('div',{className:'rh-board-sidebar-divider'}),
        h('button',{className:'nav-item'+(view==='tracking'?' active':''),onClick:function(){openTracking('all','pending');setSideOpen(false);}},
          h('div',{className:'nav-ico'},h(Ic,{n:'activity',s:17,c:'currentColor'})),h('span',null,'Seguimiento')),
        h('button',{className:'nav-item',onClick:function(){setHealthPatient('all');setHealthTab('documents');sv('health');setSideOpen(false);}},
          h('div',{className:'nav-ico'},h(Ic,{n:'file',s:17,c:'currentColor'})),h('span',null,'Documentos')),
        h('button',{className:'nav-item'+(view==='settings'?' active':''),onClick:function(){sv('settings');setSideOpen(false);}},
          h('div',{className:'nav-ico'},h(Ic,{n:'settings',s:17,c:'currentColor'})),h('span',null,'Configuración'))
      ),
      h('div',{className:'sidebar-user'},
        h('button',{className:'user-row',type:'button',onClick:function(){sv('settings');setSideOpen(false);}},
          h('div',{className:'av',style:{width:32,height:32,fontSize:'.66rem',flexShrink:0}},ini(displayName||uEmail)),
          h('div',{style:{flex:1,minWidth:0}},
            h('p',{style:{fontSize:'.78rem',fontWeight:700,color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},displayName||uEmail||'Mi espacio'),
            h('p',{style:{fontSize:'.65rem',color:'var(--text3)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}},uEmail)
          ),
          h(Ic,{n:'chevron',s:14,c:'var(--text3)'})
        )
      )
    );
  }

  return h('div',{className:'app-layout'+(view==='home'?' rh-wix-home-layout':'')},
    h('aside',{className:'sidebar'},h(Sidebar)),
    sideOpen&&h('div',{className:'sidebar-overlay show',onClick:function(){setSideOpen(false);},'aria-hidden':true}),
    sideOpen&&h('aside',{className:'sidebar open'},h(Sidebar)),

    h('div',{className:'main-content'},
      // Cabecera superior y navegación horizontal
      h('div',{className:'top-bar rh-desktop-header'},
        h('button',{className:'rh-nav-brand',onClick:function(){sv('home');}},
          h('span',{className:'rh-nav-symbol'},h('svg',{width:23,height:23,viewBox:'0 0 26 26',fill:'none'},
            h('path',{d:'M2 14h6l3-7 4 12 3-6h6',stroke:'white',strokeWidth:2.6,strokeLinecap:'round',strokeLinejoin:'round'}))),
          h('span',null,h('strong',null,'rodme',h('em',null,'health')),h('small',null,'SALUD FAMILIAR'))
        ),
        h('nav',{className:'rh-nav-links','aria-label':'Secciones'},
          navItems.map(function(it){return h('button',{key:it.id,className:'rh-nav-link'+((view===it.id||view==='patient'&&it.id==='patients'||view==='tracking'&&it.id==='health')?' active':''),onClick:function(){sv(it.id);},'aria-current':(view===it.id||view==='patient'&&it.id==='patients'||view==='tracking'&&it.id==='health')?'page':undefined,},
            h(Ic,{n:it.n,s:17,c:'currentColor'}),it.l,
            it.id==='appointments'&&notifs.length>0&&h('span',{className:'rh-nav-count'},notifs.length)
          );})
        ),
        h('div',{className:'rh-nav-end'},
          h('button',{className:'rh-board-header-search',onClick:function(){setSearchOpen(true);}},
            h(Ic,{n:'search',s:16,c:'currentColor'}),h('span',null,'Buscar pacientes, citas y medicamentos…')),
          h('button',{className:'rh-nav-theme rh-search-trigger',title:'Buscar registros','aria-label':'Buscar registros',onClick:function(){setSearchOpen(true);}},h(Ic,{n:'search',s:18,c:'currentColor'})),
          h('button',{className:'rh-nav-theme',title:'Cambiar tema',onClick:function(){setTheme(theme==='dark'?'light':'dark');}},h(Ic,{n:theme==='dark'?'sun':'moon',s:18,c:'currentColor'})),
          h('button',{className:'rh-nav-cta',onClick:function(){sm('add-apt');}},h(Ic,{n:'plus',s:15,c:'currentColor'}),' Nueva cita'),
          h('button',{className:'rh-nav-avatar',title:'Mi cuenta',onClick:function(){sv('settings');}},ini(displayName||uEmail||'U'))
        )
      ),

      // Mobile header
      h('div',{className:'mobile-header'},
        h('button',{className:'btn-icon',onClick:function(){setSideOpen(true);},'aria-label':'Abrir menú'},h(Ic,{n:'menu',s:20,c:'var(--text)'})),
        h('div',{style:{display:'flex',alignItems:'center',gap:8}},
          h('div',{className:'logo-mark',style:{width:26,height:26,borderRadius:8}},h('svg',{width:13,height:13,viewBox:'0 0 26 26',fill:'none'},h('circle',{cx:'13',cy:'13',r:'10',stroke:'white',strokeWidth:'1.5',fill:'none'}),h('path',{d:'M9 13l3 3 5-6',stroke:'white',strokeWidth:'2',strokeLinecap:'round',strokeLinejoin:'round'}))),
          h('span',{style:{fontWeight:800,fontSize:'.88rem',letterSpacing:'-.02em'}},'Rodme Health')
        ),
        h('div',{style:{display:'flex',gap:5}},
          h('button',{className:'btn-icon','aria-label':'Buscar registros',onClick:function(){setSearchOpen(true);}},h(Ic,{n:'search',s:18,c:'var(--text2)'})),
          h('button',{className:'btn-icon',onClick:function(){setTheme(theme==='dark'?'light':'dark');}},h(Ic,{n:theme==='dark'?'sun':'moon',s:17,c:'var(--text2)'})),
          h('button',{className:'av rh-profile-mobile-btn',type:'button','aria-label':'Abrir configuración',style:{width:32,height:32,fontSize:'.62rem',cursor:'pointer',border:0},onClick:function(){sv('settings');}},ini(displayName||uEmail))
        )
      ),

      // Page content
      h('div',{className:'page-content'+(view==='home'?' med1820-landing':' med1820-interior')},
        view==='home'&&h(HomeView,{store:store,sv:sv,sm:sm,ssa:ssa,ssp:ssp,user:user,onPending:function(){openTracking('all','pending');}}),
        view==='patients'&&h(PatientsView,{store:store,sm:sm,ssp:ssp,sv:sv,user:user}),
        view==='patient'&&h(PatientProfile,{store:store,patient:(store.patients.find(function(x){return selP&&x.id===selP.id;})||selP),onBack:function(){sv('patients');},onEdit:function(pt){ssp(pt);sm('edit-patient');},onAddApt:function(){setDraftDate('');sm('add-apt');},onRecord:function(){if(selP)lss(uk(user,'record_patient'),selP.id);sv('record');},onTracking:function(){openTracking(selP?.id||'all','vitals');},onEmergency:function(){if(selP)rhEmergencyCard(selP,rhReadRecord(user,selP.id,store.patients),store.medications);},onHealth:function(){setHealthPatient(selP?.id||'all');sv('health');},user:user,onAddMed:function(){sm('add-med');},onApt:function(apt){ssa(apt);sm('view-apt');}}),
        view==='appointments'&&h(ApptsView,{store:store,sm:sm,tab:tab,stab:stab,ssa:ssa,setDraftDate:setDraftDate}),
        view==='medications'&&h(MedsView,{store:store,sm:sm,ssm:ssm}),
        view==='health'&&h(HealthCenterView,{store:store,user:user,initialPatientId:healthPatient,initialTab:healthTab,onAppointment:function(a){ssa(a);sm('view-apt');},
          onTracking:function(){openTracking(healthPatient,'pending',null);}}),
        view==='tracking'&&h(TrackingView,{store:store,initialPatientId:healthPatient,initialTab:trackTab,onAppointment:function(a){ssa(a);sm('view-apt');},
          initialAppointmentId:aptForTracking&&aptForTracking.id,
          onRecords:function(){setHealthTab('labs');sv('health');},
          onOpenPending:function(item){
            if(item.kind==='appointment'){ssa(item.source);sm('view-apt');}
            else{setHealthTab(item.kind==='vaccine'?'vaccines':'labs');sv('health');}
          }}),
        view==='settings'&&h(SettingsView,{store:store,sv:sv,user:user,theme:theme,setTheme:setTheme}),
        view==='record'&&h(RecordView,{store:store,sv:sv,user:user})
      ),

      // Mobile bottom nav
      h('nav',{className:'bottom-nav','aria-label':'Navegación móvil'},
        h('div',{className:'bn-items'},navItems.map(function(it){
          var active=view===it.id||(view==='patient'&&it.id==='patients')||(view==='tracking'&&it.id==='health'),dot=it.id==='appointments'&&notifs.length>0;
          return h('button',{key:it.id,className:'bn-btn'+(active?' active':''),onClick:function(){sv(it.id);},'aria-current':active?'page':undefined,},
            h('span',{style:{position:'relative'}},h(Ic,{n:it.n,s:21,c:active?'var(--accent)':'var(--text3)'}),dot&&h('span',{className:'bn-dot'})),
            h('span',{className:'bn-lbl'},it.l)
          );
        }))
      )
    ),

    importItems&&h('div',{className:'rh-import-overlay'},
      h('section',{className:'rh-import-panel',role:'dialog','aria-modal':true,'aria-label':'Confirmar citas'},
        h('div',{className:'rh-import-top'},
          h('h2',null,'Confirmar citas'),
          h('button',{className:'rh-import-x',onClick:closeImport,'aria-label':'Cerrar'},h(Ic,{n:'close',s:18,c:'currentColor'}))
        ),
        h('p',{className:'rh-import-help'},'Revisa la información antes de guardarla en este navegador.'),
        h('div',{className:'rh-import-list'},importItems.map(function(a,i){
          return h('div',{className:'rh-import-entry',key:i},
            h('div',{className:'rh-import-day'},h('strong',null,new Date(a.date+'T12:00:00').toLocaleDateString('es-CR',{day:'numeric'})),
              h('small',null,new Date(a.date+'T12:00:00').toLocaleDateString('es-CR',{month:'short'}))),
            h('div',{className:'rh-import-detail'},h('strong',null,a.reason),h('span',null,a.patient),
              h('small',null,a.clinic),h('small',null,a.time?'Hora: '+a.time:'Hora: sin definir'))
          );
        })),
        h('p',{className:'rh-import-help'},'Si el paciente aún no está registrado, se añadirá automáticamente. Evitaremos crear citas idénticas.'),
        h('div',{className:'rh-import-actions'},
          h('button',{className:'rh-import-cancel',onClick:closeImport},'Cancelar'),
          h('button',{className:'rh-import-confirm',onClick:addImported},h(Ic,{n:'check',s:16,c:'white'}),'Agregar citas')
        )
      )
    ),
      h('div',{className:'rh-quick-add'},
        quickOpen&&h('div',{className:'rh-quick-menu'},
          h('button',{onClick:function(){setQuickOpen(false);setDraftDate('');sm('add-apt');}},
            h(Ic,{n:'calendar',s:17,c:'currentColor'}),' Nueva cita'),
          h('button',{onClick:function(){setQuickOpen(false);sm('add-patient');}},
            h(Ic,{n:'user',s:17,c:'currentColor'}),' Nuevo paciente'),
          h('button',{onClick:function(){setQuickOpen(false);sm('add-med');}},
            h(Ic,{n:'pill',s:17,c:'currentColor'}),' Nuevo medicamento'),
          h('button',{onClick:function(){setQuickOpen(false);sv('settings');}},
            h(Ic,{n:'shield',s:17,c:'currentColor'}),' Copia de seguridad')
        ),
        h('button',{className:'rh-quick-toggle',onClick:function(){setQuickOpen(!quickOpen);},
          'aria-expanded':quickOpen,'aria-label':quickOpen?'Cerrar accesos rápidos':'Abrir accesos rápidos'},
          h(Ic,{n:quickOpen?'close':'plus',s:22,c:'white'}),h('span',null,quickOpen?'Cerrar':'Agregar')
        )
      ),

    searchOpen&&h(GlobalHealthSearch,{store:store,onSelect:selectSearchResult,onClose:function(){setSearchOpen(false);}}),
    // Modals
    modal==='add-patient'&&h(PatientModal,{store:store,user:user,onClose:function(){sm(null);}}),
    modal==='edit-patient'&&h(PatientModal,{store:store,user:user,patient:selP,onDelete:function(){sv('patients');ssp(null);},onClose:function(){sm(null);}}),
    modal==='add-apt'&&h(AptModal,{store:store,initialDate:draftDate,initialPatientId:view==='patient'&&selP?selP.id:null,onClose:function(){sm(null);setDraftDate('');}}),
    modal==='edit-apt'&&h(AptModal,{store:store,appt:selA,onClose:function(){sm(null);}}),
    modal==='view-apt'&&h(AptDetail,{store:store,appt:(store.appointments.find(function(a){return selA&&a.id===selA.id;})||selA),onClose:function(){sm(null);},onEdit:function(){ssa(store.appointments.find(function(a){return selA&&a.id===selA.id;})||selA);sm('edit-apt');},onFollowup:function(){if(selA){openTracking(selA.patientId,'followups',selA);sm(null);}}}),
    modal==='add-med'&&h(MedModal,{store:store,initialPatientId:view==='patient'&&selP?selP.id:null,onClose:function(){sm(null);}}),
    modal==='edit-med'&&h(MedModal,{store:store,med:selM,onClose:function(){sm(null);}})
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
if('serviceWorker' in navigator&&location.protocol==='https:'){
  window.addEventListener('load',function(){navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(function(){});
  });
}
window.addEventListener('beforeinstallprompt',function(e){
  e.preventDefault();window._rhInstallPrompt=e;window.dispatchEvent(new Event('rh-install-ready'));
});
