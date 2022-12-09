import * as adapter from '@astrojs/netlify/netlify-functions.js';
import * as React from 'react';
import React__default, { createElement } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
/* empty css                                *//* empty css                                                                */import { DataGrid } from '@mui/x-data-grid';
import { jsxs, jsx } from 'react/jsx-runtime';
import { getContrastRatio, lighten, darken, createTheme as createTheme$1, useTheme as useTheme$1, useThemeProps as useThemeProps$1, shouldForwardProp, createStyled, keyframes, unstable_extendSxProp, GlobalStyles as GlobalStyles$1, createBox, unstable_resolveBreakpointValues, handleBreakpoints, ThemeProvider } from '@mui/system';
import PropTypes from 'prop-types';
import { deepmerge, formatMuiErrorMessage, unstable_generateUtilityClass, unstable_generateUtilityClasses, unstable_capitalize, unstable_composeClasses, unstable_useForkRef, unstable_useIsFocusVisible, unstable_useEventCallback, refType, elementTypeAcceptingRef, unstable_ClassNameGenerator, unstable_requirePropFactory, unstable_unsupportedProp, unstable_debounce, unstable_ownerWindow, unstable_getNormalizedScrollLeft, unstable_ownerDocument, unstable_detectScrollType } from '@mui/utils';
import clsx from 'clsx';
import { isFragment } from 'react-is';
import { TransitionGroup } from 'react-transition-group';
import Brightness4Icon from '@mui/icons-material/Brightness4.js';
import Brightness7Icon from '@mui/icons-material/Brightness7.js';
import { optimize } from 'svgo';
/* empty css                                   */import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React__default.Component.isPrototypeOf(Component) || React__default.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React__default.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React__default.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
	};
	if (children != null) {
		newProps.children = React__default.createElement(StaticHtml, { value: children });
	}
	const vnode = React__default.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.on('error', (err) => {
			reject(err);
		});
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.6.12";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLBytes extends Uint8Array {
}
Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
  get() {
    return "HTMLBytes";
  }
});
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
async function* unescapeChunksAsync(iterable) {
  for await (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    title: "Unknown compiler error.",
    code: 1e3
  },
  StaticRedirectNotAvailable: {
    title: "`Astro.redirect` is not available in static mode.",
    code: 3001,
    message: "Redirects are only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  ClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in current adapter.",
    code: 3002,
    message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in static mode.",
    code: 3003,
    message: "`Astro.clientAddress` is only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    title: "No static path found for requested path.",
    code: 3004,
    message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    title: "Invalid type returned by Astro page.",
    code: 3005,
    message: (route, returnedValue) => `Route ${route ? route : ""} returned a \`${returnedValue}\`. Only a Response can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    title: "Missing value for `client:media` directive.",
    code: 3006,
    message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
  },
  NoMatchingRenderer: {
    title: "No matching renderer found.",
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are." : "is."} ${validRenderersCount} renderer${plural ? "s." : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were." : "it was not."} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    title: "No client entrypoint specified in renderer.",
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    title: "Missing hint on client:only directive.",
    code: 3009,
    message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidGetStaticPathParam: {
    title: "Invalid value returned by a `getStaticPaths` path.",
    code: 3010,
    message: (paramType) => `Invalid params given to \`getStaticPaths\` path. Expected an \`object\`, got \`${paramType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    title: "Invalid value returned by getStaticPaths.",
    code: 3011,
    message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRemovedRSSHelper: {
    title: "getStaticPaths RSS helper is not available anymore.",
    code: 3012,
    message: "The RSS helper has been removed from `getStaticPaths`. Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    title: "Missing params property on `getStaticPaths` route.",
    code: 3013,
    message: "Missing or empty required `params` property on `getStaticPaths` route.",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    title: "Invalid value for `getStaticPaths` route parameter.",
    code: 3014,
    message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    title: "`getStaticPaths()` function required for dynamic routes.",
    code: 3015,
    message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    title: "Invalid slot name.",
    code: 3016,
    message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    title: "Cannot use Server-side Rendering without an adapter.",
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    title: "No import found for component.",
    code: 3018,
    message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
    hint: "Please make sure the component is properly imported."
  },
  UnknownViteError: {
    title: "Unknown Vite Error.",
    code: 4e3
  },
  FailedToLoadModuleSSR: {
    title: "Could not import file.",
    code: 4001,
    message: (importName) => `Could not import \`${importName}\`.`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    title: "Invalid glob pattern.",
    code: 4002,
    message: (globPattern) => `Invalid glob pattern: \`${globPattern}\`. Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownCSSError: {
    title: "Unknown CSS Error.",
    code: 5e3
  },
  CSSSyntaxError: {
    title: "CSS Syntax Error.",
    code: 5001
  },
  UnknownMarkdownError: {
    title: "Unknown Markdown Error.",
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    title: "Failed to parse Markdown frontmatter.",
    code: 6001
  },
  UnknownConfigError: {
    title: "Unknown configuration error.",
    code: 7e3
  },
  ConfigNotFound: {
    title: "Specified configuration file not found.",
    code: 7001,
    message: (configFile) => `Unable to resolve \`--config "${configFile}"\`. Does the file exist?`
  },
  ConfigLegacyKey: {
    title: "Legacy configuration detected.",
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: \`${legacyConfigKey}\`.`,
    hint: "Please update your configuration to the new format.\nSee https://astro.build/config for more information."
  },
  UnknownError: {
    title: "Unknown Error.",
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, title, message, stack, location, hint, frame } = props;
    this.errorCode = code;
    if (name) {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    this.title = title;
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    var _a;
    this.errorCode = errorCode;
    this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
  }
  setLocation(location) {
    this.loc = location;
  }
  setName(name) {
    this.name = name;
  }
  setMessage(message) {
    this.message = message;
  }
  setHint(hint) {
    this.hint = hint;
  }
  setFrame(source, location) {
    this.frame = codeFrame(source, location);
  }
  static is(err) {
    return err.type === "AstroError";
  }
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(AstroErrorData.MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.error = void 0;
    this.expressions = expressions.map((expression) => {
      if (isPromise(expression)) {
        return Promise.resolve(expression).catch((err) => {
          if (!this.error) {
            this.error = err;
            throw err;
          }
        });
      }
      return expression;
    });
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let parts = new HTMLParts();
  for await (const chunk of renderAstroComponent(Component)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}, route) {
  var _a, _b;
  Component = await Component ?? Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const { slotInstructions: slotInstructions2, children: children2 } = await renderSlots(result, slots);
      const html2 = Component.render({ slots: children2 });
      const hydrationHtml = slotInstructions2 ? slotInstructions2.map((instr) => stringifyChunk(result, instr)).join("") : "";
      return markHTMLString(hydrationHtml + html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
function renderHead(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function __astro_tag_component__(Component, rendererName) {
  if (!Component)
    return;
  if (typeof Component !== "function")
    return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$Astro$s = createAstro("D:/flutter_projects/astro_landing/src/components/container.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Container = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$s, $$props, $$slots);
  Astro2.self = $$Container;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["max-w-screen-xl mx-auto px-5", className], "class:list")}>
  ${renderSlot($$result, $$slots["default"])}
</div>`;
});

const $$Astro$r = createAstro("D:/flutter_projects/astro_landing/src/components/hero.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$r, $$props, $$slots);
  Astro2.self = $$Hero;
  return renderTemplate`${maybeRenderHead($$result)}<main class="grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-8">
  <div class="py-6 md:order-1 hidden md:block">
    <!-- <Image
      src={heroImage}
      alt="Commodities in the air"
      loading="eager"
      format="avif"
    /> -->
  </div>
  <div>
    <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight">
      Industry Cloud for Commodity Trading
    </h1>
    <p class="text-lg mt-4 text-slate-600 max-w-xl">
      Make your bunkering process easier and painless with Sealion
    </p>
    <div class="mt-6 flex flex-col sm:flex-row gap-3">

    </div>
  </div>
</main>`;
});

const $$Astro$q = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-seo/src/components/OpenGraphArticleTags.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$OpenGraphArticleTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$q, $$props, $$slots);
  Astro2.self = $$OpenGraphArticleTags;
  const { publishedTime, modifiedTime, expirationTime, authors, section, tags } = Astro2.props.openGraph.article;
  return renderTemplate`${publishedTime ? renderTemplate`<meta property="article:published_time"${addAttribute(publishedTime, "content")}>` : null}
${modifiedTime ? renderTemplate`<meta property="article:modified_time"${addAttribute(modifiedTime, "content")}>` : null}
${expirationTime ? renderTemplate`<meta property="article:expiration_time"${addAttribute(expirationTime, "content")}>` : null}
${authors ? authors.map((author) => renderTemplate`<meta property="article:author"${addAttribute(author, "content")}>`) : null}
${section ? renderTemplate`<meta property="article:section"${addAttribute(section, "content")}>` : null}
${tags ? tags.map((tag) => renderTemplate`<meta property="article:tag"${addAttribute(tag, "content")}>`) : null}
`;
});

const $$Astro$p = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-seo/src/components/OpenGraphBasicTags.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$OpenGraphBasicTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$p, $$props, $$slots);
  Astro2.self = $$OpenGraphBasicTags;
  const { openGraph } = Astro2.props;
  return renderTemplate`<meta property="og:title"${addAttribute(openGraph.basic.title, "content")}>
<meta property="og:type"${addAttribute(openGraph.basic.type, "content")}>
<meta property="og:image"${addAttribute(openGraph.basic.image, "content")}>
<meta property="og:url"${addAttribute(openGraph.basic.url || Astro2.url.href, "content")}>
`;
});

const $$Astro$o = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-seo/src/components/OpenGraphImageTags.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$OpenGraphImageTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$o, $$props, $$slots);
  Astro2.self = $$OpenGraphImageTags;
  const { image } = Astro2.props.openGraph.basic;
  const { url, secureUrl, type, width, height, alt } = Astro2.props.openGraph.image;
  return renderTemplate`<meta property="og:image:url"${addAttribute(image, "content")}>
${secureUrl ? renderTemplate`<meta property="og:image:secure_url"${addAttribute(secureUrl, "content")}>` : null}
${type ? renderTemplate`<meta property="og:image:type"${addAttribute(type, "content")}>` : null}
${width ? renderTemplate`<meta property="og:image:width"${addAttribute(width, "content")}>` : null}
${!(height === null) ? renderTemplate`<meta property="og:image:height"${addAttribute(height, "content")}>` : null}
${!(alt === null) ? renderTemplate`<meta property="og:image:alt"${addAttribute(alt, "content")}>` : null}
`;
});

const $$Astro$n = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-seo/src/components/OpenGraphOptionalTags.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$OpenGraphOptionalTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$n, $$props, $$slots);
  Astro2.self = $$OpenGraphOptionalTags;
  const { optional } = Astro2.props.openGraph;
  return renderTemplate`${optional.audio ? renderTemplate`<meta property="og:audio"${addAttribute(optional.audio, "content")}>` : null}
${optional.description ? renderTemplate`<meta property="og:description"${addAttribute(optional.description, "content")}>` : null}
${optional.determiner ? renderTemplate`<meta property="og:determiner"${addAttribute(optional.determiner, "content")}>` : null}
${optional.locale ? renderTemplate`<meta property="og:locale"${addAttribute(optional.locale, "content")}>` : null}
${optional.localeAlternate?.map((locale) => renderTemplate`<meta property="og:locale:alternate"${addAttribute(locale, "content")}>`)}
${optional.siteName ? renderTemplate`<meta property="og:site_name"${addAttribute(optional.siteName, "content")}>` : null}
${optional.video ? renderTemplate`<meta property="og:video"${addAttribute(optional.video, "content")}>` : null}
`;
});

const $$Astro$m = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-seo/src/components/ExtendedTags.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$ExtendedTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$m, $$props, $$slots);
  Astro2.self = $$ExtendedTags;
  const { props } = Astro2;
  return renderTemplate`${props.extend.link?.map((attributes) => renderTemplate`<link${spreadAttributes(attributes)}>`)}
${props.extend.meta?.map(({ content, httpEquiv, name, property }) => renderTemplate`<meta${addAttribute(content, "content")}${addAttribute(httpEquiv, "http-eqiv")}${addAttribute(name, "name")}${addAttribute(property, "property")}>`)}
`;
});

const $$Astro$l = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-seo/src/components/TwitterTags.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$TwitterTags = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$TwitterTags;
  const { card, site, creator } = Astro2.props.twitter;
  return renderTemplate`${card ? renderTemplate`<meta name="twitter:card"${addAttribute(card, "content")}>` : null}
${site ? renderTemplate`<meta name="twitter:site"${addAttribute(site, "content")}>` : null}
${creator ? renderTemplate`<meta name="twitter:creator"${addAttribute(creator, "content")}>` : null}
`;
});

const $$Astro$k = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-seo/src/SEO.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$SEO = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$SEO;
  const { props } = Astro2;
  const { title, description, canonical, noindex, nofollow } = props;
  function validateProps(props2) {
    const { openGraph, description: description2 } = props2;
    if (openGraph) {
      if (!openGraph.basic || openGraph.basic.title == null || openGraph.basic.type == null || openGraph.basic.image == null) {
        throw new Error(
          "If you pass the openGraph prop, you have to at least define the title, type, and image basic properties!"
        );
      }
    }
    if (title && openGraph?.basic.title) {
      if (title == openGraph.basic.title) {
        console.warn(
          "WARNING(astro-seo): You passed the same value to `title` and `openGraph.optional.title`. This is most likely not what you want. See docs for more."
        );
      }
    }
    if (openGraph?.basic?.image && !openGraph?.image?.alt) {
      console.warn(
        "WARNING(astro-seo): You defined `openGraph.basic.image`, but didn't define `openGraph.image.alt`. This is stongly discouraged.'"
      );
    }
  }
  validateProps(props);
  return renderTemplate`${title ? renderTemplate`<title>${unescapeHTML(title)}</title>` : null}

<link rel="canonical"${addAttribute(canonical || Astro2.url.href, "href")}>

${description ? renderTemplate`<meta name="description"${addAttribute(description, "content")}>` : null}

<meta name="robots"${addAttribute(`${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`, "content")}>

${props.openGraph && renderTemplate`${renderComponent($$result, "OpenGraphBasicTags", $$OpenGraphBasicTags, { ...props })}`}
${props.openGraph?.optional && renderTemplate`${renderComponent($$result, "OpenGraphOptionalTags", $$OpenGraphOptionalTags, { ...props })}`}
${props.openGraph?.image && renderTemplate`${renderComponent($$result, "OpenGraphImageTags", $$OpenGraphImageTags, { ...props })}`}
${props.openGraph?.article && renderTemplate`${renderComponent($$result, "OpenGraphArticleTags", $$OpenGraphArticleTags, { ...props })}`}
${props.twitter && renderTemplate`${renderComponent($$result, "TwitterTags", $$TwitterTags, { ...props })}`}
${props.extend && renderTemplate`${renderComponent($$result, "ExtendedTags", $$ExtendedTags, { ...props })}`}`;
});

const $$Astro$j = createAstro("D:/flutter_projects/astro_landing/src/components/footer.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$Footer;
  return renderTemplate`${maybeRenderHead($$result)}<footer class="my-20">
  <p class="text-center text-sm text-slate-500">
    Copyright © ${new Date().getFullYear()} Neptune Cloud. All rights reserved.
  </p>
  <!--
    Can we ask you a favor 🙏
    Please keep this backlink on your website if possible.
    or Purchase a commercial license from https://web3templates.com
  -->
  <p class="text-center text-xs text-slate-500 mt-1">
    Part of <a href="https://nptn.io" target="_blank" rel="noopener" class="hover:underline">
      nptn.io
    </a>
  </p>
</footer>`;
});

const $$Astro$i = createAstro("D:/flutter_projects/astro_landing/src/components/navbar/dropdown.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Dropdown = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Dropdown;
  const { title, lastItem, children } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<li @click.away="open = false" class="relative" x-data="{ open: false }">
  <button @click="open = !open" class="flex items-center gap-1 w-full lg:w-auto lg:px-3 py-2 text-gray-600 hover:text-gray-900">
    <span>${title}</span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-3 h-3 mt-0.5" :class="{'rotate-180': open, 'rotate-0': !open}">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
    </svg>
  </button>
  <div x-cloak x-show="open"${addAttribute([
    "lg:absolute  w-full  lg:w-48",
    lastItem ? "lg:right-0 origin-top-right" : "lg:left-0 origin-top-left"
  ], "class:list")}>
    <div class="px-3 lg:py-2 lg:bg-white lg:rounded-md lg:shadow lg:border flex flex-col">
      ${children.map((item) => renderTemplate`<a${addAttribute(item.path, "href")} class="py-1 text-gray-600 hover:text-gray-900">
            ${item.title}
          </a>`)}
    </div>
  </div>
</li>`;
});

const $$Astro$h = createAstro("D:/flutter_projects/astro_landing/src/components/navbar/navbar.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Navbar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$Navbar;
  const menuitems = [
    {
      title: "ISO Fuel Spec Checker",
      path: "/spec-checker"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Container", $$Container, {}, { "default": () => renderTemplate`${maybeRenderHead($$result)}<header class="flex flex-col lg:flex-row justify-between items-center my-5" x-data="{ open: false }" x-init="$watch('open', value => console.log(value))">
    <div class="flex w-full lg:w-auto items-center justify-between">
      <a href="/" class="text-lg"><span class="font-bold text-slate-800">Neptune</span><span class="text-slate-500">cloud</span>
      </a>
      <div class="block lg:hidden">
        <button @click="open = !open" class="text-gray-800">
          <svg fill="currentColor" class="w-4 h-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>Menu</title>
            <path x-cloak x-show="open" fill-rule="evenodd" clip-rule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"></path>
            <path x-show="!open" fill-rule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"></path>
          </svg>
        </button>
      </div>
    </div>
    <nav class="hidden w-full lg:w-auto mt-2 lg:flex lg:mt-0" :class="{ 'block': open, 'hidden': !open }" x-transition>
      <ul class="flex flex-col lg:flex-row lg:gap-3">
        ${menuitems.map((item, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${item.children && renderTemplate`${renderComponent($$result, "Dropdown", $$Dropdown, { "title": item.title, "children": item.children, "lastItem": index === menuitems.length - 1 })}`}${!item.children && renderTemplate`<li>
                  <a${addAttribute(item.path, "href")} class="flex lg:px-3 py-2 text-gray-600 hover:text-gray-900">
                    ${item.title}
                  </a>
                </li>`}` })}`)}
      </ul>
      <!-- <div class="lg:hidden flex items-center mt-3 gap-4">
        <Link href="#" style="muted" block size="md">Log in</Link>
        <Link href="#" size="md" block>Sign up</Link>
      </div> -->
    </nav>
    <div>
      <!-- <div class="hidden lg:flex items-center gap-4">
        <a href="#">Log in</a>
        <Link href="#" size="md">Sign up</Link>
      </div> -->
    </div>
  </header>` })}`;
});

const $$Astro$g = createAstro("D:/flutter_projects/astro_landing/src/layouts/Layout.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$Layout;
  const canonicalURL = new URL(Astro2.url.pathname, Astro2.site).toString();
  const resolvedImageWithDomain = new URL(
    "/opengraph.jpg",
    Astro2.site
  ).toString();
  const { title } = Astro2.props;
  const makeTitle = title ? title : "Sealion -Sealion is Commodity Trading B2B SaaS.";
  return renderTemplate`<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <meta name="generator"${addAttribute(Astro2.generator, "content")}>

    <!-- <link rel="preload" as="image" href={src} alt="Hero" /> -->
    ${renderComponent($$result, "SEO", $$SEO, { "title": makeTitle, "description": "Sealion is Commodity Trading B2B SaaS.", "canonical": canonicalURL, "twitter": {
    creator: "@surjithctly",
    site: "@web3templates",
    card: "summary_large_image"
  }, "openGraph": {
    basic: {
      url: canonicalURL,
      type: "website",
      title: `Neptunecloud - B2B Service for Commodity Traders`,
      image: resolvedImageWithDomain
    },
    image: {
      alt: "NeptuneCloud Sealion Homepage Screenshot"
    }
  } })}
  ${renderHead($$result)}</head>
  <body>
    ${renderComponent($$result, "Navbar", $$Navbar, {})}
    ${renderSlot($$result, $$slots["default"])}
    ${renderComponent($$result, "Footer", $$Footer, {})}
    
  </body>
</html>`;
});

const $$Astro$f = createAstro("D:/flutter_projects/astro_landing/src/pages/index.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "" }, { "default": () => renderTemplate`${renderComponent($$result, "Container", $$Container, {}, { "default": () => renderTemplate`${renderComponent($$result, "Hero", $$Hero, {})}` })}` })}`;
});

const $$file$5 = "D:/flutter_projects/astro_landing/src/pages/index.astro";
const $$url$5 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const common = {
  black: '#000',
  white: '#fff'
};
const common$1 = common;

const red = {
  50: '#ffebee',
  100: '#ffcdd2',
  200: '#ef9a9a',
  300: '#e57373',
  400: '#ef5350',
  500: '#f44336',
  600: '#e53935',
  700: '#d32f2f',
  800: '#c62828',
  900: '#b71c1c',
  A100: '#ff8a80',
  A200: '#ff5252',
  A400: '#ff1744',
  A700: '#d50000'
};
const red$1 = red;

const purple = {
  50: '#f3e5f5',
  100: '#e1bee7',
  200: '#ce93d8',
  300: '#ba68c8',
  400: '#ab47bc',
  500: '#9c27b0',
  600: '#8e24aa',
  700: '#7b1fa2',
  800: '#6a1b9a',
  900: '#4a148c',
  A100: '#ea80fc',
  A200: '#e040fb',
  A400: '#d500f9',
  A700: '#aa00ff'
};
const purple$1 = purple;

const blue = {
  50: '#e3f2fd',
  100: '#bbdefb',
  200: '#90caf9',
  300: '#64b5f6',
  400: '#42a5f5',
  500: '#2196f3',
  600: '#1e88e5',
  700: '#1976d2',
  800: '#1565c0',
  900: '#0d47a1',
  A100: '#82b1ff',
  A200: '#448aff',
  A400: '#2979ff',
  A700: '#2962ff'
};
const blue$1 = blue;

const lightBlue = {
  50: '#e1f5fe',
  100: '#b3e5fc',
  200: '#81d4fa',
  300: '#4fc3f7',
  400: '#29b6f6',
  500: '#03a9f4',
  600: '#039be5',
  700: '#0288d1',
  800: '#0277bd',
  900: '#01579b',
  A100: '#80d8ff',
  A200: '#40c4ff',
  A400: '#00b0ff',
  A700: '#0091ea'
};
const lightBlue$1 = lightBlue;

const green = {
  50: '#e8f5e9',
  100: '#c8e6c9',
  200: '#a5d6a7',
  300: '#81c784',
  400: '#66bb6a',
  500: '#4caf50',
  600: '#43a047',
  700: '#388e3c',
  800: '#2e7d32',
  900: '#1b5e20',
  A100: '#b9f6ca',
  A200: '#69f0ae',
  A400: '#00e676',
  A700: '#00c853'
};
const green$1 = green;

const orange = {
  50: '#fff3e0',
  100: '#ffe0b2',
  200: '#ffcc80',
  300: '#ffb74d',
  400: '#ffa726',
  500: '#ff9800',
  600: '#fb8c00',
  700: '#f57c00',
  800: '#ef6c00',
  900: '#e65100',
  A100: '#ffd180',
  A200: '#ffab40',
  A400: '#ff9100',
  A700: '#ff6d00'
};
const orange$1 = orange;

const grey = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#eeeeee',
  300: '#e0e0e0',
  400: '#bdbdbd',
  500: '#9e9e9e',
  600: '#757575',
  700: '#616161',
  800: '#424242',
  900: '#212121',
  A100: '#f5f5f5',
  A200: '#eeeeee',
  A400: '#bdbdbd',
  A700: '#616161'
};
const grey$1 = grey;

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

function createMixins(breakpoints, mixins) {
  return _extends({
    toolbar: {
      minHeight: 56,
      [breakpoints.up('xs')]: {
        '@media (orientation: landscape)': {
          minHeight: 48
        }
      },
      [breakpoints.up('sm')]: {
        minHeight: 64
      }
    }
  }, mixins);
}

const _excluded$d = ["mode", "contrastThreshold", "tonalOffset"];
const light = {
  // The colors used to style the text.
  text: {
    // The most important text.
    primary: 'rgba(0, 0, 0, 0.87)',
    // Secondary text.
    secondary: 'rgba(0, 0, 0, 0.6)',
    // Disabled text have even lower visual prominence.
    disabled: 'rgba(0, 0, 0, 0.38)'
  },
  // The color used to divide different elements.
  divider: 'rgba(0, 0, 0, 0.12)',
  // The background colors used to style the surfaces.
  // Consistency between these values is important.
  background: {
    paper: common$1.white,
    default: common$1.white
  },
  // The colors used to style the action elements.
  action: {
    // The color of an active action like an icon button.
    active: 'rgba(0, 0, 0, 0.54)',
    // The color of an hovered action.
    hover: 'rgba(0, 0, 0, 0.04)',
    hoverOpacity: 0.04,
    // The color of a selected action.
    selected: 'rgba(0, 0, 0, 0.08)',
    selectedOpacity: 0.08,
    // The color of a disabled action.
    disabled: 'rgba(0, 0, 0, 0.26)',
    // The background color of a disabled action.
    disabledBackground: 'rgba(0, 0, 0, 0.12)',
    disabledOpacity: 0.38,
    focus: 'rgba(0, 0, 0, 0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.12
  }
};
const dark = {
  text: {
    primary: common$1.white,
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    icon: 'rgba(255, 255, 255, 0.5)'
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  background: {
    paper: '#121212',
    default: '#121212'
  },
  action: {
    active: common$1.white,
    hover: 'rgba(255, 255, 255, 0.08)',
    hoverOpacity: 0.08,
    selected: 'rgba(255, 255, 255, 0.16)',
    selectedOpacity: 0.16,
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    disabledOpacity: 0.38,
    focus: 'rgba(255, 255, 255, 0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.24
  }
};
function addLightOrDark(intent, direction, shade, tonalOffset) {
  const tonalOffsetLight = tonalOffset.light || tonalOffset;
  const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
  if (!intent[direction]) {
    if (intent.hasOwnProperty(shade)) {
      intent[direction] = intent[shade];
    } else if (direction === 'light') {
      intent.light = lighten(intent.main, tonalOffsetLight);
    } else if (direction === 'dark') {
      intent.dark = darken(intent.main, tonalOffsetDark);
    }
  }
}
function getDefaultPrimary(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: blue$1[200],
      light: blue$1[50],
      dark: blue$1[400]
    };
  }
  return {
    main: blue$1[700],
    light: blue$1[400],
    dark: blue$1[800]
  };
}
function getDefaultSecondary(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: purple$1[200],
      light: purple$1[50],
      dark: purple$1[400]
    };
  }
  return {
    main: purple$1[500],
    light: purple$1[300],
    dark: purple$1[700]
  };
}
function getDefaultError(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: red$1[500],
      light: red$1[300],
      dark: red$1[700]
    };
  }
  return {
    main: red$1[700],
    light: red$1[400],
    dark: red$1[800]
  };
}
function getDefaultInfo(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: lightBlue$1[400],
      light: lightBlue$1[300],
      dark: lightBlue$1[700]
    };
  }
  return {
    main: lightBlue$1[700],
    light: lightBlue$1[500],
    dark: lightBlue$1[900]
  };
}
function getDefaultSuccess(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: green$1[400],
      light: green$1[300],
      dark: green$1[700]
    };
  }
  return {
    main: green$1[800],
    light: green$1[500],
    dark: green$1[900]
  };
}
function getDefaultWarning(mode = 'light') {
  if (mode === 'dark') {
    return {
      main: orange$1[400],
      light: orange$1[300],
      dark: orange$1[700]
    };
  }
  return {
    main: '#ed6c02',
    // closest to orange[800] that pass 3:1.
    light: orange$1[500],
    dark: orange$1[900]
  };
}
function createPalette(palette) {
  const {
      mode = 'light',
      contrastThreshold = 3,
      tonalOffset = 0.2
    } = palette,
    other = _objectWithoutPropertiesLoose(palette, _excluded$d);
  const primary = palette.primary || getDefaultPrimary(mode);
  const secondary = palette.secondary || getDefaultSecondary(mode);
  const error = palette.error || getDefaultError(mode);
  const info = palette.info || getDefaultInfo(mode);
  const success = palette.success || getDefaultSuccess(mode);
  const warning = palette.warning || getDefaultWarning(mode);

  // Use the same logic as
  // Bootstrap: https://github.com/twbs/bootstrap/blob/1d6e3710dd447de1a200f29e8fa521f8a0908f70/scss/_functions.scss#L59
  // and material-components-web https://github.com/material-components/material-components-web/blob/ac46b8863c4dab9fc22c4c662dc6bd1b65dd652f/packages/mdc-theme/_functions.scss#L54
  function getContrastText(background) {
    const contrastText = getContrastRatio(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
    if (process.env.NODE_ENV !== 'production') {
      const contrast = getContrastRatio(background, contrastText);
      if (contrast < 3) {
        console.error([`MUI: The contrast ratio of ${contrast}:1 for ${contrastText} on ${background}`, 'falls below the WCAG recommended absolute minimum contrast ratio of 3:1.', 'https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast'].join('\n'));
      }
    }
    return contrastText;
  }
  const augmentColor = ({
    color,
    name,
    mainShade = 500,
    lightShade = 300,
    darkShade = 700
  }) => {
    color = _extends({}, color);
    if (!color.main && color[mainShade]) {
      color.main = color[mainShade];
    }
    if (!color.hasOwnProperty('main')) {
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The color${name ? ` (${name})` : ''} provided to augmentColor(color) is invalid.
The color object needs to have a \`main\` property or a \`${mainShade}\` property.` : formatMuiErrorMessage(11, name ? ` (${name})` : '', mainShade));
    }
    if (typeof color.main !== 'string') {
      throw new Error(process.env.NODE_ENV !== "production" ? `MUI: The color${name ? ` (${name})` : ''} provided to augmentColor(color) is invalid.
\`color.main\` should be a string, but \`${JSON.stringify(color.main)}\` was provided instead.

Did you intend to use one of the following approaches?

import { green } from "@mui/material/colors";

const theme1 = createTheme({ palette: {
  primary: green,
} });

const theme2 = createTheme({ palette: {
  primary: { main: green[500] },
} });` : formatMuiErrorMessage(12, name ? ` (${name})` : '', JSON.stringify(color.main)));
    }
    addLightOrDark(color, 'light', lightShade, tonalOffset);
    addLightOrDark(color, 'dark', darkShade, tonalOffset);
    if (!color.contrastText) {
      color.contrastText = getContrastText(color.main);
    }
    return color;
  };
  const modes = {
    dark,
    light
  };
  if (process.env.NODE_ENV !== 'production') {
    if (!modes[mode]) {
      console.error(`MUI: The palette mode \`${mode}\` is not supported.`);
    }
  }
  const paletteOutput = deepmerge(_extends({
    // A collection of common colors.
    common: _extends({}, common$1),
    // prevent mutable object.
    // The palette mode, can be light or dark.
    mode,
    // The colors used to represent primary interface elements for a user.
    primary: augmentColor({
      color: primary,
      name: 'primary'
    }),
    // The colors used to represent secondary interface elements for a user.
    secondary: augmentColor({
      color: secondary,
      name: 'secondary',
      mainShade: 'A400',
      lightShade: 'A200',
      darkShade: 'A700'
    }),
    // The colors used to represent interface elements that the user should be made aware of.
    error: augmentColor({
      color: error,
      name: 'error'
    }),
    // The colors used to represent potentially dangerous actions or important messages.
    warning: augmentColor({
      color: warning,
      name: 'warning'
    }),
    // The colors used to present information to the user that is neutral and not necessarily important.
    info: augmentColor({
      color: info,
      name: 'info'
    }),
    // The colors used to indicate the successful completion of an action that user triggered.
    success: augmentColor({
      color: success,
      name: 'success'
    }),
    // The grey colors.
    grey: grey$1,
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold,
    // Takes a background color and returns the text color that maximizes the contrast.
    getContrastText,
    // Generate a rich color object.
    augmentColor,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset
  }, modes[mode]), other);
  return paletteOutput;
}

const _excluded$c = ["fontFamily", "fontSize", "fontWeightLight", "fontWeightRegular", "fontWeightMedium", "fontWeightBold", "htmlFontSize", "allVariants", "pxToRem"];
function round(value) {
  return Math.round(value * 1e5) / 1e5;
}
const caseAllCaps = {
  textTransform: 'uppercase'
};
const defaultFontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';

/**
 * @see @link{https://m2.material.io/design/typography/the-type-system.html}
 * @see @link{https://m2.material.io/design/typography/understanding-typography.html}
 */
