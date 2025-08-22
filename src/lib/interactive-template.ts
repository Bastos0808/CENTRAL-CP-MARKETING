
import type { GeneratePresentationOutput } from "@/ai/schemas/presentation-generator-schemas";

// --- Embedded Libraries ---
// The minified code for the libraries is pasted here to ensure the final HTML is self-contained.
const GSAP_CODE = `/*!
 * VERSION: 1.18.2
 * DATE: 2015-12-22
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * @license Copyright (c) 2008-2015, GreenSock. All rights reserved.
 * This work is subject to the terms at http://greensock.com/standard-license or for
 * Club GreenSock members, the software agreement that was issued with your
 * membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope="undefined"!=typeof module&&module.exports&&"undefined"!=typeof global?global:this||window;(_gsScope._gsQueue||(_gsScope._gsQueue=[])).push(function(){"use strict";_gsScope._gsDefine("TweenMax",["core.Animation","core.SimpleTimeline","TweenLite"],function(a,b,c){var d=function(a){var b,c=[],d=a.length;for(b=0;b!==d;c.push(a[b++]));return c},e=function(a,b,d){c.call(this,a,b,d),this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._dirty=!0,this.render=e.prototype.render},f=1e-10,g=c._internals,h=g.isSelector,i=g.isArray,j=e.prototype=c.to({},.1,{}),k=[];e.version="1.18.2",j.constructor=e,j.kill().off=j.kill,j.first=j.last=j.render=null,e.killTweensOf=e.killDelayedCallsTo=c.killTweensOf,e.getTweensOf=c.getTweensOf,e.lagSmoothing=c.lagSmoothing,e.ticker=c.ticker,e.render=c.render,j.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),c.prototype.invalidate.call(this)},j.updateTo=function(a,b){var d,e=this.ratio,f=this.vars.immediateRender||a.immediateRender;b&&this._startTime<this._timeline._time&&(this._startTime=this._timeline._time,this._uncache(!1),this._gc?this._enabled(!0,!1):this._timeline.insert(this,this._startTime-this._delay));for(d in a)this.vars[d]=a[d];if(this._initted)if(b){this._initted=!1,f&&(this.render(0,!0,!0),this.vars.immediateRender&&this._initted===!1&&(this._initted=!0));else if(this._gc&&this._enabled(!0,!1),this._notifyPluginsOfEnabled&&this._firstPT&&c._onPluginEvent("_onDisable",this),this._time/this._duration>0.998){var g=this._time;this.render(0,!0,!1),this._initted=!1,this.render(g,!0,!1)}else if(this._initted&&this._time>0)for(var h,i=1/(1-e),j=this._firstPT;j;){h=j.s+j.c,j.c*=i,j.s=h-j.c,j=j._next}this._initted=!1;return this},j.render=function(a,b,d){this._initted||0===this._duration&&this.vars.repeat&&this.invalidate();var e,h,i,j,k,l,m,n,o=this._dirty?this.totalDuration():this._totalDuration,p=this._time,q=this._totalTime,r=this._cycle,s=this._duration,t=this._rawPrevTime;if(a>=o)this._totalTime=o,this._cycle=this._repeat,this._yoyo&&0!==(1&this._cycle)?(this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0):(this._time=s,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1),this._reversed||(e=!0,h="onComplete",d=d||this._timeline.autoRemoveChildren),0===s&&(this._rawPrevTime=== -1||a-this._rawPrevTime<f)&&a!==this._rawPrevTime&&this._firstPT&&(k=!0,this._rawPrevTime>f);else if(1e-7>a)this._totalTime=this._time=this._cycle=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==q||0===s&&this._rawPrevTime>f)&&(h="onReverseComplete",e=this._reversed),0>a&&(this._active=!1,0===s&&(this._rawPrevTime>=0||this._repeat>0)&&(k=!0,this._rawPrevTime<f)),this._initted||(k=!0);else if(this._totalTime=this._time=a,0!==this._repeat){j=s+this._repeatDelay,this._cycle=this._totalTime/j>>0,0!==this._cycle&&this._cycle===this._totalTime/j&&this._cycle--,this._time=this._totalTime-this._cycle*j,this._yoyo&&0!==(1&this._cycle)&&(this._time=s-this._time),this._time>s?this._time=s:this._time<0&&(this._time=0)}else this._cycle=0;if(this._time===p&&!d&&!k)return void(q!==this._totalTime&&this._onUpdate&&b!==!1&&this._callback("onUpdate"));if(this._initted||(this._initted=!0,this._ease.vars.lazy!==!1||this._duration||(this.vars.lazy=!1)),0===this._time&&0!==p||this._rawPrevTime===f&&a>0){this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0;for(var u=this._firstPT;u;)u.r(this.ratio,u.d),u=u._next}else if(this._time!==s||0===p){i=this._ease.getRatio(this._time/s);if(this.ratio!==i){this.ratio=i;for(var u=this._firstPT;u;)u.r(this.ratio,u.d),u=u._next}}(t=this._rawPrevTime,this._rawPrevTime=a)===this._time&&!b&&this._firstPT||(this._time||q?this.ratio||(this.ratio=0):this._time===p&&d||(this._time=p));if(this._yoyo!=l&&(0!==this._cycle||this._reversed?this._reversed=!this._reversed:l&&(this._reversed=this.vars.yoyo===!0)),this.ratio>1?this.ratio=1:this.ratio<0&&(this.ratio=0),q!==this._totalTime&&this._onUpdate&&b!==!1&&this._callback("onUpdate"),this._cycle!==r&&this._onRepeat&&b!==!1&&this._callback("onRepeat"),h&&(this._gc||(e&&this._timeline.autoRemoveChildren&&(this._enabled(!1,!1),this._active=!1),this._callback(h))))},e.to=function(a,b,c){return new e(a,b,c)},e.from=function(a,b,c){return c.runBackwards=!0,c.immediateRender=0!=c.immediateRender,new e(a,b,c)},e.fromTo=function(a,b,c,d){return d.startAt=c,d.immediateRender=0!=d.immediateRender&&0!=c.immediateRender,new e(a,b,d)},e.staggerTo=function(a,b,f,g,i,j,l){var m,n,o=new b,p=f.cycle,q=f.ease,r=f.overwrite,s=f.immediateRender,t=p||f.stagger;for(h(a)||(n="string"==typeof a?c.selector(a)||a:a,"string"==typeof n&&(n=[n]),a=h(n)?n:d(n)),a=a||[],0>g&&(g*=-1,l=!0),m=0;m<a.length;m++)o.clear(!0),o.to(a[m],b,f),(o._firstPT||o._forcing||o._hasPlugins)&&(b=o.duration(),f.stagger=t=p?p[m%p.length]:t,q&&(o._first.vars.ease=q),o._startTime=t*m,o._duration=b,o._cycle=o._repeat=0,o._yoyo=!1,o._dirty=!0,o.render(0,!0,!0),s&&o._initted===!1&&(o._initted=!0),o._rawPrevTime<0&&s&&o.render(0,!0,!1),i&&i.add(o));return o},e.staggerFrom=function(a,b,c,d,f,g,h){return c.runBackwards=!0,c.immediateRender=0!=c.immediateRender,e.staggerTo(a,b,c,d,f,g,h)},e.staggerFromTo=function(a,b,c,d,f,g,h,i){return d.startAt=c,d.immediateRender=0!=d.immediateRender&&0!=c.immediateRender,e.staggerTo(a,b,d,f,g,h,i)},e.delayedCall=function(a,b,c,d,f){return new e(b,0,{delay:a,onComplete:b,onCompleteParams:c,callbackScope:d,onReverseComplete:b,onReverseCompleteParams:c,immediateRender:!1,lazy:!1,useFrames:f,overwrite:0})},e.set=function(a,b){return new e(a,0,b)},e.isTweening=function(a){return c.getTweensOf(a,!0).length>0};var m=function(a,b){for(var d=[],e=0,f=a._first;f;)f instanceof c?d[e++]=f:(b&&(d[e++]=f),d=d.concat(m(f,b)),e=d.length),f=f._next;return d},n=e.getAllTweens=function(b){return m(a._rootTimeline,b).concat(m(a._rootFramesTimeline,b))};e.killAll=function(a,c,d,e){null==c&&(c=!0),null==d&&(d=!0);var f,g,h,i=n(0!=e),j=i.length,k=c&&d&&e;for(h=0;j>h;h++)g=i[h],(k||g instanceof b||(f=g.target===g.vars.onComplete)&&d||c&&!f)&&(a?g.totalTime(g.totalDuration()):g._enabled(!1,!1))},e.killChildTweensOf=function(a,b){if(null!=a){var f,j,k,l,m,n=g.tweenLookup;if("string"==typeof a&&(a=c.selector(a)||a),h(a)&&(a=d(a)),i(a)){l=a.length;for(;--l>-1;)e.killChildTweensOf(a[l],b)}else{f=[];for(k in n)for(j=n[k].target.parentNode;j;)j===a&&(f=f.concat(n[k].tweens)),j=j.parentNode;for(m=f.length,l=0;m>l;l++)b&&f[l].totalTime(f[l].totalDuration()),f[l]._enabled(!1,!1)}}},e.pauseAll=function(a,b,c){o(!0,a,b,c)},e.resumeAll=function(a,b,c){o(!1,a,b,c)};var o=function(a,c,d,e){void 0===c&&(c=!0),void 0===d&&(d=!0);for(var f,g,h=n(e),i=c&&d&&e,j=h.length;--j>-1;)g=h[j],(i||g instanceof b||(f=g.target===g.vars.onComplete)&&d||c&&!f)&&g.paused(a)};return j.progress=function(a){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-a:a)+this._cycle*(this._duration+this._repeatDelay),!1):this._time/this.duration()},j.totalProgress=function(a){return arguments.length?this.totalTime(this.totalDuration()*a,!1):this._totalTime/this.totalDuration()},j.time=function(a,b){return arguments.length?(this._dirty&&this.totalDuration(),a>this._duration&&(a=this._duration),this._yoyo&&0!==(1&this._cycle)?a=this._duration-a+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(a+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(a,b)):this._time},j.duration=function(b){return arguments.length?a.prototype.duration.call(this,b):this._duration},j.totalDuration=function(a){return arguments.length?-1===this._repeat?this:this.duration(a):this._dirty?(this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat,this._dirty=!1,this._totalDuration):this._totalDuration},j.repeat=function(a){return arguments.length?(this._repeat=a,this._uncache(!0)):this._repeat},j.repeatDelay=function(a){return arguments.length?(this._repeatDelay=a,this._uncache(!0)):this._repeatDelay},j.yoyo=function(a){return arguments.length?(this._yoyo=a,this):this._yoyo},e}),_gsScope._gsDefine&&_gsScope._gsQueue.pop()(),function(a){"use strict";var b=function(){return(_gsScope.GreenSockGlobals||_gsScope)[a]};if("function"==typeof define&&define.amd)define(["TweenLite"],b);else if("undefined"!=typeof module&&module.exports)require("./TweenLite.js"),module.exports=b();else if("undefined"!=typeof exports)exports.TweenMax=b()}("TweenMax")});`;
