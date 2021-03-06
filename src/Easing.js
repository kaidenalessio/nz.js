/* ============================================================
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 * https://raw.github.com/danro/jquery-easing/master/LICENSE
 * ======================================================== */

// with modifications to remove duration
// t: normalized time, b: beginning value, c: change in value
NZ.Easing = {};
NZ.Easing.QuadEaseIn = (t, b, c) => c*t*t+b;
NZ.Easing.QuadEaseOut = (t, b, c) => -c*t*(t-2)+b;
NZ.Easing.QuadEaseInOut = (t, b, c) => (t*=2)<1?c*0.5*t*t+b:-c*0.5*(--t*(t-2)-1)+b;
NZ.Easing.CubicEaseIn = (t, b, c) => c*t*t*t+b;
NZ.Easing.CubicEaseOut = (t, b, c) => c*(--t*t*t+1)+b;
NZ.Easing.CubicEaseInOut = (t, b, c) => (t*=2)<1?c*0.5*t*t*t+b:c*0.5*((t-=2)*t*t+2)+b;
NZ.Easing.QuartEaseIn = (t, b, c) => c*t*t*t*t+b;
NZ.Easing.QuartEaseOut = (t, b, c) => -c*(--t*t*t*t-1)+b;
NZ.Easing.QuartEaseInOut = (t, b, c) => (t*=2)<1?c*0.5*t*t*t*t+b:-c*0.5*((t-=2)*t*t*t-2)+b;
NZ.Easing.QuintEaseIn = (t, b, c) => c*t*t*t*t*t+b;
NZ.Easing.QuintEaseOut = (t, b, c) => c*(--t*t*t*t*t+1)+b;
NZ.Easing.QuintEaseInOut = (t, b, c) => (t*=2)<1?c*0.5*t*t*t*t*t+b:c*0.5*((t-=2)*t*t*t*t+2)+b;
NZ.Easing.SineEaseIn = (t, b, c) => -c*Math.cos(t*Math.PI*0.5)+c+b;
NZ.Easing.SineEaseOut = (t, b, c) => c*Math.sin(t*Math.PI*0.5)+b;
NZ.Easing.SineEaseInOut = (t, b, c) => -c*0.5*(Math.cos(t*Math.PI)-1)+b;
NZ.Easing.ExpoEaseIn = (t, b, c) => t===0?b:c*Math.pow(2,10*(t-1))+b;
NZ.Easing.ExpoEaseOut = (t, b, c) => t===1?b+c:c*(-Math.pow(2,-10*t)+1)+b;
NZ.Easing.ExpoEaseInOut = (t, b, c) => t===0?b:t===1?b+c:(t*=2)<1?c*0.5*Math.pow(2,10*(t-1))+b:c*0.5*(-Math.pow(2,-10*--t)+2)+b;
NZ.Easing.CircEaseIn = (t, b, c) => -c*(Math.sqrt(1-t*t)-1)+b;
NZ.Easing.CircEaseOut = (t, b, c) => c*Math.sqrt(1- --t*t)+b;
NZ.Easing.CircEaseInOut = (t, b, c) => (t*=2)<1?-c*0.5*(Math.sqrt(1-t*t)-1)+b:c*0.5*(Math.sqrt(1-(t-=2)*t)+1)+b;
NZ.Easing.ElasticEaseIn = (t, b, c) => {s=1.70158,p=0.3,a=c;return t===0?b:t===1?b+c:(a<Math.abs(c)?(a=c,s=p*0.25):s=p/(2*Math.PI)*Math.asin(c/a),-a*Math.pow(2,10*--t)*Math.sin((t-s)*(2*Math.PI)/p)+b)};
NZ.Easing.ElasticEaseOut = (t, b, c) => {s=1.70158,p=0.3,a=c;return t===0?b:t===1?b+c:(a<Math.abs(c)?(a=c,s=p*0.25):s=p/(2*Math.PI)*Math.asin(c/a),a*Math.pow(2,-10*t)*Math.sin((t-s)*(2*Math.PI)/p)+c+b)};
NZ.Easing.ElasticEaseInOut = (t, b, c) => {s=1.70158,p=0.3*1.5,a=c;return t===0?b:(t*=2)===2?b+c:(a<Math.abs(c)?(a=c,s=p*0.25):s=p/(2*Math.PI)*Math.asin(c/a),t<1?-0.5*a*Math.pow(2,10*--t)*Math.sin((t-s)*(2*Math.PI)/p)+b:a*Math.pow(2,-10*--t)*Math.sin((t-s)*(2*Math.PI)/p)*0.5+c+b)};
NZ.Easing.BackEaseIn = (t, b, c, s=1.70158) => c*t*t*((s+1)*t-s)+b;
NZ.Easing.BackEaseOut = (t, b, c, s=1.70158) => c*(--t*t*((s+1)*t+s)+1)+b;
NZ.Easing.BackEaseInOut = (t, b, c, s=1.70158) => (t*=2)<1?c*0.5*(t*t*(((s*=1.525)+1)*t-s))+b:c*0.5*((t-=2)*t*(((s*=1.525)+1)*t+s)+2)+b;
NZ.Easing.BounceEaseIn = (t, b, c) => c-NZ.Easing.BounceEaseOut(1-t,0,c)+b;
NZ.Easing.BounceEaseOut = (t, b, c) => t<1/2.75?c*(7.5625*t*t)+b:t<2/2.75?c*(7.5625*(t-=1.5/2.75)*t+0.75)+b:t<2.5/2.75?c*(7.5625*(t-=2.25/2.75)*t+0.9375)+b:c*(7.5625*(t-=2.625/2.75)*t+0.984375)+b;
NZ.Easing.BounceEaseInOut = (t, b, c) => t<0.5?NZ.Easing.BounceEaseIn(t*2,0,c)*0.5+b:NZ.Easing.BounceEaseOut(t*2-1,0,c)*0.5+c*0.5+b;
NZ.Easing.keys = Object.keys(NZ.Easing);

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */