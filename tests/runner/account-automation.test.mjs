import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
const records = new Map();
const users = new Map([['teacher', { uid: 'teacher', email: 'teacher@example.com', displayName: 'Teacher' }]]);
const ref = path => ({ path, id: path.split('/').at(-1), get: async () => snapshot(path), set: async (data, options) => records.set(path, options?.merge ? {...records.get(path),...data} : data), update: async data => update(path,data) });
const snapshot = path => ({ exists: records.has(path), data: () => records.get(path), id: path.split('/').at(-1), ref:ref(path) });
function update(path, data) { const target={...records.get(path)}; for(const [key,value] of Object.entries(data)){if(key.includes('.')) {const [a,b]=key.split('.');target[a]={...target[a],[b]:value};}else target[key]=value;} records.set(path,target); }
const db={doc:ref,collection:name=>({doc:id=>ref(`${name}/${id}`),where:()=>({get:async()=>({docs:[]})})}),runTransaction: async callback=>callback({get:r=>r.get(),set:(r,d,o)=>r.set(d,o),update:(r,d)=>update(r.path,d),create:(r,d)=>{assert.ok(!records.has(r.path));records.set(r.path,d);}}),batch:()=>({update(){},async commit(){}})};
globalThis.__mailTest={db,auth:{getUser:async uid=>users.get(uid)}, sent:[]};
const output='tests/runner/.account-automation-test.cjs';
await build({stdin:{contents:"export * from '../../server/email/automation'; export * from '../../server/email/templates'; export { administrator, cronAuthorized, default as handler } from '../../api/account-automation';",resolveDir:process.cwd()+'/tests/runner'},bundle:true,platform:'node',format:'cjs',packages:'external',outfile:output,plugins:[{name:'mock-admin-and-smtp',setup(b){b.onResolve({filter:/\/config$/},args=>args.importer.includes('/email/')||args.importer.includes('/api/')?{path:'mock-config',namespace:'mock'}:null);b.onLoad({filter:/.*/,namespace:'mock'},()=>({contents:`
 export const PRIMARY_PROJECT='testing-3d5b2'; export const ADMIN_UIDS=new Set(['admin']);
 export class AutomationError extends Error {constructor(status,message){super(message);this.status=status}}
 export const adminServices=()=>globalThis.__mailTest;
 export const connectionStatus=()=>({projects:[PRIMARY_PROJECT]});
 export const smtpConfig=()=>({auth:{user:'sender@example.com'}});
 export const siteUrl=()=> 'https://www.examsidemann.com';
 export const mailTransport=()=>({sendMail:async mail=>{globalThis.__mailTest.sent.push(mail);return {accepted:[mail.to.address],rejected:[]}}});
 `}));}}]});
try {
 const api=(await import('./.account-automation-test.cjs')).default;
 const settings={autoVerifyTeachers:true,emailsEnabled:true,signInEmails:true,teacherApprovalEmails:true};
 records.set('admin_settings/accountAutomation',settings);
 assert.throws(()=>api.validateSettings({...settings,recipient:'attacker@example.com'}));
 assert.throws(()=>api.validateSettings({...settings,autoVerifyTeachers:'true'}));
 assert.equal(api.administrator({uid:'student',admin:'true'}),false);
 assert.equal(api.administrator({uid:'admin'}),true);
 assert.equal(api.cronAuthorized('Bearer '+ 'a'.repeat(32),'a'.repeat(32)),true);
 assert.equal(api.cronAuthorized('Bearer nope','a'.repeat(32)),false);
 const response={setHeader(){},end(text){this.body=JSON.parse(text)}};
 await api.handler({method:'POST',headers:{}},response);assert.equal(response.statusCode,401);
 const user=users.get('teacher');const token={uid:'teacher',auth_time:Math.floor(Date.now()/1000)};
 const id=await api.queueSignIn(token,user,{},db);assert.ok(id);
 assert.equal(await api.queueSignIn(token,user,{},db),id);
 assert.equal(await api.queueSignIn({...token,auth_time:token.auth_time-3600},user,{},db),null);
 await api.deliverEmail(id,db,undefined,db);await api.deliverEmail(id,db,undefined,db);
 assert.equal(globalThis.__mailTest.sent.length,1);
 assert.equal(globalThis.__mailTest.sent[0].to.address,'teacher@example.com');
 records.set('users/teacher',{role:'teacher',teacherVerified:false,teacherApplication:{status:'pending'}});
 const approved=await api.approveTeacher('teacher','testing-3d5b2','automatic',true);
 assert.equal(approved.verified,true);assert.ok(approved.emailId);
 assert.equal(records.get('users/teacher').teacherApplication.status,'approved');
 assert.equal((await api.approveTeacher('teacher','testing-3d5b2','automatic',true)).emailId,approved.emailId);
 await api.deliverEmail(approved.emailId,db,{sendMail:async()=>{throw Object.assign(new Error('secret password'),{code:'EAUTH'});}},db);
 const failed=records.get('email_outbox/'+approved.emailId);assert.equal(failed.status,'retry');assert.equal(failed.lastError,'EAUTH');assert.ok(!JSON.stringify(failed).includes('secret password'));
 assert.equal((await api.deliverEmail(approved.emailId,db,undefined,db)).status,'unchanged');
 failed.nextAttemptAtMs=0;await api.deliverEmail(approved.emailId,db,undefined,db);assert.equal(records.get('email_outbox/'+approved.emailId).status,'sent');
 records.set('users/teacher',{role:'teacher',teacherVerified:false,teacherApplication:{status:'rejected'}});
 assert.equal((await api.approveTeacher('teacher','testing-3d5b2','automatic',true)).verified,false);
 records.set('admin_settings/accountAutomation',{...settings,autoVerifyTeachers:false});
 assert.equal((await api.approveTeacher('teacher','testing-3d5b2','automatic',true)).verified,false);
 records.set('admin_settings/accountAutomation',{...settings,emailsEnabled:false});
 assert.deepEqual(await api.drainEmails(),[]);
 const html=api.renderEmail('teacher-approved','<img src=x onerror=alert(1)>',Date.now()).html;
 assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img src=x'));assert.ok(!/\{\{\w+\}\}/.test(html));
 console.log('PASS: authenticated API guard, strict settings, sign-in deduplication, stale session suppression, canonical recipient, atomic teacher approval, rejected applications, SMTP retry, paused delivery, HTML escaping.');
} finally {await unlink(output);delete globalThis.__mailTest;}