function createTypography(palette, typography) {
  const _ref = typeof typography === 'function' ? typography(palette) : typography,
    {
      fontFamily = defaultFontFamily,
      // The default font size of the Material Specification.
      fontSize = 14,
      // px
      fontWeightLight = 300,
      fontWeightRegular = 400,
      fontWeightMedium = 500,
      fontWeightBold = 700,
      // Tell MUI what's the font-size on the html element.
      // 16px is the default font-size used by browsers.
      htmlFontSize = 16,
      // Apply the CSS properties to all the variants.
      allVariants,
      pxToRem: pxToRem2
    } = _ref,
    other = _objectWithoutPropertiesLoose(_ref, _excluded$c);
  if (process.env.NODE_ENV !== 'production') {
    if (typeof fontSize !== 'number') {
      console.error('MUI: `fontSize` is required to be a number.');
    }
    if (typeof htmlFontSize !== 'number') {
      console.error('MUI: `htmlFontSize` is required to be a number.');
    }
  }
  const coef = fontSize / 14;
  const pxToRem = pxToRem2 || (size => `${size / htmlFontSize * coef}rem`);
  const buildVariant = (fontWeight, size, lineHeight, letterSpacing, casing) => _extends({
    fontFamily,
    fontWeight,
    fontSize: pxToRem(size),
    // Unitless following https://meyerweb.com/eric/thoughts/2006/02/08/unitless-line-heights/
    lineHeight
  }, fontFamily === defaultFontFamily ? {
    letterSpacing: `${round(letterSpacing / size)}em`
  } : {}, casing, allVariants);
  const variants = {
    h1: buildVariant(fontWeightLight, 96, 1.167, -1.5),
    h2: buildVariant(fontWeightLight, 60, 1.2, -0.5),
    h3: buildVariant(fontWeightRegular, 48, 1.167, 0),
    h4: buildVariant(fontWeightRegular, 34, 1.235, 0.25),
    h5: buildVariant(fontWeightRegular, 24, 1.334, 0),
    h6: buildVariant(fontWeightMedium, 20, 1.6, 0.15),
    subtitle1: buildVariant(fontWeightRegular, 16, 1.75, 0.15),
    subtitle2: buildVariant(fontWeightMedium, 14, 1.57, 0.1),
    body1: buildVariant(fontWeightRegular, 16, 1.5, 0.15),
    body2: buildVariant(fontWeightRegular, 14, 1.43, 0.15),
    button: buildVariant(fontWeightMedium, 14, 1.75, 0.4, caseAllCaps),
    caption: buildVariant(fontWeightRegular, 12, 1.66, 0.4),
    overline: buildVariant(fontWeightRegular, 12, 2.66, 1, caseAllCaps)
  };
  return deepmerge(_extends({
    htmlFontSize,
    pxToRem,
    fontFamily,
    fontSize,
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold
  }, variants), other, {
    clone: false // No need to clone deep
  });
}

const shadowKeyUmbraOpacity = 0.2;
const shadowKeyPenumbraOpacity = 0.14;
const shadowAmbientShadowOpacity = 0.12;
function createShadow(...px) {
  return [`${px[0]}px ${px[1]}px ${px[2]}px ${px[3]}px rgba(0,0,0,${shadowKeyUmbraOpacity})`, `${px[4]}px ${px[5]}px ${px[6]}px ${px[7]}px rgba(0,0,0,${shadowKeyPenumbraOpacity})`, `${px[8]}px ${px[9]}px ${px[10]}px ${px[11]}px rgba(0,0,0,${shadowAmbientShadowOpacity})`].join(',');
}

// Values from https://github.com/material-components/material-components-web/blob/be8747f94574669cb5e7add1a7c54fa41a89cec7/packages/mdc-elevation/_variables.scss
const shadows = ['none', createShadow(0, 2, 1, -1, 0, 1, 1, 0, 0, 1, 3, 0), createShadow(0, 3, 1, -2, 0, 2, 2, 0, 0, 1, 5, 0), createShadow(0, 3, 3, -2, 0, 3, 4, 0, 0, 1, 8, 0), createShadow(0, 2, 4, -1, 0, 4, 5, 0, 0, 1, 10, 0), createShadow(0, 3, 5, -1, 0, 5, 8, 0, 0, 1, 14, 0), createShadow(0, 3, 5, -1, 0, 6, 10, 0, 0, 1, 18, 0), createShadow(0, 4, 5, -2, 0, 7, 10, 1, 0, 2, 16, 1), createShadow(0, 5, 5, -3, 0, 8, 10, 1, 0, 3, 14, 2), createShadow(0, 5, 6, -3, 0, 9, 12, 1, 0, 3, 16, 2), createShadow(0, 6, 6, -3, 0, 10, 14, 1, 0, 4, 18, 3), createShadow(0, 6, 7, -4, 0, 11, 15, 1, 0, 4, 20, 3), createShadow(0, 7, 8, -4, 0, 12, 17, 2, 0, 5, 22, 4), createShadow(0, 7, 8, -4, 0, 13, 19, 2, 0, 5, 24, 4), createShadow(0, 7, 9, -4, 0, 14, 21, 2, 0, 5, 26, 4), createShadow(0, 8, 9, -5, 0, 15, 22, 2, 0, 6, 28, 5), createShadow(0, 8, 10, -5, 0, 16, 24, 2, 0, 6, 30, 5), createShadow(0, 8, 11, -5, 0, 17, 26, 2, 0, 6, 32, 5), createShadow(0, 9, 11, -5, 0, 18, 28, 2, 0, 7, 34, 6), createShadow(0, 9, 12, -6, 0, 19, 29, 2, 0, 7, 36, 6), createShadow(0, 10, 13, -6, 0, 20, 31, 3, 0, 8, 38, 7), createShadow(0, 10, 13, -6, 0, 21, 33, 3, 0, 8, 40, 7), createShadow(0, 10, 14, -6, 0, 22, 35, 3, 0, 8, 42, 7), createShadow(0, 11, 14, -7, 0, 23, 36, 3, 0, 9, 44, 8), createShadow(0, 11, 15, -7, 0, 24, 38, 3, 0, 9, 46, 8)];
const shadows$1 = shadows;

const _excluded$b = ["duration", "easing", "delay"];
// Follow https://material.google.com/motion/duration-easing.html#duration-easing-natural-easing-curves
// to learn the context in which each easing should be used.
const easing = {
  // This is the most common easing curve.
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Objects enter the screen at full velocity from off-screen and
  // slowly decelerate to a resting point.
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Objects leave the screen at full velocity. They do not decelerate when off-screen.
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  // The sharp curve is used by objects that may return to the screen at any time.
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
};

// Follow https://m2.material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
// to learn when use what timing
const duration = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195
};
function formatMs(milliseconds) {
  return `${Math.round(milliseconds)}ms`;
}
function getAutoHeightDuration(height) {
  if (!height) {
    return 0;
  }
  const constant = height / 36;

  // https://www.wolframalpha.com/input/?i=(4+%2B+15+*+(x+%2F+36+)+**+0.25+%2B+(x+%2F+36)+%2F+5)+*+10
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}
function createTransitions(inputTransitions) {
  const mergedEasing = _extends({}, easing, inputTransitions.easing);
  const mergedDuration = _extends({}, duration, inputTransitions.duration);
  const create = (props = ['all'], options = {}) => {
    const {
        duration: durationOption = mergedDuration.standard,
        easing: easingOption = mergedEasing.easeInOut,
        delay = 0
      } = options,
      other = _objectWithoutPropertiesLoose(options, _excluded$b);
    if (process.env.NODE_ENV !== 'production') {
      const isString = value => typeof value === 'string';
      // IE11 support, replace with Number.isNaN
      // eslint-disable-next-line no-restricted-globals
      const isNumber = value => !isNaN(parseFloat(value));
      if (!isString(props) && !Array.isArray(props)) {
        console.error('MUI: Argument "props" must be a string or Array.');
      }
      if (!isNumber(durationOption) && !isString(durationOption)) {
        console.error(`MUI: Argument "duration" must be a number or a string but found ${durationOption}.`);
      }
      if (!isString(easingOption)) {
        console.error('MUI: Argument "easing" must be a string.');
      }
      if (!isNumber(delay) && !isString(delay)) {
        console.error('MUI: Argument "delay" must be a number or a string.');
      }
      if (Object.keys(other).length !== 0) {
        console.error(`MUI: Unrecognized argument(s) [${Object.keys(other).join(',')}].`);
      }
    }
    return (Array.isArray(props) ? props : [props]).map(animatedProp => `${animatedProp} ${typeof durationOption === 'string' ? durationOption : formatMs(durationOption)} ${easingOption} ${typeof delay === 'string' ? delay : formatMs(delay)}`).join(',');
  };
  return _extends({
    getAutoHeightDuration,
    create
  }, inputTransitions, {
    easing: mergedEasing,
    duration: mergedDuration
  });
}

// We need to centralize the zIndex definitions as they work
// like global values in the browser.
const zIndex = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
};
const zIndex$1 = zIndex;

const _excluded$a = ["breakpoints", "mixins", "spacing", "palette", "transitions", "typography", "shape"];
function createTheme(options = {}, ...args) {
  const {
      mixins: mixinsInput = {},
      palette: paletteInput = {},
      transitions: transitionsInput = {},
      typography: typographyInput = {}
    } = options,
    other = _objectWithoutPropertiesLoose(options, _excluded$a);
  if (options.vars) {
    throw new Error(process.env.NODE_ENV !== "production" ? `MUI: \`vars\` is a private field used for CSS variables support.
Please use another name.` : formatMuiErrorMessage(18));
  }
  const palette = createPalette(paletteInput);
  const systemTheme = createTheme$1(options);
  let muiTheme = deepmerge(systemTheme, {
    mixins: createMixins(systemTheme.breakpoints, mixinsInput),
    palette,
    // Don't use [...shadows] until you've verified its transpiled code is not invoking the iterator protocol.
    shadows: shadows$1.slice(),
    typography: createTypography(palette, typographyInput),
    transitions: createTransitions(transitionsInput),
    zIndex: _extends({}, zIndex$1)
  });
  muiTheme = deepmerge(muiTheme, other);
  muiTheme = args.reduce((acc, argument) => deepmerge(acc, argument), muiTheme);
  if (process.env.NODE_ENV !== 'production') {
    const stateClasses = ['active', 'checked', 'completed', 'disabled', 'error', 'expanded', 'focused', 'focusVisible', 'required', 'selected'];
    const traverse = (node, component) => {
      let key;

      // eslint-disable-next-line guard-for-in, no-restricted-syntax
      for (key in node) {
        const child = node[key];
        if (stateClasses.indexOf(key) !== -1 && Object.keys(child).length > 0) {
          if (process.env.NODE_ENV !== 'production') {
            const stateClass = unstable_generateUtilityClass('', key);
            console.error([`MUI: The \`${component}\` component increases ` + `the CSS specificity of the \`${key}\` internal state.`, 'You can not override it like this: ', JSON.stringify(node, null, 2), '', `Instead, you need to use the '&.${stateClass}' syntax:`, JSON.stringify({
              root: {
                [`&.${stateClass}`]: child
              }
            }, null, 2), '', 'https://mui.com/r/state-classes-guide'].join('\n'));
          }
          // Remove the style to prevent global conflicts.
          node[key] = {};
        }
      }
    };
    Object.keys(muiTheme.components).forEach(component => {
      const styleOverrides = muiTheme.components[component].styleOverrides;
      if (styleOverrides && component.indexOf('Mui') === 0) {
        traverse(styleOverrides, component);
      }
    });
  }
  return muiTheme;
}

const defaultTheme$1 = createTheme();
const defaultTheme$2 = defaultTheme$1;

function useTheme() {
  const theme = useTheme$1(defaultTheme$2);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useDebugValue(theme);
  }
  return theme;
}

function useThemeProps({
  props,
  name
}) {
  return useThemeProps$1({
    props,
    name,
    defaultTheme: defaultTheme$2
  });
}

const rootShouldForwardProp = prop => shouldForwardProp(prop) && prop !== 'classes';
const styled = createStyled({
  defaultTheme: defaultTheme$2,
  rootShouldForwardProp
});
const styled$1 = styled;

function getSvgIconUtilityClass(slot) {
  return unstable_generateUtilityClass('MuiSvgIcon', slot);
}
unstable_generateUtilityClasses('MuiSvgIcon', ['root', 'colorPrimary', 'colorSecondary', 'colorAction', 'colorError', 'colorDisabled', 'fontSizeInherit', 'fontSizeSmall', 'fontSizeMedium', 'fontSizeLarge']);

const _excluded$9 = ["children", "className", "color", "component", "fontSize", "htmlColor", "inheritViewBox", "titleAccess", "viewBox"];
const useUtilityClasses$7 = ownerState => {
  const {
    color,
    fontSize,
    classes
  } = ownerState;
  const slots = {
    root: ['root', color !== 'inherit' && `color${unstable_capitalize(color)}`, `fontSize${unstable_capitalize(fontSize)}`]
  };
  return unstable_composeClasses(slots, getSvgIconUtilityClass, classes);
};
const SvgIconRoot = styled$1('svg', {
  name: 'MuiSvgIcon',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.color !== 'inherit' && styles[`color${unstable_capitalize(ownerState.color)}`], styles[`fontSize${unstable_capitalize(ownerState.fontSize)}`]];
  }
})(({
  theme,
  ownerState
}) => {
  var _theme$transitions, _theme$transitions$cr, _theme$transitions2, _theme$transitions2$d, _theme$typography, _theme$typography$pxT, _theme$typography2, _theme$typography2$px, _theme$typography3, _theme$typography3$px, _palette$ownerState$c, _palette, _palette$ownerState$c2, _palette2, _palette2$action, _palette3, _palette3$action;
  return {
    userSelect: 'none',
    width: '1em',
    height: '1em',
    display: 'inline-block',
    fill: 'currentColor',
    flexShrink: 0,
    transition: (_theme$transitions = theme.transitions) == null ? void 0 : (_theme$transitions$cr = _theme$transitions.create) == null ? void 0 : _theme$transitions$cr.call(_theme$transitions, 'fill', {
      duration: (_theme$transitions2 = theme.transitions) == null ? void 0 : (_theme$transitions2$d = _theme$transitions2.duration) == null ? void 0 : _theme$transitions2$d.shorter
    }),
    fontSize: {
      inherit: 'inherit',
      small: ((_theme$typography = theme.typography) == null ? void 0 : (_theme$typography$pxT = _theme$typography.pxToRem) == null ? void 0 : _theme$typography$pxT.call(_theme$typography, 20)) || '1.25rem',
      medium: ((_theme$typography2 = theme.typography) == null ? void 0 : (_theme$typography2$px = _theme$typography2.pxToRem) == null ? void 0 : _theme$typography2$px.call(_theme$typography2, 24)) || '1.5rem',
      large: ((_theme$typography3 = theme.typography) == null ? void 0 : (_theme$typography3$px = _theme$typography3.pxToRem) == null ? void 0 : _theme$typography3$px.call(_theme$typography3, 35)) || '2.1875rem'
    }[ownerState.fontSize],
    // TODO v5 deprecate, v6 remove for sx
    color: (_palette$ownerState$c = (_palette = (theme.vars || theme).palette) == null ? void 0 : (_palette$ownerState$c2 = _palette[ownerState.color]) == null ? void 0 : _palette$ownerState$c2.main) != null ? _palette$ownerState$c : {
      action: (_palette2 = (theme.vars || theme).palette) == null ? void 0 : (_palette2$action = _palette2.action) == null ? void 0 : _palette2$action.active,
      disabled: (_palette3 = (theme.vars || theme).palette) == null ? void 0 : (_palette3$action = _palette3.action) == null ? void 0 : _palette3$action.disabled,
      inherit: undefined
    }[ownerState.color]
  };
});
const SvgIcon = /*#__PURE__*/React.forwardRef(function SvgIcon(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiSvgIcon'
  });
  const {
      children,
      className,
      color = 'inherit',
      component = 'svg',
      fontSize = 'medium',
      htmlColor,
      inheritViewBox = false,
      titleAccess,
      viewBox = '0 0 24 24'
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$9);
  const ownerState = _extends({}, props, {
    color,
    component,
    fontSize,
    instanceFontSize: inProps.fontSize,
    inheritViewBox,
    viewBox
  });
  const more = {};
  if (!inheritViewBox) {
    more.viewBox = viewBox;
  }
  const classes = useUtilityClasses$7(ownerState);
  return /*#__PURE__*/jsxs(SvgIconRoot, _extends({
    as: component,
    className: clsx(classes.root, className),
    focusable: "false",
    color: htmlColor,
    "aria-hidden": titleAccess ? undefined : true,
    role: titleAccess ? 'img' : undefined,
    ref: ref
  }, more, other, {
    ownerState: ownerState,
    children: [children, titleAccess ? /*#__PURE__*/jsx("title", {
      children: titleAccess
    }) : null]
  }));
});
process.env.NODE_ENV !== "production" ? SvgIcon.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * Node passed into the SVG element.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#adding-new-colors).
   * You can use the `htmlColor` prop to apply a color attribute to the SVG element.
   * @default 'inherit'
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.oneOf(['inherit', 'action', 'disabled', 'primary', 'secondary', 'error', 'info', 'success', 'warning']), PropTypes.string]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The fontSize applied to the icon. Defaults to 24px, but can be configure to inherit font size.
   * @default 'medium'
   */
  fontSize: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.oneOf(['inherit', 'large', 'medium', 'small']), PropTypes.string]),
  /**
   * Applies a color attribute to the SVG element.
   */
  htmlColor: PropTypes.string,
  /**
   * If `true`, the root node will inherit the custom `component`'s viewBox and the `viewBox`
   * prop will be ignored.
   * Useful when you want to reference a custom `component` and have `SvgIcon` pass that
   * `component`'s viewBox to the root node.
   * @default false
   */
  inheritViewBox: PropTypes.bool,
  /**
   * The shape-rendering attribute. The behavior of the different options is described on the
   * [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/shape-rendering).
   * If you are having issues with blurry icons you should investigate this prop.
   */
  shapeRendering: PropTypes.string,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * Provides a human-readable title for the element that contains it.
   * https://www.w3.org/TR/SVG-access/#Equivalent
   */
  titleAccess: PropTypes.string,
  /**
   * Allows you to redefine what the coordinates without units mean inside an SVG element.
   * For example, if the SVG element is 500 (width) by 200 (height),
   * and you pass viewBox="0 0 50 20",
   * this means that the coordinates inside the SVG will go from the top left corner (0,0)
   * to bottom right (50,20) and each unit will be worth 10px.
   * @default '0 0 24 24'
   */
  viewBox: PropTypes.string
} : void 0;
SvgIcon.muiName = 'SvgIcon';
const SvgIcon$1 = SvgIcon;

function createSvgIcon(path, displayName) {
  function Component(props, ref) {
    return /*#__PURE__*/jsx(SvgIcon$1, _extends({
      "data-testid": `${displayName}Icon`,
      ref: ref
    }, props, {
      children: path
    }));
  }
  if (process.env.NODE_ENV !== 'production') {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    Component.displayName = `${displayName}Icon`;
  }
  Component.muiName = SvgIcon$1.muiName;
  return /*#__PURE__*/React.memo( /*#__PURE__*/React.forwardRef(Component));
}

function Ripple(props) {
  const {
    className,
    classes,
    pulsate = false,
    rippleX,
    rippleY,
    rippleSize,
    in: inProp,
    onExited,
    timeout
  } = props;
  const [leaving, setLeaving] = React.useState(false);
  const rippleClassName = clsx(className, classes.ripple, classes.rippleVisible, pulsate && classes.ripplePulsate);
  const rippleStyles = {
    width: rippleSize,
    height: rippleSize,
    top: -(rippleSize / 2) + rippleY,
    left: -(rippleSize / 2) + rippleX
  };
  const childClassName = clsx(classes.child, leaving && classes.childLeaving, pulsate && classes.childPulsate);
  if (!inProp && !leaving) {
    setLeaving(true);
  }
  React.useEffect(() => {
    if (!inProp && onExited != null) {
      // react-transition-group#onExited
      const timeoutId = setTimeout(onExited, timeout);
      return () => {
        clearTimeout(timeoutId);
      };
    }
    return undefined;
  }, [onExited, inProp, timeout]);
  return /*#__PURE__*/jsx("span", {
    className: rippleClassName,
    style: rippleStyles,
    children: /*#__PURE__*/jsx("span", {
      className: childClassName
    })
  });
}
process.env.NODE_ENV !== "production" ? Ripple.propTypes = {
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  /**
   * @ignore - injected from TransitionGroup
   */
  in: PropTypes.bool,
  /**
   * @ignore - injected from TransitionGroup
   */
  onExited: PropTypes.func,
  /**
   * If `true`, the ripple pulsates, typically indicating the keyboard focus state of an element.
   */
  pulsate: PropTypes.bool,
  /**
   * Diameter of the ripple.
   */
  rippleSize: PropTypes.number,
  /**
   * Horizontal position of the ripple center.
   */
  rippleX: PropTypes.number,
  /**
   * Vertical position of the ripple center.
   */
  rippleY: PropTypes.number,
  /**
   * exit delay
   */
  timeout: PropTypes.number.isRequired
} : void 0;

const touchRippleClasses = unstable_generateUtilityClasses('MuiTouchRipple', ['root', 'ripple', 'rippleVisible', 'ripplePulsate', 'child', 'childLeaving', 'childPulsate']);
const touchRippleClasses$1 = touchRippleClasses;

const _excluded$8 = ["center", "classes", "className"];
let _ = t => t,
  _t,
  _t2,
  _t3,
  _t4;
const DURATION = 550;
const DELAY_RIPPLE = 80;
const enterKeyframe = keyframes(_t || (_t = _`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`));
const exitKeyframe = keyframes(_t2 || (_t2 = _`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`));
const pulsateKeyframe = keyframes(_t3 || (_t3 = _`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`));
const TouchRippleRoot = styled$1('span', {
  name: 'MuiTouchRipple',
  slot: 'Root'
})({
  overflow: 'hidden',
  pointerEvents: 'none',
  position: 'absolute',
  zIndex: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  borderRadius: 'inherit'
});

// This `styled()` function invokes keyframes. `styled-components` only supports keyframes
// in string templates. Do not convert these styles in JS object as it will break.
const TouchRippleRipple = styled$1(Ripple, {
  name: 'MuiTouchRipple',
  slot: 'Ripple'
})(_t4 || (_t4 = _`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`), touchRippleClasses$1.rippleVisible, enterKeyframe, DURATION, ({
  theme
}) => theme.transitions.easing.easeInOut, touchRippleClasses$1.ripplePulsate, ({
  theme
}) => theme.transitions.duration.shorter, touchRippleClasses$1.child, touchRippleClasses$1.childLeaving, exitKeyframe, DURATION, ({
  theme
}) => theme.transitions.easing.easeInOut, touchRippleClasses$1.childPulsate, pulsateKeyframe, ({
  theme
}) => theme.transitions.easing.easeInOut);

/**
 * @ignore - internal component.
 *
 * TODO v5: Make private
 */
const TouchRipple = /*#__PURE__*/React.forwardRef(function TouchRipple(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiTouchRipple'
  });
  const {
      center: centerProp = false,
      classes = {},
      className
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$8);
  const [ripples, setRipples] = React.useState([]);
  const nextKey = React.useRef(0);
  const rippleCallback = React.useRef(null);
  React.useEffect(() => {
    if (rippleCallback.current) {
      rippleCallback.current();
      rippleCallback.current = null;
    }
  }, [ripples]);

  // Used to filter out mouse emulated events on mobile.
  const ignoringMouseDown = React.useRef(false);
  // We use a timer in order to only show the ripples for touch "click" like events.
  // We don't want to display the ripple for touch scroll events.
  const startTimer = React.useRef(null);

  // This is the hook called once the previous timeout is ready.
  const startTimerCommit = React.useRef(null);
  const container = React.useRef(null);
  React.useEffect(() => {
    return () => {
      clearTimeout(startTimer.current);
    };
  }, []);
  const startCommit = React.useCallback(params => {
    const {
      pulsate,
      rippleX,
      rippleY,
      rippleSize,
      cb
    } = params;
    setRipples(oldRipples => [...oldRipples, /*#__PURE__*/jsx(TouchRippleRipple, {
      classes: {
        ripple: clsx(classes.ripple, touchRippleClasses$1.ripple),
        rippleVisible: clsx(classes.rippleVisible, touchRippleClasses$1.rippleVisible),
        ripplePulsate: clsx(classes.ripplePulsate, touchRippleClasses$1.ripplePulsate),
        child: clsx(classes.child, touchRippleClasses$1.child),
        childLeaving: clsx(classes.childLeaving, touchRippleClasses$1.childLeaving),
        childPulsate: clsx(classes.childPulsate, touchRippleClasses$1.childPulsate)
      },
      timeout: DURATION,
      pulsate: pulsate,
      rippleX: rippleX,
      rippleY: rippleY,
      rippleSize: rippleSize
    }, nextKey.current)]);
    nextKey.current += 1;
    rippleCallback.current = cb;
  }, [classes]);
  const start = React.useCallback((event = {}, options = {}, cb = () => {}) => {
    const {
      pulsate = false,
      center = centerProp || options.pulsate,
      fakeElement = false // For test purposes
    } = options;
    if ((event == null ? void 0 : event.type) === 'mousedown' && ignoringMouseDown.current) {
      ignoringMouseDown.current = false;
      return;
    }
    if ((event == null ? void 0 : event.type) === 'touchstart') {
      ignoringMouseDown.current = true;
    }
    const element = fakeElement ? null : container.current;
    const rect = element ? element.getBoundingClientRect() : {
      width: 0,
      height: 0,
      left: 0,
      top: 0
    };

    // Get the size of the ripple
    let rippleX;
    let rippleY;
    let rippleSize;
    if (center || event === undefined || event.clientX === 0 && event.clientY === 0 || !event.clientX && !event.touches) {
      rippleX = Math.round(rect.width / 2);
      rippleY = Math.round(rect.height / 2);
    } else {
      const {
        clientX,
        clientY
      } = event.touches && event.touches.length > 0 ? event.touches[0] : event;
      rippleX = Math.round(clientX - rect.left);
      rippleY = Math.round(clientY - rect.top);
    }
    if (center) {
      rippleSize = Math.sqrt((2 * rect.width ** 2 + rect.height ** 2) / 3);

      // For some reason the animation is broken on Mobile Chrome if the size is even.
      if (rippleSize % 2 === 0) {
        rippleSize += 1;
      }
    } else {
      const sizeX = Math.max(Math.abs((element ? element.clientWidth : 0) - rippleX), rippleX) * 2 + 2;
      const sizeY = Math.max(Math.abs((element ? element.clientHeight : 0) - rippleY), rippleY) * 2 + 2;
      rippleSize = Math.sqrt(sizeX ** 2 + sizeY ** 2);
    }

    // Touche devices
    if (event != null && event.touches) {
      // check that this isn't another touchstart due to multitouch
      // otherwise we will only clear a single timer when unmounting while two
      // are running
      if (startTimerCommit.current === null) {
        // Prepare the ripple effect.
        startTimerCommit.current = () => {
          startCommit({
            pulsate,
            rippleX,
            rippleY,
            rippleSize,
            cb
          });
        };
        // Delay the execution of the ripple effect.
        startTimer.current = setTimeout(() => {
          if (startTimerCommit.current) {
            startTimerCommit.current();
            startTimerCommit.current = null;
          }
        }, DELAY_RIPPLE); // We have to make a tradeoff with this value.
      }
    } else {
      startCommit({
        pulsate,
        rippleX,
        rippleY,
        rippleSize,
        cb
      });
    }
  }, [centerProp, startCommit]);
  const pulsate = React.useCallback(() => {
    start({}, {
      pulsate: true
    });
  }, [start]);
  const stop = React.useCallback((event, cb) => {
    clearTimeout(startTimer.current);

    // The touch interaction occurs too quickly.
    // We still want to show ripple effect.
    if ((event == null ? void 0 : event.type) === 'touchend' && startTimerCommit.current) {
      startTimerCommit.current();
      startTimerCommit.current = null;
      startTimer.current = setTimeout(() => {
        stop(event, cb);
      });
      return;
    }
    startTimerCommit.current = null;
    setRipples(oldRipples => {
      if (oldRipples.length > 0) {
        return oldRipples.slice(1);
      }
      return oldRipples;
    });
    rippleCallback.current = cb;
  }, []);
  React.useImperativeHandle(ref, () => ({
    pulsate,
    start,
    stop
  }), [pulsate, start, stop]);
  return /*#__PURE__*/jsx(TouchRippleRoot, _extends({
    className: clsx(touchRippleClasses$1.root, classes.root, className),
    ref: container
  }, other, {
    children: /*#__PURE__*/jsx(TransitionGroup, {
      component: null,
      exit: true,
      children: ripples
    })
  }));
});
process.env.NODE_ENV !== "production" ? TouchRipple.propTypes = {
  /**
   * If `true`, the ripple starts at the center of the component
   * rather than at the point of interaction.
   */
  center: PropTypes.bool,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string
} : void 0;
const TouchRipple$1 = TouchRipple;

function getButtonBaseUtilityClass(slot) {
  return unstable_generateUtilityClass('MuiButtonBase', slot);
}
const buttonBaseClasses = unstable_generateUtilityClasses('MuiButtonBase', ['root', 'disabled', 'focusVisible']);
const buttonBaseClasses$1 = buttonBaseClasses;

const _excluded$7 = ["action", "centerRipple", "children", "className", "component", "disabled", "disableRipple", "disableTouchRipple", "focusRipple", "focusVisibleClassName", "LinkComponent", "onBlur", "onClick", "onContextMenu", "onDragLeave", "onFocus", "onFocusVisible", "onKeyDown", "onKeyUp", "onMouseDown", "onMouseLeave", "onMouseUp", "onTouchEnd", "onTouchMove", "onTouchStart", "tabIndex", "TouchRippleProps", "touchRippleRef", "type"];
const useUtilityClasses$6 = ownerState => {
  const {
    disabled,
    focusVisible,
    focusVisibleClassName,
    classes
  } = ownerState;
  const slots = {
    root: ['root', disabled && 'disabled', focusVisible && 'focusVisible']
  };
  const composedClasses = unstable_composeClasses(slots, getButtonBaseUtilityClass, classes);
  if (focusVisible && focusVisibleClassName) {
    composedClasses.root += ` ${focusVisibleClassName}`;
  }
  return composedClasses;
};
const ButtonBaseRoot = styled$1('button', {
  name: 'MuiButtonBase',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  boxSizing: 'border-box',
  WebkitTapHighlightColor: 'transparent',
  backgroundColor: 'transparent',
  // Reset default value
  // We disable the focus ring for mouse, touch and keyboard users.
  outline: 0,
  border: 0,
  margin: 0,
  // Remove the margin in Safari
  borderRadius: 0,
  padding: 0,
  // Remove the padding in Firefox
  cursor: 'pointer',
  userSelect: 'none',
  verticalAlign: 'middle',
  MozAppearance: 'none',
  // Reset
  WebkitAppearance: 'none',
  // Reset
  textDecoration: 'none',
  // So we take precedent over the style of a native <a /> element.
  color: 'inherit',
  '&::-moz-focus-inner': {
    borderStyle: 'none' // Remove Firefox dotted outline.
  },

  [`&.${buttonBaseClasses$1.disabled}`]: {
    pointerEvents: 'none',
    // Disable link interactions
    cursor: 'default'
  },
  '@media print': {
    colorAdjust: 'exact'
  }
});

/**
 * `ButtonBase` contains as few styles as possible.
 * It aims to be a simple building block for creating a button.
 * It contains a load of style reset and some focus/ripple logic.
 */
