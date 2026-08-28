let person = null;
let step = 0;
let memoryIndex = 0;
let people = [];
let memoriesByPerson = {};
let adminSession = null;
let adminPeople = [];

const steps = ["wish","memories","rakhi","letter","reward","level","save","end"];
const cfg = window.RAKHI_CONFIG || {};
const dbReady = cfg.supabaseUrl && !cfg.supabaseUrl.includes("YOUR_") && cfg.supabaseAnonKey && !cfg.supabaseAnonKey.includes("YOUR_");
const sbClient = (dbReady && window.supabase && typeof window.supabase.createClient === "function")
  ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
  : null;

function esc(s="") { return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function root(){return document.getElementById("app");}
function progress(){const p=document.querySelector(".progress i");if(p)p.style.width=`${Math.min(100,(step/(steps.length-1))*100)}%`;}
function layout(inner){root().innerHTML=`<div class="progress"><i></i></div><section class="screen"><div class="container"><div class="festival-ribbon"><span>🪔 Diya of Love</span><span>🌸 Family &amp; Memories</span><span>🧵 Bond Forever</span></div>${inner}</div></section>`;progress();}
function nav(){return `<div class="navrow"><button class="btn ghost" onclick="goBack()">← Back</button><button class="btn" onclick="goNext()">Continue →</button></div>`;}
function goNext(){step=Math.min(step+1,steps.length-1);render();}
function goBack(){if(step>0){step--;render();}}

async function loadPublicData(){
  if(!sbClient){ people=[]; return; }
  const {data:p,error}=await sbClient.from("people").select("*").order("created_at",{ascending:true});
  if(error){console.error(error);return;}
  people=p||[];
  const {data:m,error:me}=await sbClient.from("memories").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:true});
  if(me){console.error(me);return;}
  memoriesByPerson={};
  (m||[]).forEach(x=>{
    (memoriesByPerson[x.person_id] ||= []).push({...x,src:sbClient.storage.from(cfg.photoBucket).getPublicUrl(x.storage_path).data.publicUrl});
  });
}
function fallbackMessage(){
  layout(`<div class="eyebrow">Almost ready 🎀</div><h1>Raksha Bandhan</h1><p class="lead">The website is built for the new Master Dashboard. Connect the Supabase project in <code>config.js</code> and run the included <code>supabase.sql</code> setup to load your family stories.</p><div class="setup-note"><b>Master setup:</b> open <code>README.md</code> for the 5-minute setup.</div>`);
}
function render(){
  if(!person)return choose();
  const s=steps[step];
  ({wish,memories,rakhi,letter,reward,level,save:saveMemory,end:ending}[s])();
}
function choose(){
  if(!people.length){fallbackMessage();return;}
  layout(`<div class="eyebrow">A little surprise</div><h1>Happy Raksha Bandhan</h1><p class="lead">This isn't the usual greeting card.<br>Choose your name to begin your own Rakhi story. ❤️</p><div class="grid">${people.map(p=>{
    const ms=memoriesByPerson[p.id]||[];const avatar=ms[0]?.src;
    return `<div class="person"><div class="avatar">${avatar?`<img src="${esc(avatar)}" alt="${esc(p.name)}">`:`🧵`}</div><h3>${esc(p.name)}</h3><div class="muted">${esc(p.relationship)}</div><button class="btn" onclick="selectPerson('${esc(p.id)}')">Open my Rakhi story →</button></div>`;}).join("")}</div><p class="muted">A private little celebration made with love. ❤️</p>`);
}
function selectPerson(id){person=people.find(p=>p.id===id);step=0;memoryIndex=0;render();}
function wish(){layout(`<div class="eyebrow">For ${esc(person.relationship)}</div><h1>Happy Raksha Bandhan,<br>${esc(person.name)}! ❤️</h1><p class="lead">${esc(person.intro)}</p><div style="font-size:5rem;margin:18px">🪔 🧵 ✨</div>${nav()}`);}
function memories(){const photos=memoriesByPerson[person.id]||[];if(!photos.length){layout(`<div class="eyebrow">Memory vault</div><h2>Our Memories ❤️</h2><p class="lead">No photos have been added yet.</p>${nav()}`);return;}const m=photos[memoryIndex];layout(`<div class="eyebrow">Memory ${memoryIndex+1} of ${photos.length}</div><h2>Our Memories ❤️</h2><div class="memory-wrap"><div class="photo-frame"><img src="${esc(m.src)}" alt="Memory with ${esc(person.name)}"><div class="caption">${esc(m.caption||"A memory worth keeping.")}</div></div><div class="counter">${memoryIndex+1} / ${photos.length}</div></div><div class="navrow">${memoryIndex>0?`<button class="btn ghost" onclick="memoryPrev()">← Previous</button>`:""}${memoryIndex<photos.length-1?`<button class="btn" onclick="memoryNext()">Next memory →</button>`:`<button class="btn" onclick="goNext()">Continue to the Rakhi 🧵 →</button>`}</div>`);}
function memoryNext(){memoryIndex++;memories();} function memoryPrev(){memoryIndex--;memories();}
function rakhi(){layout(`<div class="eyebrow">The important part</div><h2>Time to Tie the Rakhi 🧵</h2><p class="lead">Tap the button and tie your digital Rakhi.</p><div class="rakhi-stage"><div class="wrist"><div class="rakhi" id="rakhi">🧵</div></div></div><button class="btn gold" id="tieBtn" onclick="tieRakhi()">TIE THE RAKHI</button><p id="tiedMsg" class="lead" style="display:none"><b>Rakhi successfully tied! ❤️</b></p><div class="navrow"><button class="btn ghost" onclick="goBack()">← Back</button><button class="btn" id="rakhiContinue" style="display:none" onclick="goNext()">Continue →</button></div>`);}
function tieRakhi(){document.getElementById("rakhi").classList.add("tied");document.getElementById("tieBtn").style.display="none";document.getElementById("tiedMsg").style.display="block";document.getElementById("rakhiContinue").style.display="inline-block";confetti();}
function letter(){layout(`<div class="eyebrow">A message from me</div><h2>There's something I wanted to tell you...</h2><div class="envelope">💌</div><button class="btn gold" onclick="openLetter()">OPEN YOUR LETTER</button><div class="navrow"><button class="btn ghost" onclick="goBack()">← Back</button></div>`);}
function openLetter(){layout(`<div class="eyebrow">For ${esc(person.name)}</div><h2>Your Letter ❤️</h2><div class="letter">${esc(person.letter||"Happy Raksha Bandhan! ❤️")}</div>${nav()}`);}
function rewardImageSrc(p){return p.reward_image_path && sbClient ? sbClient.storage.from(cfg.photoBucket).getPublicUrl(p.reward_image_path).data.publicUrl : null;}
function reward(){const img=rewardImageSrc(person);layout(`<div class="eyebrow">You've unlocked it</div><h2>Your Rakhi Reward 🎁</h2><div class="reward">${img?`<img src="${esc(img)}" alt="Reward for ${esc(person.name)}" class="reward-photo">`:`<div class="gift">🎁</div>`}<h3>${esc(person.reward_title||"A Special Treat")}</h3><p class="lead">${esc(person.reward_text||"A little reward just for you. ❤️")}</p></div>${nav()}`);}
function level(){const l=person;layout(`<div class="eyebrow">Official sibling statistics</div><h2>Your Sister Level ❤️</h2><div class="level-card"><div style="font-size:1rem;opacity:.8">${esc(l.name)}</div><h2>LEVEL ${esc(l.score)} / 100</h2><div class="bar"><i id="levelBar"></i></div><h3>${esc(l.status)}</h3><div class="stats"><div class="stat"><b>${esc(l.memories)}%</b>Memories ❤️</div><div class="stat"><b>∞</b>Bond ❤️</div></div></div>${nav()}`);setTimeout(()=>{const b=document.getElementById("levelBar");if(b)b.style.width=`${Math.min(100,l.score)}%`},80);}
function saveMemory(){layout(`<div class="eyebrow">Your 2026 Rakhi Archive</div><h2>Save Your Rakhi Memory 📸</h2><p class="lead">Save this personalized card as a screenshot or use your browser's print/save-to-PDF option.</p><div class="save-card" id="saveCard"><div class="seal">🧵</div><div class="eyebrow">RAKHI 2026</div><h2>${esc(person.name)} ❤️</h2><p>RAKHI: TIED ✓</p><p>MEMORIES: SHARED ✓</p><p>LETTER: OPENED ✓</p><p>REWARD: UNLOCKED ✓</p><h3>❤️ SISTER LEVEL: ∞</h3><div class="signature">Happy Raksha Bandhan</div><div class="muted">From your Rakhi brother ❤️</div></div><div class="navrow"><button class="btn gold" onclick="saveAsImage()">📸 Save My Rakhi Memory</button><button class="btn" onclick="goNext()">See the ending →</button></div>`);}
function saveAsImage(){window.print();}
function ending(){layout(`<div class="eyebrow">Until the next adventure...</div><h1>Our Rakhi Story ❤️</h1><p class="lead" style="font-size:1.35rem">Some people are given to us by life.<br>Some are given to us by family.<br>And some become a part of our story.<br><br><b>I'm lucky you're part of mine.</b> ❤️</p><div style="font-size:4rem;margin:25px">🪔 🧵 ✨</div><h2 style="font-size:2.5rem">Happy Raksha Bandhan, ${esc(person.name)}!</h2><div class="signature">— Your Rakhi brother ❤️</div><div class="navrow"><button class="btn ghost" onclick="person=null;step=0;choose()">← Back to names</button><button class="btn" onclick="step=0;memoryIndex=0;render()">Experience again ↻</button></div>`);}
function confetti(){for(let i=0;i<45;i++){const d=document.createElement("div");d.textContent=["✨","❤️","🌸","🧵","🎉"][Math.floor(Math.random()*5)];d.style.cssText=`position:fixed;left:${Math.random()*100}vw;top:-20px;font-size:${12+Math.random()*20}px;z-index:50;animation:fall ${2+Math.random()*2}s linear forwards`;document.body.appendChild(d);setTimeout(()=>d.remove(),4500);}}
const st=document.createElement("style");st.textContent="@keyframes fall{to{transform:translateY(110vh) rotate(500deg);opacity:0}}";document.head.appendChild(st);

