import assert from 'node:assert/strict';
import {readFile,readdir,access} from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=f=>readFile(path.join(root,f),'utf8');
const ctx={window:{},URL,AbortController,setTimeout,clearTimeout};
vm.runInNewContext(await read('config.js'),ctx);vm.runInNewContext(await read('app.js'),ctx);
const c=ctx.window.VYB_CONFIG,h=ctx.window.VYB_EVENT_HELPERS,html=await read('index.html');
assert.equal(c.language.default,'en');assert.equal(c.contact.form.enabled,false);assert.equal(c.contact.form.formId,'');assert.equal(c.contact.email,'');assert.equal(c.contact.instagram,'');
assert.equal(c.seo.canonicalUrl,'https://lucayuale.github.io/Boda-demo/');
assert.deepEqual(Object.keys(c.translations.en).sort(),Object.keys(c.translations.es).sort());
for(const [_,key]of html.matchAll(/data-i18n(?:-aria|-placeholder)?="([^"]+)"/g))for(const lang of ['en','es'])assert.ok(c.translations[lang][key],`${lang}.${key}`);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
for(const [_,value]of html.matchAll(/(?:src|href)="([^"]+)"/g)){
 if(value.startsWith('#'))assert.ok(ids.includes(value.slice(1)),value);
 else if(!/^https:/.test(value)){assert.ok(!value.startsWith('/'),value);await access(path.join(root,value));}
}
for(const p of Object.values(c.images)){assert.ok(h.safeImageSource(p.src));await access(path.join(root,p.src));assert.ok(p.alt.es&&p.alt.en&&p.caption.es&&p.caption.en);}
for(const f of ['index.html','styles.css','app.js','config.js'])assert.ok(!/mecanico|mecánico|taller|auto repair|setmore|frenos|suspensi[oó]n|trabajo-[123]\.jpg|assets\/(?:hero|manifesto)\.jpg/i.test(await read(f)),`obsolete content: ${f}`);
assert.equal((await readdir(path.join(root,'assets'))).filter(f=>f.endsWith('.jpg')).length,0);
assert.equal(h.safeImageSource('../assets/x.webp'),'');assert.equal(h.safeImageSource('/assets/x.webp'),'');assert.equal(h.validHttpsUrl('javascript:alert(1)'),'');assert.equal(h.validHttpsUrl('https://user:pass@example.test'),'');
assert.match(await read('styles.css'),/prefers-reduced-motion/);assert.match(html,/<form[^>]+inert/);
const today='2026-11-06',valid={fullName:'Demo Guest',email:'demo@example.test',date:'2027-05-20',eventType:'wedding',guests:'80',message:'An illustrative event enquiry.',language:'en'};
assert.equal(Object.keys(h.validate(valid,today)).length,0);
for(const [key,value]of [['fullName',''],['fullName','x'],['email','wrong'],['date','2026-01-01'],['date','2027-02-30'],['eventType','fake'],['guests','0'],['guests','5.5'],['guests','5001'],['guests','-1'],['message','x'.repeat(2001)]])assert.ok(h.validate({...valid,[key]:value},today)[key],key);
assert.equal(h.validDate('2028-02-29',today),true);assert.equal(h.validDate('2027-02-29',today),false);assert.equal(h.validDate(today,today),true);
let calls=0;const forbidden=async()=>{calls++;throw Error('not allowed');};
assert.equal((await h.send(valid,{today,fetchImpl:forbidden})).status,'pending');assert.equal(calls,0);
const ready={contact:{form:{provider:'formspree',enabled:true,recipientConfirmed:true,formId:'testid123'}}};
assert.equal(h.getEndpoint(ready),'https://formspree.io/f/testid123');
for(const patch of [{enabled:false},{recipientConfirmed:false},{formId:'../evil'},{formId:'https://other.test'},{provider:'unknown'}])assert.equal(h.getEndpoint({contact:{form:{...ready.contact.form,...patch}}}),'');
assert.equal((await h.send({...valid,email:'bad'},{today,config:ready,fetchImpl:forbidden})).status,'invalid');
assert.equal((await h.send({...valid,_gotcha:'spam'},{today,config:ready,fetchImpl:forbidden})).status,'error');assert.equal(calls,0);
const mock=async(url,options)=>{assert.equal(url,h.getEndpoint(ready));assert.equal(options.credentials,'omit');assert.equal(options.method,'POST');const body=JSON.parse(options.body);assert.equal(body.date,valid.date);assert.equal(body.guests,80);assert.equal(body.celebration,'wedding');return {ok:true,status:200,json:async()=>({ok:true})};};
assert.equal((await h.send(valid,{today,config:ready,fetchImpl:mock})).status,'success');
for(const response of [{ok:false,status:400,json:async()=>({})},{ok:true,status:200,json:async()=>{throw Error('bad JSON')}},{ok:true,status:200,json:async()=>({ok:false})}])assert.equal((await h.send(valid,{today,config:ready,fetchImpl:async()=>response})).status,'error');
assert.equal((await h.send(valid,{today,config:ready,fetchImpl:async()=>({ok:false,status:429,json:async()=>({})})})).status,'limit');
assert.equal((await h.send(valid,{today,config:ready,fetchImpl:async()=>{throw Error('offline')}})).status,'network');
assert.equal((await h.send(valid,{today,config:ready,timeoutMs:5,fetchImpl:(_,options)=>new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(Error('timeout'))))})).status,'network');
console.log('PASS: relative resources and anchors, EN/ES coverage, no obsolete public content, neutral contacts, safe URLs, date/field validation, pending blocks network, configured payload, success/error/rate-limit/offline/timeout (mock requests only).');