const ButtonBase = /*#__PURE__*/React.forwardRef(function ButtonBase(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiButtonBase'
  });
  const {
      action,
      centerRipple = false,
      children,
      className,
      component = 'button',
      disabled = false,
      disableRipple = false,
      disableTouchRipple = false,
      focusRipple = false,
      LinkComponent = 'a',
      onBlur,
      onClick,
      onContextMenu,
      onDragLeave,
      onFocus,
      onFocusVisible,
      onKeyDown,
      onKeyUp,
      onMouseDown,
      onMouseLeave,
      onMouseUp,
      onTouchEnd,
      onTouchMove,
      onTouchStart,
      tabIndex = 0,
      TouchRippleProps,
      touchRippleRef,
      type
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$7);
  const buttonRef = React.useRef(null);
  const rippleRef = React.useRef(null);
  const handleRippleRef = unstable_useForkRef(rippleRef, touchRippleRef);
  const {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref: focusVisibleRef
  } = unstable_useIsFocusVisible();
  const [focusVisible, setFocusVisible] = React.useState(false);
  if (disabled && focusVisible) {
    setFocusVisible(false);
  }
  React.useImperativeHandle(action, () => ({
    focusVisible: () => {
      setFocusVisible(true);
      buttonRef.current.focus();
    }
  }), []);
  const [mountedState, setMountedState] = React.useState(false);
  React.useEffect(() => {
    setMountedState(true);
  }, []);
  const enableTouchRipple = mountedState && !disableRipple && !disabled;
  React.useEffect(() => {
    if (focusVisible && focusRipple && !disableRipple && mountedState) {
      rippleRef.current.pulsate();
    }
  }, [disableRipple, focusRipple, focusVisible, mountedState]);
  function useRippleHandler(rippleAction, eventCallback, skipRippleAction = disableTouchRipple) {
    return unstable_useEventCallback(event => {
      if (eventCallback) {
        eventCallback(event);
      }
      const ignore = skipRippleAction;
      if (!ignore && rippleRef.current) {
        rippleRef.current[rippleAction](event);
      }
      return true;
    });
  }
  const handleMouseDown = useRippleHandler('start', onMouseDown);
  const handleContextMenu = useRippleHandler('stop', onContextMenu);
  const handleDragLeave = useRippleHandler('stop', onDragLeave);
  const handleMouseUp = useRippleHandler('stop', onMouseUp);
  const handleMouseLeave = useRippleHandler('stop', event => {
    if (focusVisible) {
      event.preventDefault();
    }
    if (onMouseLeave) {
      onMouseLeave(event);
    }
  });
  const handleTouchStart = useRippleHandler('start', onTouchStart);
  const handleTouchEnd = useRippleHandler('stop', onTouchEnd);
  const handleTouchMove = useRippleHandler('stop', onTouchMove);
  const handleBlur = useRippleHandler('stop', event => {
    handleBlurVisible(event);
    if (isFocusVisibleRef.current === false) {
      setFocusVisible(false);
    }
    if (onBlur) {
      onBlur(event);
    }
  }, false);
  const handleFocus = unstable_useEventCallback(event => {
    // Fix for https://github.com/facebook/react/issues/7769
    if (!buttonRef.current) {
      buttonRef.current = event.currentTarget;
    }
    handleFocusVisible(event);
    if (isFocusVisibleRef.current === true) {
      setFocusVisible(true);
      if (onFocusVisible) {
        onFocusVisible(event);
      }
    }
    if (onFocus) {
      onFocus(event);
    }
  });
  const isNonNativeButton = () => {
    const button = buttonRef.current;
    return component && component !== 'button' && !(button.tagName === 'A' && button.href);
  };

  /**
   * IE11 shim for https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
   */
  const keydownRef = React.useRef(false);
  const handleKeyDown = unstable_useEventCallback(event => {
    // Check if key is already down to avoid repeats being counted as multiple activations
    if (focusRipple && !keydownRef.current && focusVisible && rippleRef.current && event.key === ' ') {
      keydownRef.current = true;
      rippleRef.current.stop(event, () => {
        rippleRef.current.start(event);
      });
    }
    if (event.target === event.currentTarget && isNonNativeButton() && event.key === ' ') {
      event.preventDefault();
    }
    if (onKeyDown) {
      onKeyDown(event);
    }

    // Keyboard accessibility for non interactive elements
    if (event.target === event.currentTarget && isNonNativeButton() && event.key === 'Enter' && !disabled) {
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
    }
  });
  const handleKeyUp = unstable_useEventCallback(event => {
    // calling preventDefault in keyUp on a <button> will not dispatch a click event if Space is pressed
    // https://codesandbox.io/s/button-keyup-preventdefault-dn7f0
    if (focusRipple && event.key === ' ' && rippleRef.current && focusVisible && !event.defaultPrevented) {
      keydownRef.current = false;
      rippleRef.current.stop(event, () => {
        rippleRef.current.pulsate(event);
      });
    }
    if (onKeyUp) {
      onKeyUp(event);
    }

    // Keyboard accessibility for non interactive elements
    if (onClick && event.target === event.currentTarget && isNonNativeButton() && event.key === ' ' && !event.defaultPrevented) {
      onClick(event);
    }
  });
  let ComponentProp = component;
  if (ComponentProp === 'button' && (other.href || other.to)) {
    ComponentProp = LinkComponent;
  }
  const buttonProps = {};
  if (ComponentProp === 'button') {
    buttonProps.type = type === undefined ? 'button' : type;
    buttonProps.disabled = disabled;
  } else {
    if (!other.href && !other.to) {
      buttonProps.role = 'button';
    }
    if (disabled) {
      buttonProps['aria-disabled'] = disabled;
    }
  }
  const handleRef = unstable_useForkRef(ref, focusVisibleRef, buttonRef);
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (enableTouchRipple && !rippleRef.current) {
        console.error(['MUI: The `component` prop provided to ButtonBase is invalid.', 'Please make sure the children prop is rendered in this custom component.'].join('\n'));
      }
    }, [enableTouchRipple]);
  }
  const ownerState = _extends({}, props, {
    centerRipple,
    component,
    disabled,
    disableRipple,
    disableTouchRipple,
    focusRipple,
    tabIndex,
    focusVisible
  });
  const classes = useUtilityClasses$6(ownerState);
  return /*#__PURE__*/jsxs(ButtonBaseRoot, _extends({
    as: ComponentProp,
    className: clsx(classes.root, className),
    ownerState: ownerState,
    onBlur: handleBlur,
    onClick: onClick,
    onContextMenu: handleContextMenu,
    onFocus: handleFocus,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onMouseDown: handleMouseDown,
    onMouseLeave: handleMouseLeave,
    onMouseUp: handleMouseUp,
    onDragLeave: handleDragLeave,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onTouchStart: handleTouchStart,
    ref: handleRef,
    tabIndex: disabled ? -1 : tabIndex,
    type: type
  }, buttonProps, other, {
    children: [children, enableTouchRipple ?
    /*#__PURE__*/
    /* TouchRipple is only needed client-side, x2 boost on the server. */
    jsx(TouchRipple$1, _extends({
      ref: handleRippleRef,
      center: centerRipple
    }, TouchRippleProps)) : null]
  }));
});
process.env.NODE_ENV !== "production" ? ButtonBase.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * A ref for imperative actions.
   * It currently only supports `focusVisible()` action.
   */
  action: refType,
  /**
   * If `true`, the ripples are centered.
   * They won't start at the cursor interaction position.
   * @default false
   */
  centerRipple: PropTypes.bool,
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: elementTypeAcceptingRef,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: PropTypes.bool,
  /**
   * If `true`, the touch ripple effect is disabled.
   * @default false
   */
  disableTouchRipple: PropTypes.bool,
  /**
   * If `true`, the base button will have a keyboard focus ripple.
   * @default false
   */
  focusRipple: PropTypes.bool,
  /**
   * This prop can help identify which element has keyboard focus.
   * The class name will be applied when the element gains the focus through keyboard interaction.
   * It's a polyfill for the [CSS :focus-visible selector](https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo).
   * The rationale for using this feature [is explained here](https://github.com/WICG/focus-visible/blob/HEAD/explainer.md).
   * A [polyfill can be used](https://github.com/WICG/focus-visible) to apply a `focus-visible` class to other components
   * if needed.
   */
  focusVisibleClassName: PropTypes.string,
  /**
   * @ignore
   */
  href: PropTypes /* @typescript-to-proptypes-ignore */.any,
  /**
   * The component used to render a link when the `href` prop is provided.
   * @default 'a'
   */
  LinkComponent: PropTypes.elementType,
  /**
   * @ignore
   */
  onBlur: PropTypes.func,
  /**
   * @ignore
   */
  onClick: PropTypes.func,
  /**
   * @ignore
   */
  onContextMenu: PropTypes.func,
  /**
   * @ignore
   */
  onDragLeave: PropTypes.func,
  /**
   * @ignore
   */
  onFocus: PropTypes.func,
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible: PropTypes.func,
  /**
   * @ignore
   */
  onKeyDown: PropTypes.func,
  /**
   * @ignore
   */
  onKeyUp: PropTypes.func,
  /**
   * @ignore
   */
  onMouseDown: PropTypes.func,
  /**
   * @ignore
   */
  onMouseLeave: PropTypes.func,
  /**
   * @ignore
   */
  onMouseUp: PropTypes.func,
  /**
   * @ignore
   */
  onTouchEnd: PropTypes.func,
  /**
   * @ignore
   */
  onTouchMove: PropTypes.func,
  /**
   * @ignore
   */
  onTouchStart: PropTypes.func,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * @default 0
   */
  tabIndex: PropTypes.number,
  /**
   * Props applied to the `TouchRipple` element.
   */
  TouchRippleProps: PropTypes.object,
  /**
   * A ref that points to the `TouchRipple` element.
   */
  touchRippleRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    current: PropTypes.shape({
      pulsate: PropTypes.func.isRequired,
      start: PropTypes.func.isRequired,
      stop: PropTypes.func.isRequired
    })
  })]),
  /**
   * @ignore
   */
  type: PropTypes.oneOfType([PropTypes.oneOf(['button', 'reset', 'submit']), PropTypes.string])
} : void 0;
const ButtonBase$1 = ButtonBase;

function getTypographyUtilityClass(slot) {
  return unstable_generateUtilityClass('MuiTypography', slot);
}
unstable_generateUtilityClasses('MuiTypography', ['root', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'inherit', 'button', 'caption', 'overline', 'alignLeft', 'alignRight', 'alignCenter', 'alignJustify', 'noWrap', 'gutterBottom', 'paragraph']);

const _excluded$6 = ["align", "className", "component", "gutterBottom", "noWrap", "paragraph", "variant", "variantMapping"];
const useUtilityClasses$5 = ownerState => {
  const {
    align,
    gutterBottom,
    noWrap,
    paragraph,
    variant,
    classes
  } = ownerState;
  const slots = {
    root: ['root', variant, ownerState.align !== 'inherit' && `align${unstable_capitalize(align)}`, gutterBottom && 'gutterBottom', noWrap && 'noWrap', paragraph && 'paragraph']
  };
  return unstable_composeClasses(slots, getTypographyUtilityClass, classes);
};
const TypographyRoot = styled$1('span', {
  name: 'MuiTypography',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.variant && styles[ownerState.variant], ownerState.align !== 'inherit' && styles[`align${unstable_capitalize(ownerState.align)}`], ownerState.noWrap && styles.noWrap, ownerState.gutterBottom && styles.gutterBottom, ownerState.paragraph && styles.paragraph];
  }
})(({
  theme,
  ownerState
}) => _extends({
  margin: 0
}, ownerState.variant && theme.typography[ownerState.variant], ownerState.align !== 'inherit' && {
  textAlign: ownerState.align
}, ownerState.noWrap && {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}, ownerState.gutterBottom && {
  marginBottom: '0.35em'
}, ownerState.paragraph && {
  marginBottom: 16
}));
const defaultVariantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  inherit: 'p'
};

// TODO v6: deprecate these color values in v5.x and remove the transformation in v6
const colorTransformations = {
  primary: 'primary.main',
  textPrimary: 'text.primary',
  secondary: 'secondary.main',
  textSecondary: 'text.secondary',
  error: 'error.main'
};
const transformDeprecatedColors = color => {
  return colorTransformations[color] || color;
};
const Typography = /*#__PURE__*/React.forwardRef(function Typography(inProps, ref) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiTypography'
  });
  const color = transformDeprecatedColors(themeProps.color);
  const props = unstable_extendSxProp(_extends({}, themeProps, {
    color
  }));
  const {
      align = 'inherit',
      className,
      component,
      gutterBottom = false,
      noWrap = false,
      paragraph = false,
      variant = 'body1',
      variantMapping = defaultVariantMapping
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$6);
  const ownerState = _extends({}, props, {
    align,
    color,
    className,
    component,
    gutterBottom,
    noWrap,
    paragraph,
    variant,
    variantMapping
  });
  const Component = component || (paragraph ? 'p' : variantMapping[variant] || defaultVariantMapping[variant]) || 'span';
  const classes = useUtilityClasses$5(ownerState);
  return /*#__PURE__*/jsx(TypographyRoot, _extends({
    as: Component,
    ref: ref,
    ownerState: ownerState,
    className: clsx(classes.root, className)
  }, other));
});
process.env.NODE_ENV !== "production" ? Typography.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * Set the text-align on the component.
   * @default 'inherit'
   */
  align: PropTypes.oneOf(['center', 'inherit', 'justify', 'left', 'right']),
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the text will have a bottom margin.
   * @default false
   */
  gutterBottom: PropTypes.bool,
  /**
   * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   *
   * Note that text overflow can only happen with block or inline-block level elements
   * (the element needs to have a width in order to overflow).
   * @default false
   */
  noWrap: PropTypes.bool,
  /**
   * If `true`, the element will be a paragraph element.
   * @default false
   */
  paragraph: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * Applies the theme typography styles.
   * @default 'body1'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.oneOf(['body1', 'body2', 'button', 'caption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'inherit', 'overline', 'subtitle1', 'subtitle2']), PropTypes.string]),
  /**
   * The component maps the variant prop to a range of different HTML element types.
   * For instance, subtitle1 to `<h6>`.
   * If you wish to change that mapping, you can provide your own.
   * Alternatively, you can use the `component` prop.
   * @default {
   *   h1: 'h1',
   *   h2: 'h2',
   *   h3: 'h3',
   *   h4: 'h4',
   *   h5: 'h5',
   *   h6: 'h6',
   *   subtitle1: 'h6',
   *   subtitle2: 'h6',
   *   body1: 'p',
   *   body2: 'p',
   *   inherit: 'p',
   * }
   */
  variantMapping: PropTypes /* @typescript-to-proptypes-ignore */.object
} : void 0;
const Typography$1 = Typography;

function GlobalStyles(props) {
  return /*#__PURE__*/jsx(GlobalStyles$1, _extends({}, props, {
    defaultTheme: defaultTheme$2
  }));
}
process.env.NODE_ENV !== "production" ? GlobalStyles.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The styles you want to apply globally.
   */
  styles: PropTypes.oneOfType([PropTypes.func, PropTypes.number, PropTypes.object, PropTypes.shape({
    __emotion_styles: PropTypes.any.isRequired
  }), PropTypes.string, PropTypes.bool])
} : void 0;

const defaultTheme = createTheme();
const Box = createBox({
  defaultTheme,
  defaultClassName: 'MuiBox-root',
  generateClassName: unstable_ClassNameGenerator.generate
});
process.env.NODE_ENV !== "production" ? Box.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
const Box$1 = Box;

const html$3 = (theme, enableColorScheme) => _extends({
  WebkitFontSmoothing: 'antialiased',
  // Antialiasing.
  MozOsxFontSmoothing: 'grayscale',
  // Antialiasing.
  // Change from `box-sizing: content-box` so that `width`
  // is not affected by `padding` or `border`.
  boxSizing: 'border-box',
  // Fix font resize problem in iOS
  WebkitTextSizeAdjust: '100%'
}, enableColorScheme && !theme.vars && {
  colorScheme: theme.palette.mode
});
const body = theme => _extends({
  color: (theme.vars || theme).palette.text.primary
}, theme.typography.body1, {
  backgroundColor: (theme.vars || theme).palette.background.default,
  '@media print': {
    // Save printer ink.
    backgroundColor: (theme.vars || theme).palette.common.white
  }
});
const styles$1 = (theme, enableColorScheme = false) => {
  var _theme$components, _theme$components$Mui;
  const colorSchemeStyles = {};
  if (enableColorScheme && theme.colorSchemes) {
    Object.entries(theme.colorSchemes).forEach(([key, scheme]) => {
      var _scheme$palette;
      colorSchemeStyles[theme.getColorSchemeSelector(key).replace(/\s*&/, '')] = {
        colorScheme: (_scheme$palette = scheme.palette) == null ? void 0 : _scheme$palette.mode
      };
    });
  }
  let defaultStyles = _extends({
    html: html$3(theme, enableColorScheme),
    '*, *::before, *::after': {
      boxSizing: 'inherit'
    },
    'strong, b': {
      fontWeight: theme.typography.fontWeightBold
    },
    body: _extends({
      margin: 0
    }, body(theme), {
      // Add support for document.body.requestFullScreen().
      // Other elements, if background transparent, are not supported.
      '&::backdrop': {
        backgroundColor: (theme.vars || theme).palette.background.default
      }
    })
  }, colorSchemeStyles);
  const themeOverrides = (_theme$components = theme.components) == null ? void 0 : (_theme$components$Mui = _theme$components.MuiCssBaseline) == null ? void 0 : _theme$components$Mui.styleOverrides;
  if (themeOverrides) {
    defaultStyles = [defaultStyles, themeOverrides];
  }
  return defaultStyles;
};

/**
 * Kickstart an elegant, consistent, and simple baseline to build upon.
 */
function CssBaseline(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiCssBaseline'
  });
  const {
    children,
    enableColorScheme = false
  } = props;
  return /*#__PURE__*/jsxs(React.Fragment, {
    children: [/*#__PURE__*/jsx(GlobalStyles, {
      styles: theme => styles$1(theme, enableColorScheme)
    }), children]
  });
}
process.env.NODE_ENV !== "production" ? CssBaseline.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * You can wrap a node.
   */
  children: PropTypes.node,
  /**
   * Enable `color-scheme` CSS property to use `theme.palette.mode`.
   * For more details, check out https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme
   * For browser support, check out https://caniuse.com/?search=color-scheme
   * @default false
   */
  enableColorScheme: PropTypes.bool
} : void 0;

function getFabUtilityClass(slot) {
  return unstable_generateUtilityClass('MuiFab', slot);
}
const fabClasses = unstable_generateUtilityClasses('MuiFab', ['root', 'primary', 'secondary', 'extended', 'circular', 'focusVisible', 'disabled', 'colorInherit', 'sizeSmall', 'sizeMedium', 'sizeLarge', 'info', 'error', 'warning', 'success']);
const fabClasses$1 = fabClasses;