async function openAdmin(){document.getElementById("adminModal").classList.remove("hidden");if(!sbClient){showAdminSetup();return;}const {data:{session}}=await sbClient.auth.getSession();adminSession=session;if(!session){showLogin();return;}await refreshAdmin();showDashboard();}
function showAdminSetup(){
  const sdkMissing = dbReady && (!window.supabase || typeof window.supabase.createClient !== "function");
  document.getElementById("adminContent").innerHTML = sdkMissing
    ? `<div class="eyebrow">CONNECTION CHECK</div><h2>Supabase library didn't load</h2><p class="lead">Your Master button is working, but the Supabase JavaScript library could not load. Check your internet connection, disable any blocker temporarily, then refresh the page.</p><div class="setup-note"><b>If it still fails:</b> open the site through GitHub Pages instead of directly from a local file.</div>`
    : `<div class="eyebrow">RAKSHA MASTER</div><h2>Master Panel 👑</h2><p class="lead">Connect Supabase first. This Version 2 panel is ready for secure login, photo uploads and saved family data.</p><div class="setup-note"><b>Next:</b> open <code>README.md</code>, create the Supabase project, run <code>supabase.sql</code>, then paste the project URL and anon key into <code>config.js</code>.</div>`;
}
function showLogin(){document.getElementById("adminContent").innerHTML=`<div class="eyebrow">PRIVATE AREA</div><h2>Raksha Master 👑</h2><p class="muted">Only your admin account can manage the site.</p><form id="loginForm" class="admin-form"><label>Email<input id="loginEmail" type="email" required autocomplete="username"></label><label>Password<input id="loginPassword" type="password" required autocomplete="current-password"></label><button class="btn gold" type="submit">LOGIN</button><div id="loginError" class="error"></div></form>`;document.getElementById("loginForm").onsubmit=async e=>{e.preventDefault();const {data,error}=await sbClient.auth.signInWithPassword({email:loginEmail.value,password:loginPassword.value});if(error){loginError.textContent=error.message;return;}adminSession=data.session;await refreshAdmin();showDashboard();};}
async function refreshAdmin(){const {data,error}=await sbClient.from("people").select("*").order("created_at",{ascending:true});if(error){alert(error.message);return;}adminPeople=data||[];}
function showDashboard(){document.getElementById("adminContent").innerHTML=`<div class="admin-head"><div><div class="eyebrow">RAKSHA MASTER</div><h2>Master Dashboard 👑</h2><p class="muted">Manage people, photos, letters, rewards and Sister Levels.</p></div><button class="btn ghost" id="logoutBtn">Logout</button></div><div class="admin-toolbar"><button class="btn gold" onclick="newPersonForm()">＋ ADD PERSON</button><button class="btn ghost" onclick="refreshAdmin().then(showDashboard)">↻ Refresh</button></div><div id="adminList">${adminPeople.map(adminPersonCard).join("")||`<div class="admin-item">No people yet. Add your first sister/cousin.</div>`}</div>`;document.getElementById("logoutBtn").onclick=async()=>{await sbClient.auth.signOut();adminSession=null;showLogin();};}
function adminPersonCard(p){const ms=memoriesByPerson[p.id]||[];return `<div class="admin-item"><div class="admin-person-title"><div><h3>${esc(p.name)}</h3><span class="muted">${esc(p.relationship)} · Level ${esc(p.score)} · ${ms.length} photos</span></div><div class="navrow compact"><button class="btn" onclick="editPerson('${p.id}')">Edit</button><button class="btn ghost" onclick="deletePerson('${p.id}')">Delete</button></div></div><div class="admin-mini">🎁 ${esc(p.reward_title)} · ❤️ ${esc(p.status)}</div><div class="admin-actions"><button class="btn small" onclick="editPerson('${p.id}')">✏️ Details</button><button class="btn small gold" onclick="photoManager('${p.id}')">📸 Photos</button></div></div>`;}
function personForm(p={}){const curImg=rewardImageSrc(p);return `<form id="personForm" class="admin-form"><label>Name<input id="fName" required value="${esc(p.name||"")}"></label><label>Relationship<input id="fRel" required value="${esc(p.relationship||"Sister")}"></label><label>Intro<textarea id="fIntro">${esc(p.intro||"")}</textarea></label><label>Letter<textarea id="fLetter" rows="9">${esc(p.letter||"")}</textarea></label><div class="form-grid"><label>Reward title<input id="fRewardTitle" value="${esc(p.reward_title||"")}"></label><label>Reward text<input id="fRewardText" value="${esc(p.reward_text||"")}"></label></div><label>Reward image (optional)${curImg?`<img src="${esc(curImg)}" class="reward-preview">`:""}<input id="fRewardImage" type="file" accept="image/*">${p.reward_image_path?`<span class="muted">Leave blank to keep the current image, or choose a new file to replace it.</span><label style="flex-direction:row;align-items:center;gap:8px;font-weight:400"><input type="checkbox" id="fRewardImageRemove" style="width:auto"> Remove current reward image</label>`:""}</label><div class="form-grid"><label>Sister Level<input id="fScore" type="number" min="0" max="100" value="${p.score??100}"></label><label>Status<input id="fStatus" value="${esc(p.status||"IRREPLACEABLE")}"></label></div><div class="form-grid"><label>Memories %<input id="fMemories" type="number" min="0" max="100" value="${p.memories??100}"></label><div class="bond-note">♾️ <b>Bond:</b> Forever</div></div><div class="navrow"><button type="button" class="btn ghost" onclick="showDashboard()">Cancel</button><button class="btn gold" type="submit">SAVE PERSON</button></div></form>`;}
function newPersonForm(){document.getElementById("adminContent").innerHTML=`<div class="eyebrow">NEW BOND</div><h2>Add Sister / Cousin</h2>${personForm()}`;bindPersonForm(null);}
function editPerson(id){const p=adminPeople.find(x=>x.id===id);document.getElementById("adminContent").innerHTML=`<div class="eyebrow">EDIT BOND</div><h2>${esc(p.name)} ❤️</h2>${personForm(p)}<div class="navrow"><button class="btn ghost" onclick="photoManager('${id}')">📸 Manage Photos</button></div>`;bindPersonForm(id);}
function bindPersonForm(id){document.getElementById("personForm").onsubmit=async e=>{
  e.preventDefault();
  const existing=id?adminPeople.find(x=>x.id===id):null;
  const slug=(existing?existing.slug:fName.value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"person-"+Date.now());
  const payload={slug,name:fName.value.trim(),relationship:fRel.value.trim(),intro:fIntro.value,letter:fLetter.value,reward_title:fRewardTitle.value,reward_text:fRewardText.value,score:Number(fScore.value),status:fStatus.value,memories:Number(fMemories.value),updated_at:new Date().toISOString()};
  const removeBox=document.getElementById("fRewardImageRemove");
  const oldPath=existing?existing.reward_image_path:null;
  let newPath=oldPath;
  const file=document.getElementById("fRewardImage").files[0];
  if(file){
    const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
    const path=`${slug}/reward-${crypto.randomUUID()}.${ext}`;
    const up=await sbClient.storage.from(cfg.photoBucket).upload(path,file,{contentType:file.type||"image/jpeg",upsert:false});
    if(up.error){alert(up.error.message);return;}
    newPath=path;
  } else if(removeBox && removeBox.checked){
    newPath=null;
  }
  payload.reward_image_path=newPath;
  let result=id?await sbClient.from("people").update(payload).eq("id",id):await sbClient.from("people").insert(payload);
  if(result.error){alert(result.error.message);return;}
  if(newPath!==oldPath && oldPath){await sbClient.storage.from(cfg.photoBucket).remove([oldPath]);}
  await loadPublicData();await refreshAdmin();showDashboard();
};}
async function deletePerson(id){const p=adminPeople.find(x=>x.id===id);if(!confirm(`Delete ${p.name} and all their memory records?`))return;const {error}=await sbClient.from("people").delete().eq("id",id);if(error){alert(error.message);return;}await loadPublicData();await refreshAdmin();showDashboard();}
async function photoManager(id){const p=adminPeople.find(x=>x.id===id);const {data:ms}=await sbClient.from("memories").select("*").eq("person_id",id).order("sort_order").order("created_at");const list=ms||[];document.getElementById("adminContent").innerHTML=`<div class="eyebrow">MEMORY VAULT</div><h2>${esc(p.name)} 📸</h2><p class="muted">Upload a photo, then add its caption. Images are stored in your Supabase storage bucket.</p><form id="uploadForm" class="admin-form"><label>Photo<input id="photoFile" type="file" accept="image/*" required></label><label>Caption<input id="photoCaption" value="A memory worth keeping. ❤️"></label><button class="btn gold" type="submit">UPLOAD PHOTO</button></form><div class="photo-admin-grid">${list.map(m=>{const src=sbClient.storage.from(cfg.photoBucket).getPublicUrl(m.storage_path).data.publicUrl;return `<div class="photo-admin"><img src="${esc(src)}"><input id="cap-${m.id}" value="${esc(m.caption)}"><div class="navrow compact"><button class="btn small" onclick="updateCaption('${m.id}')">Save caption</button><button class="btn small ghost" onclick="deletePhoto('${m.id}','${esc(m.storage_path)}','${id}')">Delete</button></div></div>`;}).join("")||`<div class="admin-item">No photos yet.</div>`}</div><div class="navrow"><button class="btn ghost" onclick="showDashboard()">← Dashboard</button></div>`;document.getElementById("uploadForm").onsubmit=async e=>{e.preventDefault();const file=photoFile.files[0];if(!file)return;const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");const path=`${p.slug}/${crypto.randomUUID()}.${ext}`;const up=await sbClient.storage.from(cfg.photoBucket).upload(path,file,{contentType:file.type||"image/jpeg",upsert:false});if(up.error){alert(up.error.message);return;}const {data:existing}=await sbClient.from("memories").select("sort_order").eq("person_id",id).order("sort_order",{ascending:false}).limit(1);const next=(existing?.[0]?.sort_order||0)+1;const ins=await sbClient.from("memories").insert({person_id:id,storage_path:path,caption:photoCaption.value,sort_order:next});if(ins.error){await sbClient.storage.from(cfg.photoBucket).remove([path]);alert(ins.error.message);return;}await loadPublicData();photoManager(id);};}
async function updateCaption(id){const val=document.getElementById(`cap-${id}`).value;const {error}=await sbClient.from("memories").update({caption:val}).eq("id",id);if(error)alert(error.message);else{await loadPublicData();alert("Caption saved ❤️");}}
async function deletePhoto(memoryId,path,personId){if(!confirm("Delete this photo?"))return;const a=await sbClient.from("memories").delete().eq("id",memoryId);if(a.error){alert(a.error.message);return;}const b=await sbClient.storage.from(cfg.photoBucket).remove([path]);if(b.error)console.warn(b.error);await loadPublicData();photoManager(personId);}

document.getElementById("adminBtn").onclick=openAdmin;
document.getElementById("closeAdmin").onclick=()=>document.getElementById("adminModal").classList.add("hidden");
document.getElementById("adminModal").addEventListener("click",e=>{if(e.target.id==="adminModal")e.currentTarget.classList.add("hidden")});
function makeParticles(){const holder=document.getElementById("particles");for(let i=0;i<30;i++){const d=document.createElement("span");d.className="particle";d.textContent=["✦","•","🌸","✨","🪔","❤️"][i%6];d.style.left=Math.random()*100+"%";d.style.animationDelay=(-Math.random()*7)+"s";d.style.fontSize=(10+Math.random()*14)+"px";holder.appendChild(d);}}
makeParticles();
(async()=>{
  try {
    if(sbClient){ await loadPublicData(); }
    render();
  } catch (error) {
    console.error("Startup error:", error);
    fallbackMessage();
  }
})();
