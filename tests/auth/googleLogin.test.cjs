const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require(process.cwd() + '/node_modules/typescript');
const code = ts.transpileModule(fs.readFileSync('src/services/firebase.ts', 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText;
async function check({ua='Desktop', platform='', touch=0, isolated=false, popupError}, expected) {
  const calls=[];
  const exports={};
  const auth = {
    getAuth:()=>({}), GoogleAuthProvider:class {setCustomParameters() {}},
    setPersistence:()=>Promise.resolve(),
    signInWithPopup:async()=>{calls.push('popup');if(popupError) throw {code:popupError};return {user:{uid:'signed-in'}}},
    signInWithRedirect:async()=>{calls.push('redirect')},
    getRedirectResult:async()=>{calls.push('result');return {user:{uid:'returned'}}},
  };
  vm.runInNewContext(code, {exports, require:(id)=>id==='firebase/app'?{initializeApp:()=>({})}:id==='firebase/auth'?auth:{initializeFirestore:()=>({}),getFirestore:()=>({}),persistentLocalCache:()=>({}),persistentMultipleTabManager:()=>({})}, window:{location:{host:'www.examsidemann.com'},crossOriginIsolated:isolated,google:{accounts:{id:{cancel:()=>calls.push('cancel')}}}},navigator:{userAgent:ua,platform,maxTouchPoints:touch}, console:{error(){},warn(){}},setTimeout,clearTimeout});
  try {await exports.loginWithGoogle()} catch(error) {assert.equal(error.code,popupError);calls.push('cancelled')}
  assert.deepEqual(calls, ['cancel',...expected]);
  const a=exports.completeGoogleRedirect(), b=exports.completeGoogleRedirect();
  assert.equal(a,b); assert.equal((await a).user.uid,'returned'); assert.equal(calls.filter(x=>x==='result').length,1);
}
(async()=>{
 await check({ua:'Android'},['redirect']);
 await check({ua:'iPhone'},['redirect']);
 await check({platform:'MacIntel',touch:5},['redirect']);
 await check({isolated:true},['redirect']);
 await check({},['popup']);
 await check({popupError:'auth/popup-blocked'},['popup','redirect']);
 await check({popupError:'auth/popup-closed-by-user'},['popup','cancelled']);
 const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
 assert.equal(config.rewrites[0].source,'/__/auth/:path*');
 const netlify=fs.readFileSync('public/_redirects','utf8');
 assert(netlify.indexOf('/__/auth/*')<netlify.indexOf('/* /index.html'));
 console.log('Passed 7 Google login scenarios, redirect result deduplication, and hosting route ordering.');
})().catch(e=>{console.error(e);process.exit(1)});
