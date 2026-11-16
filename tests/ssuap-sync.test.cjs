const fs=require('fs'),assert=require('assert'),{JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8'),source=fs.readFileSync(require('path').join(__dirname,'..','ssuap.js'),'utf8').replace("const preview = new URLSearchParams(location.search).has('preview');","const preview = false;");
const keys=['human','circ','primary','system','specific','technique','contact','monitor','safety','efibi'];
const rec={schemaVersion:1,id:'test-id',revision:1,date:'2026-11-16',cs:'TEST',evaluator:'TEST',scenario:'TEST',people:['CA','E1','E2'].map(role=>({role,name:role,matricule:'',ratings:Object.fromEntries(keys.filter(k=>role==='CA'||!['contact','efibi'].includes(k)).map(k=>[k,2])),observations:{},messages:'',danger:false,justification:''}))};
async function scenario(kind){const docs=new Map();if(kind==='conflict')docs.set(rec.id,{...rec,revision:2});if(kind==='idempotent')docs.set(rec.id,{...rec,lastWriteToken:'seq1'});let writes=0,cb,release;const vc=new VirtualConsole();const dom=new JSDOM(html,{url:'https://example.test/EPO/?preview=1',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=()=>{};w.localStorage.setItem('epo_ssuap_queue',JSON.stringify({[rec.id]:{record:rec,baseRevision:0,seq:'seq1'}}));w.localStorage.setItem('epo_ssuap_draft',JSON.stringify({...rec,active:0,started:true,editing:true}));}}),w=dom.window;
 const db={collection:()=>({doc:id=>({id}),onSnapshot:f=>{cb=f;return ()=>{}}}),runTransaction:async work=>{if(kind==='denied'){let e=new Error('denied');e.code='permission-denied';throw e;}let staged;await work({get:async ref=>({exists:docs.has(ref.id),data:()=>docs.get(ref.id)}),set:(ref,value)=>{staged={ref,value}}});if(kind==='race'&&writes===0)await new Promise(r=>release=r);if(staged){writes++;docs.set(staged.ref.id,staged.value);}}};w.mock=db;w.eval('db=window.mock');w.eval(source);w.document.getElementById('ss-retry').click();await new Promise(r=>setTimeout(r,15));
 if(kind==='race'){w.document.querySelector('#ss-form').dispatchEvent(new w.Event('submit',{cancelable:true,bubbles:true}));release();await new Promise(r=>setTimeout(r,250));}
 const q=JSON.parse(w.localStorage.getItem('epo_ssuap_queue'));
 if(kind==='ok'){assert.equal(writes,1);assert.deepEqual(q,{});assert.equal(docs.get(rec.id).people.length,3);}
 if(kind==='conflict'){assert.equal(writes,0);assert(q[rec.id].conflict);assert.equal(docs.get(rec.id).revision,2);}
 if(kind==='denied'){assert.equal(writes,0);assert(q[rec.id]);assert(w.document.getElementById('ss-cloud').textContent.includes('refusée'));}
 if(kind==='idempotent'){assert.equal(writes,0);assert.deepEqual(q,{});}
 if(kind==='race'){assert.equal(writes,2);assert.equal(docs.get(rec.id).revision,2);assert.deepEqual(q,{});}
 dom.window.close();console.log('PASS '+kind);
}
(async()=>{for(const k of ['ok','conflict','denied','idempotent','race'])await scenario(k)})();
