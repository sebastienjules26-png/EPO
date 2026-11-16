const fs=require('fs'),path=require('path'),assert=require('assert'),{JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),source=fs.readFileSync(path.join(__dirname,'..','ssuap.js'),'utf8').replace("const preview = new URLSearchParams(location.search).has('preview');","const preview = false;");
const keys=['human','circ','primary','system','specific','technique','contact','monitor','safety','efibi'];
const rec={schemaVersion:1,id:'del-id',revision:1,date:'2026-11-16',cs:'TEST',evaluator:'TEST',scenario:'TEST',people:['CA','E1','E2'].map(role=>({role,name:role,matricule:'',ratings:Object.fromEntries(keys.filter(k=>role==='CA'||!['contact','efibi'].includes(k)).map(k=>[k,2])),observations:{},messages:'',danger:false,justification:''}))};
async function scenario(kind){
 const deleted=[];let confirmAnswer=kind!=='cancel';
 const dom=new JSDOM(html,{url:'https://example.test/EPO/?preview=1',runScripts:'dangerously',virtualConsole:new VirtualConsole(),beforeParse(w){w.scrollTo=()=>{};w.confirm=()=>confirmAnswer;w.HTMLElement.prototype.scrollIntoView=()=>{};
  if(kind==='pending')w.localStorage.setItem('epo_ssuap_queue',JSON.stringify({[rec.id]:{record:rec,baseRevision:0,seq:'s1'}}));
  else w.localStorage.setItem('epo_ssuap_cache',JSON.stringify([rec]));}}),w=dom.window;
 w.mock={collection:()=>({doc:id=>({id,delete:async()=>{deleted.push(id);}}),onSnapshot:()=>()=>{}}),runTransaction:async()=>{throw Object.assign(new Error('x'),{code:'unavailable'})}};
 w.eval('db=window.mock');w.eval(source);await new Promise(r=>setTimeout(r,15));
 const btn=w.document.querySelector(`[data-ss-del="${rec.id}"]`);assert(btn,'bouton Supprimer présent');btn.click();await new Promise(r=>setTimeout(r,15));
 const cache=JSON.parse(w.localStorage.getItem('epo_ssuap_cache')||'[]'),queue=JSON.parse(w.localStorage.getItem('epo_ssuap_queue')||'{}');
 if(kind==='server'){assert.deepEqual(deleted,[rec.id]);assert.equal(cache.length,0);assert(!w.document.querySelector(`[data-ss-del="${rec.id}"]`));}
 if(kind==='pending'){assert.deepEqual(deleted,[]);assert.deepEqual(queue,{});assert(!w.document.querySelector(`[data-ss-del="${rec.id}"]`));}
 if(kind==='cancel'){assert.deepEqual(deleted,[]);assert.equal(cache.length,1);}
 w.close();console.log('PASS delete '+kind);
}
(async()=>{for(const k of ['server','pending','cancel'])await scenario(k)})().catch(e=>{console.error(e);process.exit(1)});