const THREE_JS_CODE = `/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */

var THREE = {

	REVISION: '83',

	//

	MOUSE: { LEFT: 0, MIDDLE: 1, RIGHT: 2 },

	//

	CullFaceNone: 0,
	CullFaceBack: 1,
	CullFaceFront: 2,
	CullFaceFrontBack: 3,

	//

	FrontFaceDirectionCW: 0,
	FrontFaceDirectionCCW: 1,

	//

	BasicShadowMap: 0,
	PCFShadowMap: 1,
	PCFSoftShadowMap: 2,

	//

	FrontSide: 0,
	BackSide: 1,
	DoubleSide: 2,

	//

	FlatShading: 1,
	SmoothShading: 2,

	//

	NoColors: 0,
	FaceColors: 1,
	VertexColors: 2,

	//

	NoBlending: 0,
	NormalBlending: 1,
	AdditiveBlending: 2,
	SubtractiveBlending: 3,
	MultiplyBlending: 4,
	CustomBlending: 5,

	//

	AddEquation: 100,
	SubtractEquation: 101,
	ReverseSubtractEquation: 102,
	MinEquation: 103,
	MaxEquation: 104,

	//

	ZeroFactor: 200,
	OneFactor: 201,
	SrcColorFactor: 202,
	OneMinusSrcColorFactor: 203,
	SrcAlphaFactor: 204,
	OneMinusSrcAlphaFactor: 205,
	DstAlphaFactor: 206,
	OneMinusDstAlphaFactor: 207,
	DstColorFactor: 208,
	OneMinusDstColorFactor: 209,
	SrcAlphaSaturateFactor: 210,

	//

	NeverDepth: 0,
	AlwaysDepth: 1,
	LessDepth: 2,
	LessEqualDepth: 3,
	EqualDepth: 4,
	GreaterEqualDepth: 5,
	GreaterDepth: 6,
	NotEqualDepth: 7,

	//

	MultiplyOperation: 0,
	MixOperation: 1,
	AddOperation: 2,

	//

	NoToneMapping: 0,
	LinearToneMapping: 1,
	ReinhardToneMapping: 2,
	Uncharted2ToneMapping: 3,
	CineonToneMapping: 4,

	//

	UVMapping: 300,

	CubeReflectionMapping: 301,
	CubeRefractionMapping: 302,

	EquirectangularReflectionMapping: 303,
	EquirectangularRefractionMapping: 304,

	SphericalReflectionMapping: 305,
	CubeUVReflectionMapping: 306,
	CubeUVRefractionMapping: 307,

	//

	RepeatWrapping: 1000,
	ClampToEdgeWrapping: 1001,
	MirroredRepeatWrapping: 1002,

	//

	NearestFilter: 1003,
	NearestMipMapNearestFilter: 1004,
	NearestMipMapLinearFilter: 1005,
	LinearFilter: 1006,
	LinearMipMapNearestFilter: 1007,
	LinearMipMapLinearFilter: 1008,

	//

	UnsignedByteType: 1009,
	ByteType: 1010,
	ShortType: 1011,
	UnsignedShortType: 1012,
	IntType: 1013,
	UnsignedIntType: 1014,
	FloatType: 1015,
	HalfFloatType: 1016,
	UnsignedShort4444Type: 1017,
	UnsignedShort5551Type: 1018,
	UnsignedShort565Type: 1019,

	//

	AlphaFormat: 1021,
	RGBFormat: 1022,
	RGBAFormat: 1023,
	LuminanceFormat: 1024,
	LuminanceAlphaFormat: 1025,
	RGBEFormat: 1020,
	DepthFormat: 1026,
	DepthStencilFormat: 1027,

	//

	RGB_S3TC_DXT1_Format: 2001,
	RGBA_S3TC_DXT1_Format: 2002,
	RGBA_S3TC_DXT3_Format: 2003,
	RGBA_S3TC_DXT5_Format: 2004,
	RGB_PVRTC_4BPPV1_Format: 2100,
	RGB_PVRTC_2BPPV1_Format: 2101,
	RGBA_PVRTC_4BPPV1_Format: 2102,
	RGBA_PVRTC_2BPPV1_Format: 2103,
	RGB_ETC1_Format: 2151,
	Luminance_Alpha_Format: 1025,

	//

	LoopOnce: 2200,
	LoopRepeat: 2201,
	LoopPingPong: 2202,

	//

	InterpolateDiscrete: 2300,
	InterpolateLinear: 2301,
	InterpolateSmooth: 2302,

	//

	ZeroCurvatureEnding: 2400,
	ZeroSlopeEnding: 2401,
	WrapAroundEnding: 2402,

	//

	TrianglesDrawMode: 0,
	TriangleStripDrawMode: 1,
	TriangleFanDrawMode: 2,

	//

	LinearEncoding: 3000,
	sRGBEncoding: 3001,
	GammaEncoding: 3007,
	RGBEEncoding: 3002,
	LogLuvEncoding: 3003,
	RGBM7Encoding: 3004,
	RGBM16Encoding: 3005,
	RGBDEncoding: 3006,
	BasicDepthPacking: 3200,
	RGBADepthPacking: 3201

};

Object.assign( THREE, {

	Quaternion: function ( x, y, z, w ) {

		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._w = ( w !== undefined ) ? w : 1;

	},

	Vector2: function ( x, y ) {

		this.x = x || 0;
		this.y = y || 0;

	},

	Vector3: function ( x, y, z ) {

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;

	},

	Vector4: function ( x, y, z, w ) {

		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = ( w !== undefined ) ? w : 1;

	},

	Euler: function ( x, y, z, order ) {

		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._order = order || THREE.Euler.DefaultOrder;

	},

	Line3: function ( start, end ) {

		this.start = ( start !== undefined ) ? start : new THREE.Vector3();
		this.end = ( end !== undefined ) ? end : new THREE.Vector3();

	},

	Box2: function ( min, max ) {

		this.min = ( min !== undefined ) ? min : new THREE.Vector2( + Infinity, + Infinity );
		this.max = ( max !== undefined ) ? max : new THREE.Vector2( - Infinity, - Infinity );

	},

	Box3: function ( min, max ) {

		this.min = ( min !== undefined ) ? min : new THREE.Vector3( + Infinity, + Infinity, + Infinity );
		this.max = ( max !== undefined ) ? max : new THREE.Vector3( - Infinity, - Infinity, - Infinity );

	},

	Matrix3: function () {

		this.elements = new Float32Array( [

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		] );

	},

	Matrix4: function () {

		this.elements = new Float32Array( [

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		] );

	},

	Ray: function ( origin, direction ) {

		this.origin = ( origin !== undefined ) ? origin : new THREE.Vector3();
		this.direction = ( direction !== undefined ) ? direction : new THREE.Vector3();

	},

	Sphere: function ( center, radius ) {

		this.center = ( center !== undefined ) ? center : new THREE.Vector3();
		this.radius = ( radius !== undefined ) ? radius : 0;

	},

	Frustum: function ( p0, p1, p2, p3, p4, p5 ) {

		this.planes = [

			( p0 !== undefined ) ? p0 : new THREE.Plane(),
			( p1 !== undefined ) ? p1 : new THREE.Plane(),
			( p2 !== undefined ) ? p2 : new THREE.Plane(),
			( p3 !== undefined ) ? p3 : new THREE.Plane(),
			( p4 !== undefined ) ? p4 : new THREE.Plane(),
			( p5 !== undefined ) ? p5 : new THREE.Plane()

		];

	},

	Plane: function ( normal, constant ) {

		this.normal = ( normal !== undefined ) ? normal : new THREE.Vector3( 1, 0, 0 );
		this.constant = ( constant !== undefined ) ? constant : 0;

	},

	Math: {

		DEG2RAD: Math.PI / 180,
		RAD2DEG: 180 / Math.PI,

		generateUUID: function () {

			// http://www.broofa.com/Tools/Math.uuid.htm

			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
			var uuid = new Array( 36 );
			var rnd = 0, r;

			return function generateUUID() {

				for ( var i = 0; i < 36; i ++ ) {

					if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

						uuid[ i ] = '-';

					} else if ( i === 14 ) {

						uuid[ i ] = '4';

					} else {

						if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
						r = rnd & 0xf;
						rnd = rnd >> 4;
						uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

					}

				}

				return uuid.join( '' );

			};

		}(),

		clamp: function ( value, min, max ) {

			return Math.max( min, Math.min( max, value ) );

		},

		// compute euclidian modulo of m % n
		// https://en.wikipedia.org/wiki/Modulo_operation

		euclideanModulo: function ( n, m ) {

			return ( ( n % m ) + m ) % m;

		},

		// Linear mapping implementing an interval map.
		// If value is not between 'inMin' and 'inMax',
		// then it is clamped to that interval.

		mapLinear: function ( x, a1, a2, b1, b2 ) {

			return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

		},

		// https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
		inverseLerp: function ( x, y, value ) {
			if ( x !== y ) {
				return ( value - x ) / ( y - x );
			} else {
				return 0;
			}
		},

		// http://en.wikipedia.org/wiki/Smoothstep

		smoothstep: function ( x, min, max ) {

			if ( x <= min ) return 0;
			if ( x >= max ) return 1;

			x = ( x - min ) / ( max - min );

			return x * x * ( 3 - 2 * x );

		},

		smootherstep: function ( x, min, max ) {

			if ( x <= min ) return 0;
			if ( x >= max ) return 1;

			x = ( x - min ) / ( max - min );

			return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

		},

		// Random integer from <low, high> interval

		randInt: function ( low, high ) {

			return low + Math.floor( Math.random() * ( high - low + 1 ) );

		},

		// Random float from <low, high> interval

		randFloat: function ( low, high ) {

			return low + Math.random() * ( high - low );

		},

		// Random float from <-range/2, range/2> interval

		randFloatSpread: function ( range ) {

			return range * ( 0.5 - Math.random() );

		},

		degToRad: function ( degrees ) {

			return degrees * THREE.Math.DEG2RAD;

		},

		radToDeg: function ( radians ) {

			return radians * THREE.Math.RAD2DEG;

		},

		isPowerOfTwo: function ( value ) {

			return ( value & ( value - 1 ) ) === 0 && value !== 0;

		},

		ceilPowerOfTwo: function ( value ) {

			return Math.pow( 2, Math.ceil( Math.log( value ) / Math.LN2 ) );

		},

		floorPowerOfTwo: function ( value ) {

			return Math.pow( 2, Math.floor( Math.log( value ) / Math.LN2 ) );

		}

	},

	Spline: function ( points ) {

		this.points = points;

		var c = [], v3 = { x: 0, y: 0, z: 0 },
		point, intPoint, weight, w2, w3,
		pa, pb, pc, pd;

		this.initFromArray = function ( a ) {

			this.points = [];

			for ( var i = 0; i < a.length; i ++ ) {

				this.points[ i ] = { x: a[ i ][ 0 ], y: a[ i ][ 1 ], z: a[ i ][ 2 ] };

			}

		};

		this.getPoint = function ( k ) {

			point = ( this.points.length - 1 ) * k;
			intPoint = Math.floor( point );
			weight = point - intPoint;

			c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;
			c[ 1 ] = intPoint;
			c[ 2 ] = intPoint > this.points.length - 2 ? this.points.length - 1 : intPoint + 1;
			c[ 3 ] = intPoint > this.points.length - 3 ? this.points.length - 1 : intPoint + 2;

			pa = this.points[ c[ 0 ] ];
			pb = this.points[ c[ 1 ] ];
			pc = this.points[ c[ 2 ] ];
			pd = this.points[ c[ 3 ] ];

			w2 = weight * weight;
			w3 = weight * w2;

			v3.x = this.interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );
			v3.y = this.interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );
			v3.z = this.interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );

			return v3;

		};

		this.getControlPointsArray = function () {

			var i, p, l = this.points.length,
			coords = [];

			for ( i = 0; i < l; i ++ ) {

				p = this.points[ i ];
				coords[ i ] = [ p.x, p.y, p.z ];

			}

			return coords;

		};

		// Catmull-Rom

		this.interpolate = function ( p0, p1, p2, p3, t, t2, t3 ) {

			var v0 = ( p2 - p0 ) * 0.5,
			v1 = ( p3 - p1 ) * 0.5;

			return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		};

	},

	Triangle: function ( a, b, c ) {

		this.a = ( a !== undefined ) ? a : new THREE.Vector3();
		this.b = ( b !== undefined ) ? b : new THREE.Vector3();
		this.c = ( c !== undefined ) ? c : new THREE.Vector3();

	},

	_Color: function ( r, g, b ) {

		if ( g === undefined && b === undefined ) {

			// r is THREE.Color, hex or string
			return this.set( r );

		}

		return this.setRGB( r, g, b );

	},

	Color: function ( r, g, b ) {

		if ( g === undefined && b === undefined ) {

			// r is THREE.Color, hex or string
			return this.set( r );

		}

		return this.setRGB( r, g, b );

	},

	Clock: function ( autoStart ) {

		this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

		this.startTime = 0;
		this.oldTime = 0;
		this.elapsedTime = 0;

		this.running = false;

	},

	EventDispatcher: function () {},

	Face3: function ( a, b, c, normal, color, materialIndex ) {

		this.a = a;
		this.b = b;
		this.c = c;

		this.normal = ( normal instanceof THREE.Vector3 ) ? normal : new THREE.Vector3();
		this.vertexNormals = Array.isArray( normal ) ? normal : [];

		this.color = ( color instanceof THREE.Color ) ? color : new THREE.Color();
		this.vertexColors = Array.isArray( color ) ? color : [];

		this.materialIndex = materialIndex !== undefined ? materialIndex : 0;

	},

	Face4: function ( a, b, c, d, normal, color, materialIndex ) {

		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;

		this.normal = ( normal instanceof THREE.Vector3 ) ? normal : new THREE.Vector3();
		this.vertexNormals = Array.isArray( normal ) ? normal : [];

		this.color = ( color instanceof THREE.Color ) ? color : new THREE.Color();
		this.vertexColors = Array.isArray( color ) ? color : [];

		this.materialIndex = materialIndex !== undefined ? materialIndex : 0;

	},

	Object3D: function () {

		this.id = THREE.Object3DIdCount ++;

		this.uuid = THREE.Math.generateUUID();

		this.name = '';
		this.type = 'Object3D';

		this.parent = null;
		this.children = [];

		this.up = THREE.Object3D.DefaultUp.clone();

		var position = new THREE.Vector3();
		var rotation = new THREE.Euler();
		var quaternion = new THREE.Quaternion();
		var scale = new THREE.Vector3( 1, 1, 1 );

		function onRotationChange() {

			quaternion.setFromEuler( rotation, false );

		}

		function onQuaternionChange() {

			rotation.setFromQuaternion( quaternion, undefined, false );

		}

		rotation._onChange( onRotationChange );
		quaternion._onChange( onQuaternionChange );

		Object.defineProperties( this, {
			position: {
				enumerable: true,
				value: position
			},
			rotation: {
				enumerable: true,
				value: rotation
			},
			quaternion: {
				enumerable: true,
				value: quaternion
			},
			scale: {
				enumerable: true,
				value: scale
			},
			modelViewMatrix: {
				value: new THREE.Matrix4()
			},
			normalMatrix: {
				value: new THREE.Matrix3()
			}
		} );

		this.matrix = new THREE.Matrix4();
		this.matrixWorld = new THREE.Matrix4();

		this.matrixAutoUpdate = THREE.Object3D.DefaultMatrixAutoUpdate;
		this.matrixWorldNeedsUpdate = false;

		this.layers = new THREE.Layers();
		this.visible = true;

		this.castShadow = false;
		this.receiveShadow = false;

		this.frustumCulled = true;
		this.renderOrder = 0;

		this.userData = {};

	},

	Raycaster: function ( origin, direction, near, far ) {

		this.ray = new THREE.Ray( origin, direction );
		this.near = near || 0;
		this.far = far || Infinity;

		this.linePrecision = 1;
		this.params = {
			Mesh: {},
			Line: {},
			LOD: {},
			Points: { threshold: 1 },
			Sprite: {}
		};

		Object.defineProperties( this.params, {
			PointCloud: {
				get: function () {
					console.warn( 'THREE.Raycaster: params.PointCloud has been renamed to params.Points.' );
					return this.Points;
				}
			}
		} );

	},

	//

	Layers: function () {

		this.mask = 1 | 0;

	},

	//

	Audio: function ( listener ) {

		THREE.Object3D.call( this );

		this.type = 'Audio';

		this.context = listener.context;
		this.source = this.context.createBufferSource();
		this.source.onended = this.onEnded.bind( this );

		this.gain = this.context.createGain();
		this.gain.connect( listener.getInput() );

		this.autoplay = false;

		this.playbackRate = 1;
		this.detune = 0;
		this.loop = false;
		this._startTime = 0; // contains the time of the last call to play
		this._startedAt = 0; // contains the time of the last call to play
		this._progress = 0; // contains the time of the last call to pause
		this._isPlaying = false; // Is the audio playing?

	},

	AudioAnalyser: function ( audio, fftSize ) {

		this.fftSize = fftSize !== undefined ? fftSize : 2048;

		this.analyser = audio.context.createAnalyser();
		this.analyser.fftSize = this.fftSize;

		this.data = new Uint8Array( this.analyser.frequencyBinCount );

		audio.getOutput().connect( this.analyser );

	},

	AudioListener: function () {

		THREE.Object3D.call( this );

		this.type = 'AudioListener';

		this.context = new ( window.AudioContext || window.webkitAudioContext )();

		this.gain = this.context.createGain();
		this.gain.connect( this.context.destination );

		this.filter = null;

	},

	PositionalAudio: function ( listener ) {

		THREE.Audio.call( this, listener );

		this.panner = this.context.createPanner();
		this.panner.connect( this.gain );

	},

	//

	PerspectiveCamera: function ( fov, aspect, near, far ) {

		THREE.Camera.call( this );

		this.type = 'PerspectiveCamera';

		this.fov = fov !== undefined ? fov : 50;
		this.zoom = 1;

		this.near = near !== undefined ? near : 0.1;
		this.far = far !== undefined ? far : 2000;
		this.focus = 10;

		this.aspect = aspect !== undefined ? aspect : 1;
		this.view = null;

		this.filmGauge = 35;	// width of the film (default in millimeters)
		this.filmOffset = 0;	// horizontal film offset (same unit as gauge)

		this.updateProjectionMatrix();

	},

	OrthographicCamera: function ( left, right, top, bottom, near, far ) {

		THREE.Camera.call( this );

		this.type = 'OrthographicCamera';

		this.zoom = 1;
		this.view = null;

		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;

		this.near = ( near !== undefined ) ? near : 0.1;
		this.far = ( far !== undefined ) ? far : 2000;

		this.updateProjectionMatrix();

	},

	CubeCamera: function ( near, far, cubeResolution ) {

		THREE.Object3D.call( this );

		this.type = 'CubeCamera';

		var fov = 90, aspect = 1;

		var cameraPX = new THREE.PerspectiveCamera( fov, aspect, near, far );
		cameraPX.up.set( 0, - 1, 0 );
		cameraPX.lookAt( new THREE.Vector3( 1, 0, 0 ) );
		this.add( cameraPX );

		var cameraNX = new THREE.PerspectiveCamera( fov, aspect, near, far );
		cameraNX.up.set( 0, - 1, 0 );
		cameraNX.lookAt( new THREE.Vector3( - 1, 0, 0 ) );
		this.add( cameraNX );

		var cameraPY = new THREE.PerspectiveCamera( fov, aspect, near, far );
		cameraPY.up.set( 0, 0, 1 );
		cameraPY.lookAt( new THREE.Vector3( 0, 1, 0 ) );
		this.add( cameraPY );

		var cameraNY = new THREE.PerspectiveCamera( fov, aspect, near, far );
		cameraNY.up.set( 0, 0, - 1 );
		cameraNY.lookAt( new THREE.Vector3( 0, - 1, 0 ) );
		this.add( cameraNY );

		var cameraPZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
		cameraPZ.up.set( 0, - 1, 0 );
		cameraPZ.lookAt( new THREE.Vector3( 0, 0, 1 ) );
		this.add( cameraPZ );

		var cameraNZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
		cameraNZ.up.set( 0, - 1, 0 );
		cameraNZ.lookAt( new THREE.Vector3( 0, 0, - 1 ) );
		this.add( cameraNZ );

		this.renderTarget = new THREE.WebGLRenderTargetCube( cubeResolution, cubeResolution, { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter } );

		this.updateCubeMap = function ( renderer, scene ) {

			var renderTarget = this.renderTarget;
			var generateMipmaps = renderTarget.texture.generateMipmaps;

			renderTarget.texture.generateMipmaps = false;

			renderTarget.activeCubeFace = 0;
			renderer.render( scene, cameraPX, renderTarget );

			renderTarget.activeCubeFace = 1;
			renderer.render( scene, cameraNX, renderTarget );

			renderTarget.activeCubeFace = 2;
			renderer.render( scene, cameraPY, renderTarget );

			renderTarget.activeCubeFace = 3;
			renderer.render( scene, cameraNY, renderTarget );

			renderTarget.activeCubeFace = 4;
			renderer.render( scene, cameraPZ, renderTarget );

			renderTarget.texture.generateMipmaps = generateMipmaps;

			renderTarget.activeCubeFace = 5;
			renderer.render( scene, cameraNZ, renderTarget );

			renderer.setRenderTarget( null );

		};

	},

	Camera: function () {

		THREE.Object3D.call( this );

		this.type = 'Camera';

		this.matrixWorldInverse = new THREE.Matrix4();
		this.projectionMatrix = new THREE.Matrix4();

	},

	//

	AnimationAction: function ( mixer, clip ) {

		this._mixer = mixer;
		this._clip = clip;

		this._localRoot = null;
		this._globalRoot = null;

		this._actions = [];
		this._propertyBindings = [];

		this.enabled = true;
		this.time = 0;
		this.timeScale = 1;
		this.loop = THREE.LoopRepeat;
		this.weight = 1;

		this._effectiveTimeScale = 1;
		this._effectiveWeight = 1;

		this._schedule = [];
		this._scheduled = false;
		this._unschedule = false;

		this._needsUpdate = false;
		this._actionInstance = this;

		this._interpolant = null;
		this._buffer = null;
		this._cacheIndex = null;
		this._prevIndex = null;
		this._currIndex = null;

	},

	AnimationClip: function ( name, duration, tracks ) {

		this.name = name;
		this.tracks = tracks;
		this.duration = ( duration !== undefined ) ? duration : - 1;

		this.uuid = THREE.Math.generateUUID();

		// this means it should be assumed to be additive
		this.blendMode = THREE.NormalAnimationBlendMode;

		this.optimize();

	},

	AnimationMixer: function ( root ) {

		this._root = root;
		this._actions = [];
		this._actionsByClip = {};
		this._controlInterpolants = [];
		this.time = 0;
		this.timeScale = 1;

	},

	AnimationObjectGroup: function () {

		this.uuid = THREE.Math.generateUUID();

		// cached objects followed by the active ones
		this._objects = Array.prototype.slice.call( arguments );

		this.nCachedObjects_ = 0; // used to track the cache state

		this._paths = {}; // inside: string -> {
		// 		         _nodes: Array<Object>,
		// 		         _bindings: Array<PropertyBinding>
		// 		     }
		this._bindings = {}; // inside: uuid -> PropertyBinding

		this._bindables = {}; // inside: uuid -> Boolean

		this.stats = {
			objects: {
				total: this._objects.length,
				inUse: this._objects.length
			},
			bindings: {
				total: 0,
				inUse: 0
			}
		};

	},

	AnimationUtils: {

		// same as Array.prototype.slice, but also works on typed arrays
		arraySlice: function ( array, from, to ) {

			if ( THREE.AnimationUtils.isTypedArray( array ) ) {

				return new array.constructor( array.subarray( from, to ) );

			}

			return array.slice( from, to );

		},

		// converts an array to a specific type
		convertArray: function ( array, type, forceClone ) {

			if ( ! array || // let 'undefined' and 'null' pass
					! forceClone && array.constructor === type ) return array;

			if ( typeof type.BYTES_PER_ELEMENT === 'number' ) {

				return new type( array ); // create typed array

			}

			return Array.prototype.slice.call( array ); // create Array

		},

		isTypedArray: function ( object ) {

			return ArrayBuffer.isView( object ) &&
					! ( object instanceof DataView );

		},

		// returns an array by dividing the given array into chunks of the given size
		getKeyframeOrder: function ( times ) {

			function fairMerge( a, b ) {

				var n = a.length, m = b.length;
				var i = 0, j = 0, r = [];

				while ( i < n && j < m ) {

					if ( a[ i ] < b[ j ] ) {

						r.push( a[ i ++ ] );

					} else {

						r.push( b[ j ++ ] );

					}

				}

				if ( i < n ) {

					for ( ; i < n; ++ i ) r.push( a[ i ] );

				} else {

					for ( ; j < m; ++ j ) r.push( b[ j ] );

				}

				return r;

			}

			function fairMergeSort( a ) {

				var n = a.length;

				if ( n <= 1 ) {

					return a;

				}

				var m = n >> 1;
				return fairMerge( fairMergeSort( a.slice( 0, m ) ),
						fairMergeSort( a.slice( m, n ) ) );

			}

			return fairMergeSort( times );

		},

		// sorts an array of keyframes by time
		sortedArray: function ( values, stride, times ) {

			var nValues = values.length;
			var r = new values.constructor( nValues );

			var order = THREE.AnimationUtils.getKeyframeOrder( times );

			for ( var i = 0, n = order.length, iSrc, iDst; i !== n; ++ i ) {

				iSrc = order[ i ] * stride;
				iDst = i * stride;

				for ( var j = 0; j !== stride; ++ j ) {

					r[ iDst + j ] = values[ iSrc + j ];

				}

			}

			return r;

		},

		// function for parsing AOS keyframe formats
		subclip: function ( sourceClip, name, startFrame, endFrame, fps ) {

			fps = fps || 30;

			var newClip = sourceClip.clone();

			newClip.name = name;

			var tracks = [];

			for ( var i = 0; i < newClip.tracks.length; ++ i ) {

				var track = newClip.tracks[ i ];
				var newTrack = track.clone();

				var times = [];
				var values = [];
				var stride = newTrack.getValueSize();

				for ( var j = 0; j < newTrack.times.length; ++ j ) {

					var frame = newTrack.times[ j ] * fps;

					if ( frame >= startFrame && frame < endFrame ) {

						times.push( newTrack.times[ j ] );

						for ( var k = 0; k < stride; ++ k ) {

							values.push( newTrack.values[ j * stride + k ] );

						}

					}

				}

				if ( times.length === 0 ) continue;

				newTrack.times = THREE.AnimationUtils.convertArray( times, newTrack.times.constructor );
				newTrack.values = THREE.AnimationUtils.convertArray( values, newTrack.values.constructor );

				tracks.push( newTrack );

			}

			newClip.tracks = tracks;

			// find minimum .time value across all tracks in the trimmed clip
			var minStartTime = Infinity;

			for ( var i = 0; i < newClip.tracks.length; ++ i ) {

				if ( minStartTime > newClip.tracks[ i ].times[ 0 ] ) {

					minStartTime = newClip.tracks[ i ].times[ 0 ];

				}

			}

			// shift all tracks back in time by the amount of the minimum value
			// to make the clip start at an absolute time of 0
			for ( var i = 0; i < newClip.tracks.length; ++ i ) {

				newClip.tracks[ i ].shift( - 1 * minStartTime );

			}

			newClip.resetDuration();

			return newClip;

		}

	},

	KeyframeTrack: function ( name, times, values, interpolation ) {

		if ( name === undefined ) throw new Error( 'THREE.KeyframeTrack: track name is required' );
		if ( times === undefined || times.length === 0 ) throw new Error( 'THREE.KeyframeTrack: times is required' );
		if ( values === undefined || values.length === 0 ) throw new Error( 'THREE.KeyframeTrack: values is required' );

		this.name = name;
		this.times = THREE.AnimationUtils.convertArray( times, this.TimeBufferType );
		this.values = THREE.AnimationUtils.convertArray( values, this.ValueBufferType );

		this.setInterpolation( interpolation || this.DefaultInterpolation );

		this.validate();
		this.optimize();

	},

	PropertyBinding: function ( rootNode, trackName ) {

		this.path = trackName;
		this.parsedPath = THREE.PropertyBinding.parseTrackName( trackName );

		this.node = THREE.PropertyBinding.findNode( rootNode, this.parsedPath.nodeName );

		this.rootNode = rootNode;

	},

	PropertyMixer: function ( binding, typeName, valueSize ) {

		this.binding = binding;
		this.valueSize = valueSize;

		var buffer = new Float64Array( valueSize ),
			cumulativeWeight = 0;

		var useCount = 0;

		this._mixBufferRegion = function ( buffer, dstOffset,
				src, srcOffset, t, stride ) {

			var s = 1 - t;

			for ( var i = 0; i !== stride; ++ i ) {

				buffer[ dstOffset + i ] =
						buffer[ dstOffset + i ] * s + src[ srcOffset + i ] * t;

			}

		};

		this.accumulate = function ( accuIndex, weight ) {

			// note: happily accumulating nothing when weight = 0, the caller knows
			// the weight and shouldn't have made the call in the first place

			if ( weight !== 0 ) {

				var binding = this.binding,
					buffer = binding.buffer;

				// accumulate existing value
				var dstOffset = accuIndex * this.valueSize;

				if ( cumulativeWeight === 0 ) {

					// start with a fresh value
					for ( var i = 0; i !== this.valueSize; ++ i ) {

						buffer[ dstOffset + i ] = 0;

					}

				}

				// scale the existing value
				var t = weight / ( cumulativeWeight + weight );
				this._mixBufferRegion( buffer, dstOffset,
						this._getPrev(), 0, t, this.valueSize );

				cumulativeWeight += weight;

			}

		};

		// this exists to eventually allow on-demand evaluation in the paths
		this._getPrev = function () {

			return this.binding.getValue( buffer, 0 );

		};

		this.apply = function ( accuIndex ) {

			if ( useCount > 1 ) { // TODO / this is not going to work with groups

				var binding = this.binding,
					dstOffset = accuIndex * this.valueSize;

				this.binding.setValue( binding.buffer, dstOffset );

			}

			// TODO what about dirty flags?

			cumulativeWeight = 0;

		};

		this.saveOriginalState = function () {

			this._getPrev();

		};

		this.restoreOriginalState = function () {

			// just drop the cumulativeWeight so that the next time the builder
			// starts with a fresh value
			cumulativeWeight = 0;

		};

	},

	//

	BooleanKeyframeTrack: function ( name, times, values ) {

		THREE.KeyframeTrack.call( this, name, times, values );

	},

	ColorKeyframeTrack: function ( name, times, values, interpolation ) {

		THREE.KeyframeTrack.call( this, name, times, values, interpolation );

	},

	NumberKeyframeTrack: function ( name, times, values, interpolation ) {

		THREE.KeyframeTrack.call( this, name, times, values, interpolation );

	},

	QuaternionKeyframeTrack: function ( name, times, values, interpolation ) {

		THREE.KeyframeTrack.call( this, name, times, values, interpolation );

	},

	StringKeyframeTrack: function ( name, times, values, interpolation ) {

		THREE.KeyframeTrack.call( this, name, times, values, interpolation );

	},

	VectorKeyframeTrack: function ( name, times, values, interpolation ) {

		THREE.KeyframeTrack.call( this, name, times, values, interpolation );

	}

} );

if ( typeof define === 'function' && define.amd ) {

	define( 'three', THREE );

}
`;