const _excluded$5 = ["children", "className", "color", "component", "disabled", "disableFocusRipple", "focusVisibleClassName", "size", "variant"];
const useUtilityClasses$4 = ownerState => {
  const {
    color,
    variant,
    classes,
    size
  } = ownerState;
  const slots = {
    root: ['root', variant, `size${unstable_capitalize(size)}`, color === 'inherit' ? 'colorInherit' : color]
  };
  const composedClasses = unstable_composeClasses(slots, getFabUtilityClass, classes);
  return _extends({}, classes, composedClasses);
};
const FabRoot = styled$1(ButtonBase$1, {
  name: 'MuiFab',
  slot: 'Root',
  shouldForwardProp: prop => rootShouldForwardProp(prop) || prop === 'classes',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[ownerState.variant], styles[`size${unstable_capitalize(ownerState.size)}`], ownerState.color === 'inherit' && styles.colorInherit, styles[unstable_capitalize(ownerState.size)], styles[ownerState.color]];
  }
})(({
  theme,
  ownerState
}) => {
  var _theme$palette$getCon, _theme$palette;
  return _extends({}, theme.typography.button, {
    minHeight: 36,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color'], {
      duration: theme.transitions.duration.short
    }),
    borderRadius: '50%',
    padding: 0,
    minWidth: 0,
    width: 56,
    height: 56,
    zIndex: (theme.vars || theme).zIndex.fab,
    boxShadow: (theme.vars || theme).shadows[6],
    '&:active': {
      boxShadow: (theme.vars || theme).shadows[12]
    },
    color: theme.vars ? theme.vars.palette.text.primary : (_theme$palette$getCon = (_theme$palette = theme.palette).getContrastText) == null ? void 0 : _theme$palette$getCon.call(_theme$palette, theme.palette.grey[300]),
    backgroundColor: (theme.vars || theme).palette.grey[300],
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.grey.A100,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: (theme.vars || theme).palette.grey[300]
      },
      textDecoration: 'none'
    },
    [`&.${fabClasses$1.focusVisible}`]: {
      boxShadow: (theme.vars || theme).shadows[6]
    }
  }, ownerState.size === 'small' && {
    width: 40,
    height: 40
  }, ownerState.size === 'medium' && {
    width: 48,
    height: 48
  }, ownerState.variant === 'extended' && {
    borderRadius: 48 / 2,
    padding: '0 16px',
    width: 'auto',
    minHeight: 'auto',
    minWidth: 48,
    height: 48
  }, ownerState.variant === 'extended' && ownerState.size === 'small' && {
    width: 'auto',
    padding: '0 8px',
    borderRadius: 34 / 2,
    minWidth: 34,
    height: 34
  }, ownerState.variant === 'extended' && ownerState.size === 'medium' && {
    width: 'auto',
    padding: '0 16px',
    borderRadius: 40 / 2,
    minWidth: 40,
    height: 40
  }, ownerState.color === 'inherit' && {
    color: 'inherit'
  });
}, ({
  theme,
  ownerState
}) => _extends({}, ownerState.color !== 'inherit' && ownerState.color !== 'default' && (theme.vars || theme).palette[ownerState.color] != null && {
  color: (theme.vars || theme).palette[ownerState.color].contrastText,
  backgroundColor: (theme.vars || theme).palette[ownerState.color].main,
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette[ownerState.color].dark,
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: (theme.vars || theme).palette[ownerState.color].main
    }
  }
}), ({
  theme
}) => ({
  [`&.${fabClasses$1.disabled}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    boxShadow: (theme.vars || theme).shadows[0],
    backgroundColor: (theme.vars || theme).palette.action.disabledBackground
  }
}));
const Fab = /*#__PURE__*/React.forwardRef(function Fab(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiFab'
  });
  const {
      children,
      className,
      color = 'default',
      component = 'button',
      disabled = false,
      disableFocusRipple = false,
      focusVisibleClassName,
      size = 'large',
      variant = 'circular'
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$5);
  const ownerState = _extends({}, props, {
    color,
    component,
    disabled,
    disableFocusRipple,
    size,
    variant
  });
  const classes = useUtilityClasses$4(ownerState);
  return /*#__PURE__*/jsx(FabRoot, _extends({
    className: clsx(classes.root, className),
    component: component,
    disabled: disabled,
    focusRipple: !disableFocusRipple,
    focusVisibleClassName: clsx(classes.focusVisible, focusVisibleClassName),
    ownerState: ownerState,
    ref: ref
  }, other, {
    classes: classes,
    children: children
  }));
});
process.env.NODE_ENV !== "production" ? Fab.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The color of the component.
   * It supports both default and custom theme colors, which can be added as shown in the
   * [palette customization guide](https://mui.com/material-ui/customization/palette/#adding-new-colors).
   * @default 'default'
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.oneOf(['default', 'error', 'info', 'inherit', 'primary', 'secondary', 'success', 'warning']), PropTypes.string]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the  keyboard focus ripple is disabled.
   * @default false
   */
  disableFocusRipple: PropTypes.bool,
  /**
   * If `true`, the ripple effect is disabled.
   */
  disableRipple: PropTypes.bool,
  /**
   * @ignore
   */
  focusVisibleClassName: PropTypes.string,
  /**
   * The URL to link to when the button is clicked.
   * If defined, an `a` element will be used as the root node.
   */
  href: PropTypes.string,
  /**
   * The size of the component.
   * `small` is equivalent to the dense button styling.
   * @default 'large'
   */
  size: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.oneOf(['small', 'medium', 'large']), PropTypes.string]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * The variant to use.
   * @default 'circular'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.oneOf(['circular', 'extended']), PropTypes.string])
} : void 0;
const Fab$1 = Fab;

/**
 * @ignore - internal component.
 */
const GridContext = /*#__PURE__*/React.createContext();
if (process.env.NODE_ENV !== 'production') {
  GridContext.displayName = 'GridContext';
}
const GridContext$1 = GridContext;

function getGridUtilityClass(slot) {
  return unstable_generateUtilityClass('MuiGrid', slot);
}
const SPACINGS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const DIRECTIONS = ['column-reverse', 'column', 'row-reverse', 'row'];
const WRAPS = ['nowrap', 'wrap-reverse', 'wrap'];
const GRID_SIZES = ['auto', true, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const gridClasses = unstable_generateUtilityClasses('MuiGrid', ['root', 'container', 'item', 'zeroMinWidth',
// spacings
...SPACINGS.map(spacing => `spacing-xs-${spacing}`),
// direction values
...DIRECTIONS.map(direction => `direction-xs-${direction}`),
// wrap values
...WRAPS.map(wrap => `wrap-xs-${wrap}`),
// grid sizes for all breakpoints
...GRID_SIZES.map(size => `grid-xs-${size}`), ...GRID_SIZES.map(size => `grid-sm-${size}`), ...GRID_SIZES.map(size => `grid-md-${size}`), ...GRID_SIZES.map(size => `grid-lg-${size}`), ...GRID_SIZES.map(size => `grid-xl-${size}`)]);
const gridClasses$1 = gridClasses;

const _excluded$4 = ["className", "columns", "columnSpacing", "component", "container", "direction", "item", "rowSpacing", "spacing", "wrap", "zeroMinWidth"];
function getOffset(val) {
  const parse = parseFloat(val);
  return `${parse}${String(val).replace(String(parse), '') || 'px'}`;
}
function generateGrid({
  theme,
  ownerState
}) {
  let size;
  return theme.breakpoints.keys.reduce((globalStyles, breakpoint) => {
    // Use side effect over immutability for better performance.
    let styles = {};
    if (ownerState[breakpoint]) {
      size = ownerState[breakpoint];
    }
    if (!size) {
      return globalStyles;
    }
    if (size === true) {
      // For the auto layouting
      styles = {
        flexBasis: 0,
        flexGrow: 1,
        maxWidth: '100%'
      };
    } else if (size === 'auto') {
      styles = {
        flexBasis: 'auto',
        flexGrow: 0,
        flexShrink: 0,
        maxWidth: 'none',
        width: 'auto'
      };
    } else {
      const columnsBreakpointValues = unstable_resolveBreakpointValues({
        values: ownerState.columns,
        breakpoints: theme.breakpoints.values
      });
      const columnValue = typeof columnsBreakpointValues === 'object' ? columnsBreakpointValues[breakpoint] : columnsBreakpointValues;
      if (columnValue === undefined || columnValue === null) {
        return globalStyles;
      }
      // Keep 7 significant numbers.
      const width = `${Math.round(size / columnValue * 10e7) / 10e5}%`;
      let more = {};
      if (ownerState.container && ownerState.item && ownerState.columnSpacing !== 0) {
        const themeSpacing = theme.spacing(ownerState.columnSpacing);
        if (themeSpacing !== '0px') {
          const fullWidth = `calc(${width} + ${getOffset(themeSpacing)})`;
          more = {
            flexBasis: fullWidth,
            maxWidth: fullWidth
          };
        }
      }

      // Close to the bootstrap implementation:
      // https://github.com/twbs/bootstrap/blob/8fccaa2439e97ec72a4b7dc42ccc1f649790adb0/scss/mixins/_grid.scss#L41
      styles = _extends({
        flexBasis: width,
        flexGrow: 0,
        maxWidth: width
      }, more);
    }

    // No need for a media query for the first size.
    if (theme.breakpoints.values[breakpoint] === 0) {
      Object.assign(globalStyles, styles);
    } else {
      globalStyles[theme.breakpoints.up(breakpoint)] = styles;
    }
    return globalStyles;
  }, {});
}
function generateDirection({
  theme,
  ownerState
}) {
  const directionValues = unstable_resolveBreakpointValues({
    values: ownerState.direction,
    breakpoints: theme.breakpoints.values
  });
  return handleBreakpoints({
    theme
  }, directionValues, propValue => {
    const output = {
      flexDirection: propValue
    };
    if (propValue.indexOf('column') === 0) {
      output[`& > .${gridClasses$1.item}`] = {
        maxWidth: 'none'
      };
    }
    return output;
  });
}

/**
 * Extracts zero value breakpoint keys before a non-zero value breakpoint key.
 * @example { xs: 0, sm: 0, md: 2, lg: 0, xl: 0 } or [0, 0, 2, 0, 0]
 * @returns [xs, sm]
 */
function extractZeroValueBreakpointKeys({
  breakpoints,
  values
}) {
  let nonZeroKey = '';
  Object.keys(values).forEach(key => {
    if (nonZeroKey !== '') {
      return;
    }
    if (values[key] !== 0) {
      nonZeroKey = key;
    }
  });
  const sortedBreakpointKeysByValue = Object.keys(breakpoints).sort((a, b) => {
    return breakpoints[a] - breakpoints[b];
  });
  return sortedBreakpointKeysByValue.slice(0, sortedBreakpointKeysByValue.indexOf(nonZeroKey));
}
function generateRowGap({
  theme,
  ownerState
}) {
  const {
    container,
    rowSpacing
  } = ownerState;
  let styles = {};
  if (container && rowSpacing !== 0) {
    const rowSpacingValues = unstable_resolveBreakpointValues({
      values: rowSpacing,
      breakpoints: theme.breakpoints.values
    });
    let zeroValueBreakpointKeys;
    if (typeof rowSpacingValues === 'object') {
      zeroValueBreakpointKeys = extractZeroValueBreakpointKeys({
        breakpoints: theme.breakpoints.values,
        values: rowSpacingValues
      });
    }
    styles = handleBreakpoints({
      theme
    }, rowSpacingValues, (propValue, breakpoint) => {
      var _zeroValueBreakpointK;
      const themeSpacing = theme.spacing(propValue);
      if (themeSpacing !== '0px') {
        return {
          marginTop: `-${getOffset(themeSpacing)}`,
          [`& > .${gridClasses$1.item}`]: {
            paddingTop: getOffset(themeSpacing)
          }
        };
      }
      if ((_zeroValueBreakpointK = zeroValueBreakpointKeys) != null && _zeroValueBreakpointK.includes(breakpoint)) {
        return {};
      }
      return {
        marginTop: 0,
        [`& > .${gridClasses$1.item}`]: {
          paddingTop: 0
        }
      };
    });
  }
  return styles;
}
function generateColumnGap({
  theme,
  ownerState
}) {
  const {
    container,
    columnSpacing
  } = ownerState;
  let styles = {};
  if (container && columnSpacing !== 0) {
    const columnSpacingValues = unstable_resolveBreakpointValues({
      values: columnSpacing,
      breakpoints: theme.breakpoints.values
    });
    let zeroValueBreakpointKeys;
    if (typeof columnSpacingValues === 'object') {
      zeroValueBreakpointKeys = extractZeroValueBreakpointKeys({
        breakpoints: theme.breakpoints.values,
        values: columnSpacingValues
      });
    }
    styles = handleBreakpoints({
      theme
    }, columnSpacingValues, (propValue, breakpoint) => {
      var _zeroValueBreakpointK2;
      const themeSpacing = theme.spacing(propValue);
      if (themeSpacing !== '0px') {
        return {
          width: `calc(100% + ${getOffset(themeSpacing)})`,
          marginLeft: `-${getOffset(themeSpacing)}`,
          [`& > .${gridClasses$1.item}`]: {
            paddingLeft: getOffset(themeSpacing)
          }
        };
      }
      if ((_zeroValueBreakpointK2 = zeroValueBreakpointKeys) != null && _zeroValueBreakpointK2.includes(breakpoint)) {
        return {};
      }
      return {
        width: '100%',
        marginLeft: 0,
        [`& > .${gridClasses$1.item}`]: {
          paddingLeft: 0
        }
      };
    });
  }
  return styles;
}
function resolveSpacingStyles(spacing, breakpoints, styles = {}) {
  // undefined/null or `spacing` <= 0
  if (!spacing || spacing <= 0) {
    return [];
  }
  // in case of string/number `spacing`
  if (typeof spacing === 'string' && !Number.isNaN(Number(spacing)) || typeof spacing === 'number') {
    return [styles[`spacing-xs-${String(spacing)}`]];
  }
  // in case of object `spacing`
  const spacingStyles = [];
  breakpoints.forEach(breakpoint => {
    const value = spacing[breakpoint];
    if (Number(value) > 0) {
      spacingStyles.push(styles[`spacing-${breakpoint}-${String(value)}`]);
    }
  });
  return spacingStyles;
}

// Default CSS values
// flex: '0 1 auto',
// flexDirection: 'row',
// alignItems: 'flex-start',
// flexWrap: 'nowrap',
// justifyContent: 'flex-start',
const GridRoot = styled$1('div', {
  name: 'MuiGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    const {
      container,
      direction,
      item,
      spacing,
      wrap,
      zeroMinWidth,
      breakpoints
    } = ownerState;
    let spacingStyles = [];

    // in case of grid item
    if (container) {
      spacingStyles = resolveSpacingStyles(spacing, breakpoints, styles);
    }
    const breakpointsStyles = [];
    breakpoints.forEach(breakpoint => {
      const value = ownerState[breakpoint];
      if (value) {
        breakpointsStyles.push(styles[`grid-${breakpoint}-${String(value)}`]);
      }
    });
    return [styles.root, container && styles.container, item && styles.item, zeroMinWidth && styles.zeroMinWidth, ...spacingStyles, direction !== 'row' && styles[`direction-xs-${String(direction)}`], wrap !== 'wrap' && styles[`wrap-xs-${String(wrap)}`], ...breakpointsStyles];
  }
})(({
  ownerState
}) => _extends({
  boxSizing: 'border-box'
}, ownerState.container && {
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%'
}, ownerState.item && {
  margin: 0 // For instance, it's useful when used with a `figure` element.
}, ownerState.zeroMinWidth && {
  minWidth: 0
}, ownerState.wrap !== 'wrap' && {
  flexWrap: ownerState.wrap
}), generateDirection, generateRowGap, generateColumnGap, generateGrid);
function resolveSpacingClasses(spacing, breakpoints) {
  // undefined/null or `spacing` <= 0
  if (!spacing || spacing <= 0) {
    return [];
  }
  // in case of string/number `spacing`
  if (typeof spacing === 'string' && !Number.isNaN(Number(spacing)) || typeof spacing === 'number') {
    return [`spacing-xs-${String(spacing)}`];
  }
  // in case of object `spacing`
  const classes = [];
  breakpoints.forEach(breakpoint => {
    const value = spacing[breakpoint];
    if (Number(value) > 0) {
      const className = `spacing-${breakpoint}-${String(value)}`;
      classes.push(className);
    }
  });
  return classes;
}
const useUtilityClasses$3 = ownerState => {
  const {
    classes,
    container,
    direction,
    item,
    spacing,
    wrap,
    zeroMinWidth,
    breakpoints
  } = ownerState;
  let spacingClasses = [];

  // in case of grid item
  if (container) {
    spacingClasses = resolveSpacingClasses(spacing, breakpoints);
  }
  const breakpointsClasses = [];
  breakpoints.forEach(breakpoint => {
    const value = ownerState[breakpoint];
    if (value) {
      breakpointsClasses.push(`grid-${breakpoint}-${String(value)}`);
    }
  });
  const slots = {
    root: ['root', container && 'container', item && 'item', zeroMinWidth && 'zeroMinWidth', ...spacingClasses, direction !== 'row' && `direction-xs-${String(direction)}`, wrap !== 'wrap' && `wrap-xs-${String(wrap)}`, ...breakpointsClasses]
  };
  return unstable_composeClasses(slots, getGridUtilityClass, classes);
};
const Grid = /*#__PURE__*/React.forwardRef(function Grid(inProps, ref) {
  const themeProps = useThemeProps({
    props: inProps,
    name: 'MuiGrid'
  });
  const {
    breakpoints
  } = useTheme();
  const props = unstable_extendSxProp(themeProps);
  const {
      className,
      columns: columnsProp,
      columnSpacing: columnSpacingProp,
      component = 'div',
      container = false,
      direction = 'row',
      item = false,
      rowSpacing: rowSpacingProp,
      spacing = 0,
      wrap = 'wrap',
      zeroMinWidth = false
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$4);
  const rowSpacing = rowSpacingProp || spacing;
  const columnSpacing = columnSpacingProp || spacing;
  const columnsContext = React.useContext(GridContext$1);

  // columns set with default breakpoint unit of 12
  const columns = container ? columnsProp || 12 : columnsContext;
  const breakpointsValues = {};
  const otherFiltered = _extends({}, other);
  breakpoints.keys.forEach(breakpoint => {
    if (other[breakpoint] != null) {
      breakpointsValues[breakpoint] = other[breakpoint];
      delete otherFiltered[breakpoint];
    }
  });
  const ownerState = _extends({}, props, {
    columns,
    container,
    direction,
    item,
    rowSpacing,
    columnSpacing,
    wrap,
    zeroMinWidth,
    spacing
  }, breakpointsValues, {
    breakpoints: breakpoints.keys
  });
  const classes = useUtilityClasses$3(ownerState);
  return /*#__PURE__*/jsx(GridContext$1.Provider, {
    value: columns,
    children: /*#__PURE__*/jsx(GridRoot, _extends({
      ownerState: ownerState,
      className: clsx(classes.root, className),
      as: component,
      ref: ref
    }, otherFiltered))
  });
});
process.env.NODE_ENV !== "production" ? Grid.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The number of columns.
   * @default 12
   */
  columns: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.number), PropTypes.number, PropTypes.object]),
  /**
   * Defines the horizontal space between the type `item` components.
   * It overrides the value of the `spacing` prop.
   */
  columnSpacing: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), PropTypes.number, PropTypes.object, PropTypes.string]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the component will have the flex *container* behavior.
   * You should be wrapping *items* with a *container*.
   * @default false
   */
  container: PropTypes.bool,
  /**
   * Defines the `flex-direction` style property.
   * It is applied for all screen sizes.
   * @default 'row'
   */
  direction: PropTypes.oneOfType([PropTypes.oneOf(['column-reverse', 'column', 'row-reverse', 'row']), PropTypes.arrayOf(PropTypes.oneOf(['column-reverse', 'column', 'row-reverse', 'row'])), PropTypes.object]),
  /**
   * If `true`, the component will have the flex *item* behavior.
   * You should be wrapping *items* with a *container*.
   * @default false
   */
  item: PropTypes.bool,
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for the `lg` breakpoint and wider screens if not overridden.
   * @default false
   */
  lg: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number, PropTypes.bool]),
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for the `md` breakpoint and wider screens if not overridden.
   * @default false
   */
  md: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number, PropTypes.bool]),
  /**
   * Defines the vertical space between the type `item` components.
   * It overrides the value of the `spacing` prop.
   */
  rowSpacing: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), PropTypes.number, PropTypes.object, PropTypes.string]),
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for the `sm` breakpoint and wider screens if not overridden.
   * @default false
   */
  sm: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number, PropTypes.bool]),
  /**
   * Defines the space between the type `item` components.
   * It can only be used on a type `container` component.
   * @default 0
   */
  spacing: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), PropTypes.number, PropTypes.object, PropTypes.string]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * Defines the `flex-wrap` style property.
   * It's applied for all screen sizes.
   * @default 'wrap'
   */
  wrap: PropTypes.oneOf(['nowrap', 'wrap-reverse', 'wrap']),
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for the `xl` breakpoint and wider screens if not overridden.
   * @default false
   */
  xl: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number, PropTypes.bool]),
  /**
   * If a number, it sets the number of columns the grid item uses.
   * It can't be greater than the total number of columns of the container (12 by default).
   * If 'auto', the grid item's width matches its content.
   * If false, the prop is ignored.
   * If true, the grid item's width grows to use the space available in the grid container.
   * The value is applied for all the screen sizes with the lowest priority.
   * @default false
   */
  xs: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.number, PropTypes.bool]),
  /**
   * If `true`, it sets `min-width: 0` on the item.
   * Refer to the limitations section of the documentation to better understand the use case.
   * @default false
   */
  zeroMinWidth: PropTypes.bool
} : void 0;
if (process.env.NODE_ENV !== 'production') {
  const requireProp = unstable_requirePropFactory('Grid', Grid);
  // eslint-disable-next-line no-useless-concat
  Grid['propTypes' + ''] = _extends({}, Grid.propTypes, {
    direction: requireProp('container'),
    lg: requireProp('item'),
    md: requireProp('item'),
    sm: requireProp('item'),
    spacing: requireProp('container'),
    wrap: requireProp('container'),
    xs: requireProp('item'),
    zeroMinWidth: requireProp('item')
  });
}
const Grid$1 = Grid;

function getTabUtilityClass(slot) {
  return unstable_generateUtilityClass('MuiTab', slot);
}
const tabClasses = unstable_generateUtilityClasses('MuiTab', ['root', 'labelIcon', 'textColorInherit', 'textColorPrimary', 'textColorSecondary', 'selected', 'disabled', 'fullWidth', 'wrapped', 'iconWrapper']);
const tabClasses$1 = tabClasses;

const _excluded$3 = ["className", "disabled", "disableFocusRipple", "fullWidth", "icon", "iconPosition", "indicator", "label", "onChange", "onClick", "onFocus", "selected", "selectionFollowsFocus", "textColor", "value", "wrapped"];
const useUtilityClasses$2 = ownerState => {
  const {
    classes,
    textColor,
    fullWidth,
    wrapped,
    icon,
    label,
    selected,
    disabled
  } = ownerState;
  const slots = {
    root: ['root', icon && label && 'labelIcon', `textColor${unstable_capitalize(textColor)}`, fullWidth && 'fullWidth', wrapped && 'wrapped', selected && 'selected', disabled && 'disabled'],
    iconWrapper: ['iconWrapper']
  };
  return unstable_composeClasses(slots, getTabUtilityClass, classes);
};
const TabRoot = styled$1(ButtonBase$1, {
  name: 'MuiTab',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.label && ownerState.icon && styles.labelIcon, styles[`textColor${unstable_capitalize(ownerState.textColor)}`], ownerState.fullWidth && styles.fullWidth, ownerState.wrapped && styles.wrapped];
  }
})(({
  theme,
  ownerState
}) => _extends({}, theme.typography.button, {
  maxWidth: 360,
  minWidth: 90,
  position: 'relative',
  minHeight: 48,
  flexShrink: 0,
  padding: '12px 16px',
  overflow: 'hidden',
  whiteSpace: 'normal',
  textAlign: 'center'
}, ownerState.label && {
  flexDirection: ownerState.iconPosition === 'top' || ownerState.iconPosition === 'bottom' ? 'column' : 'row'
}, {
  lineHeight: 1.25
}, ownerState.icon && ownerState.label && {
  minHeight: 72,
  paddingTop: 9,
  paddingBottom: 9,
  [`& > .${tabClasses$1.iconWrapper}`]: _extends({}, ownerState.iconPosition === 'top' && {
    marginBottom: 6
  }, ownerState.iconPosition === 'bottom' && {
    marginTop: 6
  }, ownerState.iconPosition === 'start' && {
    marginRight: theme.spacing(1)
  }, ownerState.iconPosition === 'end' && {
    marginLeft: theme.spacing(1)
  })
}, ownerState.textColor === 'inherit' && {
  color: 'inherit',
  opacity: 0.6,
  // same opacity as theme.palette.text.secondary
  [`&.${tabClasses$1.selected}`]: {
    opacity: 1
  },
  [`&.${tabClasses$1.disabled}`]: {
    opacity: (theme.vars || theme).palette.action.disabledOpacity
  }
}, ownerState.textColor === 'primary' && {
  color: (theme.vars || theme).palette.text.secondary,
  [`&.${tabClasses$1.selected}`]: {
    color: (theme.vars || theme).palette.primary.main
  },
  [`&.${tabClasses$1.disabled}`]: {
    color: (theme.vars || theme).palette.text.disabled
  }
}, ownerState.textColor === 'secondary' && {
  color: (theme.vars || theme).palette.text.secondary,
  [`&.${tabClasses$1.selected}`]: {
    color: (theme.vars || theme).palette.secondary.main
  },
  [`&.${tabClasses$1.disabled}`]: {
    color: (theme.vars || theme).palette.text.disabled
  }
}, ownerState.fullWidth && {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: 0,
  maxWidth: 'none'
}, ownerState.wrapped && {
  fontSize: theme.typography.pxToRem(12)
}));
const Tab = /*#__PURE__*/React.forwardRef(function Tab(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiTab'
  });
  const {
      className,
      disabled = false,
      disableFocusRipple = false,
      // eslint-disable-next-line react/prop-types
      fullWidth,
      icon: iconProp,
      iconPosition = 'top',
      // eslint-disable-next-line react/prop-types
      indicator,
      label,
      onChange,
      onClick,
      onFocus,
      // eslint-disable-next-line react/prop-types
      selected,
      // eslint-disable-next-line react/prop-types
      selectionFollowsFocus,
      // eslint-disable-next-line react/prop-types
      textColor = 'inherit',
      value,
      wrapped = false
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$3);
  const ownerState = _extends({}, props, {
    disabled,
    disableFocusRipple,
    selected,
    icon: !!iconProp,
    iconPosition,
    label: !!label,
    fullWidth,
    textColor,
    wrapped
  });
  const classes = useUtilityClasses$2(ownerState);
  const icon = iconProp && label && /*#__PURE__*/React.isValidElement(iconProp) ? /*#__PURE__*/React.cloneElement(iconProp, {
    className: clsx(classes.iconWrapper, iconProp.props.className)
  }) : iconProp;
  const handleClick = event => {
    if (!selected && onChange) {
      onChange(event, value);
    }
    if (onClick) {
      onClick(event);
    }
  };
  const handleFocus = event => {
    if (selectionFollowsFocus && !selected && onChange) {
      onChange(event, value);
    }
    if (onFocus) {
      onFocus(event);
    }
  };
  return /*#__PURE__*/jsxs(TabRoot, _extends({
    focusRipple: !disableFocusRipple,
    className: clsx(classes.root, className),
    ref: ref,
    role: "tab",
    "aria-selected": selected,
    disabled: disabled,
    onClick: handleClick,
    onFocus: handleFocus,
    ownerState: ownerState,
    tabIndex: selected ? 0 : -1
  }, other, {
    children: [iconPosition === 'top' || iconPosition === 'start' ? /*#__PURE__*/jsxs(React.Fragment, {
      children: [icon, label]
    }) : /*#__PURE__*/jsxs(React.Fragment, {
      children: [label, icon]
    }), indicator]
  }));
});
process.env.NODE_ENV !== "production" ? Tab.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * This prop isn't supported.
   * Use the `component` prop if you need to change the children structure.
   */
  children: unstable_unsupportedProp,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, the  keyboard focus ripple is disabled.
   * @default false
   */
  disableFocusRipple: PropTypes.bool,
  /**
   * If `true`, the ripple effect is disabled.
   *
   * ⚠️ Without a ripple there is no styling for :focus-visible by default. Be sure
   * to highlight the element by applying separate styles with the `.Mui-focusVisible` class.
   * @default false
   */
  disableRipple: PropTypes.bool,
  /**
   * The icon to display.
   */
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  /**
   * The position of the icon relative to the label.
   * @default 'top'
   */
  iconPosition: PropTypes.oneOf(['bottom', 'end', 'start', 'top']),
  /**
   * The label element.
   */
  label: PropTypes.node,
  /**
   * @ignore
   */
  onChange: PropTypes.func,
  /**
   * @ignore
   */
  onClick: PropTypes.func,
  /**
   * @ignore
   */
  onFocus: PropTypes.func,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * You can provide your own value. Otherwise, we fallback to the child position index.
   */
  value: PropTypes.any,
  /**
   * Tab labels appear in a single row.
   * They can use a second line if needed.
   * @default false
   */
  wrapped: PropTypes.bool
} : void 0;
const Tab$1 = Tab;

const KeyboardArrowLeft = createSvgIcon( /*#__PURE__*/jsx("path", {
  d: "M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"
}), 'KeyboardArrowLeft');

const KeyboardArrowRight = createSvgIcon( /*#__PURE__*/jsx("path", {
  d: "M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"
}), 'KeyboardArrowRight');

function easeInOutSin(time) {
  return (1 + Math.sin(Math.PI * time - Math.PI / 2)) / 2;
}
function animate(property, element, to, options = {}, cb = () => {}) {
  const {
    ease = easeInOutSin,
    duration = 300 // standard
  } = options;
  let start = null;
  const from = element[property];
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };
  const step = timestamp => {
    if (cancelled) {
      cb(new Error('Animation cancelled'));
      return;
    }
    if (start === null) {
      start = timestamp;
    }
    const time = Math.min(1, (timestamp - start) / duration);
    element[property] = ease(time) * (to - from) + from;
    if (time >= 1) {
      requestAnimationFrame(() => {
        cb(null);
      });
      return;
    }
    requestAnimationFrame(step);
  };
  if (from === to) {
    cb(new Error('Element already at target position'));
    return cancel;
  }
  requestAnimationFrame(step);
  return cancel;
}

const _excluded$2 = ["onChange"];
const styles = {
  width: 99,
  height: 99,
  position: 'absolute',
  top: -9999,
  overflow: 'scroll'
};

/**
 * @ignore - internal component.
 * The component originates from https://github.com/STORIS/react-scrollbar-size.
 * It has been moved into the core in order to minimize the bundle size.
 */
function ScrollbarSize(props) {
  const {
      onChange
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$2);
  const scrollbarHeight = React.useRef();
  const nodeRef = React.useRef(null);
  const setMeasurements = () => {
    scrollbarHeight.current = nodeRef.current.offsetHeight - nodeRef.current.clientHeight;
  };
  React.useEffect(() => {
    const handleResize = unstable_debounce(() => {
      const prevHeight = scrollbarHeight.current;
      setMeasurements();
      if (prevHeight !== scrollbarHeight.current) {
        onChange(scrollbarHeight.current);
      }
    });
    const containerWindow = unstable_ownerWindow(nodeRef.current);
    containerWindow.addEventListener('resize', handleResize);
    return () => {
      handleResize.clear();
      containerWindow.removeEventListener('resize', handleResize);
    };
  }, [onChange]);
  React.useEffect(() => {
    setMeasurements();
    onChange(scrollbarHeight.current);
  }, [onChange]);
  return /*#__PURE__*/jsx("div", _extends({
    style: styles,
    ref: nodeRef
  }, other));
}
process.env.NODE_ENV !== "production" ? ScrollbarSize.propTypes = {
  onChange: PropTypes.func.isRequired
} : void 0;

function getTabScrollButtonUtilityClass(slot) {
  return unstable_generateUtilityClass('MuiTabScrollButton', slot);
}
const tabScrollButtonClasses = unstable_generateUtilityClasses('MuiTabScrollButton', ['root', 'vertical', 'horizontal', 'disabled']);
const tabScrollButtonClasses$1 = tabScrollButtonClasses;

var _KeyboardArrowLeft, _KeyboardArrowRight;
const _excluded$1 = ["className", "direction", "orientation", "disabled"];
const useUtilityClasses$1 = ownerState => {
  const {
    classes,
    orientation,
    disabled
  } = ownerState;
  const slots = {
    root: ['root', orientation, disabled && 'disabled']
  };
  return unstable_composeClasses(slots, getTabScrollButtonUtilityClass, classes);
};
const TabScrollButtonRoot = styled$1(ButtonBase$1, {
  name: 'MuiTabScrollButton',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, ownerState.orientation && styles[ownerState.orientation]];
  }
})(({
  ownerState
}) => _extends({
  width: 40,
  flexShrink: 0,
  opacity: 0.8,
  [`&.${tabScrollButtonClasses$1.disabled}`]: {
    opacity: 0
  }
}, ownerState.orientation === 'vertical' && {
  width: '100%',
  height: 40,
  '& svg': {
    transform: `rotate(${ownerState.isRtl ? -90 : 90}deg)`
  }
}));
const TabScrollButton = /*#__PURE__*/React.forwardRef(function TabScrollButton(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiTabScrollButton'
  });
  const {
      className,
      direction
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded$1);
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const ownerState = _extends({
    isRtl
  }, props);
  const classes = useUtilityClasses$1(ownerState);
  return /*#__PURE__*/jsx(TabScrollButtonRoot, _extends({
    component: "div",
    className: clsx(classes.root, className),
    ref: ref,
    role: null,
    ownerState: ownerState,
    tabIndex: null
  }, other, {
    children: direction === 'left' ? _KeyboardArrowLeft || (_KeyboardArrowLeft = /*#__PURE__*/jsx(KeyboardArrowLeft, {
      fontSize: "small"
    })) : _KeyboardArrowRight || (_KeyboardArrowRight = /*#__PURE__*/jsx(KeyboardArrowRight, {
      fontSize: "small"
    }))
  }));
});
process.env.NODE_ENV !== "production" ? TabScrollButton.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The direction the button should indicate.
   */
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  /**
   * If `true`, the component is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * The component orientation (layout flow direction).
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
const TabScrollButton$1 = TabScrollButton;

function getTabsUtilityClass(slot) {
  return unstable_generateUtilityClass('MuiTabs', slot);
}
const tabsClasses = unstable_generateUtilityClasses('MuiTabs', ['root', 'vertical', 'flexContainer', 'flexContainerVertical', 'centered', 'scroller', 'fixed', 'scrollableX', 'scrollableY', 'hideScrollbar', 'scrollButtons', 'scrollButtonsHideMobile', 'indicator']);
const tabsClasses$1 = tabsClasses;

const _excluded = ["aria-label", "aria-labelledby", "action", "centered", "children", "className", "component", "allowScrollButtonsMobile", "indicatorColor", "onChange", "orientation", "ScrollButtonComponent", "scrollButtons", "selectionFollowsFocus", "TabIndicatorProps", "TabScrollButtonProps", "textColor", "value", "variant", "visibleScrollbar"];
const nextItem = (list, item) => {
  if (list === item) {
    return list.firstChild;
  }
  if (item && item.nextElementSibling) {
    return item.nextElementSibling;
  }
  return list.firstChild;
};
const previousItem = (list, item) => {
  if (list === item) {
    return list.lastChild;
  }
  if (item && item.previousElementSibling) {
    return item.previousElementSibling;
  }
  return list.lastChild;
};
const moveFocus = (list, currentFocus, traversalFunction) => {
  let wrappedOnce = false;
  let nextFocus = traversalFunction(list, currentFocus);
  while (nextFocus) {
    // Prevent infinite loop.
    if (nextFocus === list.firstChild) {
      if (wrappedOnce) {
        return;
      }
      wrappedOnce = true;
    }

    // Same logic as useAutocomplete.js
    const nextFocusDisabled = nextFocus.disabled || nextFocus.getAttribute('aria-disabled') === 'true';
    if (!nextFocus.hasAttribute('tabindex') || nextFocusDisabled) {
      // Move to the next element.
      nextFocus = traversalFunction(list, nextFocus);
    } else {
      nextFocus.focus();
      return;
    }
  }
};
const useUtilityClasses = ownerState => {
  const {
    vertical,
    fixed,
    hideScrollbar,
    scrollableX,
    scrollableY,
    centered,
    scrollButtonsHideMobile,
    classes
  } = ownerState;
  const slots = {
    root: ['root', vertical && 'vertical'],
    scroller: ['scroller', fixed && 'fixed', hideScrollbar && 'hideScrollbar', scrollableX && 'scrollableX', scrollableY && 'scrollableY'],
    flexContainer: ['flexContainer', vertical && 'flexContainerVertical', centered && 'centered'],
    indicator: ['indicator'],
    scrollButtons: ['scrollButtons', scrollButtonsHideMobile && 'scrollButtonsHideMobile'],
    scrollableX: [scrollableX && 'scrollableX'],
    hideScrollbar: [hideScrollbar && 'hideScrollbar']
  };
  return unstable_composeClasses(slots, getTabsUtilityClass, classes);
};
const TabsRoot = styled$1('div', {
  name: 'MuiTabs',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [{
      [`& .${tabsClasses$1.scrollButtons}`]: styles.scrollButtons
    }, {
      [`& .${tabsClasses$1.scrollButtons}`]: ownerState.scrollButtonsHideMobile && styles.scrollButtonsHideMobile
    }, styles.root, ownerState.vertical && styles.vertical];
  }
})(({
  ownerState,
  theme
}) => _extends({
  overflow: 'hidden',
  minHeight: 48,
  // Add iOS momentum scrolling for iOS < 13.0
  WebkitOverflowScrolling: 'touch',
  display: 'flex'
}, ownerState.vertical && {
  flexDirection: 'column'
}, ownerState.scrollButtonsHideMobile && {
  [`& .${tabsClasses$1.scrollButtons}`]: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
}));
const TabsScroller = styled$1('div', {
  name: 'MuiTabs',
  slot: 'Scroller',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.scroller, ownerState.fixed && styles.fixed, ownerState.hideScrollbar && styles.hideScrollbar, ownerState.scrollableX && styles.scrollableX, ownerState.scrollableY && styles.scrollableY];
  }
})(({
  ownerState
}) => _extends({
  position: 'relative',
  display: 'inline-block',
  flex: '1 1 auto',
  whiteSpace: 'nowrap'
}, ownerState.fixed && {
  overflowX: 'hidden',
  width: '100%'
}, ownerState.hideScrollbar && {
  // Hide dimensionless scrollbar on macOS
  scrollbarWidth: 'none',
  // Firefox
  '&::-webkit-scrollbar': {
    display: 'none' // Safari + Chrome
  }
}, ownerState.scrollableX && {
  overflowX: 'auto',
  overflowY: 'hidden'
}, ownerState.scrollableY && {
  overflowY: 'auto',
  overflowX: 'hidden'
}));
const FlexContainer = styled$1('div', {
  name: 'MuiTabs',
  slot: 'FlexContainer',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.flexContainer, ownerState.vertical && styles.flexContainerVertical, ownerState.centered && styles.centered];
  }
})(({
  ownerState
}) => _extends({
  display: 'flex'
}, ownerState.vertical && {
  flexDirection: 'column'
}, ownerState.centered && {
  justifyContent: 'center'
}));
const TabsIndicator = styled$1('span', {
  name: 'MuiTabs',
  slot: 'Indicator',
  overridesResolver: (props, styles) => styles.indicator
})(({
  ownerState,
  theme
}) => _extends({
  position: 'absolute',
  height: 2,
  bottom: 0,
  width: '100%',
  transition: theme.transitions.create()
}, ownerState.indicatorColor === 'primary' && {
  backgroundColor: (theme.vars || theme).palette.primary.main
}, ownerState.indicatorColor === 'secondary' && {
  backgroundColor: (theme.vars || theme).palette.secondary.main
}, ownerState.vertical && {
  height: '100%',
  width: 2,
  right: 0
}));
const TabsScrollbarSize = styled$1(ScrollbarSize, {
  name: 'MuiTabs',
  slot: 'ScrollbarSize'
})({
  overflowX: 'auto',
  overflowY: 'hidden',
  // Hide dimensionless scrollbar on macOS
  scrollbarWidth: 'none',
  // Firefox
  '&::-webkit-scrollbar': {
    display: 'none' // Safari + Chrome
  }
});

const defaultIndicatorStyle = {};
let warnedOnceTabPresent = false;
const Tabs = /*#__PURE__*/React.forwardRef(function Tabs(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiTabs'
  });
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      action,
      centered = false,
      children: childrenProp,
      className,
      component = 'div',
      allowScrollButtonsMobile = false,
      indicatorColor = 'primary',
      onChange,
      orientation = 'horizontal',
      ScrollButtonComponent = TabScrollButton$1,
      scrollButtons = 'auto',
      selectionFollowsFocus,
      TabIndicatorProps = {},
      TabScrollButtonProps = {},
      textColor = 'primary',
      value,
      variant = 'standard',
      visibleScrollbar = false
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const scrollable = variant === 'scrollable';
  const vertical = orientation === 'vertical';
  const scrollStart = vertical ? 'scrollTop' : 'scrollLeft';
  const start = vertical ? 'top' : 'left';
  const end = vertical ? 'bottom' : 'right';
  const clientSize = vertical ? 'clientHeight' : 'clientWidth';
  const size = vertical ? 'height' : 'width';
  const ownerState = _extends({}, props, {
    component,
    allowScrollButtonsMobile,
    indicatorColor,
    orientation,
    vertical,
    scrollButtons,
    textColor,
    variant,
    visibleScrollbar,
    fixed: !scrollable,
    hideScrollbar: scrollable && !visibleScrollbar,
    scrollableX: scrollable && !vertical,
    scrollableY: scrollable && vertical,
    centered: centered && !scrollable,
    scrollButtonsHideMobile: !allowScrollButtonsMobile
  });
  const classes = useUtilityClasses(ownerState);
  if (process.env.NODE_ENV !== 'production') {
    if (centered && scrollable) {
      console.error('MUI: You can not use the `centered={true}` and `variant="scrollable"` properties ' + 'at the same time on a `Tabs` component.');
    }
  }
  const [mounted, setMounted] = React.useState(false);
  const [indicatorStyle, setIndicatorStyle] = React.useState(defaultIndicatorStyle);
  const [displayScroll, setDisplayScroll] = React.useState({
    start: false,
    end: false
  });
  const [scrollerStyle, setScrollerStyle] = React.useState({
    overflow: 'hidden',
    scrollbarWidth: 0
  });
  const valueToIndex = new Map();
  const tabsRef = React.useRef(null);
  const tabListRef = React.useRef(null);
  const getTabsMeta = () => {
    const tabsNode = tabsRef.current;
    let tabsMeta;
    if (tabsNode) {
      const rect = tabsNode.getBoundingClientRect();
      // create a new object with ClientRect class props + scrollLeft
      tabsMeta = {
        clientWidth: tabsNode.clientWidth,
        scrollLeft: tabsNode.scrollLeft,
        scrollTop: tabsNode.scrollTop,
        scrollLeftNormalized: unstable_getNormalizedScrollLeft(tabsNode, theme.direction),
        scrollWidth: tabsNode.scrollWidth,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right
      };
    }
    let tabMeta;
    if (tabsNode && value !== false) {
      const children = tabListRef.current.children;
      if (children.length > 0) {
        const tab = children[valueToIndex.get(value)];
        if (process.env.NODE_ENV !== 'production') {
          if (!tab) {
            console.error([`MUI: The \`value\` provided to the Tabs component is invalid.`, `None of the Tabs' children match with "${value}".`, valueToIndex.keys ? `You can provide one of the following values: ${Array.from(valueToIndex.keys()).join(', ')}.` : null].join('\n'));
          }
        }
        tabMeta = tab ? tab.getBoundingClientRect() : null;
        if (process.env.NODE_ENV !== 'production') {
          if (process.env.NODE_ENV !== 'test' && !warnedOnceTabPresent && tabMeta && tabMeta.width === 0 && tabMeta.height === 0) {
            tabsMeta = null;
            console.error(['MUI: The `value` provided to the Tabs component is invalid.', `The Tab with this \`value\` ("${value}") is not part of the document layout.`, "Make sure the tab item is present in the document or that it's not `display: none`."].join('\n'));
            warnedOnceTabPresent = true;
          }
        }
      }
    }
    return {
      tabsMeta,
      tabMeta
    };
  };
  const updateIndicatorState = unstable_useEventCallback(() => {
    const {
      tabsMeta,
      tabMeta
    } = getTabsMeta();
    let startValue = 0;
    let startIndicator;
    if (vertical) {
      startIndicator = 'top';
      if (tabMeta && tabsMeta) {
        startValue = tabMeta.top - tabsMeta.top + tabsMeta.scrollTop;
      }
    } else {
      startIndicator = isRtl ? 'right' : 'left';
      if (tabMeta && tabsMeta) {
        const correction = isRtl ? tabsMeta.scrollLeftNormalized + tabsMeta.clientWidth - tabsMeta.scrollWidth : tabsMeta.scrollLeft;
        startValue = (isRtl ? -1 : 1) * (tabMeta[startIndicator] - tabsMeta[startIndicator] + correction);
      }
    }
    const newIndicatorStyle = {
      [startIndicator]: startValue,
      // May be wrong until the font is loaded.
      [size]: tabMeta ? tabMeta[size] : 0
    };

    // IE11 support, replace with Number.isNaN
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(indicatorStyle[startIndicator]) || isNaN(indicatorStyle[size])) {
      setIndicatorStyle(newIndicatorStyle);
    } else {
      const dStart = Math.abs(indicatorStyle[startIndicator] - newIndicatorStyle[startIndicator]);
      const dSize = Math.abs(indicatorStyle[size] - newIndicatorStyle[size]);
      if (dStart >= 1 || dSize >= 1) {
        setIndicatorStyle(newIndicatorStyle);
      }
    }
  });
  const scroll = (scrollValue, {
    animation = true
  } = {}) => {
    if (animation) {
      animate(scrollStart, tabsRef.current, scrollValue, {
        duration: theme.transitions.duration.standard
      });
    } else {
      tabsRef.current[scrollStart] = scrollValue;
    }
  };
  const moveTabsScroll = delta => {
    let scrollValue = tabsRef.current[scrollStart];
    if (vertical) {
      scrollValue += delta;
    } else {
      scrollValue += delta * (isRtl ? -1 : 1);
      // Fix for Edge
      scrollValue *= isRtl && unstable_detectScrollType() === 'reverse' ? -1 : 1;
    }
    scroll(scrollValue);
  };
  const getScrollSize = () => {
    const containerSize = tabsRef.current[clientSize];
    let totalSize = 0;
    const children = Array.from(tabListRef.current.children);
    for (let i = 0; i < children.length; i += 1) {
      const tab = children[i];
      if (totalSize + tab[clientSize] > containerSize) {
        // If the first item is longer than the container size, then only scroll
        // by the container size.
        if (i === 0) {
          totalSize = containerSize;
        }
        break;
      }
      totalSize += tab[clientSize];
    }
    return totalSize;
  };
  const handleStartScrollClick = () => {
    moveTabsScroll(-1 * getScrollSize());
  };
  const handleEndScrollClick = () => {
    moveTabsScroll(getScrollSize());
  };

  // TODO Remove <ScrollbarSize /> as browser support for hidding the scrollbar
  // with CSS improves.
  const handleScrollbarSizeChange = React.useCallback(scrollbarWidth => {
    setScrollerStyle({
      overflow: null,
      scrollbarWidth
    });
  }, []);
  const getConditionalElements = () => {
    const conditionalElements = {};
    conditionalElements.scrollbarSizeListener = scrollable ? /*#__PURE__*/jsx(TabsScrollbarSize, {
      onChange: handleScrollbarSizeChange,
      className: clsx(classes.scrollableX, classes.hideScrollbar)
    }) : null;
    const scrollButtonsActive = displayScroll.start || displayScroll.end;
    const showScrollButtons = scrollable && (scrollButtons === 'auto' && scrollButtonsActive || scrollButtons === true);
    conditionalElements.scrollButtonStart = showScrollButtons ? /*#__PURE__*/jsx(ScrollButtonComponent, _extends({
      orientation: orientation,
      direction: isRtl ? 'right' : 'left',
      onClick: handleStartScrollClick,
      disabled: !displayScroll.start
    }, TabScrollButtonProps, {
      className: clsx(classes.scrollButtons, TabScrollButtonProps.className)
    })) : null;
    conditionalElements.scrollButtonEnd = showScrollButtons ? /*#__PURE__*/jsx(ScrollButtonComponent, _extends({
      orientation: orientation,
      direction: isRtl ? 'left' : 'right',
      onClick: handleEndScrollClick,
      disabled: !displayScroll.end
    }, TabScrollButtonProps, {
      className: clsx(classes.scrollButtons, TabScrollButtonProps.className)
    })) : null;
    return conditionalElements;
  };
  const scrollSelectedIntoView = unstable_useEventCallback(animation => {
    const {
      tabsMeta,
      tabMeta
    } = getTabsMeta();
    if (!tabMeta || !tabsMeta) {
      return;
    }
    if (tabMeta[start] < tabsMeta[start]) {
      // left side of button is out of view
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[start] - tabsMeta[start]);
      scroll(nextScrollStart, {
        animation
      });
    } else if (tabMeta[end] > tabsMeta[end]) {
      // right side of button is out of view
      const nextScrollStart = tabsMeta[scrollStart] + (tabMeta[end] - tabsMeta[end]);
      scroll(nextScrollStart, {
        animation
      });
    }
  });
  const updateScrollButtonState = unstable_useEventCallback(() => {
    if (scrollable && scrollButtons !== false) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollWidth,
        clientWidth
      } = tabsRef.current;
      let showStartScroll;
      let showEndScroll;
      if (vertical) {
        showStartScroll = scrollTop > 1;
        showEndScroll = scrollTop < scrollHeight - clientHeight - 1;
      } else {
        const scrollLeft = unstable_getNormalizedScrollLeft(tabsRef.current, theme.direction);
        // use 1 for the potential rounding error with browser zooms.
        showStartScroll = isRtl ? scrollLeft < scrollWidth - clientWidth - 1 : scrollLeft > 1;
        showEndScroll = !isRtl ? scrollLeft < scrollWidth - clientWidth - 1 : scrollLeft > 1;
      }
      if (showStartScroll !== displayScroll.start || showEndScroll !== displayScroll.end) {
        setDisplayScroll({
          start: showStartScroll,
          end: showEndScroll
        });
      }
    }
  });
  React.useEffect(() => {
    const handleResize = unstable_debounce(() => {
      // If the Tabs component is replaced by Suspense with a fallback, the last
      // ResizeObserver's handler that runs because of the change in the layout is trying to
      // access a dom node that is no longer there (as the fallback component is being shown instead).
      // See https://github.com/mui/material-ui/issues/33276
      // TODO: Add tests that will ensure the component is not failing when
      // replaced by Suspense with a fallback, once React is updated to version 18
      if (tabsRef.current) {
        updateIndicatorState();
        updateScrollButtonState();
      }
    });
    const win = unstable_ownerWindow(tabsRef.current);
    win.addEventListener('resize', handleResize);
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      Array.from(tabListRef.current.children).forEach(child => {
        resizeObserver.observe(child);
      });
    }
    return () => {
      handleResize.clear();
      win.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateIndicatorState, updateScrollButtonState]);
  const handleTabsScroll = React.useMemo(() => unstable_debounce(() => {
    updateScrollButtonState();
  }), [updateScrollButtonState]);
  React.useEffect(() => {
    return () => {
      handleTabsScroll.clear();
    };
  }, [handleTabsScroll]);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  React.useEffect(() => {
    updateIndicatorState();
    updateScrollButtonState();
  });
  React.useEffect(() => {
    // Don't animate on the first render.
    scrollSelectedIntoView(defaultIndicatorStyle !== indicatorStyle);
  }, [scrollSelectedIntoView, indicatorStyle]);
  React.useImperativeHandle(action, () => ({
    updateIndicator: updateIndicatorState,
    updateScrollButtons: updateScrollButtonState
  }), [updateIndicatorState, updateScrollButtonState]);
  const indicator = /*#__PURE__*/jsx(TabsIndicator, _extends({}, TabIndicatorProps, {
    className: clsx(classes.indicator, TabIndicatorProps.className),
    ownerState: ownerState,
    style: _extends({}, indicatorStyle, TabIndicatorProps.style)
  }));
  let childIndex = 0;
  const children = React.Children.map(childrenProp, child => {
    if (! /*#__PURE__*/React.isValidElement(child)) {
      return null;
    }
    if (process.env.NODE_ENV !== 'production') {
      if (isFragment(child)) {
        console.error(["MUI: The Tabs component doesn't accept a Fragment as a child.", 'Consider providing an array instead.'].join('\n'));
      }
    }
    const childValue = child.props.value === undefined ? childIndex : child.props.value;
    valueToIndex.set(childValue, childIndex);
    const selected = childValue === value;
    childIndex += 1;
    return /*#__PURE__*/React.cloneElement(child, _extends({
      fullWidth: variant === 'fullWidth',
      indicator: selected && !mounted && indicator,
      selected,
      selectionFollowsFocus,
      onChange,
      textColor,
      value: childValue
    }, childIndex === 1 && value === false && !child.props.tabIndex ? {
      tabIndex: 0
    } : {}));
  });
  const handleKeyDown = event => {
    const list = tabListRef.current;
    const currentFocus = unstable_ownerDocument(list).activeElement;
    // Keyboard navigation assumes that [role="tab"] are siblings
    // though we might warn in the future about nested, interactive elements
    // as a a11y violation
    const role = currentFocus.getAttribute('role');
    if (role !== 'tab') {
      return;
    }
    let previousItemKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    let nextItemKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (orientation === 'horizontal' && isRtl) {
      // swap previousItemKey with nextItemKey
      previousItemKey = 'ArrowRight';
      nextItemKey = 'ArrowLeft';
    }
    switch (event.key) {
      case previousItemKey:
        event.preventDefault();
        moveFocus(list, currentFocus, previousItem);
        break;
      case nextItemKey:
        event.preventDefault();
        moveFocus(list, currentFocus, nextItem);
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(list, null, nextItem);
        break;
      case 'End':
        event.preventDefault();
        moveFocus(list, null, previousItem);
        break;
    }
  };
  const conditionalElements = getConditionalElements();
  return /*#__PURE__*/jsxs(TabsRoot, _extends({
    className: clsx(classes.root, className),
    ownerState: ownerState,
    ref: ref,
    as: component
  }, other, {
    children: [conditionalElements.scrollButtonStart, conditionalElements.scrollbarSizeListener, /*#__PURE__*/jsxs(TabsScroller, {
      className: classes.scroller,
      ownerState: ownerState,
      style: {
        overflow: scrollerStyle.overflow,
        [vertical ? `margin${isRtl ? 'Left' : 'Right'}` : 'marginBottom']: visibleScrollbar ? undefined : -scrollerStyle.scrollbarWidth
      },
      ref: tabsRef,
      onScroll: handleTabsScroll,
      children: [/*#__PURE__*/jsx(FlexContainer, {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-orientation": orientation === 'vertical' ? 'vertical' : null,
        className: classes.flexContainer,
        ownerState: ownerState,
        onKeyDown: handleKeyDown,
        ref: tabListRef,
        role: "tablist",
        children: children
      }), mounted && indicator]
    }), conditionalElements.scrollButtonEnd]
  }));
});
process.env.NODE_ENV !== "production" ? Tabs.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when the component mounts.
   * This is useful when you want to trigger an action programmatically.
   * It supports two actions: `updateIndicator()` and `updateScrollButtons()`
   *
   * @param {object} actions This object contains all possible actions
   * that can be triggered programmatically.
   */
  action: refType,
  /**
   * If `true`, the scroll buttons aren't forced hidden on mobile.
   * By default the scroll buttons are hidden on mobile and takes precedence over `scrollButtons`.
   * @default false
   */
  allowScrollButtonsMobile: PropTypes.bool,
  /**
   * The label for the Tabs as a string.
   */
  'aria-label': PropTypes.string,
  /**
   * An id or list of ids separated by a space that label the Tabs.
   */
  'aria-labelledby': PropTypes.string,
  /**
   * If `true`, the tabs are centered.
   * This prop is intended for large views.
   * @default false
   */
  centered: PropTypes.bool,
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * Determines the color of the indicator.
   * @default 'primary'
   */
  indicatorColor: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([PropTypes.oneOf(['primary', 'secondary']), PropTypes.string]),
  /**
   * Callback fired when the value changes.
   *
   * @param {React.SyntheticEvent} event The event source of the callback. **Warning**: This is a generic event not a change event.
   * @param {any} value We default to the index of the child (number)
   */
  onChange: PropTypes.func,
  /**
   * The component orientation (layout flow direction).
   * @default 'horizontal'
   */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /**
   * The component used to render the scroll buttons.
   * @default TabScrollButton
   */
  ScrollButtonComponent: PropTypes.elementType,
  /**
   * Determine behavior of scroll buttons when tabs are set to scroll:
   *
   * - `auto` will only present them when not all the items are visible.
   * - `true` will always present them.
   * - `false` will never present them.
   *
   * By default the scroll buttons are hidden on mobile.
   * This behavior can be disabled with `allowScrollButtonsMobile`.
   * @default 'auto'
   */
  scrollButtons: PropTypes /* @typescript-to-proptypes-ignore */.oneOf(['auto', false, true]),
  /**
   * If `true` the selected tab changes on focus. Otherwise it only
   * changes on activation.
   */
  selectionFollowsFocus: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * Props applied to the tab indicator element.
   * @default  {}
   */
  TabIndicatorProps: PropTypes.object,
  /**
   * Props applied to the [`TabScrollButton`](/material-ui/api/tab-scroll-button/) element.
   * @default {}
   */
  TabScrollButtonProps: PropTypes.object,
  /**
   * Determines the color of the `Tab`.
   * @default 'primary'
   */
  textColor: PropTypes.oneOf(['inherit', 'primary', 'secondary']),
  /**
   * The value of the currently selected `Tab`.
   * If you don't want any selected `Tab`, you can set this prop to `false`.
   */
  value: PropTypes.any,
  /**
   * Determines additional display behavior of the tabs:
   *
   *  - `scrollable` will invoke scrolling properties and allow for horizontally
   *  scrolling (or swiping) of the tab bar.
   *  -`fullWidth` will make the tabs grow to use all the available space,
   *  which should be used for small views, like on mobile.
   *  - `standard` will render the default state.
   * @default 'standard'
   */
  variant: PropTypes.oneOf(['fullWidth', 'scrollable', 'standard']),
  /**
   * If `true`, the scrollbar is visible. It can be useful when displaying
   * a long vertical list of tabs.
   * @default false
   */
  visibleScrollbar: PropTypes.bool
} : void 0;
const Tabs$1 = Tabs;

