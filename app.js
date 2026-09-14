import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

const $=id=>document.getElementById(id);
const canvas=$("canvas"),ctx=canvas.getContext("2d"),layer=$("textLayer"),wrap=$("pageWrap");
let pdf=null,page=1,scale=1.25,selected="",vocab=JSON.parse(localStorage.getItem("mathread_vocab_v2")||"[]");

const mathDict={
 "almost surely":"quase certamente","random variable":"variável aleatória","random variables":"variáveis aleatórias",
 "sample space":"espaço amostral","probability measure":"medida de probabilidade","probability space":"espaço de probabilidade",
 "measurable":"mensurável","measurability":"mensurabilidade","convergence":"convergência","converges":"converge",
 "convergent":"convergente","diverges":"diverge","divergence":"divergência","bounded":"limitado(a)",
 "unbounded":"ilimitado(a)","sequence":"sequência","subsequence":"subsequência","limit":"limite",
 "continuous":"contínua","continuity":"continuidade","differentiable":"diferenciável","derivative":"derivada",
 "integrable":"integrável","integral":"integral","function":"função","mapping":"aplicação",
 "set":"conjunto","subset":"subconjunto","empty set":"conjunto vazio","field":"corpo","ring":"anel",
 "group":"grupo","vector space":"espaço vetorial","inner product":"produto interno","norm":"norma",
 "metric space":"espaço métrico","open set":"conjunto aberto","closed set":"conjunto fechado",
 "compact":"compacto","compactness":"compacidade","topology":"topologia","measure":"medida",
 "support":"suporte","almost everywhere":"quase em todo lugar","with probability one":"com probabilidade um",
 "expectation":"esperança","expected value":"valor esperado","variance":"variância","covariance":"covariância",
 "independent":"independente","independence":"independência","distribution":"distribuição",
 "density":"densidade","random":"aleatório(a)","correlation":"correlação","entropy":"entropia",
 "theorem":"teorema","lemma":"lema","proposition":"proposição","proof":"demonstração",
 "assume":"suponha","hence":"portanto","therefore":"portanto","thus":"assim","if and only if":"se, e somente se"
};

$("pdfInput").onchange=async e=>{
 const f=e.target.files[0];if(!f)return;
 try{pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;page=1;
 $("welcome").classList.add("hidden");$("reader").classList.remove("hidden");
 ["prev","next","minus","plus"].forEach(x=>$(x).disabled=false);await render();toast("PDF aberto com sucesso.");
 }catch(err){console.error(err);toast("Não foi possível abrir este PDF.")}
};

async function render(){
 const p=await pdf.getPage(page),vp=p.getViewport({scale});
 canvas.width=vp.width;canvas.height=vp.height;wrap.style.width=vp.width+"px";wrap.style.height=vp.height+"px";
 await p.render({canvasContext:ctx,viewport:vp}).promise;
 await renderText(p,vp);
 $("pageInfo").textContent=`${page} / ${pdf.numPages}`;$("zoom").textContent=Math.round(scale/1.25*100)+"%";
 window.getSelection()?.removeAllRanges();
}
async function renderText(p,vp){
 layer.innerHTML="";
 const tc=await p.getTextContent();
 for(const item of tc.items){
   if(!item.str)continue;
   const tx=pdfjsLib.Util.transform(vp.transform,item.transform);
   const span=document.createElement("span");span.textContent=item.str;
   const fontSize=Math.hypot(tx[2],tx[3]);
   span.style.left=tx[4]+"px";span.style.top=(tx[5]-fontSize)+"px";
   span.style.fontSize=fontSize+"px";
   span.style.fontFamily=item.fontName||"sans-serif";
   span.style.width=(item.width*vp.scale)+"px";
   span.style.height=Math.max(fontSize*1.2,8)+"px";
   layer.appendChild(span);
 }
}
$("prev").onclick=async()=>{if(page>1){page--;await render()}};
$("next").onclick=async()=>{if(page<pdf.numPages){page++;await render()}};
$("plus").onclick=async()=>{scale=Math.min(2.5,scale+.15);await render()};
$("minus").onclick=async()=>{scale=Math.max(.6,scale-.15);await render()};
$("close").onclick=()=>$("drawer").classList.add("hidden");

document.addEventListener("mouseup",()=>{
 const s=window.getSelection()?.toString().trim();
 if(!s||s.length>100)return;
 if(!layer.contains(window.getSelection().anchorNode))return;
 selected=s;
 showTranslation(s);
});

function localTranslation(text){
 const t=text.toLowerCase().replace(/\s+/g," ").trim();
 if(mathDict[t])return {translation:mathDict[t],math:true};
 const words=t.split(" ");
 for(let n=Math.min(4,words.length);n>=1;n--){
   for(let i=0;i+n<=words.length;i++){
     const phrase=words.slice(i,i+n).join(" ");
     if(mathDict[phrase])return {translation:mathDict[phrase],math:true};
   }
 }
 return null;
}

async function showTranslation(text){
 $("drawer").classList.remove("hidden");
 $("drawerContent").innerHTML=`<div class="term">${esc(text)}</div><div>🔎 Consultando…</div>`;
 let result=localTranslation(text), translation=result?.translation;
 if(!translation){
   try{
    const r=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt-BR`);
    const d=await r.json();translation=d?.responseData?.translatedText||"Tradução não encontrada.";
   }catch(e){translation="Sem conexão para consultar a tradução."}
 }
 const saved=vocab.some(x=>x.term.toLowerCase()===text.toLowerCase());
 $("drawerContent").innerHTML=`
   <div class="term">${esc(text)}</div>
   ${result?.math?'<span class="badge">📐 Termo matemático</span>':''}
   <div class="translation">🇧🇷 ${esc(translation)}</div>
   <div class="note">${result?.math?"Usei um glossário matemático local para priorizar o significado técnico.":"Tradução automática. Termos técnicos podem ter significados diferentes conforme o contexto."}</div>
   <button id="save" class="save ${saved?"saved":""}">${saved?"✓ Salva no vocabulário":"⭐ Salvar no vocabulário"}</button>`;
 $("save").onclick=()=>{
   if(!vocab.some(x=>x.term.toLowerCase()===text.toLowerCase())){
    vocab.push({term:text,translation});localStorage.setItem("mathread_vocab_v2",JSON.stringify(vocab));
    $("save").textContent="✓ Salva no vocabulário";$("save").classList.add("saved");
   }
 };
}

$("vocab").onclick=()=>{
 $("drawer").classList.remove("hidden");
 if(!vocab.length){$("drawerContent").innerHTML="<h2>⭐ Vocabulário</h2><p class='note'>Você ainda não salvou nenhuma palavra.</p>";return}
 $("drawerContent").innerHTML="<h2>⭐ Vocabulário</h2>"+vocab.map((x,i)=>`
 <div class="vrow"><button class="remove" data-i="${i}">×</button><div class="vword">${esc(x.term)}</div><div class="vtrans">🇧🇷 ${esc(x.translation)}</div></div>`).join("");
 document.querySelectorAll(".remove").forEach(b=>b.onclick=()=>{vocab.splice(+b.dataset.i,1);localStorage.setItem("mathread_vocab_v2",JSON.stringify(vocab));$("vocab").click()});
};

function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function toast(t){$("toast").textContent=t;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",1800)}