// Helper function to safely escape HTML content
const escapeHtml = (text: string | undefined): string => {
    if (typeof text !== 'string') return '';
    return text
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
};

interface CreateProposalData {
    clientName: string;
    presentationData: GeneratePresentationOutput;
}

export function createInteractiveProposal(data: CreateProposalData): string {
  const { clientName, presentationData } = data;

  const introTitle = `Plano de Crescimento para`;
  const mainTitle = escapeHtml(clientName);
  
  const diagnosticSlide = presentationData.diagnosticSlide;
  const actionPlanSlide = presentationData.actionPlanSlide;
  const timelineSlide = presentationData.timelineSlide;
  const kpiSlide = presentationData.kpiSlide;
  const whyCpSlide = presentationData.whyCpSlide;
  const justificationSlide = presentationData.justificationSlide;
  const investmentSlide = presentationData.investmentSlide;
  const nextStepsSlide = presentationData.nextStepsSlide;


  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposta para ${escapeHtml(clientName)}</title>
    
    <style>
        /* Injected CSS */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Garamond&display=swap');

        body { position: relative; margin: 0; overflow: hidden; background-color: #121212; color: white; font-family: 'Inter', sans-serif; }
        .intro-container, .sky-container, .x-mark, .nav-arrows { position: absolute; text-align: center; margin: 0 auto; left: 0; right: 0; z-index: 10; transition: opacity 0.5s ease-in-out; }
        .intro-container { top: 50%; transform: translateY(-50%); }
        .sky-container { top: 10%; opacity: 0; pointer-events: none; }
        .x-mark { top: 20px; right: 20px; width: 40px; height: 40px; cursor: pointer; opacity: 0; pointer-events: none; }
        .x-mark .container { position: relative; width: 100%; height: 100%; }
        .x-mark .left, .x-mark .right { width: 2px; height: 20px; background: white; position: absolute; top: 10px; left: 19px; border-radius: 3px; transition: 0.15s ease-out; }
        .x-mark .right { transform: rotate(-45deg); }
        .x-mark .left { transform: rotate(45deg); }
        .x-mark:hover .right { transform: rotate(-45deg) scaleY(1.2); }
        .x-mark:hover .left { transform: rotate(45deg) scaleY(1.2); }
        h1 { font-weight: 900; margin: 0; font-size: 20px; text-transform: uppercase; line-height: 1.3; }
        @media screen and (min-width: 860px) { h1 { font-size: 40px; line-height: 52px; } }
        .fancy-text { font-family: 'Garamond', serif; font-style: italic; letter-spacing: 1px; margin-bottom: 17px; font-size: 24px;}
        .button { position: relative; cursor: pointer; display: inline-block; font-family: 'Inter', sans-serif; text-transform: uppercase; min-width: 200px; margin-top: 30px; color: white; }
        .button .border { border: 1px solid white; transform: skewX(-20deg); height: 32px; border-radius: 3px; overflow: hidden; position: relative; transition: 0.1s ease-out; }
        .button .text { position: absolute; left: 0; right: 0; top: 50%; transform: translateY(-50%); transition: 0.15s ease-out; }
        .button .left-plane, .button .right-plane { position: absolute; background: white; height: 32px; width: 100px; transition: 0.15s ease-out; }
        .button .left-plane { left: 0; transform: translateX(-100%); }
        .button .right-plane { right: 0; transform: translateX(100%); }
        .button:hover .border { box-shadow: 0px 0px 10px 0px rgba(255, 255, 255, 1); }
        .button:hover .left-plane { transform: translateX(0%); }
        .button:hover .right-plane { transform: translateX(0%); }
        .button:hover .text { color: #121212; }
        .nav-arrows { bottom: 30px; opacity: 0; pointer-events: none; }
        .nav-button { background: none; border: 1px solid white; color: white; padding: 10px 20px; margin: 0 10px; cursor: pointer; font-family: 'Inter', sans-serif; text-transform: uppercase; }
        .nav-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .sky-container ul { list-style: none; padding: 0; }
        .sky-container li { margin-bottom: 10px; }
    </style>
</head>
<body>
    <!-- Dynamic Content -->
    <div class="x-mark">
        <div class="container">
            <div class="left"></div>
            <div class="right"></div>
        </div>
    </div>
    <div class="intro-container">
        <h2 class="fancy-text">${escapeHtml(introTitle)}</h2>
        <h1>${mainTitle}</h1>
        <div class="button shift-camera-button">
            <div class="border">
                <div class="left-plane"></div><div class="right-plane"></div>
            </div>
            <div class="text">Começar</div>
        </div>
    </div>
    <div class="sky-container">
        <!-- Content will be injected here by JS -->
    </div>
     <div class="nav-arrows">
        <button id="prev-button" class="nav-button">Anterior</button>
        <button id="next-button" class="nav-button">Próximo</button>
    </div>

    <!-- Embedded Libraries -->
    <script>${GSAP_CODE}</script>
    <script>${THREE_JS_CODE}</script>

    <!-- Main Animation Script -->
    <script>
        "use strict";
        let camera, scene, renderer;
        let plane;
        let normalizedMouse = { x: 0, y: -180 };
        const slides = [
            { title: \`<h1>${escapeHtml(diagnosticSlide.title)}</h1><p class='fancy-text'>${escapeHtml(diagnosticSlide.question)}</p>\`, content: \`<ul>${diagnosticSlide.content.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>\` },
            { title: \`<h1>${escapeHtml(actionPlanSlide.title)}</h1>\`, content: \`<div>${actionPlanSlide.content.map(c => `<p>${escapeHtml(c)}</p>`).join('')}</div>\` },
            { title: \`<h1>${escapeHtml(timelineSlide.title)}</h1>\`, content: \`<ul>${timelineSlide.content.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>\` },
            { title: \`<h1>${escapeHtml(kpiSlide.title)}</h1>\`, content: \`<div>${kpiSlide.kpis.map(k => `<p><strong>${escapeHtml(k.metric)}:</strong> ${escapeHtml(k.estimate)}</p>`).join('')}</div>\` },
            { title: \`<h1>${escapeHtml(whyCpSlide.title)}</h1>\`, content: \`<ul>${whyCpSlide.content.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>\` },
            { title: \`<h1>${escapeHtml(justificationSlide.title)}</h1>\`, content: \`<p>${escapeHtml(justificationSlide.content)}</p>\` },
            { title: \`<h1>${escapeHtml(investmentSlide.title)}</h1>\`, content: \`<p>Total: ${escapeHtml(investmentSlide.finalTotal)}</p>\` },
            { title: \`<h1>${escapeHtml(nextStepsSlide.title)}</h1>\`, content: \`<ul>${nextStepsSlide.content.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>\` }
        ];
        let currentSlide = -1;

        function updateSlideContent() {
            if (currentSlide < 0 || currentSlide >= slides.length) {
                document.querySelector('.sky-container').innerHTML = '';
                return;
            }
            const slide = slides[currentSlide];
            document.querySelector('.sky-container').innerHTML = slide.title + slide.content;
            
            document.getElementById('prev-button').disabled = currentSlide === 0;
            document.getElementById('next-button').disabled = currentSlide === slides.length - 1;
        }

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            try {
                renderer = new THREE.WebGLRenderer({ antialias: true });
            } catch(e) {
                alert('WebGL is not supported in your browser.');
                return;
            }
            camera.position.z = 50;
            renderer.setClearColor("#121212", 1.0);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            document.body.appendChild(renderer.domElement);

            let topLight = new THREE.DirectionalLight(0xffffff, 1);
            topLight.position.set(0, 1, 1).normalize();
            scene.add(topLight);

            let geometry = new THREE.PlaneGeometry(400, 400, 70, 70);
            let darkBlueMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shading: THREE.FlatShading, side: THREE.DoubleSide, vertexColors: THREE.FaceColors });
            geometry.vertices.forEach(function (vertice) {
                vertice.x += (Math.random() - 0.5) * 4;
                vertice.y += (Math.random() - 0.5) * 4;
                vertice.z += (Math.random() - 0.5) * 4;
                vertice.dx = Math.random() - 0.5;
                vertice.dy = Math.random() - 0.5;
                vertice.randomDelay = Math.random() * 5;
            });
            for (var i = 0; i < geometry.faces.length; i++) {
                geometry.faces[i].color.setStyle("rgb(0,52,74)");
            }
            plane = new THREE.Mesh(geometry, darkBlueMaterial);
            scene.add(plane);
            render();
        }

        let timer = 0;
        function render() {
            requestAnimationFrame(render);
            timer += 0.01;
            if (plane && plane.geometry) {
              let vertices = plane.geometry.vertices;
              for (let i = 0; i < vertices.length; i++) {
                  vertices[i].x -= (Math.sin(timer + vertices[i].randomDelay) / 40) * vertices[i].dx;
                  vertices[i].y += (Math.sin(timer + vertices[i].randomDelay) / 40) * vertices[i].dy;
              }
              plane.geometry.verticesNeedUpdate = true;
              plane.geometry.elementsNeedUpdate = true;
            }
            if(renderer && scene && camera) {
                renderer.render(scene, camera);
            }
        }

        window.onload = function() {
            init();

            document.querySelector('.shift-camera-button').addEventListener('click', function() {
                let introTimeline = new TimelineMax();
                introTimeline.add([
                    TweenLite.to(document.querySelector('.intro-container'), 0.5, { opacity: 0, ease: Power3.easeIn, onComplete: () => { document.querySelector('.intro-container').style.pointerEvents = 'none'; } }),
                    TweenLite.to(camera.rotation, 3, { x: Math.PI / 2, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 2.5, { z: 20, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 3, { y: 120, ease: Power3.easeInOut }),
                    TweenLite.to(plane.scale, 3, { x: 2, ease: Power3.easeInOut }),
                ]);
                introTimeline.add([
                    TweenLite.to(document.querySelectorAll('.x-mark, .sky-container, .nav-arrows'), 2, { opacity: 1, ease: Power3.easeInOut, onStart: () => {
                         document.querySelector('.x-mark').style.pointerEvents = 'auto';
                         document.querySelector('.nav-arrows').style.pointerEvents = 'auto';
                         currentSlide = 0;
                         updateSlideContent();
                    } }),
                ]);
            });

            document.querySelector('.x-mark').addEventListener('click', function() {
                let outroTimeline = new TimelineMax();
                outroTimeline.add([
                    TweenLite.to(document.querySelectorAll('.x-mark, .sky-container, .nav-arrows'), 0.5, { opacity: 0, ease: Power3.easeInOut, onComplete: () => {
                        document.querySelector('.x-mark').style.pointerEvents = 'none';
                        document.querySelector('.nav-arrows').style.pointerEvents = 'none';
                        currentSlide = -1;
                        updateSlideContent();
                    }}),
                    TweenLite.to(camera.rotation, 3, { x: 0, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 3, { z: 50, ease: Power3.easeInOut }),
                    TweenLite.to(camera.position, 2.5, { y: 0, ease: Power3.easeInOut }),
                    TweenLite.to(plane.scale, 3, { x: 1, ease: Power3.easeInOut }),
                ]);
                outroTimeline.add([
                    TweenLite.to(document.querySelector('.intro-container'), 0.5, { opacity: 1, ease: Power3.easeIn, onComplete: () => { document.querySelector('.intro-container').style.pointerEvents = 'auto'; } }),
                ]);
            });

            document.getElementById('next-button').addEventListener('click', () => {
                if (currentSlide < slides.length - 1) {
                    currentSlide++;
                    updateSlideContent();
                }
            });

            document.getElementById('prev-button').addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateSlideContent();
                }
            });

            window.addEventListener("resize", function () {
                if(camera && renderer) {
                  camera.aspect = window.innerWidth / window.innerHeight;
                  camera.updateProjectionMatrix();
                  renderer.setSize(window.innerWidth, window.innerHeight);
                }
            });
        };
    </script>
</body>
</html>
  `;
}
