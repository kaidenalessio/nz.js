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

NZ.Easing = {
	// t: normalized time, b: beginning value, c: change in value
	easeInQuad(t, b, c) {
		return c*t*t+b;
	},
	easeOutQuad(t, b, c) {
		return -c*t*(t-2)+b;
	},
	easeInOutQuad(t, b, c) {
		return (t*=2)<1?c*0.5*t*t+b:-c*0.5*(--t*(t-2)-1)+b;
	},
	easeInCubic(t, b, c) {
		return c*t*t*t+b;
	},
	easeOutCubic(t, b, c) {
		return c*(--t*t*t+1)+b;
	},
	easeInOutCubic(t, b, c) {
		return (t*=2)<1?c*0.5*t*t*t+b:c*0.5*((t-=2)*t*t+2)+b;
	},
	easeInQuart(t, b, c) {
		return c*t*t*t*t+b;
	},
	easeOutQuart(t, b, c) {
		return -c*(--t*t*t*t-1)+b;
	},
	easeInOutQuart(t, b, c) {
		return (t*=2)<1?c*0.5*t*t*t*t+b:-c*0.5*((t-=2)*t*t*t-2)+b;
	},
	easeInQuint(t, b, c) {
		return c*t*t*t*t*t+b;
	},
	easeOutQuint(t, b, c) {
		return c*(--t*t*t*t*t+1)+b;
	},
	easeInOutQuint(t, b, c) {
		return (t*=2)<1?c*0.5*t*t*t*t*t+b:c*0.5*((t-=2)*t*t*t*t+2)+b;
	},
	easeInSine(t, b, c) {
		return -c*Math.cos(t*Math.PI*0.5)+c+b;
	},
	easeOutSine(t, b, c) {
		return c*Math.sin(t*Math.PI*0.5)+b;
	},
	easeInOutSine(t, b, c) {
		return -c*0.5*(Math.cos(t*Math.PI)-1)+b;
	},
	easeInExpo(t, b, c) {
		return t===0?b:c*Math.pow(2,10*(t-1))+b;
	},
	easeOutExpo(t, b, c) {
		return t===1?b+c:c*(-Math.pow(2,-10*t)+1)+b;
	},
	easeInOutExpo(t, b, c) {
		return t===0?b:t===1?b+c:(t*=2)<1?c*0.5*Math.pow(2,10*(t-1))+b:c*0.5*(-Math.pow(2,-10*--t)+2)+b;
	},
	easeInCirc(t, b, c) {
		return -c*(Math.sqrt(1-t*t)-1)+b;
	},
	easeOutCirc(t, b, c) {
		return c*Math.sqrt(1- --t*t)+b;
	},
	easeInOutCirc(t, b, c) {
		return (t*=2)<1?-c*0.5*(Math.sqrt(1-t*t)-1)+b:c*0.5*(Math.sqrt(1-(t-=2)*t)+1)+b;
	},
	easeInElastic(t, b, c) {
		let s=1.70158,p=0.3,a=c;return t===0?b:t===1?b+c:(a<Math.abs(c)?(a=c,s=p*0.25):s=p/(2*Math.PI)*Math.asin(c/a),-a*Math.pow(2,10*--t)*Math.sin((t-s)*(2*Math.PI)/p)+b);
	},
	easeOutElastic(t, b, c) {
		let s=1.70158,p=0.3,a=c;return t===0?b:t===1?b+c:(a<Math.abs(c)?(a=c,s=p*0.25):s=p/(2*Math.PI)*Math.asin(c/a),a*Math.pow(2,-10*t)*Math.sin((t-s)*(2*Math.PI)/p)+c+b);
	},
	easeInOutElastic(t, b, c) {
		let s=1.70158,p=0.3*1.5,a=c;return t===0?b:(t*=2)===2?b+c:(a<Math.abs(c)?(a=c,s=p*0.25):s=p/(2*Math.PI)*Math.asin(c/a),t<1?-0.5*a*Math.pow(2,10*--t)*Math.sin((t-s)*(2*Math.PI)/p)+b:a*Math.pow(2,-10*--t)*Math.sin((t-s)*(2*Math.PI)/p)*0.5+c+b);
	},
	easeInBack(t, b, c, s=1.70158) {
		return c*t*t*((s+1)*t-s)+b;
	},
	easeOutBack(t, b, c, s=1.70158) {
		return c*(--t*t*((s+1)*t+s)+1)+b;
	},
	easeInOutBack(t, b, c, s=1.70158) {
		return (t*=2)<1?c*0.5*(t*t*(((s*=1.525)+1)*t-s))+b:c*0.5*((t-=2)*t*(((s*=1.525)+1)*t+s)+2)+b;
	},
	easeInBounce(t, b, c, d) {
		return c - NZ.Easing.easeOutBounce(d-t, 0, c, d) + b;
	},
	easeOutBounce(t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce(t, b, c, d) {
		if (t < d/2) return NZ.Easing.easeInBounce(t*2, 0, c, d) * .5 + b;
		return NZ.Easing.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
};

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