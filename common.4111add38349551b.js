"use strict";(self.webpackChunkcoreui_free_angular_admin_template=self.webpackChunkcoreui_free_angular_admin_template||[]).push([[592],{3407:(s,_,t)=>{function a(e,r){return e.tam_id<r.tam_id?1:e.tam_id>r.tam_id?-1:0}function o(e,r){return e.per_primer_nombre<r.per_primer_nombre?-1:e.per_primer_nombre>r.per_primer_nombre?1:0}function u(e,r){return e.per_primer_nombre<r.per_primer_nombre?-1:e.per_primer_nombre>r.per_primer_nombre?1:0}t.d(_,{KU:()=>u,Yr:()=>o,_R:()=>a})},9128:(s,_,t)=>{t.d(_,{J:()=>e});var a=t(2340),o=t(5e3),u=t(520);let e=(()=>{class r{constructor(i){this.http=i,this.enviromentUrl=a.H}createPersona(i){return this.http.post(`${this.enviromentUrl}/personas/crear`,i)}updatePersona(i,p){return this.http.put(`${this.enviromentUrl}/personas/actualizar/${i}`,p)}}return r.\u0275fac=function(i){return new(i||r)(o.LFG(u.eN))},r.\u0275prov=o.Yz7({token:r,factory:r.\u0275fac,providedIn:"root"}),r})()},3290:(s,_,t)=>{function a(o){let r=o[0]["SUBSTRING(COLUMN_TYPE,5)"].split("(")[1].split(")")[0].split(",");for(let n=0;n<r.length;n++)r[n]=r[n].replace("'","");for(let n=0;n<r.length;n++)r[n]=r[n].replace("'","");return r}t.d(_,{p:()=>a})}}]);