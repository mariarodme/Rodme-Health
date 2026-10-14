/* Rodme Health · Firebase Auth + Firestore family cloud service.
   Inactive until the owner configures firebase-config.js and publishes
   firestore.rules. NEVER put a service-account key or medical data here.
   Firebase web apiKey is a public client identifier, not a server secret. */
(function(){
  'use strict';
  var KEYS=['p','a','m','d','labs','vaccines','docs','vitals','symptoms','followups'];
  var EXTRA=['prefs','rec','record_patient'];
  var ALL=KEYS.concat(EXTRA).concat(['records']);
  var cfg=window.RH_FIREBASE_CONFIG;
  var enabled=!!(cfg&&cfg.apiKey&&cfg.authDomain&&cfg.projectId&&cfg.appId);
  var subscribers=[],unsub=[],db=null,auth=null,appUser=null,active=null;
  var status={phase:enabled?'loading':'disabled',error:'',familyId:'',role:'',email:'',members:[],pending:0};
  function emit(){subscribers.slice().forEach(function(fn){try{fn(Object.assign({},status));}catch(e){console.error(e);}});}
  function change(k,v){status[k]=v;emit();}
  function fail(err){console.error('Rodme nube',err);change('error',err&&err.message||'No se pudo completar la operación.');}
  function detach(){
    unsub.forEach(function(f){try{f();}catch(e){}});unsub=[];
    active=null;window.RH_ACTIVE_CLOUD=null;
  }
  function api(){if(!db||!auth)throw Error('Firebase no está disponible.');}
  function family(fid){return db.collection('families').doc(fid);}
  function writeAllowed(){
    if(!active||status.phase!=='ready')throw Error('La nube no está lista.');
    if(status.role!=='owner'&&status.role!=='editor')throw Error('Tu cuenta tiene acceso de solo lectura.');
    if(navigator.onLine===false)throw Error('No hay conexión. Por seguridad, no se guardan cambios sin internet.');
  }
  function lengthOk(item){
    var json=JSON.stringify(item);
    if(!json||json.length>870000)throw Error('Un registro o archivo es demasiado grande para sincronizarse. Reduce el adjunto.');
  }
  function validId(id){return typeof id==='string'&&/^[A-Za-z0-9_-]{1,90}$/.test(id);}
  function entryRef(kind,id){if(!validId(id))throw Error('Identificador de registro inválido.');return family(active.familyId).collection('entries').doc(kind+'__'+id);}
  function writeSettings(kind,value,batch){
    lengthOk(value);
    batch.set(family(active.familyId).collection('settings').doc(kind),{
      key:kind,value:value,updatedBy:auth.currentUser.uid,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  function changeList(kind,previous,next,ops){
    if(!Array.isArray(next))throw Error('Se esperaba una lista.');
    var old=new Map((previous||[]).filter(function(x){return x&&validId(x.id);}).map(function(x){return[x.id,x];}));
    var fresh=new Map();
    next.forEach(function(item){
      if(!item||!validId(item.id))throw Error('Existe un registro sin identificador válido.');
      if(fresh.has(item.id))throw Error('Hay registros duplicados; revisa la información.');
      fresh.set(item.id,item);
      if(JSON.stringify(old.get(item.id))!==JSON.stringify(item)){
        lengthOk(item);
        ops.push({kind:kind,id:item.id,item:item,remove:false});
      }
    });
    old.forEach(function(_,id){if(!fresh.has(id))ops.push({kind:kind,id:id,remove:true});});
  }
  async function commitOps(ops){
    api();var i=0;
    while(i<ops.length){
      var batch=db.batch(),slice=ops.slice(i,i+175);
      slice.forEach(function(op){
        if(op.extra)writeSettings(op.kind,op.value,batch);
        else if(op.remove)batch.delete(entryRef(op.kind,op.id));
        else batch.set(entryRef(op.kind,op.id),{
          kind:op.kind,item:op.item,
          updatedBy:auth.currentUser.uid,
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      i+=slice.length;
    }
  }
  var chain=Promise.resolve();
  function writeKey(kind,next){
    writeAllowed();
    if(ALL.indexOf(kind)===-1)throw Error('Tipo de registro no permitido.');
    var old=active.data[kind];
    var ops=[];
    if(kind==='records'){
      var before=old||{},after=next||{};
      Object.keys(after).forEach(function(id){
        if(!validId(id))throw Error('Paciente inválido en expediente.');
        if(JSON.stringify(before[id])!==JSON.stringify(after[id])){lengthOk(after[id]);ops.push({kind:'record',id:id,item:after[id]});}
      });
      Object.keys(before).forEach(function(id){if(!Object.prototype.hasOwnProperty.call(after,id))ops.push({kind:'record',id:id,remove:true});});
    }else if(KEYS.includes(kind))changeList(kind,old,next,ops);
    else ops.push({extra:true,kind:kind,value:next});
    active.data[kind]=next;
    if(!ops.length)return true;
    status.pending++;status.error='';emit();
    // Serialize local writes to avoid reorder; remote document granularity
    // means adding different records does not overwrite entire arrays.
    chain=chain.catch(function(){}).then(function(){return commitOps(ops);})
      .catch(function(err){fail(err);}).finally(function(){status.pending=Math.max(0,status.pending-1);emit();});
    return true;
  }
  function onData(){
    try{window.dispatchEvent(new CustomEvent('rh-cloud-data'));}catch(e){}
    emit();
  }
  function start(fid,role){
    detach();var data={};
    KEYS.forEach(function(k){data[k]=[];});
    EXTRA.forEach(function(k){data[k]=k==='record_patient'?'':{};});
    data.records={};
    active={familyId:fid,workspace:'family:'+fid,role:role,data:data};
    window.RH_ACTIVE_CLOUD=active;
    status.familyId=fid;status.role=role;status.pending=0;status.error='';
    status.phase='syncing';emit();
    var initialEntries=false,initialSettings=false;
    function ready(){
      if(initialEntries&&initialSettings&&status.phase==='syncing'){status.phase='ready';onData();}
    }
    unsub.push(family(fid).collection('entries').onSnapshot(function(snap){
      if(!active||active.familyId!==fid)return;
      var fresh={};KEYS.forEach(function(k){fresh[k]=[];});fresh.records={};
      snap.forEach(function(doc){
        var row=doc.data();
        if(!row||!row.kind||!row.item)return;
        if(row.kind==='record'&&validId(row.item.patientId||doc.id.slice(8))){
          var pid=doc.id.slice(8);fresh.records[pid]=row.item;
        }else if(KEYS.includes(row.kind)&&row.item.id&&validId(row.item.id)){
          fresh[row.kind].push(row.item);
        }
      });
      KEYS.forEach(function(k){active.data[k]=fresh[k];});
      active.data.records=fresh.records;
      initialEntries=true;ready();onData();
    },fail));
    unsub.push(family(fid).collection('settings').onSnapshot(function(snap){
      if(!active||active.familyId!==fid)return;
      var values={prefs:{},rec:{},record_patient:''};
      snap.forEach(function(doc){var row=doc.data();if(EXTRA.includes(doc.id)&&row&&row.value!==undefined)values[doc.id]=row.value;});
      EXTRA.forEach(function(k){active.data[k]=values[k];});
      initialSettings=true;ready();onData();
    },fail));
    if(role!=='owner'){
      unsub.push(family(fid).collection('members').doc(auth.currentUser.uid).onSnapshot(function(doc){
        if(!doc.exists){detach();status.phase='choose';status.familyId='';status.error='Tu acceso familiar fue retirado.';emit();}
        else if(doc.data().role!==role){start(fid,doc.data().role);}
      },fail));
    }
  }
  async function resolveUser(u){
    detach();appUser=u;status.error='';status.familyId='';
    if(!u){status.phase='login';status.email='';emit();return;}
    status.email=u.email||'';
    if(!u.emailVerified){status.phase='verify';emit();return;}
    status.phase='loading';emit();
    try{
      var us=await db.collection('users').doc(u.uid).get();
      var fid=us.exists&&us.data().familyId;
      if(!fid){status.phase='choose';emit();return;}
      var f=await family(fid).get();
      if(!f.exists){status.phase='choose';emit();return;}
      if(f.data().ownerUid===u.uid){start(fid,'owner');return;}
      var m=await family(fid).collection('members').doc(u.uid).get();
      if(!m.exists||!['editor','viewer'].includes(m.data().role)){
        status.phase='choose';status.error='No tienes acceso a ese espacio familiar.';emit();return;
      }
      start(fid,m.data().role);
    }catch(err){status.phase='error';fail(err);}
  }
  function loadScript(url){
    return new Promise(function(resolve,reject){
      var s=document.createElement('script');s.src=url;s.async=false;s.onload=resolve;
      s.onerror=function(){reject(Error('No se pudieron cargar los recursos de Firebase.'));};
      document.head.appendChild(s);
    });
  }
  async function init(){
    try{
      var v='12.19.0',base='https://www.gstatic.com/firebasejs/'+v+'/';
      await loadScript(base+'firebase-app-compat.js');
      await loadScript(base+'firebase-auth-compat.js');
      await loadScript(base+'firebase-firestore-compat.js');
      firebase.initializeApp(cfg);
      auth=firebase.auth();db=firebase.firestore();
      auth.onAuthStateChanged(function(u){resolveUser(u);},function(err){status.phase='error';fail(err);});
    }catch(e){status.phase='error';fail(e);}
  }
  var cloud={
    configured:enabled,
    getState:function(){return Object.assign({},status);},
    current:function(){return active;},
    subscribe:function(cb){subscribers.push(cb);cb(Object.assign({},status));return function(){subscribers=subscribers.filter(function(fn){return fn!==cb;});};},
    writeKey:writeKey,
    signUp:async function(email,password){
      api();var c=await auth.createUserWithEmailAndPassword(email.trim(),password);
      await c.user.sendEmailVerification();return c.user;
    },
    signIn:async function(email,password){api();return auth.signInWithEmailAndPassword(email.trim(),password);},
    sendVerification:async function(){api();if(!auth.currentUser)throw Error('Inicia sesión.');await auth.currentUser.sendEmailVerification();},
    refreshVerification:async function(){
      api();if(!auth.currentUser)throw Error('Inicia sesión.');
      await auth.currentUser.reload();await auth.currentUser.getIdToken(true);
      await resolveUser(auth.currentUser);
    },
    signOut:async function(){api();detach();await auth.signOut();},
    createFamily:async function(name){
      api();if(!auth.currentUser||!auth.currentUser.emailVerified)throw Error('Verifica tu correo.');
      var ref=db.collection('families').doc();
      await ref.set({ownerUid:auth.currentUser.uid,name:(name||'Mi familia').trim().slice(0,80),createdAt:firebase.firestore.FieldValue.serverTimestamp()});
      await db.collection('users').doc(auth.currentUser.uid).set({familyId:ref.id,email:auth.currentUser.email.toLowerCase()});
      start(ref.id,'owner');return ref.id;
    },
    joinFamily:async function(fid){
      api();if(!auth.currentUser||!auth.currentUser.emailVerified)throw Error('Verifica tu correo.');
      if(!/^[A-Za-z0-9]{15,40}$/.test(fid))throw Error('El código familiar no es válido.');
      var email=auth.currentUser.email.toLowerCase();
      var invite=await family(fid).collection('invites').doc(email).get();
      if(!invite.exists)throw Error('No hay invitación para este correo en esa familia.');
      var data=invite.data();
      if(!data.expiresAt||data.expiresAt.toMillis()<=Date.now())throw Error('La invitación venció. Pide que te inviten de nuevo.');
      await family(fid).collection('members').doc(auth.currentUser.uid).set({
        role:data.role,email:email,invitedBy:data.invitedBy,joinedAt:firebase.firestore.FieldValue.serverTimestamp()
      });
      await db.collection('users').doc(auth.currentUser.uid).set({familyId:fid,email:email});
      start(fid,data.role);
    },
    invite:async function(email,role){
      api();if(!active||status.role!=='owner')throw Error('Solo quien creó la familia puede invitar.');
      email=(email||'').trim().toLowerCase();
      if(!/^[^@\s/]+@[^@\s/]+\.[^@\s/]+$/.test(email))throw Error('Escribe un correo válido.');
      if(!['editor','viewer'].includes(role))throw Error('Permiso inválido.');
      if(email===auth.currentUser.email.toLowerCase())throw Error('Tu correo ya es propietario.');
      await family(active.familyId).collection('invites').doc(email).set({
        email:email,role:role,invitedBy:auth.currentUser.uid,
        expiresAt:firebase.firestore.Timestamp.fromMillis(Date.now()+7*86400000),
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
      });
    },
    listMembers:async function(){
      api();if(!active||status.role!=='owner')throw Error('Solo el administrador puede revisar permisos.');
      var snap=await family(active.familyId).collection('members').get();
      return snap.docs.map(function(doc){return{id:doc.id,email:doc.data().email,role:doc.data().role};});
    },
    removeMember:async function(uid){
      api();if(!active||status.role!=='owner')throw Error('Acción no permitida.');
      await family(active.familyId).collection('members').doc(uid).delete();
    },
    countLocal:function(local){
      if(!local)return 0;
      var prefix='rh_'+String(local).replace(/[^a-z0-9]/gi,'_').toLowerCase()+'_';
      var n=0;
      KEYS.forEach(function(k){try{var arr=JSON.parse(localStorage.getItem(prefix+k)||'[]');if(Array.isArray(arr))n+=arr.length;}catch(e){}});
      return n;
    },
    importLocal:async function(local){
      writeAllowed();if(status.role!=='owner')throw Error('Solo la persona administradora puede importar.');
      if(KEYS.some(function(k){return (active.data[k]||[]).length;})||Object.keys(active.data.records||{}).length)throw Error('El espacio en línea ya contiene registros. Para evitar sobrescribirlos, la importación inicial solo funciona con un espacio vacío.');
      var prefix='rh_'+String(local).replace(/[^a-z0-9]/gi,'_').toLowerCase()+'_';
      var ops=[];
      KEYS.forEach(function(k){
        var a=[];try{a=JSON.parse(localStorage.getItem(prefix+k)||'[]');}catch(e){}
        changeList(k,[],Array.isArray(a)?a:[],ops);
      });
      var rec={};try{rec=JSON.parse(localStorage.getItem(prefix+'records')||'{}');}catch(e){}
      Object.keys(rec||{}).forEach(function(id){if(!validId(id))throw Error('Expediente con identificador inválido.');lengthOk(rec[id]);ops.push({kind:'record',id:id,item:rec[id]});});
      EXTRA.forEach(function(k){
        var v=k==='record_patient'?'':{};try{v=JSON.parse(localStorage.getItem(prefix+k)||'null')||v;}catch(e){}
        ops.push({extra:true,kind:k,value:v});
      });
      status.pending++;emit();
      try{await commitOps(ops);return ops.length;}
      catch(err){fail(err);throw err;}
      finally{status.pending=Math.max(0,status.pending-1);emit();}
    }
  };
  window.RHCloud=cloud;
  if(enabled)init();
})();