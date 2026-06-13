(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const mo="165",cc=0,Uo=1,hc=2,gl=1,_l=2,bn=3,Gn=0,ke=1,fn=2,Bn=0,Li=1,No=2,Fo=3,Oo=4,uc=5,ri=100,dc=101,fc=102,pc=103,mc=104,gc=200,_c=201,vc=202,xc=203,ro=204,oo=205,Mc=206,yc=207,Sc=208,Ec=209,wc=210,Tc=211,bc=212,Ac=213,Cc=214,Rc=0,Pc=1,Lc=2,Vs=3,Ic=4,Dc=5,Uc=6,Nc=7,vl=0,Fc=1,Oc=2,kn=0,zc=1,Bc=2,kc=3,xl=4,Hc=5,Gc=6,Vc=7,Ml=300,Ni=301,Fi=302,ao=303,lo=304,Qs=306,ss=1e3,ai=1001,co=1002,Je=1003,Wc=1004,ms=1005,rn=1006,pr=1007,li=1008,Vn=1009,Xc=1010,qc=1011,Ws=1012,yl=1013,Oi=1014,zn=1015,tr=1016,Sl=1017,El=1018,zi=1020,Yc=35902,Kc=1021,$c=1022,mn=1023,Jc=1024,Zc=1025,Ii=1026,Bi=1027,jc=1028,wl=1029,Qc=1030,Tl=1031,bl=1033,mr=33776,gr=33777,_r=33778,vr=33779,zo=35840,Bo=35841,ko=35842,Ho=35843,Go=36196,Vo=37492,Wo=37496,Xo=37808,qo=37809,Yo=37810,Ko=37811,$o=37812,Jo=37813,Zo=37814,jo=37815,Qo=37816,ta=37817,ea=37818,na=37819,ia=37820,sa=37821,xr=36492,ra=36494,oa=36495,th=36283,aa=36284,la=36285,ca=36286,eh=3200,nh=3201,Al=0,ih=1,On="",ze="srgb",Yn="srgb-linear",go="display-p3",er="display-p3-linear",Xs="linear",ie="srgb",qs="rec709",Ys="p3",di=7680,ha=519,sh=512,rh=513,oh=514,Cl=515,ah=516,lh=517,ch=518,hh=519,ua=35044,da="300 es",Cn=2e3,Ks=2001;class Vi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Ce=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Mr=Math.PI/180,$s=180/Math.PI;function rs(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ce[i&255]+Ce[i>>8&255]+Ce[i>>16&255]+Ce[i>>24&255]+"-"+Ce[t&255]+Ce[t>>8&255]+"-"+Ce[t>>16&15|64]+Ce[t>>24&255]+"-"+Ce[e&63|128]+Ce[e>>8&255]+"-"+Ce[e>>16&255]+Ce[e>>24&255]+Ce[n&255]+Ce[n>>8&255]+Ce[n>>16&255]+Ce[n>>24&255]).toLowerCase()}function Ae(i,t,e){return Math.max(t,Math.min(e,i))}function uh(i,t){return(i%t+t)%t}function yr(i,t,e){return(1-e)*i+e*t}function Yi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Oe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class mt{constructor(t=0,e=0){mt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ft{constructor(t,e,n,s,r,o,a,l,c){Ft.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],x=s[0],m=s[3],p=s[6],E=s[1],S=s[4],w=s[7],B=s[2],A=s[5],R=s[8];return r[0]=o*x+a*E+l*B,r[3]=o*m+a*S+l*A,r[6]=o*p+a*w+l*R,r[1]=c*x+h*E+u*B,r[4]=c*m+h*S+u*A,r[7]=c*p+h*w+u*R,r[2]=d*x+f*E+g*B,r[5]=d*m+f*S+g*A,r[8]=d*p+f*w+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return t[0]=u*x,t[1]=(s*c-h*n)*x,t[2]=(a*n-s*o)*x,t[3]=d*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-a*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Sr.makeScale(t,e)),this}rotate(t){return this.premultiply(Sr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Sr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Sr=new Ft;function Rl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Js(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function dh(){const i=Js("canvas");return i.style.display="block",i}const fa={};function Pl(i){i in fa||(fa[i]=!0,console.warn(i))}function fh(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const pa=new Ft().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ma=new Ft().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),gs={[Yn]:{transfer:Xs,primaries:qs,toReference:i=>i,fromReference:i=>i},[ze]:{transfer:ie,primaries:qs,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[er]:{transfer:Xs,primaries:Ys,toReference:i=>i.applyMatrix3(ma),fromReference:i=>i.applyMatrix3(pa)},[go]:{transfer:ie,primaries:Ys,toReference:i=>i.convertSRGBToLinear().applyMatrix3(ma),fromReference:i=>i.applyMatrix3(pa).convertLinearToSRGB()}},ph=new Set([Yn,er]),Zt={enabled:!0,_workingColorSpace:Yn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!ph.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=gs[t].toReference,s=gs[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return gs[i].primaries},getTransfer:function(i){return i===On?Xs:gs[i].transfer}};function Di(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Er(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let fi;class mh{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{fi===void 0&&(fi=Js("canvas")),fi.width=t.width,fi.height=t.height;const n=fi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=fi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Js("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Di(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Di(e[n]/255)*255):e[n]=Di(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let gh=0;class Ll{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gh++}),this.uuid=rs(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(wr(s[o].image)):r.push(wr(s[o]))}else r=wr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function wr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?mh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let _h=0;class Fe extends Vi{constructor(t=Fe.DEFAULT_IMAGE,e=Fe.DEFAULT_MAPPING,n=ai,s=ai,r=rn,o=li,a=mn,l=Vn,c=Fe.DEFAULT_ANISOTROPY,h=On){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_h++}),this.uuid=rs(),this.name="",this.source=new Ll(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new mt(0,0),this.repeat=new mt(1,1),this.center=new mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ft,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ml)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ss:t.x=t.x-Math.floor(t.x);break;case ai:t.x=t.x<0?0:1;break;case co:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ss:t.y=t.y-Math.floor(t.y);break;case ai:t.y=t.y<0?0:1;break;case co:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Fe.DEFAULT_IMAGE=null;Fe.DEFAULT_MAPPING=Ml;Fe.DEFAULT_ANISOTROPY=1;class se{constructor(t=0,e=0,n=0,s=1){se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],x=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,w=(f+1)/2,B=(p+1)/2,A=(h+d)/4,R=(u+x)/4,F=(g+m)/4;return S>w&&S>B?S<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(S),s=A/n,r=R/n):w>B?w<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),n=A/s,r=F/s):B<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(B),n=R/r,s=F/r),this.set(n,s,r,e),this}let E=Math.sqrt((m-g)*(m-g)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(u-x)/E,this.z=(d-h)/E,this.w=Math.acos((c+f+p-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class vh extends Vi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new se(0,0,t,e),this.scissorTest=!1,this.viewport=new se(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:rn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Fe(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Ll(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ci extends vh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Il extends Fe{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Je,this.minFilter=Je,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class xh extends Fe{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Je,this.minFilter=Je,this.wrapR=ai,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],x=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=x;return}if(u!==x||l!==d||c!==f||h!==g){let m=1-a;const p=l*d+c*f+h*g+u*x,E=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){const B=Math.sqrt(S),A=Math.atan2(B,p*E);m=Math.sin(m*A)/B,a=Math.sin(a*A)/B}const w=a*E;if(l=l*m+d*w,c=c*m+f*w,h=h*m+g*w,u=u*m+x*w,m===1-a){const B=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=B,c*=B,h*=B,u*=B}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-a*f,t[e+2]=c*g+h*f+a*d-l*u,t[e+3]=h*g-a*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),u=a(r/2),d=l(n/2),f=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ae(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ga.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ga.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=s+l*u+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Tr.copy(this).projectOnVector(t),this.sub(Tr)}reflect(t){return this.sub(Tr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Tr=new C,ga=new hi;class os{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(tn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(tn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=tn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,tn):tn.fromBufferAttribute(r,o),tn.applyMatrix4(t.matrixWorld),this.expandByPoint(tn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),_s.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),_s.copy(n.boundingBox)),_s.applyMatrix4(t.matrixWorld),this.union(_s)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,tn),tn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ki),vs.subVectors(this.max,Ki),pi.subVectors(t.a,Ki),mi.subVectors(t.b,Ki),gi.subVectors(t.c,Ki),Ln.subVectors(mi,pi),In.subVectors(gi,mi),Jn.subVectors(pi,gi);let e=[0,-Ln.z,Ln.y,0,-In.z,In.y,0,-Jn.z,Jn.y,Ln.z,0,-Ln.x,In.z,0,-In.x,Jn.z,0,-Jn.x,-Ln.y,Ln.x,0,-In.y,In.x,0,-Jn.y,Jn.x,0];return!br(e,pi,mi,gi,vs)||(e=[1,0,0,0,1,0,0,0,1],!br(e,pi,mi,gi,vs))?!1:(xs.crossVectors(Ln,In),e=[xs.x,xs.y,xs.z],br(e,pi,mi,gi,vs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,tn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(tn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Mn=[new C,new C,new C,new C,new C,new C,new C,new C],tn=new C,_s=new os,pi=new C,mi=new C,gi=new C,Ln=new C,In=new C,Jn=new C,Ki=new C,vs=new C,xs=new C,Zn=new C;function br(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Zn.fromArray(i,r);const a=s.x*Math.abs(Zn.x)+s.y*Math.abs(Zn.y)+s.z*Math.abs(Zn.z),l=t.dot(Zn),c=e.dot(Zn),h=n.dot(Zn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Mh=new os,$i=new C,Ar=new C;class _o{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Mh.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;$i.subVectors(t,this.center);const e=$i.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector($i,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ar.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint($i.copy(t.center).add(Ar)),this.expandByPoint($i.copy(t.center).sub(Ar))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const yn=new C,Cr=new C,Ms=new C,Dn=new C,Rr=new C,ys=new C,Pr=new C;class yh{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,yn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=yn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(yn.copy(this.origin).addScaledVector(this.direction,e),yn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Cr.copy(t).add(e).multiplyScalar(.5),Ms.copy(e).sub(t).normalize(),Dn.copy(this.origin).sub(Cr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Ms),a=Dn.dot(this.direction),l=-Dn.dot(Ms),c=Dn.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const x=1/h;u*=x,d*=x,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Cr).addScaledVector(Ms,d),f}intersectSphere(t,e){yn.subVectors(t.center,this.origin);const n=yn.dot(this.direction),s=yn.dot(yn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,yn)!==null}intersectTriangle(t,e,n,s,r){Rr.subVectors(e,t),ys.subVectors(n,t),Pr.crossVectors(Rr,ys);let o=this.direction.dot(Pr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Dn.subVectors(this.origin,t);const l=a*this.direction.dot(ys.crossVectors(Dn,ys));if(l<0)return null;const c=a*this.direction.dot(Rr.cross(Dn));if(c<0||l+c>o)return null;const h=-a*Dn.dot(Pr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class re{constructor(t,e,n,s,r,o,a,l,c,h,u,d,f,g,x,m){re.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,x,m)}set(t,e,n,s,r,o,a,l,c,h,u,d,f,g,x,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=x,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new re().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/_i.setFromMatrixColumn(t,0).length(),r=1/_i.setFromMatrixColumn(t,1).length(),o=1/_i.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-x*c,e[9]=-a*l,e[2]=x-d*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,x=c*u;e[0]=d+x*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=x+d*a,e[10]=o*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,x=c*u;e[0]=d-x*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=x-d*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,x=a*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const d=o*l,f=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=x-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-x*u}else if(t.order==="XZY"){const d=o*l,f=o*c,g=a*l,x=a*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Sh,t,Eh)}lookAt(t,e,n){const s=this.elements;return Ve.subVectors(t,e),Ve.lengthSq()===0&&(Ve.z=1),Ve.normalize(),Un.crossVectors(n,Ve),Un.lengthSq()===0&&(Math.abs(n.z)===1?Ve.x+=1e-4:Ve.z+=1e-4,Ve.normalize(),Un.crossVectors(n,Ve)),Un.normalize(),Ss.crossVectors(Ve,Un),s[0]=Un.x,s[4]=Ss.x,s[8]=Ve.x,s[1]=Un.y,s[5]=Ss.y,s[9]=Ve.y,s[2]=Un.z,s[6]=Ss.z,s[10]=Ve.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],x=n[6],m=n[10],p=n[14],E=n[3],S=n[7],w=n[11],B=n[15],A=s[0],R=s[4],F=s[8],v=s[12],_=s[1],T=s[5],U=s[9],O=s[13],V=s[2],z=s[6],D=s[10],W=s[14],H=s[3],tt=s[7],Q=s[11],ot=s[15];return r[0]=o*A+a*_+l*V+c*H,r[4]=o*R+a*T+l*z+c*tt,r[8]=o*F+a*U+l*D+c*Q,r[12]=o*v+a*O+l*W+c*ot,r[1]=h*A+u*_+d*V+f*H,r[5]=h*R+u*T+d*z+f*tt,r[9]=h*F+u*U+d*D+f*Q,r[13]=h*v+u*O+d*W+f*ot,r[2]=g*A+x*_+m*V+p*H,r[6]=g*R+x*T+m*z+p*tt,r[10]=g*F+x*U+m*D+p*Q,r[14]=g*v+x*O+m*W+p*ot,r[3]=E*A+S*_+w*V+B*H,r[7]=E*R+S*T+w*z+B*tt,r[11]=E*F+S*U+w*D+B*Q,r[15]=E*v+S*O+w*W+B*ot,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],x=t[7],m=t[11],p=t[15];return g*(+r*l*u-s*c*u-r*a*d+n*c*d+s*a*f-n*l*f)+x*(+e*l*f-e*c*d+r*o*d-s*o*f+s*c*h-r*l*h)+m*(+e*c*u-e*a*f-r*o*u+n*o*f+r*a*h-n*c*h)+p*(-s*a*h-e*l*u+e*a*d+s*o*u-n*o*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],x=t[13],m=t[14],p=t[15],E=u*m*c-x*d*c+x*l*f-a*m*f-u*l*p+a*d*p,S=g*d*c-h*m*c-g*l*f+o*m*f+h*l*p-o*d*p,w=h*x*c-g*u*c+g*a*f-o*x*f-h*a*p+o*u*p,B=g*u*l-h*x*l-g*a*d+o*x*d+h*a*m-o*u*m,A=e*E+n*S+s*w+r*B;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/A;return t[0]=E*R,t[1]=(x*d*r-u*m*r-x*s*f+n*m*f+u*s*p-n*d*p)*R,t[2]=(a*m*r-x*l*r+x*s*c-n*m*c-a*s*p+n*l*p)*R,t[3]=(u*l*r-a*d*r-u*s*c+n*d*c+a*s*f-n*l*f)*R,t[4]=S*R,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*R,t[6]=(g*l*r-o*m*r-g*s*c+e*m*c+o*s*p-e*l*p)*R,t[7]=(o*d*r-h*l*r+h*s*c-e*d*c-o*s*f+e*l*f)*R,t[8]=w*R,t[9]=(g*u*r-h*x*r-g*n*f+e*x*f+h*n*p-e*u*p)*R,t[10]=(o*x*r-g*a*r+g*n*c-e*x*c-o*n*p+e*a*p)*R,t[11]=(h*a*r-o*u*r-h*n*c+e*u*c+o*n*f-e*a*f)*R,t[12]=B*R,t[13]=(h*x*s-g*u*s+g*n*d-e*x*d-h*n*m+e*u*m)*R,t[14]=(g*a*s-o*x*s-g*n*l+e*x*l+o*n*m-e*a*m)*R,t[15]=(o*u*s-h*a*s+h*n*l-e*u*l-o*n*d+e*a*d)*R,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,x=o*h,m=o*u,p=a*u,E=l*c,S=l*h,w=l*u,B=n.x,A=n.y,R=n.z;return s[0]=(1-(x+p))*B,s[1]=(f+w)*B,s[2]=(g-S)*B,s[3]=0,s[4]=(f-w)*A,s[5]=(1-(d+p))*A,s[6]=(m+E)*A,s[7]=0,s[8]=(g+S)*R,s[9]=(m-E)*R,s[10]=(1-(d+x))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=_i.set(s[0],s[1],s[2]).length();const o=_i.set(s[4],s[5],s[6]).length(),a=_i.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],en.copy(this);const c=1/r,h=1/o,u=1/a;return en.elements[0]*=c,en.elements[1]*=c,en.elements[2]*=c,en.elements[4]*=h,en.elements[5]*=h,en.elements[6]*=h,en.elements[8]*=u,en.elements[9]*=u,en.elements[10]*=u,e.setFromRotationMatrix(en),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Cn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let f,g;if(a===Cn)f=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===Ks)f=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Cn){const l=this.elements,c=1/(e-t),h=1/(n-s),u=1/(o-r),d=(e+t)*c,f=(n+s)*h;let g,x;if(a===Cn)g=(o+r)*u,x=-2*u;else if(a===Ks)g=r*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=x,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const _i=new C,en=new re,Sh=new C(0,0,0),Eh=new C(1,1,1),Un=new C,Ss=new C,Ve=new C,_a=new re,va=new hi;class an{constructor(t=0,e=0,n=0,s=an.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Ae(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ae(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ae(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ae(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ae(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ae(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return _a.makeRotationFromQuaternion(t),this.setFromRotationMatrix(_a,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return va.setFromEuler(this),this.setFromQuaternion(va,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}an.DEFAULT_ORDER="XYZ";class Dl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let wh=0;const xa=new C,vi=new hi,Sn=new re,Es=new C,Ji=new C,Th=new C,bh=new hi,Ma=new C(1,0,0),ya=new C(0,1,0),Sa=new C(0,0,1),Ea={type:"added"},Ah={type:"removed"},xi={type:"childadded",child:null},Lr={type:"childremoved",child:null};class ve extends Vi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wh++}),this.uuid=rs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ve.DEFAULT_UP.clone();const t=new C,e=new an,n=new hi,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new re},normalMatrix:{value:new Ft}}),this.matrix=new re,this.matrixWorld=new re,this.matrixAutoUpdate=ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return vi.setFromAxisAngle(t,e),this.quaternion.multiply(vi),this}rotateOnWorldAxis(t,e){return vi.setFromAxisAngle(t,e),this.quaternion.premultiply(vi),this}rotateX(t){return this.rotateOnAxis(Ma,t)}rotateY(t){return this.rotateOnAxis(ya,t)}rotateZ(t){return this.rotateOnAxis(Sa,t)}translateOnAxis(t,e){return xa.copy(t).applyQuaternion(this.quaternion),this.position.add(xa.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ma,t)}translateY(t){return this.translateOnAxis(ya,t)}translateZ(t){return this.translateOnAxis(Sa,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Es.copy(t):Es.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Ji.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt(Ji,Es,this.up):Sn.lookAt(Es,Ji,this.up),this.quaternion.setFromRotationMatrix(Sn),s&&(Sn.extractRotation(s.matrixWorld),vi.setFromRotationMatrix(Sn),this.quaternion.premultiply(vi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ea),xi.child=t,this.dispatchEvent(xi),xi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Ah),Lr.child=t,this.dispatchEvent(Lr),Lr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Sn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Sn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ea),xi.child=t,this.dispatchEvent(xi),xi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,t,Th),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ji,bh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ve.DEFAULT_UP=new C(0,1,0);ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const nn=new C,En=new C,Ir=new C,wn=new C,Mi=new C,yi=new C,wa=new C,Dr=new C,Ur=new C,Nr=new C;class pn{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),nn.subVectors(t,e),s.cross(nn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){nn.subVectors(s,e),En.subVectors(n,e),Ir.subVectors(t,e);const o=nn.dot(nn),a=nn.dot(En),l=nn.dot(Ir),c=En.dot(En),h=En.dot(Ir),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wn.x),l.addScaledVector(o,wn.y),l.addScaledVector(a,wn.z),l)}static isFrontFacing(t,e,n,s){return nn.subVectors(n,e),En.subVectors(t,e),nn.cross(En).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return nn.subVectors(this.c,this.b),En.subVectors(this.a,this.b),nn.cross(En).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return pn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return pn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return pn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return pn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return pn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Mi.subVectors(s,n),yi.subVectors(r,n),Dr.subVectors(t,n);const l=Mi.dot(Dr),c=yi.dot(Dr);if(l<=0&&c<=0)return e.copy(n);Ur.subVectors(t,s);const h=Mi.dot(Ur),u=yi.dot(Ur);if(h>=0&&u<=h)return e.copy(s);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Mi,o);Nr.subVectors(t,r);const f=Mi.dot(Nr),g=yi.dot(Nr);if(g>=0&&f<=g)return e.copy(r);const x=f*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(yi,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return wa.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(wa,a);const p=1/(m+x+d);return o=x*p,a=d*p,e.copy(n).addScaledVector(Mi,o).addScaledVector(yi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ul={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},ws={h:0,s:0,l:0};function Fr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Xt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Zt.workingColorSpace){if(t=uh(t,1),e=Ae(e,0,1),n=Ae(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Fr(o,r,t+1/3),this.g=Fr(o,r,t),this.b=Fr(o,r,t-1/3)}return Zt.toWorkingColorSpace(this,s),this}setStyle(t,e=ze){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ze){const n=Ul[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Di(t.r),this.g=Di(t.g),this.b=Di(t.b),this}copyLinearToSRGB(t){return this.r=Er(t.r),this.g=Er(t.g),this.b=Er(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ze){return Zt.fromWorkingColorSpace(Re.copy(this),t),Math.round(Ae(Re.r*255,0,255))*65536+Math.round(Ae(Re.g*255,0,255))*256+Math.round(Ae(Re.b*255,0,255))}getHexString(t=ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.fromWorkingColorSpace(Re.copy(this),e);const n=Re.r,s=Re.g,r=Re.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-n)/u+2;break;case r:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Zt.workingColorSpace){return Zt.fromWorkingColorSpace(Re.copy(this),e),t.r=Re.r,t.g=Re.g,t.b=Re.b,t}getStyle(t=ze){Zt.fromWorkingColorSpace(Re.copy(this),t);const e=Re.r,n=Re.g,s=Re.b;return t!==ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Nn),this.setHSL(Nn.h+t,Nn.s+e,Nn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Nn),t.getHSL(ws);const n=yr(Nn.h,ws.h,e),s=yr(Nn.s,ws.s,e),r=yr(Nn.l,ws.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Re=new Xt;Xt.NAMES=Ul;let Ch=0;class as extends Vi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ch++}),this.uuid=rs(),this.name="",this.type="Material",this.blending=Li,this.side=Gn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ro,this.blendDst=oo,this.blendEquation=ri,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xt(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ha,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=di,this.stencilZFail=di,this.stencilZPass=di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Li&&(n.blending=this.blending),this.side!==Gn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ro&&(n.blendSrc=this.blendSrc),this.blendDst!==oo&&(n.blendDst=this.blendDst),this.blendEquation!==ri&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Vs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ha&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==di&&(n.stencilFail=this.stencilFail),this.stencilZFail!==di&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==di&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class nr extends as{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new an,this.combine=vl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const fe=new C,Ts=new mt;class _n{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ua,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return Pl("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ts.fromBufferAttribute(this,e),Ts.applyMatrix3(t),this.setXY(e,Ts.x,Ts.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix3(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyMatrix4(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.applyNormalMatrix(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)fe.fromBufferAttribute(this,e),fe.transformDirection(t),this.setXYZ(e,fe.x,fe.y,fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Yi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Oe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Yi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Yi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Yi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Yi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),s=Oe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Oe(e,this.array),n=Oe(n,this.array),s=Oe(s,this.array),r=Oe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ua&&(t.usage=this.usage),t}}class Nl extends _n{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Fl extends _n{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ce extends _n{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Rh=0;const Ye=new re,Or=new ve,Si=new C,We=new os,Zi=new os,Ee=new C;class Qe extends Vi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Rh++}),this.uuid=rs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Rl(t)?Fl:Nl)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ft().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ye.makeRotationFromQuaternion(t),this.applyMatrix4(Ye),this}rotateX(t){return Ye.makeRotationX(t),this.applyMatrix4(Ye),this}rotateY(t){return Ye.makeRotationY(t),this.applyMatrix4(Ye),this}rotateZ(t){return Ye.makeRotationZ(t),this.applyMatrix4(Ye),this}translate(t,e,n){return Ye.makeTranslation(t,e,n),this.applyMatrix4(Ye),this}scale(t,e,n){return Ye.makeScale(t,e,n),this.applyMatrix4(Ye),this}lookAt(t){return Or.lookAt(t),Or.updateMatrix(),this.applyMatrix4(Or.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Si).negate(),this.translate(Si.x,Si.y,Si.z),this}setFromPoints(t){const e=[];for(let n=0,s=t.length;n<s;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new ce(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new os);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];We.setFromBufferAttribute(r),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _o);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Zi.setFromBufferAttribute(a),this.morphTargetsRelative?(Ee.addVectors(We.min,Zi.min),We.expandByPoint(Ee),Ee.addVectors(We.max,Zi.max),We.expandByPoint(Ee)):(We.expandByPoint(Zi.min),We.expandByPoint(Zi.max))}We.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ee.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ee));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ee.fromBufferAttribute(a,c),l&&(Si.fromBufferAttribute(t,c),Ee.add(Si)),s=Math.max(s,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new _n(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let F=0;F<n.count;F++)a[F]=new C,l[F]=new C;const c=new C,h=new C,u=new C,d=new mt,f=new mt,g=new mt,x=new C,m=new C;function p(F,v,_){c.fromBufferAttribute(n,F),h.fromBufferAttribute(n,v),u.fromBufferAttribute(n,_),d.fromBufferAttribute(r,F),f.fromBufferAttribute(r,v),g.fromBufferAttribute(r,_),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const T=1/(f.x*g.y-g.x*f.y);isFinite(T)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(T),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(T),a[F].add(x),a[v].add(x),a[_].add(x),l[F].add(m),l[v].add(m),l[_].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:t.count}]);for(let F=0,v=E.length;F<v;++F){const _=E[F],T=_.start,U=_.count;for(let O=T,V=T+U;O<V;O+=3)p(t.getX(O+0),t.getX(O+1),t.getX(O+2))}const S=new C,w=new C,B=new C,A=new C;function R(F){B.fromBufferAttribute(s,F),A.copy(B);const v=a[F];S.copy(v),S.sub(B.multiplyScalar(B.dot(v))).normalize(),w.crossVectors(A,v);const T=w.dot(l[F])<0?-1:1;o.setXYZW(F,S.x,S.y,S.z,T)}for(let F=0,v=E.length;F<v;++F){const _=E[F],T=_.start,U=_.count;for(let O=T,V=T+U;O<V;O+=3)R(t.getX(O+0)),R(t.getX(O+1)),R(t.getX(O+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new _n(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new C,r=new C,o=new C,a=new C,l=new C,c=new C,h=new C,u=new C;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),x=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new _n(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Qe,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ta=new re,jn=new yh,bs=new _o,ba=new C,Ei=new C,wi=new C,Ti=new C,zr=new C,As=new C,Cs=new mt,Rs=new mt,Ps=new mt,Aa=new C,Ca=new C,Ra=new C,Ls=new C,Is=new C;class dt extends ve{constructor(t=new Qe,e=new nr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){As.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],u=r[l];h!==0&&(zr.fromBufferAttribute(u,t),o?As.addScaledVector(zr,h):As.addScaledVector(zr.sub(e),h))}e.add(As)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),bs.copy(n.boundingSphere),bs.applyMatrix4(r),jn.copy(t.ray).recast(t.near),!(bs.containsPoint(jn.origin)===!1&&(jn.intersectSphere(bs,ba)===null||jn.origin.distanceToSquared(ba)>(t.far-t.near)**2))&&(Ta.copy(r).invert(),jn.copy(t.ray).applyMatrix4(Ta),!(n.boundingBox!==null&&jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,jn)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){const m=d[g],p=o[m.materialIndex],E=Math.max(m.start,f.start),S=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let w=E,B=S;w<B;w+=3){const A=a.getX(w),R=a.getX(w+1),F=a.getX(w+2);s=Ds(this,p,t,n,c,h,u,A,R,F),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const E=a.getX(m),S=a.getX(m+1),w=a.getX(m+2);s=Ds(this,o,t,n,c,h,u,E,S,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){const m=d[g],p=o[m.materialIndex],E=Math.max(m.start,f.start),S=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let w=E,B=S;w<B;w+=3){const A=w,R=w+1,F=w+2;s=Ds(this,p,t,n,c,h,u,A,R,F),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=g,p=x;m<p;m+=3){const E=m,S=m+1,w=m+2;s=Ds(this,o,t,n,c,h,u,E,S,w),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Ph(i,t,e,n,s,r,o,a){let l;if(t.side===ke?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===Gn,a),l===null)return null;Is.copy(a),Is.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Is);return c<e.near||c>e.far?null:{distance:c,point:Is.clone(),object:i}}function Ds(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,Ei),i.getVertexPosition(l,wi),i.getVertexPosition(c,Ti);const h=Ph(i,t,e,n,Ei,wi,Ti,Ls);if(h){s&&(Cs.fromBufferAttribute(s,a),Rs.fromBufferAttribute(s,l),Ps.fromBufferAttribute(s,c),h.uv=pn.getInterpolation(Ls,Ei,wi,Ti,Cs,Rs,Ps,new mt)),r&&(Cs.fromBufferAttribute(r,a),Rs.fromBufferAttribute(r,l),Ps.fromBufferAttribute(r,c),h.uv1=pn.getInterpolation(Ls,Ei,wi,Ti,Cs,Rs,Ps,new mt)),o&&(Aa.fromBufferAttribute(o,a),Ca.fromBufferAttribute(o,l),Ra.fromBufferAttribute(o,c),h.normal=pn.getInterpolation(Ls,Ei,wi,Ti,Aa,Ca,Ra,new C),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new C,materialIndex:0};pn.getNormal(Ei,wi,Ti,u.normal),h.face=u}return h}class ee extends Qe{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ce(c,3)),this.setAttribute("normal",new ce(h,3)),this.setAttribute("uv",new ce(u,2));function g(x,m,p,E,S,w,B,A,R,F,v){const _=w/R,T=B/F,U=w/2,O=B/2,V=A/2,z=R+1,D=F+1;let W=0,H=0;const tt=new C;for(let Q=0;Q<D;Q++){const ot=Q*T-O;for(let St=0;St<z;St++){const bt=St*_-U;tt[x]=bt*E,tt[m]=ot*S,tt[p]=V,c.push(tt.x,tt.y,tt.z),tt[x]=0,tt[m]=0,tt[p]=A>0?1:-1,h.push(tt.x,tt.y,tt.z),u.push(St/R),u.push(1-Q/F),W+=1}}for(let Q=0;Q<F;Q++)for(let ot=0;ot<R;ot++){const St=d+ot+z*Q,bt=d+ot+z*(Q+1),q=d+(ot+1)+z*(Q+1),J=d+(ot+1)+z*Q;l.push(St,bt,J),l.push(bt,q,J),H+=6}a.addGroup(f,H,v),f+=H,d+=W}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ee(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ki(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ne(i){const t={};for(let e=0;e<i.length;e++){const n=ki(i[e]);for(const s in n)t[s]=n[s]}return t}function Lh(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ol(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}const Ih={clone:ki,merge:Ne};var Dh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Uh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Wn extends as{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Dh,this.fragmentShader=Uh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ki(t.uniforms),this.uniformsGroups=Lh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class zl extends ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new re,this.projectionMatrix=new re,this.projectionMatrixInverse=new re,this.coordinateSystem=Cn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Fn=new C,Pa=new mt,La=new mt;class Be extends zl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=$s*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Mr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return $s*2*Math.atan(Math.tan(Mr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Fn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Fn.x,Fn.y).multiplyScalar(-t/Fn.z),Fn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fn.x,Fn.y).multiplyScalar(-t/Fn.z)}getViewSize(t,e){return this.getViewBounds(t,Pa,La),e.subVectors(La,Pa)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Mr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const bi=-90,Ai=1;class Nh extends ve{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Be(bi,Ai,t,e);s.layers=this.layers,this.add(s);const r=new Be(bi,Ai,t,e);r.layers=this.layers,this.add(r);const o=new Be(bi,Ai,t,e);o.layers=this.layers,this.add(o);const a=new Be(bi,Ai,t,e);a.layers=this.layers,this.add(a);const l=new Be(bi,Ai,t,e);l.layers=this.layers,this.add(l);const c=new Be(bi,Ai,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Cn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ks)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Bl extends Fe{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Ni,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Fh extends ci{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Bl(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:rn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ee(5,5,5),r=new Wn({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ke,blending:Bn});r.uniforms.tEquirect.value=e;const o=new dt(s,r),a=e.minFilter;return e.minFilter===li&&(e.minFilter=rn),new Nh(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Br=new C,Oh=new C,zh=new Ft;class ii{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Br.subVectors(n,e).cross(Oh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Br),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||zh.getNormalMatrix(t),s=this.coplanarPoint(Br).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Qn=new _o,Us=new C;class vo{constructor(t=new ii,e=new ii,n=new ii,s=new ii,r=new ii,o=new ii){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Cn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],u=s[6],d=s[7],f=s[8],g=s[9],x=s[10],m=s[11],p=s[12],E=s[13],S=s[14],w=s[15];if(n[0].setComponents(l-r,d-c,m-f,w-p).normalize(),n[1].setComponents(l+r,d+c,m+f,w+p).normalize(),n[2].setComponents(l+o,d+h,m+g,w+E).normalize(),n[3].setComponents(l-o,d-h,m-g,w-E).normalize(),n[4].setComponents(l-a,d-u,m-x,w-S).normalize(),e===Cn)n[5].setComponents(l+a,d+u,m+x,w+S).normalize();else if(e===Ks)n[5].setComponents(a,u,x,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(t){return Qn.center.set(0,0,0),Qn.radius=.7071067811865476,Qn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Us.x=s.normal.x>0?t.max.x:t.min.x,Us.y=s.normal.y>0?t.max.y:t.min.y,Us.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Us)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function kl(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Bh(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const h=l.array,u=l._updateRange,d=l.updateRanges;if(i.bindBuffer(c,a),u.count===-1&&d.length===0&&i.bufferSubData(c,0,h),d.length!==0){for(let f=0,g=d.length;f<g;f++){const x=d[f];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}u.count!==-1&&(i.bufferSubData(c,u.offset*h.BYTES_PER_ELEMENT,h,u.offset,u.count),u.count=-1),l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class Hi extends Qe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,u=t/a,d=e/l,f=[],g=[],x=[],m=[];for(let p=0;p<h;p++){const E=p*d-o;for(let S=0;S<c;S++){const w=S*u-r;g.push(w,-E,0),x.push(0,0,1),m.push(S/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let E=0;E<a;E++){const S=E+c*p,w=E+c*(p+1),B=E+1+c*(p+1),A=E+1+c*p;f.push(S,w,A),f.push(w,B,A)}this.setIndex(f),this.setAttribute("position",new ce(g,3)),this.setAttribute("normal",new ce(x,3)),this.setAttribute("uv",new ce(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hi(t.width,t.height,t.widthSegments,t.heightSegments)}}var kh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Hh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Gh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Vh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Wh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Xh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,qh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Yh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Kh=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,$h=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Jh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Zh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Qh=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,tu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,eu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,nu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,iu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,su=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ru=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ou=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,au=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,lu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( batchId );
	vColor.xyz *= batchingColor.xyz;
#endif`,cu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,hu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,uu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,du=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,fu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,pu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,mu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,gu="gl_FragColor = linearToOutputTexel( gl_FragColor );",_u=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,vu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,xu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Mu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Su=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Eu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Tu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Au=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Cu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ru=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Pu=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Iu=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Du=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Uu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Nu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Fu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ou=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,zu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Bu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ku=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Hu=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Gu=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Vu=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wu=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Yu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ku=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,$u=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ju=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Zu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ju=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,td=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ed=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,nd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,id=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,sd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,rd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,od=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ad=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ld=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,cd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,hd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ud=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,dd=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,pd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,md=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,gd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,_d=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,vd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,xd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Md=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,Sd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ed=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,wd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Td=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,bd=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ad=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Cd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Rd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Pd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Ld=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Id=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Dd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Ud=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Nd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Fd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Od=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,zd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Bd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,kd=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,qd=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Yd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Kd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,$d=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Jd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,jd=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Qd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,tf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ef=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,rf=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,of=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,af=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,lf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,uf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,df=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ff=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,mf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_f=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,vf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Nt={alphahash_fragment:kh,alphahash_pars_fragment:Hh,alphamap_fragment:Gh,alphamap_pars_fragment:Vh,alphatest_fragment:Wh,alphatest_pars_fragment:Xh,aomap_fragment:qh,aomap_pars_fragment:Yh,batching_pars_vertex:Kh,batching_vertex:$h,begin_vertex:Jh,beginnormal_vertex:Zh,bsdfs:jh,iridescence_fragment:Qh,bumpmap_pars_fragment:tu,clipping_planes_fragment:eu,clipping_planes_pars_fragment:nu,clipping_planes_pars_vertex:iu,clipping_planes_vertex:su,color_fragment:ru,color_pars_fragment:ou,color_pars_vertex:au,color_vertex:lu,common:cu,cube_uv_reflection_fragment:hu,defaultnormal_vertex:uu,displacementmap_pars_vertex:du,displacementmap_vertex:fu,emissivemap_fragment:pu,emissivemap_pars_fragment:mu,colorspace_fragment:gu,colorspace_pars_fragment:_u,envmap_fragment:vu,envmap_common_pars_fragment:xu,envmap_pars_fragment:Mu,envmap_pars_vertex:yu,envmap_physical_pars_fragment:Iu,envmap_vertex:Su,fog_vertex:Eu,fog_pars_vertex:wu,fog_fragment:Tu,fog_pars_fragment:bu,gradientmap_pars_fragment:Au,lightmap_pars_fragment:Cu,lights_lambert_fragment:Ru,lights_lambert_pars_fragment:Pu,lights_pars_begin:Lu,lights_toon_fragment:Du,lights_toon_pars_fragment:Uu,lights_phong_fragment:Nu,lights_phong_pars_fragment:Fu,lights_physical_fragment:Ou,lights_physical_pars_fragment:zu,lights_fragment_begin:Bu,lights_fragment_maps:ku,lights_fragment_end:Hu,logdepthbuf_fragment:Gu,logdepthbuf_pars_fragment:Vu,logdepthbuf_pars_vertex:Wu,logdepthbuf_vertex:Xu,map_fragment:qu,map_pars_fragment:Yu,map_particle_fragment:Ku,map_particle_pars_fragment:$u,metalnessmap_fragment:Ju,metalnessmap_pars_fragment:Zu,morphinstance_vertex:ju,morphcolor_vertex:Qu,morphnormal_vertex:td,morphtarget_pars_vertex:ed,morphtarget_vertex:nd,normal_fragment_begin:id,normal_fragment_maps:sd,normal_pars_fragment:rd,normal_pars_vertex:od,normal_vertex:ad,normalmap_pars_fragment:ld,clearcoat_normal_fragment_begin:cd,clearcoat_normal_fragment_maps:hd,clearcoat_pars_fragment:ud,iridescence_pars_fragment:dd,opaque_fragment:fd,packing:pd,premultiplied_alpha_fragment:md,project_vertex:gd,dithering_fragment:_d,dithering_pars_fragment:vd,roughnessmap_fragment:xd,roughnessmap_pars_fragment:Md,shadowmap_pars_fragment:yd,shadowmap_pars_vertex:Sd,shadowmap_vertex:Ed,shadowmask_pars_fragment:wd,skinbase_vertex:Td,skinning_pars_vertex:bd,skinning_vertex:Ad,skinnormal_vertex:Cd,specularmap_fragment:Rd,specularmap_pars_fragment:Pd,tonemapping_fragment:Ld,tonemapping_pars_fragment:Id,transmission_fragment:Dd,transmission_pars_fragment:Ud,uv_pars_fragment:Nd,uv_pars_vertex:Fd,uv_vertex:Od,worldpos_vertex:zd,background_vert:Bd,background_frag:kd,backgroundCube_vert:Hd,backgroundCube_frag:Gd,cube_vert:Vd,cube_frag:Wd,depth_vert:Xd,depth_frag:qd,distanceRGBA_vert:Yd,distanceRGBA_frag:Kd,equirect_vert:$d,equirect_frag:Jd,linedashed_vert:Zd,linedashed_frag:jd,meshbasic_vert:Qd,meshbasic_frag:tf,meshlambert_vert:ef,meshlambert_frag:nf,meshmatcap_vert:sf,meshmatcap_frag:rf,meshnormal_vert:of,meshnormal_frag:af,meshphong_vert:lf,meshphong_frag:cf,meshphysical_vert:hf,meshphysical_frag:uf,meshtoon_vert:df,meshtoon_frag:ff,points_vert:pf,points_frag:mf,shadow_vert:gf,shadow_frag:_f,sprite_vert:vf,sprite_frag:xf},rt={common:{diffuse:{value:new Xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ft}},envmap:{envMap:{value:null},envMapRotation:{value:new Ft},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ft}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ft}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ft},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ft},normalScale:{value:new mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ft},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ft}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ft}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ft}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0},uvTransform:{value:new Ft}},sprite:{diffuse:{value:new Xt(16777215)},opacity:{value:1},center:{value:new mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ft},alphaMap:{value:null},alphaMapTransform:{value:new Ft},alphaTest:{value:0}}},un={basic:{uniforms:Ne([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:Nt.meshbasic_vert,fragmentShader:Nt.meshbasic_frag},lambert:{uniforms:Ne([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Nt.meshlambert_vert,fragmentShader:Nt.meshlambert_frag},phong:{uniforms:Ne([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new Xt(0)},specular:{value:new Xt(1118481)},shininess:{value:30}}]),vertexShader:Nt.meshphong_vert,fragmentShader:Nt.meshphong_frag},standard:{uniforms:Ne([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new Xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag},toon:{uniforms:Ne([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Nt.meshtoon_vert,fragmentShader:Nt.meshtoon_frag},matcap:{uniforms:Ne([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:Nt.meshmatcap_vert,fragmentShader:Nt.meshmatcap_frag},points:{uniforms:Ne([rt.points,rt.fog]),vertexShader:Nt.points_vert,fragmentShader:Nt.points_frag},dashed:{uniforms:Ne([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Nt.linedashed_vert,fragmentShader:Nt.linedashed_frag},depth:{uniforms:Ne([rt.common,rt.displacementmap]),vertexShader:Nt.depth_vert,fragmentShader:Nt.depth_frag},normal:{uniforms:Ne([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:Nt.meshnormal_vert,fragmentShader:Nt.meshnormal_frag},sprite:{uniforms:Ne([rt.sprite,rt.fog]),vertexShader:Nt.sprite_vert,fragmentShader:Nt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ft},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Nt.background_vert,fragmentShader:Nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ft}},vertexShader:Nt.backgroundCube_vert,fragmentShader:Nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Nt.cube_vert,fragmentShader:Nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Nt.equirect_vert,fragmentShader:Nt.equirect_frag},distanceRGBA:{uniforms:Ne([rt.common,rt.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Nt.distanceRGBA_vert,fragmentShader:Nt.distanceRGBA_frag},shadow:{uniforms:Ne([rt.lights,rt.fog,{color:{value:new Xt(0)},opacity:{value:1}}]),vertexShader:Nt.shadow_vert,fragmentShader:Nt.shadow_frag}};un.physical={uniforms:Ne([un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ft},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ft},clearcoatNormalScale:{value:new mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ft},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ft},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ft},sheen:{value:0},sheenColor:{value:new Xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ft},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ft},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ft},transmissionSamplerSize:{value:new mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ft},attenuationDistance:{value:0},attenuationColor:{value:new Xt(0)},specularColor:{value:new Xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ft},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ft},anisotropyVector:{value:new mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ft}}]),vertexShader:Nt.meshphysical_vert,fragmentShader:Nt.meshphysical_frag};const Ns={r:0,b:0,g:0},ti=new an,Mf=new re;function yf(i,t,e,n,s,r,o){const a=new Xt(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(E){let S=E.isScene===!0?E.background:null;return S&&S.isTexture&&(S=(E.backgroundBlurriness>0?e:t).get(S)),S}function x(E){let S=!1;const w=g(E);w===null?p(a,l):w&&w.isColor&&(p(w,1),S=!0);const B=i.xr.getEnvironmentBlendMode();B==="additive"?n.buffers.color.setClear(0,0,0,1,o):B==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(E,S){const w=g(S);w&&(w.isCubeTexture||w.mapping===Qs)?(h===void 0&&(h=new dt(new ee(1,1,1),new Wn({name:"BackgroundCubeMaterial",uniforms:ki(un.backgroundCube.uniforms),vertexShader:un.backgroundCube.vertexShader,fragmentShader:un.backgroundCube.fragmentShader,side:ke,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(B,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ti.copy(S.backgroundRotation),ti.x*=-1,ti.y*=-1,ti.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ti.y*=-1,ti.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Mf.makeRotationFromEuler(ti)),h.material.toneMapped=Zt.getTransfer(w.colorSpace)!==ie,(u!==w||d!==w.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),h.layers.enableAll(),E.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new dt(new Hi(2,2),new Wn({name:"BackgroundMaterial",uniforms:ki(un.background.uniforms),vertexShader:un.background.vertexShader,fragmentShader:un.background.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=Zt.getTransfer(w.colorSpace)!==ie,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||d!==w.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,u=w,d=w.version,f=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null))}function p(E,S){E.getRGB(Ns,Ol(i)),n.buffers.color.setClear(Ns.r,Ns.g,Ns.b,S,o)}return{getClearColor:function(){return a},setClearColor:function(E,S=1){a.set(E),l=S,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(E){l=E,p(a,l)},render:x,addToRenderList:m}}function Sf(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(_,T,U,O,V){let z=!1;const D=u(O,U,T);r!==D&&(r=D,c(r.object)),z=f(_,O,U,V),z&&g(_,O,U,V),V!==null&&t.update(V,i.ELEMENT_ARRAY_BUFFER),(z||o)&&(o=!1,w(_,T,U,O),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function h(_){return i.deleteVertexArray(_)}function u(_,T,U){const O=U.wireframe===!0;let V=n[_.id];V===void 0&&(V={},n[_.id]=V);let z=V[T.id];z===void 0&&(z={},V[T.id]=z);let D=z[O];return D===void 0&&(D=d(l()),z[O]=D),D}function d(_){const T=[],U=[],O=[];for(let V=0;V<e;V++)T[V]=0,U[V]=0,O[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:U,attributeDivisors:O,object:_,attributes:{},index:null}}function f(_,T,U,O){const V=r.attributes,z=T.attributes;let D=0;const W=U.getAttributes();for(const H in W)if(W[H].location>=0){const Q=V[H];let ot=z[H];if(ot===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(ot=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(ot=_.instanceColor)),Q===void 0||Q.attribute!==ot||ot&&Q.data!==ot.data)return!0;D++}return r.attributesNum!==D||r.index!==O}function g(_,T,U,O){const V={},z=T.attributes;let D=0;const W=U.getAttributes();for(const H in W)if(W[H].location>=0){let Q=z[H];Q===void 0&&(H==="instanceMatrix"&&_.instanceMatrix&&(Q=_.instanceMatrix),H==="instanceColor"&&_.instanceColor&&(Q=_.instanceColor));const ot={};ot.attribute=Q,Q&&Q.data&&(ot.data=Q.data),V[H]=ot,D++}r.attributes=V,r.attributesNum=D,r.index=O}function x(){const _=r.newAttributes;for(let T=0,U=_.length;T<U;T++)_[T]=0}function m(_){p(_,0)}function p(_,T){const U=r.newAttributes,O=r.enabledAttributes,V=r.attributeDivisors;U[_]=1,O[_]===0&&(i.enableVertexAttribArray(_),O[_]=1),V[_]!==T&&(i.vertexAttribDivisor(_,T),V[_]=T)}function E(){const _=r.newAttributes,T=r.enabledAttributes;for(let U=0,O=T.length;U<O;U++)T[U]!==_[U]&&(i.disableVertexAttribArray(U),T[U]=0)}function S(_,T,U,O,V,z,D){D===!0?i.vertexAttribIPointer(_,T,U,V,z):i.vertexAttribPointer(_,T,U,O,V,z)}function w(_,T,U,O){x();const V=O.attributes,z=U.getAttributes(),D=T.defaultAttributeValues;for(const W in z){const H=z[W];if(H.location>=0){let tt=V[W];if(tt===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(tt=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(tt=_.instanceColor)),tt!==void 0){const Q=tt.normalized,ot=tt.itemSize,St=t.get(tt);if(St===void 0)continue;const bt=St.buffer,q=St.type,J=St.bytesPerElement,ut=q===i.INT||q===i.UNSIGNED_INT||tt.gpuType===yl;if(tt.isInterleavedBufferAttribute){const st=tt.data,Dt=st.stride,Lt=tt.offset;if(st.isInstancedInterleavedBuffer){for(let qt=0;qt<H.locationSize;qt++)p(H.location+qt,st.meshPerAttribute);_.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let qt=0;qt<H.locationSize;qt++)m(H.location+qt);i.bindBuffer(i.ARRAY_BUFFER,bt);for(let qt=0;qt<H.locationSize;qt++)S(H.location+qt,ot/H.locationSize,q,Q,Dt*J,(Lt+ot/H.locationSize*qt)*J,ut)}else{if(tt.isInstancedBufferAttribute){for(let st=0;st<H.locationSize;st++)p(H.location+st,tt.meshPerAttribute);_.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let st=0;st<H.locationSize;st++)m(H.location+st);i.bindBuffer(i.ARRAY_BUFFER,bt);for(let st=0;st<H.locationSize;st++)S(H.location+st,ot/H.locationSize,q,Q,ot*J,ot/H.locationSize*st*J,ut)}}else if(D!==void 0){const Q=D[W];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(H.location,Q);break;case 3:i.vertexAttrib3fv(H.location,Q);break;case 4:i.vertexAttrib4fv(H.location,Q);break;default:i.vertexAttrib1fv(H.location,Q)}}}}E()}function B(){F();for(const _ in n){const T=n[_];for(const U in T){const O=T[U];for(const V in O)h(O[V].object),delete O[V];delete T[U]}delete n[_]}}function A(_){if(n[_.id]===void 0)return;const T=n[_.id];for(const U in T){const O=T[U];for(const V in O)h(O[V].object),delete O[V];delete T[U]}delete n[_.id]}function R(_){for(const T in n){const U=n[T];if(U[_.id]===void 0)continue;const O=U[_.id];for(const V in O)h(O[V].object),delete O[V];delete U[_.id]}}function F(){v(),o=!0,r!==s&&(r=s,c(r.object))}function v(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:F,resetDefaultState:v,dispose:B,releaseStatesOfGeometry:A,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:m,disableUnusedAttributes:E}}function Ef(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,u){u!==0&&(i.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function a(c,h,u){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let f=0;f<u;f++)this.render(c[f],h[f]);else{d.multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let x=0;x<u;x++)g+=h[x];for(let x=0;x<d.length;x++)e.update(g,n,d[x])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function wf(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==mn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const R=A===tr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Vn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==zn&&!R)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),E=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=f>0,B=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,maxTextures:d,maxVertexTextures:f,maxTextureSize:g,maxCubemapSize:x,maxAttributes:m,maxVertexUniforms:p,maxVaryings:E,maxFragmentUniforms:S,vertexTextures:w,maxSamples:B}}function Tf(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new ii,a=new Ft,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):c();else{const E=r?0:n,S=E*4;let w=p.clippingState||null;l.value=w,w=h(g,d,S,f);for(let B=0;B!==S;++B)w[B]=e[B];p.clippingState=w,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=l.value,g!==!0||m===null){const p=f+x*4,E=d.matrixWorldInverse;a.getNormalMatrix(E),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,w=f;S!==x;++S,w+=4)o.copy(u[S]).applyMatrix4(E,a),o.normal.toArray(m,w),m[w+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}function bf(i){let t=new WeakMap;function e(o,a){return a===ao?o.mapping=Ni:a===lo&&(o.mapping=Fi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===ao||a===lo)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Fh(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Hl extends zl{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Pi=4,Ia=[.125,.215,.35,.446,.526,.582],oi=20,kr=new Hl,Da=new Xt;let Hr=null,Gr=0,Vr=0,Wr=!1;const si=(1+Math.sqrt(5))/2,Ci=1/si,Ua=[new C(-si,Ci,0),new C(si,Ci,0),new C(-Ci,0,si),new C(Ci,0,si),new C(0,si,-Ci),new C(0,si,Ci),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class Na{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Hr=this._renderer.getRenderTarget(),Gr=this._renderer.getActiveCubeFace(),Vr=this._renderer.getActiveMipmapLevel(),Wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=za(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Oa(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Hr,Gr,Vr),this._renderer.xr.enabled=Wr,t.scissorTest=!1,Fs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ni||t.mapping===Fi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Hr=this._renderer.getRenderTarget(),Gr=this._renderer.getActiveCubeFace(),Vr=this._renderer.getActiveMipmapLevel(),Wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:rn,minFilter:rn,generateMipmaps:!1,type:tr,format:mn,colorSpace:Yn,depthBuffer:!1},s=Fa(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fa(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Af(r)),this._blurMaterial=Cf(r,t,e)}return s}_compileMaterial(t){const e=new dt(this._lodPlanes[0],t);this._renderer.compile(e,kr)}_sceneToCubeUV(t,e,n,s){const a=new Be(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Da),h.toneMapping=kn,h.autoClear=!1;const f=new nr({name:"PMREM.Background",side:ke,depthWrite:!1,depthTest:!1}),g=new dt(new ee,f);let x=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,x=!0):(f.color.copy(Da),x=!0);for(let p=0;p<6;p++){const E=p%3;E===0?(a.up.set(0,l[p],0),a.lookAt(c[p],0,0)):E===1?(a.up.set(0,0,l[p]),a.lookAt(0,c[p],0)):(a.up.set(0,l[p],0),a.lookAt(0,0,c[p]));const S=this._cubeSize;Fs(s,E*S,p>2?S:0,S,S),h.setRenderTarget(s),x&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Ni||t.mapping===Fi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=za()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Oa());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new dt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;Fs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,kr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ua[(s-r-1)%Ua.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new dt(this._lodPlanes[s],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*oi-1),x=r/g,m=isFinite(r)?1+Math.floor(h*x):oi;m>oi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${oi}`);const p=[];let E=0;for(let R=0;R<oi;++R){const F=R/x,v=Math.exp(-F*F/2);p.push(v),R===0?E+=v:R<m&&(E+=2*v)}for(let R=0;R<p.length;R++)p[R]=p[R]/E;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-n;const w=this._sizeLods[s],B=3*w*(s>S-Pi?s-S+Pi:0),A=4*(this._cubeSize-w);Fs(e,B,A,3*w,2*w),l.setRenderTarget(e),l.render(u,kr)}}function Af(i){const t=[],e=[],n=[];let s=i;const r=i-Pi+1+Ia.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Pi?l=Ia[o-i+Pi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,x=3,m=2,p=1,E=new Float32Array(x*g*f),S=new Float32Array(m*g*f),w=new Float32Array(p*g*f);for(let A=0;A<f;A++){const R=A%3*2/3-1,F=A>2?0:-1,v=[R,F,0,R+2/3,F,0,R+2/3,F+1,0,R,F,0,R+2/3,F+1,0,R,F+1,0];E.set(v,x*g*A),S.set(d,m*g*A);const _=[A,A,A,A,A,A];w.set(_,p*g*A)}const B=new Qe;B.setAttribute("position",new _n(E,x)),B.setAttribute("uv",new _n(S,m)),B.setAttribute("faceIndex",new _n(w,p)),t.push(B),s>Pi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Fa(i,t,e){const n=new ci(i,t,e);return n.texture.mapping=Qs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Fs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Cf(i,t,e){const n=new Float32Array(oi),s=new C(0,1,0);return new Wn({name:"SphericalGaussianBlur",defines:{n:oi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function Oa(){return new Wn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function za(){return new Wn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Bn,depthTest:!1,depthWrite:!1})}function xo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Rf(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===ao||l===lo,h=l===Ni||l===Fi;if(c||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Na(i)),u=c?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Na(i)),u=c?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Pf(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Pl("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Lf(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const x=d.morphAttributes[g];for(let m=0,p=x.length;m<p;m++)t.remove(x[m])}d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const x=f[g];for(let m=0,p=x.length;m<p;m++)t.update(x[m],i.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let x=0;if(f!==null){const E=f.array;x=f.version;for(let S=0,w=E.length;S<w;S+=3){const B=E[S+0],A=E[S+1],R=E[S+2];d.push(B,A,A,R,R,B)}}else if(g!==void 0){const E=g.array;x=g.version;for(let S=0,w=E.length/3-1;S<w;S+=3){const B=S+0,A=S+1,R=S+2;d.push(B,A,A,R,R,B)}}else return;const m=new(Rl(d)?Fl:Nl)(d,1);m.version=x;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function If(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,f){i.drawElements(n,f,r,d*o),e.update(f,n,1)}function c(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;const x=t.get("WEBGL_multi_draw");if(x===null)for(let m=0;m<g;m++)this.render(d[m]/o,f[m]);else{x.multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}}function u(d,f,g,x){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],x[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,x,0,g);let p=0;for(let E=0;E<g;E++)p+=f[E];for(let E=0;E<x.length;E++)e.update(p,n,x[E])}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Df(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Uf(i,t,e){const n=new WeakMap,s=new se;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let _=function(){F.dispose(),n.delete(a),a.removeEventListener("dispose",_)};var f=_;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],E=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let w=0;g===!0&&(w=1),x===!0&&(w=2),m===!0&&(w=3);let B=a.attributes.position.count*w,A=1;B>t.maxTextureSize&&(A=Math.ceil(B/t.maxTextureSize),B=t.maxTextureSize);const R=new Float32Array(B*A*4*u),F=new Il(R,B,A,u);F.type=zn,F.needsUpdate=!0;const v=w*4;for(let T=0;T<u;T++){const U=p[T],O=E[T],V=S[T],z=B*A*4*T;for(let D=0;D<U.count;D++){const W=D*v;g===!0&&(s.fromBufferAttribute(U,D),R[z+W+0]=s.x,R[z+W+1]=s.y,R[z+W+2]=s.z,R[z+W+3]=0),x===!0&&(s.fromBufferAttribute(O,D),R[z+W+4]=s.x,R[z+W+5]=s.y,R[z+W+6]=s.z,R[z+W+7]=0),m===!0&&(s.fromBufferAttribute(V,D),R[z+W+8]=s.x,R[z+W+9]=s.y,R[z+W+10]=s.z,R[z+W+11]=V.itemSize===4?s.w:1)}}d={count:u,texture:F,size:new mt(B,A)},n.set(a,d),a.addEventListener("dispose",_)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const x=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Nf(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(s.get(u)!==c&&(t.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return u}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class Gl extends Fe{constructor(t,e,n,s,r,o,a,l,c,h=Ii){if(h!==Ii&&h!==Bi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ii&&(n=Oi),n===void 0&&h===Bi&&(n=zi),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Je,this.minFilter=l!==void 0?l:Je,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Vl=new Fe,Wl=new Gl(1,1);Wl.compareFunction=Cl;const Xl=new Il,ql=new xh,Yl=new Bl,Ba=[],ka=[],Ha=new Float32Array(16),Ga=new Float32Array(9),Va=new Float32Array(4);function Wi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Ba[s];if(r===void 0&&(r=new Float32Array(s),Ba[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function xe(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Me(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function ir(i,t){let e=ka[t];e===void 0&&(e=new Int32Array(t),ka[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Ff(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Of(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2fv(this.addr,t),Me(e,t)}}function zf(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(xe(e,t))return;i.uniform3fv(this.addr,t),Me(e,t)}}function Bf(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4fv(this.addr,t),Me(e,t)}}function kf(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Me(e,t)}else{if(xe(e,n))return;Va.set(n),i.uniformMatrix2fv(this.addr,!1,Va),Me(e,n)}}function Hf(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Me(e,t)}else{if(xe(e,n))return;Ga.set(n),i.uniformMatrix3fv(this.addr,!1,Ga),Me(e,n)}}function Gf(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(xe(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Me(e,t)}else{if(xe(e,n))return;Ha.set(n),i.uniformMatrix4fv(this.addr,!1,Ha),Me(e,n)}}function Vf(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Wf(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2iv(this.addr,t),Me(e,t)}}function Xf(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;i.uniform3iv(this.addr,t),Me(e,t)}}function qf(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4iv(this.addr,t),Me(e,t)}}function Yf(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Kf(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(xe(e,t))return;i.uniform2uiv(this.addr,t),Me(e,t)}}function $f(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(xe(e,t))return;i.uniform3uiv(this.addr,t),Me(e,t)}}function Jf(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(xe(e,t))return;i.uniform4uiv(this.addr,t),Me(e,t)}}function Zf(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?Wl:Vl;e.setTexture2D(t||r,s)}function jf(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ql,s)}function Qf(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Yl,s)}function tp(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Xl,s)}function ep(i){switch(i){case 5126:return Ff;case 35664:return Of;case 35665:return zf;case 35666:return Bf;case 35674:return kf;case 35675:return Hf;case 35676:return Gf;case 5124:case 35670:return Vf;case 35667:case 35671:return Wf;case 35668:case 35672:return Xf;case 35669:case 35673:return qf;case 5125:return Yf;case 36294:return Kf;case 36295:return $f;case 36296:return Jf;case 35678:case 36198:case 36298:case 36306:case 35682:return Zf;case 35679:case 36299:case 36307:return jf;case 35680:case 36300:case 36308:case 36293:return Qf;case 36289:case 36303:case 36311:case 36292:return tp}}function np(i,t){i.uniform1fv(this.addr,t)}function ip(i,t){const e=Wi(t,this.size,2);i.uniform2fv(this.addr,e)}function sp(i,t){const e=Wi(t,this.size,3);i.uniform3fv(this.addr,e)}function rp(i,t){const e=Wi(t,this.size,4);i.uniform4fv(this.addr,e)}function op(i,t){const e=Wi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function ap(i,t){const e=Wi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function lp(i,t){const e=Wi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function cp(i,t){i.uniform1iv(this.addr,t)}function hp(i,t){i.uniform2iv(this.addr,t)}function up(i,t){i.uniform3iv(this.addr,t)}function dp(i,t){i.uniform4iv(this.addr,t)}function fp(i,t){i.uniform1uiv(this.addr,t)}function pp(i,t){i.uniform2uiv(this.addr,t)}function mp(i,t){i.uniform3uiv(this.addr,t)}function gp(i,t){i.uniform4uiv(this.addr,t)}function _p(i,t,e){const n=this.cache,s=t.length,r=ir(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Vl,r[o])}function vp(i,t,e){const n=this.cache,s=t.length,r=ir(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||ql,r[o])}function xp(i,t,e){const n=this.cache,s=t.length,r=ir(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||Yl,r[o])}function Mp(i,t,e){const n=this.cache,s=t.length,r=ir(e,s);xe(n,r)||(i.uniform1iv(this.addr,r),Me(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Xl,r[o])}function yp(i){switch(i){case 5126:return np;case 35664:return ip;case 35665:return sp;case 35666:return rp;case 35674:return op;case 35675:return ap;case 35676:return lp;case 5124:case 35670:return cp;case 35667:case 35671:return hp;case 35668:case 35672:return up;case 35669:case 35673:return dp;case 5125:return fp;case 36294:return pp;case 36295:return mp;case 36296:return gp;case 35678:case 36198:case 36298:case 36306:case 35682:return _p;case 35679:case 36299:case 36307:return vp;case 35680:case 36300:case 36308:case 36293:return xp;case 36289:case 36303:case 36311:case 36292:return Mp}}class Sp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=ep(e.type)}}class Ep{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=yp(e.type)}}class wp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Xr=/(\w+)(\])?(\[|\.)?/g;function Wa(i,t){i.seq.push(t),i.map[t.id]=t}function Tp(i,t,e){const n=i.name,s=n.length;for(Xr.lastIndex=0;;){const r=Xr.exec(n),o=Xr.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Wa(e,c===void 0?new Sp(a,i,t):new Ep(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new wp(a),Wa(e,u)),e=u}}}class Gs{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Tp(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Xa(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const bp=37297;let Ap=0;function Cp(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Rp(i){const t=Zt.getPrimaries(Zt.workingColorSpace),e=Zt.getPrimaries(i);let n;switch(t===e?n="":t===Ys&&e===qs?n="LinearDisplayP3ToLinearSRGB":t===qs&&e===Ys&&(n="LinearSRGBToLinearDisplayP3"),i){case Yn:case er:return[n,"LinearTransferOETF"];case ze:case go:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function qa(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Cp(i.getShaderSource(t),o)}else return s}function Pp(i,t){const e=Rp(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Lp(i,t){let e;switch(t){case zc:e="Linear";break;case Bc:e="Reinhard";break;case kc:e="OptimizedCineon";break;case xl:e="ACESFilmic";break;case Gc:e="AgX";break;case Vc:e="Neutral";break;case Hc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Ip(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ts).join(`
`)}function Dp(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Up(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function ts(i){return i!==""}function Ya(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ka(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Np=/^[ \t]*#include +<([\w\d./]+)>/gm;function ho(i){return i.replace(Np,Op)}const Fp=new Map;function Op(i,t){let e=Nt[t];if(e===void 0){const n=Fp.get(t);if(n!==void 0)e=Nt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ho(e)}const zp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $a(i){return i.replace(zp,Bp)}function Bp(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ja(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function kp(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===gl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===_l?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===bn&&(t="SHADOWMAP_TYPE_VSM"),t}function Hp(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ni:case Fi:t="ENVMAP_TYPE_CUBE";break;case Qs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Gp(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Fi:t="ENVMAP_MODE_REFRACTION";break}return t}function Vp(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case vl:t="ENVMAP_BLENDING_MULTIPLY";break;case Fc:t="ENVMAP_BLENDING_MIX";break;case Oc:t="ENVMAP_BLENDING_ADD";break}return t}function Wp(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Xp(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=kp(e),c=Hp(e),h=Gp(e),u=Vp(e),d=Wp(e),f=Ip(e),g=Dp(r),x=s.createProgram();let m,p,E=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ts).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ts).join(`
`),p.length>0&&(p+=`
`)):(m=[Ja(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ts).join(`
`),p=[Ja(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==kn?"#define TONE_MAPPING":"",e.toneMapping!==kn?Nt.tonemapping_pars_fragment:"",e.toneMapping!==kn?Lp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Nt.colorspace_pars_fragment,Pp("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ts).join(`
`)),o=ho(o),o=Ya(o,e),o=Ka(o,e),a=ho(a),a=Ya(a,e),a=Ka(a,e),o=$a(o),a=$a(a),e.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===da?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===da?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=E+m+o,w=E+p+a,B=Xa(s,s.VERTEX_SHADER,S),A=Xa(s,s.FRAGMENT_SHADER,w);s.attachShader(x,B),s.attachShader(x,A),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(T){if(i.debug.checkShaderErrors){const U=s.getProgramInfoLog(x).trim(),O=s.getShaderInfoLog(B).trim(),V=s.getShaderInfoLog(A).trim();let z=!0,D=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,B,A);else{const W=qa(s,B,"vertex"),H=qa(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+T.name+`
Material Type: `+T.type+`

Program Info Log: `+U+`
`+W+`
`+H)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(O===""||V==="")&&(D=!1);D&&(T.diagnostics={runnable:z,programLog:U,vertexShader:{log:O,prefix:m},fragmentShader:{log:V,prefix:p}})}s.deleteShader(B),s.deleteShader(A),F=new Gs(s,x),v=Up(s,x)}let F;this.getUniforms=function(){return F===void 0&&R(this),F};let v;this.getAttributes=function(){return v===void 0&&R(this),v};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(x,bp)),_},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ap++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=B,this.fragmentShader=A,this}let qp=0;class Yp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Kp(t),e.set(t,n)),n}}class Kp{constructor(t){this.id=qp++,this.code=t,this.usedTimes=0}}function $p(i,t,e,n,s,r,o){const a=new Dl,l=new Yp,c=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(v){return c.add(v),v===0?"uv":`uv${v}`}function m(v,_,T,U,O){const V=U.fog,z=O.geometry,D=v.isMeshStandardMaterial?U.environment:null,W=(v.isMeshStandardMaterial?e:t).get(v.envMap||D),H=W&&W.mapping===Qs?W.image.height:null,tt=g[v.type];v.precision!==null&&(f=s.getMaxPrecision(v.precision),f!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",f,"instead."));const Q=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ot=Q!==void 0?Q.length:0;let St=0;z.morphAttributes.position!==void 0&&(St=1),z.morphAttributes.normal!==void 0&&(St=2),z.morphAttributes.color!==void 0&&(St=3);let bt,q,J,ut;if(tt){const jt=un[tt];bt=jt.vertexShader,q=jt.fragmentShader}else bt=v.vertexShader,q=v.fragmentShader,l.update(v),J=l.getVertexShaderID(v),ut=l.getFragmentShaderID(v);const st=i.getRenderTarget(),Dt=O.isInstancedMesh===!0,Lt=O.isBatchedMesh===!0,qt=!!v.map,L=!!v.matcap,Wt=!!W,Gt=!!v.aoMap,oe=!!v.lightMap,Tt=!!v.bumpMap,Yt=!!v.normalMap,kt=!!v.displacementMap,Ut=!!v.emissiveMap,de=!!v.metalnessMap,b=!!v.roughnessMap,M=v.anisotropy>0,X=v.clearcoat>0,$=v.dispersion>0,Z=v.iridescence>0,j=v.sheen>0,Et=v.transmission>0,lt=M&&!!v.anisotropyMap,ct=X&&!!v.clearcoatMap,zt=X&&!!v.clearcoatNormalMap,et=X&&!!v.clearcoatRoughnessMap,Mt=Z&&!!v.iridescenceMap,Ht=Z&&!!v.iridescenceThicknessMap,Rt=j&&!!v.sheenColorMap,ht=j&&!!v.sheenRoughnessMap,Bt=!!v.specularMap,Vt=!!v.specularColorMap,he=!!v.specularIntensityMap,P=Et&&!!v.transmissionMap,ft=Et&&!!v.thicknessMap,Y=!!v.gradientMap,K=!!v.alphaMap,it=v.alphaTest>0,Pt=!!v.alphaHash,Kt=!!v.extensions;let ue=kn;v.toneMapped&&(st===null||st.isXRRenderTarget===!0)&&(ue=i.toneMapping);const ye={shaderID:tt,shaderType:v.type,shaderName:v.name,vertexShader:bt,fragmentShader:q,defines:v.defines,customVertexShaderID:J,customFragmentShaderID:ut,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:f,batching:Lt,batchingColor:Lt&&O._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&O.instanceColor!==null,instancingMorph:Dt&&O.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:st===null?i.outputColorSpace:st.isXRRenderTarget===!0?st.texture.colorSpace:Yn,alphaToCoverage:!!v.alphaToCoverage,map:qt,matcap:L,envMap:Wt,envMapMode:Wt&&W.mapping,envMapCubeUVHeight:H,aoMap:Gt,lightMap:oe,bumpMap:Tt,normalMap:Yt,displacementMap:d&&kt,emissiveMap:Ut,normalMapObjectSpace:Yt&&v.normalMapType===ih,normalMapTangentSpace:Yt&&v.normalMapType===Al,metalnessMap:de,roughnessMap:b,anisotropy:M,anisotropyMap:lt,clearcoat:X,clearcoatMap:ct,clearcoatNormalMap:zt,clearcoatRoughnessMap:et,dispersion:$,iridescence:Z,iridescenceMap:Mt,iridescenceThicknessMap:Ht,sheen:j,sheenColorMap:Rt,sheenRoughnessMap:ht,specularMap:Bt,specularColorMap:Vt,specularIntensityMap:he,transmission:Et,transmissionMap:P,thicknessMap:ft,gradientMap:Y,opaque:v.transparent===!1&&v.blending===Li&&v.alphaToCoverage===!1,alphaMap:K,alphaTest:it,alphaHash:Pt,combine:v.combine,mapUv:qt&&x(v.map.channel),aoMapUv:Gt&&x(v.aoMap.channel),lightMapUv:oe&&x(v.lightMap.channel),bumpMapUv:Tt&&x(v.bumpMap.channel),normalMapUv:Yt&&x(v.normalMap.channel),displacementMapUv:kt&&x(v.displacementMap.channel),emissiveMapUv:Ut&&x(v.emissiveMap.channel),metalnessMapUv:de&&x(v.metalnessMap.channel),roughnessMapUv:b&&x(v.roughnessMap.channel),anisotropyMapUv:lt&&x(v.anisotropyMap.channel),clearcoatMapUv:ct&&x(v.clearcoatMap.channel),clearcoatNormalMapUv:zt&&x(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:et&&x(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&x(v.iridescenceMap.channel),iridescenceThicknessMapUv:Ht&&x(v.iridescenceThicknessMap.channel),sheenColorMapUv:Rt&&x(v.sheenColorMap.channel),sheenRoughnessMapUv:ht&&x(v.sheenRoughnessMap.channel),specularMapUv:Bt&&x(v.specularMap.channel),specularColorMapUv:Vt&&x(v.specularColorMap.channel),specularIntensityMapUv:he&&x(v.specularIntensityMap.channel),transmissionMapUv:P&&x(v.transmissionMap.channel),thicknessMapUv:ft&&x(v.thicknessMap.channel),alphaMapUv:K&&x(v.alphaMap.channel),vertexTangents:!!z.attributes.tangent&&(Yt||M),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!z.attributes.uv&&(qt||K),fog:!!V,useFog:v.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:O.isSkinnedMesh===!0,morphTargets:z.morphAttributes.position!==void 0,morphNormals:z.morphAttributes.normal!==void 0,morphColors:z.morphAttributes.color!==void 0,morphTargetsCount:ot,morphTextureStride:St,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&T.length>0,shadowMapType:i.shadowMap.type,toneMapping:ue,decodeVideoTexture:qt&&v.map.isVideoTexture===!0&&Zt.getTransfer(v.map.colorSpace)===ie,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===fn,flipSided:v.side===ke,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Kt&&v.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Kt&&v.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return ye.vertexUv1s=c.has(1),ye.vertexUv2s=c.has(2),ye.vertexUv3s=c.has(3),c.clear(),ye}function p(v){const _=[];if(v.shaderID?_.push(v.shaderID):(_.push(v.customVertexShaderID),_.push(v.customFragmentShaderID)),v.defines!==void 0)for(const T in v.defines)_.push(T),_.push(v.defines[T]);return v.isRawShaderMaterial===!1&&(E(_,v),S(_,v),_.push(i.outputColorSpace)),_.push(v.customProgramCacheKey),_.join()}function E(v,_){v.push(_.precision),v.push(_.outputColorSpace),v.push(_.envMapMode),v.push(_.envMapCubeUVHeight),v.push(_.mapUv),v.push(_.alphaMapUv),v.push(_.lightMapUv),v.push(_.aoMapUv),v.push(_.bumpMapUv),v.push(_.normalMapUv),v.push(_.displacementMapUv),v.push(_.emissiveMapUv),v.push(_.metalnessMapUv),v.push(_.roughnessMapUv),v.push(_.anisotropyMapUv),v.push(_.clearcoatMapUv),v.push(_.clearcoatNormalMapUv),v.push(_.clearcoatRoughnessMapUv),v.push(_.iridescenceMapUv),v.push(_.iridescenceThicknessMapUv),v.push(_.sheenColorMapUv),v.push(_.sheenRoughnessMapUv),v.push(_.specularMapUv),v.push(_.specularColorMapUv),v.push(_.specularIntensityMapUv),v.push(_.transmissionMapUv),v.push(_.thicknessMapUv),v.push(_.combine),v.push(_.fogExp2),v.push(_.sizeAttenuation),v.push(_.morphTargetsCount),v.push(_.morphAttributeCount),v.push(_.numDirLights),v.push(_.numPointLights),v.push(_.numSpotLights),v.push(_.numSpotLightMaps),v.push(_.numHemiLights),v.push(_.numRectAreaLights),v.push(_.numDirLightShadows),v.push(_.numPointLightShadows),v.push(_.numSpotLightShadows),v.push(_.numSpotLightShadowsWithMaps),v.push(_.numLightProbes),v.push(_.shadowMapType),v.push(_.toneMapping),v.push(_.numClippingPlanes),v.push(_.numClipIntersection),v.push(_.depthPacking)}function S(v,_){a.disableAll(),_.supportsVertexTextures&&a.enable(0),_.instancing&&a.enable(1),_.instancingColor&&a.enable(2),_.instancingMorph&&a.enable(3),_.matcap&&a.enable(4),_.envMap&&a.enable(5),_.normalMapObjectSpace&&a.enable(6),_.normalMapTangentSpace&&a.enable(7),_.clearcoat&&a.enable(8),_.iridescence&&a.enable(9),_.alphaTest&&a.enable(10),_.vertexColors&&a.enable(11),_.vertexAlphas&&a.enable(12),_.vertexUv1s&&a.enable(13),_.vertexUv2s&&a.enable(14),_.vertexUv3s&&a.enable(15),_.vertexTangents&&a.enable(16),_.anisotropy&&a.enable(17),_.alphaHash&&a.enable(18),_.batching&&a.enable(19),_.dispersion&&a.enable(20),_.batchingColor&&a.enable(21),v.push(a.mask),a.disableAll(),_.fog&&a.enable(0),_.useFog&&a.enable(1),_.flatShading&&a.enable(2),_.logarithmicDepthBuffer&&a.enable(3),_.skinning&&a.enable(4),_.morphTargets&&a.enable(5),_.morphNormals&&a.enable(6),_.morphColors&&a.enable(7),_.premultipliedAlpha&&a.enable(8),_.shadowMapEnabled&&a.enable(9),_.doubleSided&&a.enable(10),_.flipSided&&a.enable(11),_.useDepthPacking&&a.enable(12),_.dithering&&a.enable(13),_.transmission&&a.enable(14),_.sheen&&a.enable(15),_.opaque&&a.enable(16),_.pointsUvs&&a.enable(17),_.decodeVideoTexture&&a.enable(18),_.alphaToCoverage&&a.enable(19),v.push(a.mask)}function w(v){const _=g[v.type];let T;if(_){const U=un[_];T=Ih.clone(U.uniforms)}else T=v.uniforms;return T}function B(v,_){let T;for(let U=0,O=h.length;U<O;U++){const V=h[U];if(V.cacheKey===_){T=V,++T.usedTimes;break}}return T===void 0&&(T=new Xp(i,_,v,r),h.push(T)),T}function A(v){if(--v.usedTimes===0){const _=h.indexOf(v);h[_]=h[h.length-1],h.pop(),v.destroy()}}function R(v){l.remove(v)}function F(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:w,acquireProgram:B,releaseProgram:A,releaseShaderCache:R,programs:h,dispose:F}}function Jp(){let i=new WeakMap;function t(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function e(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function Zp(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Za(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ja(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,x,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:x,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=x,p.group=m),t++,p}function a(u,d,f,g,x,m){const p=o(u,d,f,g,x,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function l(u,d,f,g,x,m){const p=o(u,d,f,g,x,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||Zp),n.length>1&&n.sort(d||Za),s.length>1&&s.sort(d||Za)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function jp(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new ja,i.set(n,[o])):s>=r.length?(o=new ja,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function Qp(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Xt};break;case"SpotLight":e={position:new C,direction:new C,color:new Xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Xt,groundColor:new Xt};break;case"RectAreaLight":e={color:new Xt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function tm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let em=0;function nm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function im(i){const t=new Qp,e=tm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const s=new C,r=new re,o=new re;function a(c){let h=0,u=0,d=0;for(let v=0;v<9;v++)n.probe[v].set(0,0,0);let f=0,g=0,x=0,m=0,p=0,E=0,S=0,w=0,B=0,A=0,R=0;c.sort(nm);for(let v=0,_=c.length;v<_;v++){const T=c[v],U=T.color,O=T.intensity,V=T.distance,z=T.shadow&&T.shadow.map?T.shadow.map.texture:null;if(T.isAmbientLight)h+=U.r*O,u+=U.g*O,d+=U.b*O;else if(T.isLightProbe){for(let D=0;D<9;D++)n.probe[D].addScaledVector(T.sh.coefficients[D],O);R++}else if(T.isDirectionalLight){const D=t.get(T);if(D.color.copy(T.color).multiplyScalar(T.intensity),T.castShadow){const W=T.shadow,H=e.get(T);H.shadowBias=W.bias,H.shadowNormalBias=W.normalBias,H.shadowRadius=W.radius,H.shadowMapSize=W.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=z,n.directionalShadowMatrix[f]=T.shadow.matrix,E++}n.directional[f]=D,f++}else if(T.isSpotLight){const D=t.get(T);D.position.setFromMatrixPosition(T.matrixWorld),D.color.copy(U).multiplyScalar(O),D.distance=V,D.coneCos=Math.cos(T.angle),D.penumbraCos=Math.cos(T.angle*(1-T.penumbra)),D.decay=T.decay,n.spot[x]=D;const W=T.shadow;if(T.map&&(n.spotLightMap[B]=T.map,B++,W.updateMatrices(T),T.castShadow&&A++),n.spotLightMatrix[x]=W.matrix,T.castShadow){const H=e.get(T);H.shadowBias=W.bias,H.shadowNormalBias=W.normalBias,H.shadowRadius=W.radius,H.shadowMapSize=W.mapSize,n.spotShadow[x]=H,n.spotShadowMap[x]=z,w++}x++}else if(T.isRectAreaLight){const D=t.get(T);D.color.copy(U).multiplyScalar(O),D.halfWidth.set(T.width*.5,0,0),D.halfHeight.set(0,T.height*.5,0),n.rectArea[m]=D,m++}else if(T.isPointLight){const D=t.get(T);if(D.color.copy(T.color).multiplyScalar(T.intensity),D.distance=T.distance,D.decay=T.decay,T.castShadow){const W=T.shadow,H=e.get(T);H.shadowBias=W.bias,H.shadowNormalBias=W.normalBias,H.shadowRadius=W.radius,H.shadowMapSize=W.mapSize,H.shadowCameraNear=W.camera.near,H.shadowCameraFar=W.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=z,n.pointShadowMatrix[g]=T.shadow.matrix,S++}n.point[g]=D,g++}else if(T.isHemisphereLight){const D=t.get(T);D.skyColor.copy(T.color).multiplyScalar(O),D.groundColor.copy(T.groundColor).multiplyScalar(O),n.hemi[p]=D,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=rt.LTC_FLOAT_1,n.rectAreaLTC2=rt.LTC_FLOAT_2):(n.rectAreaLTC1=rt.LTC_HALF_1,n.rectAreaLTC2=rt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const F=n.hash;(F.directionalLength!==f||F.pointLength!==g||F.spotLength!==x||F.rectAreaLength!==m||F.hemiLength!==p||F.numDirectionalShadows!==E||F.numPointShadows!==S||F.numSpotShadows!==w||F.numSpotMaps!==B||F.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=w+B-A,n.spotLightMap.length=B,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,F.directionalLength=f,F.pointLength=g,F.spotLength=x,F.rectAreaLength=m,F.hemiLength=p,F.numDirectionalShadows=E,F.numPointShadows=S,F.numSpotShadows=w,F.numSpotMaps=B,F.numLightProbes=R,n.version=em++)}function l(c,h){let u=0,d=0,f=0,g=0,x=0;const m=h.matrixWorldInverse;for(let p=0,E=c.length;p<E;p++){const S=c[p];if(S.isDirectionalLight){const w=n.directional[u];w.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),u++}else if(S.isSpotLight){const w=n.spot[f];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(S.matrixWorld),s.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),f++}else if(S.isRectAreaLight){const w=n.rectArea[g];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(m),o.identity(),r.copy(S.matrixWorld),r.premultiply(m),o.extractRotation(r),w.halfWidth.set(S.width*.5,0,0),w.halfHeight.set(0,S.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){const w=n.point[d];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){const w=n.hemi[x];w.direction.setFromMatrixPosition(S.matrixWorld),w.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:n}}function Qa(i){const t=new im(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function sm(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Qa(i),t.set(s,[a])):r>=o.length?(a=new Qa(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class rm extends as{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=eh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class om extends as{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const am=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,lm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function cm(i,t,e){let n=new vo;const s=new mt,r=new mt,o=new se,a=new rm({depthPacking:nh}),l=new om,c={},h=e.maxTextureSize,u={[Gn]:ke,[ke]:Gn,[fn]:fn},d=new Wn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new mt},radius:{value:4}},vertexShader:am,fragmentShader:lm}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Qe;g.setAttribute("position",new _n(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new dt(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gl;let p=this.type;this.render=function(A,R,F){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const v=i.getRenderTarget(),_=i.getActiveCubeFace(),T=i.getActiveMipmapLevel(),U=i.state;U.setBlending(Bn),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const O=p!==bn&&this.type===bn,V=p===bn&&this.type!==bn;for(let z=0,D=A.length;z<D;z++){const W=A[z],H=W.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",W,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const tt=H.getFrameExtents();if(s.multiply(tt),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/tt.x),s.x=r.x*tt.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/tt.y),s.y=r.y*tt.y,H.mapSize.y=r.y)),H.map===null||O===!0||V===!0){const ot=this.type!==bn?{minFilter:Je,magFilter:Je}:{};H.map!==null&&H.map.dispose(),H.map=new ci(s.x,s.y,ot),H.map.texture.name=W.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const Q=H.getViewportCount();for(let ot=0;ot<Q;ot++){const St=H.getViewport(ot);o.set(r.x*St.x,r.y*St.y,r.x*St.z,r.y*St.w),U.viewport(o),H.updateMatrices(W,ot),n=H.getFrustum(),w(R,F,H.camera,W,this.type)}H.isPointLightShadow!==!0&&this.type===bn&&E(H,F),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(v,_,T)};function E(A,R){const F=t.update(x);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ci(s.x,s.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(R,null,F,d,x,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(R,null,F,f,x,null)}function S(A,R,F,v){let _=null;const T=F.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(T!==void 0)_=T;else if(_=F.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const U=_.uuid,O=R.uuid;let V=c[U];V===void 0&&(V={},c[U]=V);let z=V[O];z===void 0&&(z=_.clone(),V[O]=z,R.addEventListener("dispose",B)),_=z}if(_.visible=R.visible,_.wireframe=R.wireframe,v===bn?_.side=R.shadowSide!==null?R.shadowSide:R.side:_.side=R.shadowSide!==null?R.shadowSide:u[R.side],_.alphaMap=R.alphaMap,_.alphaTest=R.alphaTest,_.map=R.map,_.clipShadows=R.clipShadows,_.clippingPlanes=R.clippingPlanes,_.clipIntersection=R.clipIntersection,_.displacementMap=R.displacementMap,_.displacementScale=R.displacementScale,_.displacementBias=R.displacementBias,_.wireframeLinewidth=R.wireframeLinewidth,_.linewidth=R.linewidth,F.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const U=i.properties.get(_);U.light=F}return _}function w(A,R,F,v,_){if(A.visible===!1)return;if(A.layers.test(R.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&_===bn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,A.matrixWorld);const O=t.update(A),V=A.material;if(Array.isArray(V)){const z=O.groups;for(let D=0,W=z.length;D<W;D++){const H=z[D],tt=V[H.materialIndex];if(tt&&tt.visible){const Q=S(A,tt,v,_);A.onBeforeShadow(i,A,R,F,O,Q,H),i.renderBufferDirect(F,null,O,Q,A,H),A.onAfterShadow(i,A,R,F,O,Q,H)}}}else if(V.visible){const z=S(A,V,v,_);A.onBeforeShadow(i,A,R,F,O,z,null),i.renderBufferDirect(F,null,O,z,A,null),A.onAfterShadow(i,A,R,F,O,z,null)}}const U=A.children;for(let O=0,V=U.length;O<V;O++)w(U[O],R,F,v,_)}function B(A){A.target.removeEventListener("dispose",B);for(const F in c){const v=c[F],_=A.target.uuid;_ in v&&(v[_].dispose(),delete v[_])}}}function hm(i){function t(){let P=!1;const ft=new se;let Y=null;const K=new se(0,0,0,0);return{setMask:function(it){Y!==it&&!P&&(i.colorMask(it,it,it,it),Y=it)},setLocked:function(it){P=it},setClear:function(it,Pt,Kt,ue,ye){ye===!0&&(it*=ue,Pt*=ue,Kt*=ue),ft.set(it,Pt,Kt,ue),K.equals(ft)===!1&&(i.clearColor(it,Pt,Kt,ue),K.copy(ft))},reset:function(){P=!1,Y=null,K.set(-1,0,0,0)}}}function e(){let P=!1,ft=null,Y=null,K=null;return{setTest:function(it){it?ut(i.DEPTH_TEST):st(i.DEPTH_TEST)},setMask:function(it){ft!==it&&!P&&(i.depthMask(it),ft=it)},setFunc:function(it){if(Y!==it){switch(it){case Rc:i.depthFunc(i.NEVER);break;case Pc:i.depthFunc(i.ALWAYS);break;case Lc:i.depthFunc(i.LESS);break;case Vs:i.depthFunc(i.LEQUAL);break;case Ic:i.depthFunc(i.EQUAL);break;case Dc:i.depthFunc(i.GEQUAL);break;case Uc:i.depthFunc(i.GREATER);break;case Nc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Y=it}},setLocked:function(it){P=it},setClear:function(it){K!==it&&(i.clearDepth(it),K=it)},reset:function(){P=!1,ft=null,Y=null,K=null}}}function n(){let P=!1,ft=null,Y=null,K=null,it=null,Pt=null,Kt=null,ue=null,ye=null;return{setTest:function(jt){P||(jt?ut(i.STENCIL_TEST):st(i.STENCIL_TEST))},setMask:function(jt){ft!==jt&&!P&&(i.stencilMask(jt),ft=jt)},setFunc:function(jt,ln,cn){(Y!==jt||K!==ln||it!==cn)&&(i.stencilFunc(jt,ln,cn),Y=jt,K=ln,it=cn)},setOp:function(jt,ln,cn){(Pt!==jt||Kt!==ln||ue!==cn)&&(i.stencilOp(jt,ln,cn),Pt=jt,Kt=ln,ue=cn)},setLocked:function(jt){P=jt},setClear:function(jt){ye!==jt&&(i.clearStencil(jt),ye=jt)},reset:function(){P=!1,ft=null,Y=null,K=null,it=null,Pt=null,Kt=null,ue=null,ye=null}}}const s=new t,r=new e,o=new n,a=new WeakMap,l=new WeakMap;let c={},h={},u=new WeakMap,d=[],f=null,g=!1,x=null,m=null,p=null,E=null,S=null,w=null,B=null,A=new Xt(0,0,0),R=0,F=!1,v=null,_=null,T=null,U=null,O=null;const V=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,D=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(D=parseFloat(/^WebGL (\d)/.exec(W)[1]),z=D>=1):W.indexOf("OpenGL ES")!==-1&&(D=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),z=D>=2);let H=null,tt={};const Q=i.getParameter(i.SCISSOR_BOX),ot=i.getParameter(i.VIEWPORT),St=new se().fromArray(Q),bt=new se().fromArray(ot);function q(P,ft,Y,K){const it=new Uint8Array(4),Pt=i.createTexture();i.bindTexture(P,Pt),i.texParameteri(P,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(P,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Kt=0;Kt<Y;Kt++)P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY?i.texImage3D(ft,0,i.RGBA,1,1,K,0,i.RGBA,i.UNSIGNED_BYTE,it):i.texImage2D(ft+Kt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,it);return Pt}const J={};J[i.TEXTURE_2D]=q(i.TEXTURE_2D,i.TEXTURE_2D,1),J[i.TEXTURE_CUBE_MAP]=q(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[i.TEXTURE_2D_ARRAY]=q(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),J[i.TEXTURE_3D]=q(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ut(i.DEPTH_TEST),r.setFunc(Vs),Tt(!1),Yt(Uo),ut(i.CULL_FACE),Gt(Bn);function ut(P){c[P]!==!0&&(i.enable(P),c[P]=!0)}function st(P){c[P]!==!1&&(i.disable(P),c[P]=!1)}function Dt(P,ft){return h[P]!==ft?(i.bindFramebuffer(P,ft),h[P]=ft,P===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=ft),P===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=ft),!0):!1}function Lt(P,ft){let Y=d,K=!1;if(P){Y=u.get(ft),Y===void 0&&(Y=[],u.set(ft,Y));const it=P.textures;if(Y.length!==it.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let Pt=0,Kt=it.length;Pt<Kt;Pt++)Y[Pt]=i.COLOR_ATTACHMENT0+Pt;Y.length=it.length,K=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,K=!0);K&&i.drawBuffers(Y)}function qt(P){return f!==P?(i.useProgram(P),f=P,!0):!1}const L={[ri]:i.FUNC_ADD,[dc]:i.FUNC_SUBTRACT,[fc]:i.FUNC_REVERSE_SUBTRACT};L[pc]=i.MIN,L[mc]=i.MAX;const Wt={[gc]:i.ZERO,[_c]:i.ONE,[vc]:i.SRC_COLOR,[ro]:i.SRC_ALPHA,[wc]:i.SRC_ALPHA_SATURATE,[Sc]:i.DST_COLOR,[Mc]:i.DST_ALPHA,[xc]:i.ONE_MINUS_SRC_COLOR,[oo]:i.ONE_MINUS_SRC_ALPHA,[Ec]:i.ONE_MINUS_DST_COLOR,[yc]:i.ONE_MINUS_DST_ALPHA,[Tc]:i.CONSTANT_COLOR,[bc]:i.ONE_MINUS_CONSTANT_COLOR,[Ac]:i.CONSTANT_ALPHA,[Cc]:i.ONE_MINUS_CONSTANT_ALPHA};function Gt(P,ft,Y,K,it,Pt,Kt,ue,ye,jt){if(P===Bn){g===!0&&(st(i.BLEND),g=!1);return}if(g===!1&&(ut(i.BLEND),g=!0),P!==uc){if(P!==x||jt!==F){if((m!==ri||S!==ri)&&(i.blendEquation(i.FUNC_ADD),m=ri,S=ri),jt)switch(P){case Li:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case No:i.blendFunc(i.ONE,i.ONE);break;case Fo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Oo:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case Li:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case No:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Fo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Oo:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}p=null,E=null,w=null,B=null,A.set(0,0,0),R=0,x=P,F=jt}return}it=it||ft,Pt=Pt||Y,Kt=Kt||K,(ft!==m||it!==S)&&(i.blendEquationSeparate(L[ft],L[it]),m=ft,S=it),(Y!==p||K!==E||Pt!==w||Kt!==B)&&(i.blendFuncSeparate(Wt[Y],Wt[K],Wt[Pt],Wt[Kt]),p=Y,E=K,w=Pt,B=Kt),(ue.equals(A)===!1||ye!==R)&&(i.blendColor(ue.r,ue.g,ue.b,ye),A.copy(ue),R=ye),x=P,F=!1}function oe(P,ft){P.side===fn?st(i.CULL_FACE):ut(i.CULL_FACE);let Y=P.side===ke;ft&&(Y=!Y),Tt(Y),P.blending===Li&&P.transparent===!1?Gt(Bn):Gt(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),r.setFunc(P.depthFunc),r.setTest(P.depthTest),r.setMask(P.depthWrite),s.setMask(P.colorWrite);const K=P.stencilWrite;o.setTest(K),K&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),Ut(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?ut(i.SAMPLE_ALPHA_TO_COVERAGE):st(i.SAMPLE_ALPHA_TO_COVERAGE)}function Tt(P){v!==P&&(P?i.frontFace(i.CW):i.frontFace(i.CCW),v=P)}function Yt(P){P!==cc?(ut(i.CULL_FACE),P!==_&&(P===Uo?i.cullFace(i.BACK):P===hc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):st(i.CULL_FACE),_=P}function kt(P){P!==T&&(z&&i.lineWidth(P),T=P)}function Ut(P,ft,Y){P?(ut(i.POLYGON_OFFSET_FILL),(U!==ft||O!==Y)&&(i.polygonOffset(ft,Y),U=ft,O=Y)):st(i.POLYGON_OFFSET_FILL)}function de(P){P?ut(i.SCISSOR_TEST):st(i.SCISSOR_TEST)}function b(P){P===void 0&&(P=i.TEXTURE0+V-1),H!==P&&(i.activeTexture(P),H=P)}function M(P,ft,Y){Y===void 0&&(H===null?Y=i.TEXTURE0+V-1:Y=H);let K=tt[Y];K===void 0&&(K={type:void 0,texture:void 0},tt[Y]=K),(K.type!==P||K.texture!==ft)&&(H!==Y&&(i.activeTexture(Y),H=Y),i.bindTexture(P,ft||J[P]),K.type=P,K.texture=ft)}function X(){const P=tt[H];P!==void 0&&P.type!==void 0&&(i.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Z(){try{i.compressedTexImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function j(){try{i.texSubImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Et(){try{i.texSubImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function lt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ct(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function zt(){try{i.texStorage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function et(){try{i.texStorage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Mt(){try{i.texImage2D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ht(){try{i.texImage3D.apply(i,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Rt(P){St.equals(P)===!1&&(i.scissor(P.x,P.y,P.z,P.w),St.copy(P))}function ht(P){bt.equals(P)===!1&&(i.viewport(P.x,P.y,P.z,P.w),bt.copy(P))}function Bt(P,ft){let Y=l.get(ft);Y===void 0&&(Y=new WeakMap,l.set(ft,Y));let K=Y.get(P);K===void 0&&(K=i.getUniformBlockIndex(ft,P.name),Y.set(P,K))}function Vt(P,ft){const K=l.get(ft).get(P);a.get(ft)!==K&&(i.uniformBlockBinding(ft,K,P.__bindingPointIndex),a.set(ft,K))}function he(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},H=null,tt={},h={},u=new WeakMap,d=[],f=null,g=!1,x=null,m=null,p=null,E=null,S=null,w=null,B=null,A=new Xt(0,0,0),R=0,F=!1,v=null,_=null,T=null,U=null,O=null,St.set(0,0,i.canvas.width,i.canvas.height),bt.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:ut,disable:st,bindFramebuffer:Dt,drawBuffers:Lt,useProgram:qt,setBlending:Gt,setMaterial:oe,setFlipSided:Tt,setCullFace:Yt,setLineWidth:kt,setPolygonOffset:Ut,setScissorTest:de,activeTexture:b,bindTexture:M,unbindTexture:X,compressedTexImage2D:$,compressedTexImage3D:Z,texImage2D:Mt,texImage3D:Ht,updateUBOMapping:Bt,uniformBlockBinding:Vt,texStorage2D:zt,texStorage3D:et,texSubImage2D:j,texSubImage3D:Et,compressedTexSubImage2D:lt,compressedTexSubImage3D:ct,scissor:Rt,viewport:ht,reset:he}}function um(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new mt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,M){return f?new OffscreenCanvas(b,M):Js("canvas")}function x(b,M,X){let $=1;const Z=de(b);if((Z.width>X||Z.height>X)&&($=X/Math.max(Z.width,Z.height)),$<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const j=Math.floor($*Z.width),Et=Math.floor($*Z.height);u===void 0&&(u=g(j,Et));const lt=M?g(j,Et):u;return lt.width=j,lt.height=Et,lt.getContext("2d").drawImage(b,0,0,j,Et),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+j+"x"+Et+")."),lt}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),b;return b}function m(b){return b.generateMipmaps&&b.minFilter!==Je&&b.minFilter!==rn}function p(b){i.generateMipmap(b)}function E(b,M,X,$,Z=!1){if(b!==null){if(i[b]!==void 0)return i[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let j=M;if(M===i.RED&&(X===i.FLOAT&&(j=i.R32F),X===i.HALF_FLOAT&&(j=i.R16F),X===i.UNSIGNED_BYTE&&(j=i.R8)),M===i.RED_INTEGER&&(X===i.UNSIGNED_BYTE&&(j=i.R8UI),X===i.UNSIGNED_SHORT&&(j=i.R16UI),X===i.UNSIGNED_INT&&(j=i.R32UI),X===i.BYTE&&(j=i.R8I),X===i.SHORT&&(j=i.R16I),X===i.INT&&(j=i.R32I)),M===i.RG&&(X===i.FLOAT&&(j=i.RG32F),X===i.HALF_FLOAT&&(j=i.RG16F),X===i.UNSIGNED_BYTE&&(j=i.RG8)),M===i.RG_INTEGER&&(X===i.UNSIGNED_BYTE&&(j=i.RG8UI),X===i.UNSIGNED_SHORT&&(j=i.RG16UI),X===i.UNSIGNED_INT&&(j=i.RG32UI),X===i.BYTE&&(j=i.RG8I),X===i.SHORT&&(j=i.RG16I),X===i.INT&&(j=i.RG32I)),M===i.RGB&&X===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),M===i.RGBA){const Et=Z?Xs:Zt.getTransfer($);X===i.FLOAT&&(j=i.RGBA32F),X===i.HALF_FLOAT&&(j=i.RGBA16F),X===i.UNSIGNED_BYTE&&(j=Et===ie?i.SRGB8_ALPHA8:i.RGBA8),X===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),X===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function S(b,M){let X;return b?M===null||M===Oi||M===zi?X=i.DEPTH24_STENCIL8:M===zn?X=i.DEPTH32F_STENCIL8:M===Ws&&(X=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Oi||M===zi?X=i.DEPTH_COMPONENT24:M===zn?X=i.DEPTH_COMPONENT32F:M===Ws&&(X=i.DEPTH_COMPONENT16),X}function w(b,M){return m(b)===!0||b.isFramebufferTexture&&b.minFilter!==Je&&b.minFilter!==rn?Math.log2(Math.max(M.width,M.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?M.mipmaps.length:1}function B(b){const M=b.target;M.removeEventListener("dispose",B),R(M),M.isVideoTexture&&h.delete(M)}function A(b){const M=b.target;M.removeEventListener("dispose",A),v(M)}function R(b){const M=n.get(b);if(M.__webglInit===void 0)return;const X=b.source,$=d.get(X);if($){const Z=$[M.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&F(b),Object.keys($).length===0&&d.delete(X)}n.remove(b)}function F(b){const M=n.get(b);i.deleteTexture(M.__webglTexture);const X=b.source,$=d.get(X);delete $[M.__cacheKey],o.memory.textures--}function v(b){const M=n.get(b);if(b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(M.__webglFramebuffer[$]))for(let Z=0;Z<M.__webglFramebuffer[$].length;Z++)i.deleteFramebuffer(M.__webglFramebuffer[$][Z]);else i.deleteFramebuffer(M.__webglFramebuffer[$]);M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer[$])}else{if(Array.isArray(M.__webglFramebuffer))for(let $=0;$<M.__webglFramebuffer.length;$++)i.deleteFramebuffer(M.__webglFramebuffer[$]);else i.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&i.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&i.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let $=0;$<M.__webglColorRenderbuffer.length;$++)M.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(M.__webglColorRenderbuffer[$]);M.__webglDepthRenderbuffer&&i.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const X=b.textures;for(let $=0,Z=X.length;$<Z;$++){const j=n.get(X[$]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),o.memory.textures--),n.remove(X[$])}n.remove(b)}let _=0;function T(){_=0}function U(){const b=_;return b>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+s.maxTextures),_+=1,b}function O(b){const M=[];return M.push(b.wrapS),M.push(b.wrapT),M.push(b.wrapR||0),M.push(b.magFilter),M.push(b.minFilter),M.push(b.anisotropy),M.push(b.internalFormat),M.push(b.format),M.push(b.type),M.push(b.generateMipmaps),M.push(b.premultiplyAlpha),M.push(b.flipY),M.push(b.unpackAlignment),M.push(b.colorSpace),M.join()}function V(b,M){const X=n.get(b);if(b.isVideoTexture&&kt(b),b.isRenderTargetTexture===!1&&b.version>0&&X.__version!==b.version){const $=b.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{bt(X,b,M);return}}e.bindTexture(i.TEXTURE_2D,X.__webglTexture,i.TEXTURE0+M)}function z(b,M){const X=n.get(b);if(b.version>0&&X.__version!==b.version){bt(X,b,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,X.__webglTexture,i.TEXTURE0+M)}function D(b,M){const X=n.get(b);if(b.version>0&&X.__version!==b.version){bt(X,b,M);return}e.bindTexture(i.TEXTURE_3D,X.__webglTexture,i.TEXTURE0+M)}function W(b,M){const X=n.get(b);if(b.version>0&&X.__version!==b.version){q(X,b,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture,i.TEXTURE0+M)}const H={[ss]:i.REPEAT,[ai]:i.CLAMP_TO_EDGE,[co]:i.MIRRORED_REPEAT},tt={[Je]:i.NEAREST,[Wc]:i.NEAREST_MIPMAP_NEAREST,[ms]:i.NEAREST_MIPMAP_LINEAR,[rn]:i.LINEAR,[pr]:i.LINEAR_MIPMAP_NEAREST,[li]:i.LINEAR_MIPMAP_LINEAR},Q={[sh]:i.NEVER,[hh]:i.ALWAYS,[rh]:i.LESS,[Cl]:i.LEQUAL,[oh]:i.EQUAL,[ch]:i.GEQUAL,[ah]:i.GREATER,[lh]:i.NOTEQUAL};function ot(b,M){if(M.type===zn&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===rn||M.magFilter===pr||M.magFilter===ms||M.magFilter===li||M.minFilter===rn||M.minFilter===pr||M.minFilter===ms||M.minFilter===li)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,H[M.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,H[M.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,H[M.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,tt[M.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,tt[M.minFilter]),M.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,Q[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Je||M.minFilter!==ms&&M.minFilter!==li||M.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const X=t.get("EXT_texture_filter_anisotropic");i.texParameterf(b,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,s.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function St(b,M){let X=!1;b.__webglInit===void 0&&(b.__webglInit=!0,M.addEventListener("dispose",B));const $=M.source;let Z=d.get($);Z===void 0&&(Z={},d.set($,Z));const j=O(M);if(j!==b.__cacheKey){Z[j]===void 0&&(Z[j]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,X=!0),Z[j].usedTimes++;const Et=Z[b.__cacheKey];Et!==void 0&&(Z[b.__cacheKey].usedTimes--,Et.usedTimes===0&&F(M)),b.__cacheKey=j,b.__webglTexture=Z[j].texture}return X}function bt(b,M,X){let $=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&($=i.TEXTURE_3D);const Z=St(b,M),j=M.source;e.bindTexture($,b.__webglTexture,i.TEXTURE0+X);const Et=n.get(j);if(j.version!==Et.__version||Z===!0){e.activeTexture(i.TEXTURE0+X);const lt=Zt.getPrimaries(Zt.workingColorSpace),ct=M.colorSpace===On?null:Zt.getPrimaries(M.colorSpace),zt=M.colorSpace===On||lt===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,zt);let et=x(M.image,!1,s.maxTextureSize);et=Ut(M,et);const Mt=r.convert(M.format,M.colorSpace),Ht=r.convert(M.type);let Rt=E(M.internalFormat,Mt,Ht,M.colorSpace,M.isVideoTexture);ot($,M);let ht;const Bt=M.mipmaps,Vt=M.isVideoTexture!==!0,he=Et.__version===void 0||Z===!0,P=j.dataReady,ft=w(M,et);if(M.isDepthTexture)Rt=S(M.format===Bi,M.type),he&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,Rt,et.width,et.height):e.texImage2D(i.TEXTURE_2D,0,Rt,et.width,et.height,0,Mt,Ht,null));else if(M.isDataTexture)if(Bt.length>0){Vt&&he&&e.texStorage2D(i.TEXTURE_2D,ft,Rt,Bt[0].width,Bt[0].height);for(let Y=0,K=Bt.length;Y<K;Y++)ht=Bt[Y],Vt?P&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,ht.width,ht.height,Mt,Ht,ht.data):e.texImage2D(i.TEXTURE_2D,Y,Rt,ht.width,ht.height,0,Mt,Ht,ht.data);M.generateMipmaps=!1}else Vt?(he&&e.texStorage2D(i.TEXTURE_2D,ft,Rt,et.width,et.height),P&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,et.width,et.height,Mt,Ht,et.data)):e.texImage2D(i.TEXTURE_2D,0,Rt,et.width,et.height,0,Mt,Ht,et.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Vt&&he&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,Rt,Bt[0].width,Bt[0].height,et.depth);for(let Y=0,K=Bt.length;Y<K;Y++)if(ht=Bt[Y],M.format!==mn)if(Mt!==null)if(Vt){if(P)if(M.layerUpdates.size>0){for(const it of M.layerUpdates){const Pt=ht.width*ht.height;e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,it,ht.width,ht.height,1,Mt,ht.data.slice(Pt*it,Pt*(it+1)),0,0)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,ht.width,ht.height,et.depth,Mt,ht.data,0,0)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Rt,ht.width,ht.height,et.depth,0,ht.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?P&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,ht.width,ht.height,et.depth,Mt,Ht,ht.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Y,Rt,ht.width,ht.height,et.depth,0,Mt,Ht,ht.data)}else{Vt&&he&&e.texStorage2D(i.TEXTURE_2D,ft,Rt,Bt[0].width,Bt[0].height);for(let Y=0,K=Bt.length;Y<K;Y++)ht=Bt[Y],M.format!==mn?Mt!==null?Vt?P&&e.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,ht.width,ht.height,Mt,ht.data):e.compressedTexImage2D(i.TEXTURE_2D,Y,Rt,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?P&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,ht.width,ht.height,Mt,Ht,ht.data):e.texImage2D(i.TEXTURE_2D,Y,Rt,ht.width,ht.height,0,Mt,Ht,ht.data)}else if(M.isDataArrayTexture)if(Vt){if(he&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ft,Rt,et.width,et.height,et.depth),P)if(M.layerUpdates.size>0){let Y;switch(Ht){case i.UNSIGNED_BYTE:switch(Mt){case i.ALPHA:Y=1;break;case i.LUMINANCE:Y=1;break;case i.LUMINANCE_ALPHA:Y=2;break;case i.RGB:Y=3;break;case i.RGBA:Y=4;break;default:throw new Error(`Unknown texel size for format ${Mt}.`)}break;case i.UNSIGNED_SHORT_4_4_4_4:case i.UNSIGNED_SHORT_5_5_5_1:case i.UNSIGNED_SHORT_5_6_5:Y=1;break;default:throw new Error(`Unknown texel size for type ${Ht}.`)}const K=et.width*et.height*Y;for(const it of M.layerUpdates)e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,it,et.width,et.height,1,Mt,Ht,et.data.slice(K*it,K*(it+1)));M.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,Mt,Ht,et.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Rt,et.width,et.height,et.depth,0,Mt,Ht,et.data);else if(M.isData3DTexture)Vt?(he&&e.texStorage3D(i.TEXTURE_3D,ft,Rt,et.width,et.height,et.depth),P&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,Mt,Ht,et.data)):e.texImage3D(i.TEXTURE_3D,0,Rt,et.width,et.height,et.depth,0,Mt,Ht,et.data);else if(M.isFramebufferTexture){if(he)if(Vt)e.texStorage2D(i.TEXTURE_2D,ft,Rt,et.width,et.height);else{let Y=et.width,K=et.height;for(let it=0;it<ft;it++)e.texImage2D(i.TEXTURE_2D,it,Rt,Y,K,0,Mt,Ht,null),Y>>=1,K>>=1}}else if(Bt.length>0){if(Vt&&he){const Y=de(Bt[0]);e.texStorage2D(i.TEXTURE_2D,ft,Rt,Y.width,Y.height)}for(let Y=0,K=Bt.length;Y<K;Y++)ht=Bt[Y],Vt?P&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,Mt,Ht,ht):e.texImage2D(i.TEXTURE_2D,Y,Rt,Mt,Ht,ht);M.generateMipmaps=!1}else if(Vt){if(he){const Y=de(et);e.texStorage2D(i.TEXTURE_2D,ft,Rt,Y.width,Y.height)}P&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Mt,Ht,et)}else e.texImage2D(i.TEXTURE_2D,0,Rt,Mt,Ht,et);m(M)&&p($),Et.__version=j.version,M.onUpdate&&M.onUpdate(M)}b.__version=M.version}function q(b,M,X){if(M.image.length!==6)return;const $=St(b,M),Z=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+X);const j=n.get(Z);if(Z.version!==j.__version||$===!0){e.activeTexture(i.TEXTURE0+X);const Et=Zt.getPrimaries(Zt.workingColorSpace),lt=M.colorSpace===On?null:Zt.getPrimaries(M.colorSpace),ct=M.colorSpace===On||Et===lt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ct);const zt=M.isCompressedTexture||M.image[0].isCompressedTexture,et=M.image[0]&&M.image[0].isDataTexture,Mt=[];for(let K=0;K<6;K++)!zt&&!et?Mt[K]=x(M.image[K],!0,s.maxCubemapSize):Mt[K]=et?M.image[K].image:M.image[K],Mt[K]=Ut(M,Mt[K]);const Ht=Mt[0],Rt=r.convert(M.format,M.colorSpace),ht=r.convert(M.type),Bt=E(M.internalFormat,Rt,ht,M.colorSpace),Vt=M.isVideoTexture!==!0,he=j.__version===void 0||$===!0,P=Z.dataReady;let ft=w(M,Ht);ot(i.TEXTURE_CUBE_MAP,M);let Y;if(zt){Vt&&he&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,Bt,Ht.width,Ht.height);for(let K=0;K<6;K++){Y=Mt[K].mipmaps;for(let it=0;it<Y.length;it++){const Pt=Y[it];M.format!==mn?Rt!==null?Vt?P&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,it,0,0,Pt.width,Pt.height,Rt,Pt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,it,Bt,Pt.width,Pt.height,0,Pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,it,0,0,Pt.width,Pt.height,Rt,ht,Pt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,it,Bt,Pt.width,Pt.height,0,Rt,ht,Pt.data)}}}else{if(Y=M.mipmaps,Vt&&he){Y.length>0&&ft++;const K=de(Mt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ft,Bt,K.width,K.height)}for(let K=0;K<6;K++)if(et){Vt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Mt[K].width,Mt[K].height,Rt,ht,Mt[K].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Bt,Mt[K].width,Mt[K].height,0,Rt,ht,Mt[K].data);for(let it=0;it<Y.length;it++){const Kt=Y[it].image[K].image;Vt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,it+1,0,0,Kt.width,Kt.height,Rt,ht,Kt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,it+1,Bt,Kt.width,Kt.height,0,Rt,ht,Kt.data)}}else{Vt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,0,0,Rt,ht,Mt[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0,Bt,Rt,ht,Mt[K]);for(let it=0;it<Y.length;it++){const Pt=Y[it];Vt?P&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,it+1,0,0,Rt,ht,Pt.image[K]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+K,it+1,Bt,Rt,ht,Pt.image[K])}}}m(M)&&p(i.TEXTURE_CUBE_MAP),j.__version=Z.version,M.onUpdate&&M.onUpdate(M)}b.__version=M.version}function J(b,M,X,$,Z,j){const Et=r.convert(X.format,X.colorSpace),lt=r.convert(X.type),ct=E(X.internalFormat,Et,lt,X.colorSpace);if(!n.get(M).__hasExternalTextures){const et=Math.max(1,M.width>>j),Mt=Math.max(1,M.height>>j);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,j,ct,et,Mt,M.depth,0,Et,lt,null):e.texImage2D(Z,j,ct,et,Mt,0,Et,lt,null)}e.bindFramebuffer(i.FRAMEBUFFER,b),Yt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Z,n.get(X).__webglTexture,0,Tt(M)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,Z,n.get(X).__webglTexture,j),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ut(b,M,X){if(i.bindRenderbuffer(i.RENDERBUFFER,b),M.depthBuffer){const $=M.depthTexture,Z=$&&$.isDepthTexture?$.type:null,j=S(M.stencilBuffer,Z),Et=M.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,lt=Tt(M);Yt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt,j,M.width,M.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,j,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,j,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Et,i.RENDERBUFFER,b)}else{const $=M.textures;for(let Z=0;Z<$.length;Z++){const j=$[Z],Et=r.convert(j.format,j.colorSpace),lt=r.convert(j.type),ct=E(j.internalFormat,Et,lt,j.colorSpace),zt=Tt(M);X&&Yt(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,zt,ct,M.width,M.height):Yt(M)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,zt,ct,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,ct,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function st(b,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,b),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),V(M.depthTexture,0);const $=n.get(M.depthTexture).__webglTexture,Z=Tt(M);if(M.depthTexture.format===Ii)Yt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(M.depthTexture.format===Bi)Yt(M)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Dt(b){const M=n.get(b),X=b.isWebGLCubeRenderTarget===!0;if(b.depthTexture&&!M.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");st(M.__webglFramebuffer,b)}else if(X){M.__webglDepthbuffer=[];for(let $=0;$<6;$++)e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[$]),M.__webglDepthbuffer[$]=i.createRenderbuffer(),ut(M.__webglDepthbuffer[$],b,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=i.createRenderbuffer(),ut(M.__webglDepthbuffer,b,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Lt(b,M,X){const $=n.get(b);M!==void 0&&J($.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),X!==void 0&&Dt(b)}function qt(b){const M=b.texture,X=n.get(b),$=n.get(M);b.addEventListener("dispose",A);const Z=b.textures,j=b.isWebGLCubeRenderTarget===!0,Et=Z.length>1;if(Et||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=M.version,o.memory.textures++),j){X.__webglFramebuffer=[];for(let lt=0;lt<6;lt++)if(M.mipmaps&&M.mipmaps.length>0){X.__webglFramebuffer[lt]=[];for(let ct=0;ct<M.mipmaps.length;ct++)X.__webglFramebuffer[lt][ct]=i.createFramebuffer()}else X.__webglFramebuffer[lt]=i.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){X.__webglFramebuffer=[];for(let lt=0;lt<M.mipmaps.length;lt++)X.__webglFramebuffer[lt]=i.createFramebuffer()}else X.__webglFramebuffer=i.createFramebuffer();if(Et)for(let lt=0,ct=Z.length;lt<ct;lt++){const zt=n.get(Z[lt]);zt.__webglTexture===void 0&&(zt.__webglTexture=i.createTexture(),o.memory.textures++)}if(b.samples>0&&Yt(b)===!1){X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let lt=0;lt<Z.length;lt++){const ct=Z[lt];X.__webglColorRenderbuffer[lt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,X.__webglColorRenderbuffer[lt]);const zt=r.convert(ct.format,ct.colorSpace),et=r.convert(ct.type),Mt=E(ct.internalFormat,zt,et,ct.colorSpace,b.isXRRenderTarget===!0),Ht=Tt(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ht,Mt,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+lt,i.RENDERBUFFER,X.__webglColorRenderbuffer[lt])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),ut(X.__webglDepthRenderbuffer,b,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),ot(i.TEXTURE_CUBE_MAP,M);for(let lt=0;lt<6;lt++)if(M.mipmaps&&M.mipmaps.length>0)for(let ct=0;ct<M.mipmaps.length;ct++)J(X.__webglFramebuffer[lt][ct],b,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,ct);else J(X.__webglFramebuffer[lt],b,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0);m(M)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Et){for(let lt=0,ct=Z.length;lt<ct;lt++){const zt=Z[lt],et=n.get(zt);e.bindTexture(i.TEXTURE_2D,et.__webglTexture),ot(i.TEXTURE_2D,zt),J(X.__webglFramebuffer,b,zt,i.COLOR_ATTACHMENT0+lt,i.TEXTURE_2D,0),m(zt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let lt=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(lt=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(lt,$.__webglTexture),ot(lt,M),M.mipmaps&&M.mipmaps.length>0)for(let ct=0;ct<M.mipmaps.length;ct++)J(X.__webglFramebuffer[ct],b,M,i.COLOR_ATTACHMENT0,lt,ct);else J(X.__webglFramebuffer,b,M,i.COLOR_ATTACHMENT0,lt,0);m(M)&&p(lt),e.unbindTexture()}b.depthBuffer&&Dt(b)}function L(b){const M=b.textures;for(let X=0,$=M.length;X<$;X++){const Z=M[X];if(m(Z)){const j=b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Et=n.get(Z).__webglTexture;e.bindTexture(j,Et),p(j),e.unbindTexture()}}}const Wt=[],Gt=[];function oe(b){if(b.samples>0){if(Yt(b)===!1){const M=b.textures,X=b.width,$=b.height;let Z=i.COLOR_BUFFER_BIT;const j=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Et=n.get(b),lt=M.length>1;if(lt)for(let ct=0;ct<M.length;ct++)e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let ct=0;ct<M.length;ct++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),lt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Et.__webglColorRenderbuffer[ct]);const zt=n.get(M[ct]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,zt,0)}i.blitFramebuffer(0,0,X,$,0,0,X,$,Z,i.NEAREST),l===!0&&(Wt.length=0,Gt.length=0,Wt.push(i.COLOR_ATTACHMENT0+ct),b.depthBuffer&&b.resolveDepthBuffer===!1&&(Wt.push(j),Gt.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Gt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Wt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),lt)for(let ct=0;ct<M.length;ct++){e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.RENDERBUFFER,Et.__webglColorRenderbuffer[ct]);const zt=n.get(M[ct]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Et.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ct,i.TEXTURE_2D,zt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const M=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[M])}}}function Tt(b){return Math.min(s.maxSamples,b.samples)}function Yt(b){const M=n.get(b);return b.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function kt(b){const M=o.render.frame;h.get(b)!==M&&(h.set(b,M),b.update())}function Ut(b,M){const X=b.colorSpace,$=b.format,Z=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||X!==Yn&&X!==On&&(Zt.getTransfer(X)===ie?($!==mn||Z!==Vn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),M}function de(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=T,this.setTexture2D=V,this.setTexture2DArray=z,this.setTexture3D=D,this.setTextureCube=W,this.rebindTextures=Lt,this.setupRenderTarget=qt,this.updateRenderTargetMipmap=L,this.updateMultisampleRenderTarget=oe,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=J,this.useMultisampledRTT=Yt}function dm(i,t){function e(n,s=On){let r;const o=Zt.getTransfer(s);if(n===Vn)return i.UNSIGNED_BYTE;if(n===Sl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===El)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Yc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Xc)return i.BYTE;if(n===qc)return i.SHORT;if(n===Ws)return i.UNSIGNED_SHORT;if(n===yl)return i.INT;if(n===Oi)return i.UNSIGNED_INT;if(n===zn)return i.FLOAT;if(n===tr)return i.HALF_FLOAT;if(n===Kc)return i.ALPHA;if(n===$c)return i.RGB;if(n===mn)return i.RGBA;if(n===Jc)return i.LUMINANCE;if(n===Zc)return i.LUMINANCE_ALPHA;if(n===Ii)return i.DEPTH_COMPONENT;if(n===Bi)return i.DEPTH_STENCIL;if(n===jc)return i.RED;if(n===wl)return i.RED_INTEGER;if(n===Qc)return i.RG;if(n===Tl)return i.RG_INTEGER;if(n===bl)return i.RGBA_INTEGER;if(n===mr||n===gr||n===_r||n===vr)if(o===ie)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===mr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===gr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===mr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===gr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===zo||n===Bo||n===ko||n===Ho)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===zo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ko)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ho)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Go||n===Vo||n===Wo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Go||n===Vo)return o===ie?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Wo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Xo||n===qo||n===Yo||n===Ko||n===$o||n===Jo||n===Zo||n===jo||n===Qo||n===ta||n===ea||n===na||n===ia||n===sa)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Xo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===qo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Yo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ko)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===$o)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Jo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Zo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===jo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Qo)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ta)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ea)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===na)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ia)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===sa)return o===ie?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===xr||n===ra||n===oa)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===xr)return o===ie?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ra)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===oa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===th||n===aa||n===la||n===ca)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===xr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===aa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===la)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ca)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class fm extends Be{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class _e extends ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pm={type:"move"};class qr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,n),p=this._getHandJoint(c,x);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(pm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new _e;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const mm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,gm=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class _m{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Fe,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Wn({vertexShader:mm,fragmentShader:gm,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new dt(new Hi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class vm extends Vi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const x=new _m,m=e.getContextAttributes();let p=null,E=null;const S=[],w=[],B=new mt;let A=null;const R=new Be;R.layers.enable(1),R.viewport=new se;const F=new Be;F.layers.enable(2),F.viewport=new se;const v=[R,F],_=new fm;_.layers.enable(1),_.layers.enable(2);let T=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let J=S[q];return J===void 0&&(J=new qr,S[q]=J),J.getTargetRaySpace()},this.getControllerGrip=function(q){let J=S[q];return J===void 0&&(J=new qr,S[q]=J),J.getGripSpace()},this.getHand=function(q){let J=S[q];return J===void 0&&(J=new qr,S[q]=J),J.getHandSpace()};function O(q){const J=w.indexOf(q.inputSource);if(J===-1)return;const ut=S[J];ut!==void 0&&(ut.update(q.inputSource,q.frame,c||o),ut.dispatchEvent({type:q.type,data:q.inputSource}))}function V(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",z);for(let q=0;q<S.length;q++){const J=w[q];J!==null&&(w[q]=null,S[q].disconnect(J))}T=null,U=null,x.reset(),t.setRenderTarget(p),f=null,d=null,u=null,s=null,E=null,bt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(B.width,B.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",V),s.addEventListener("inputsourceschange",z),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(B),s.renderState.layers===void 0){const J={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,J),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),E=new ci(f.framebufferWidth,f.framebufferHeight,{format:mn,type:Vn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let J=null,ut=null,st=null;m.depth&&(st=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=m.stencil?Bi:Ii,ut=m.stencil?zi:Oi);const Dt={colorFormat:e.RGBA8,depthFormat:st,scaleFactor:r};u=new XRWebGLBinding(s,e),d=u.createProjectionLayer(Dt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),E=new ci(d.textureWidth,d.textureHeight,{format:mn,type:Vn,depthTexture:new Gl(d.textureWidth,d.textureHeight,ut,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),bt.setContext(s),bt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function z(q){for(let J=0;J<q.removed.length;J++){const ut=q.removed[J],st=w.indexOf(ut);st>=0&&(w[st]=null,S[st].disconnect(ut))}for(let J=0;J<q.added.length;J++){const ut=q.added[J];let st=w.indexOf(ut);if(st===-1){for(let Lt=0;Lt<S.length;Lt++)if(Lt>=w.length){w.push(ut),st=Lt;break}else if(w[Lt]===null){w[Lt]=ut,st=Lt;break}if(st===-1)break}const Dt=S[st];Dt&&Dt.connect(ut)}}const D=new C,W=new C;function H(q,J,ut){D.setFromMatrixPosition(J.matrixWorld),W.setFromMatrixPosition(ut.matrixWorld);const st=D.distanceTo(W),Dt=J.projectionMatrix.elements,Lt=ut.projectionMatrix.elements,qt=Dt[14]/(Dt[10]-1),L=Dt[14]/(Dt[10]+1),Wt=(Dt[9]+1)/Dt[5],Gt=(Dt[9]-1)/Dt[5],oe=(Dt[8]-1)/Dt[0],Tt=(Lt[8]+1)/Lt[0],Yt=qt*oe,kt=qt*Tt,Ut=st/(-oe+Tt),de=Ut*-oe;J.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(de),q.translateZ(Ut),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert();const b=qt+Ut,M=L+Ut,X=Yt-de,$=kt+(st-de),Z=Wt*L/M*b,j=Gt*L/M*b;q.projectionMatrix.makePerspective(X,$,Z,j,b,M),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}function tt(q,J){J===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(J.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;x.texture!==null&&(q.near=x.depthNear,q.far=x.depthFar),_.near=F.near=R.near=q.near,_.far=F.far=R.far=q.far,(T!==_.near||U!==_.far)&&(s.updateRenderState({depthNear:_.near,depthFar:_.far}),T=_.near,U=_.far,R.near=T,R.far=U,F.near=T,F.far=U,R.updateProjectionMatrix(),F.updateProjectionMatrix(),q.updateProjectionMatrix());const J=q.parent,ut=_.cameras;tt(_,J);for(let st=0;st<ut.length;st++)tt(ut[st],J);ut.length===2?H(_,R,F):_.projectionMatrix.copy(R.projectionMatrix),Q(q,_,J)};function Q(q,J,ut){ut===null?q.matrix.copy(J.matrixWorld):(q.matrix.copy(ut.matrixWorld),q.matrix.invert(),q.matrix.multiply(J.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(J.projectionMatrix),q.projectionMatrixInverse.copy(J.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=$s*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return _},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(q){l=q,d!==null&&(d.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(_)};let ot=null;function St(q,J){if(h=J.getViewerPose(c||o),g=J,h!==null){const ut=h.views;f!==null&&(t.setRenderTargetFramebuffer(E,f.framebuffer),t.setRenderTarget(E));let st=!1;ut.length!==_.cameras.length&&(_.cameras.length=0,st=!0);for(let Lt=0;Lt<ut.length;Lt++){const qt=ut[Lt];let L=null;if(f!==null)L=f.getViewport(qt);else{const Gt=u.getViewSubImage(d,qt);L=Gt.viewport,Lt===0&&(t.setRenderTargetTextures(E,Gt.colorTexture,d.ignoreDepthValues?void 0:Gt.depthStencilTexture),t.setRenderTarget(E))}let Wt=v[Lt];Wt===void 0&&(Wt=new Be,Wt.layers.enable(Lt),Wt.viewport=new se,v[Lt]=Wt),Wt.matrix.fromArray(qt.transform.matrix),Wt.matrix.decompose(Wt.position,Wt.quaternion,Wt.scale),Wt.projectionMatrix.fromArray(qt.projectionMatrix),Wt.projectionMatrixInverse.copy(Wt.projectionMatrix).invert(),Wt.viewport.set(L.x,L.y,L.width,L.height),Lt===0&&(_.matrix.copy(Wt.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale)),st===!0&&_.cameras.push(Wt)}const Dt=s.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")){const Lt=u.getDepthInformation(ut[0]);Lt&&Lt.isValid&&Lt.texture&&x.init(t,Lt,s.renderState)}}for(let ut=0;ut<S.length;ut++){const st=w[ut],Dt=S[ut];st!==null&&Dt!==void 0&&Dt.update(st,J,c||o)}ot&&ot(q,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const bt=new kl;bt.setAnimationLoop(St),this.setAnimationLoop=function(q){ot=q},this.dispose=function(){}}}const ei=new an,xm=new re;function Mm(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Ol(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,E,S,w){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,w)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),x(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,E,S):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===ke&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===ke&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const E=t.get(p),S=E.envMap,w=E.envMapRotation;S&&(m.envMap.value=S,ei.copy(w),ei.x*=-1,ei.y*=-1,ei.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(ei.y*=-1,ei.z*=-1),m.envMapRotation.value.setFromMatrix4(xm.makeRotationFromEuler(ei)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,E,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*E,m.scale.value=S*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,E){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===ke&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function x(m,p){const E=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function ym(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,S){const w=S.program;n.uniformBlockBinding(E,w)}function c(E,S){let w=s[E.id];w===void 0&&(g(E),w=h(E),s[E.id]=w,E.addEventListener("dispose",m));const B=S.program;n.updateUBOMapping(E,B);const A=t.render.frame;r[E.id]!==A&&(d(E),r[E.id]=A)}function h(E){const S=u();E.__bindingPointIndex=S;const w=i.createBuffer(),B=E.__size,A=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,B,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,w),w}function u(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(E){const S=s[E.id],w=E.uniforms,B=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let A=0,R=w.length;A<R;A++){const F=Array.isArray(w[A])?w[A]:[w[A]];for(let v=0,_=F.length;v<_;v++){const T=F[v];if(f(T,A,v,B)===!0){const U=T.__offset,O=Array.isArray(T.value)?T.value:[T.value];let V=0;for(let z=0;z<O.length;z++){const D=O[z],W=x(D);typeof D=="number"||typeof D=="boolean"?(T.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,U+V,T.__data)):D.isMatrix3?(T.__data[0]=D.elements[0],T.__data[1]=D.elements[1],T.__data[2]=D.elements[2],T.__data[3]=0,T.__data[4]=D.elements[3],T.__data[5]=D.elements[4],T.__data[6]=D.elements[5],T.__data[7]=0,T.__data[8]=D.elements[6],T.__data[9]=D.elements[7],T.__data[10]=D.elements[8],T.__data[11]=0):(D.toArray(T.__data,V),V+=W.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,U,T.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(E,S,w,B){const A=E.value,R=S+"_"+w;if(B[R]===void 0)return typeof A=="number"||typeof A=="boolean"?B[R]=A:B[R]=A.clone(),!0;{const F=B[R];if(typeof A=="number"||typeof A=="boolean"){if(F!==A)return B[R]=A,!0}else if(F.equals(A)===!1)return F.copy(A),!0}return!1}function g(E){const S=E.uniforms;let w=0;const B=16;for(let R=0,F=S.length;R<F;R++){const v=Array.isArray(S[R])?S[R]:[S[R]];for(let _=0,T=v.length;_<T;_++){const U=v[_],O=Array.isArray(U.value)?U.value:[U.value];for(let V=0,z=O.length;V<z;V++){const D=O[V],W=x(D),H=w%B;H!==0&&B-H<W.boundary&&(w+=B-H),U.__data=new Float32Array(W.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=w,w+=W.storage}}}const A=w%B;return A>0&&(w+=B-A),E.__size=w,E.__cache={},this}function x(E){const S={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(S.boundary=4,S.storage=4):E.isVector2?(S.boundary=8,S.storage=8):E.isVector3||E.isColor?(S.boundary=16,S.storage=12):E.isVector4?(S.boundary=16,S.storage=16):E.isMatrix3?(S.boundary=48,S.storage=48):E.isMatrix4?(S.boundary=64,S.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),S}function m(E){const S=E.target;S.removeEventListener("dispose",m);const w=o.indexOf(S.__bindingPointIndex);o.splice(w,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function p(){for(const E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:l,update:c,dispose:p}}class Sm{constructor(t={}){const{canvas:e=dh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const f=new Uint32Array(4),g=new Int32Array(4);let x=null,m=null;const p=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ze,this.toneMapping=kn,this.toneMappingExposure=1;const S=this;let w=!1,B=0,A=0,R=null,F=-1,v=null;const _=new se,T=new se;let U=null;const O=new Xt(0);let V=0,z=e.width,D=e.height,W=1,H=null,tt=null;const Q=new se(0,0,z,D),ot=new se(0,0,z,D);let St=!1;const bt=new vo;let q=!1,J=!1;const ut=new re,st=new C,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Lt=!1;function qt(){return R===null?W:1}let L=n;function Wt(y,I){return e.getContext(y,I)}try{const y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${mo}`),e.addEventListener("webglcontextlost",ft,!1),e.addEventListener("webglcontextrestored",Y,!1),e.addEventListener("webglcontextcreationerror",K,!1),L===null){const I="webgl2";if(L=Wt(I,y),L===null)throw Wt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Gt,oe,Tt,Yt,kt,Ut,de,b,M,X,$,Z,j,Et,lt,ct,zt,et,Mt,Ht,Rt,ht,Bt,Vt;function he(){Gt=new Pf(L),Gt.init(),ht=new dm(L,Gt),oe=new wf(L,Gt,t,ht),Tt=new hm(L),Yt=new Df(L),kt=new Jp,Ut=new um(L,Gt,Tt,kt,oe,ht,Yt),de=new bf(S),b=new Rf(S),M=new Bh(L),Bt=new Sf(L,M),X=new Lf(L,M,Yt,Bt),$=new Nf(L,X,M,Yt),Mt=new Uf(L,oe,Ut),ct=new Tf(kt),Z=new $p(S,de,b,Gt,oe,Bt,ct),j=new Mm(S,kt),Et=new jp,lt=new sm(Gt),et=new yf(S,de,b,Tt,$,d,l),zt=new cm(S,$,oe),Vt=new ym(L,Yt,oe,Tt),Ht=new Ef(L,Gt,Yt),Rt=new If(L,Gt,Yt),Yt.programs=Z.programs,S.capabilities=oe,S.extensions=Gt,S.properties=kt,S.renderLists=Et,S.shadowMap=zt,S.state=Tt,S.info=Yt}he();const P=new vm(S,L);this.xr=P,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const y=Gt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Gt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(y){y!==void 0&&(W=y,this.setSize(z,D,!1))},this.getSize=function(y){return y.set(z,D)},this.setSize=function(y,I,k=!0){if(P.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}z=y,D=I,e.width=Math.floor(y*W),e.height=Math.floor(I*W),k===!0&&(e.style.width=y+"px",e.style.height=I+"px"),this.setViewport(0,0,y,I)},this.getDrawingBufferSize=function(y){return y.set(z*W,D*W).floor()},this.setDrawingBufferSize=function(y,I,k){z=y,D=I,W=k,e.width=Math.floor(y*k),e.height=Math.floor(I*k),this.setViewport(0,0,y,I)},this.getCurrentViewport=function(y){return y.copy(_)},this.getViewport=function(y){return y.copy(Q)},this.setViewport=function(y,I,k,G){y.isVector4?Q.set(y.x,y.y,y.z,y.w):Q.set(y,I,k,G),Tt.viewport(_.copy(Q).multiplyScalar(W).round())},this.getScissor=function(y){return y.copy(ot)},this.setScissor=function(y,I,k,G){y.isVector4?ot.set(y.x,y.y,y.z,y.w):ot.set(y,I,k,G),Tt.scissor(T.copy(ot).multiplyScalar(W).round())},this.getScissorTest=function(){return St},this.setScissorTest=function(y){Tt.setScissorTest(St=y)},this.setOpaqueSort=function(y){H=y},this.setTransparentSort=function(y){tt=y},this.getClearColor=function(y){return y.copy(et.getClearColor())},this.setClearColor=function(){et.setClearColor.apply(et,arguments)},this.getClearAlpha=function(){return et.getClearAlpha()},this.setClearAlpha=function(){et.setClearAlpha.apply(et,arguments)},this.clear=function(y=!0,I=!0,k=!0){let G=0;if(y){let N=!1;if(R!==null){const nt=R.texture.format;N=nt===bl||nt===Tl||nt===wl}if(N){const nt=R.texture.type,pt=nt===Vn||nt===Oi||nt===Ws||nt===zi||nt===Sl||nt===El,gt=et.getClearColor(),xt=et.getClearAlpha(),At=gt.r,Ct=gt.g,wt=gt.b;pt?(f[0]=At,f[1]=Ct,f[2]=wt,f[3]=xt,L.clearBufferuiv(L.COLOR,0,f)):(g[0]=At,g[1]=Ct,g[2]=wt,g[3]=xt,L.clearBufferiv(L.COLOR,0,g))}else G|=L.COLOR_BUFFER_BIT}I&&(G|=L.DEPTH_BUFFER_BIT),k&&(G|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ft,!1),e.removeEventListener("webglcontextrestored",Y,!1),e.removeEventListener("webglcontextcreationerror",K,!1),Et.dispose(),lt.dispose(),kt.dispose(),de.dispose(),b.dispose(),$.dispose(),Bt.dispose(),Vt.dispose(),Z.dispose(),P.dispose(),P.removeEventListener("sessionstart",ln),P.removeEventListener("sessionend",cn),Kn.stop()};function ft(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Y(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const y=Yt.autoReset,I=zt.enabled,k=zt.autoUpdate,G=zt.needsUpdate,N=zt.type;he(),Yt.autoReset=y,zt.enabled=I,zt.autoUpdate=k,zt.needsUpdate=G,zt.type=N}function K(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function it(y){const I=y.target;I.removeEventListener("dispose",it),Pt(I)}function Pt(y){Kt(y),kt.remove(y)}function Kt(y){const I=kt.get(y).programs;I!==void 0&&(I.forEach(function(k){Z.releaseProgram(k)}),y.isShaderMaterial&&Z.releaseShaderCache(y))}this.renderBufferDirect=function(y,I,k,G,N,nt){I===null&&(I=Dt);const pt=N.isMesh&&N.matrixWorld.determinant()<0,gt=rc(y,I,k,G,N);Tt.setMaterial(G,pt);let xt=k.index,At=1;if(G.wireframe===!0){if(xt=X.getWireframeAttribute(k),xt===void 0)return;At=2}const Ct=k.drawRange,wt=k.attributes.position;let $t=Ct.start*At,ae=(Ct.start+Ct.count)*At;nt!==null&&($t=Math.max($t,nt.start*At),ae=Math.min(ae,(nt.start+nt.count)*At)),xt!==null?($t=Math.max($t,0),ae=Math.min(ae,xt.count)):wt!=null&&($t=Math.max($t,0),ae=Math.min(ae,wt.count));const le=ae-$t;if(le<0||le===1/0)return;Bt.setup(N,G,gt,k,xt);let Ge,Jt=Ht;if(xt!==null&&(Ge=M.get(xt),Jt=Rt,Jt.setIndex(Ge)),N.isMesh)G.wireframe===!0?(Tt.setLineWidth(G.wireframeLinewidth*qt()),Jt.setMode(L.LINES)):Jt.setMode(L.TRIANGLES);else if(N.isLine){let yt=G.linewidth;yt===void 0&&(yt=1),Tt.setLineWidth(yt*qt()),N.isLineSegments?Jt.setMode(L.LINES):N.isLineLoop?Jt.setMode(L.LINE_LOOP):Jt.setMode(L.LINE_STRIP)}else N.isPoints?Jt.setMode(L.POINTS):N.isSprite&&Jt.setMode(L.TRIANGLES);if(N.isBatchedMesh)N._multiDrawInstances!==null?Jt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances):Jt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else if(N.isInstancedMesh)Jt.renderInstances($t,le,N.count);else if(k.isInstancedBufferGeometry){const yt=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,Ue=Math.min(k.instanceCount,yt);Jt.renderInstances($t,le,Ue)}else Jt.render($t,le)};function ue(y,I,k){y.transparent===!0&&y.side===fn&&y.forceSinglePass===!1?(y.side=ke,y.needsUpdate=!0,fs(y,I,k),y.side=Gn,y.needsUpdate=!0,fs(y,I,k),y.side=fn):fs(y,I,k)}this.compile=function(y,I,k=null){k===null&&(k=y),m=lt.get(k),m.init(I),E.push(m),k.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(m.pushLight(N),N.castShadow&&m.pushShadow(N))}),y!==k&&y.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(m.pushLight(N),N.castShadow&&m.pushShadow(N))}),m.setupLights();const G=new Set;return y.traverse(function(N){const nt=N.material;if(nt)if(Array.isArray(nt))for(let pt=0;pt<nt.length;pt++){const gt=nt[pt];ue(gt,k,N),G.add(gt)}else ue(nt,k,N),G.add(nt)}),E.pop(),m=null,G},this.compileAsync=function(y,I,k=null){const G=this.compile(y,I,k);return new Promise(N=>{function nt(){if(G.forEach(function(pt){kt.get(pt).currentProgram.isReady()&&G.delete(pt)}),G.size===0){N(y);return}setTimeout(nt,10)}Gt.get("KHR_parallel_shader_compile")!==null?nt():setTimeout(nt,10)})};let ye=null;function jt(y){ye&&ye(y)}function ln(){Kn.stop()}function cn(){Kn.start()}const Kn=new kl;Kn.setAnimationLoop(jt),typeof self<"u"&&Kn.setContext(self),this.setAnimationLoop=function(y){ye=y,P.setAnimationLoop(y),y===null?Kn.stop():Kn.start()},P.addEventListener("sessionstart",ln),P.addEventListener("sessionend",cn),this.render=function(y,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),P.enabled===!0&&P.isPresenting===!0&&(P.cameraAutoUpdate===!0&&P.updateCamera(I),I=P.getCamera()),y.isScene===!0&&y.onBeforeRender(S,y,I,R),m=lt.get(y,E.length),m.init(I),E.push(m),ut.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),bt.setFromProjectionMatrix(ut),J=this.localClippingEnabled,q=ct.init(this.clippingPlanes,J),x=Et.get(y,p.length),x.init(),p.push(x),P.enabled===!0&&P.isPresenting===!0){const nt=S.xr.getDepthSensingMesh();nt!==null&&hr(nt,I,-1/0,S.sortObjects)}hr(y,I,0,S.sortObjects),x.finish(),S.sortObjects===!0&&x.sort(H,tt),Lt=P.enabled===!1||P.isPresenting===!1||P.hasDepthSensing()===!1,Lt&&et.addToRenderList(x,y),this.info.render.frame++,q===!0&&ct.beginShadows();const k=m.state.shadowsArray;zt.render(k,y,I),q===!0&&ct.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=x.opaque,N=x.transmissive;if(m.setupLights(),I.isArrayCamera){const nt=I.cameras;if(N.length>0)for(let pt=0,gt=nt.length;pt<gt;pt++){const xt=nt[pt];Ro(G,N,y,xt)}Lt&&et.render(y);for(let pt=0,gt=nt.length;pt<gt;pt++){const xt=nt[pt];Co(x,y,xt,xt.viewport)}}else N.length>0&&Ro(G,N,y,I),Lt&&et.render(y),Co(x,y,I);R!==null&&(Ut.updateMultisampleRenderTarget(R),Ut.updateRenderTargetMipmap(R)),y.isScene===!0&&y.onAfterRender(S,y,I),Bt.resetDefaultState(),F=-1,v=null,E.pop(),E.length>0?(m=E[E.length-1],q===!0&&ct.setGlobalState(S.clippingPlanes,m.state.camera)):m=null,p.pop(),p.length>0?x=p[p.length-1]:x=null};function hr(y,I,k,G){if(y.visible===!1)return;if(y.layers.test(I.layers)){if(y.isGroup)k=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(I);else if(y.isLight)m.pushLight(y),y.castShadow&&m.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||bt.intersectsSprite(y)){G&&st.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ut);const pt=$.update(y),gt=y.material;gt.visible&&x.push(y,pt,gt,k,st.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||bt.intersectsObject(y))){const pt=$.update(y),gt=y.material;if(G&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),st.copy(y.boundingSphere.center)):(pt.boundingSphere===null&&pt.computeBoundingSphere(),st.copy(pt.boundingSphere.center)),st.applyMatrix4(y.matrixWorld).applyMatrix4(ut)),Array.isArray(gt)){const xt=pt.groups;for(let At=0,Ct=xt.length;At<Ct;At++){const wt=xt[At],$t=gt[wt.materialIndex];$t&&$t.visible&&x.push(y,pt,$t,k,st.z,wt)}}else gt.visible&&x.push(y,pt,gt,k,st.z,null)}}const nt=y.children;for(let pt=0,gt=nt.length;pt<gt;pt++)hr(nt[pt],I,k,G)}function Co(y,I,k,G){const N=y.opaque,nt=y.transmissive,pt=y.transparent;m.setupLightsView(k),q===!0&&ct.setGlobalState(S.clippingPlanes,k),G&&Tt.viewport(_.copy(G)),N.length>0&&ds(N,I,k),nt.length>0&&ds(nt,I,k),pt.length>0&&ds(pt,I,k),Tt.buffers.depth.setTest(!0),Tt.buffers.depth.setMask(!0),Tt.buffers.color.setMask(!0),Tt.setPolygonOffset(!1)}function Ro(y,I,k,G){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[G.id]===void 0&&(m.state.transmissionRenderTarget[G.id]=new ci(1,1,{generateMipmaps:!0,type:Gt.has("EXT_color_buffer_half_float")||Gt.has("EXT_color_buffer_float")?tr:Vn,minFilter:li,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Zt.workingColorSpace}));const nt=m.state.transmissionRenderTarget[G.id],pt=G.viewport||_;nt.setSize(pt.z,pt.w);const gt=S.getRenderTarget();S.setRenderTarget(nt),S.getClearColor(O),V=S.getClearAlpha(),V<1&&S.setClearColor(16777215,.5),Lt?et.render(k):S.clear();const xt=S.toneMapping;S.toneMapping=kn;const At=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),m.setupLightsView(G),q===!0&&ct.setGlobalState(S.clippingPlanes,G),ds(y,k,G),Ut.updateMultisampleRenderTarget(nt),Ut.updateRenderTargetMipmap(nt),Gt.has("WEBGL_multisampled_render_to_texture")===!1){let Ct=!1;for(let wt=0,$t=I.length;wt<$t;wt++){const ae=I[wt],le=ae.object,Ge=ae.geometry,Jt=ae.material,yt=ae.group;if(Jt.side===fn&&le.layers.test(G.layers)){const Ue=Jt.side;Jt.side=ke,Jt.needsUpdate=!0,Po(le,k,G,Ge,Jt,yt),Jt.side=Ue,Jt.needsUpdate=!0,Ct=!0}}Ct===!0&&(Ut.updateMultisampleRenderTarget(nt),Ut.updateRenderTargetMipmap(nt))}S.setRenderTarget(gt),S.setClearColor(O,V),At!==void 0&&(G.viewport=At),S.toneMapping=xt}function ds(y,I,k){const G=I.isScene===!0?I.overrideMaterial:null;for(let N=0,nt=y.length;N<nt;N++){const pt=y[N],gt=pt.object,xt=pt.geometry,At=G===null?pt.material:G,Ct=pt.group;gt.layers.test(k.layers)&&Po(gt,I,k,xt,At,Ct)}}function Po(y,I,k,G,N,nt){y.onBeforeRender(S,I,k,G,N,nt),y.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),N.onBeforeRender(S,I,k,G,y,nt),N.transparent===!0&&N.side===fn&&N.forceSinglePass===!1?(N.side=ke,N.needsUpdate=!0,S.renderBufferDirect(k,I,G,N,y,nt),N.side=Gn,N.needsUpdate=!0,S.renderBufferDirect(k,I,G,N,y,nt),N.side=fn):S.renderBufferDirect(k,I,G,N,y,nt),y.onAfterRender(S,I,k,G,N,nt)}function fs(y,I,k){I.isScene!==!0&&(I=Dt);const G=kt.get(y),N=m.state.lights,nt=m.state.shadowsArray,pt=N.state.version,gt=Z.getParameters(y,N.state,nt,I,k),xt=Z.getProgramCacheKey(gt);let At=G.programs;G.environment=y.isMeshStandardMaterial?I.environment:null,G.fog=I.fog,G.envMap=(y.isMeshStandardMaterial?b:de).get(y.envMap||G.environment),G.envMapRotation=G.environment!==null&&y.envMap===null?I.environmentRotation:y.envMapRotation,At===void 0&&(y.addEventListener("dispose",it),At=new Map,G.programs=At);let Ct=At.get(xt);if(Ct!==void 0){if(G.currentProgram===Ct&&G.lightsStateVersion===pt)return Io(y,gt),Ct}else gt.uniforms=Z.getUniforms(y),y.onBuild(k,gt,S),y.onBeforeCompile(gt,S),Ct=Z.acquireProgram(gt,xt),At.set(xt,Ct),G.uniforms=gt.uniforms;const wt=G.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(wt.clippingPlanes=ct.uniform),Io(y,gt),G.needsLights=ac(y),G.lightsStateVersion=pt,G.needsLights&&(wt.ambientLightColor.value=N.state.ambient,wt.lightProbe.value=N.state.probe,wt.directionalLights.value=N.state.directional,wt.directionalLightShadows.value=N.state.directionalShadow,wt.spotLights.value=N.state.spot,wt.spotLightShadows.value=N.state.spotShadow,wt.rectAreaLights.value=N.state.rectArea,wt.ltc_1.value=N.state.rectAreaLTC1,wt.ltc_2.value=N.state.rectAreaLTC2,wt.pointLights.value=N.state.point,wt.pointLightShadows.value=N.state.pointShadow,wt.hemisphereLights.value=N.state.hemi,wt.directionalShadowMap.value=N.state.directionalShadowMap,wt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,wt.spotShadowMap.value=N.state.spotShadowMap,wt.spotLightMatrix.value=N.state.spotLightMatrix,wt.spotLightMap.value=N.state.spotLightMap,wt.pointShadowMap.value=N.state.pointShadowMap,wt.pointShadowMatrix.value=N.state.pointShadowMatrix),G.currentProgram=Ct,G.uniformsList=null,Ct}function Lo(y){if(y.uniformsList===null){const I=y.currentProgram.getUniforms();y.uniformsList=Gs.seqWithValue(I.seq,y.uniforms)}return y.uniformsList}function Io(y,I){const k=kt.get(y);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.batchingColor=I.batchingColor,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.instancingMorph=I.instancingMorph,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function rc(y,I,k,G,N){I.isScene!==!0&&(I=Dt),Ut.resetTextureUnits();const nt=I.fog,pt=G.isMeshStandardMaterial?I.environment:null,gt=R===null?S.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Yn,xt=(G.isMeshStandardMaterial?b:de).get(G.envMap||pt),At=G.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Ct=!!k.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),wt=!!k.morphAttributes.position,$t=!!k.morphAttributes.normal,ae=!!k.morphAttributes.color;let le=kn;G.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(le=S.toneMapping);const Ge=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Jt=Ge!==void 0?Ge.length:0,yt=kt.get(G),Ue=m.state.lights;if(q===!0&&(J===!0||y!==v)){const qe=y===v&&G.id===F;ct.setState(G,y,qe)}let Qt=!1;G.version===yt.__version?(yt.needsLights&&yt.lightsStateVersion!==Ue.state.version||yt.outputColorSpace!==gt||N.isBatchedMesh&&yt.batching===!1||!N.isBatchedMesh&&yt.batching===!0||N.isBatchedMesh&&yt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&yt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&yt.instancing===!1||!N.isInstancedMesh&&yt.instancing===!0||N.isSkinnedMesh&&yt.skinning===!1||!N.isSkinnedMesh&&yt.skinning===!0||N.isInstancedMesh&&yt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&yt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&yt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&yt.instancingMorph===!1&&N.morphTexture!==null||yt.envMap!==xt||G.fog===!0&&yt.fog!==nt||yt.numClippingPlanes!==void 0&&(yt.numClippingPlanes!==ct.numPlanes||yt.numIntersection!==ct.numIntersection)||yt.vertexAlphas!==At||yt.vertexTangents!==Ct||yt.morphTargets!==wt||yt.morphNormals!==$t||yt.morphColors!==ae||yt.toneMapping!==le||yt.morphTargetsCount!==Jt)&&(Qt=!0):(Qt=!0,yt.__version=G.version);let xn=yt.currentProgram;Qt===!0&&(xn=fs(G,I,N));let ps=!1,$n=!1,ur=!1;const Se=xn.getUniforms(),Pn=yt.uniforms;if(Tt.useProgram(xn.program)&&(ps=!0,$n=!0,ur=!0),G.id!==F&&(F=G.id,$n=!0),ps||v!==y){Se.setValue(L,"projectionMatrix",y.projectionMatrix),Se.setValue(L,"viewMatrix",y.matrixWorldInverse);const qe=Se.map.cameraPosition;qe!==void 0&&qe.setValue(L,st.setFromMatrixPosition(y.matrixWorld)),oe.logarithmicDepthBuffer&&Se.setValue(L,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Se.setValue(L,"isOrthographic",y.isOrthographicCamera===!0),v!==y&&(v=y,$n=!0,ur=!0)}if(N.isSkinnedMesh){Se.setOptional(L,N,"bindMatrix"),Se.setOptional(L,N,"bindMatrixInverse");const qe=N.skeleton;qe&&(qe.boneTexture===null&&qe.computeBoneTexture(),Se.setValue(L,"boneTexture",qe.boneTexture,Ut))}N.isBatchedMesh&&(Se.setOptional(L,N,"batchingTexture"),Se.setValue(L,"batchingTexture",N._matricesTexture,Ut),Se.setOptional(L,N,"batchingColorTexture"),N._colorsTexture!==null&&Se.setValue(L,"batchingColorTexture",N._colorsTexture,Ut));const dr=k.morphAttributes;if((dr.position!==void 0||dr.normal!==void 0||dr.color!==void 0)&&Mt.update(N,k,xn),($n||yt.receiveShadow!==N.receiveShadow)&&(yt.receiveShadow=N.receiveShadow,Se.setValue(L,"receiveShadow",N.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Pn.envMap.value=xt,Pn.flipEnvMap.value=xt.isCubeTexture&&xt.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&I.environment!==null&&(Pn.envMapIntensity.value=I.environmentIntensity),$n&&(Se.setValue(L,"toneMappingExposure",S.toneMappingExposure),yt.needsLights&&oc(Pn,ur),nt&&G.fog===!0&&j.refreshFogUniforms(Pn,nt),j.refreshMaterialUniforms(Pn,G,W,D,m.state.transmissionRenderTarget[y.id]),Gs.upload(L,Lo(yt),Pn,Ut)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Gs.upload(L,Lo(yt),Pn,Ut),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Se.setValue(L,"center",N.center),Se.setValue(L,"modelViewMatrix",N.modelViewMatrix),Se.setValue(L,"normalMatrix",N.normalMatrix),Se.setValue(L,"modelMatrix",N.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const qe=G.uniformsGroups;for(let fr=0,lc=qe.length;fr<lc;fr++){const Do=qe[fr];Vt.update(Do,xn),Vt.bind(Do,xn)}}return xn}function oc(y,I){y.ambientLightColor.needsUpdate=I,y.lightProbe.needsUpdate=I,y.directionalLights.needsUpdate=I,y.directionalLightShadows.needsUpdate=I,y.pointLights.needsUpdate=I,y.pointLightShadows.needsUpdate=I,y.spotLights.needsUpdate=I,y.spotLightShadows.needsUpdate=I,y.rectAreaLights.needsUpdate=I,y.hemisphereLights.needsUpdate=I}function ac(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(y,I,k){kt.get(y.texture).__webglTexture=I,kt.get(y.depthTexture).__webglTexture=k;const G=kt.get(y);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=k===void 0,G.__autoAllocateDepthBuffer||Gt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,I){const k=kt.get(y);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(y,I=0,k=0){R=y,B=I,A=k;let G=!0,N=null,nt=!1,pt=!1;if(y){const xt=kt.get(y);xt.__useDefaultFramebuffer!==void 0?(Tt.bindFramebuffer(L.FRAMEBUFFER,null),G=!1):xt.__webglFramebuffer===void 0?Ut.setupRenderTarget(y):xt.__hasExternalTextures&&Ut.rebindTextures(y,kt.get(y.texture).__webglTexture,kt.get(y.depthTexture).__webglTexture);const At=y.texture;(At.isData3DTexture||At.isDataArrayTexture||At.isCompressedArrayTexture)&&(pt=!0);const Ct=kt.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ct[I])?N=Ct[I][k]:N=Ct[I],nt=!0):y.samples>0&&Ut.useMultisampledRTT(y)===!1?N=kt.get(y).__webglMultisampledFramebuffer:Array.isArray(Ct)?N=Ct[k]:N=Ct,_.copy(y.viewport),T.copy(y.scissor),U=y.scissorTest}else _.copy(Q).multiplyScalar(W).floor(),T.copy(ot).multiplyScalar(W).floor(),U=St;if(Tt.bindFramebuffer(L.FRAMEBUFFER,N)&&G&&Tt.drawBuffers(y,N),Tt.viewport(_),Tt.scissor(T),Tt.setScissorTest(U),nt){const xt=kt.get(y.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+I,xt.__webglTexture,k)}else if(pt){const xt=kt.get(y.texture),At=I||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,xt.__webglTexture,k||0,At)}F=-1},this.readRenderTargetPixels=function(y,I,k,G,N,nt,pt){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let gt=kt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&pt!==void 0&&(gt=gt[pt]),gt){Tt.bindFramebuffer(L.FRAMEBUFFER,gt);try{const xt=y.texture,At=xt.format,Ct=xt.type;if(!oe.textureFormatReadable(At)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!oe.textureTypeReadable(Ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=y.width-G&&k>=0&&k<=y.height-N&&L.readPixels(I,k,G,N,ht.convert(At),ht.convert(Ct),nt)}finally{const xt=R!==null?kt.get(R).__webglFramebuffer:null;Tt.bindFramebuffer(L.FRAMEBUFFER,xt)}}},this.readRenderTargetPixelsAsync=async function(y,I,k,G,N,nt,pt){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let gt=kt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&pt!==void 0&&(gt=gt[pt]),gt){Tt.bindFramebuffer(L.FRAMEBUFFER,gt);try{const xt=y.texture,At=xt.format,Ct=xt.type;if(!oe.textureFormatReadable(At))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!oe.textureTypeReadable(Ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=y.width-G&&k>=0&&k<=y.height-N){const wt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,wt),L.bufferData(L.PIXEL_PACK_BUFFER,nt.byteLength,L.STREAM_READ),L.readPixels(I,k,G,N,ht.convert(At),ht.convert(Ct),0),L.flush();const $t=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);await fh(L,$t,4);try{L.bindBuffer(L.PIXEL_PACK_BUFFER,wt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,nt)}finally{L.deleteBuffer(wt),L.deleteSync($t)}return nt}}finally{const xt=R!==null?kt.get(R).__webglFramebuffer:null;Tt.bindFramebuffer(L.FRAMEBUFFER,xt)}}},this.copyFramebufferToTexture=function(y,I=null,k=0){y.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,y=arguments[1]);const G=Math.pow(2,-k),N=Math.floor(y.image.width*G),nt=Math.floor(y.image.height*G),pt=I!==null?I.x:0,gt=I!==null?I.y:0;Ut.setTexture2D(y,0),L.copyTexSubImage2D(L.TEXTURE_2D,k,0,0,pt,gt,N,nt),Tt.unbindTexture()},this.copyTextureToTexture=function(y,I,k=null,G=null,N=0){y.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,y=arguments[1],I=arguments[2],N=arguments[3]||0,k=null);let nt,pt,gt,xt,At,Ct;k!==null?(nt=k.max.x-k.min.x,pt=k.max.y-k.min.y,gt=k.min.x,xt=k.min.y):(nt=y.image.width,pt=y.image.height,gt=0,xt=0),G!==null?(At=G.x,Ct=G.y):(At=0,Ct=0);const wt=ht.convert(I.format),$t=ht.convert(I.type);Ut.setTexture2D(I,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,I.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,I.unpackAlignment);const ae=L.getParameter(L.UNPACK_ROW_LENGTH),le=L.getParameter(L.UNPACK_IMAGE_HEIGHT),Ge=L.getParameter(L.UNPACK_SKIP_PIXELS),Jt=L.getParameter(L.UNPACK_SKIP_ROWS),yt=L.getParameter(L.UNPACK_SKIP_IMAGES),Ue=y.isCompressedTexture?y.mipmaps[N]:y.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,Ue.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ue.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,gt),L.pixelStorei(L.UNPACK_SKIP_ROWS,xt),y.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,N,At,Ct,nt,pt,wt,$t,Ue.data):y.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,N,At,Ct,Ue.width,Ue.height,wt,Ue.data):L.texSubImage2D(L.TEXTURE_2D,N,At,Ct,wt,$t,Ue),L.pixelStorei(L.UNPACK_ROW_LENGTH,ae),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,le),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ge),L.pixelStorei(L.UNPACK_SKIP_ROWS,Jt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,yt),N===0&&I.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),Tt.unbindTexture()},this.copyTextureToTexture3D=function(y,I,k=null,G=null,N=0){y.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,G=arguments[1]||null,y=arguments[2],I=arguments[3],N=arguments[4]||0);let nt,pt,gt,xt,At,Ct,wt,$t,ae;const le=y.isCompressedTexture?y.mipmaps[N]:y.image;k!==null?(nt=k.max.x-k.min.x,pt=k.max.y-k.min.y,gt=k.max.z-k.min.z,xt=k.min.x,At=k.min.y,Ct=k.min.z):(nt=le.width,pt=le.height,gt=le.depth,xt=0,At=0,Ct=0),G!==null?(wt=G.x,$t=G.y,ae=G.z):(wt=0,$t=0,ae=0);const Ge=ht.convert(I.format),Jt=ht.convert(I.type);let yt;if(I.isData3DTexture)Ut.setTexture3D(I,0),yt=L.TEXTURE_3D;else if(I.isDataArrayTexture||I.isCompressedArrayTexture)Ut.setTexture2DArray(I,0),yt=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,I.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,I.unpackAlignment);const Ue=L.getParameter(L.UNPACK_ROW_LENGTH),Qt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),xn=L.getParameter(L.UNPACK_SKIP_PIXELS),ps=L.getParameter(L.UNPACK_SKIP_ROWS),$n=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,le.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,le.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,xt),L.pixelStorei(L.UNPACK_SKIP_ROWS,At),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Ct),y.isDataTexture||y.isData3DTexture?L.texSubImage3D(yt,N,wt,$t,ae,nt,pt,gt,Ge,Jt,le.data):I.isCompressedArrayTexture?L.compressedTexSubImage3D(yt,N,wt,$t,ae,nt,pt,gt,Ge,le.data):L.texSubImage3D(yt,N,wt,$t,ae,nt,pt,gt,Ge,Jt,le),L.pixelStorei(L.UNPACK_ROW_LENGTH,Ue),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Qt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,xn),L.pixelStorei(L.UNPACK_SKIP_ROWS,ps),L.pixelStorei(L.UNPACK_SKIP_IMAGES,$n),N===0&&I.generateMipmaps&&L.generateMipmap(yt),Tt.unbindTexture()},this.initRenderTarget=function(y){kt.get(y).__webglFramebuffer===void 0&&Ut.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Ut.setTextureCube(y,0):y.isData3DTexture?Ut.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Ut.setTexture2DArray(y,0):Ut.setTexture2D(y,0),Tt.unbindTexture()},this.resetState=function(){B=0,A=0,R=null,Tt.reset(),Bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===go?"display-p3":"srgb",e.unpackColorSpace=Zt.workingColorSpace===er?"display-p3":"srgb"}}class Mo{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Xt(t),this.density=e}clone(){return new Mo(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Em extends ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new an,this.environmentIntensity=1,this.environmentRotation=new an,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class sr extends Fe{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class vn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new mt:new C);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],r=[],o=[],a=new C,l=new re;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new C)}r[0]=new C,o[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Ae(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Ae(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class yo extends vn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new mt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class wm extends yo{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function So(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,u){let d=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+u)+(l-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const Os=new C,Yr=new So,Kr=new So,$r=new So;class Tm extends vn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(Os.subVectors(s[0],s[1]).add(s[0]),c=Os);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(Os.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Os),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),g<1e-4&&(g=x),m<1e-4&&(m=x),Yr.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,x,m),Kr.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,x,m),$r.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,x,m)}else this.curveType==="catmullrom"&&(Yr.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Kr.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),$r.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Yr.calc(l),Kr.calc(l),$r.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function tl(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function bm(i,t){const e=1-i;return e*e*t}function Am(i,t){return 2*(1-i)*i*t}function Cm(i,t){return i*i*t}function ns(i,t,e,n){return bm(i,t)+Am(i,e)+Cm(i,n)}function Rm(i,t){const e=1-i;return e*e*e*t}function Pm(i,t){const e=1-i;return 3*e*e*i*t}function Lm(i,t){return 3*(1-i)*i*i*t}function Im(i,t){return i*i*i*t}function is(i,t,e,n,s){return Rm(i,t)+Pm(i,e)+Lm(i,n)+Im(i,s)}class Kl extends vn{constructor(t=new mt,e=new mt,n=new mt,s=new mt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(is(t,s.x,r.x,o.x,a.x),is(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Dm extends vn{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(is(t,s.x,r.x,o.x,a.x),is(t,s.y,r.y,o.y,a.y),is(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class $l extends vn{constructor(t=new mt,e=new mt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new mt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new mt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Um extends vn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jl extends vn{constructor(t=new mt,e=new mt,n=new mt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ns(t,s.x,r.x,o.x),ns(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Nm extends vn{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(ns(t,s.x,r.x,o.x),ns(t,s.y,r.y,o.y),ns(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Zl extends vn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new mt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(tl(a,l.x,c.x,h.x,u.x),tl(a,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new mt().fromArray(s))}return this}}var el=Object.freeze({__proto__:null,ArcCurve:wm,CatmullRomCurve3:Tm,CubicBezierCurve:Kl,CubicBezierCurve3:Dm,EllipseCurve:yo,LineCurve:$l,LineCurve3:Um,QuadraticBezierCurve:Jl,QuadraticBezierCurve3:Nm,SplineCurve:Zl});class Fm extends vn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new el[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new el[s.type]().fromJSON(s))}return this}}class Om extends Fm{constructor(t){super(),this.type="Path",this.currentPoint=new mt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new $l(this.currentPoint.clone(),new mt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Jl(this.currentPoint.clone(),new mt(t,e),new mt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Kl(this.currentPoint.clone(),new mt(t,e),new mt(n,s),new mt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Zl(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new yo(t,e,n,s,r,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class rr extends Qe{constructor(t=[new mt(0,-.5),new mt(.5,0),new mt(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Ae(s,0,Math.PI*2);const r=[],o=[],a=[],l=[],c=[],h=1/e,u=new C,d=new mt,f=new C,g=new C,x=new C;let m=0,p=0;for(let E=0;E<=t.length-1;E++)switch(E){case 0:m=t[E+1].x-t[E].x,p=t[E+1].y-t[E].y,f.x=p*1,f.y=-m,f.z=p*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:m=t[E+1].x-t[E].x,p=t[E+1].y-t[E].y,f.x=p*1,f.y=-m,f.z=p*0,g.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(g)}for(let E=0;E<=e;E++){const S=n+E*h*s,w=Math.sin(S),B=Math.cos(S);for(let A=0;A<=t.length-1;A++){u.x=t[A].x*w,u.y=t[A].y,u.z=t[A].x*B,o.push(u.x,u.y,u.z),d.x=E/e,d.y=A/(t.length-1),a.push(d.x,d.y);const R=l[3*A+0]*w,F=l[3*A+1],v=l[3*A+0]*B;c.push(R,F,v)}}for(let E=0;E<e;E++)for(let S=0;S<t.length-1;S++){const w=S+E*t.length,B=w,A=w+t.length,R=w+t.length+1,F=w+1;r.push(B,A,F),r.push(R,F,A)}this.setIndex(r),this.setAttribute("position",new ce(o,3)),this.setAttribute("uv",new ce(a,2)),this.setAttribute("normal",new ce(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rr(t.points,t.segments,t.phiStart,t.phiLength)}}class Hn extends rr{constructor(t=1,e=1,n=4,s=8){const r=new Om;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Hn(t.radius,t.length,t.capSegments,t.radialSegments)}}class Xn extends Qe{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],l=[],c=new C,h=new mt;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,l.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ce(o,3)),this.setAttribute("normal",new ce(a,3)),this.setAttribute("uv",new ce(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xn(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class qn extends Qe{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const x=[],m=n/2;let p=0;E(),o===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new ce(u,3)),this.setAttribute("normal",new ce(d,3)),this.setAttribute("uv",new ce(f,2));function E(){const w=new C,B=new C;let A=0;const R=(e-t)/n;for(let F=0;F<=r;F++){const v=[],_=F/r,T=_*(e-t)+t;for(let U=0;U<=s;U++){const O=U/s,V=O*l+a,z=Math.sin(V),D=Math.cos(V);B.x=T*z,B.y=-_*n+m,B.z=T*D,u.push(B.x,B.y,B.z),w.set(z,R,D).normalize(),d.push(w.x,w.y,w.z),f.push(O,1-_),v.push(g++)}x.push(v)}for(let F=0;F<s;F++)for(let v=0;v<r;v++){const _=x[v][F],T=x[v+1][F],U=x[v+1][F+1],O=x[v][F+1];h.push(_,T,O),h.push(T,U,O),A+=6}c.addGroup(p,A,0),p+=A}function S(w){const B=g,A=new mt,R=new C;let F=0;const v=w===!0?t:e,_=w===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,m*_,0),d.push(0,_,0),f.push(.5,.5),g++;const T=g;for(let U=0;U<=s;U++){const V=U/s*l+a,z=Math.cos(V),D=Math.sin(V);R.x=v*D,R.y=m*_,R.z=v*z,u.push(R.x,R.y,R.z),d.push(0,_,0),A.x=z*.5+.5,A.y=D*.5*_+.5,f.push(A.x,A.y),g++}for(let U=0;U<s;U++){const O=B+U,V=T+U;w===!0?h.push(V,V+1,O):h.push(V+1,V,O),F+=3}c.addGroup(p,F,w===!0?1:2),p+=F}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Xi extends qn{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Xi(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Xe extends Qe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new C,d=new C,f=[],g=[],x=[],m=[];for(let p=0;p<=n;p++){const E=[],S=p/n;let w=0;p===0&&o===0?w=.5/e:p===n&&l===Math.PI&&(w=-.5/e);for(let B=0;B<=e;B++){const A=B/e;u.x=-t*Math.cos(s+A*r)*Math.sin(o+S*a),u.y=t*Math.cos(o+S*a),u.z=t*Math.sin(s+A*r)*Math.sin(o+S*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(A+w,1-S),E.push(c++)}h.push(E)}for(let p=0;p<n;p++)for(let E=0;E<e;E++){const S=h[p][E+1],w=h[p][E],B=h[p+1][E],A=h[p+1][E+1];(p!==0||o>0)&&f.push(S,w,A),(p!==n-1||l<Math.PI)&&f.push(w,B,A)}this.setIndex(f),this.setAttribute("position",new ce(g,3)),this.setAttribute("normal",new ce(x,3)),this.setAttribute("uv",new ce(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xe(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Eo extends Qe{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],l=[],c=[],h=new C,u=new C,d=new C;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const x=g/s*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(x),u.y=(t+e*Math.cos(m))*Math.sin(x),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const x=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,E=(s+1)*f+g;o.push(x,m,E),o.push(m,p,E)}this.setIndex(o),this.setAttribute("position",new ce(a,3)),this.setAttribute("normal",new ce(l,3)),this.setAttribute("uv",new ce(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Eo(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Ot extends as{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Al,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new an,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class ls extends ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Xt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class zm extends ls{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Jr=new re,nl=new C,il=new C;class wo{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new mt(512,512),this.map=null,this.mapPass=null,this.matrix=new re,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new vo,this._frameExtents=new mt(1,1),this._viewportCount=1,this._viewports=[new se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;nl.setFromMatrixPosition(t.matrixWorld),e.position.copy(nl),il.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(il),e.updateMatrixWorld(),Jr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jr),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Jr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Bm extends wo{constructor(){super(new Be(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){const e=this.camera,n=$s*2*t.angle*this.focus,s=this.mapSize.width/this.mapSize.height,r=t.distance||e.far;(n!==e.fov||s!==e.aspect||r!==e.far)&&(e.fov=n,e.aspect=s,e.far=r,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}}class km extends ls{constructor(t,e,n=0,s=Math.PI/3,r=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.target=new ve,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new Bm}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const sl=new re,ji=new C,Zr=new C;class Hm extends wo{constructor(){super(new Be(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new mt(4,2),this._viewportCount=6,this._viewports=[new se(2,1,1,1),new se(0,1,1,1),new se(3,1,1,1),new se(1,1,1,1),new se(3,0,1,1),new se(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ji.setFromMatrixPosition(t.matrixWorld),n.position.copy(ji),Zr.copy(n.position),Zr.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Zr),n.updateMatrixWorld(),s.makeTranslation(-ji.x,-ji.y,-ji.z),sl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(sl)}}class rl extends ls{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Hm}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Gm extends wo{constructor(){super(new Hl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Vm extends ls{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.target=new ve,this.shadow=new Gm}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class jl extends ls{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:mo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=mo);const _t={timestep:1/60,maxSubsteps:5,player:{walkSpeed:3,sprintSpeed:5.2,crawlSpeed:1.4,eyeHeightStanding:1.6,eyeHeightCrouched:.85,radius:.35,stepUpHeight:.28,lookSensitivity:.0023,crouchLerpSpeed:8,stamina:{drainSeconds:6,regenSeconds:9,regenDelay:.8,recoverThreshold:.3}},visibility:{ambientColor:2764869,ambientIntensityByFloor:[.3,.55,.52,.42],hemisphereIntensityByFloor:[.1,.22,.22,.16],fogDensityByFloor:[.15,.09,.1,.14],fogColor:329226,toneExposure:1},battery:{drainSeconds:90,chargeRatio:1.2,startCharge:1},ai:{visionLightOn:14,visionLightOff:5,visionCrouchFactor:.7,coneDegrees:150,proximitySense:1.8,hearCrouch:2.5,hearWalk:6,hearSprint:13,hearChargingHum:9,patrolSpeed:1.6,investigateSpeed:2.7,chaseSpeed:4.5,memorySeconds:2.5,investigateLinger:2,loseInterestSeconds:1.5,searchProbLightOn:.75,searchProbLightOff:.25,gracePeriod:20,migrationInterval:100,antiCampRadius:4,antiCampSeconds:12,keyTakenSpeedFactor:1.12,nearMissMercy:6},enemy:{threatRadius:5,expressionHold:.6,contactRadius:.85,jumpscareTurn:.12,jumpscareLunge:.55,jumpscareRedFade:.4,jumpscareBlackout:.5},flashlight:{color:16769968,intensity:60,range:26,angle:.52,penumbra:.9,swayLag:9,lowThreshold:.18}};class Wm{renderer;scene;camera;updatables=[];accumulator=0;lastTime=null;simulationRunning=!0;onFrame=null;constructor(t){this.renderer=new Sm({canvas:t,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=_l,this.renderer.toneMapping=xl,this.renderer.toneMappingExposure=1,this.scene=new Em,this.camera=new Be(72,window.innerWidth/window.innerHeight,.05,80),window.addEventListener("resize",()=>{this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)})}addUpdatable(t){this.updatables.push(t)}removeUpdatable(t){const e=this.updatables.indexOf(t);e>=0&&this.updatables.splice(e,1)}start(){this.renderer.setAnimationLoop(t=>this.frame(t/1e3))}frame(t){this.lastTime===null&&(this.lastTime=t);const e=Math.min(t-this.lastTime,_t.timestep*_t.maxSubsteps);if(this.lastTime=t,this.simulationRunning)for(this.accumulator+=e;this.accumulator>=_t.timestep;){for(const n of this.updatables)n.update(_t.timestep);this.accumulator-=_t.timestep}this.onFrame?.(e),this.renderer.render(this.scene,this.camera)}}class Xm{down=new Set;pressedThisStep=new Set;mouseDx=0;mouseDy=0;pointerLocked=!1;target=null;onPointerLockLost=null;attach(t){this.target=t,window.addEventListener("keydown",e=>{e.repeat||(this.down.add(e.code),this.pressedThisStep.add(e.code))}),window.addEventListener("keyup",e=>{this.down.delete(e.code)}),window.addEventListener("mousemove",e=>{this.pointerLocked&&(this.mouseDx+=e.movementX,this.mouseDy+=e.movementY)}),document.addEventListener("pointerlockchange",()=>{const e=document.pointerLockElement===this.target;this.pointerLocked&&!e&&this.onPointerLockLost?.(),this.pointerLocked=e}),window.addEventListener("blur",()=>{this.down.clear()})}requestPointerLock(){this.target?.requestPointerLock()}exitPointerLock(){this.pointerLocked&&document.exitPointerLock()}get isPointerLocked(){return this.pointerLocked}isDown(t){return this.down.has(t)}justPressed(t){return this.pressedThisStep.has(t)}anyMovementDown(){return this.down.has("KeyW")||this.down.has("KeyA")||this.down.has("KeyS")||this.down.has("KeyD")}endStep(){this.pressedThisStep.clear(),this.mouseDx=0,this.mouseDy=0}}class qm{position=new C(0,0,0);yaw=0;pitch=0;mode="standing";sprinting=!1;stamina=1;staminaLocked=!1;staminaRegenTimer=0;movementLocked=!1;lookLocked=!1;forceCrouch=!1;noiseLevel=0;floorIndex=1;eyeHeight=_t.player.eyeHeightStanding;colliders;input;camera;constructor(t,e,n){this.camera=t,this.input=e,this.colliders=n}setColliders(t){this.colliders=t}teleport(t,e,n,s=0){this.position.set(t,e,n),this.yaw=s,this.pitch=0}get isCrouched(){return this.mode==="crouched"||this.forceCrouch}get currentSpeed(){const t=_t.player;return this.isCrouched?t.crawlSpeed:this.sprinting?t.sprintSpeed:t.walkSpeed}get bodyHeight(){return this.isCrouched?_t.player.eyeHeightCrouched+.15:_t.player.eyeHeightStanding+.2}update(t){const e=_t.player;if(!this.lookLocked&&this.input.isPointerLocked){this.yaw-=this.input.mouseDx*e.lookSensitivity,this.pitch-=this.input.mouseDy*e.lookSensitivity;const d=Math.PI/2-.05;this.pitch=Math.max(-d,Math.min(d,this.pitch))}this.input.justPressed("KeyC")&&(this.mode=this.mode==="standing"?"crouched":"standing");const n=this.input.isDown("ShiftLeft")||this.input.isDown("ShiftRight"),s=!this.staminaLocked&&this.stamina>0&&!this.isCrouched;this.sprinting=n&&s;let r=0,o=0;if(!this.movementLocked){const d=(this.input.isDown("KeyW")?1:0)-(this.input.isDown("KeyS")?1:0),f=(this.input.isDown("KeyD")?1:0)-(this.input.isDown("KeyA")?1:0);if(d!==0||f!==0){const g=Math.hypot(d,f),x=this.currentSpeed,m=Math.sin(this.yaw),p=Math.cos(this.yaw);r=(f*p-d*m)/g*x*t,o=(-d*p-f*m)/g*x*t}}const a=r!==0||o!==0;this.noiseLevel=a?this.isCrouched?1:this.sprinting?3:2:0;const l=_t.player.stamina;this.sprinting&&a?(this.stamina=Math.max(0,this.stamina-t/l.drainSeconds),this.staminaRegenTimer=l.regenDelay,this.stamina<=0&&(this.staminaLocked=!0,this.sprinting=!1)):(this.staminaRegenTimer>0?this.staminaRegenTimer-=t:this.stamina=Math.min(1,this.stamina+t/l.regenSeconds),this.staminaLocked&&this.stamina>=l.recoverThreshold&&(this.staminaLocked=!1));const c={x:this.position.x,y:this.position.y,z:this.position.z,radius:e.radius,height:this.bodyHeight},h=this.colliders.moveBody(c,r,o,e.stepUpHeight);this.position.x=h.x,this.position.z=h.z,this.position.y=this.colliders.groundHeight(h.x,h.z,e.radius,this.position.y,e.stepUpHeight);const u=this.isCrouched?e.eyeHeightCrouched:e.eyeHeightStanding;this.eyeHeight+=(u-this.eyeHeight)*Math.min(1,e.crouchLerpSpeed*t),this.camera.position.set(this.position.x,this.position.y+this.eyeHeight,this.position.z),this.camera.quaternion.setFromEuler(new an(this.pitch,this.yaw,0,"YXZ"))}viewDir(){return new C(-Math.sin(this.yaw),0,-Math.cos(this.yaw))}}const Ym=.5;class Km{items=new Set;active=null;onPromptChange=null;lastPrompt=null;add(t){this.items.add(t)}remove(t){this.items.delete(t),this.active===t&&(this.active=null)}get activeTarget(){return this.active}update(t,e){let n=null,s=1/0;for(const o of this.items){if(!o.enabled())continue;const a=o.position.x-t.x,l=o.position.y-t.y,c=o.position.z-t.z,h=Math.hypot(a,l,c);if(!(h>o.radius||h>=s)){if(h>1e-6){const u=1/Math.hypot(a,c)||0;if(e.x*a*u+e.z*c*u<Ym)continue}n=o,s=h}}this.active=n;const r=n?typeof n.label=="function"?n.label():n.label:null;r!==this.lastPrompt&&(this.lastPrompt=r,this.onPromptChange?.(r))}interact(){return!this.active||!this.active.enabled()?!1:(this.active.onInteract(),!0)}}class $m{light;on=!1;level=1;flickering=!1;flickerPhase=0;flickerDrop=1;smoothedTarget=new C;initialized=!1;constructor(t){const e=_t.flashlight;this.light=new km(e.color,0,e.range,e.angle,e.penumbra,1.4),this.light.castShadow=!0,this.light.shadow.mapSize.set(1024,1024),this.light.shadow.camera.near=.15,this.light.shadow.camera.far=e.range,this.light.shadow.bias=-.002,this.light.visible=!1,t.add(this.light),t.add(this.light.target)}toggle(){this.setOn(!this.on)}setOn(t){this.on=t,this.light.visible=t&&this.level>0}setLevel(t){this.level=Math.max(0,Math.min(1,t)),this.level<=0&&this.on&&this.setOn(!1)}setFlickering(t){this.flickering=t}get isOn(){return this.on&&this.level>0}update(t,e){const n=_t.flashlight;this.light.position.copy(e.position),this.light.position.y-=.12;const s=new C(0,0,-1).applyQuaternion(e.quaternion),r=e.position.clone().add(s.multiplyScalar(8));if(this.initialized||(this.smoothedTarget.copy(r),this.initialized=!0),this.smoothedTarget.lerp(r,Math.min(1,n.swayLag*t)),this.light.target.position.copy(this.smoothedTarget),!this.isOn){this.light.visible=!1;return}this.light.visible=!0;let o=n.intensity*(.35+.65*this.level);this.flickering&&(this.flickerPhase-=t,this.flickerPhase<=0&&(this.flickerPhase=.05+Math.random()*.3,this.flickerDrop=Math.random()<.4?.15+Math.random()*.4:1),o*=.55*this.flickerDrop),this.light.intensity=o}}const vt=2,uo=3.5,Ke=3,Jm=["Basement","Main Floor","Upstairs","Attic"];function Te(i){return i*uo}function we(i,t){return{x:(i+.5)*vt,z:(t+.5)*vt}}function cs(i,t){return{x:Math.floor(i/vt),z:Math.floor(t/vt)}}function To(i){return i==="floor"||i==="door"||i==="stair"||i==="vent"}const Zm=["###############","#..H.#...#..C.#","#....v...+....#","#....v...#....#","##+####+####+##","#....#...#....#","#.E..#SSS+...K#","#....#...#V...#","##+#########+##","#....#H..#....#","#.##.+...+.##.#","#....#...#....#","#.C..#...#..H.#","#..K.#...#....#","###############"],jm=["###############","#H...#.B.#....#","#.P..+...+.PK.#","#....#...#.E..#","##+####+####+##","#C...v...#...D#","#....vSSS+....#","#....#...#V...#","##+####+####+##","#...H#...#H...#","#....#...#....#","#S...+.P.+....#","#S.K.#...#..P.#","#S...#.A.#...C#","###############"],Qm=["###############","#H...#...#...H#","#....+...+..K.#","#..E.#...#....#","##v####.###vv##","#....#...#....#","#C...+...+...H#","#....#...#..K.#","##+####.####+##","#....#...#....#","#.H..+...+..H.#","#S...#...#..S.#","#S...#...#..S.#","#S..K#...#..S.#","###############"],tg=["###############","#.............#","#..V......K...#","#.....vv......#","#..#......#...#","#..#..E...#.H.#","#.............#","#....##..#....#","#.C...........#","#......#......#","#..#...#...#..#","#..#.K.....#S.#","#..........#S.#","#H.........#S.#","###############"],jr=[Zm,jm,Qm,tg],eg={"0:3,1":"boxFort","0:6,9":"cabinet","0:12,12":"boxFort","1:1,1":"cabinet","1:4,9":"closet","1:10,9":"closet","2:1,1":"wardrobe","2:13,1":"wardrobe","2:13,6":"closet","2:2,10":"underBed","2:12,10":"boxFort","3:12,5":"boxFort","3:1,13":"boxFort"},ng={"0:2,6":"poo","1:11,3":"newYama","2:3,3":"fuggie","3:6,5":"charles"};function ig(i){switch(i){case"#":return"wall";case" ":return"void";case"+":return"door";case"S":return"stair";case"v":return"vent";default:return"floor"}}function sg(){const i=jr[0].length,t=jr[0][0].length,e={grids:[],width:t,depth:i,playerSpawn:{floor:1,x:0,z:0},playerSpawns:[],enemySpawns:[],hidingSpots:[],chargingStations:[],keyCandidates:[],exits:[],stairs:[{lower:0,upper:1,cells:[{x:6,z:6},{x:7,z:6},{x:8,z:6}]},{lower:1,upper:2,cells:[{x:1,z:11},{x:1,z:12},{x:1,z:13}]},{lower:2,upper:3,cells:[{x:12,z:11},{x:12,z:12},{x:12,z:13}]}],vents:[{floor:0,cells:[{x:5,z:2},{x:5,z:3}]},{floor:1,cells:[{x:5,z:5},{x:5,z:6}]},{floor:2,cells:[{x:2,z:4}]},{floor:2,cells:[{x:12,z:4},{x:11,z:4}]},{floor:3,cells:[{x:6,z:3},{x:7,z:3}]}],chutes:[{from:{floor:1,x:10,z:7},to:{floor:0,x:10,z:7}},{from:{floor:3,x:3,z:2},to:{floor:2,x:3,z:2}}]};let n=!1;if(jr.forEach((s,r)=>{const o=r;if(s.length!==i)throw new Error(`floor ${r}: expected ${i} rows, got ${s.length}`);const a=[];s.forEach((l,c)=>{if(l.length!==t)throw new Error(`floor ${r} row ${c}: expected ${t} cols, got ${l.length}`);const h=[];for(let u=0;u<t;u++){const d=l[u];h.push(ig(d));const f={floor:o,x:u,z:c};switch(d){case"P":e.playerSpawns.push(f),n||(e.playerSpawn=f,n=!0);break;case"E":{const g=ng[`${r}:${u},${c}`];if(!g)throw new Error(`enemy spawn at ${r}:${u},${c} missing ENEMY_AT entry`);e.enemySpawns.push({pos:f,enemy:g});break}case"H":{const g=eg[`${r}:${u},${c}`];if(!g)throw new Error(`hiding spot at ${r}:${u},${c} missing HIDING_KINDS entry`);e.hidingSpots.push({pos:f,kind:g});break}case"C":e.chargingStations.push(f);break;case"K":e.keyCandidates.push(f);break;case"A":e.exits.push({pos:f,id:"A"});break;case"B":e.exits.push({pos:f,id:"B"});break;case"D":e.exits.push({pos:f,id:"C"});break;case"V":{const g=e.chutes.find(m=>m.from.floor===o&&m.from.x===u&&m.from.z===c),x=e.chutes.find(m=>m.to.floor===o&&m.to.x===u&&m.to.z===c);if(!g&&!x)throw new Error(`chute cell at ${r}:${u},${c} not in chutes table`);break}}}a.push(h)}),e.grids.push(a)}),!n)throw new Error("no player spawn (P) in layout");for(const s of e.stairs)for(const r of[s.lower,s.upper])for(const o of s.cells)if(e.grids[r][o.z][o.x]!=="stair")throw new Error(`stair cell ${r}:${o.x},${o.z} is not 'S' in the grid`);for(const s of e.vents)for(const r of s.cells)if(e.grids[s.floor][r.z][r.x]!=="vent")throw new Error(`vent cell ${s.floor}:${r.x},${r.z} is not 'v' in the grid`);return e}function rg(i,t){const e=[],n=i.grids[t.floor],s=[{dx:1,dz:0},{dx:-1,dz:0},{dx:0,dz:1},{dx:0,dz:-1}];for(const{dx:r,dz:o}of s){const a=t.x+r,l=t.z+o;if(a<0||l<0||a>=i.width||l>=i.depth)continue;const c=n[l][a];if(!To(c))continue;const h=c==="vent"||n[t.z][t.x]==="vent";e.push({pos:{floor:t.floor,x:a,z:l},viaPassage:h,viaChute:!1})}for(const r of i.stairs){const o=r.cells[0],a=r.cells[r.cells.length-1];t.floor===r.lower&&t.x===o.x&&t.z===o.z&&e.push({pos:{floor:r.upper,x:a.x,z:a.z},viaPassage:!1,viaChute:!1}),t.floor===r.upper&&t.x===a.x&&t.z===a.z&&e.push({pos:{floor:r.lower,x:o.x,z:o.z},viaPassage:!1,viaChute:!1});for(let l=0;l<r.cells.length-1;l++)for(const c of[r.lower,r.upper]){const h=r.cells[l],u=r.cells[l+1];t.floor===c&&t.x===h.x&&t.z===h.z&&e.push({pos:{floor:c,x:u.x,z:u.z},viaPassage:!1,viaChute:!1}),t.floor===c&&t.x===u.x&&t.z===u.z&&e.push({pos:{floor:c,x:h.x,z:h.z},viaPassage:!1,viaChute:!1})}}for(const r of i.chutes)t.floor===r.from.floor&&t.x===r.from.x&&t.z===r.from.z&&e.push({pos:{...r.to},viaPassage:!0,viaChute:!0});return e}const De=sg();function dn(i,t,e,n,s,r){return{minX:i,minY:t,minZ:e,maxX:n,maxY:s,maxZ:r}}function Qr(i,t){if(i.y+i.height<=t.minY||i.y>=t.maxY)return!1;const e=Zs(i.x,t.minX,t.maxX),n=Zs(i.z,t.minZ,t.maxZ),s=i.x-e,r=i.z-n;return s*s+r*r<i.radius*i.radius}function Zs(i,t,e){return i<t?t:i>e?e:i}function og(i,t){const e=Zs(i.x,t.minX,t.maxX),n=Zs(i.z,t.minZ,t.maxZ),s=i.x-e,r=i.z-n,o=s*s+r*r;if(o>1e-12){const d=Math.sqrt(o),f=i.radius-d;return{x:i.x+s/d*f,z:i.z+r/d*f}}const a=i.x-t.minX+i.radius,l=t.maxX-i.x+i.radius,c=i.z-t.minZ+i.radius,h=t.maxZ-i.z+i.radius,u=Math.min(a,l,c,h);return u===a?{x:t.minX-i.radius,z:i.z}:u===l?{x:t.maxX+i.radius,z:i.z}:u===c?{x:i.x,z:t.minZ-i.radius}:{x:i.x,z:t.maxZ+i.radius}}class ag{boxes=[];add(t){this.boxes.push(t)}addAll(t){for(const e of t)this.boxes.push(e)}clear(){this.boxes=[]}remove(t){const e=this.boxes.indexOf(t);e>=0&&this.boxes.splice(e,1)}get all(){return this.boxes}moveBody(t,e,n,s){let{x:r,z:o}=t;for(const a of["x","z"]){const l={x:r,y:t.y,z:o,radius:t.radius,height:t.height},c={x:a==="x"?r+e:r,y:t.y,z:a==="z"?o+n:o,radius:t.radius,height:t.height};for(const h of this.boxes){if(!Qr(c,h))continue;const u=h.maxY-c.y;if(!(u>0&&u<=s))if(!Qr(l,h))c.x=l.x,c.z=l.z;else{const d=og(c,h);c.x=d.x,c.z=d.z}}r=c.x,o=c.z}return{x:r,z:o}}groundHeight(t,e,n,s,r){let o=0;const a={x:t,y:-1e3,z:e,radius:n,height:2e3};for(const l of this.boxes)Qr(a,l)&&l.maxY<=s+r&&l.maxY>o&&(o=l.maxY);return o}}const Tn=new Ot({color:4863270,roughness:.85}),hn=new Ot({color:7033144,roughness:.9}),sn=new Ot({color:9071946,roughness:.9}),Ri=new Ot({color:5982802,roughness:1}),lg=new Ot({color:10129274,roughness:1}),zs=new Ot({color:8027520,roughness:.5,metalness:.6}),ol=new Ot({color:5066834,roughness:.6,metalness:.5}),to=new Ot({color:9062986,roughness:.7});function It(i,t,e,n,s,r,o,a){const l=new dt(new ee(e,n,s),t);return l.position.set(r,o+n/2,a),l.castShadow=l.receiveShadow=!0,i.add(l),l}const cg={wardrobe(i){return It(i,Tn,1.5,2.2,.8,0,0,0),It(i,hn,.66,2,.05,-.36,.1,.42),It(i,hn,.66,2,.05,.36,.1,.42),It(i,sn,.06,.3,.06,-.06,1,.46),It(i,sn,.06,.3,.06,.06,1,.46),{half:[.78,.45],height:2.2,solid:!0}},bed(i){It(i,Tn,1.2,.25,2,0,.2,0),It(i,lg,1.1,.25,1.9,0,.45,0),It(i,Ri,1,.12,.5,0,.7,-.65),It(i,Tn,1.2,.9,.08,0,0,-1);for(const[t,e]of[[-.55,-.9],[.55,-.9],[-.55,.9],[.55,.9]])It(i,Tn,.1,.2,.1,t,0,e);return{half:[.62,1.02],height:1,solid:!0}},cabinet(i){return It(i,hn,1.2,1.1,.6,0,0,0),It(i,sn,.55,.95,.04,-.3,.07,.31),It(i,sn,.55,.95,.04,.3,.07,.31),{half:[.62,.32],height:1.1,solid:!0}},crates(i){return It(i,sn,.9,.9,.9,-.35,0,-.2),It(i,hn,.7,.7,.7,.45,0,.25),It(i,sn,.6,.6,.6,-.15,.9,-.15),{half:[.85,.7],height:1.6,solid:!0}},couch(i){return It(i,Ri,2,.45,.9,0,0,0),It(i,Ri,2,.6,.25,0,.45,-.32),It(i,Ri,.25,.35,.9,-.88,.45,0),It(i,Ri,.25,.35,.9,.88,.45,0),{half:[1.02,.47],height:1.05,solid:!0}},table(i){It(i,hn,1.8,.08,1,0,.72,0);for(const[t,e]of[[-.8,-.4],[.8,-.4],[-.8,.4],[.8,.4]])It(i,Tn,.09,.72,.09,t,0,e);return{half:[.92,.52],height:.8,solid:!0}},bookshelf(i){It(i,Tn,1.6,2.1,.4,0,0,0);for(let t=0;t<4;t++){It(i,sn,1.45,.04,.34,0,.35+t*.5,.02);for(let e=0;e<5;e++){const n=new Ot({color:[6962236,3955306,5925436,6969916,4865130][e],roughness:.9});It(i,n,.12,.34,.22,-.6+e*.28,.39+t*.5,.04)}}return{half:[.82,.22],height:2.1,solid:!0}},washer(i){It(i,zs,.85,1,.8,0,0,0);const t=new dt(new qn(.25,.25,.06,20),ol);return t.rotation.x=Math.PI/2,t.position.set(0,.55,.41),i.add(t),{half:[.45,.42],height:1,solid:!0}},boiler(i){const t=new dt(new qn(.5,.5,1.9,16),ol);return t.position.y=.95,t.castShadow=!0,i.add(t),It(i,zs,.08,1.2,.08,.45,1,.3),It(i,zs,.08,1.6,.08,-.4,.6,-.25),{half:[.55,.55],height:2.2,solid:!0}},shelf(i){return It(i,zs,1.8,1.9,.5,0,0,0),It(i,sn,.5,.4,.4,-.5,.2,0),It(i,hn,.4,.3,.35,.4,.95,0),It(i,to,.35,.3,.3,-.3,1.5,0),{half:[.92,.27],height:1.9,solid:!0}},toyChest(i){It(i,to,1.3,.7,.7,0,0,0),It(i,sn,1.34,.1,.74,0,.7,0);const t=new dt(new Xe(.15,12,10),new Ot({color:13404211,roughness:.6}));return t.position.set(.3,.85,0),i.add(t),{half:[.68,.38],height:.95,solid:!0}},dollhouse(i){It(i,to,1.1,.9,.7,0,0,0);const t=new dt(new Xi(.75,.5,4),hn);return t.position.y=1.15,t.rotation.y=Math.PI/4,t.castShadow=!0,i.add(t),It(i,sn,.2,.3,.02,0,.2,.36),{half:[.58,.38],height:1.4,solid:!0}},coatRack(i){return It(i,Tn,.08,1.8,.08,0,0,0),It(i,Tn,.5,.06,.5,0,0,0),It(i,hn,.6,.06,.06,0,1.6,0),It(i,Ri,.35,.8,.18,.15,.85,0),{half:[.3,.3],height:1.85,solid:!1}},closet(i){It(i,Tn,1.1,2.2,.7,0,0,-.12),It(i,hn,1,2.05,.5,0,.05,-.14);const t=new _e;t.position.set(-.5,0,.22);const e=It(t,hn,.96,2,.06,.48,.1,0);return e.castShadow=!0,It(t,sn,.05,.28,.05,.9,1,.05),i.add(t),{half:[.56,.42],height:2.2,solid:!0,door:t}}};function hg(i){const t=new _e,e=cg[i.kind](t),n=(i.rot??0)%4*(Math.PI/2);t.rotation.y=n;const{x:s,z:r}=we(i.pos.x,i.pos.z),o=Te(i.pos.floor);t.position.set(s,o,r);const a=(i.rot??0)%2===1,l=a?e.half[1]:e.half[0],c=a?e.half[0]:e.half[1],h=e.solid?[dn(s-l,o,r-c,s+l,o+e.height,r+c)]:[];return{group:t,colliders:h,solid:e.solid,door:e.door}}function ug(i){switch(i){case"wardrobe":return"wardrobe";case"underBed":return"bed";case"cabinet":return"cabinet";case"boxFort":return"crates";case"closet":return"closet"}}const dg=[{pos:{floor:0,x:11,z:1},kind:"washer",rot:2},{pos:{floor:0,x:2,z:5},kind:"boiler"},{pos:{floor:0,x:1,z:9},kind:"shelf",rot:1},{pos:{floor:0,x:13,z:11},kind:"crates"},{pos:{floor:0,x:7,z:12},kind:"shelf"},{pos:{floor:1,x:2,z:1},kind:"cabinet",rot:2},{pos:{floor:1,x:11,z:1},kind:"table"},{pos:{floor:1,x:13,z:2},kind:"cabinet",rot:3},{pos:{floor:1,x:2,z:6},kind:"shelf",rot:1},{pos:{floor:1,x:2,z:10},kind:"couch",rot:1},{pos:{floor:1,x:3,z:13},kind:"bookshelf",rot:2},{pos:{floor:1,x:8,z:12},kind:"coatRack"},{pos:{floor:1,x:13,z:10},kind:"bookshelf",rot:3},{pos:{floor:1,x:11,z:12},kind:"table"},{pos:{floor:2,x:3,z:1},kind:"bed"},{pos:{floor:2,x:11,z:1},kind:"bed"},{pos:{floor:2,x:11,z:5},kind:"bed"},{pos:{floor:2,x:3,z:6},kind:"cabinet",rot:1},{pos:{floor:2,x:13,z:9},kind:"toyChest"},{pos:{floor:2,x:3,z:12},kind:"cabinet"},{pos:{floor:3,x:8,z:9},kind:"dollhouse"},{pos:{floor:3,x:4,z:6},kind:"crates"},{pos:{floor:3,x:9,z:4},kind:"crates"},{pos:{floor:3,x:10,z:12},kind:"crates"},{pos:{floor:3,x:13,z:7},kind:"shelf",rot:3}],eo=.25,Bs=1.1,ks=2.2,al=.25;function An(i,t,e=1,n=1){const s=document.createElement("canvas");s.width=s.height=i;const r=s.getContext("2d");t(r,i);const o=new sr(s);return o.wrapS=o.wrapT=ss,o.repeat.set(e,n),o.colorSpace=ze,o}function Ui(i,t,e,n,s=2){i.fillStyle=e;for(let r=0;r<n;r++){const o=Math.random()*t,a=Math.random()*t,l=Math.random()*s+.5;i.globalAlpha=.08+Math.random()*.25,i.beginPath(),i.arc(o,a,l,0,Math.PI*2),i.fill()}i.globalAlpha=1}function fg(i,t){i.strokeStyle="#2c2118";for(let e=0;e<26;e++){const n=Math.random()*t,s=Math.random()*t,r=6+Math.random()*30,o=(Math.random()-.5)*.5;i.globalAlpha=.05+Math.random()*.18,i.lineWidth=.5+Math.random()*1.5,i.beginPath(),i.moveTo(n,s),i.lineTo(n+Math.cos(o)*r,s+Math.sin(o)*r),i.stroke()}for(let e=0;e<5;e++)i.fillStyle="#3a2c1d",i.globalAlpha=.1+Math.random()*.14,i.beginPath(),i.ellipse(Math.random()*t,Math.random()*t,6+Math.random()*16,5+Math.random()*12,Math.random()*Math.PI,0,Math.PI*2),i.fill();i.globalAlpha=1}function Ql(i,t,e){for(let n=0;n<3;n++){const s=Math.random()*t,r=Math.random()*t,o=16+Math.random()*36,a=22+Math.random()*48;i.fillStyle=e,i.globalAlpha=.85,i.beginPath();const l=10;for(let c=0;c<=l;c++){const h=c/l*Math.PI*2,u=.5+Math.random()*.5,d=s+Math.cos(h)*o*.5*u,f=r+Math.sin(h)*a*.5*u;c===0?i.moveTo(d,f):i.lineTo(d,f)}i.closePath(),i.fill(),i.strokeStyle="#9c917c",i.globalAlpha=.3,i.lineWidth=2,i.stroke()}i.globalAlpha=1}function ll(i,t){i.fillStyle="#5a5d58",i.fillRect(0,0,t,t),Ui(i,t,"#454843",900,3),Ui(i,t,"#6d706a",500,2),Ui(i,t,"#3a3e3a",250,4),pg(i,t)}function pg(i,t){for(let e=0;e<6;e++){const n=Math.random()*t,s=Math.random()*t,r=14+Math.random()*40,o=i.createRadialGradient(n,s,1,n,s,r);o.addColorStop(0,"rgba(38,46,44,0.42)"),o.addColorStop(.6,"rgba(44,52,50,0.22)"),o.addColorStop(1,"rgba(58,62,58,0)"),i.fillStyle=o,i.beginPath(),i.arc(n,s,r,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(150,156,148,0.18)",i.lineWidth=1+Math.random()*1.5,i.beginPath(),i.arc(n,s,r*(.7+Math.random()*.2),0,Math.PI*2),i.stroke()}i.strokeStyle="rgba(34,40,38,0.3)";for(let e=0;e<10;e++){const n=Math.random()*t,s=Math.random()*t*.4;i.lineWidth=.5+Math.random()*2,i.beginPath(),i.moveTo(n,s),i.lineTo(n+(Math.random()-.5)*4,s+20+Math.random()*60),i.stroke()}}function mg(i,t){i.fillStyle="#7a7160",i.fillRect(0,0,t,t),i.fillStyle="#6b6253";for(let e=0;e<t;e+=32)i.fillRect(e,0,14,t);i.strokeStyle="#564e41",i.lineWidth=2;for(let e=7;e<t;e+=32)i.beginPath(),i.moveTo(e,0),i.lineTo(e,t),i.stroke();Ui(i,t,"#3f3a30",350,5),Ql(i,t,"#544a3b")}function gg(i,t){i.fillStyle="#8a7d80",i.fillRect(0,0,t,t),i.fillStyle="#796d72";for(let e=0;e<t;e+=28)for(let n=e/28%2===0?0:14;n<t;n+=28)i.beginPath(),i.arc(n,e,4,0,Math.PI*2),i.fill();Ui(i,t,"#4d4347",300,4),Ql(i,t,"#5b5054")}function Hs(i,t,e,n){i.fillStyle=e,i.fillRect(0,0,t,t),i.fillStyle=n;for(let s=0;s<t;s+=24)i.fillRect(0,s,t,2);for(let s=0;s<t;s+=24){const r=Math.random()*t;i.fillRect(r,s,2,24)}Ui(i,t,n,400,2),fg(i,t)}function _g(i,t){i.clearRect(0,0,t,t);const e=t/2;i.strokeStyle="rgba(228,228,222,0.55)",i.lineWidth=1.2;const n=9;for(let s=0;s<n;s++){const r=s/n*Math.PI*2;i.beginPath(),i.moveTo(e,e),i.lineTo(e+Math.cos(r)*e,e+Math.sin(r)*e),i.stroke()}for(let s=e*.18;s<e;s+=e*.16){i.beginPath();for(let r=0;r<=n;r++){const o=r/n*Math.PI*2,a=s*(.9+Math.random()*.16),l=e+Math.cos(o)*a,c=e+Math.sin(o)*a;r===0?i.moveTo(l,c):i.lineTo(l,c)}i.closePath(),i.stroke()}}function vg(){const i=(h,u=.95)=>new Ot({map:h,roughness:u,metalness:0}),t=i(An(256,ll,2,1.5)),e=i(An(256,ll,8,8)),n=i(An(256,mg,2,1.5)),s=i(An(256,(h,u)=>Hs(h,u,"#6e5840","#4a3a28"),8,8)),r=i(An(256,gg,2,1.5)),o=i(An(256,(h,u)=>Hs(h,u,"#75604a","#503f2d"),8,8)),a=i(An(256,(h,u)=>Hs(h,u,"#5c4a36","#3c2f21"),2,1.5)),l=i(An(256,(h,u)=>Hs(h,u,"#544433","#382c1f"),8,8)),c=new Ot({color:2827810,roughness:1});return[{wall:t,floor:e,ceiling:c},{wall:n,floor:s,ceiling:c},{wall:r,floor:o,ceiling:c},{wall:a,floor:l,ceiling:c}]}class xg{static build(t){const e=new _e,n=new ag,s=vg(),r=[],o=t.grids.map(()=>new Set);for(const v of t.stairs)for(const _ of v.cells)o[v.upper].add(`${_.x},${_.z}`);for(const v of t.chutes)o[v.from.floor].add(`${v.from.x},${v.from.z}`);t.grids.forEach((v,_)=>{const T=Te(_),U=new _e;U.name=`floor-${_}`;const O=s[_];for(let z=0;z<t.depth;z++){let D=-1;for(let W=0;W<=t.width;W++){const H=W<t.width&&v[z][W]!=="void"&&!o[_].has(`${W},${z}`);if(H&&D<0&&(D=W),!H&&D>=0){const tt=D*vt,Q=W*vt,ot=z*vt,St=(z+1)*vt,bt=new dt(new ee(Q-tt,eo,St-ot),O.floor);bt.position.set((tt+Q)/2,T-eo/2,(ot+St)/2),bt.receiveShadow=!0,U.add(bt),n.add(dn(tt,T-eo,ot,Q,T,St)),D=-1}}}const V=_+1<t.grids.length?o[_+1]:null;for(let z=0;z<t.depth;z++){let D=-1;for(let W=0;W<=t.width;W++){const H=V?.has(`${W},${z}`)??!1,tt=W<t.width&&v[z][W]!=="void"&&!H;if(tt&&D<0&&(D=W),!tt&&D>=0){const Q=D*vt,ot=W*vt,St=new dt(new ee(ot-Q,.1,vt),O.ceiling);St.position.set((Q+ot)/2,T+Ke+.05,(z+.5)*vt),U.add(St),D=-1}}}for(let z=0;z<t.depth;z++){let D=-1;for(let W=0;W<=t.width;W++){const H=W<t.width&&v[z][W]==="wall";if(H&&D<0&&(D=W),!H&&D>=0){const tt=D*vt,Q=W*vt,ot=z*vt,St=(z+1)*vt,bt=new dt(new ee(Q-tt,Ke,St-ot),O.wall);bt.position.set((tt+Q)/2,T+Ke/2,(ot+St)/2),bt.castShadow=bt.receiveShadow=!0,U.add(bt),n.add(dn(tt,T,ot,Q,T+Ke,St)),D=-1}}}for(let z=0;z<t.depth;z++)for(let D=0;D<t.width;D++){const W=v[z][D],{x:H,z:tt}=we(D,z);if(W==="door"){const Q=new dt(new ee(vt,Ke-ks,vt),O.wall);Q.position.set(H,T+ks+(Ke-ks)/2,tt),Q.castShadow=!0,U.add(Q),n.add(dn(D*vt,T+ks,z*vt,(D+1)*vt,T+Ke,(z+1)*vt))}else if(W==="vent"){const Q=new dt(new ee(vt,Ke-Bs,vt),O.wall);Q.position.set(H,T+Bs+(Ke-Bs)/2,tt),Q.castShadow=!0,U.add(Q),n.add(dn(D*vt,T+Bs,z*vt,(D+1)*vt,T+Ke,(z+1)*vt))}}if(_===1||_===2){const z=new Ot({color:3358814,emissive:2240589,emissiveIntensity:.9,roughness:.4});for(let D=2;D<t.width-2;D+=4)for(const[W,H]of[[0,1],[t.depth-1,-1]]){if(v[W][D]!=="wall")continue;const tt=new dt(new Hi(1,1.2),z),{x:Q,z:ot}=we(D,W);tt.position.set(Q,T+1.7,ot+H*(vt/2+.02)),H<0&&(tt.rotation.y=Math.PI),U.add(tt),r.push(tt)}}e.add(U)});const a=new Ot({color:5193518,roughness:.9});for(const v of t.stairs){const _=Te(v.lower),U=Math.ceil(uo/al),O=v.cells[1],V=v.cells[v.cells.length-1],z=we(O.x,O.z),D=we(V.x,V.z),W=Math.sign(D.x-z.x),H=Math.sign(D.z-z.z),Q=vt*(v.cells.length-1)/U,ot=z.x-W*vt/2,St=z.z-H*vt/2;for(let bt=0;bt<U;bt++){const q=(bt+1)*al,J=ot+W*Q*(bt+.5),ut=St+H*Q*(bt+.5),st=W!==0?Q:vt*.7,Dt=H!==0?Q:vt*.7,Lt=new dt(new ee(st,q,Dt),a);Lt.position.set(J,_+q/2,ut),Lt.castShadow=Lt.receiveShadow=!0,e.add(Lt),n.add(dn(J-st/2,_,ut-Dt/2,J+st/2,_+q,ut+Dt/2))}}const l=new Ot({color:4864040,roughness:.8});for(const v of t.stairs){const _=t.grids[v.upper],T=Te(v.upper),U=new Set(v.cells.map(V=>`${V.x},${V.z}`)),O=v.cells[v.cells.length-1];for(const V of v.cells)if(!(V.x===O.x&&V.z===O.z))for(const[z,D]of[[1,0],[-1,0],[0,1],[0,-1]]){const W=V.x+z,H=V.z+D;if(W<0||H<0||W>=t.width||H>=t.depth||U.has(`${W},${H}`))continue;const tt=_[H][W];if(tt==="wall"||tt==="void")continue;const{x:Q,z:ot}=we(V.x,V.z),St=Q+z*vt/2,bt=ot+D*vt/2,q=z!==0?.08:vt,J=D!==0?.08:vt,ut=new dt(new ee(q,1,J),l);ut.position.set(St,T+.5,bt),ut.castShadow=!0,e.add(ut),n.add(dn(St-q/2,T,bt-J/2,St+q/2,T+1,bt+J/2))}}const c=new Ot({color:3815994,roughness:.6,metalness:.4});for(const v of t.chutes){const{x:_,z:T}=we(v.from.x,v.from.z),U=Te(v.from.floor),O=new dt(new ee(vt,.12,vt),c);O.scale.set(1,1,.12),O.position.set(_,U+.06,T-vt/2+.12),e.add(O.clone());const V=O.clone();V.position.set(_,U+.06,T+vt/2-.12),e.add(V);const z=O.clone();z.rotation.y=Math.PI/2,z.position.set(_-vt/2+.12,U+.06,T),e.add(z);const D=O.clone();D.rotation.y=Math.PI/2,D.position.set(_+vt/2-.12,U+.06,T),e.add(D)}const h=new Set,u=new Map,d=[...dg,...t.hidingSpots.map(v=>({pos:v.pos,kind:ug(v.kind),rot:0}))];for(const v of d){const _=hg(v);e.add(_.group),n.addAll(_.colliders),_.solid&&h.add(`${v.pos.floor}:${v.pos.x},${v.pos.z}`),_.door&&u.set(`${v.pos.floor}:${v.pos.x},${v.pos.z}`,{pivot:_.door,angle:0,target:0})}const f=new Ot({color:5593167,roughness:.5,metalness:.5});for(const v of t.vents)for(const _ of v.cells){const{x:T,z:U}=we(_.x,_.z),O=Te(v.floor),V=new _e;for(let W=0;W<4;W++){const H=new dt(new ee(.9,.06,.04),f);H.position.set(0,.25+W*.22,0),V.add(H)}const z=t.grids[v.floor];z[_.z][_.x-1]==="wall"||z[_.z][_.x+1]==="wall"||(V.rotation.y=Math.PI/2),V.position.set(T,O,U),e.add(V)}const g=t.grids.length-1,x=An(128,_g),m=new nr({map:x,transparent:!0,opacity:.5,depthWrite:!1,side:fn}),E=Te(g)+Ke,S=t.width/2*vt,w=t.depth/2*vt,B=[{x:1.4,z:1.4,size:1.6},{x:13.6,z:1.4,size:1.5},{x:1.4,z:13.6,size:1.4},{x:13.6,z:13.6,size:1.7},{x:7,z:2,size:1},{x:4.5,z:8,size:.9},{x:10.5,z:11,size:1.2}];for(const v of B){const _=new dt(new Hi(v.size,v.size),m),T=v.x*vt,U=v.z*vt;_.position.set(T,E-.5,U),_.rotation.y=Math.atan2(S-T,w-U),_.rotation.x=.5,e.add(_)}const A=[{floor:1,x:6,z:.6},{floor:1,x:6,z:13.4},{floor:2,x:10,z:.6},{floor:2,x:10,z:13.4}];for(const v of A){const _=new rl(4873610,3.2,7,1.8),{x:T,z:U}=we(v.x,Math.round(v.z));_.position.set(T,Te(v.floor)+2,v.z<7?U+1:U-1),e.add(_)}const R=[],F=[{floor:0,x:7,z:5},{floor:3,x:7,z:6}];for(const v of F){const{x:_,z:T}=we(v.x,v.z),U=Te(v.floor)+Ke-.35,O=new Ot({color:8939042,emissive:13408580,emissiveIntensity:1.4}),V=new dt(new Xe(.07,10,8),O);V.position.set(_,U,T);const z=new dt(new qn(.012,.012,.3,6),new Ot({color:1710618}));z.position.set(_,U+.2,T);const D=new rl(13408580,4.5,9,1.6);D.position.set(_,U-.1,T),e.add(V,z,D),R.push({light:D,bulb:V,phase:0,drop:1})}return{group:e,colliders:n,slabHoles:o,solidCells:h,windowPanes:r,updateFixtures(v){for(const _ of R)_.phase-=v,_.phase<=0&&(_.phase=.08+Math.random()*.7,_.drop=Math.random()<.25?.1+Math.random()*.5:1),_.light.intensity=4.5*_.drop,_.bulb.material.emissiveIntensity=1.4*_.drop;for(const _ of u.values())Math.abs(_.target-_.angle)<.001||(_.angle+=(_.target-_.angle)*Math.min(1,10*v),_.pivot.rotation.y=_.angle)},markerWorld(v,_=0){const{x:T,z:U}=we(v.x,v.z);return new C(T,Te(v.floor)+_,U)},floorIndexOfY(v){return Math.max(0,Math.min(3,Math.round(v/uo)))},openCloset(v){const _=u.get(`${v.floor}:${v.x},${v.z}`);_&&(_.target=Math.PI*.62)}}}}class Mg{kind;position;occupied=!1;enteredWithLightOff=!0;exitPos=null;constructor(t,e){this.kind=t.kind,this.position=e}}class yg{constructor(t,e,n){this.player=t;for(const{def:s,worldPos:r}of n){const o=new Mg(s,r);this.spots.push(o),e.add({position:r,radius:2.2,label:Sg(s.kind),enabled:()=>!o.occupied&&this.active===null,onInteract:()=>this.enter(o)})}}spots=[];active=null;isLightOn=()=>!1;forceLightOff=()=>{};onEnter=null;onExit=null;get all(){return this.spots}enter(t){this.active||(t.occupied=!0,t.enteredWithLightOff=!this.isLightOn(),this.forceLightOff(),this.active=t,t.exitPos=this.player.position.clone(),this.player.position.set(t.position.x,t.position.y,t.position.z),this.player.movementLocked=!0,this.player.forceCrouch=t.kind==="underBed"||t.kind==="cabinet",this.onEnter?.(t))}exit(){const t=this.active;return t?(t.exitPos&&this.player.position.copy(t.exitPos),t.occupied=!1,this.active=null,this.player.movementLocked=!1,this.player.forceCrouch=!1,this.onExit?.(t),!0):!1}}function Sg(i){switch(i){case"wardrobe":return"Hide in the wardrobe";case"underBed":return"Hide under the bed";case"cabinet":return"Hide in the cabinet";case"boxFort":return"Hide between the boxes";case"closet":return"Hide in the closet"}}class Eg{constructor(t,e,n,s,r){this.colliders=e,this.player=n;const o=new Ot({color:5196354,roughness:.7,metalness:.3});t.vents.forEach((a,l)=>{const c=`vent-${l}`,h=Te(a.floor),u=t.grids[a.floor],d=[],f=[];for(const m of a.cells){const{x:p,z:E}=we(m.x,m.z),S=u[m.z][m.x-1]==="wall"||u[m.z][m.x+1]==="wall",w=S?dn(p-vt/2,h,E-.06,p+vt/2,h+1.1,E+.06):dn(p-.06,h,E-vt/2,p+.06,h+1.1,E+vt/2);this.colliders.add(w),d.push(w);for(const B of[-1,1]){const A=new dt(new ee(.95,1,.05),o);S?A.position.set(p,h+.55,E+B*.1):(A.rotation.y=Math.PI/2,A.position.set(p+B*.1,h+.55,E)),A.castShadow=!0,r.add(A),f.push(A)}}const g={id:c,vent:a,opened:!1,discovered:!1,enteredWithLightOff:!0,blockers:d,grateMeshes:f};this.vents.push(g);const x=we(a.cells[0].x,a.cells[0].z);s.add({position:new C(x.x,h+.6,x.z),radius:1.8,label:()=>g.opened?"":"Pry the vent open",enabled:()=>!g.opened,onInteract:()=>this.openVent(g)})}),t.chutes.forEach((a,l)=>{const c=`chute-${l}`,{x:h,z:u}=we(a.from.x,a.from.z),d=Te(a.from.floor),f=dn(a.from.x*vt,d-.12,a.from.z*vt,(a.from.x+1)*vt,d,(a.from.z+1)*vt);this.colliders.add(f);const g=new dt(new ee(vt-.3,.08,vt-.3),o);g.position.set(h,d-.04,u),r.add(g);const x={id:c,chute:a,opened:!1,discovered:!1,enteredWithLightOff:!0,blocker:f,lidMesh:g};this.chutes.push(x),s.add({position:new C(h,d+.3,u),radius:1.8,label:()=>x.opened?"":"Open the hatch",enabled:()=>!x.opened,onInteract:()=>this.openChute(x)})})}vents=[];chutes=[];isLightOn=()=>!1;onPlayerEnter=null;onOpen=null;playerWasInside=new Set;openVent(t){t.opened=!0;for(const e of t.blockers)this.colliders.remove(e);for(const e of t.grateMeshes)e.rotation.x=-Math.PI*.45,e.position.y+=.35;this.onOpen?.(t)}openChute(t){t.opened=!0,t.blocker&&this.colliders.remove(t.blocker),t.lidMesh&&(t.lidMesh.rotation.z=Math.PI*.55,t.lidMesh.position.y+=.4,t.lidMesh.position.x+=.9),this.onOpen?.(t)}update(){const t=this.player,e=cs(t.position.x,t.position.z);for(const n of this.vents){const s=n.vent.cells.some(a=>e.x===a.x&&e.z===a.z),r=t.floorIndex===n.vent.floor&&s&&n.opened,o=this.playerWasInside.has(n.id);r&&!o?(n.enteredWithLightOff=!this.isLightOn(),this.playerWasInside.add(n.id),this.onPlayerEnter?.(n)):!r&&o&&(n.discovered=!0,this.playerWasInside.delete(n.id))}for(const n of this.chutes){const s=n.chute.from,r=e.x===s.x&&e.z===s.z;r&&n.opened&&t.position.y<Te(s.floor)-.4&&!this.playerWasInside.has(n.id)?(n.enteredWithLightOff=!this.isLightOn(),n.discovered=!0,this.playerWasInside.add(n.id),this.onPlayerEnter?.(n)):r||this.playerWasInside.delete(n.id)}}}class wg{cell;position;group;led;onPlugIn=null;charging=!1;pulse=0;constructor(t,e,n){this.cell=t,this.position=e.clone().add(new C(0,1.1,0)),this.group=new _e;const s=new Ot({color:4014148,roughness:.5,metalness:.4}),r=new dt(new ee(.45,.6,.18),s);r.castShadow=!0,this.group.add(r),this.led=new dt(new Xe(.045,10,8),new Ot({color:1127185,emissive:2293572,emissiveIntensity:2.2})),this.led.position.set(.12,.2,.1),this.group.add(this.led);const o=new Ot({color:2236962,roughness:.9}),a=new dt(new qn(.015,.015,.5,6),o);a.position.set(-.1,-.5,.06),this.group.add(a);const l=new dt(new ee(.08,.12,.06),s);l.position.set(-.1,-.8,.06),this.group.add(l);const c=n.lengthSq()>1e-6,h=c?e.clone().add(n.clone().multiplyScalar(.78)):e.clone();this.group.position.set(h.x,e.y+1.1,h.z),c&&this.group.lookAt(e.x,e.y+1.1,e.z)}register(t){t.add({position:this.position,radius:2,label:"Plug in flashlight",enabled:()=>!0,onInteract:()=>this.onPlugIn?.()})}updateVisual(t){const e=this.led.material;this.charging?(this.pulse+=t*5,e.emissiveIntensity=1.6+Math.sin(this.pulse)*1.2):e.emissiveIntensity=2.2}}class Tg{def;group;position;tryOpen=null;panel;opened=!1;constructor(t,e){this.def=t,this.group=new _e;const{x:n,z:s}=we(t.pos.x,t.pos.z),r=Te(t.pos.floor);let o=0,a=0;t.pos.z+1>=e.depth-1?a=1:t.pos.z-1<=0?a=-1:t.pos.x+1>=e.width-1?o=1:o=-1;const l=new Ot({color:3023384,roughness:.8}),c=new Ot({color:4796444,roughness:.75}),h=new Ot({color:9072698,roughness:.35,metalness:.7}),u=new dt(new ee(1.5,2.5,.18),l);this.panel=new dt(new ee(1.24,2.3,.1),c),this.panel.position.z=.02;const d=new dt(new Xe(.07,10,8),h);d.position.set(.45,-.1,.12);const f=new dt(new ee(.12,.3,.04),h);f.position.set(.45,-.32,.08),this.panel.add(d,f),u.add(this.panel),u.castShadow=!0;const g=vt/2-.05;u.position.set(n+o*g,r+1.25,s+a*g),o!==0?u.rotation.y=o>0?-Math.PI/2:Math.PI/2:a<0&&(u.rotation.y=Math.PI),this.group.add(u),this.position=new C(n,r+1,s)}register(t){t.add({position:this.position,radius:2.2,label:()=>this.opened?"":"Try the door",enabled:()=>!this.opened,onInteract:()=>{(this.tryOpen?.()??"locked")==="open"&&this.swingOpen()}})}swingOpen(){this.opened=!0,this.panel.rotation.y=-Math.PI*.55,this.panel.position.x-=.5}}class bg{group;glintMat;t=0;constructor(){this.group=new _e,this.glintMat=new Ot({color:11573834,emissive:6706466,emissiveIntensity:.8,metalness:.85,roughness:.3});const t=new dt(new Eo(.09,.015,8,20),this.glintMat);t.rotation.x=Math.PI/2,this.group.add(t);for(const[e,n]of[[.4,.16],[-.5,.13]]){const s=new dt(new ee(.02,n,.012),this.glintMat);s.position.set(Math.sin(e)*.08,-n/2,Math.cos(e)*.02),s.rotation.z=e*.3;const r=new dt(new ee(.05,.04,.012),this.glintMat);r.position.set(Math.sin(e)*.08,-n-.01,Math.cos(e)*.02),this.group.add(s,r)}this.group.visible=!1}showAt(t){this.group.position.copy(t).add(new C(0,.55,0)),this.group.visible=!0}hide(){this.group.visible=!1}updateVisual(t){this.group.visible&&(this.t+=t,this.group.position.y+=Math.sin(this.t*2.2)*9e-4,this.group.rotation.y+=t*.8,this.glintMat.emissiveIntensity=.6+(Math.sin(this.t*3.1)+1)*.5)}}class Ag{level;onChange=null;onLowWarning=null;wasLow=!1;constructor(t=_t.battery.startCharge){this.level=cl(t),this.wasLow=this.isLow}get isLow(){return this.level<=_t.flashlight.lowThreshold}get isEmpty(){return this.level<=0}canLight(){return this.level>0}update(t,e){!e||this.level<=0||this.set(this.level-t/_t.battery.drainSeconds)}charge(t){this.set(this.level+t/(_t.battery.drainSeconds*_t.battery.chargeRatio))}set(t){const e=cl(t);e!==this.level&&(this.level=e,this.onChange?.(e),this.isLow&&!this.wasLow&&this.onLowWarning?.(),this.wasLow=this.isLow)}}function cl(i){return i<0?0:i>1?1:i}class Cg{constructor(t,e,n,s){this.battery=t,this.player=e,this.input=n,this.forceLightOff=s}session=null;onHumTick=null;onPlugChange=null;humTimer=0;justPlugged=!1;get isCharging(){return this.session!==null}plugIn(t){this.session||(this.session=t,t.charging=!0,this.justPlugged=!0,this.forceLightOff(),this.player.movementLocked=!0,this.onPlugChange?.(!0))}unplug(){this.session&&(this.session.charging=!1,this.session=null,this.player.movementLocked=!1,this.onPlugChange?.(!1))}update(t){if(this.session){if(this.justPlugged)this.justPlugged=!1;else if(this.input.anyMovementDown()||this.input.justPressed("KeyE")){this.unplug();return}this.battery.charge(t),this.humTimer-=t,this.humTimer<=0&&(this.humTimer=1.2,this.onHumTick?.(this.session))}}}class Rg{phase="idle";target=null;onGameOver=null;onSting=null;onRedFade=null;onBlackout=null;timer=0;emitted=!1;startQuat=new hi;targetQuat=new hi;lungeFrom=new C;trigger(t,e){if(this.phase!=="idle")return!1;this.phase="turning",this.timer=0,this.target=t,this.emitted=!1,t.isChasing=!0,this.startQuat.copy(e.quaternion);const n=t.position.clone().add(new C(0,1.1,0)),s=new re().lookAt(e.position,n,new C(0,1,0));return this.targetQuat.setFromRotationMatrix(s),this.lungeFrom.copy(t.position),!0}get running(){return this.phase!=="idle"&&this.phase!=="done"}reset(){this.phase="idle",this.target=null,this.onRedFade?.(0),this.onBlackout?.(0)}update(t,e){if(!this.running||!this.target)return;const n=_t.enemy;if(this.timer+=t,this.phase==="turning"){const s=Math.min(1,this.timer/n.jumpscareTurn);e.quaternion.slerpQuaternions(this.startQuat,this.targetQuat,s),s>=1&&(this.phase="lunging",this.timer=0,this.onSting?.())}else if(this.phase==="lunging"){const s=Math.min(1,this.timer/n.jumpscareLunge),r=s*s,o=e.position.clone().sub(this.lungeFrom).multiplyScalar(r*.97);o.y=0,this.target.position.copy(this.lungeFrom.clone().add(o));const a=.05*(.4+s);e.position.x+=(Math.random()-.5)*a,e.position.y+=(Math.random()-.5)*a,s>=1&&(this.phase="redFade",this.timer=0)}else if(this.phase==="redFade"){const s=Math.min(1,this.timer/n.jumpscareRedFade);this.onRedFade?.(s);const r=.04*(1-s);e.position.x+=(Math.random()-.5)*r,e.position.y+=(Math.random()-.5)*r,s>=1&&(this.phase="blackout",this.timer=0)}else if(this.phase==="blackout"){const s=Math.min(1,this.timer/n.jumpscareBlackout);this.onRedFade?.(1),this.onBlackout?.(s),s>=1&&(this.phase="done",this.emitted||(this.emitted=!0,this.onGameOver?.(this.target.id)))}}}const ni=(i,t,e)=>`${i}:${t},${e}`;class Pg{adjacency=new Map;cells=new Map;constructor(t,e){const n=new Set(t.chutes.map(s=>ni(s.from.floor,s.from.x,s.from.z)));for(let s=0;s<t.grids.length;s++)for(let r=0;r<t.depth;r++)for(let o=0;o<t.width;o++){if(!To(t.grids[s][r][o]))continue;const a=ni(s,o,r);if(e.has(a))continue;this.cells.set(a,{floor:s,x:o,z:r});const l=[];for(const c of rg(t,{floor:s,x:o,z:r})){const h=ni(c.pos.floor,c.pos.x,c.pos.z);if(e.has(h))continue;const u=n.has(h)&&!c.viaChute,d=n.has(a)&&!c.viaChute,f=c.viaPassage||c.viaChute||u||d,g=c.pos.floor!==s,x=c.viaChute?2:g?4:f?2.5:1;l.push({to:h,cost:x,passage:f})}this.adjacency.set(a,l)}}nearestNode(t){const e=Math.max(0,Math.min(3,Math.round(t.y/3.5))),{x:n,z:s}=cs(t.x,t.z),r=this.cells.get(ni(e,n,s));if(r)return r;for(let o=1;o<=3;o++)for(let a=-o;a<=o;a++)for(let l=-o;l<=o;l++){if(Math.max(Math.abs(a),Math.abs(l))!==o)continue;const c=this.cells.get(ni(e,n+a,s+l));if(c)return c}return null}findPath(t,e,n={}){const s=ni(t.floor,t.x,t.z),r=ni(e.floor,e.x,e.z);if(!this.adjacency.has(s)||!this.adjacency.has(r))return null;const o=new Map([[s,0]]),a=new Map([[s,0]]),l=new Map,c=new Set,h=u=>{const d=this.cells.get(u);return Math.abs(d.x-e.x)+Math.abs(d.z-e.z)+Math.abs(d.floor-e.floor)*10};for(;o.size;){let u="",d=1/0;for(const[f,g]of o)g<d&&(d=g,u=f);if(u===r){const f=[];let g=u;for(;g;)f.unshift(this.cells.get(g)),g=l.get(g);return f}o.delete(u),c.add(u);for(const f of this.adjacency.get(u)??[]){if(c.has(f.to)||f.passage&&!n.allowPassages)continue;const g=(a.get(u)??1/0)+f.cost;g<(a.get(f.to)??1/0)&&(l.set(f.to,u),a.set(f.to,g),o.set(f.to,g+h(f.to)))}}return null}toWaypoints(t){const e=[];for(let n=0;n<t.length;n++){const s=t[n],r=t[n-1],o=t[n+1];if(r&&o&&r.floor===s.floor&&o.floor===s.floor&&Math.sign(o.x-s.x)===Math.sign(s.x-r.x)&&Math.sign(o.z-s.z)===Math.sign(s.z-r.z))continue;const{x:a,z:l}=we(s.x,s.z);e.push(new C(a,Te(s.floor),l))}return e}randomNodeOnFloor(t,e){const n=[...this.cells.values()].filter(s=>s.floor===t);return n.length===0?null:n[Math.floor(e.next()*n.length)]}}class Lg{waypoints=[];index=0;setPath(t){this.waypoints=t,this.index=0}clear(){this.waypoints=[],this.index=0}get done(){return this.index>=this.waypoints.length}drive(t,e){if(this.done){t.setMoveTarget(null);return}const n=this.waypoints[this.index],s=n.clone(),r=(t.position.x-n.x)*(t.position.x-n.x)+(t.position.z-n.z)*(t.position.z-n.z),o=Math.abs(t.position.y-n.y);if(r<.36&&o<.6){this.index++,this.drive(t,e);return}t.setMoveTarget(s,e)}}function Ig(i,t,e,n,s){const o=t||i<=_t.enemy.threatRadius?"menacing":"calm";return o===e?{mood:e,heldFor:n+s}:n<_t.enemy.expressionHold?{mood:e,heldFor:n+s}:{mood:o,heldFor:0}}function ui(i,t,e,n=1,s=0){const o=document.createElement("canvas");o.width=o.height=256;const a=o.getContext("2d");a.fillStyle=i,a.fillRect(0,0,256,256),a.fillStyle=t;for(let h=0;h<s;h++)a.globalAlpha=.5+Math.random()*.3,a.beginPath(),a.ellipse(Math.random()*256,Math.random()*256,14+Math.random()*30,10+Math.random()*24,Math.random()*Math.PI,0,Math.PI*2),a.fill();a.globalAlpha=1,a.strokeStyle=e,a.lineWidth=1;const l=Math.round(2600*n);for(let h=0;h<l;h++){const u=Math.random()*256,d=Math.random()*256,f=Math.random()*Math.PI*2,g=2+Math.random()*3*n;a.globalAlpha=.12+Math.random()*.2,a.beginPath(),a.moveTo(u,d),a.lineTo(u+Math.cos(f)*g,d+Math.sin(f)*g),a.stroke()}a.globalAlpha=1;const c=new sr(o);return c.wrapS=c.wrapT=ss,c.colorSpace=ze,c}function Dg(i){const t={};for(const e of["calm","menacing"]){const n=document.createElement("canvas");n.width=n.height=256;const s=n.getContext("2d");i(s,256,e);const r=new sr(n);r.colorSpace=ze,t[e]=r}return t}class or{id;group=new _e;get position(){return this.group.position}isChasing=!1;speed=0;floorIndex=0;mood="calm";onCatch=null;onGaitBeat=null;catchEnabled=!0;facePlane=null;faces=null;heldFor=0;twitch=0;moveTarget=null;gaitT=0;baseScale=new C(1,1,1);constructor(t){this.id=t}init(){this.facePlane=this.buildBody(),this.faces=Dg((e,n,s)=>this.drawFace(e,n,s));const t=this.facePlane.material;t.map=this.faces.calm,t.transparent=!0,this.baseScale.copy(this.group.scale),this.group.traverse(e=>{e instanceof dt&&(e.castShadow=!0)})}setMoveTarget(t,e=0){this.moveTarget=t?t.clone():null,this.speed=e}get isMoving(){return this.moveTarget!==null&&this.speed>0}update(t,e,n){if(this.moveTarget&&!hl(this.moveTarget)&&(this.moveTarget=null),this.moveTarget&&hl(this.position)){const a=this.moveTarget.clone().sub(this.position),l=a.y;a.y=0;const c=a.length();if(c>.05||Math.abs(l)>.1){const h=Math.min(c,this.speed*t);if(c>1e-6){a.normalize(),this.position.addScaledVector(a,h);const f=Math.atan2(-a.x,-a.z)+Math.PI,g=Ug(f-this.group.rotation.y);this.group.rotation.y+=g*Math.min(1,8*t)}const u=l<0?9:3.2,d=Math.sign(l)*Math.min(Math.abs(l),u*t);this.position.y+=d,this.gaitT+=h}else this.moveTarget=null}this.animateGait(this.gaitT,this.isMoving?this.speed:0,t);const s=this.position.distanceTo(e),r=this.mood,o=Ig(s,this.isChasing,this.mood,this.heldFor,t);if(this.mood=o.mood,this.heldFor=o.heldFor,this.mood!==r){const a=this.facePlane.material;a.map=this.faces[this.mood],a.needsUpdate=!0,this.twitch=.12}if(this.twitch>0){this.twitch-=t;const a=1+Math.sin(this.twitch/.12*Math.PI)*.07;this.group.scale.set(this.baseScale.x*a,this.baseScale.y*a,this.baseScale.z*a)}else this.group.scale.copy(this.baseScale);this.catchEnabled&&n&&s<=_t.enemy.contactRadius+.35&&(this.catchEnabled=!1,this.onCatch?.())}}function Ug(i){for(;i>Math.PI;)i-=Math.PI*2;for(;i<-Math.PI;)i+=Math.PI*2;return i}function hl(i){return Number.isFinite(i.x)&&Number.isFinite(i.y)&&Number.isFinite(i.z)}class Ng extends or{armL;armR;torso;constructor(){super("charles"),this.init()}buildBody(){const t=new Ot({map:ui("#7ed9c4","#6cc4b0","#9aeeda",1.2),roughness:.95}),e=new Ot({map:ui("#9aa0a8","#8a9098","#b5bcc4",.7),roughness:.9});this.torso=new _e;const n=new dt(new Xe(.42,18,16),t);n.scale.set(1.15,1,.95),n.position.y=.62,this.torso.add(n);const s=new dt(new Xn(.26,20),e);s.position.set(0,.58,.42),s.scale.y=1.3,this.torso.add(s);const r=new dt(new Xe(.3,18,14),t);r.scale.set(1,.92,.95),r.position.set(0,1.06,.04),this.torso.add(r);const o=new dt(new ee(.42,.1,.12),e);o.position.set(0,1.16,.27),o.rotation.x=.15,this.torso.add(o);const a=new dt(new Xn(.24,20),new Ot({roughness:.85}));a.position.set(0,1.02,.29),this.torso.add(a);const l=document.createElement("canvas");l.width=l.height=128;const c=l.getContext("2d"),h=["#e53935","#fb8c00","#fdd835","#43a047","#1e88e5","#8e24aa"];h.forEach((g,x)=>{c.fillStyle=g,c.fillRect(128/h.length*x,0,128/h.length+1,128)});const u=new sr(l);u.colorSpace=ze;const d=new dt(new Xi(.16,.34,16),new Ot({map:u,roughness:.7}));d.position.set(.03,1.4,0),d.rotation.z=-.15,this.torso.add(d);const f=g=>{const x=new _e,m=new dt(new Hn(.13,.82,5,10),t);m.position.y=-.45,x.add(m);const p=new dt(new Xe(.17,12,10),t);return p.position.y=-.94,p.scale.set(1.3,.65,1.45),x.add(p),x.position.set(g*.48,.9,.16),x.rotation.x=-.5,this.torso.add(x),x};return this.armL=f(-1),this.armR=f(1),this.group.add(this.torso),a}drawFace(t,e,n){t.clearRect(0,0,e,e);const s=e/2;if(t.fillStyle="#9aa0a8",t.beginPath(),t.arc(s,s,s,0,Math.PI*2),t.fill(),n==="calm"){for(const r of[-38,38])t.fillStyle="#f5f5f5",t.beginPath(),t.ellipse(s+r,s-22,30,36,0,0,Math.PI*2),t.fill(),t.strokeStyle="#222",t.lineWidth=7,t.stroke(),t.fillStyle="#1a1a1a",t.beginPath(),t.ellipse(s+r,s-14,11,14,0,0,Math.PI*2),t.fill();t.fillStyle="#5a6068",t.beginPath(),t.ellipse(s-10,s+38,5,7,0,0,Math.PI*2),t.ellipse(s+10,s+38,5,7,0,0,Math.PI*2),t.fill(),t.strokeStyle="#3c4248",t.lineWidth=5,t.beginPath(),t.moveTo(s-22,s+62),t.quadraticCurveTo(s,s+70,s+22,s+62),t.stroke()}else{for(const r of[-38,38]){const o=Math.sign(r);t.save(),t.translate(s+r,s-22),t.rotate(o*.35),t.fillStyle="#f5f5f5",t.beginPath(),t.ellipse(0,0,30,22,0,0,Math.PI*2),t.fill(),t.strokeStyle="#111",t.lineWidth=7,t.stroke(),t.fillStyle="#7a0000",t.beginPath(),t.ellipse(0,4,10,11,0,0,Math.PI*2),t.fill(),t.strokeStyle="#2a2e34",t.lineWidth=10,t.beginPath(),t.moveTo(-30,-22),t.lineTo(28,-10),t.stroke(),t.restore()}t.fillStyle="#3a1518",t.beginPath(),t.ellipse(s,s+56,36,24,0,0,Math.PI*2),t.fill(),t.fillStyle="#e8e2d2";for(let r=-3;r<=3;r++)t.fillRect(s+r*11-4,s+36,8,12),t.fillRect(s+r*11-4,s+66,8,12)}}animateGait(t,e,n){const s=t*3.2,r=e>0?1:.12;this.armL.rotation.x=-.5+Math.sin(s)*.55*r,this.armR.rotation.x=-.5+Math.sin(s+Math.PI)*.55*r,this.torso.rotation.z=Math.sin(s)*.18*r,this.torso.position.y=Math.abs(Math.sin(s))*.1*r,e>0&&Math.abs(Math.sin(s))<.08&&n>0&&this.onGaitBeat?.("knuckle")}}class Fg extends or{body;stalkL;stalkR;eyeMats=[];hopHeight=0;constructor(){super("poo"),this.init()}buildBody(){const t=new Ot({map:ui("#d9b286","#cba271","#ecc89e",.5),roughness:.95}),e=[];for(let o=0;o<=14;o++){const a=o/14,l=.34*Math.sin(a*Math.PI)*(1-a*.32)+.001;e.push(new mt(l,a*.62))}this.body=new dt(new rr(e,22),t),this.group.add(this.body);const n=new dt(new Xn(.17,18),new Ot({roughness:.9}));n.position.set(0,.34,.27),n.rotation.x=-.12,this.body.add(n);const s=()=>{const o=new Ot({color:1052688,roughness:.15,metalness:.1});return this.eyeMats.push(o),o},r=o=>{const a=new _e,l=new dt(new Hn(.045,.1,4,8),new Ot({map:ui("#d9b286","#cba271","#ecc89e",.4),roughness:.95}));l.position.y=.06,a.add(l);const c=new dt(new Xe(.11,14,12),s());c.position.y=.18,a.add(c);const h=new dt(new Xn(.03,8),new nr({color:16777215}));return h.position.set(.035,.22,.09),h.rotation.x=-.3,a.add(h),a.position.set(o*.13,.58,.05),a.rotation.z=-o*.2,this.body.add(a),a};return this.stalkL=r(-1),this.stalkR=r(1),n}drawFace(t,e,n){t.clearRect(0,0,e,e);const s=e/2;if(n==="calm")t.strokeStyle="#4a3a28",t.lineWidth=9,t.lineCap="round",t.beginPath(),t.moveTo(s-42,s),t.lineTo(s+42,s),t.stroke();else{t.fillStyle="#2a1410",t.beginPath(),t.moveTo(s-58,s-8),t.quadraticCurveTo(s,s+56,s+58,s-8),t.quadraticCurveTo(s,s+18,s-58,s-8),t.fill(),t.fillStyle="#e8e2d2";for(let r=-2;r<=2;r++)t.beginPath(),t.moveTo(s+r*18-6,s+(Math.abs(r)===2?2:8)),t.lineTo(s+r*18,s+(Math.abs(r)===2?12:22)),t.lineTo(s+r*18+6,s+(Math.abs(r)===2?2:8)),t.fill()}}animateGait(t,e,n){const s=t*2.6;if(e>0){const o=Math.abs(Math.sin(s));this.hopHeight=o*.34,this.body.position.y=this.hopHeight;const a=1+(o-.5)*.3;this.body.scale.set(1/Math.sqrt(a),a,1/Math.sqrt(a));const l=Math.cos(s)*.3;this.stalkL.rotation.x=l,this.stalkR.rotation.x=l,o<.06&&n>0&&this.onGaitBeat?.("fwump")}else this.body.position.y=0,this.body.scale.set(1,1,1),this.stalkL.rotation.x*=.9,this.stalkR.rotation.x*=.9;const r=this.mood==="menacing";for(const o of this.eyeMats)o.emissive.setHex(r?3342336:0),o.emissiveIntensity=r?.55:0}}class Og extends or{legs=[];neck;earL;earR;constructor(){super("newYama"),this.init()}buildBody(){const t=new Ot({map:ui("#c69a55","#b4884a","#e0b97a",2.2),roughness:1}),e=new Ot({map:ui("#efe8d8","#e0d6c0","#fffdf2",.8),roughness:.95}),n=new dt(new Hn(.27,.6,6,14),t);n.rotation.x=Math.PI/2,n.position.y=.95,this.group.add(n);const s=(u,d)=>{const f=new dt(new Hn(.085,.62,5,8),t);f.position.set(d*.16,.48,u*.3);const g=new dt(new qn(.09,.1,.22,10),e);return g.position.y=-.32,f.add(g),this.group.add(f),this.legs.push(f),f};s(1,1),s(1,-1),s(-1,1),s(-1,-1),this.neck=new _e;const r=new dt(new Hn(.13,.5,5,10),t);r.position.y=.25,this.neck.add(r);const o=new _e,a=new dt(new Xe(.15,14,12),t);o.add(a);const l=new dt(new ee(.14,.13,.2),e);l.position.set(0,-.04,.16),o.add(l);const c=new dt(new Xe(.09,10,8),t);c.position.set(0,.15,-.02),o.add(c),this.earL=new dt(new Xi(.045,.14,8),t),this.earL.position.set(-.09,.16,.02),o.add(this.earL),this.earR=this.earL.clone(),this.earR.position.x=.09,o.add(this.earR);const h=new dt(new Xn(.13,16),new Ot({roughness:.9}));return h.position.set(0,.02,.15),o.add(h),o.position.y=.62,this.neck.add(o),this.neck.position.set(0,1.05,.32),this.neck.rotation.x=.12,this.group.add(this.neck),h}drawFace(t,e,n){t.clearRect(0,0,e,e);const s=e/2;if(n==="calm"){t.fillStyle="#2c1f14";for(const r of[-44,44])t.beginPath(),t.ellipse(s+r,s-16,16,20,0,0,Math.PI*2),t.fill();t.strokeStyle="#9a8a72",t.lineWidth=5,t.beginPath(),t.moveTo(s-14,s+52),t.quadraticCurveTo(s,s+60,s+14,s+52),t.stroke()}else{for(const r of[-44,44])t.fillStyle="#f2efe6",t.beginPath(),t.ellipse(s+r,s-16,22,26,0,0,Math.PI*2),t.fill(),t.fillStyle="#1a0f08",t.beginPath(),t.ellipse(s+r,s-12,9,12,0,0,Math.PI*2),t.fill();t.fillStyle="#3a201c",t.beginPath(),t.ellipse(s,s+52,34,20,0,0,Math.PI*2),t.fill(),t.fillStyle="#e8e2d2";for(let r=-2;r<=2;r++)t.fillRect(s+r*13-5,s+34,10,14)}}animateGait(t,e,n){const s=t*2.4,r=e>0?.38:.03;this.legs[0].rotation.x=Math.sin(s)*r,this.legs[3].rotation.x=Math.sin(s)*r,this.legs[1].rotation.x=Math.sin(s+Math.PI)*r,this.legs[2].rotation.x=Math.sin(s+Math.PI)*r,e>0?(this.neck.rotation.x=.12+Math.sin(s*2)*.07,this.neck.rotation.y*=Math.max(0,1-6*n),Math.abs(Math.sin(s))<.06&&n>0&&this.onGaitBeat?.("hoof")):(this.neck.rotation.y=Math.sin(t*.4)*.5,this.neck.rotation.x+=(.12-this.neck.rotation.x)*Math.min(1,6*n));const o=this.mood==="menacing"?.9:0;this.earL.rotation.x=-o,this.earR.rotation.x=-o}}class zg extends or{bodyMesh;head;armL;armR;constructor(){super("fuggie"),this.init()}buildBody(){const t=new Ot({map:ui("#2f9e86","#7a4f9e","#4fc4ac",2.6,14),roughness:1}),e=new Xe(.42,24,18),n=e.attributes.position;for(let c=0;c<n.count;c++){const h=new C().fromBufferAttribute(n,c),u=1+.08*Math.sin(h.x*9.1+1.3)*Math.cos(h.y*7.7)+.06*Math.sin(h.z*11.3+.4);h.multiplyScalar(u),n.setXYZ(c,h.x,h.y*1.25,h.z)}e.computeVertexNormals(),this.bodyMesh=new dt(e,t),this.bodyMesh.position.y=.5,this.group.add(this.bodyMesh),this.head=new _e;const s=new Xi(.1,.22,4),r=new dt(s,t);r.position.set(-.22,.52,0),r.rotation.z=.3;const o=new dt(s,t);o.position.set(.22,.52,0),o.rotation.z=-.3,this.head.add(r,o);const a=new dt(new Xn(.3,22),new Ot({roughness:.9}));a.position.set(0,.18,.41),a.rotation.x=-.08,this.head.add(a),this.head.position.y=.5,this.head.rotation.z=.09,this.group.add(this.head);const l=new Hn(.09,.2,4,8);return this.armL=new dt(l,t),this.armL.position.set(-.4,.42,.12),this.armL.rotation.z=.5,this.armR=new dt(l,t),this.armR.position.set(.4,.42,.12),this.armR.rotation.z=-.5,this.group.add(this.armL,this.armR),a}drawFace(t,e,n){t.clearRect(0,0,e,e);const s=e/2,r=n==="menacing";for(const h of[-52,52])t.fillStyle="#b06a28",t.beginPath(),t.arc(s+h,s-38,26,0,Math.PI*2),t.fill(),t.fillStyle="#140a06",t.beginPath(),t.arc(s+h,s-38,21,0,Math.PI*2),t.fill(),r?(t.fillStyle="#aa1100",t.beginPath(),t.arc(s+h+4,s-34,7,0,Math.PI*2),t.fill()):(t.fillStyle="#ffffff",t.beginPath(),t.arc(s+h-7,s-45,5,0,Math.PI*2),t.fill());const o=r?96:74,a=r?46:30,l=s+42;t.fillStyle="#8e3a52",t.beginPath(),t.ellipse(s,l,o,a,0,0,Math.PI*2),t.fill(),t.fillStyle="#1c0c10",t.beginPath(),t.ellipse(s,l+4,o-10,a-12,0,0,Math.PI*2),t.fill(),t.fillStyle="#ddd2b8";const c=r?8:6;for(let h=0;h<c;h++){const u=s-o+16+h*(o*2-32)/(c-1),d=h*37%7-3;t.fillRect(u-6,l-a+8+d,12,16+h%3*3),t.fillRect(u-5,l+a-24-d,10,14+(h+1)%2*4)}}animateGait(t,e,n){const s=t*3,r=e>0?1:.15,o=Math.sin(s)*.1+Math.sin(s*.5+.7)*.06;this.group.rotation.z=o*r,this.bodyMesh.position.y=.5+Math.abs(Math.sin(s*.5))*.05*r,this.armL.rotation.x=Math.sin(s+.4)*.3*r,this.armR.rotation.x=Math.sin(s+Math.PI+.9)*.3*r;const a=this.mood==="menacing"?.26:.09;this.head.rotation.z+=(a-this.head.rotation.z)*Math.min(1,6*n),e>0&&Math.abs(Math.sin(s*.5))<.04&&n>0&&this.onGaitBeat?.("shuffle")}}class Bg{listeners=[];emit(t){for(const e of this.listeners)e(t)}subscribe(t){this.listeners.push(t)}}function kg(i,t,e,n){const s=Math.ceil(e.distanceTo(n)/.5);for(let r=1;r<s;r++){const o=r/s,a=e.x+(n.x-e.x)*o,l=e.z+(n.z-e.z)*o,c=cs(a,l),h=i.grids[t]?.[c.z]?.[c.x];if(!h||h==="wall"||h==="vent"||!To(h))return!1}return!0}function bo(i,t,e,n,s){if(s.hidden||s.floor!==n)return!1;const r=s.position.x-t.x,o=s.position.z-t.z,a=Math.hypot(r,o);let l=s.lightOn?_t.ai.visionLightOn:_t.ai.visionLightOff;if(s.crouched&&(l*=_t.ai.visionCrouchFactor),a>l)return!1;if(a>_t.ai.proximitySense){const c=Math.sin(e),h=Math.cos(e),u=r/a*c+o/a*h,d=_t.ai.coneDegrees/2*Math.PI/180;if(u<Math.cos(d))return!1}return kg(i,n,t,s.position)}function Hg(i){switch(i){case 1:return _t.ai.hearCrouch;case 2:return _t.ai.hearWalk;case 3:return _t.ai.hearSprint;default:return 0}}class Gg{lastSeenPos=null;lastSeenAt=-1/0;lastNoisePos=null;sawEnterHidingAt=null;sawEnterPassageAt=null;recordSeen(t,e){this.lastSeenPos=t.clone(),this.lastSeenAt=e}forgetWitnessed(){this.sawEnterHidingAt=null,this.sawEnterPassageAt=null}}const Qi=new Set,Vg=3;class Wg{constructor(t,e,n){this.enemy=t,this.ctx=e,this.homeFloor=n}state="patrol";memory=new Gg;passive=!1;speedFactor=1;homeFloor;follower=new Lg;stateTimer=0;repathTimer=0;now=0;searchTarget=null;searchResolved=!1;passageExit=null;forcedDestination=null;notePlayerEnteredHiding(t,e){e&&(this.memory.sawEnterHidingAt=t.clone())}notePlayerEnteredPassage(t,e,n){n&&(this.memory.sawEnterPassageAt=t.clone(),this.passageExit=e.clone())}hearNoise(t,e){this.passive||this.enemy.position.distanceTo(t)>e||(this.state==="patrol"||this.state==="loseInterest"?(this.memory.lastNoisePos=t.clone(),this.transition("investigate")):this.state==="investigate"&&(this.memory.lastNoisePos=t.clone(),this.pathTo(t)))}transition(t){this.state==="searchHiding"&&this.searchTarget&&(Qi.delete(this.searchTarget),this.searchTarget=null),this.state=t,this.stateTimer=0,this.follower.clear(),this.enemy.isChasing=t==="chase"||t==="searchHiding"||t==="followPassage"}pathTo(t,e=!1){const n=this.ctx.nav.nearestNode(this.enemy.position),s=this.ctx.nav.nearestNode(t);if(!n||!s)return!1;const r=this.ctx.nav.findPath(n,s,{allowPassages:e});return r?(this.follower.setPath(this.ctx.nav.toWaypoints(r)),!0):!1}speed(t){return t*this.speedFactor}update(t,e){this.now+=t,this.stateTimer+=t,this.repathTimer-=t;const n=!this.passive&&bo(this.ctx.house,this.enemy.position,this.enemy.group.rotation.y,this.enemy.floorIndex,e);if(n&&this.memory.recordSeen(e.position,this.now),!this.passive&&e.noiseLevel>0&&e.floor===this.enemy.floorIndex){const s=Hg(e.noiseLevel);this.enemy.position.distanceTo(e.position)<=s&&(this.state==="patrol"||this.state==="loseInterest")&&(this.memory.lastNoisePos=e.position.clone(),this.transition("investigate"))}switch(this.state){case"patrol":{if(n){this.transition("chase");break}if(this.forcedDestination&&(this.pathTo(this.forcedDestination),this.forcedDestination=null),this.follower.done){const s=this.ctx.nav.randomNodeOnFloor(this.homeFloor,this.ctx.rng);if(s){const r=we(s.x,s.z);this.pathTo(new C(r.x,Te(s.floor),r.z))}}this.follower.drive(this.enemy,this.speed(_t.ai.patrolSpeed));break}case"investigate":{if(n){this.transition("chase");break}const s=this.memory.lastNoisePos??this.memory.lastSeenPos;s&&this.follower.done&&this.stateTimer<.1&&this.pathTo(s),this.follower.drive(this.enemy,this.speed(_t.ai.investigateSpeed)),this.follower.done&&this.stateTimer>_t.ai.investigateLinger&&this.transition("loseInterest");break}case"chase":{const s=Math.hypot(e.position.x-this.enemy.position.x,e.position.z-this.enemy.position.z);if(n&&s<Vg){this.follower.clear(),this.enemy.setMoveTarget(e.position,this.speed(_t.ai.chaseSpeed));break}if(n)this.repathTimer<=0&&(this.pathTo(e.position),this.repathTimer=.4);else{if(this.memory.sawEnterHidingAt){const r=this.nearestSpot(this.memory.sawEnterHidingAt);if(r&&!Qi.has(r)){this.searchTarget=r,this.searchResolved=!1,Qi.add(r),this.transition("searchHiding"),this.pathTo(r.position);break}}if(this.memory.sawEnterPassageAt&&this.passageExit){this.transition("followPassage"),this.pathTo(this.passageExit,!0);break}if(this.now-this.memory.lastSeenAt>_t.ai.memorySeconds){if(e.hidden&&this.ctx.hiding.active){const r=this.ctx.hiding.active;if(this.enemy.position.distanceTo(r.position)<6&&!Qi.has(r)){this.searchTarget=r,this.searchResolved=!1,Qi.add(r),this.transition("searchHiding"),this.pathTo(r.position);break}}this.memory.lastNoisePos=this.memory.lastSeenPos,this.ctx.onChaseLost?.(this.enemy),this.transition("investigate"),this.memory.lastSeenPos&&this.pathTo(this.memory.lastSeenPos);break}this.repathTimer<=0&&this.memory.lastSeenPos&&(this.pathTo(this.memory.lastSeenPos),this.repathTimer=.4)}this.follower.drive(this.enemy,this.speed(_t.ai.chaseSpeed));break}case"searchHiding":{const s=this.searchTarget;if(!s){this.transition("loseInterest");break}if(this.follower.drive(this.enemy,this.speed(_t.ai.investigateSpeed)),this.enemy.position.distanceTo(s.position)<2.2&&!this.searchResolved&&this.stateTimer>.8){this.searchResolved=!0;const o=this.memory.sawEnterHidingAt!==null,a=s.occupied,l=o?1:s.enteredWithLightOff?_t.ai.searchProbLightOff:_t.ai.searchProbLightOn;a&&this.ctx.rng.chance(l)?(this.ctx.onFoundHidden(s,this.enemy),this.memory.forgetWitnessed(),this.transition("chase")):(this.memory.forgetWitnessed(),this.transition("loseInterest"))}break}case"followPassage":{this.follower.drive(this.enemy,this.speed(_t.ai.investigateSpeed)),n?(this.memory.forgetWitnessed(),this.transition("chase")):this.follower.done&&(this.memory.forgetWitnessed(),this.memory.lastNoisePos=this.passageExit,this.transition("investigate"));break}case"loseInterest":{this.enemy.setMoveTarget(null),n?this.transition("chase"):this.stateTimer>_t.ai.loseInterestSeconds&&this.transition("patrol");break}}}nearestSpot(t){let e=null,n=4;for(const s of this.ctx.hiding.all){const r=s.position.distanceTo(t);r<n&&(n=r,e=s)}return e}}class Xg{constructor(t,e,n,s,r,o,a){this.nav=e,this.rng=n;const l=a?{charles:()=>a("charles"),poo:()=>a("poo"),newYama:()=>a("newYama"),fuggie:()=>a("fuggie")}:{charles:()=>new Ng,poo:()=>new Fg,newYama:()=>new Og,fuggie:()=>new zg},c={house:t,nav:e,rng:n,...s};for(const h of t.enemySpawns){const u=l[h.enemy](),d=o(h.pos);u.position.copy(d),u.floorIndex=h.pos.floor,r.add(u.group);const f=new Wg(u,c,h.pos.floor);f.passive=!0,this.residents.push({enemy:u,brain:f}),this.migrationTimers.push(_t.ai.migrationInterval*(.6+n.next()*.8)),this.campTimers.push(0)}for(const h of t.exits)this.focusPoints.push(o(h.pos))}residents=[];graceLeft=_t.ai.gracePeriod;migrationTimers=[];campTimers=[];mercyLeft=0;keyTaken=!1;onMigrate=null;focusPoints=[];setKeyLocation(t){this.focusPoints.push(t.clone())}notifyKeyTaken(){if(!this.keyTaken){this.keyTaken=!0;for(const t of this.residents)t.brain.speedFactor=_t.ai.keyTakenSpeedFactor}}notifyNearMiss(){this.mercyLeft=_t.ai.nearMissMercy}update(t,e){if(this.graceLeft>0&&(this.graceLeft-=t,this.graceLeft<=0))for(const n of this.residents)n.brain.passive=!1;if(this.mercyLeft>0){this.mercyLeft-=t;const n=this.mercyLeft>0;for(const s of this.residents)this.graceLeft<=0&&(s.brain.passive=n)}this.residents.forEach((n,s)=>{if(n.enemy.floorIndex=Math.max(0,Math.min(3,Math.round(n.enemy.position.y/3.5))),this.migrationTimers[s]-=t,this.migrationTimers[s]<=0&&(this.migrationTimers[s]=_t.ai.migrationInterval*(.7+this.rng.next()*.6),n.brain.state==="patrol")){const o=this.rng.chance(.5)?1:-1,a=Math.max(0,Math.min(3,n.brain.homeFloor+o));if(a!==n.brain.homeFloor&&!(n.brain.passive&&a===e)){const l=n.brain.homeFloor;n.brain.homeFloor=a,this.onMigrate?.(n,l,a)}}if(this.focusPoints.some(o=>n.enemy.position.distanceTo(o)<_t.ai.antiCampRadius)&&n.brain.state==="patrol"){if(this.campTimers[s]+=t,this.campTimers[s]>_t.ai.antiCampSeconds){this.campTimers[s]=0;for(let o=0;o<6;o++){const a=this.nav.randomNodeOnFloor(n.brain.homeFloor,this.rng);if(!a)break;const l=we(a.x,a.z),c=new C(l.x,Te(a.floor),l.z);if(!this.focusPoints.some(h=>c.distanceTo(h)<_t.ai.antiCampRadius*2)){n.brain.forcedDestination=c;break}}}}else this.campTimers[s]=Math.max(0,this.campTimers[s]-t)})}}class tc{state;constructor(t){this.state=t>>>0}next(){this.state=this.state+1831565813>>>0;let t=this.state;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}randInt(t,e){return t+Math.floor(this.next()*(e-t+1))}pick(t){if(t.length===0)throw new Error("pick() on empty array");return t[this.randInt(0,t.length-1)]}shuffle(t){const e=t.slice();for(let n=e.length-1;n>0;n--){const s=this.randInt(0,n);[e[n],e[s]]=[e[s],e[n]]}return e}chance(t){return this.next()<t}}const qg={menu:{start:"playing"},playing:{openMap:"mapOpen",pause:"paused",caught:"jumpscare",win:"won"},mapOpen:{closeMap:"playing",pause:"paused",caught:"jumpscare",win:"won"},paused:{resume:"playing"},jumpscare:{gameOverShown:"gameOver"},gameOver:{retry:"playing"},won:{retry:"playing"}};class Yg{state="menu";onChange=null;transition(t){const e=qg[this.state][t];if(!e)return!1;const n=this.state;return this.state=e,this.onChange?.(e,n),!0}get simulationTicks(){return this.state==="playing"||this.state==="mapOpen"||this.state==="jumpscare"}get movementAllowed(){return this.state==="playing"}get lookAllowed(){return this.state==="playing"}}const ul=1,Kg=.12,js=i=>`${i.floor}:${i.x},${i.z}`;function dl(i,t){const e=i.grids[t.floor],n=new Set([js(t)]),s=[{x:t.x,z:t.z}],r=(o,a)=>e[a]?.[o]==="floor";for(;s.length;){const o=s.shift();for(const[a,l]of[[1,0],[-1,0],[0,1],[0,-1]]){const c=o.x+a,h=o.z+l;if(!r(c,h))continue;const u=js({floor:t.floor,x:c,z:h});n.has(u)||(n.add(u),s.push({x:c,z:h}))}}return n}function $g(i,t){const e=new Set,n=dl(i,t);for(const r of n)e.add(r);const s=i.grids[t.floor];for(const r of n){const[,o]=r.split(":"),[a,l]=o.split(",").map(Number);for(const[c,h]of[[1,0],[-1,0],[0,1],[0,-1]]){if(s[l+h]?.[a+c]!=="door")continue;const u=a+c*2,d=l+h*2;if(s[d]?.[u]==="floor")for(const f of dl(i,{floor:t.floor,x:u,z:d}))e.add(f)}}for(const r of i.stairs)for(const o of[r.lower,r.upper])for(const a of r.cells)for(const[l,c]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]])e.add(js({floor:o,x:a.x+l,z:a.z+c}));return e}function Jg(i,t,e){const n=$g(i,e),s=i.keyCandidates.filter(h=>!n.has(js(h))),r=s.length?s:i.keyCandidates.filter(h=>h.floor!==ul),o=r.length?r:i.keyCandidates,a=o.map(h=>h.floor===ul?Kg:1),l=a.reduce((h,u)=>h+u,0);let c=t.next()*l;for(let h=0;h<o.length;h++)if(c-=a[h],c<=0)return o[h];return o[o.length-1]}function Zg(i,t){const e=new tc(t),n=i.playerSpawns.length?i.playerSpawns:[i.playerSpawn],s=e.pick(n),r=Jg(i,e,s),o=e.pick(i.exits.map(a=>a.id));return{playerSpawn:s,keyLocation:r,correctExit:o}}class jg{setup;hasKey=!1;escaped=!1;triedExits=new Set;onKeyTaken=null;onWin=null;onMessage=null;constructor(t,e){this.setup=Zg(t,e)}takeKey(){this.hasKey||(this.hasKey=!0,this.onMessage?.("A ring of old keys. One of the doors out front should take these…"),this.onKeyTaken?.())}tryExit(t){return this.triedExits.add(t),this.hasKey?t!==this.setup.correctExit?(this.onMessage?.("The key doesn't fit this lock. There must be another door…"),"wrongKey"):(this.escaped=!0,this.onWin?.(),"open"):(this.onMessage?.("Locked tight. There's a keyhole…"),"locked")}}function Qg(i,t){const e=[],n=i.grids[t];for(let s=0;s<i.depth;s++)for(let r=0;r<i.width;r++){const o=n[s][r];o==="wall"||o==="vent"?e.push({kind:"wall",x:r,z:s}):o==="door"?e.push({kind:"door",x:r,z:s}):o==="stair"&&e.push({kind:"stair",x:r,z:s})}for(const s of i.hidingSpots)s.pos.floor===t&&e.push({kind:"hide",x:s.pos.x,z:s.pos.z});for(const s of i.chargingStations)s.floor===t&&e.push({kind:"station",x:s.x,z:s.z});for(const s of i.exits)s.pos.floor===t&&e.push({kind:"exit",x:s.pos.x,z:s.pos.z});return e}class t0{constructor(t,e){this.house=t,this.root=document.createElement("div"),this.root.style.cssText="position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,6,4,0.55)",this.title=document.createElement("div"),this.title.style.cssText="position:absolute;top:7%;width:100%;text-align:center;color:#d8c9a0;font:700 28px 'Trebuchet MS',serif;letter-spacing:3px;text-shadow:0 0 8px #000",this.canvas=document.createElement("canvas"),this.canvas.style.cssText="box-shadow:0 0 40px #000;border:10px solid #2a2118;border-radius:4px;transform:rotate(-0.6deg)",this.root.appendChild(this.title),this.root.appendChild(this.canvas),e.appendChild(this.root)}root;canvas;title;cache=new Map;scale=24;visible=!1;open(){this.visible=!0,this.root.style.display="flex"}close(){this.visible=!1,this.root.style.display="none"}update(t,e,n,s){if(!this.visible)return;const r=this.floorCanvas(s),o=this.scale;this.canvas.width=r.width,this.canvas.height=r.height;const a=this.canvas.getContext("2d");a.drawImage(r,0,0),this.title.textContent=`— ${Jm[s]} —`;const l=t/vt*o,c=e/vt*o,h=1+Math.sin(performance.now()/220)*.18;a.fillStyle="#b03a2e",a.beginPath(),a.arc(l,c,5.5*h,0,Math.PI*2),a.fill(),a.strokeStyle="#b03a2e",a.lineWidth=3,a.beginPath(),a.moveTo(l,c),a.lineTo(l-Math.sin(n)*14,c-Math.cos(n)*14),a.stroke()}floorCanvas(t){const e=this.cache.get(t);if(e)return e;const n=this.scale,s=document.createElement("canvas");s.width=this.house.width*n,s.height=this.house.depth*n;const r=s.getContext("2d");r.fillStyle="#cdbd97",r.fillRect(0,0,s.width,s.height);for(let o=0;o<320;o++)r.globalAlpha=.04,r.fillStyle="#8a7a55",r.beginPath(),r.arc(Math.random()*s.width,Math.random()*s.height,Math.random()*9,0,7),r.fill();r.globalAlpha=1;for(const o of Qg(this.house,t)){const a=o.x*n,l=o.z*n;switch(o.kind){case"wall":r.fillStyle="#3a2f22",r.fillRect(a+1,l+1,n-2,n-2);break;case"door":r.fillStyle="#a89468",r.fillRect(a+3,l+3,n-6,n-6);break;case"stair":{r.strokeStyle="#5a4a33",r.lineWidth=2;for(let c=1;c<=3;c++)r.beginPath(),r.moveTo(a+3,l+c*n/4),r.lineTo(a+n-3,l+c*n/4),r.stroke();break}case"hide":{r.strokeStyle="#27504f",r.lineWidth=2.5,r.strokeRect(a+4,l+4,n-8,n-8),r.beginPath(),r.moveTo(a+n/2,l+4),r.lineTo(a+n/2,l+n-4),r.stroke();break}case"station":{r.strokeStyle="#2e6b34",r.lineWidth=2.5,r.beginPath(),r.arc(a+n/2,l+n/2,n/3.2,0,Math.PI*2),r.stroke(),r.beginPath(),r.moveTo(a+n/2-3,l+n/2-2),r.lineTo(a+n/2-3,l+n/2+4),r.moveTo(a+n/2+3,l+n/2-2),r.lineTo(a+n/2+3,l+n/2+4),r.stroke();break}case"exit":{r.fillStyle="#7a2a20",r.font=`700 ${Math.round(n*.8)}px serif`,r.textAlign="center",r.textBaseline="middle",r.fillText("⌂",a+n/2,l+n/2+1);break}}}return this.cache.set(t,s),s}}class e0{root;batteryFill;staminaFill;keyBadge;prompt;chargingBadge;toast;vignette;toastTimer=null;constructor(t){this.root=document.createElement("div"),this.root.style.cssText="position:absolute;inset:0;display:none";const e=document.createElement("div");e.style.cssText="position:absolute;bottom:22px;left:22px;width:170px;height:16px;border:2px solid #6b6149;border-radius:3px;background:#161310cc;padding:2px",this.batteryFill=document.createElement("div"),this.batteryFill.style.cssText="height:100%;width:100%;background:#9aa45e;border-radius:1px;transition:background .4s",e.appendChild(this.batteryFill);const n=document.createElement("div");n.textContent="🔦",n.style.cssText="position:absolute;bottom:18px;left:198px;font-size:18px";const s=document.createElement("div");s.style.cssText="position:absolute;bottom:46px;left:22px;width:170px;height:10px;border:2px solid #5a5f49;border-radius:3px;background:#161310cc;padding:2px",this.staminaFill=document.createElement("div"),this.staminaFill.style.cssText="height:100%;width:100%;background:#6fa8c4;border-radius:1px;transition:background .3s",s.appendChild(this.staminaFill);const r=document.createElement("div");r.textContent="👟",r.style.cssText="position:absolute;bottom:42px;left:198px;font-size:15px",this.keyBadge=document.createElement("div"),this.keyBadge.textContent="🗝 the keys",this.keyBadge.style.cssText="position:absolute;bottom:74px;left:22px;color:#d8c372;display:none;font:600 15px 'Trebuchet MS';text-shadow:0 0 6px #000",this.prompt=document.createElement("div"),this.prompt.style.cssText="position:absolute;bottom:18%;width:100%;text-align:center;color:#e8dcc0;font:600 17px 'Trebuchet MS';text-shadow:0 1px 4px #000;display:none",this.chargingBadge=document.createElement("div"),this.chargingBadge.textContent="⚡ charging… (any key to grab the light and run)",this.chargingBadge.style.cssText="position:absolute;bottom:26%;width:100%;text-align:center;color:#9fdf8a;font:600 15px 'Trebuchet MS';text-shadow:0 1px 4px #000;display:none",this.toast=document.createElement("div"),this.toast.style.cssText="position:absolute;top:14%;width:100%;text-align:center;color:#d9cfae;font:italic 600 17px Georgia;text-shadow:0 1px 6px #000;opacity:0;transition:opacity .5s",this.vignette=document.createElement("div"),this.vignette.style.cssText="position:absolute;inset:0;pointer-events:none;opacity:0;background:radial-gradient(ellipse at center, transparent 46%, rgba(60,0,0,0.55) 100%)",this.root.append(this.vignette,e,n,s,r,this.keyBadge,this.prompt,this.chargingBadge,this.toast),t.appendChild(this.root)}show(t){this.root.style.display=t?"block":"none"}setBattery(t,e){this.batteryFill.style.width=`${(t*100).toFixed(1)}%`,this.batteryFill.style.background=e?"#b0402e":"#9aa45e"}setStamina(t,e){this.staminaFill.style.width=`${(t*100).toFixed(1)}%`,this.staminaFill.style.background=e?"#9a5550":"#6fa8c4"}setHasKey(t){this.keyBadge.style.display=t?"block":"none"}setPrompt(t){t?(this.prompt.textContent=`[E] ${t}`,this.prompt.style.display="block"):this.prompt.style.display="none"}setCharging(t){this.chargingBadge.style.display=t?"block":"none"}showMessage(t){this.toast.textContent=t,this.toast.style.opacity="1",this.toastTimer&&window.clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toast.style.opacity="0",3600)}setThreat(t){const e=Math.max(0,Math.min(1,1-t/10));this.vignette.style.opacity=(e*.9).toFixed(2)}}const n0={charles:"LITTLE TIMMY",poo:"POU",newYama:"NEW YAMA",fuggie:"FUGGIE"},fl=`
  <table style="margin:0 auto;text-align:left;border-spacing:14px 6px;color:#cfc3a2">
    <tr><td><b>Mouse</b></td><td>look around</td></tr>
    <tr><td><b>W A S D</b></td><td>move</td></tr>
    <tr><td><b>Shift</b></td><td>run (loud!)</td></tr>
    <tr><td><b>C</b></td><td>crouch / crawl (quiet, fits in vents)</td></tr>
    <tr><td><b>F</b></td><td>flashlight</td></tr>
    <tr><td><b>E</b></td><td>interact — hide, charge, grab, try doors</td></tr>
    <tr><td><b>M / Tab</b></td><td>the map (the house does NOT wait for you)</td></tr>
    <tr><td><b>Esc</b></td><td>pause</td></tr>
  </table>
  <p style="max-width:520px;margin:18px auto;color:#a99c7c;line-height:1.5">
    Find the <b style="color:#d8c372">keys</b> hidden somewhere in the house.
    Only <b>one</b> of the three front doors matches them.
    The flashlight keeps the stuffies honest — but the battery won't last.
    Charging stations glow green. Hide in the dark. Listen.
  </p>`;class i0{root;onStart=null;onResume=null;onRetry=null;onFirstInteraction=null;interacted=!1;constructor(t){this.root=document.createElement("div"),this.root.className="clickable",this.root.style.cssText="position:absolute;inset:0;display:none;align-items:center;justify-content:center;text-align:center;background:rgba(2,2,5,0.88);color:#e8dcc0;font-family:'Trebuchet MS',Verdana,sans-serif",t.appendChild(this.root),this.root.addEventListener("click",()=>{this.interacted||(this.interacted=!0,this.onFirstInteraction?.())})}hide(){this.root.style.display="none"}screen(t){this.root.innerHTML=`<div>${t}</div>`,this.root.style.display="flex"}button(t,e){return`<button id="${e}" style="margin:10px;padding:12px 34px;font:700 18px 'Trebuchet MS';background:#3a2f22;color:#e8dcc0;border:2px solid #6b6149;border-radius:6px;cursor:pointer">${t}</button>`}showTitle(){this.screen(`
      <h1 style="font-size:64px;letter-spacing:6px;margin:0;color:#d8c9a0;
        text-shadow:0 0 18px #5a1010,0 0 4px #000">STUFFY FRIGHTS</h1>
      <p style="color:#8a7d65;letter-spacing:2px;margin-top:6px">the stuffed animals are awake</p>
      <div style="margin-top:36px">${this.button("PLAY","btn-play")}<br>${this.button("HOW TO PLAY","btn-how")}</div>
    `),this.root.querySelector("#btn-play").addEventListener("click",()=>this.onStart?.()),this.root.querySelector("#btn-how").addEventListener("click",()=>this.showHowTo())}showHowTo(){this.screen(`
      <h2 style="letter-spacing:3px;color:#d8c9a0">HOW TO SURVIVE</h2>
      ${fl}
      <div>${this.button("GOT IT — PLAY","btn-play")}</div>
    `),this.root.querySelector("#btn-play").addEventListener("click",()=>this.onStart?.())}showPause(){this.screen(`
      <h2 style="letter-spacing:3px;color:#d8c9a0">PAUSED</h2>
      <p style="color:#8a7d65">the stuffies are waiting…</p>
      ${fl}
      <div>${this.button("KEEP PLAYING","btn-resume")}</div>
    `),this.root.querySelector("#btn-resume").addEventListener("click",()=>this.onResume?.())}showGameOver(t){const e=n0[t]??"SOMETHING SOFT";this.screen(`
      <h1 style="font-size:46px;letter-spacing:4px;color:#c0392b;text-shadow:0 0 14px #400">
        ${e} GOT YOU</h1>
      <p style="color:#8a7d65;max-width:440px;margin:14px auto">
        Squeezed in a very firm hug until everything went dark.<br>
        The house resets. The keys move. Try again?</p>
      <div>${this.button("TRY AGAIN","btn-retry")}</div>
    `),this.root.querySelector("#btn-retry").addEventListener("click",()=>this.onRetry?.())}showWin(t){const e=Math.floor(t.seconds/60),n=Math.round(t.seconds%60);this.screen(`
      <h1 style="font-size:52px;letter-spacing:5px;color:#7fbf6a;text-shadow:0 0 14px #042">
        YOU ESCAPED!</h1>
      <p style="color:#a99c7c;max-width:460px;margin:14px auto;line-height:1.6">
        Out the front door and into the night, keys jingling.<br>
        Behind you, four fuzzy silhouettes crowd the doorway… waving?<br><br>
        <b>Time:</b> ${e}m ${n}s &nbsp;·&nbsp; <b>Doors tried:</b> ${t.exitsTried} of 3</p>
      <div>${this.button("PLAY AGAIN","btn-retry")}</div>
    `),this.root.querySelector("#btn-retry").addEventListener("click",()=>this.onRetry?.())}}class s0{ctx=null;master;sfxBus;ambientBus;musicBus;heartbeatTimer=0;heartbeatInterval=1.2;chaseGain=null;creakTimer=4;listenerPos=new C;listenerYaw=0;unlock(){this.ctx||(this.ctx=new AudioContext,this.master=this.ctx.createDynamicsCompressor(),this.master.threshold.value=-18,this.master.ratio.value=14,this.master.connect(this.ctx.destination),this.ambientBus=this.ctx.createGain(),this.ambientBus.gain.value=.5,this.ambientBus.connect(this.master),this.sfxBus=this.ctx.createGain(),this.sfxBus.gain.value=.9,this.sfxBus.connect(this.master),this.musicBus=this.ctx.createGain(),this.musicBus.gain.value=.55,this.musicBus.connect(this.master),this.startAmbientBed(),this.startChaseLayer(),this.startMusicBed())}get ready(){return this.ctx!==null}setListener(t,e){this.listenerPos.copy(t),this.listenerYaw=e}spatial(t,e=18){if(!this.ctx)return null;const n=this.listenerPos.distanceTo(t);if(n>e)return null;const s=t.x-this.listenerPos.x,r=t.z-this.listenerPos.z,o=s*Math.cos(this.listenerYaw)-r*Math.sin(this.listenerYaw),a=this.ctx.createStereoPanner();a.pan.value=Math.max(-1,Math.min(1,o/8));const l=this.ctx.createGain();return l.gain.value=Math.pow(1-n/e,1.6),l.connect(a),a.connect(this.sfxBus),{pan:a,gain:l}}noiseBuffer(t){const e=this.ctx,n=e.createBuffer(1,Math.ceil(e.sampleRate*t),e.sampleRate),s=n.getChannelData(0);for(let r=0;r<s.length;r++)s[r]=Math.random()*2-1;return n}thump(t,e,n,s,r="lowpass"){const o=this.ctx,a=o.createBufferSource();a.buffer=this.noiseBuffer(n);const l=o.createBiquadFilter();l.type=r,l.frequency.value=e;const c=o.createGain();c.gain.setValueAtTime(s,o.currentTime),c.gain.exponentialRampToValueAtTime(.001,o.currentTime+n),a.connect(l).connect(c).connect(t),a.start()}tone(t,e,n,s,r="sine",o){const a=this.ctx,l=a.createOscillator();l.type=r,l.frequency.setValueAtTime(e,a.currentTime),o&&l.frequency.exponentialRampToValueAtTime(o,a.currentTime+n);const c=a.createGain();c.gain.setValueAtTime(s,a.currentTime),c.gain.exponentialRampToValueAtTime(.001,a.currentTime+n),l.connect(c).connect(t),l.start(),l.stop(a.currentTime+n+.05)}startAmbientBed(){const t=this.ctx,e=t.createBufferSource();e.buffer=this.noiseBuffer(4),e.loop=!0;const n=t.createBiquadFilter();n.type="lowpass",n.frequency.value=110;const s=t.createGain();s.gain.value=.5,e.connect(n).connect(s).connect(this.ambientBus),e.start();const r=t.createBufferSource();r.buffer=this.noiseBuffer(6),r.loop=!0;const o=t.createBiquadFilter();o.type="bandpass",o.frequency.value=480,o.Q.value=.6;const a=t.createGain();a.gain.value=.05;const l=t.createOscillator();l.frequency.value=.07;const c=t.createGain();c.gain.value=.045,l.connect(c).connect(a.gain),r.connect(o).connect(a).connect(this.ambientBus),r.start(),l.start()}startChaseLayer(){const t=this.ctx;this.chaseGain=t.createGain(),this.chaseGain.gain.value=0,this.chaseGain.connect(this.musicBus);for(const e of[98,116.5]){const n=t.createOscillator();n.type="sawtooth",n.frequency.value=e;const s=t.createGain();s.gain.value=.05;const r=t.createOscillator();r.frequency.value=5.2;const o=t.createGain();o.gain.value=.03,r.connect(o).connect(s.gain),n.connect(s).connect(this.chaseGain),n.start(),r.start()}}startMusicBed(){const t=this.ctx,e=t.createGain();e.gain.value=.16,e.connect(this.musicBus);for(const l of[55,58.27,82.4]){const c=t.createOscillator();c.type="triangle",c.frequency.value=l;const h=t.createGain();h.gain.value=.09;const u=t.createOscillator();u.frequency.value=.045+Math.random()*.03;const d=t.createGain();d.gain.value=.05,u.connect(d).connect(h.gain),c.connect(h).connect(e),c.start(),u.start()}const n=t.createOscillator();n.type="sine",n.frequency.value=660;const s=t.createGain();s.gain.value=.015;const r=t.createOscillator();r.frequency.value=.07;const o=t.createGain();o.gain.value=40,r.connect(o).connect(n.frequency);const a=t.createBiquadFilter();a.type="highpass",a.frequency.value=400,n.connect(a).connect(s).connect(e),n.start(),r.start()}update(t,e,n){if(!this.ctx)return;e<12&&(this.heartbeatInterval=.45+e/12*.9,this.heartbeatTimer-=t,this.heartbeatTimer<=0&&(this.heartbeatTimer=this.heartbeatInterval,this.thump(this.musicBus,70,.13,.5),setTimeout(()=>this.ctx&&this.thump(this.musicBus,60,.11,.32),140)));const s=n?.85:0,r=this.chaseGain.gain;r.value+=(s-r.value)*Math.min(1,t*2.5),this.creakTimer-=t,this.creakTimer<=0&&(this.creakTimer=6+Math.random()*14,this.tone(this.ambientBus,180+Math.random()*160,.9,.04,"sawtooth",120))}footstep(t){if(!this.ctx||t===0)return;const e=t===3?.34:t===2?.2:.08;this.thump(this.sfxBus,320,.09,e)}gaitBeat(t,e){const n=this.spatial(e);if(n)switch(t){case"knuckle":this.thump(n.gain,140,.16,.8),setTimeout(()=>{const s=this.spatial(e);s&&this.thump(s.gain,120,.12,.5)},110);break;case"fwump":this.thump(n.gain,240,.18,.65),this.tone(n.gain,130,.14,.18,"sine",70);break;case"hoof":this.thump(n.gain,900,.05,.5,"bandpass");break;case"shuffle":this.thump(n.gain,1600,.12,.3,"highpass"),Math.random()<.12&&this.giggle(e);break}}giggle(t){if(!this.spatial(t)||!this.ctx)return;let n=620;for(let s=0;s<4;s++){const r=s*95;setTimeout(()=>{const o=this.spatial(t);o&&this.tone(o.gain,n,.09,.3,"square",n*.82)},r),n*=.86}}sting(){if(!this.ctx)return;const t=this.ctx;this.thump(this.sfxBus,4200,.45,1.2,"highpass");for(const o of[990,1046,1318])this.tone(this.sfxBus,o,.9,.5,"sawtooth",o*.18);this.tone(this.sfxBus,120,.7,.8,"sine",42),this.thump(this.sfxBus,90,.6,.7);const e=t.createOscillator();e.type="sawtooth",e.frequency.setValueAtTime(2300,t.currentTime),e.frequency.exponentialRampToValueAtTime(700,t.currentTime+1.1);const n=t.createGain();n.gain.setValueAtTime(1e-4,t.currentTime),n.gain.exponentialRampToValueAtTime(.28,t.currentTime+.04),n.gain.exponentialRampToValueAtTime(1e-4,t.currentTime+1.2);const s=t.createOscillator();s.frequency.value=18;const r=t.createGain();r.gain.value=.15,s.connect(r).connect(n.gain),e.connect(n).connect(this.sfxBus),e.start(),e.stop(t.currentTime+1.25),s.start(),s.stop(t.currentTime+1.25)}grateCreak(t){const e=this.spatial(t);e&&this.tone(e.gain,320,.8,.5,"sawtooth",140)}doorRattle(t){if(this.spatial(t))for(let n=0;n<3;n++)setTimeout(()=>{const s=this.spatial(t);s&&this.thump(s.gain,700,.06,.5,"bandpass")},n*90)}wrongKeyClunk(t){const e=this.spatial(t);e&&(this.thump(e.gain,420,.1,.55,"bandpass"),this.tone(e.gain,180,.25,.3,"triangle",120))}keyJingle(t){if(this.spatial(t))for(let n=0;n<5;n++)setTimeout(()=>{const s=this.spatial(t);s&&this.tone(s.gain,2400+Math.random()*1800,.12,.22,"triangle")},n*70)}chargeHum(t){const e=this.spatial(t,10);e&&(this.tone(e.gain,96,1.1,.12,"sine"),this.tone(e.gain,192,1.1,.05,"sine"))}doorOpenWin(){this.ctx&&(this.tone(this.musicBus,392,1.6,.4,"triangle"),setTimeout(()=>this.ctx&&this.tone(this.musicBus,494,1.4,.4,"triangle"),220),setTimeout(()=>this.ctx&&this.tone(this.musicBus,587,1.8,.45,"triangle"),440))}hideRustle(){this.ctx&&this.thump(this.sfxBus,1100,.25,.3,"highpass")}migrationCue(t){if(!this.ctx)return;const e=t?this.spatial(t,30)?.gain??this.ambientBus:this.ambientBus;this.tone(e,220,1.3,.16,"sawtooth",90),this.tone(e,150,1.1,.1,"triangle",70),setTimeout(()=>{this.ctx&&this.thump(this.ambientBus,90,.22,.18)},420)}}const Ao=document.getElementById("game"),hs=document.getElementById("ui"),te=new Wm(Ao),me=new Xm;me.attach(Ao);te.scene.background=new Xt(_t.visibility.fogColor);te.scene.fog=new Mo(_t.visibility.fogColor,_t.visibility.fogDensityByFloor[1]);te.renderer.toneMappingExposure=_t.visibility.toneExposure;const pe=xg.build(De);te.scene.add(pe.group);const fo=new jl(_t.visibility.ambientColor,_t.visibility.ambientIntensityByFloor[1]);te.scene.add(fo);const po=new zm(3160658,1314828,_t.visibility.hemisphereIntensityByFloor[1]);te.scene.add(po);const Pe=new $m(te.scene),on=new Km,at=new qm(te.camera,me,pe.colliders),no=pe.markerWorld(De.playerSpawn);at.teleport(no.x,no.y,no.z,Math.PI);const ge=new yg(at,on,De.hidingSpots.map(i=>({def:i,worldPos:pe.markerWorld(i.pos)}))),Gi=new Eg(De,pe.colliders,at,on,pe.group);ge.isLightOn=()=>Pe.isOn;ge.forceLightOff=()=>Pe.setOn(!1);Gi.isLightOn=()=>Pe.isOn;const $e=new Ag,gn=new Cg($e,at,me,()=>Pe.setOn(!1)),r0=new tc(Math.random()*4294967295>>>0),ec=new Pg(De,pe.solidCells),qi=new Bg,be=new Rg,Le=new Xg(De,ec,r0,{hiding:ge,onFoundHidden:(i,t)=>{if(i.kind==="closet"){const e=cs(i.position.x,i.position.z);pe.openCloset({floor:pe.floorIndexOfY(i.position.y),x:e.x,z:e.z})}ge.exit(),qi.emit({position:i.position,floor:at.floorIndex,radius:8}),t.catchEnabled=!0},onChaseLost:()=>Le.notifyNearMiss()},te.scene,i=>pe.markerWorld(i)),es=Le.residents.map(i=>i.enemy);Le.onMigrate=i=>Ie.migrationCue(i.enemy.position.clone());function nc(i){return{position:i,floor:at.floorIndex,lightOn:Pe.isOn,crouched:at.isCrouched,noiseLevel:at.noiseLevel,hidden:!1}}ge.onEnter=i=>{Ie.hideRustle();for(const t of Le.residents){const e=bo(De,t.enemy.position,t.enemy.group.rotation.y,t.enemy.floorIndex,nc(i.position));t.brain.notePlayerEnteredHiding(i.position,e)}};ge.onExit=i=>{Ie.hideRustle(),qi.emit({position:i.position,floor:at.floorIndex,radius:4})};Gi.onPlayerEnter=i=>{const t=i;let e,n;if(t.chute)e=pe.markerWorld(t.chute.from),n=pe.markerWorld(t.chute.to);else if(t.vent){const s=t.vent.cells[0];e=pe.markerWorld({floor:t.vent.floor,x:s.x,z:s.z}),n=e.clone()}else return;for(const s of Le.residents){const r=bo(De,s.enemy.position,s.enemy.group.rotation.y,s.enemy.floorIndex,nc(e));s.brain.notePlayerEnteredPassage(e,n,r)}};Gi.onOpen=()=>{Ie.grateCreak(at.position),qi.emit({position:at.position.clone(),floor:at.floorIndex,radius:7})};gn.onHumTick=i=>{Ie.chargeHum(i.position),qi.emit({position:i.position.clone(),floor:i.cell.floor,radius:_t.ai.hearChargingHum})};qi.subscribe(i=>{for(const t of Le.residents)t.enemy.floorIndex===i.floor&&t.brain.hearNoise(i.position,i.radius)});const ne=new Yg,o0=Math.random()*4294967295>>>0,Ze=new jg(De,o0),io=pe.markerWorld(Ze.setup.playerSpawn);at.teleport(io.x,io.y,io.z,Math.PI);const us=new bg;te.scene.add(us.group);const ar=pe.markerWorld(Ze.setup.keyLocation);us.showAt(ar);Le.setKeyLocation(ar);const He=new e0(hs),je=new i0(hs),Rn=new t0(De,hs),Ie=new s0;on.add({position:ar.clone().add(new C(0,.5,0)),radius:1.9,label:"Take the keys",enabled:()=>!Ze.hasKey,onInteract:()=>{Ze.takeKey(),us.hide(),Ie.keyJingle(at.position),He.setHasKey(!0),Le.notifyKeyTaken()}});const pl=De.exits.map(i=>{const t=new Tg(i,De);return t.tryOpen=()=>{const e=Ze.tryExit(i.id);return e==="locked"?Ie.doorRattle(t.position):e==="wrongKey"?Ie.wrongKeyClunk(t.position):Ie.doorOpenWin(),e},t.register(on),te.scene.add(t.group),t}),ic=De.chargingStations.map(i=>{const t=pe.markerWorld(i),e=De.grids[i.floor];let n=new C(0,0,0);for(const[r,o]of[[1,0],[-1,0],[0,1],[0,-1]])if(e[i.z+o]?.[i.x+r]==="wall"){n=new C(r,0,o);break}const s=new wg(i,t,n);return s.onPlugIn=()=>gn.plugIn(s),s.register(on),te.scene.add(s.group),s}),lr=document.createElement("div");lr.style.cssText="position:absolute;inset:0;background:radial-gradient(ellipse at center,#7a0000 0%,#3a0000 100%);opacity:0;pointer-events:none";hs.appendChild(lr);const cr=document.createElement("div");cr.style.cssText="position:absolute;inset:0;background:#000;opacity:0;pointer-events:none";hs.appendChild(cr);be.onRedFade=i=>lr.style.opacity=String(i*.85);be.onBlackout=i=>cr.style.opacity=String(i);be.onSting=()=>Ie.sting();be.onGameOver=i=>{ne.transition("gameOverShown"),lr.style.opacity="0",cr.style.opacity="0",je.showGameOver(i),me.exitPointerLock()};for(const i of es)i.onCatch=()=>{ne.transition("caught")&&(Rn.close(),be.trigger(i,te.camera))},i.onGaitBeat=t=>Ie.gaitBeat(t,i.position);let sc=0;Ze.onMessage=i=>He.showMessage(i);Ze.onWin=()=>{ne.transition("win"),He.show(!1),window.setTimeout(()=>{je.showWin({seconds:sc,exitsTried:Ze.triedExits.size}),me.exitPointerLock()},1400)};$e.onChange=i=>He.setBattery(i,$e.isLow);$e.onLowWarning=()=>He.showMessage("The flashlight is dying…");gn.onPlugChange=i=>He.setCharging(i);on.onPromptChange=i=>He.setPrompt(i);je.onFirstInteraction=()=>Ie.unlock();je.onStart=()=>{ne.transition("start")&&(je.hide(),He.show(!0),He.setBattery($e.level,$e.isLow),He.setStamina(at.stamina,at.staminaLocked),me.requestPointerLock())};je.onResume=()=>{ne.transition("resume")&&(je.hide(),me.requestPointerLock())};je.onRetry=()=>window.location.reload();me.onPointerLockLost=()=>{(ne.state==="playing"||ne.state==="mapOpen")&&(Rn.close(),ne.transition("pause")&&je.showPause())};Ao.addEventListener("click",()=>{(ne.state==="playing"||ne.state==="mapOpen")&&me.requestPointerLock()});je.showTitle();let so=0;const ml=new C().copy(at.position);te.addUpdatable({update(i){if(!ne.simulationTicks){me.endStep();return}sc+=i,at.movementLocked=!ne.movementAllowed||ge.active!==null||gn.isCharging||be.running,at.lookLocked=!ne.lookAllowed||be.running,at.update(i),at.floorIndex=pe.floorIndexOfY(at.position.y);const t=cs(at.position.x,at.position.z),e=De.grids[at.floorIndex]?.[t.z]?.[t.x],n=ge.active!==null&&(ge.active.kind==="underBed"||ge.active.kind==="cabinet");at.forceCrouch=e==="vent"||n,Gi.update(),on.update(at.position,at.viewDir()),ne.state==="playing"?(me.justPressed("KeyE")&&!gn.isCharging&&(ge.exit()||on.interact()),me.justPressed("KeyF")&&ge.active===null&&!gn.isCharging&&($e.canLight()||Pe.isOn)&&Pe.toggle(),(me.justPressed("KeyM")||me.justPressed("Tab"))&&ne.transition("openMap")&&Rn.open()):ne.state==="mapOpen"&&(me.justPressed("KeyM")||me.justPressed("Tab")||me.justPressed("KeyE"))&&ne.transition("closeMap")&&Rn.close(),so+=at.position.distanceTo(ml),ml.copy(at.position),so>.85&&(so=0,Ie.footstep(at.noiseLevel));const s=te.scene.fog;s&&(s.density=_t.visibility.fogDensityByFloor[at.floorIndex]);const r=at.floorIndex,o=_t.visibility.ambientIntensityByFloor[r],a=_t.visibility.hemisphereIntensityByFloor[r];fo.intensity+=(o-fo.intensity)*Math.min(1,3*i),po.intensity+=(a-po.intensity)*Math.min(1,3*i);const l=ge.active===null&&!be.running,c={position:at.position,floor:at.floorIndex,lightOn:Pe.isOn,crouched:at.isCrouched,noiseLevel:at.noiseLevel,hidden:ge.active!==null};Le.update(i,at.floorIndex);let h=1/0,u=!1;for(const d of Le.residents)d.brain.update(i,c),d.enemy.update(i,at.position,l),d.enemy.floorIndex===at.floorIndex&&(h=Math.min(h,d.enemy.position.distanceTo(at.position))),u||=d.brain.state==="chase";be.update(i,te.camera),gn.update(i),$e.update(i,Pe.isOn),Pe.setLevel($e.level),Pe.setFlickering($e.isLow&&!$e.isEmpty),He.setStamina(at.stamina,at.staminaLocked),He.setThreat(be.running?0:h),Ie.setListener(at.position,at.yaw),Ie.update(i,h,u),Rn.visible&&Rn.update(at.position.x,at.position.z,at.yaw,at.floorIndex),me.endStep()}});te.onFrame=i=>{Pe.update(i,te.camera),pe.updateFixtures(i);for(const t of ic)t.updateVisual(i);us.updateVisual(i)};te.start();{const i=new URLSearchParams(location.search);["pose","warp","scare","report","showcase","scenario"].some(s=>i.has(s))&&ne.state==="menu"&&(ne.transition("start"),je.hide(),He.show(!0));const e=i.get("pose");if(e){const[s,r,o,a="0",l="0"]=e.split(",");at.teleport(Number(s),Number(r),Number(o),Number(a)),at.pitch=Number(l)}if(i.get("light")==="1"&&Pe.setOn(!0),i.get("mood")==="menacing")for(const s of es)s.isChasing=!0;const n=Number(i.get("warp")??"0");if(n>0){const s={position:at.position,floor:at.floorIndex,lightOn:!1,crouched:!1,noiseLevel:0,hidden:!1};for(let r=0;r<n*60;r++){Le.update(1/60,at.floorIndex);for(const o of Le.residents)o.brain.update(1/60,s),o.enemy.update(1/60,at.position,!1)}}if(e&&(at.update(1/60),Pe.update(10,te.camera)),i.get("scare")){const s=es.find(o=>o.id===i.get("scare"))??es[3];at.update(1/60),be.trigger(s,te.camera);const r=_t.enemy.jumpscareTurn+_t.enemy.jumpscareLunge*.55;for(let o=0;o<Math.round(r*60);o++)be.update(1/60,te.camera);te.simulationRunning=!1}if(i.get("map")==="1"&&ne.transition("openMap")&&(Rn.open(),Rn.update(at.position.x,at.position.z,at.yaw,at.floorIndex)),i.get("report")==="1"&&(document.title=JSON.stringify(Le.residents.map(s=>({id:s.enemy.id,s:s.brain.state,f:s.enemy.floorIndex,x:Math.round(s.enemy.position.x*10)/10,z:Math.round(s.enemy.position.z*10)/10})))),i.get("showcase")==="1"){te.scene.add(new jl(16777215,2.2));const s=new Vm(16773856,2.5);s.position.set(8,10,30),te.scene.add(s),te.scene.fog=null}if(i.get("scenario")){const s=(a=!1)=>{at.movementLocked=!ne.movementAllowed||ge.active!==null||gn.isCharging||be.running,at.update(.016666666666666666),at.floorIndex=pe.floorIndexOfY(at.position.y),Gi.update(),on.update(at.position,at.viewDir()),a&&!gn.isCharging&&(ge.exit()||on.interact());const l={position:at.position,floor:at.floorIndex,lightOn:Pe.isOn,crouched:at.isCrouched,noiseLevel:at.noiseLevel,hidden:ge.active!==null};for(const c of Le.residents)c.brain.update(.016666666666666666,l),c.enemy.update(.016666666666666666,at.position,ge.active===null&&!be.running);be.update(.016666666666666666,te.camera)},r=a=>at.teleport(a.x,a.y,a.z,0),o=[];if(i.get("scenario")==="win"){r(ar),s(),s(!0),o.push(`key:${Ze.hasKey}`);for(const a of pl){if(ne.state!=="playing")break;r(a.position),s(),s(!0),o.push(`${a.def.id}:${Ze.triedExits.has(a.def.id)?"tried":"missed"}`)}o.push(`state:${ne.state}`,`escaped:${Ze.escaped}`)}else if(i.get("scenario")==="death"){const a=Le.residents.find(l=>l.enemy.id==="newYama");a.brain.passive=!1,r(a.enemy.position.clone().add(new C(.5,0,0)));for(let l=0;l<600&&ne.state!=="gameOver";l++)s();o.push(`state:${ne.state}`,`scare:${be.phase}`)}document.title=o.join(" ")}window.__game={player:at,engine:te,house:De,world:pe,hiding:ge,passages:Gi,interactions:on,input:me,stations:ic,exitDoors:pl,keyProp:us,flashlight:Pe,battery:$e,charging:gn,enemies:es,jumpscare:be,director:Le,nav:ec,noiseBus:qi,gs:ne,objectives:Ze,map:Rn,hud:He,menus:je,audio:Ie}}