const DistData2017 = [{
  id: 1,
  Parameter: "Kinematic viscosity at 40\xB0C",
  Unit: "mm\xB2/s",
  Limit: "Max.",
  DMX: "5.500",
  DMA: "6.000",
  DFA: "6.000",
  DMZ: "6.000",
  DFZ: "6.000",
  DMB: "11.00",
  DFB: "11.00"
}, {
  id: 2,
  Parameter: "Kinematic viscosity at 40\xB0C",
  Unit: "mm\xB2/s",
  Limit: "Min.",
  DMX: "1.400",
  DMA: "2.000",
  DFA: "2.000",
  DMZ: "3.000",
  DFZ: "3.000",
  DMB: "2.000",
  DFB: "2.000"
}, {
  id: 3,
  Parameter: "Density at 15\xB0C",
  Unit: "kg/m\xB3",
  Limit: "Max.",
  DMX: "-",
  DMA: "890.0",
  DFA: "890.0",
  DMZ: "890.0",
  DFZ: "890.0",
  DMB: "900.0",
  DFB: "900.0"
}, {
  id: 4,
  Parameter: "Cetane index",
  Unit: "-",
  Limit: "Min.",
  DMX: "45",
  DMA: "40",
  DFA: "40",
  DMZ: "40",
  DFZ: "40",
  DMB: "35",
  DFB: "35"
}, {
  id: 5,
  Parameter: "Sulfur",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "1.00",
  DMA: "1.00",
  DFA: "1.00",
  DMZ: "1.00",
  DFZ: "1.00",
  DMB: "1.50",
  DFB: "1.50"
}, {
  id: 6,
  Parameter: "Flash point",
  Unit: "\xB0C",
  Limit: "Min.",
  DMX: "43.0",
  DMA: "60.0",
  DFA: "60.0",
  DMZ: "60.0",
  DFZ: "60.0",
  DMB: "60.0",
  DFB: "60.0"
}, {
  id: 7,
  Parameter: "Hydrogen sulfide",
  Unit: "mg/kg",
  Limit: "Max.",
  DMX: "2.00",
  DMA: "2.00",
  DFA: "2.00",
  DMZ: "2.00",
  DFZ: "2.00",
  DMB: "2.00",
  DFB: "2.00"
}, {
  id: 8,
  Parameter: "Acid number",
  Unit: "mg KOH/g",
  Limit: "Max.",
  DMX: "0.5",
  DMA: "0.5",
  DFA: "0.5",
  DMZ: "0.5",
  DFZ: "0.5",
  DMB: "0.5",
  DFB: "0.5"
}, {
  id: 9,
  Parameter: "Total sediment by hot filtration",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DFA: "-",
  DMZ: "-",
  DFZ: "-",
  DMB: "0.10",
  DFB: "0.10"
}, {
  id: 10,
  Parameter: "Oxidation stability",
  Unit: "g/m\xB3",
  Limit: "Max.",
  DMX: "25",
  DMA: "25",
  DFA: "25",
  DMZ: "25",
  DFZ: "25",
  DMB: "25",
  DFB: "25"
}, {
  id: 11,
  Parameter: "Fatty acid methyl ester (FAME)",
  Unit: "volume %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DFA: "7.0",
  DMZ: "-",
  DFZ: "7.0",
  DMB: "-",
  DFB: "7.0"
}, {
  id: 12,
  Parameter: "Carbon residue - micro method on the 10% volume distillation residue",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "0.30",
  DMA: "0.30",
  DFA: "0.30",
  DMZ: "0.30",
  DFZ: "0.30",
  DMB: "-",
  DFB: "-"
}, {
  id: 13,
  Parameter: "Carbon residue - micro method",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DFA: "-",
  DMZ: "-",
  DFZ: "-",
  DMB: "0.30",
  DFB: "0.30"
}, {
  id: 14,
  Parameter: "Cloud point winter",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-16",
  DMA: "report",
  DFA: "report",
  DMZ: "report",
  DFZ: "report",
  DMB: "-",
  DFB: "-"
}, {
  id: 15,
  Parameter: "Cloud point summer",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-16",
  DMA: "-",
  DFA: "-",
  DMZ: "-",
  DFZ: "-",
  DMB: "-",
  DFB: "-"
}, {
  id: 16,
  Parameter: "Cold filter plugging point winter",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-",
  DMA: "report",
  DFA: "report",
  DMZ: "report",
  DFZ: "report",
  DMB: "-",
  DFB: "-"
}, {
  id: 17,
  Parameter: "Cold filter plugging point summer",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DFA: "-",
  DMZ: "-",
  DFZ: "-",
  DMB: "-",
  DFB: "-"
}, {
  id: 18,
  Parameter: "Pour point (upper) winter",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-",
  DMA: "-6",
  DFA: "-6",
  DMZ: "-6",
  DFZ: "-6",
  DMB: "0",
  DFB: "0"
}, {
  id: 19,
  Parameter: "Pour point (upper) summer",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-",
  DMA: "0",
  DFA: "0",
  DMZ: "0",
  DFZ: "0",
  DMB: "6",
  DFB: "6"
}, {
  id: 20,
  Parameter: "Appearance",
  Unit: "-",
  Limit: "-",
  DMX: "Clear & Bright",
  DMA: "Clear & Bright",
  DFA: "Clear & Bright",
  DMZ: "Clear & Bright",
  DFZ: "Clear & Bright",
  DMB: "-",
  DFB: "-"
}, {
  id: 21,
  Parameter: "Water",
  Unit: "volume %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DFA: "-",
  DMZ: "-",
  DFZ: "-",
  DMB: "-",
  DFB: "0.30"
}, {
  id: 22,
  Parameter: "Ash",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "0.010",
  DMA: "0.010",
  DFA: "0.010",
  DMZ: "0.010",
  DFZ: "0.010",
  DMB: "0.010",
  DFB: "0.010"
}, {
  id: 23,
  Parameter: "Lubricity, corrected wear scar diameter (WSD) at 60\xB0C",
  Unit: "\xB5m",
  Limit: "Max.",
  DMX: "520",
  DMA: "520",
  DFA: "520",
  DMZ: "520",
  DFZ: "520",
  DMB: "520",
  DFB: "520"
}];
const DistData20122010 = [{
  id: 1,
  Parameter: "Kinematic viscosity at 40\xB0C",
  Unit: "mm\xB2/s",
  Limit: "Max.",
  DMX: "5.500",
  DMA: "6.000",
  DMZ: "6.000",
  DMB: "11.00"
}, {
  id: 2,
  Parameter: "Kinematic viscosity at 40\xB0C",
  Unit: "mm\xB2/s",
  Limit: "Min.",
  DMX: "1.400",
  DMA: "2.000",
  DMZ: "3.000",
  DMB: "2.000"
}, {
  id: 3,
  Parameter: "Carbon residue - micro method on the 10% volume distillation residue",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "0.30",
  DMA: "0.30",
  DMZ: "0.30",
  DMB: "-"
}, {
  id: 4,
  Parameter: "Density at 15\xB0C",
  Unit: "kg/m\xB3",
  Limit: "Max.",
  DMX: "-",
  DMA: "890.0",
  DMZ: "890.0",
  DMB: "900.0"
}, {
  id: 5,
  Parameter: "Carbon residue - micro method",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "-",
  DMB: "0.30"
}, {
  id: 6,
  Parameter: "Sulfur",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "1.00",
  DMA: "1.50",
  DMZ: "1.50",
  DMB: "2.00"
}, {
  id: 7,
  Parameter: "Water",
  Unit: "volume %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "-",
  DMB: "0.30"
}, {
  id: 8,
  Parameter: "Total sediment by hot filtration",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "-",
  DMB: "0.10"
}, {
  id: 9,
  Parameter: "Ash",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "0.010",
  DMA: "0.010",
  DMZ: "0.010",
  DMB: "0.010"
}, {
  id: 10,
  Parameter: "Flash point",
  Unit: "\xB0C",
  Limit: "Min.",
  DMX: "43.0",
  DMA: "60.0",
  DMZ: "60.0",
  DMB: "60.0"
}, {
  id: 11,
  Parameter: "Pour point (upper) summer",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-",
  DMA: "0",
  DMZ: "0",
  DMB: "6"
}, {
  id: 12,
  Parameter: "Pour point (upper) winter",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-",
  DMA: "-6",
  DMZ: "-6",
  DMB: "0"
}, {
  id: 13,
  Parameter: "Cloud point",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-16",
  DMA: "report",
  DMZ: "report",
  DMB: "-"
}, {
  id: 14,
  Parameter: "Cetane index",
  Unit: "-",
  Limit: "Min.",
  DMX: "45",
  DMA: "40",
  DMZ: "40",
  DMB: "35"
}, {
  id: 15,
  Parameter: "Acid number",
  Unit: "mg KOH/g",
  Limit: "Max.",
  DMX: "0.5",
  DMA: "0.5",
  DMZ: "0.5",
  DMB: "0.5"
}, {
  id: 16,
  Parameter: "Oxidation stability",
  Unit: "g/m\xB3",
  Limit: "Max.",
  DMX: "25",
  DMA: "25",
  DMZ: "25",
  DMB: "25"
}, {
  id: 17,
  Parameter: "Lubricity, corrected wear scar diameter (WSD) at 60\xB0C",
  Unit: "\xB5m",
  Limit: "Max.",
  DMX: "520",
  DMA: "520",
  DMZ: "520",
  DMB: "520"
}, {
  id: 18,
  Parameter: "Hydrogen sulfide",
  Unit: "mg/kg",
  Limit: "Max.",
  DMX: "2.00",
  DMA: "2.00",
  DMZ: "2.00",
  DMB: "2.00"
}, {
  id: 19,
  Parameter: "Appearance",
  Unit: "-",
  Limit: "-",
  DMX: "Clear & Bright",
  DMA: "Clear & Bright",
  DMZ: "Clear & Bright",
  DMB: "-"
}];
const DistData2005 = [{
  id: 1,
  Parameter: "Kinematic viscosity at 40\xB0C",
  Unit: "mm\xB2/s",
  Limit: "Max.",
  DMX: "5.500",
  DMA: "6.000",
  DMZ: "11.000",
  DMB: "14.00"
}, {
  id: 2,
  Parameter: "Kinematic viscosity at 40\xB0C",
  Unit: "mm\xB2/s",
  Limit: "Min.",
  DMX: "1.400",
  DMA: "1.500",
  DMZ: "-",
  DMB: "-"
}, {
  id: 3,
  Parameter: "Carbon residue - micro method on the 10% volume distillation residue",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "0.30",
  DMA: "0.30",
  DMZ: "-",
  DMB: "-"
}, {
  id: 4,
  Parameter: "Density at 15\xB0C",
  Unit: "kg/m\xB3",
  Limit: "Max.",
  DMX: "-",
  DMA: "890.0",
  DMZ: "900.0",
  DMB: "920.0"
}, {
  id: 5,
  Parameter: "Carbon residue - micro method",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "0.30",
  DMB: "2.50"
}, {
  id: 6,
  Parameter: "Sulfur",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "1.00",
  DMA: "1.50",
  DMZ: "2.00",
  DMB: "2.00"
}, {
  id: 7,
  Parameter: "Water",
  Unit: "volume %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "0.30",
  DMB: "0.30"
}, {
  id: 8,
  Parameter: "Total sediment by hot filtration",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "-",
  DMB: "0.10"
}, {
  id: 9,
  Parameter: "Ash",
  Unit: "mass %",
  Limit: "Max.",
  DMX: "0.010",
  DMA: "0.010",
  DMZ: "0.010",
  DMB: "0.05"
}, {
  id: 10,
  Parameter: "Flash point",
  Unit: "\xB0C",
  Limit: "Min.",
  DMX: "43.0",
  DMA: "60.0",
  DMZ: "60.0",
  DMB: "60.0"
}, {
  id: 11,
  Parameter: "Pour point (upper) summer",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-",
  DMA: "0",
  DMZ: "6",
  DMB: "6"
}, {
  id: 12,
  Parameter: "Pour point (upper) winter",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-",
  DMA: "-6",
  DMZ: "0",
  DMB: "0"
}, {
  id: 13,
  Parameter: "Cloud point",
  Unit: "\xB0C",
  Limit: "Max.",
  DMX: "-16",
  DMA: "-",
  DMZ: "-",
  DMB: "-"
}, {
  id: 14,
  Parameter: "Cetane index",
  Unit: "-",
  Limit: "Min.",
  DMX: "45",
  DMA: "40",
  DMZ: "35",
  DMB: "-"
}, {
  id: 15,
  Parameter: "Vanadium",
  Unit: "mg/kg",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "-",
  DMB: "100"
}, {
  id: 16,
  Parameter: "Aliminium + Silicon",
  Unit: "mg/kg",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "-",
  DMB: "25"
}, {
  id: 17,
  Parameter: "Zinc",
  Unit: "mg/kg",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "-",
  DMB: "15"
}, {
  id: 18,
  Parameter: "Phosphorus",
  Unit: "mg/kg",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "-",
  DMB: "15"
}, {
  id: 19,
  Parameter: "Calcium",
  Unit: "mg/kg",
  Limit: "Max.",
  DMX: "-",
  DMA: "-",
  DMZ: "-",
  DMB: "30"
}, {
  id: 20,
  Parameter: "Appearance",
  Unit: "-",
  Limit: "-",
  DMX: "Clear & Bright",
  DMA: "Clear & Bright",
  DMZ: "-",
  DMB: "-"
}];
const ResData2005 = [{
  id: 1,
  Parameter: "Viscosity at 50\xB0C",
  Unit: "mm\xB2/s",
  Limit: "Max.",
  RMA30: "30.00",
  RMB30: "30.00",
  RMD80: "80.0",
  RME180: "180.0",
  RMF180: "180.0",
  RMG380: "380.0",
  RMH380: "380.0",
  RMK380: "380.0",
  RMH700: "700.0",
  RMK700: "700.0"
}, {
  id: 2,
  Parameter: "Density at 15\xB0C ",
  Unit: "kg/m\xB3",
  Limit: "Max.",
  RMA30: "960.0",
  RMB30: "975.0",
  RMD80: "980.0",
  RME180: "991.0",
  RMF180: "991.0",
  RMG380: "991.0",
  RMH380: "991.0",
  RMK380: "1010.0",
  RMH700: "991.0",
  RMK700: "1010.0"
}, {
  id: 3,
  Parameter: "Micro Carbon Residue",
  Unit: "% m/m",
  Limit: "Max.",
  RMA30: "10.00",
  RMB30: "10.00",
  RMD80: "14.00",
  RME180: "15.00",
  RMF180: "20.00",
  RMG380: "18.00",
  RMH380: "22.00",
  RMK380: "22.00",
  RMH700: "22.00",
  RMK700: "22.00"
}, {
  id: 4,
  Parameter: "Aluminium + Silicon",
  Unit: "mg/kg",
  Limit: "Max.",
  RMA30: "80",
  RMB30: "80",
  RMD80: "80",
  RME180: "80",
  RMF180: "80",
  RMG380: "80",
  RMH380: "80",
  RMK380: "80",
  RMH700: "80",
  RMK700: "80"
}, {
  id: 5,
  Parameter: "Ash",
  Unit: "% m/m",
  Limit: "Max.",
  RMA30: "0.10",
  RMB30: "0.10",
  RMD80: "0.10",
  RME180: "0.10",
  RMF180: "0.15",
  RMG380: "0.15",
  RMH380: "0.15",
  RMK380: "0.15",
  RMH700: "0.15",
  RMK700: "0.15"
}, {
  id: 6,
  Parameter: "Vanadium",
  Unit: "mg/kg",
  Limit: "Max.",
  RMA30: "150",
  RMB30: "150",
  RMD80: "350",
  RME180: "200",
  RMF180: "500",
  RMG380: "300",
  RMH380: "600",
  RMK380: "600",
  RMH700: "600",
  RMK700: "600"
}, {
  id: 7,
  Parameter: "Water",
  Unit: "% V/V",
  Limit: "Max.",
  RMA30: "0.50",
  RMB30: "0.50",
  RMD80: "0.50",
  RME180: "0.50",
  RMF180: "0.50",
  RMG380: "0.50",
  RMH380: "0.50",
  RMK380: "0.50",
  RMH700: "0.50",
  RMK700: "0.50"
}, {
  id: 8,
  Parameter: "Pour point (upper) in Summer",
  Unit: "\xB0C",
  Limit: "Max.",
  RMA30: "6",
  RMB30: "24",
  RMD80: "30",
  RME180: "30",
  RMF180: "30",
  RMG380: "30",
  RMH380: "30",
  RMK380: "30",
  RMH700: "30",
  RMK700: "30"
}, {
  id: 9,
  Parameter: "Pour point (upper) in Winter",
  Unit: "\xB0C",
  Limit: "Max.",
  RMA30: "0",
  RMB30: "24",
  RMD80: "30",
  RME180: "30",
  RMF180: "30",
  RMG380: "30",
  RMH380: "30",
  RMK380: "30",
  RMH700: "30",
  RMK700: "30"
}, {
  id: 10,
  Parameter: "Flash point",
  Unit: "\xB0C",
  Limit: "Max.",
  RMA30: "60.0",
  RMB30: "60.0",
  RMD80: "60.0",
  RME180: "60.0",
  RMF180: "60.0",
  RMG380: "60.0",
  RMH380: "60.0",
  RMK380: "60.0",
  RMH700: "60.0",
  RMK700: "60.0"
}, {
  id: 11,
  Parameter: "Sulphur",
  Unit: "% m/m",
  Limit: "Min.",
  RMA30: "3.5",
  RMB30: "3.5",
  RMD80: "4.0",
  RME180: "4.5",
  RMF180: "4.5",
  RMG380: "4.5",
  RMH380: "4.5",
  RMK380: "4.5",
  RMH700: "4.5",
  RMK700: "4.5"
}, {
  id: 12,
  Parameter: "Total Sediment, Potential",
  Unit: "(% m/m",
  Limit: "Max.",
  RMA30: "0.10",
  RMB30: "0.10",
  RMD80: "0.10",
  RME180: "0.10",
  RMF180: "0.10",
  RMG380: "0.10",
  RMH380: "0.10",
  RMK380: "0.10",
  RMH700: "0.10",
  RMK700: "0.10"
}, {
  id: 13,
  Parameter: "Zinc",
  Unit: "mg/kg",
  Limit: "Max.",
  RMA30: "15",
  RMB30: "15",
  RMD80: "15",
  RME180: "15",
  RMF180: "15",
  RMG380: "15",
  RMH380: "15",
  RMK380: "15",
  RMH700: "15",
  RMK700: "15"
}, {
  id: 14,
  Parameter: "Phosphorus",
  Unit: "mg/kg",
  Limit: "Max.",
  RMA30: "15",
  RMB30: "15",
  RMD80: "15",
  RME180: "15",
  RMF180: "15",
  RMG380: "15",
  RMH380: "15",
  RMK380: "15",
  RMH700: "15",
  RMK700: "15"
}, {
  id: 15,
  Parameter: "Calcium",
  Unit: "mg/kg",
  Limit: "Max.",
  RMA30: "30",
  RMB30: "30",
  RMD80: "30",
  RME180: "30",
  RMF180: "30",
  RMG380: "30",
  RMH380: "30",
  RMK380: "30",
  RMH700: "30",
  RMK700: "30"
}];
const ResData201720122010 = [{
  id: 1,
  Parameter: "Viscosity at 50\xB0C",
  Unit: "mm\xB2/s",
  Limit: "Max.",
  RMA10: "10.00",
  RMB30: "30.00",
  RMD80: "80.00",
  RME180: "180.0",
  RMG180: "180.0",
  RMG380: "380.0",
  RMG500: "500.0",
  RMG700: "700.0",
  RMK380: "380.0",
  RMK500: "500.0",
  RMK700: "700.0"
}, {
  id: 2,
  Parameter: "Density at 15\xB0C ",
  Unit: "kg/m\xB3",
  Limit: "Max.",
  RMA10: "920.0",
  RMB30: "960.0",
  RMD80: "975.0",
  RME180: "991.0",
  RMG180: "991.0",
  RMG380: "991.0",
  RMG500: "991.0",
  RMG700: "991.0",
  RMK380: "1010.0",
  RMK500: "1010.0",
  RMK700: "1010.0"
}, {
  id: 3,
  Parameter: "Micro Carbon Residue",
  Unit: "% m/m",
  Limit: "Max.",
  RMA10: "2.50",
  RMB30: "10.00",
  RMD80: "14.00",
  RME180: "15.00",
  RMG180: "18.00",
  RMG380: "18.00",
  RMG500: "18.00",
  RMG700: "18.00",
  RMK380: "20.00",
  RMK500: "20.00",
  RMK700: "20.00"
}, {
  id: 4,
  Parameter: "Aluminium + Silicon",
  Unit: "mg/kg",
  Limit: "Max.",
  RMA10: "25",
  RMB30: "40",
  RMD80: "40",
  RME180: "50",
  RMG180: "60",
  RMG380: "60",
  RMG500: "60",
  RMG700: "60",
  RMK380: "60",
  RMK500: "60",
  RMK700: "60"
}, {
  id: 5,
  Parameter: "Sodium",
  Unit: "mg/kg",
  Limit: "Max.",
  RMA10: "50",
  RMB30: "100",
  RMD80: "100",
  RME180: "50",
  RMG180: "100",
  RMG380: "100",
  RMG500: "100",
  RMG700: "100",
  RMK380: "100",
  RMK500: "100",
  RMK700: "100"
}, {
  id: 6,
  Parameter: "Ash",
  Unit: "% m/m",
  Limit: "Max.",
  RMA10: "0.040",
  RMB30: "0.070",
  RMD80: "0.070",
  RME180: "0.070",
  RMG180: "0.100",
  RMG380: "0.100",
  RMG500: "0.100",
  RMG700: "0.100",
  RMK380: "0.150",
  RMK500: "0.150",
  RMK700: "0.150"
}, {
  id: 7,
  Parameter: "Vanadium",
  Unit: "mg/kg",
  Limit: "Max.",
  RMA10: "50",
  RMB30: "150",
  RMD80: "150",
  RME180: "150",
  RMG180: "350",
  RMG380: "350",
  RMG500: "350",
  RMG700: "350",
  RMK380: "450",
  RMK500: "450",
  RMK700: "450"
}, {
  id: 8,
  Parameter: "CCAI",
  Unit: "",
  Limit: "Max.",
  RMA10: "850",
  RMB30: "860",
  RMD80: "860",
  RME180: "860",
  RMG180: "870",
  RMG380: "870",
  RMG500: "870",
  RMG700: "870",
  RMK380: "870",
  RMK500: "870",
  RMK700: "870"
}, {
  id: 9,
  Parameter: "Water",
  Unit: "% V/V",
  Limit: "Max.",
  RMA10: "0.30",
  RMB30: "0.50",
  RMD80: "0.50",
  RME180: "0.50",
  RMG180: "0.50",
  RMG380: "0.50",
  RMG500: "0.50",
  RMG700: "0.50",
  RMK380: "0.50",
  RMK500: "0.50",
  RMK700: "0.50"
}, {
  id: 10,
  Parameter: "Pour point (upper) in Summer",
  Unit: "\xB0C",
  Limit: "Max.",
  RMA10: "6",
  RMB30: "6",
  RMD80: "30",
  RME180: "30",
  RMG180: "30",
  RMG380: "30",
  RMG500: "30",
  RMG700: "30",
  RMK380: "30",
  RMK500: "30",
  RMK700: "30"
}, {
  id: 11,
  Parameter: "Pour point (upper) in Winter",
  Unit: "\xB0C",
  Limit: "Max.",
  RMA10: "0",
  RMB30: "0",
  RMD80: "30",
  RME180: "30",
  RMG180: "30",
  RMG380: "30",
  RMG500: "30",
  RMG700: "30",
  RMK380: "30",
  RMK500: "30",
  RMK700: "30"
}, {
  id: 12,
  Parameter: "Flash point",
  Unit: "\xB0C",
  Limit: "Max.",
  RMA10: "60.0",
  RMB30: "60.0",
  RMD80: "60.0",
  RME180: "60.0",
  RMG180: "60.0",
  RMG380: "60.0",
  RMG500: "60.0",
  RMG700: "60.0",
  RMK380: "60.0",
  RMK500: "60.0",
  RMK700: "60.0"
}, {
  id: 13,
  Parameter: "Sulphur",
  Unit: "% m/m",
  Limit: "Min.",
  RMA10: "*",
  RMB30: "*",
  RMD80: "*",
  RME180: "*",
  RMG180: "*",
  RMG380: "*",
  RMG500: "*",
  RMG700: "*",
  RMK380: "*",
  RMK500: "*",
  RMK700: "*"
}, {
  id: 14,
  Parameter: "Total Sediment, aged",
  Unit: "% m/m",
  Limit: "Max.",
  RMA10: "0.10",
  RMB30: "0.10",
  RMD80: "0.10",
  RME180: "0.10",
  RMG180: "0.10",
  RMG380: "0.10",
  RMG500: "0.10",
  RMG700: "0.10",
  RMK380: "0.10",
  RMK500: "0.10",
  RMK700: "0.10"
}, {
  id: 15,
  Parameter: "Acid Number",
  Unit: "mgKOH/g",
  Limit: "Max.",
  RMA10: "2.5",
  RMB30: "2.5",
  RMD80: "2.5",
  RME180: "2.5",
  RMG180: "2.5",
  RMG380: "2.5",
  RMG500: "2.5",
  RMG700: "2.5",
  RMK380: "2.5",
  RMK500: "2.5",
  RMK700: "2.5"
}, {
  id: 16,
  Parameter: "Used lubricating oils (ULO)",
  Unit: "mg/kg)",
  Limit: "Max.",
  RMA10: "#",
  RMB30: "#",
  RMD80: "#",
  RME180: "#",
  RMG180: "#",
  RMG380: "#",
  RMG500: "#",
  RMG700: "#",
  RMK380: "#",
  RMK500: "#",
  RMK700: "#"
}, {
  id: 17,
  Parameter: "Hydrogen sulphide",
  Unit: "mg/kg)",
  Limit: "Max.",
  RMA10: "2.00",
  RMB30: "2.00",
  RMD80: "2.00",
  RME180: "2.00",
  RMG180: "2.00",
  RMG380: "2.00",
  RMG500: "2.00",
  RMG700: "2.00",
  RMK380: "2.00",
  RMK500: "2.00",
  RMK700: "2.00"
}];
const columnDefs2017 = [{
  field: "Parameter",
  maxWidth: 350,
  minWidth: 350
}, {
  field: "Unit",
  maxWidth: 90
}, {
  field: "Limit",
  maxWidth: 70
}, {
  field: "DMX",
  maxWidth: 70
}, {
  field: "DMA",
  maxWidth: 70
}, {
  field: "DFA",
  maxWidth: 70
}, {
  field: "DMZ",
  maxWidth: 70
}, {
  field: "DFZ",
  maxWidth: 70
}, {
  field: "DMB",
  maxWidth: 70
}, {
  field: "DFB",
  maxWidth: 70
}];
const columnDefs201220102005 = [{
  field: "Parameter",
  maxWidth: 350,
  minWidth: 350
}, {
  field: "Unit",
  maxWidth: 90
}, {
  field: "Limit",
  maxWidth: 70
}, {
  field: "DMX",
  maxWidth: 70
}, {
  field: "DMA",
  maxWidth: 70
}, {
  field: "DMZ",
  maxWidth: 70
}, {
  field: "DMB",
  maxWidth: 70
}];
const columnDefsRes201720122010 = [{
  field: "Parameter",
  maxWidth: 170,
  minWidth: 170
}, {
  field: "Unit",
  maxWidth: 90
}, {
  field: "Limit",
  maxWidth: 70
}, {
  field: "RMA10",
  maxWidth: 70
}, {
  field: "RMB30",
  maxWidth: 70
}, {
  field: "RMD80",
  maxWidth: 70
}, {
  field: "RME180",
  maxWidth: 70
}, {
  field: "RMG180",
  maxWidth: 70
}, {
  field: "RMG380",
  maxWidth: 70
}, {
  field: "RMG500",
  maxWidth: 70
}, {
  field: "RMG700",
  maxWidth: 70
}, {
  field: "RMK380",
  maxWidth: 70
}, {
  field: "RMK500",
  maxWidth: 70
}, {
  field: "RMK700",
  maxWidth: 70
}];
const columnDefsRes2005 = [{
  field: "Parameter",
  maxWidth: 170,
  minWidth: 170
}, {
  field: "Unit",
  maxWidth: 90
}, {
  field: "Limit",
  maxWidth: 70
}, {
  field: "RMA30",
  maxWidth: 70
}, {
  field: "RMB30",
  maxWidth: 70
}, {
  field: "RMD80",
  maxWidth: 70
}, {
  field: "RME180",
  maxWidth: 70
}, {
  field: "RMF180",
  maxWidth: 70
}, {
  field: "RMG380",
  maxWidth: 70
}, {
  field: "RMH380",
  maxWidth: 70
}, {
  field: "RMK380",
  maxWidth: 70
}, {
  field: "RMH700",
  maxWidth: 70
}, {
  field: "RMK700",
  maxWidth: 70
}];
const getKeyValue = (key) => (obj) => obj[key];
function DistTable201220102005({
  rows,
  type
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto",
    style: {
      maxWidth: 800,
      padding: "50px 10px",
      fontSize: 13
    },
    children: [/* @__PURE__ */ jsx("b", {
      children: /* @__PURE__ */ jsx(Box$1, {
        sx: {
          borderBottom: 1,
          borderColor: "contrast"
        },
        children: /* @__PURE__ */ jsx("div", {
          className: "p-1",
          children: /* @__PURE__ */ jsxs(Grid$1, {
            container: true,
            spacing: 2,
            children: [/* @__PURE__ */ jsx(Grid$1, {
              xs: 6,
              children: "Parameter"
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: "Limit"
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: /* @__PURE__ */ jsx("b", {
                children: "Value"
              })
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: "Unit"
            })]
          })
        })
      })
    }), rows.map((x) => {
      const fuelType = getKeyValue(type)(x);
      if (typeof fuelType === "string" && fuelType != "-") {
        return /* @__PURE__ */ jsx(SpecRow, {
          parameter: x.Parameter,
          limit: x.Limit,
          value: fuelType,
          unit: x.Unit
        }, x.Parameter + x.Limit);
      }
    })]
  });
}
function DistTable2017({
  rows,
  type
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto",
    style: {
      maxWidth: 800,
      padding: "50px 10px",
      fontSize: 13
    },
    children: [/* @__PURE__ */ jsx("b", {
      children: /* @__PURE__ */ jsx(Box$1, {
        sx: {
          borderBottom: 1,
          borderColor: "contrast"
        },
        children: /* @__PURE__ */ jsx("div", {
          className: "p-1",
          children: /* @__PURE__ */ jsxs(Grid$1, {
            container: true,
            spacing: 2,
            children: [/* @__PURE__ */ jsx(Grid$1, {
              xs: 6,
              children: "Parameter"
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: "Limit"
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: /* @__PURE__ */ jsx("b", {
                children: "Value"
              })
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: "Unit"
            })]
          })
        })
      })
    }), rows.map((x) => {
      const fuelType = getKeyValue(type)(x);
      if (typeof fuelType === "string" && fuelType != "-") {
        return /* @__PURE__ */ jsx(SpecRow, {
          parameter: x.Parameter,
          limit: x.Limit,
          value: fuelType,
          unit: x.Unit
        }, x.Parameter + x.Limit);
      }
    })]
  });
}
function ResTable201720122010({
  rows,
  type
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto",
    style: {
      maxWidth: 800,
      padding: "50px 10px",
      fontSize: 13
    },
    children: [/* @__PURE__ */ jsx("b", {
      children: /* @__PURE__ */ jsx(Box$1, {
        sx: {
          borderBottom: 1,
          borderColor: "contrast"
        },
        children: /* @__PURE__ */ jsx("div", {
          className: "p-1",
          children: /* @__PURE__ */ jsxs(Grid$1, {
            container: true,
            spacing: 2,
            children: [/* @__PURE__ */ jsx(Grid$1, {
              xs: 6,
              children: "Parameter"
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: "Limit"
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: /* @__PURE__ */ jsx("b", {
                children: "Value"
              })
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: "Unit"
            })]
          })
        })
      })
    }), rows.map((x) => {
      const fuelType = getKeyValue(type)(x);
      if (typeof fuelType === "string" && fuelType != "-") {
        return /* @__PURE__ */ jsx(SpecRow, {
          parameter: x.Parameter,
          limit: x.Limit,
          value: fuelType,
          unit: x.Unit
        }, x.Parameter + x.Limit);
      }
    })]
  });
}
function ResTable2005({
  rows,
  type
}) {
  return /* @__PURE__ */ jsxs("div", {
    className: "mx-auto",
    style: {
      maxWidth: 800,
      padding: "50px 10px",
      fontSize: 13
    },
    children: [/* @__PURE__ */ jsx("b", {
      children: /* @__PURE__ */ jsx(Box$1, {
        sx: {
          borderBottom: 1,
          borderColor: "contrast"
        },
        children: /* @__PURE__ */ jsx("div", {
          className: "p-1",
          children: /* @__PURE__ */ jsxs(Grid$1, {
            container: true,
            spacing: 2,
            children: [/* @__PURE__ */ jsx(Grid$1, {
              xs: 6,
              children: "Parameter"
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: "Limit"
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: /* @__PURE__ */ jsx("b", {
                children: "Value"
              })
            }), /* @__PURE__ */ jsx(Grid$1, {
              xs: 2,
              children: "Unit"
            })]
          })
        })
      })
    }), rows.map((x) => {
      const fuelType = getKeyValue(type)(x);
      if (typeof fuelType === "string" && fuelType != "-") {
        return /* @__PURE__ */ jsx(SpecRow, {
          parameter: x.Parameter,
          limit: x.Limit,
          value: fuelType,
          unit: x.Unit
        }, x.Parameter + x.Limit);
      }
    })]
  });
}
function SpecRow(row) {
  return /* @__PURE__ */ jsx(Box$1, {
    sx: {
      borderBottom: 1,
      borderColor: "divider"
    },
    children: /* @__PURE__ */ jsxs("div", {
      className: "p-1",
      children: [/* @__PURE__ */ jsxs(Grid$1, {
        container: true,
        spacing: 2,
        children: [/* @__PURE__ */ jsx(Grid$1, {
          xs: 6,
          children: row.parameter
        }), /* @__PURE__ */ jsx(Grid$1, {
          xs: 2,
          children: row.limit
        }), /* @__PURE__ */ jsx(Grid$1, {
          xs: 2,
          children: /* @__PURE__ */ jsx("b", {
            children: row.value
          })
        }), /* @__PURE__ */ jsx(Grid$1, {
          xs: 2,
          children: row.unit
        })]
      }), " "]
    })
  });
}
__astro_tag_component__(DistTable201220102005, "@astrojs/react");
__astro_tag_component__(DistTable2017, "@astrojs/react");
__astro_tag_component__(ResTable201720122010, "@astrojs/react");
__astro_tag_component__(ResTable2005, "@astrojs/react");

function TabPanel(props) {
  const {
    children,
    value,
    index,
    ...other
  } = props;
  return /* @__PURE__ */ jsx("div", {
    role: "tabpanel",
    hidden: value !== index,
    id: `full-width-tabpanel-${index}`,
    "aria-labelledby": `full-width-tab-${index}`,
    ...other,
    children: value === index && /* @__PURE__ */ jsx(Box$1, {
      sx: {
        p: 0
      },
      children: /* @__PURE__ */ jsx(Typography$1, {
        component: "span",
        children
      })
    })
  });
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}
__astro_tag_component__(TabPanel, "@astrojs/react");
__astro_tag_component__(a11yProps, "@astrojs/react");

function SpecTable() {
  const theme = useTheme();
  const [ISOTab, setISOTab] = React.useState(0);
  const [DistResTab, setDistResTab] = React.useState(0);
  const handleChangeISO = (event, newValue) => {
    setISOTab(newValue);
  };
  const handleChangeDistRes = (event, newValue) => {
    setDistResTab(newValue);
  };
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx(Box$1, {
      sx: {
        borderBottom: 1,
        borderColor: "divider"
      },
      children: /* @__PURE__ */ jsxs(Tabs$1, {
        value: DistResTab,
        onChange: handleChangeDistRes,
        "aria-label": "Distillate and Residuals Tabs",
        variant: "scrollable",
        children: [/* @__PURE__ */ jsx(Tab$1, {
          label: "RESIDUAL FUELS",
          ...a11yProps(0)
        }), /* @__PURE__ */ jsx(Tab$1, {
          label: "DISTILLATE FUELS",
          ...a11yProps(1)
        })]
      })
    }), /* @__PURE__ */ jsxs(TabPanel, {
      value: DistResTab,
      index: 0,
      children: [/* @__PURE__ */ jsx(Box$1, {
        sx: {
          borderBottom: 1,
          borderColor: "divider"
        },
        children: /* @__PURE__ */ jsxs(Tabs$1, {
          value: ISOTab,
          onChange: handleChangeISO,
          "aria-label": "ISO spec tabs",
          variant: "scrollable",
          children: [/* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2017",
            ...a11yProps(0)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2012",
            ...a11yProps(1)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2010",
            ...a11yProps(2)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2005",
            ...a11yProps(3)
          })]
        })
      }), /* @__PURE__ */ jsx(TabPanel, {
        value: ISOTab,
        index: 0,
        children: /* @__PURE__ */ jsx("div", {
          className: "mx-auto",
          style: {
            maxWidth: 1300,
            height: 950,
            paddingTop: 40,
            paddingBottom: 40
          },
          children: /* @__PURE__ */ jsx(DataGrid, {
            sx: {
              background: theme.palette.background.paper
            },
            density: "compact",
            hideFooter: true,
            rows: ResData201720122010,
            columns: columnDefsRes201720122010
          })
        })
      }), /* @__PURE__ */ jsx(TabPanel, {
        value: ISOTab,
        index: 1,
        children: /* @__PURE__ */ jsx("div", {
          className: "mx-auto",
          style: {
            maxWidth: 1200,
            height: 805,
            paddingTop: 40,
            paddingBottom: 40
          },
          children: /* @__PURE__ */ jsx(DataGrid, {
            sx: {
              background: theme.palette.background.paper
            },
            density: "compact",
            hideFooter: true,
            rows: ResData201720122010,
            columns: columnDefsRes201720122010
          })
        })
      }), /* @__PURE__ */ jsx(TabPanel, {
        value: ISOTab,
        index: 2,
        children: /* @__PURE__ */ jsx("div", {
          className: "mx-auto",
          style: {
            maxWidth: 1200,
            height: 805,
            paddingTop: 40,
            paddingBottom: 40
          },
          children: /* @__PURE__ */ jsx(DataGrid, {
            sx: {
              background: theme.palette.background.paper
            },
            density: "compact",
            hideFooter: true,
            rows: ResData201720122010,
            columns: columnDefsRes201720122010
          })
        })
      }), /* @__PURE__ */ jsx(TabPanel, {
        value: ISOTab,
        index: 3,
        children: /* @__PURE__ */ jsx("div", {
          className: "mx-auto",
          style: {
            maxWidth: 1200,
            height: 842,
            paddingTop: 40,
            paddingBottom: 40
          },
          children: /* @__PURE__ */ jsx(DataGrid, {
            sx: {
              background: theme.palette.background.paper
            },
            density: "compact",
            hideFooter: true,
            rows: ResData2005,
            columns: columnDefsRes2005
          })
        })
      })]
    }), /* @__PURE__ */ jsxs(TabPanel, {
      value: DistResTab,
      index: 1,
      children: [/* @__PURE__ */ jsx(Box$1, {
        sx: {
          borderBottom: 1,
          borderColor: "divider"
        },
        children: /* @__PURE__ */ jsxs(Tabs$1, {
          value: ISOTab,
          onChange: handleChangeISO,
          "aria-label": "ISO spec tabs",
          variant: "scrollable",
          children: [/* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2017",
            ...a11yProps(0)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2012",
            ...a11yProps(1)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2010",
            ...a11yProps(2)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2005",
            ...a11yProps(3)
          })]
        })
      }), /* @__PURE__ */ jsx(TabPanel, {
        value: ISOTab,
        index: 0,
        children: /* @__PURE__ */ jsx("div", {
          className: "mx-auto",
          style: {
            maxWidth: 1010,
            height: 950,
            paddingTop: 40,
            paddingBottom: 40
          },
          children: /* @__PURE__ */ jsx(DataGrid, {
            sx: {
              background: theme.palette.background.paper
            },
            density: "compact",
            hideFooter: true,
            rows: DistData2017,
            columns: columnDefs2017
          })
        })
      }), /* @__PURE__ */ jsx(TabPanel, {
        value: ISOTab,
        index: 1,
        children: /* @__PURE__ */ jsx("div", {
          className: "mx-auto",
          style: {
            maxWidth: 800,
            height: 805,
            paddingTop: 40,
            paddingBottom: 40
          },
          children: /* @__PURE__ */ jsx(DataGrid, {
            sx: {
              background: theme.palette.background.paper
            },
            density: "compact",
            hideFooter: true,
            rows: DistData20122010,
            columns: columnDefs201220102005
          })
        })
      }), /* @__PURE__ */ jsx(TabPanel, {
        value: ISOTab,
        index: 2,
        children: /* @__PURE__ */ jsx("div", {
          className: "mx-auto",
          style: {
            maxWidth: 800,
            height: 805,
            paddingTop: 40,
            paddingBottom: 40
          },
          children: /* @__PURE__ */ jsx(DataGrid, {
            sx: {
              background: theme.palette.background.paper
            },
            density: "compact",
            hideFooter: true,
            rows: DistData20122010,
            columns: columnDefs201220102005
          })
        })
      }), /* @__PURE__ */ jsx(TabPanel, {
        value: ISOTab,
        index: 3,
        children: /* @__PURE__ */ jsx("div", {
          className: "mx-auto",
          style: {
            maxWidth: 800,
            height: 842,
            paddingTop: 40,
            paddingBottom: 40
          },
          children: /* @__PURE__ */ jsx(DataGrid, {
            sx: {
              background: theme.palette.background.paper
            },
            density: "compact",
            hideFooter: true,
            rows: DistData2005,
            columns: columnDefs201220102005
          })
        })
      })]
    })]
  });
}
__astro_tag_component__(SpecTable, "@astrojs/react");

function SpecSimplified() {
  const [ISOTab, setISOTab] = React.useState(0);
  const [TypeTab, setTypeTab] = React.useState(0);
  const [DistResTab, setDistResTab] = React.useState(0);
  const handleChangeISO = (event, newValue) => {
    setISOTab(newValue);
  };
  const handleChangeType = (event, newValue) => {
    setTypeTab(newValue);
  };
  const handleChangeDistRes = (event, newValue) => {
    setDistResTab(newValue);
  };
  return /* @__PURE__ */ jsxs("div", {
    children: [/* @__PURE__ */ jsx(Box$1, {
      sx: {
        borderBottom: 1,
        borderColor: "divider"
      },
      children: /* @__PURE__ */ jsxs(Tabs$1, {
        value: DistResTab,
        onChange: handleChangeDistRes,
        "aria-label": "Distillate and Residuals Tabs",
        variant: "scrollable",
        children: [/* @__PURE__ */ jsx(Tab$1, {
          label: "RESIDUAL FUELS",
          ...a11yProps(0)
        }), /* @__PURE__ */ jsx(Tab$1, {
          label: "DISTILLATE FUELS",
          ...a11yProps(1)
        })]
      })
    }), /* @__PURE__ */ jsxs(TabPanel, {
      value: DistResTab,
      index: 0,
      children: [/* @__PURE__ */ jsx(Box$1, {
        sx: {
          borderBottom: 1,
          borderColor: "divider"
        },
        children: /* @__PURE__ */ jsxs(Tabs$1, {
          value: ISOTab,
          onChange: handleChangeISO,
          "aria-label": "ISO spec tabs",
          variant: "scrollable",
          children: [/* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2017",
            ...a11yProps(0)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2012",
            ...a11yProps(1)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2010",
            ...a11yProps(2)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2005",
            ...a11yProps(3)
          })]
        })
      }), /* @__PURE__ */ jsxs(TabPanel, {
        value: ISOTab,
        index: 0,
        children: [/* @__PURE__ */ jsx(Box$1, {
          sx: {
            borderBottom: 1,
            borderColor: "divider"
          },
          children: /* @__PURE__ */ jsxs(Tabs$1, {
            value: TypeTab,
            onChange: handleChangeType,
            "aria-label": "Fuel Type tabs",
            variant: "scrollable",
            children: [/* @__PURE__ */ jsx(Tab$1, {
              label: "RMG380 (MGO)",
              ...a11yProps(0)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMG180",
              ...a11yProps(1)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMG500",
              ...a11yProps(2)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMG700",
              ...a11yProps(3)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK380",
              ...a11yProps(4)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK500",
              ...a11yProps(5)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK700",
              ...a11yProps(6)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMA10",
              ...a11yProps(7)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMB30",
              ...a11yProps(8)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMD80",
              ...a11yProps(9)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RME180",
              ...a11yProps(10)
            })]
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 0,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG380"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 1,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG180"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 2,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG500"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 3,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG700"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 4,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMK380"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 5,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMK500"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 6,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMK700"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 7,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMA10"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 8,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMB30"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 9,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMD80"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 10,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RME180"
          })
        })]
      }), /* @__PURE__ */ jsxs(TabPanel, {
        value: ISOTab,
        index: 1,
        children: [/* @__PURE__ */ jsx(Box$1, {
          sx: {
            borderBottom: 1,
            borderColor: "divider"
          },
          children: /* @__PURE__ */ jsxs(Tabs$1, {
            value: TypeTab,
            onChange: handleChangeType,
            "aria-label": "lab API tabs example",
            variant: "scrollable",
            children: [/* @__PURE__ */ jsx(Tab$1, {
              label: "RMG380 (MGO)",
              ...a11yProps(0)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMG180",
              ...a11yProps(1)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMG500",
              ...a11yProps(2)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMG700",
              ...a11yProps(3)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK380",
              ...a11yProps(4)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK500",
              ...a11yProps(5)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK700",
              ...a11yProps(6)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMA10",
              ...a11yProps(7)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMB30",
              ...a11yProps(8)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMD80",
              ...a11yProps(9)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RME180",
              ...a11yProps(10)
            })]
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 0,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG380"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 1,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG180"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 2,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG500"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 3,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG700"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 4,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMK380"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 5,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMK500"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 6,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMK700"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 7,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMA10"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 8,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMB30"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 9,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMD80"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 10,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RME180"
          })
        })]
      }), /* @__PURE__ */ jsxs(TabPanel, {
        value: ISOTab,
        index: 2,
        children: [/* @__PURE__ */ jsx(Box$1, {
          sx: {
            borderBottom: 1,
            borderColor: "divider"
          },
          children: /* @__PURE__ */ jsxs(Tabs$1, {
            value: TypeTab,
            onChange: handleChangeType,
            "aria-label": "Fuel Type tabs",
            variant: "scrollable",
            children: [/* @__PURE__ */ jsx(Tab$1, {
              label: "RMG380 (MGO)",
              ...a11yProps(0)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMG180",
              ...a11yProps(1)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMG500",
              ...a11yProps(2)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMG700",
              ...a11yProps(3)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK380",
              ...a11yProps(4)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK500",
              ...a11yProps(5)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK700",
              ...a11yProps(6)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMA10",
              ...a11yProps(7)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMB30",
              ...a11yProps(8)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMD80",
              ...a11yProps(9)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RME180",
              ...a11yProps(10)
            })]
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 0,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG380"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 1,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG180"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 2,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG500"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 3,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMG700"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 4,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMK380"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 5,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMK500"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 6,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMK700"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 7,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMA10"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 8,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMB30"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 9,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RMD80"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 10,
          children: /* @__PURE__ */ jsx(ResTable201720122010, {
            rows: ResData201720122010,
            type: "RME180"
          })
        })]
      }), /* @__PURE__ */ jsxs(TabPanel, {
        value: ISOTab,
        index: 3,
        children: [/* @__PURE__ */ jsx(Box$1, {
          sx: {
            borderBottom: 1,
            borderColor: "divider"
          },
          children: /* @__PURE__ */ jsxs(Tabs$1, {
            value: TypeTab,
            onChange: handleChangeType,
            "aria-label": "Fuel type tabs",
            variant: "scrollable",
            children: [/* @__PURE__ */ jsx(Tab$1, {
              label: "RMG380 (MGO)",
              ...a11yProps(0)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMH380",
              ...a11yProps(1)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK380",
              ...a11yProps(2)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMH700",
              ...a11yProps(3)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMK700",
              ...a11yProps(4)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RME180",
              ...a11yProps(5)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMF180",
              ...a11yProps(6)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMA30",
              ...a11yProps(7)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMB30",
              ...a11yProps(8)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "RMD80",
              ...a11yProps(9)
            })]
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 0,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RMG380"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 1,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RMH380"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 2,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RMK380"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 3,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RMH700"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 4,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RMK700"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 5,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RME180"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 6,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RMF180"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 7,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RMA30"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 8,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RMB30"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 9,
          children: /* @__PURE__ */ jsx(ResTable2005, {
            rows: ResData2005,
            type: "RMD80"
          })
        })]
      })]
    }), /* @__PURE__ */ jsxs(TabPanel, {
      value: DistResTab,
      index: 1,
      children: [/* @__PURE__ */ jsx(Box$1, {
        sx: {
          borderBottom: 1,
          borderColor: "divider"
        },
        children: /* @__PURE__ */ jsxs(Tabs$1, {
          value: ISOTab,
          onChange: handleChangeISO,
          "aria-label": "ISO tabs",
          variant: "scrollable",
          children: [/* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2017",
            ...a11yProps(0)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2012",
            ...a11yProps(1)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2010",
            ...a11yProps(2)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "ISO 8217:2005",
            ...a11yProps(3)
          })]
        })
      }), /* @__PURE__ */ jsxs(TabPanel, {
        value: ISOTab,
        index: 0,
        children: [/* @__PURE__ */ jsx(Box$1, {
          sx: {
            borderBottom: 1,
            borderColor: "divider"
          },
          children: /* @__PURE__ */ jsxs(Tabs$1, {
            value: TypeTab,
            onChange: handleChangeType,
            "aria-label": "Fuel Type tabs",
            variant: "scrollable",
            children: [/* @__PURE__ */ jsx(Tab$1, {
              label: "DMA (LSFO)",
              ...a11yProps(0)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMX",
              ...a11yProps(1)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DFA",
              ...a11yProps(2)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMZ",
              ...a11yProps(3)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DFZ",
              ...a11yProps(4)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMB",
              ...a11yProps(5)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DFB",
              ...a11yProps(6)
            })]
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 0,
          children: /* @__PURE__ */ jsx(DistTable2017, {
            rows: DistData2017,
            type: "DMA"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 1,
          children: /* @__PURE__ */ jsx(DistTable2017, {
            rows: DistData2017,
            type: "DMX"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 2,
          children: /* @__PURE__ */ jsx(DistTable2017, {
            rows: DistData2017,
            type: "DFA"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 3,
          children: /* @__PURE__ */ jsx(DistTable2017, {
            rows: DistData2017,
            type: "DMZ"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 4,
          children: /* @__PURE__ */ jsx(DistTable2017, {
            rows: DistData2017,
            type: "DFZ"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 5,
          children: /* @__PURE__ */ jsx(DistTable2017, {
            rows: DistData2017,
            type: "DMB"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 6,
          children: /* @__PURE__ */ jsx(DistTable2017, {
            rows: DistData2017,
            type: "DFB"
          })
        })]
      }), /* @__PURE__ */ jsxs(TabPanel, {
        value: ISOTab,
        index: 1,
        children: [/* @__PURE__ */ jsx(Box$1, {
          sx: {
            borderBottom: 1,
            borderColor: "divider"
          },
          children: /* @__PURE__ */ jsxs(Tabs$1, {
            value: TypeTab,
            onChange: handleChangeType,
            "aria-label": "Fuel Type tabs",
            variant: "scrollable",
            children: [/* @__PURE__ */ jsx(Tab$1, {
              label: "DMA (LSFO)",
              ...a11yProps(0)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMX",
              ...a11yProps(1)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMZ",
              ...a11yProps(2)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMB",
              ...a11yProps(3)
            })]
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 0,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData20122010,
            type: "DMA"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 1,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData20122010,
            type: "DMX"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 2,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData20122010,
            type: "DMZ"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 3,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData20122010,
            type: "DMB"
          })
        })]
      }), /* @__PURE__ */ jsxs(TabPanel, {
        value: ISOTab,
        index: 2,
        children: [/* @__PURE__ */ jsx(Box$1, {
          sx: {
            borderBottom: 1,
            borderColor: "divider"
          },
          children: /* @__PURE__ */ jsxs(Tabs$1, {
            value: TypeTab,
            onChange: handleChangeType,
            "aria-label": "Fuel Type tabs",
            variant: "scrollable",
            children: [/* @__PURE__ */ jsx(Tab$1, {
              label: "DMA (LSFO)",
              ...a11yProps(0)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMX",
              ...a11yProps(1)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMZ",
              ...a11yProps(2)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMB",
              ...a11yProps(3)
            })]
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 0,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData20122010,
            type: "DMA"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 1,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData20122010,
            type: "DMX"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 2,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData20122010,
            type: "DMZ"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 3,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData20122010,
            type: "DMB"
          })
        })]
      }), /* @__PURE__ */ jsxs(TabPanel, {
        value: ISOTab,
        index: 3,
        children: [/* @__PURE__ */ jsx(Box$1, {
          sx: {
            borderBottom: 1,
            borderColor: "divider"
          },
          children: /* @__PURE__ */ jsxs(Tabs$1, {
            value: TypeTab,
            onChange: handleChangeType,
            "aria-label": "Fuel Type tabs",
            variant: "scrollable",
            children: [/* @__PURE__ */ jsx(Tab$1, {
              label: "DMA (LSFO)",
              ...a11yProps(0)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMX",
              ...a11yProps(1)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMZ",
              ...a11yProps(2)
            }), /* @__PURE__ */ jsx(Tab$1, {
              label: "DMB",
              ...a11yProps(3)
            })]
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 0,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData2005,
            type: "DMA"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 1,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData2005,
            type: "DMX"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 2,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData2005,
            type: "DMZ"
          })
        }), /* @__PURE__ */ jsx(TabPanel, {
          value: TypeTab,
          index: 3,
          children: /* @__PURE__ */ jsx(DistTable201220102005, {
            rows: DistData2005,
            type: "DMB"
          })
        })]
      })]
    })]
  });
}
__astro_tag_component__(SpecSimplified, "@astrojs/react");

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...mode === "light" ? {
      primary: {
        light: "#000",
        main: "#000",
        dark: "#000",
        contrastText: "#fff"
      },
      secondary: {
        light: "#424242",
        main: "#424242",
        dark: "#424242",
        contrastText: "#fff"
      },
      background: {
        default: "#fff",
        paper: "#f5f7f9"
      }
    } : {
      primary: {
        light: "#fff",
        main: "#fff",
        dark: "#fff",
        contrastText: "#000"
      },
      secondary: {
        light: "#ededed",
        main: "#ededed",
        dark: "#ededed",
        contrastText: "#000"
      },
      background: {
        default: "#141414",
        paper: "#212121"
      }
    }
  }
});
function SpecChecker() {
  const [mode, setMode] = React.useState("light");
  const colorMode = React.useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => prevMode === "light" ? "dark" : "light");
    }
  }), []);
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return /* @__PURE__ */ jsxs(ThemeProvider, {
    theme,
    children: [/* @__PURE__ */ jsx(CssBaseline, {}), /* @__PURE__ */ jsx("div", {
      className: "mx-auto font-extrabold text-3xl md:text-5xl pt-5",
      children: /* @__PURE__ */ jsx("center", {
        children: "ISO Bunker Fuel Specification Checker"
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "mx-auto",
      style: {
        maxWidth: 1120,
        paddingTop: 30
      },
      children: [/* @__PURE__ */ jsx(Box$1, {
        sx: {
          borderBottom: 1,
          borderColor: "divider"
        },
        children: /* @__PURE__ */ jsxs(Tabs$1, {
          value,
          onChange: handleChange,
          "aria-label": "lab API tabs example",
          children: [/* @__PURE__ */ jsx(Tab$1, {
            label: "Simplified",
            ...a11yProps(0)
          }), /* @__PURE__ */ jsx(Tab$1, {
            label: "Full Table",
            ...a11yProps(1)
          })]
        })
      }), /* @__PURE__ */ jsx(TabPanel, {
        value,
        index: 0,
        children: /* @__PURE__ */ jsx(SpecSimplified, {})
      }), /* @__PURE__ */ jsx(TabPanel, {
        value,
        index: 1,
        children: /* @__PURE__ */ jsx(SpecTable, {})
      }), /* @__PURE__ */ jsx(Fab$1, {
        color: "primary",
        size: "small",
        "aria-label": "add",
        sx: {
          position: "absolute",
          right: "2%",
          top: "2%"
        },
        onClick: colorMode.toggleColorMode,
        children: theme.palette.mode === "dark" ? /* @__PURE__ */ jsx(Brightness7Icon, {}) : /* @__PURE__ */ jsx(Brightness4Icon, {})
      })]
    })]
  });
}
__astro_tag_component__(SpecChecker, "@astrojs/react");

const $$Astro$e = createAstro("D:/flutter_projects/astro_landing/src/pages/spec-checker.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$SpecChecker = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$SpecChecker;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Spec Checker" }, { "default": () => renderTemplate`${renderComponent($$result, "SpecChecker", SpecChecker, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@components/spec-checker/SpecChecker", "client:component-export": "default" })}` })}`;
});

const $$file$4 = "D:/flutter_projects/astro_landing/src/pages/spec-checker.astro";
const $$url$4 = "/spec-checker";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$SpecChecker,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const SPRITESHEET_NAMESPACE = `astroicon`;

const baseURL = "https://api.astroicon.dev/v1/";
const requests = /* @__PURE__ */ new Map();
const fetchCache = /* @__PURE__ */ new Map();
async function get(pack, name) {
  const url = new URL(`./${pack}/${name}`, baseURL).toString();
  if (requests.has(url)) {
    return await requests.get(url);
  }
  if (fetchCache.has(url)) {
    return fetchCache.get(url);
  }
  let request = async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("svg")) {
      throw new Error(`[astro-icon] Unable to load "${name}" because it did not resolve to an SVG!

Recieved the following "Content-Type":
${contentType}`);
    }
    const svg = await res.text();
    fetchCache.set(url, svg);
    requests.delete(url);
    return svg;
  };
  let promise = request();
  requests.set(url, promise);
  return await promise;
}

const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
const domParserTokenizer = /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:]*)(?:\s([^>]*?))?((?:\s*\/)?)>|(<\!\-\-)([\s\S]*?)(\-\->)|(<\!\[CDATA\[)([\s\S]*?)(\]\]>))/gm;
const splitAttrs = (str) => {
  let res = {};
  let token;
  if (str) {
    splitAttrsTokenizer.lastIndex = 0;
    str = " " + (str || "") + " ";
    while (token = splitAttrsTokenizer.exec(str)) {
      res[token[1]] = token[3];
    }
  }
  return res;
};
function optimizeSvg(contents, name, options) {
  return optimize(contents, {
    plugins: [
      "removeDoctype",
      "removeXMLProcInst",
      "removeComments",
      "removeMetadata",
      "removeXMLNS",
      "removeEditorsNSData",
      "cleanupAttrs",
      "minifyStyles",
      "convertStyleToAttrs",
      {
        name: "cleanupIDs",
        params: { prefix: `${SPRITESHEET_NAMESPACE}:${name}` }
      },
      "removeRasterImages",
      "removeUselessDefs",
      "cleanupNumericValues",
      "cleanupListOfValues",
      "convertColors",
      "removeUnknownsAndDefaults",
      "removeNonInheritableGroupAttrs",
      "removeUselessStrokeAndFill",
      "removeViewBox",
      "cleanupEnableBackground",
      "removeHiddenElems",
      "removeEmptyText",
      "convertShapeToPath",
      "moveElemsAttrsToGroup",
      "moveGroupAttrsToElems",
      "collapseGroups",
      "convertPathData",
      "convertTransform",
      "removeEmptyAttrs",
      "removeEmptyContainers",
      "mergePaths",
      "removeUnusedNS",
      "sortAttrs",
      "removeTitle",
      "removeDesc",
      "removeDimensions",
      "removeStyleElement",
      "removeScriptElement"
    ]
  }).data;
}
const preprocessCache = /* @__PURE__ */ new Map();
function preprocess(contents, name, { optimize }) {
  if (preprocessCache.has(contents)) {
    return preprocessCache.get(contents);
  }
  if (optimize) {
    contents = optimizeSvg(contents, name);
  }
  domParserTokenizer.lastIndex = 0;
  let result = contents;
  let token;
  if (contents) {
    while (token = domParserTokenizer.exec(contents)) {
      const tag = token[2];
      if (tag === "svg") {
        const attrs = splitAttrs(token[3]);
        result = contents.slice(domParserTokenizer.lastIndex).replace(/<\/svg>/gim, "").trim();
        const value = { innerHTML: result, defaultProps: attrs };
        preprocessCache.set(contents, value);
        return value;
      }
    }
  }
}
function normalizeProps(inputProps) {
  const size = inputProps.size;
  delete inputProps.size;
  const w = inputProps.width ?? size;
  const h = inputProps.height ?? size;
  const width = w ? toAttributeSize(w) : void 0;
  const height = h ? toAttributeSize(h) : void 0;
  return { ...inputProps, width, height };
}
const toAttributeSize = (size) => String(size).replace(/(?<=[0-9])x$/, "em");
async function load(name, inputProps, optimize) {
  const key = name;
  if (!name) {
    throw new Error("<Icon> requires a name!");
  }
  let svg = "";
  let filepath = "";
  if (name.includes(":")) {
    const [pack, ..._name] = name.split(":");
    name = _name.join(":");
    filepath = `/src/icons/${pack}`;
    let get$1;
    try {
      const files = /* #__PURE__ */ Object.assign({

});
      const keys = Object.fromEntries(
        Object.keys(files).map((key2) => [key2.replace(/\.[cm]?[jt]s$/, ""), key2])
      );
      if (!(filepath in keys)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const mod = files[keys[filepath]];
      if (typeof mod.default !== "function") {
        throw new Error(
          `[astro-icon] "${filepath}" did not export a default function!`
        );
      }
      get$1 = mod.default;
    } catch (e) {
    }
    if (typeof get$1 === "undefined") {
      get$1 = get.bind(null, pack);
    }
    const contents = await get$1(name, inputProps);
    if (!contents) {
      throw new Error(
        `<Icon pack="${pack}" name="${name}" /> did not return an icon!`
      );
    }
    if (!/<svg/gim.test(contents)) {
      throw new Error(
        `Unable to process "<Icon pack="${pack}" name="${name}" />" because an SVG string was not returned!

Recieved the following content:
${contents}`
      );
    }
    svg = contents;
  } else {
    filepath = `/src/icons/${name}.svg`;
    try {
      const files = /* #__PURE__ */ Object.assign({});
      if (!(filepath in files)) {
        throw new Error(`Could not find the file "${filepath}"`);
      }
      const contents = files[filepath];
      if (!/<svg/gim.test(contents)) {
        throw new Error(
          `Unable to process "${filepath}" because it is not an SVG!

Recieved the following content:
${contents}`
        );
      }
      svg = contents;
    } catch (e) {
      throw new Error(
        `[astro-icon] Unable to load "${filepath}". Does the file exist?`
      );
    }
  }
  const { innerHTML, defaultProps } = preprocess(svg, key, { optimize });
  if (!innerHTML.trim()) {
    throw new Error(`Unable to parse "${filepath}"!`);
  }
  return {
    innerHTML,
    props: { ...defaultProps, ...normalizeProps(inputProps) }
  };
}

const $$Astro$d = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-icon/lib/Icon.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Icon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Icon;
  let { name, pack, title, optimize = true, class: className, ...inputProps } = Astro2.props;
  let props = {};
  if (pack) {
    name = `${pack}:${name}`;
  }
  let innerHTML = "";
  try {
    const svg = await load(name, { ...inputProps, class: className }, optimize);
    innerHTML = svg.innerHTML;
    props = svg.props;
  } catch (e) {
    {
      throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
    }
  }
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(name, "astro-icon")}>${unescapeHTML((title ? `<title>${title}</title>` : "") + innerHTML)}</svg>`;
});

const sprites = /* @__PURE__ */ new WeakMap();
function trackSprite(request, name) {
  let currentSet = sprites.get(request);
  if (!currentSet) {
    currentSet = /* @__PURE__ */ new Set([name]);
  } else {
    currentSet.add(name);
  }
  sprites.set(request, currentSet);
}
const warned = /* @__PURE__ */ new Set();
async function getUsedSprites(request) {
  const currentSet = sprites.get(request);
  if (currentSet) {
    return Array.from(currentSet);
  }
  if (!warned.has(request)) {
    const { pathname } = new URL(request.url);
    console.log(`[astro-icon] No sprites found while rendering "${pathname}"`);
    warned.add(request);
  }
  return [];
}

const $$Astro$c = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-icon/lib/Spritesheet.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Spritesheet = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Spritesheet;
  const { optimize = true, style, ...props } = Astro2.props;
  const names = await getUsedSprites(Astro2.request);
  const icons = await Promise.all(names.map((name) => {
    return load(name, {}, optimize).then((res) => ({ ...res, name })).catch((e) => {
      {
        throw new Error(`[astro-icon] Unable to load icon "${name}"!
${e}`);
      }
    });
  }));
  return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(`position: absolute; width: 0; height: 0; overflow: hidden; ${style ?? ""}`.trim(), "style")}${spreadAttributes({ "aria-hidden": true, ...props })} astro-icon-spritesheet>
    ${icons.map((icon) => renderTemplate`<symbol${spreadAttributes(icon.props)}${addAttribute(`${SPRITESHEET_NAMESPACE}:${icon.name}`, "id")}>${unescapeHTML(icon.innerHTML)}</symbol>`)}
</svg>`;
});

const $$Astro$b = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-icon/lib/SpriteProvider.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$SpriteProvider = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$SpriteProvider;
  const content = await Astro2.slots.render("default");
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${unescapeHTML(content)}` })}
${renderComponent($$result, "Spritesheet", $$Spritesheet, {})}
`;
});

const $$Astro$a = createAstro("D:/flutter_projects/astro_landing/node_modules/astro-icon/lib/Sprite.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Sprite = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Sprite;
  let { name, pack, title, class: className, x, y, ...inputProps } = Astro2.props;
  const props = normalizeProps(inputProps);
  if (pack) {
    name = `${pack}:${name}`;
  }
  const href = `#${SPRITESHEET_NAMESPACE}:${name}`;
  trackSprite(Astro2.request, name);
  return renderTemplate`${maybeRenderHead($$result)}<svg${spreadAttributes(props)}${addAttribute(className, "class")}${addAttribute(name, "astro-icon")}>
    ${title ? renderTemplate`<title>${title}</title>` : ""}
    <use${spreadAttributes({ "xlink:href": href, width: props.width, height: props.height, x, y })}></use>
</svg>`;
});

Object.assign($$Sprite, { Provider: $$SpriteProvider });

const $$Astro$9 = createAstro("D:/flutter_projects/astro_landing/src/components/sectionhead.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Sectionhead = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Sectionhead;
  const { align = "center" } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["mt-16", align === "center" && "text-center"], "class:list")}>
  <h1 class="text-4xl lg:text-5xl font-bold lg:tracking-tight">
    ${renderSlot($$result, $$slots["title"], renderTemplate`Title`)}
  </h1>
  <p class="text-lg mt-4 text-slate-600">
    ${renderSlot($$result, $$slots["desc"], renderTemplate`Some description goes here`)}
  </p>
</div>`;
});

const $$Astro$8 = createAstro("D:/flutter_projects/astro_landing/src/components/ui/button.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Button = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Button;
  const {
    size = "md",
    style = "primary",
    block,
    class: className,
    ...rest
  } = Astro2.props;
  const sizes = {
    md: "px-5 py-2.5",
    lg: "px-6 py-3"
  };
  const styles = {
    outline: "border-2 border-black hover:bg-black text-black hover:text-white",
    primary: "bg-black text-white hover:bg-slate-900  border-2 border-transparent"
  };
  return renderTemplate`${maybeRenderHead($$result)}<button${spreadAttributes(rest)}${addAttribute([
    "rounded text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200",
    block && "w-full",
    sizes[size],
    styles[style],
    className
  ], "class:list")}>${renderSlot($$result, $$slots["default"])}
</button>`;
});

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$7 = createAstro("D:/flutter_projects/astro_landing/src/components/contactform.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Contactform = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Contactform;
  return renderTemplate(_a || (_a = __template(["<!-- To make this contact form work, create your free access key from https://web3forms.com/\n     Then you will get all form submissions in your email inbox. -->", '<form action="https://api.web3forms.com/submit" method="POST" id="form" class="needs-validation astro-N67Q347T" novalidate>\n  <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" class="astro-N67Q347T">\n  <!-- Create your free access key from https://web3forms.com/ -->\n  <input type="checkbox" class="hidden astro-N67Q347T" style="display:none" name="botcheck">\n  <div class="mb-5 astro-N67Q347T">\n    <input type="text" placeholder="Full Name" required class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100 astro-N67Q347T" name="name">\n    <div class="empty-feedback invalid-feedback text-red-400 text-sm mt-1 astro-N67Q347T">\n      Please provide your full name.\n    </div>\n  </div>\n  <div class="mb-5 astro-N67Q347T">\n    <label for="email_address" class="sr-only astro-N67Q347T">Email Address</label><input id="email_address" type="email" placeholder="Email Address" name="email" required class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100 astro-N67Q347T">\n    <div class="empty-feedback text-red-400 text-sm mt-1 astro-N67Q347T">\n      Please provide your email address.\n    </div>\n    <div class="invalid-feedback text-red-400 text-sm mt-1 astro-N67Q347T">\n      Please provide a valid email address.\n    </div>\n  </div>\n  <div class="mb-3 astro-N67Q347T">\n    <textarea name="message" required placeholder="Your Message" class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none h-36 focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100 astro-N67Q347T"></textarea>\n    <div class="empty-feedback invalid-feedback text-red-400 text-sm mt-1 astro-N67Q347T">\n      Please enter your message.\n    </div>\n  </div>\n  ', '\n  <div id="result" class="mt-3 text-center astro-N67Q347T"></div>\n</form>\n\n\n\n<script>\n  const form = document.getElementById("form");\n  const result = document.getElementById("result");\n\n  form.addEventListener("submit", function (e) {\n    e.preventDefault();\n    form.classList.add("was-validated");\n    if (!form.checkValidity()) {\n      form.querySelectorAll(":invalid")[0].focus();\n      return;\n    }\n    const formData = new FormData(form);\n    const object = Object.fromEntries(formData);\n    const json = JSON.stringify(object);\n\n    result.innerHTML = "Sending...";\n\n    fetch("https://api.web3forms.com/submit", {\n      method: "POST",\n      headers: {\n        "Content-Type": "application/json",\n        Accept: "application/json",\n      },\n      body: json,\n    })\n      .then(async (response) => {\n        let json = await response.json();\n        if (response.status == 200) {\n          result.classList.add("text-green-500");\n          result.innerHTML = json.message;\n        } else {\n          console.log(response);\n          result.classList.add("text-red-500");\n          result.innerHTML = json.message;\n        }\n      })\n      .catch((error) => {\n        console.log(error);\n        result.innerHTML = "Something went wrong!";\n      })\n      .then(function () {\n        form.reset();\n        form.classList.remove("was-validated");\n        setTimeout(() => {\n          result.style.display = "none";\n        }, 5000);\n      });\n  });\n<\/script>'])), maybeRenderHead($$result), renderComponent($$result, "Button", $$Button, { "type": "submit", "size": "lg", "block": true, "class": "astro-N67Q347T" }, { "default": () => renderTemplate`Send Message` }));
});

const $$Astro$6 = createAstro("D:/flutter_projects/astro_landing/src/pages/contact.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Contact = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Contact;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Contact" }, { "default": () => renderTemplate`${renderComponent($$result, "Container", $$Container, {}, { "default": () => renderTemplate`${renderComponent($$result, "Sectionhead", $$Sectionhead, {}, { "desc": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "desc" }, { "default": () => renderTemplate`We are a here to help.` })}`, "title": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "title" }, { "default": () => renderTemplate`Contact` })}` })}${maybeRenderHead($$result)}<div class="grid md:grid-cols-2 gap-10 mx-auto max-w-4xl mt-16">
      <div>
        <h2 class="font-medium text-2xl text-gray-800">Contact Astroship</h2>
        <p class="text-lg leading-relaxed text-slate-500 mt-3">
          Have something to say? We are here to help. Fill up the form or send
          email or call phone.
        </p>
        <div class="mt-5">
          <div class="flex items-center mt-2 space-x-2 text-gray-600">
            ${renderComponent($$result, "Icon", $$Icon, { "class": "text-gray-400 w-4 h-4", "name": "uil:map-marker" })}
            <span>1734 Sanfransico, CA 93063</span>
          </div><div class="flex items-center mt-2 space-x-2 text-gray-600">
            ${renderComponent($$result, "Icon", $$Icon, { "class": "text-gray-400 w-4 h-4", "name": "uil:envelope" })}<a href="mailto:hello@astroshipstarter.com">hello@astroshipstarter.com</a>
          </div><div class="flex items-center mt-2 space-x-2 text-gray-600">
            ${renderComponent($$result, "Icon", $$Icon, { "class": "text-gray-400 w-4 h-4", "name": "uil:phone" })}<a href="tel:+1 (987) 4587 899">+1 (987) 4587 899</a>
          </div>
        </div>
      </div>
      <div>
        ${renderComponent($$result, "Contactform", $$Contactform, {})}
      </div>
    </div>` })}` })}`;
});

const $$file$3 = "D:/flutter_projects/astro_landing/src/pages/contact.astro";
const $$url$3 = "/contact";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Contact,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$5 = createAstro("D:/flutter_projects/astro_landing/src/components/ui/icons/tick.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Tick = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Tick;
  const { class: className } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<svg${addAttribute(className, "class")} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity=".16"></circle><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 12a8.25 8.25 0 0 1 11.916-7.393.75.75 0 1 0 .668-1.343A9.713 9.713 0 0 0 12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75c0-.366-.02-.727-.06-1.082a.75.75 0 1 0-1.49.164A8.25 8.25 0 1 1 3.75 12Zm17.78-6.47a.75.75 0 0 0-1.06-1.06L12 12.94l-2.47-2.47a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l9-9Z" fill="currentColor"></path>
</svg>`;
});

const $$Astro$4 = createAstro("D:/flutter_projects/astro_landing/src/components/ui/link.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Link = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Link;
  const {
    href,
    block,
    size = "lg",
    style = "primary",
    class: className,
    ...rest
  } = Astro2.props;
  const sizes = {
    lg: "px-5 py-2.5",
    md: "px-4 py-2"
  };
  const styles = {
    outline: "bg-white border-2 border-black hover:bg-gray-100 text-black ",
    primary: "bg-black text-white hover:bg-gray-800  border-2 border-transparent",
    inverted: "bg-white text-black   border-2 border-transparent",
    muted: "bg-gray-100 hover:bg-gray-200   border-2 border-transparent"
  };
  return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${spreadAttributes(rest)}${addAttribute([
    "rounded text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200",
    block && "w-full",
    sizes[size],
    styles[style],
    className
  ], "class:list")}>${renderSlot($$result, $$slots["default"])}
</a>`;
});

const $$Astro$3 = createAstro("D:/flutter_projects/astro_landing/src/components/pricing.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Pricing$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Pricing$1;
  const { plan } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div>
  <div class="flex flex-col w-full order-first lg:order-none border-2 border-[#D8DEE9] border-opacity-50 py-5 px-6 rounded-md">
    <div class="text-center">
      <h4 class="text-lg font-medium text-gray-400">${plan.name}</h4><p class="mt-3 text-4xl font-bold text-black md:text-4xl">
        ${plan.price && typeof plan.price === "object" ? plan.price.monthly : plan.price}
      </p>
      <!-- {
        plan.price.original && (
          <p class="mt-1 text-xl font-medium text-gray-400 line-through md:text-2xl">
            {plan.price.original}
          </p>
        )
      } -->
    </div><ul class="grid mt-8 text-left gap-y-4">
      ${plan.features.map((item) => renderTemplate`<li class="flex items-start gap-3 text-gray-800">
            ${renderComponent($$result, "Tick", $$Tick, { "class": "w-6 h-6" })}
            <span>${item}</span>
          </li>`)}
    </ul><div class="flex mt-8">
      ${renderComponent($$result, "Link", $$Link, { "href": plan.button.link || "#", "block": true, "style": plan.popular ? "primary" : "outline" }, { "default": () => renderTemplate`${plan.button.text || "Get Started"}` })}
    </div>
  </div>
</div>`;
});

const $$Astro$2 = createAstro("D:/flutter_projects/astro_landing/src/pages/pricing.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Pricing = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Pricing;
  const pricing = [
    {
      name: "Personal",
      price: "Free",
      popular: false,
      features: [
        "Lifetime free",
        "Up to 3 users",
        "Unlimited Pages",
        "Astro Sub domain",
        "Basic Integrations",
        "Community Support"
      ],
      button: {
        text: "Get Started",
        link: "/"
      }
    },
    {
      name: "Startup",
      price: {
        monthly: "$19",
        annual: "$16",
        discount: "10%",
        original: "$24"
      },
      popular: true,
      features: [
        "All Free Features",
        "Up to 20 users",
        "20 Custom domains",
        "Unlimited Collaborators",
        "Advanced Integrations",
        "Priority Support"
      ],
      button: {
        text: "Get Started",
        link: "#"
      }
    },
    {
      name: "Enterprise",
      price: "Custom",
      popular: false,
      features: [
        "All Pro Features",
        "Unlimited Custom domains",
        "99.99% Uptime SLA",
        "SAML & SSO Integration",
        "Dedicated Account Manager",
        "24/7 Phone Support"
      ],
      button: {
        text: "Contact us",
        link: "/contact"
      }
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Pricing" }, { "default": () => renderTemplate`${renderComponent($$result, "Container", $$Container, {}, { "default": () => renderTemplate`${renderComponent($$result, "Sectionhead", $$Sectionhead, {}, { "desc": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "desc" }, { "default": () => renderTemplate`Simple & Predictable pricing. No Surprises.` })}`, "title": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "title" }, { "default": () => renderTemplate`Pricing` })}` })}${maybeRenderHead($$result)}<div class="grid md:grid-cols-3 gap-10 mx-auto max-w-screen-lg mt-12">
      ${pricing.map((item) => renderTemplate`${renderComponent($$result, "Pricing", $$Pricing$1, { "plan": item })}`)}
    </div>` })}` })}`;
});

const $$file$2 = "D:/flutter_projects/astro_landing/src/pages/pricing.astro";
const $$url$2 = "/pricing";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Pricing,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

/** */
const getFormattedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

const $$Astro$1 = createAstro("D:/flutter_projects/astro_landing/src/layouts/BlogLayout.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$BlogLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BlogLayout;
  const { frontmatter } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": frontmatter.title }, { "default": () => renderTemplate`${renderComponent($$result, "Container", $$Container, {}, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="mx-auto max-w-[735px] mt-14">
      <span class="text-blue-400 uppercase tracking-wider text-sm font-medium">
        ${frontmatter.category}
      </span>
      <h1 class="text-4xl lg:text-5xl font-bold lg:tracking-tight mt-1 lg:leading-tight">
        ${frontmatter.title}
      </h1>
      <div class="flex gap-2 mt-3 items-center flex-wrap md:flex-nowrap">
        <span class="text-gray-400">
          ${frontmatter.author}
        </span>
        <span class="text-gray-400">•</span>
        <time class="text-gray-400"${addAttribute(frontmatter.publishDate, "datetime")}>
          ${getFormattedDate(frontmatter.publishDate)}
        </time>
        <span class="text-gray-400 hidden md:block">•</span>
        <div class="w-full md:w-auto flex flex-wrap gap-3">
          ${frontmatter.tags.map((tag) => renderTemplate`<span class="text-sm text-gray-500">#${tag}</span>`)}
        </div>
      </div>
    </div><div class="mx-auto prose prose-lg mt-6">
      ${renderSlot($$result, $$slots["default"])}
    </div><div class="text-center mt-8">
      <a href="/blog" class="bg-gray-100 px-5 py-3 rounded-md hover:bg-gray-200 transition">← Back to Blog</a>
    </div>` })}` })}`;
});

const $$file$1 = "D:/flutter_projects/astro_landing/src/layouts/BlogLayout.astro";
const $$url$1 = undefined;

const BlogLayout = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$BlogLayout,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const html$2 = "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.</p>\n<p>Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.</p>\n<h2 id=\"sodales-hendrerit-malesuada-et-vestibulum\">Sodales hendrerit malesuada et vestibulum</h2>\n<ul>\n<li>\n<p>Luctus euismod pretium nisi et, est dui enim.</p>\n</li>\n<li>\n<p>Curae eget inceptos malesuada, fermentum class.</p>\n</li>\n<li>\n<p>Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.</p>\n</li>\n<li>\n<p>Ligula lacus tempus ac porta, vel litora.</p>\n</li>\n</ul>\n<p>Torquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.</p>\n<p>Orci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.</p>\n<h2 id=\"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget\">Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget</h2>\n<p>Netus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.</p>\n<p>Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur.</p>";

				const frontmatter$3 = {"title":"The Complete Guide to Full Stack Web Development","excerpt":"Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti.","publishDate":"2022-11-08T11:39:36.050Z","image":"https://images.unsplash.com/photo-1593720213428-28a5b9e94613?&fit=crop&w=430&h=240","category":"Tutorials","author":"Janette Lynch","layout":"@layouts/BlogLayout.astro","tags":["webdev","tailwindcss","frontend"]};
				const file$3 = "D:/flutter_projects/astro_landing/src/pages/blog/complete-guide-fullstack-development.md";
				const url$3 = "/blog/complete-guide-fullstack-development";
				function rawContent$3() {
					return "\r\nLorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.\r\n\r\nOrnare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.\r\n\r\n## Sodales hendrerit malesuada et vestibulum\r\n\r\n- Luctus euismod pretium nisi et, est dui enim.\r\n\r\n- Curae eget inceptos malesuada, fermentum class.\r\n\r\n- Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.\r\n\r\n- Ligula lacus tempus ac porta, vel litora.\r\n\r\nTorquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.\r\n\r\nOrci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.\r\n\r\n## Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget\r\n\r\nNetus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.\r\n\r\nSuspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur.\r\n";
				}
				function compiledContent$3() {
					return html$2;
				}
				function getHeadings$3() {
					return [{"depth":2,"slug":"sodales-hendrerit-malesuada-et-vestibulum","text":"Sodales hendrerit malesuada et vestibulum"},{"depth":2,"slug":"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget","text":"Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget"}];
				}
				function getHeaders$2() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$3();
				}				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.file = file$3;
					content.url = url$3;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return createVNode($$BlogLayout, {
									file: file$3,
									url: url$3,
									content,
									frontmatter: content,
									headings: getHeadings$3(),
									rawContent: rawContent$3,
									compiledContent: compiledContent$3,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$3[Symbol.for('astro.needsHeadRendering')] = false;

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$3,
	file: file$3,
	url: url$3,
	rawContent: rawContent$3,
	compiledContent: compiledContent$3,
	getHeadings: getHeadings$3,
	getHeaders: getHeaders$2,
	Content: Content$3,
	default: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<p>Lorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.</p>\n<p>Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.</p>\n<h2 id=\"sodales-hendrerit-malesuada-et-vestibulum\">Sodales hendrerit malesuada et vestibulum</h2>\n<ul>\n<li>\n<p>Luctus euismod pretium nisi et, est dui enim.</p>\n</li>\n<li>\n<p>Curae eget inceptos malesuada, fermentum class.</p>\n</li>\n<li>\n<p>Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.</p>\n</li>\n<li>\n<p>Ligula lacus tempus ac porta, vel litora.</p>\n</li>\n</ul>\n<p>Torquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.</p>\n<p>Orci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.</p>\n<h2 id=\"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget\">Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget</h2>\n<p>Netus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.</p>\n<p>Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur.</p>";

				const frontmatter$2 = {"title":" Introduction to the Essential Data Structures & Algorithms","excerpt":"Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti.","publishDate":"2022-11-09T16:39:36.050Z","image":"https://images.unsplash.com/photo-1627163439134-7a8c47e08208?&fit=crop&w=430&h=240","category":"Courses","author":"Marcell Ziemann","layout":"@layouts/BlogLayout.astro","tags":["webdev","tailwindcss","frontend"]};
				const file$2 = "D:/flutter_projects/astro_landing/src/pages/blog/essential-data-structures-algorithms.md";
				const url$2 = "/blog/essential-data-structures-algorithms";
				function rawContent$2() {
					return "\r\nLorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.\r\n\r\nOrnare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.\r\n\r\n## Sodales hendrerit malesuada et vestibulum\r\n\r\n- Luctus euismod pretium nisi et, est dui enim.\r\n\r\n- Curae eget inceptos malesuada, fermentum class.\r\n\r\n- Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.\r\n\r\n- Ligula lacus tempus ac porta, vel litora.\r\n\r\nTorquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.\r\n\r\nOrci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.\r\n\r\n## Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget\r\n\r\nNetus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.\r\n\r\nSuspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur.\r\n";
				}
				function compiledContent$2() {
					return html$1;
				}
				function getHeadings$2() {
					return [{"depth":2,"slug":"sodales-hendrerit-malesuada-et-vestibulum","text":"Sodales hendrerit malesuada et vestibulum"},{"depth":2,"slug":"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget","text":"Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget"}];
				}
				function getHeaders$1() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$2();
				}				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.file = file$2;
					content.url = url$2;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return createVNode($$BlogLayout, {
									file: file$2,
									url: url$2,
									content,
									frontmatter: content,
									headings: getHeadings$2(),
									rawContent: rawContent$2,
									compiledContent: compiledContent$2,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$2[Symbol.for('astro.needsHeadRendering')] = false;

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$2,
	file: file$2,
	url: url$2,
	rawContent: rawContent$2,
	compiledContent: compiledContent$2,
	getHeadings: getHeadings$2,
	getHeaders: getHeaders$1,
	Content: Content$2,
	default: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<p>Whatever you do, it’s always beneficial to have the right tools at your disposal. I love working remotely and am a big advocate of doing remote software development. Therefore, I always strive to have the best equipment available to be as productive as possible. Writing posts like this constantly takes a lot of time. Luckily iVanky helped me out and sponsored this post so that I can concentrate on writing. I recently had the chance to test out one of their hottest products, a dual USB-C Docking Station that allows me to connect both my wide-screen monitors to my MacBook with Dual 4K@60Hz display connectivity. It also supports up to 96W laptop charging, which is awesome. If you are in a situation like me and want to upgrade your equipment, check out this and their other products! And now comes the article:</p>\n<p>Whether you are new to programming or already an experienced developer. In this industry, learning new concepts and languages/frameworks is\r\nmandatory to keep up with the rapid changes. Take for example React - open-sourced by Facebook just a shy 4 years ago it already became the number one choice for JavaScript devs around the globe. But also Vue and Angular, of course, have their legitimate follower-base. And then there is Svelte, and universal frameworks like Next.js or Nuxt.js, and Gatsby, and Gridsome, and Quasar, and and and. If you want to shine as an expert JavaScript developer you should at least have some experience in different frameworks and libraries - besides doing your homework with good, old JS.</p>\n<p>To help you become Frontend Masters, I have collected 9 different projects, each with a distinct topic and a different JavaScript framework or library as a tech stack that you can build and add to your portfolio. Remember, nothing helps you more than actually building stuff so go ahead, sharpen your mind and make this happen!</p>\n<h2 id=\"dictum-integer-fusce-ac-ridiculus\">Dictum integer fusce ac ridiculus</h2>\n<p>Lorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.</p>\n<p>Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.</p>\n<h2 id=\"sodales-hendrerit-malesuada-et-vestibulum\">Sodales hendrerit malesuada et vestibulum</h2>\n<ul>\n<li>\n<p>Luctus euismod pretium nisi et, est dui enim.</p>\n</li>\n<li>\n<p>Curae eget inceptos malesuada, fermentum class.</p>\n</li>\n<li>\n<p>Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.</p>\n</li>\n<li>\n<p>Ligula lacus tempus ac porta, vel litora.</p>\n</li>\n</ul>\n<p>Torquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.</p>\n<p>Orci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.</p>\n<h2 id=\"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget\">Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget</h2>\n<p>Netus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.</p>";

				const frontmatter$1 = {"title":"How to become a Frontend Master","excerpt":"Ornare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti.","publishDate":"2022-11-07T15:39:36.050Z","image":"https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?&fit=crop&w=430&h=240","category":"Tutorials","author":"Connor Lopez","layout":"@layouts/BlogLayout.astro","tags":["astro","tailwindcss","frontend"]};
				const file$1 = "D:/flutter_projects/astro_landing/src/pages/blog/how-to-become-frontend-master.md";
				const url$1 = "/blog/how-to-become-frontend-master";
				function rawContent$1() {
					return "\r\nWhatever you do, it's always beneficial to have the right tools at your disposal. I love working remotely and am a big advocate of doing remote software development. Therefore, I always strive to have the best equipment available to be as productive as possible. Writing posts like this constantly takes a lot of time. Luckily iVanky helped me out and sponsored this post so that I can concentrate on writing. I recently had the chance to test out one of their hottest products, a dual USB-C Docking Station that allows me to connect both my wide-screen monitors to my MacBook with Dual 4K@60Hz display connectivity. It also supports up to 96W laptop charging, which is awesome. If you are in a situation like me and want to upgrade your equipment, check out this and their other products! And now comes the article:\r\n\r\nWhether you are new to programming or already an experienced developer. In this industry, learning new concepts and languages/frameworks is\r\nmandatory to keep up with the rapid changes. Take for example React - open-sourced by Facebook just a shy 4 years ago it already became the number one choice for JavaScript devs around the globe. But also Vue and Angular, of course, have their legitimate follower-base. And then there is Svelte, and universal frameworks like Next.js or Nuxt.js, and Gatsby, and Gridsome, and Quasar, and and and. If you want to shine as an expert JavaScript developer you should at least have some experience in different frameworks and libraries - besides doing your homework with good, old JS.\r\n\r\nTo help you become Frontend Masters, I have collected 9 different projects, each with a distinct topic and a different JavaScript framework or library as a tech stack that you can build and add to your portfolio. Remember, nothing helps you more than actually building stuff so go ahead, sharpen your mind and make this happen!\r\n\r\n## Dictum integer fusce ac ridiculus\r\n\r\nLorem ipsum dolor sit amet consectetur adipiscing elit euismod rutrum, consequat fringilla ultricies nullam curae mollis semper conubia viverra, orci aenean dapibus pharetra nec tortor tellus cubilia. Ullamcorper mi lectus eu malesuada tempor massa praesent magna mattis posuere, lobortis vulputate ut duis magnis parturient habitant nibh id tristique, quis suspendisse donec nisl penatibus sem non feugiat taciti. Mollis per ridiculus integer cursus semper vestibulum fermentum penatibus cubilia blandit scelerisque, tempus platea leo posuere ac pharetra volutpat aliquet euismod id ullamcorper lobortis, urna est magna mus rhoncus massa curae libero praesent eget. Mattis malesuada vestibulum quis ac nam phasellus suscipit facilisis libero diam posuere, cursus massa vehicula neque imperdiet tincidunt dui egestas lacinia mollis aliquet orci, nisl curabitur dapibus litora dis cum nostra montes ligula praesent. Facilisi aliquam convallis molestie tempor blandit ultricies bibendum parturient cubilia quam, porttitor morbi torquent tempus taciti nec faucibus elementum phasellus, quis inceptos vestibulum gravida augue potenti eget nunc maecenas. Tempor facilisis ligula volutpat habitant consequat inceptos orci per potenti blandit platea, mus sapien eget vel libero vestibulum augue cubilia ut ultrices fringilla lectus, imperdiet pellentesque cum ridiculus convallis sollicitudin nisl interdum semper felis.\r\n\r\nOrnare cum cursus laoreet sagittis nunc fusce posuere per euismod dis vehicula a, semper fames lacus maecenas dictumst pulvinar neque enim non potenti. Torquent hac sociosqu eleifend potenti augue nulla vivamus senectus odio, quisque curabitur enim consequat class sociis feugiat ullamcorper, felis dis imperdiet cubilia commodo sed massa phasellus. Viverra purus mus nisi condimentum dui vehicula facilisis turpis, habitant nascetur lectus tempor quisque habitasse urna scelerisque, nibh nullam vestibulum luctus aenean mollis metus. Suscipit gravida duis nec aliquet natoque molestie a ridiculus scelerisque cum, justo cursus sapien sodales purus dignissim vel facilisi magnis, inceptos rutrum ut integer auctor commodo sollicitudin fames et. Faucibus ligula nibh sagittis mauris auctor posuere habitant, scelerisque phasellus accumsan egestas gravida viverra nam, sed etiam eleifend proin massa dictumst. Porttitor risus luctus per aenean tellus primis fringilla vitae fames lacinia mauris metus, nec pulvinar quisque commodo sodales ac nibh natoque phasellus semper placerat. Lectus aenean potenti leo sollicitudin tristique eros quam ligula, vestibulum diam consequat enim torquent nec tempus, blandit viverra dapibus eleifend dis nunc nascetur.\r\n\r\n## Sodales hendrerit malesuada et vestibulum\r\n\r\n- Luctus euismod pretium nisi et, est dui enim.\r\n\r\n- Curae eget inceptos malesuada, fermentum class.\r\n\r\n- Porttitor vestibulum aliquam porta feugiat velit, potenti eu placerat.\r\n\r\n- Ligula lacus tempus ac porta, vel litora.\r\n\r\nTorquent non nisi lacinia faucibus nibh tortor taciti commodo porttitor, mus hendrerit id leo scelerisque mollis habitasse orci tristique aptent, lacus at molestie cubilia facilisis porta accumsan condimentum. Metus lacus suscipit porttitor integer facilisi torquent, nostra nulla platea at natoque varius venenatis, id quam pharetra aliquam leo. Dictum orci himenaeos quam mi fusce lacinia maecenas ac magna eleifend laoreet, vivamus enim curabitur ullamcorper est ultrices convallis suscipit nascetur. Ornare fames pretium ante ac eget nisi tellus vivamus, convallis mauris sapien imperdiet sollicitudin aliquet taciti quam, lacinia tempor primis magna iaculis at eu. Est facilisi proin risus eleifend orci torquent ultricies platea, quisque nullam vel porttitor euismod sociis non, maecenas sociosqu interdum arcu sed pharetra potenti. Aliquet risus tempus hendrerit sapien tellus eget cursus enim etiam dui, lobortis nostra pellentesque odio posuere morbi ad neque senectus arcu eu, turpis proin ac felis purus fames magnis dis dignissim.\r\n\r\nOrci volutpat augue viverra scelerisque dictumst ut condimentum vivamus, accumsan cum sem sollicitudin aliquet vehicula porta pretium placerat, malesuada euismod primis cubilia rutrum tempus parturient. Urna mauris in nibh morbi hendrerit vulputate condimentum, iaculis consequat porttitor dui dis euismod eros, arcu elementum venenatis varius lectus nisi. Nibh arcu ultrices semper morbi quam aptent quisque porta posuere iaculis, vestibulum cum vitae primis varius natoque conubia eu. Placerat sociis sagittis sociosqu morbi purus lobortis convallis, bibendum tortor ridiculus orci habitasse viverra dictum, quis rutrum fusce potenti volutpat vehicula. Curae porta inceptos lectus mus urna litora semper aliquam libero rutrum sem dui maecenas ligula quis, eget risus non imperdiet cum morbi magnis suspendisse etiam augue porttitor placerat facilisi hendrerit. Et eleifend eget augue duis fringilla sagittis erat est habitasse commodo tristique quisque pretium, suspendisse imperdiet inceptos mollis blandit magna mus elementum molestie sed vestibulum. Euismod morbi hendrerit suscipit felis ornare libero ligula, mus tortor urna interdum blandit nisi netus posuere, purus fermentum magnis nam primis nulla.\r\n\r\n## Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget\r\n\r\nNetus at rutrum taciti vestibulum molestie conubia semper class potenti lobortis, hendrerit donec vitae ad libero natoque parturient litora congue. Torquent rhoncus odio cursus iaculis molestie arcu leo condimentum accumsan, laoreet congue duis libero justo tortor commodo fusce, massa eros hac euismod netus sodales mi magnis. Aenean nullam sollicitudin ad velit nulla venenatis suspendisse iaculis, aliquet senectus mollis aptent fringilla volutpat nascetur, nec urna vehicula lacinia neque augue orci. Suspendisse et eleifend convallis sollicitudin posuere diam turpis gravida congue ultrices, laoreet ultricies dapibus proin facilisis magna class praesent fusce. Mus morbi magnis ultricies sed turpis ultrices tempus tortor bibendum, netus nulla viverra torquent malesuada ridiculus tempor. Parturient sociosqu erat ullamcorper gravida natoque varius, etiam habitant augue praesent per curabitur iaculis, donec pellentesque cursus suscipit aliquet. Congue curae cursus scelerisque pellentesque quis fusce arcu eros dictumst luctus ridiculus nisl viverra, turpis class faucibus phasellus feugiat eleifend fringilla orci tristique habitasse conubia quam. Habitasse montes congue sodales rutrum cras torquent cursus auctor condimentum imperdiet egestas nascetur, platea tincidunt ut sollicitudin purus libero lobortis ad nisi diam quam.\r\n";
				}
				function compiledContent$1() {
					return html;
				}
				function getHeadings$1() {
					return [{"depth":2,"slug":"dictum-integer-fusce-ac-ridiculus","text":"Dictum integer fusce ac ridiculus"},{"depth":2,"slug":"sodales-hendrerit-malesuada-et-vestibulum","text":"Sodales hendrerit malesuada et vestibulum"},{"depth":2,"slug":"elementum-nisi-urna-cursus-nisl-quam-ante-tristique-blandit-ultricies-eget","text":"Elementum nisi urna cursus nisl quam ante tristique blandit ultricies eget"}];
				}
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$1();
				}				async function Content$1() {
					const { layout, ...content } = frontmatter$1;
					content.file = file$1;
					content.url = url$1;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return createVNode($$BlogLayout, {
									file: file$1,
									url: url$1,
									content,
									frontmatter: content,
									headings: getHeadings$1(),
									rawContent: rawContent$1,
									compiledContent: compiledContent$1,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$1[Symbol.for('astro.needsHeadRendering')] = false;

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$1,
	file: file$1,
	url: url$1,
	rawContent: rawContent$1,
	compiledContent: compiledContent$1,
	getHeadings: getHeadings$1,
	getHeaders,
	Content: Content$1,
	default: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BlogLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter;
  content.file = file;
  content.url = url;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file,
    url,
    content,
    frontmatter: content,
    headings: getHeadings(),
    "server:root": true,
    children
  });
};
const frontmatter = {
  "title": "Typography Example Post",
  "excerpt": "Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat",
  "publishDate": "2022-11-05T15:36:19.399Z",
  "category": "Technology",
  "layout": "@layouts/BlogLayout.astro",
  "image": "https://images.unsplash.com/photo-1542393545-10f5cde2c810?&fit=crop&w=430&h=240",
  "author": "Charles North",
  "tags": ["mdx", "astro", "blog"]
};
function getHeadings() {
  return [{
    "depth": 2,
    "slug": "headings",
    "text": "Headings"
  }, {
    "depth": 2,
    "slug": "heading-two",
    "text": "Heading two"
  }, {
    "depth": 3,
    "slug": "heading-three",
    "text": "Heading three"
  }, {
    "depth": 4,
    "slug": "heading-four",
    "text": "Heading four"
  }, {
    "depth": 5,
    "slug": "heading-five",
    "text": "Heading five"
  }, {
    "depth": 6,
    "slug": "heading-six",
    "text": "Heading six"
  }, {
    "depth": 2,
    "slug": "paragraphs",
    "text": "Paragraphs"
  }, {
    "depth": 2,
    "slug": "blockquotes",
    "text": "Blockquotes"
  }, {
    "depth": 2,
    "slug": "lists",
    "text": "Lists"
  }, {
    "depth": 3,
    "slug": "ordered-list",
    "text": "Ordered List"
  }, {
    "depth": 3,
    "slug": "unordered-list",
    "text": "Unordered List"
  }, {
    "depth": 2,
    "slug": "horizontal-rule",
    "text": "Horizontal rule"
  }, {
    "depth": 2,
    "slug": "table",
    "text": "Table"
  }, {
    "depth": 2,
    "slug": "code",
    "text": "Code"
  }, {
    "depth": 3,
    "slug": "inline-code",
    "text": "Inline code"
  }, {
    "depth": 3,
    "slug": "highlighted",
    "text": "Highlighted"
  }, {
    "depth": 2,
    "slug": "inline-elements",
    "text": "Inline elements"
  }, {
    "depth": 2,
    "slug": "mdx",
    "text": "MDX"
  }];
}
function _createMdxContent(props) {
  const _components = Object.assign({
    p: "p",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    h5: "h5",
    h6: "h6",
    a: "a",
    blockquote: "blockquote",
    ol: "ol",
    li: "li",
    ul: "ul",
    hr: "hr",
    table: "table",
    thead: "thead",
    tr: "tr",
    th: "th",
    tbody: "tbody",
    td: "td",
    code: "code",
    pre: "pre",
    span: "span",
    strong: "strong",
    img: "img",
    em: "em"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.p, {
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }), "\n", createVNode(_components.h2, {
      id: "headings",
      children: [createVNode("a", {
        name: "Headings"
      }), "Headings"]
    }), "\n", createVNode(_components.p, {
      children: "Sint sit cillum pariatur eiusmod nulla pariatur ipsum. Sit laborum anim qui mollit tempor pariatur nisi minim dolor. Aliquip et adipisicing sit sit fugiat commodo id sunt. Nostrud enim ad commodo incididunt cupidatat in ullamco ullamco Lorem cupidatat velit enim et Lorem. Ut laborum cillum laboris fugiat culpa sint irure do reprehenderit culpa occaecat. Exercitation esse mollit tempor magna aliqua in occaecat aliquip veniam reprehenderit nisi dolor in laboris dolore velit."
    }), "\n", createVNode(_components.h2, {
      id: "heading-two",
      children: "Heading two"
    }), "\n", createVNode(_components.p, {
      children: "Aute officia nulla deserunt do deserunt cillum velit magna. Officia veniam culpa anim minim dolore labore pariatur voluptate id ad est duis quis velit dolor pariatur enim. Incididunt enim excepteur do veniam consequat culpa do voluptate dolor fugiat ad adipisicing sit. Labore officia est adipisicing dolore proident eiusmod exercitation deserunt ullamco anim do occaecat velit. Elit dolor consectetur proident sunt aliquip est do tempor quis aliqua culpa aute. Duis in tempor exercitation pariatur et adipisicing mollit irure tempor ut enim esse commodo laboris proident. Do excepteur laborum anim esse aliquip eu sit id Lorem incididunt elit irure ea nulla dolor et. Nulla amet fugiat qui minim deserunt enim eu cupidatat aute officia do velit ea reprehenderit."
    }), "\n", createVNode(_components.h3, {
      id: "heading-three",
      children: "Heading three"
    }), "\n", createVNode(_components.p, {
      children: "Voluptate cupidatat cillum elit quis ipsum eu voluptate fugiat consectetur enim. Quis ut voluptate culpa ex anim aute consectetur dolore proident voluptate exercitation eiusmod. Esse in do anim magna minim culpa sint. Adipisicing ipsum consectetur proident ullamco magna sit amet aliqua aute fugiat laborum exercitation duis et."
    }), "\n", createVNode(_components.h4, {
      id: "heading-four",
      children: "Heading four"
    }), "\n", createVNode(_components.p, {
      children: "Commodo fugiat aliqua minim quis pariatur mollit id tempor. Non occaecat minim esse enim aliqua adipisicing nostrud duis consequat eu adipisicing qui. Minim aliquip sit excepteur ipsum consequat laborum pariatur excepteur. Veniam fugiat et amet ad elit anim laborum duis mollit occaecat et et ipsum et reprehenderit. Occaecat aliquip dolore adipisicing sint labore occaecat officia fugiat. Quis adipisicing exercitation exercitation eu amet est laboris sunt nostrud ipsum reprehenderit ullamco. Enim sint ut consectetur id anim aute voluptate exercitation mollit dolore magna magna est Lorem. Ut adipisicing adipisicing aliqua ullamco voluptate labore nisi tempor esse magna incididunt."
    }), "\n", createVNode(_components.h5, {
      id: "heading-five",
      children: "Heading five"
    }), "\n", createVNode(_components.p, {
      children: "Veniam enim esse amet veniam deserunt laboris amet enim consequat. Minim nostrud deserunt cillum consectetur commodo eu enim nostrud ullamco occaecat excepteur. Aliquip et ut est commodo enim dolor amet sint excepteur. Amet ad laboris laborum deserunt sint sunt aliqua commodo ex duis deserunt enim est ex labore ut. Duis incididunt velit adipisicing non incididunt adipisicing adipisicing. Ad irure duis nisi tempor eu dolor fugiat magna et consequat tempor eu ex dolore. Mollit esse nisi qui culpa ut nisi ex proident culpa cupidatat cillum culpa occaecat anim. Ut officia sit ea nisi ea excepteur nostrud ipsum et nulla."
    }), "\n", createVNode(_components.h6, {
      id: "heading-six",
      children: "Heading six"
    }), "\n", createVNode(_components.p, {
      children: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "paragraphs",
      children: [createVNode("a", {
        name: "Paragraphs"
      }), "Paragraphs"]
    }), "\n", createVNode(_components.p, {
      children: "Incididunt ex adipisicing ea ullamco consectetur in voluptate proident fugiat tempor deserunt reprehenderit ullamco id dolore laborum. Do laboris laboris minim incididunt qui consectetur exercitation adipisicing dolore et magna consequat magna anim sunt. Officia fugiat Lorem sunt pariatur incididunt Lorem reprehenderit proident irure. Dolore ipsum aliqua mollit ad officia fugiat sit eu aliquip cupidatat ipsum duis laborum laborum fugiat esse. Voluptate anim ex dolore deserunt ea ex eiusmod irure. Occaecat excepteur aliqua exercitation aliquip dolor esse eu eu."
    }), "\n", createVNode(_components.p, {
      children: "Officia dolore laborum aute incididunt commodo nisi velit est est elit et dolore elit exercitation. Enim aliquip magna id ipsum aliquip consectetur ad nulla quis. Incididunt pariatur dolor consectetur cillum enim velit cupidatat laborum quis ex."
    }), "\n", createVNode(_components.p, {
      children: "Officia irure in non voluptate adipisicing sit amet tempor duis dolore deserunt enim ut. Reprehenderit incididunt in ad anim et deserunt deserunt Lorem laborum quis. Enim aute anim labore proident laboris voluptate elit excepteur in. Ex labore nulla velit officia ullamco Lorem Lorem id do. Dolore ullamco ipsum magna dolor pariatur voluptate ipsum id occaecat ipsum. Dolore tempor quis duis commodo quis quis enim."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "blockquotes",
      children: [createVNode("a", {
        name: "Blockquotes"
      }), "Blockquotes"]
    }), "\n", createVNode(_components.p, {
      children: "Ad nisi laborum aute cupidatat magna deserunt eu id laboris id. Aliquip nulla cupidatat sint ex Lorem mollit laborum dolor amet est ut esse aute. Nostrud ex consequat id incididunt proident ipsum minim duis aliqua ut ex et ad quis. Laborum sint esse cillum anim nulla cillum consectetur aliqua sit. Nisi excepteur cillum labore amet excepteur commodo enim occaecat consequat ipsum proident exercitation duis id in."
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "Ipsum et cupidatat mollit exercitation enim duis sunt irure aliqua reprehenderit mollit. Pariatur Lorem pariatur laboris do culpa do elit irure. Eiusmod amet nulla voluptate velit culpa et aliqua ad reprehenderit sit ut."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Labore ea magna Lorem consequat aliquip consectetur cillum duis dolore. Et veniam dolor qui incididunt minim amet laboris sit. Dolore ad esse commodo et dolore amet est velit ut nisi ea. Excepteur ea nulla commodo dolore anim dolore adipisicing eiusmod labore id enim esse quis mollit deserunt est. Minim ea culpa voluptate nostrud commodo proident in duis aliquip minim."
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "Qui est sit et reprehenderit aute est esse enim aliqua id aliquip ea anim. Pariatur sint reprehenderit mollit velit voluptate enim consectetur sint enim. Quis exercitation proident elit non id qui culpa dolore esse aliquip consequat."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Ipsum excepteur cupidatat sunt minim ad eiusmod tempor sit."
    }), "\n", createVNode(_components.blockquote, {
      children: ["\n", createVNode(_components.p, {
        children: "Deserunt excepteur adipisicing culpa pariatur cillum laboris ullamco nisi fugiat cillum officia. In cupidatat nulla aliquip tempor ad Lorem Lorem quis voluptate officia consectetur pariatur ex in est duis. Mollit id esse est elit exercitation voluptate nostrud nisi laborum magna dolore dolore tempor in est consectetur."
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Adipisicing voluptate ipsum culpa voluptate id aute laboris labore esse fugiat veniam ullamco occaecat do ut. Tempor et esse reprehenderit veniam proident ipsum irure sit ullamco et labore ea excepteur nulla labore ut. Ex aute minim quis tempor in eu id id irure ea nostrud dolor esse."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "lists",
      children: [createVNode("a", {
        name: "Lists"
      }), "Lists"]
    }), "\n", createVNode(_components.h3, {
      id: "ordered-list",
      children: "Ordered List"
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: "Longan"
      }), "\n", createVNode(_components.li, {
        children: "Lychee"
      }), "\n", createVNode(_components.li, {
        children: "Excepteur ad cupidatat do elit laborum amet cillum reprehenderit consequat quis.\r\nDeserunt officia esse aliquip consectetur duis ut labore laborum commodo aliquip aliquip velit pariatur dolore."
      }), "\n", createVNode(_components.li, {
        children: "Marionberry"
      }), "\n", createVNode(_components.li, {
        children: ["Melon\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "Cantaloupe"
          }), "\n", createVNode(_components.li, {
            children: "Honeydew"
          }), "\n", createVNode(_components.li, {
            children: "Watermelon"
          }), "\n"]
        }), "\n"]
      }), "\n", createVNode(_components.li, {
        children: "Miracle fruit"
      }), "\n", createVNode(_components.li, {
        children: "Mulberry"
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "unordered-list",
      children: "Unordered List"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Olive"
      }), "\n", createVNode(_components.li, {
        children: ["Orange\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "Blood orange"
          }), "\n", createVNode(_components.li, {
            children: "Clementine"
          }), "\n"]
        }), "\n"]
      }), "\n", createVNode(_components.li, {
        children: "Papaya"
      }), "\n", createVNode(_components.li, {
        children: "Ut aute ipsum occaecat nisi culpa Lorem id occaecat cupidatat id id magna laboris ad duis. Fugiat cillum dolore veniam nostrud proident sint consectetur eiusmod irure adipisicing."
      }), "\n", createVNode(_components.li, {
        children: "Passionfruit"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "horizontal-rule",
      children: [createVNode("a", {
        name: "Horizontal"
      }), "Horizontal rule"]
    }), "\n", createVNode(_components.p, {
      children: "In dolore velit aliquip labore mollit minim tempor veniam eu veniam ad in sint aliquip mollit mollit. Ex occaecat non deserunt elit laborum sunt tempor sint consequat culpa culpa qui sit. Irure ad commodo eu voluptate mollit cillum cupidatat veniam proident amet minim reprehenderit."
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.p, {
      children: "In laboris eiusmod reprehenderit aliquip sit proident occaecat. Non sit labore anim elit veniam Lorem minim commodo eiusmod irure do minim nisi. Dolor amet cillum excepteur consequat sint non sint."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "table",
      children: [createVNode("a", {
        name: "Table"
      }), "Table"]
    }), "\n", createVNode(_components.p, {
      children: "Duis sunt ut pariatur reprehenderit mollit mollit magna dolore in pariatur nulla commodo sit dolor ad fugiat. Laboris amet ea occaecat duis eu enim exercitation deserunt ea laborum occaecat reprehenderit. Et incididunt dolor commodo consequat mollit nisi proident non pariatur in et incididunt id. Eu ut et Lorem ea ex magna minim ipsum ipsum do."
    }), "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", createVNode(_components.table, {
      children: [createVNode(_components.thead, {
        children: createVNode(_components.tr, {
          children: [createVNode(_components.th, {
            align: "left",
            children: "Table Heading 1"
          }), createVNode(_components.th, {
            align: "left",
            children: "Table Heading 2"
          }), createVNode(_components.th, {
            align: "center",
            children: "Center align"
          }), createVNode(_components.th, {
            align: "right",
            children: "Right align"
          }), createVNode(_components.th, {
            align: "left",
            children: "Table Heading 5"
          })]
        })
      }), createVNode(_components.tbody, {
        children: [createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        }), createVNode(_components.tr, {
          children: [createVNode(_components.td, {
            align: "left",
            children: "Item 1"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 2"
          }), createVNode(_components.td, {
            align: "center",
            children: "Item 3"
          }), createVNode(_components.td, {
            align: "right",
            children: "Item 4"
          }), createVNode(_components.td, {
            align: "left",
            children: "Item 5"
          })]
        })]
      })]
    }), "\n", createVNode(_components.p, {
      children: "Minim id consequat adipisicing cupidatat laborum culpa veniam non consectetur et duis pariatur reprehenderit eu ex consectetur. Sunt nisi qui eiusmod ut cillum laborum Lorem officia aliquip laboris ullamco nostrud laboris non irure laboris. Cillum dolore labore Lorem deserunt mollit voluptate esse incididunt ex dolor."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "code",
      children: [createVNode("a", {
        name: "Code"
      }), "Code"]
    }), "\n", createVNode(_components.h3, {
      id: "inline-code",
      children: "Inline code"
    }), "\n", createVNode(_components.p, {
      children: ["Ad amet irure est magna id mollit Lorem in do duis enim. Excepteur velit nisi magna ea pariatur pariatur ullamco fugiat deserunt sint non sint. Duis duis est ", createVNode(_components.code, {
        children: "code in text"
      }), " velit velit aute culpa ex quis pariatur pariatur laborum aute pariatur duis tempor sunt ad. Irure magna voluptate dolore consectetur consectetur irure esse. Anim magna ", createVNode(_components.code, {
        children: "<strong>in culpa qui officia</strong>"
      }), " dolor eiusmod esse amet aute cupidatat aliqua do id voluptate cupidatat reprehenderit amet labore deserunt."]
    }), "\n", createVNode(_components.h3, {
      id: "highlighted",
      children: "Highlighted"
    }), "\n", createVNode(_components.p, {
      children: "Et fugiat ad nisi amet magna labore do cillum fugiat occaecat cillum Lorem proident. In sint dolor ullamco ad do adipisicing amet id excepteur Lorem aliquip sit irure veniam laborum duis cillum. Aliqua occaecat minim cillum deserunt magna sunt laboris do do irure ea nostrud consequat ut voluptate ex."
    }), "\n", createVNode(_components.pre, {
      className: "astro-code",
      style: {
        backgroundColor: "#0d1117",
        overflowX: "auto"
      },
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "package"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "main"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " ("
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          }), createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "fmt"
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          }), createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "net/http"
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\""
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ")"
          })
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "func"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#D2A8FF"
            },
            children: "handler"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "(w http.ResponseWriter, r "
          }), createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "*"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "http.Request) {"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    fmt."
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "Fprintf"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "(w, "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\"Hi there, I love "
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "%s"
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "!\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ", r.URL.Path["
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "1"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ":])"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "}"
          })
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "func"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#D2A8FF"
            },
            children: "main"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "() {"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    http."
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "HandleFunc"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\"/\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ", handler)"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "    http."
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "ListenAndServe"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "("
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\":8080\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ", "
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "nil"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ")"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "}"
          })
        })]
      })
    }), "\n", createVNode(_components.p, {
      children: "Ex amet id ex aliquip id do laborum excepteur exercitation elit sint commodo occaecat nostrud est. Nostrud pariatur esse veniam laborum non sint magna sit laboris minim in id. Aliqua pariatur pariatur excepteur adipisicing irure culpa consequat commodo et ex id ad."
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "inline-elements",
      children: [createVNode("a", {
        name: "Inline"
      }), "Inline elements"]
    }), "\n", createVNode(_components.p, {
      children: ["Sint ea anim ipsum ad commodo cupidatat do ", createVNode(_components.strong, {
        children: "exercitation"
      }), " incididunt et minim ad labore sunt. Minim deserunt labore laboris velit nulla incididunt ipsum nulla. Ullamco ad laborum ea qui et anim in laboris exercitation tempor sit officia laborum reprehenderit culpa velit quis. ", createVNode(_components.strong, {
        children: "Consequat commodo"
      }), " reprehenderit duis ", createVNode(_components.a, {
        href: "#!",
        children: "irure"
      }), " esse esse exercitation minim enim Lorem dolore duis irure. Nisi Lorem reprehenderit ea amet excepteur dolor excepteur magna labore proident voluptate ipsum. Reprehenderit ex esse deserunt aliqua ea officia mollit Lorem nulla magna enim. Et ad ipsum labore enim ipsum ", createVNode(_components.strong, {
        children: "cupidatat consequat"
      }), ". Commodo non ea cupidatat magna deserunt dolore ipsum velit nulla elit veniam nulla eiusmod proident officia."]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.img, {
        src: "https://images.unsplash.com/photo-1471128466710-c26ff0d26143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY2MDc4MTk3Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
        alt: "Super wide"
      })
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.em, {
        children: "Proident sit veniam in est proident officia adipisicing"
      }), " ea tempor cillum non cillum velit deserunt. Voluptate laborum incididunt sit consectetur Lorem irure incididunt voluptate nostrud. Commodo ut eiusmod tempor cupidatat esse enim minim ex anim consequat. Mollit sint culpa qui laboris quis consectetur ad sint esse. Amet anim anim minim ullamco et duis non irure. Sit tempor adipisicing ea laboris ", createVNode(_components.code, {
        children: "culpa ex duis sint"
      }), " anim aute reprehenderit id eu ea. Aute ", createVNode(_components.a, {
        href: "#!",
        children: "excepteur proident"
      }), " Lorem minim adipisicing nostrud mollit ad ut voluptate do nulla esse occaecat aliqua sint anim."]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.img, {
        src: "https://placekitten.com/480/400",
        alt: "Not so big"
      })
    }), "\n", createVNode(_components.p, {
      children: ["Incididunt in culpa cupidatat mollit cillum qui proident sit. In cillum aliquip incididunt voluptate magna amet cupidatat cillum pariatur sint aliqua est ", createVNode(_components.em, {
        children: ["enim ", createVNode(_components.strong, {
          children: "anim"
        }), " voluptate"]
      }), ". Magna aliquip proident incididunt id duis pariatur eiusmod incididunt commodo culpa dolore sit. Culpa do nostrud elit ad exercitation anim pariatur non minim nisi ", createVNode(_components.strong, {
        children: ["adipisicing sunt ", createVNode(_components.em, {
          children: "officia"
        })]
      }), ". Do deserunt magna mollit Lorem commodo ipsum do cupidatat mollit enim ut elit veniam ea voluptate."]
    }), "\n", createVNode(_components.p, {
      children: ["Reprehenderit non eu quis in ad elit esse qui aute id ", createVNode(_components.a, {
        href: "#!",
        children: "incididunt"
      }), " dolore cillum. Esse laboris consequat dolor anim exercitation tempor aliqua deserunt velit magna laboris. Culpa culpa minim duis amet mollit do quis amet commodo nulla irure."]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    }), "\n", createVNode(_components.h2, {
      id: "mdx",
      children: "MDX"
    }), "\n", createVNode(_components.pre, {
      className: "astro-code",
      style: {
        backgroundColor: "#0d1117",
        overflowX: "auto"
      },
      children: createVNode(_components.code, {
        children: [createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "---"
          })
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "publishDate"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "'Aug 02 2022'"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FFA657"
            },
            children: "title"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ": "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "'Markdown elements demo post'"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "---"
          })
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "import"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " Logo "
          }), createVNode(_components.span, {
            style: {
              color: "#FF7B72"
            },
            children: "from"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: " "
          }), createVNode(_components.span, {
            style: {
              color: "#A5D6FF"
            },
            children: "\"@components/ui/button.astro\""
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ";"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "## "
          }), createVNode(_components.span, {
            style: {
              color: "#79C0FF"
            },
            children: "MDX"
          })]
        }), "\n", createVNode(_components.span, {
          className: "line"
        }), "\n", createVNode(_components.span, {
          className: "line",
          children: [createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: "<"
          }), createVNode(_components.span, {
            style: {
              color: "#7EE787"
            },
            children: "Button"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ">Click</"
          }), createVNode(_components.span, {
            style: {
              color: "#7EE787"
            },
            children: "Button"
          }), createVNode(_components.span, {
            style: {
              color: "#C9D1D9"
            },
            children: ">"
          })]
        })]
      })
    }), "\n", createVNode("div", {
      children: createVNode($$Button, {
        children: "Click Me"
      })
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "#top",
        children: "[Top]"
      })
    })]
  });
}
function MDXContent(props = {}) {
  return createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  });
}
__astro_tag_component__(getHeadings, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
MDXContent[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
const url = "/blog/kitchensink";
const file = "D:/flutter_projects/astro_landing/src/pages/blog/kitchensink.mdx";
function rawContent() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content = MDXContent;

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter,
	getHeadings,
	default: MDXContent,
	url,
	file,
	rawContent,
	compiledContent,
	Content
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("D:/flutter_projects/astro_landing/src/pages/blog.astro", "https://blog.nptn.io/", "file:///D:/flutter_projects/astro_landing/");
const $$Blog = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Blog;
  const posts = (await Astro2.glob(/* #__PURE__ */ Object.assign({"./blog/complete-guide-fullstack-development.md": () => Promise.resolve().then(() => _page4),"./blog/essential-data-structures-algorithms.md": () => Promise.resolve().then(() => _page5),"./blog/how-to-become-frontend-master.md": () => Promise.resolve().then(() => _page6),"./blog/kitchensink.mdx": () => Promise.resolve().then(() => _page7)}), () => "./blog/*.{md,mdx}")).sort(
    (a, b) => new Date(b.frontmatter.publishDate).valueOf() - new Date(a.frontmatter.publishDate).valueOf()
  );
  console.log(posts[0].frontmatter.image);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Blog" }, { "default": () => renderTemplate`${renderComponent($$result, "Container", $$Container, {}, { "default": () => renderTemplate`${renderComponent($$result, "Sectionhead", $$Sectionhead, {}, { "desc": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "desc" }, { "default": () => renderTemplate`We write about building startups and thoughts going on our mind.` })}`, "title": () => renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "slot": "title" }, { "default": () => renderTemplate`Our Blog` })}` })}${maybeRenderHead($$result)}<main class="mt-16">
      <ul class="grid gap-16 max-w-4xl mx-auto">
        ${posts.map((post, index) => renderTemplate`<li>
              <a${addAttribute(post.url, "href")}>
                <div class="grid md:grid-cols-2 gap-5 md:gap-10 items-center">

                  <div>
                    <span class="text-blue-400 uppercase tracking-wider text-sm font-medium">
                      ${post.frontmatter.category}
                    </span>

                    <h2 class="text-3xl font-semibold leading-snug tracking-tight mt-1 ">
                      ${post.frontmatter.title}
                    </h2>

                    <div class="flex gap-2 mt-3">
                      <span class="text-gray-400">
                        ${post.frontmatter.author}
                      </span>
                      <span class="text-gray-400">• </span>
                      <time class="text-gray-400"${addAttribute(post.frontmatter.publishDate, "datetime")}>
                        ${getFormattedDate(post.frontmatter.publishDate)}
                      </time>
                    </div>
                  </div>
                </div>
              </a>
            </li>`)}
      </ul>
    </main>` })}` })}`;
});

const $$file = "D:/flutter_projects/astro_landing/src/pages/blog.astro";
const $$url = "/blog";

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Blog,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/spec-checker.astro', _page1],['src/pages/contact.astro', _page2],['src/pages/pricing.astro', _page3],['src/pages/blog/complete-guide-fullstack-development.md', _page4],['src/pages/blog/essential-data-structures-algorithms.md', _page5],['src/pages/blog/how-to-become-frontend-master.md', _page6],['src/pages/blog/kitchensink.mdx', _page7],['src/pages/blog.astro', _page8],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["assets/blog.43f3a396.css","assets/complete-guide-fullstack-development.5cc0071f.css"],"scripts":[{"type":"external","value":"page.721c8a4f.js"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.43f3a396.css","assets/complete-guide-fullstack-development.5cc0071f.css"],"scripts":[{"type":"external","value":"page.721c8a4f.js"}],"routeData":{"route":"/spec-checker","type":"page","pattern":"^\\/spec-checker\\/?$","segments":[[{"content":"spec-checker","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/spec-checker.astro","pathname":"/spec-checker","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.43f3a396.css","assets/complete-guide-fullstack-development.5cc0071f.css","assets/contact.13b146c6.css"],"scripts":[{"type":"external","value":"page.721c8a4f.js"}],"routeData":{"route":"/contact","type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.43f3a396.css","assets/complete-guide-fullstack-development.5cc0071f.css"],"scripts":[{"type":"external","value":"page.721c8a4f.js"}],"routeData":{"route":"/pricing","type":"page","pattern":"^\\/pricing\\/?$","segments":[[{"content":"pricing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/pricing.astro","pathname":"/pricing","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.43f3a396.css","assets/complete-guide-fullstack-development.5cc0071f.css"],"scripts":[{"type":"external","value":"page.721c8a4f.js"}],"routeData":{"route":"/blog/complete-guide-fullstack-development","type":"page","pattern":"^\\/blog\\/complete-guide-fullstack-development\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"complete-guide-fullstack-development","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/complete-guide-fullstack-development.md","pathname":"/blog/complete-guide-fullstack-development","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.43f3a396.css","assets/complete-guide-fullstack-development.5cc0071f.css"],"scripts":[{"type":"external","value":"page.721c8a4f.js"}],"routeData":{"route":"/blog/essential-data-structures-algorithms","type":"page","pattern":"^\\/blog\\/essential-data-structures-algorithms\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"essential-data-structures-algorithms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/essential-data-structures-algorithms.md","pathname":"/blog/essential-data-structures-algorithms","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.43f3a396.css","assets/complete-guide-fullstack-development.5cc0071f.css"],"scripts":[{"type":"external","value":"page.721c8a4f.js"}],"routeData":{"route":"/blog/how-to-become-frontend-master","type":"page","pattern":"^\\/blog\\/how-to-become-frontend-master\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"how-to-become-frontend-master","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/how-to-become-frontend-master.md","pathname":"/blog/how-to-become-frontend-master","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.43f3a396.css","assets/complete-guide-fullstack-development.5cc0071f.css"],"scripts":[{"type":"external","value":"page.721c8a4f.js"}],"routeData":{"route":"/blog/kitchensink","type":"page","pattern":"^\\/blog\\/kitchensink\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"kitchensink","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/kitchensink.mdx","pathname":"/blog/kitchensink","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/blog.43f3a396.css","assets/complete-guide-fullstack-development.5cc0071f.css"],"scripts":[{"type":"external","value":"page.721c8a4f.js"}],"routeData":{"route":"/blog","type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog.astro","pathname":"/blog","_meta":{"trailingSlash":"ignore"}}}],"site":"https://blog.nptn.io/","base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","@components/spec-checker/SpecChecker":"SpecChecker.3a1e2c92.js","@astrojs/react/client.js":"client.88e9a2f9.js","astro:scripts/page.js":"page.721c8a4f.js","astro:scripts/before-hydration.js":""},"assets":["/assets/inter-cyrillic-variable-wghtOnly-normal.262a1054.woff2","/assets/inter-cyrillic-ext-variable-wghtOnly-normal.848492d3.woff2","/assets/inter-greek-ext-variable-wghtOnly-normal.fe977ddb.woff2","/assets/inter-greek-variable-wghtOnly-normal.89b4a3fe.woff2","/assets/inter-latin-ext-variable-wghtOnly-normal.45606f83.woff2","/assets/inter-vietnamese-variable-wghtOnly-normal.ac4e131c.woff2","/assets/inter-latin-variable-wghtOnly-normal.450f3ba4.woff2","/assets/blog.43f3a396.css","/assets/complete-guide-fullstack-development.5cc0071f.css","/assets/contact.13b146c6.css","/client.88e9a2f9.js","/favicon.svg","/opengraph.jpg","/page.721c8a4f.js","/robots.txt","/SpecChecker.3a1e2c92.js","/chunks/index.4aba05ec.js","/page.721c8a4f.js"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler };
