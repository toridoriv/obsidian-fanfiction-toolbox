/* eslint-disable no-inner-declarations */
/* eslint-disable no-useless-escape */
const strict = "strict",
  strictOption = (
    /**
     * @type {string | boolean}
     */ option,
  ) => option === strict && { strict: true };

/**
 * Options to minify an XML document.
 *
 * @typedef {object} MinifyOptions
 * @property {boolean} removeComments
 * Remove XML comments <!-- ... -->
 * @property {boolean | string} removeWhitespaceBetweenTags
 * Remove whitespace only between tags <anyTag/> <anyOtherTag/> (true / false or 'strict',
 * strict will not consider prolog / doctype, as tags)
 * @property {boolean} considerPreserveWhitespace
 * Remove / trim whitespace in texts like <anyTag> foo </anyTag>
 * @property {boolean} collapseWhitespaceInTags
 * Remove / collapse whitespace in tags <anyTag attributeA = "..." attributeB = "..."> ...
 * </anyTag >
 * @property {boolean} collapseEmptyElements
 * Collapse elements with start / end tags and no content to empty element tags <anyTag
 * anyAttribute = "..." ></anyTag >
 * @property {boolean | string} trimWhitespaceFromTexts
 * Remove / trim whitespace in texts like <anyTag> foo </anyTag> (true / false or
 * 'strict', strict will not consider prolog / doctype, as tags)
 * @property {boolean | string} collapseWhitespaceInTexts
 * Collapse whitespace in texts like <anyTag>foo bar baz</anyTag> (true / false or
 * 'strict', strict will not consider prolog / doctype, as tags)
 * @property {boolean} collapseWhitespaceInProlog
 * Remove / collapse whitespace in the xml prolog <?xml version = "1.0" ?>
 * @property {boolean} collapseWhitespaceInDocType
 * Remove / collapse whitespace in the xml document type declaration <!DOCTYPE DocType >
 * @property {boolean} removeSchemaLocationAttributes
 * Remove any xsi:schemaLocation / xsi:noNamespaceSchemaLocation attributes <anyTag
 * xsi:schemaLocation="/schema/" />
 * @property {boolean} removeUnnecessaryStandaloneDeclaration
 * Remove unnecessary standalone declaration in prolog <?xml standalone = "yes" ?>
 * @property {boolean} removeUnusedNamespaces
 * Remove unused namespaces and shorten the remaining ones to a minimum length.
 * @property {boolean} removeUnusedDefaultNamespace
 * Remove unused default namespace declaration if no tags with no namespace declaration
 * are present.
 * @property {boolean} shortenNamespaces
 * Shorten existing (non already one character namespaces) to a shorter equivalent.
 * @property {boolean} ignoreCData
 * Ignore CDATA sections <![CDATA[ ... ]]>
 */

/**
 * The default options applied when minifying an XML document.
 *
 * @type {MinifyOptions}
 */
export const defaultOptions = {
  removeComments: true,
  removeWhitespaceBetweenTags: true, // true / false or 'strict' (will not consider prolog / doctype, as tags)
  considerPreserveWhitespace: true,
  collapseWhitespaceInTags: true,
  collapseEmptyElements: true,
  trimWhitespaceFromTexts: false, // true / false or 'strict'
  collapseWhitespaceInTexts: false, // true / false or 'strict'
  collapseWhitespaceInProlog: true,
  collapseWhitespaceInDocType: true,
  removeSchemaLocationAttributes: false,
  removeUnnecessaryStandaloneDeclaration: true,
  removeUnusedNamespaces: true,
  removeUnusedDefaultNamespace: true,
  shortenNamespaces: true,
  ignoreCData: true,
};

/**
 * @param {string} string
 */
function trim(string) {
  return string
    .replace(/^[\s\uFEFF\xA0]+/g, String())
    .replace(/[\s\uFEFF\xA0]+$/g, String());
}

// @ts-ignore
const emptyRegExp = new RegExp(),
  emptyPattern = emptyRegExp.source,
  regExpGlobal = "g";
/**
 * @param {string} string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
/**
 * @param {string} string
 * @param {RegExp} regexp
 * @param {number} group
 */
function findAllMatches(string, regexp, group) {
  let matches = [],
    match;
  while ((match = regexp.exec(string))) {
    if (typeof group === "number") {
      match[group] && matches.push(match[group]);
    } else {
      matches.push(match);
    }
  }
  return matches;
}

// note: this funky looking positive lookbehind regular expression is necessary to match contents inside of tags <...>. this
// is due to that literally any characters except <&" are allowed to be put next to everywhere in XML. as even > is an allowed
// character, simply checking for (?<=<[^>]*) would not do the trick if e.g. > is used inside of a tag attribute.
const tagPattern = /(?<=<\/?[^?!\s\/>]+\b(?:\s+[^=\s>]+\s*=\s*(?:"[^"]*"|'[^']*'))*%1)/
    .source,
  noTagPattern = /[^<]*/.source,
  bracketPattern = tagPattern
    .replace(
      /(?<!\(\?)</,
      "<(?:" +
        /!\s*(?:--(?:[^-]|-[^-])*--\s*)|!\[(?:CDATA|.*?)\[(?:[^\]]|][^\]]|]][^>])*]]|!DOCTYPE\s+(?:[^>[]|\[[^\]]*\])*|\?[^>]*|/
          .source,
    )
    .replace("%1", ")%1"),
  prologPattern = tagPattern.replace(/(?<=(?<!\(\?)<).*(?=\\b)/, "\\?xml"),
  docTypePattern =
    /<!DOCTYPE\s+([^\s>[]+)(?:\s+(SYSTEM|PUBLIC)\s+("[^"]*"|'[^']*')(?:\s+("[^"]*"|'[^']*'))?)?(?:\s*\[([^\]]*)\])?\s*>/
      .source,
  preservePattern =
    /(?<!<(?:[^\s\/>:]+:)?pre[^<]*?>|\s+xml:space\s*=\s*(?:"preserve"|'preserve'|preserve)(?:\s+[^=\s>]+\s*=\s*(?:"[^"]*"|'[^']*'))*\s*>)/
      .source;
/**
 * @param {string} xml
 * @param {RegExp} regexp
 */
function findAllMatchesInTags(
  xml,
  regexp,
  options = {
    tagPattern,
    lookbehind: emptyRegExp,
    lookbehindPattern: String(),
    group: 0,
  },
) {
  const lookbehindPattern =
    options.lookbehindPattern || (options.lookbehind || emptyRegExp).source;
  return findAllMatches(
    xml,
    new RegExp(
      (options.tagPattern || tagPattern).replace("%1", lookbehindPattern) + regexp.source,
      regExpGlobal,
    ),
    options.group,
  );
}
// include non-tags means declaration like <! comments / doctype declaration and <? prolog / processing instructions
/**
 * @param {string} xml
 * @param {RegExp} regexp
 * @param {any}    replacement
 */
function replaceInTags(
  xml,
  regexp,
  replacement,
  options = { tagPattern, lookbehind: emptyRegExp, lookbehindPattern: String() },
) {
  const lookbehindPattern =
    options.lookbehindPattern || (options.lookbehind || emptyRegExp).source;
  return xml.replace(
    new RegExp(
      (options.tagPattern || tagPattern).replace("%1", lookbehindPattern) + regexp.source,
      regExpGlobal,
    ),
    replacement,
  );
}
const defaultReplaceBetweenOptions = {
  lookbehind: emptyRegExp,
  lookbehindPattern: String(),
  lookahead: emptyRegExp,
  lookaheadPattern: String(),
};
/**
 * @param {any}                xml
 * @param {{ source: string }} regexp
 * @param {any}                replacement
 */
function replaceBetweenTags(
  xml,
  regexp,
  replacement,
  options = defaultReplaceBetweenOptions,
) {
  const lookbehindPattern =
      "\\s*/?>" +
      (options.lookbehindPattern || (options.lookbehind || emptyRegExp).source),
    lookaheadPattern =
      (options.lookaheadPattern || (options.lookahead || emptyRegExp).source) + "<[^?!]";
  return replaceInTags(
    xml,
    new RegExp(regexp.source + `(?=${lookaheadPattern})`),
    replacement,
    // @ts-ignore
    { lookbehindPattern },
  );
}
/**
 * @param {any}                xml
 * @param {{ source: string }} regexp
 * @param {any}                replacement
 */
function replaceBetweenBrackets(
  xml,
  regexp,
  replacement,
  options = defaultReplaceBetweenOptions,
) {
  const lookbehindPattern =
      "\\s*[!?/]?>" +
      (options.lookbehindPattern || (options.lookbehind || emptyRegExp).source),
    lookaheadPattern =
      (options.lookaheadPattern || (options.lookahead || emptyRegExp).source) + "<";
  return replaceInTags(
    xml,
    new RegExp(regexp.source + `(?=${lookaheadPattern})`),
    replacement,
    // @ts-ignore
    { tagPattern: bracketPattern, lookbehindPattern },
  );
}
/**
 * @param {string} xml
 * @param {RegExp} regexp
 * @param {any}    replacement
 */
function replaceBetween(
  xml,
  regexp,
  replacement,
  options = { ...defaultOptions, strict: false },
) {
  // if not strict also consider the prolog <?xml ... ?>, processing instructions <?pi ... ?>, the document type declaration <!DOCTYPE ... >, CDATA sections <![CDATA[ ... ]]> and comments <!-- ... --> as tags here
  return (options.strict ? replaceBetweenTags : replaceBetweenBrackets)(
    xml,
    regexp,
    replacement,
    // @ts-ignore
    options,
  );
}

/**
 * @param {{
 *   apply: (arg0: any, arg1: IArguments) => any;
 *   replace: (arg0: RegExp, arg1: (group: any, number: any) => any) => any;
 * }} replacement
 */
function ignoreCData(replacement) {
  return function (
    /**
     * @type {any}
     */ match,
    /**
     * @type {any}
     */ offset,
    /**
     * @type {string}
     */ string,
    /**
     * @type {any}
     */
    // @ts-ignore
    groups,
  ) {
    // the interface of replacement functions contains any number of arguments at the second position, for contents of capturing groups.
    // the last argument is either an object (for browsers supporting named capturing groups) or the examined string otherwise.
    let argument = arguments.length - 1,
      captures;
    // eslint-disable-next-line no-unused-vars
    groups = typeof arguments[argument] === "object" ? arguments[argument--] : undefined;
    string = arguments[argument--];
    offset = arguments[argument--];
    captures = Array.prototype.slice.call(arguments, 1, argument + 1);

    // check if the offset lies inside of a CData section
    if (/<!\[CDATA\[(?![\s\S]*?]]>)/.test(string.substring(0, offset))) {
      return match; // if so do not replace anything
    }

    // if the replacement is a function, apply our arguments
    if (typeof replacement === "function") {
      // @ts-ignore
      return replacement.apply(this, arguments);
    }

    // otherwise execute the replacement of the capturing groups manually
    return captures
      ? replacement.replace(
          /(?<!\$)\$(\d+|\&)/g,
          (
            /**
             * @type {any}
             */
            // @ts-ignore
            group,
            /**
             * @type {string | number}
             */ number,
          ) =>
            // @ts-ignore
            ["0", "&"].includes(number)
              ? match
              : // @ts-ignore
                captures[parseInt(number - 1)] || String(),
        )
      : replacement;
  };
}

/**
 * Minify an XML document.
 *
 * @param {string}        xml                      The XML document to minify.
 * @param {MinifyOptions} [options=defaultOptions] The options to minify the XML document.
 * @returns {string} The minified XML document.
 */
export function minify(xml, options) {
  // apply the default options
  options = {
    ...defaultOptions,
    ...(options || {}),
  };

  // decide on whether to use the ignoreCData replacement function or not, to improve performance
  const replacer =
      options.ignoreCData && xml.includes("<![CDATA[")
        ? ignoreCData
        : (
            /**
             * @type {any}
             */ replacement,
          ) => replacement,
    // @ts-ignore
    emptyReplacer = replacer(String());

  /**
   * @param {string} xml
   */
  function removeComments(xml) {
    return xml.replace(/<!\s*(?:--(?:[^-]|-[^-])*--\s*)>/g, emptyReplacer);
  }

  // remove XML comments <!-- ... -->
  if (options.removeComments) {
    xml = removeComments(xml);
  }

  // remove whitespace only between tags <anyTag/>   <anyOtherTag/>
  if (options.removeWhitespaceBetweenTags) {
    xml = replaceBetween(
      xml,
      /\s+/,
      emptyReplacer,
      // @ts-ignore
      strictOption(options.removeWhitespaceBetweenTags),
    );
  }

  /**
   * @param {string} xml
   */
  function collapseWhitespaceInTags(xml, options = { tagPattern }) {
    // @ts-ignore
    xml = replaceInTags(xml, /\s+/, replacer(" "), options); // collapse whitespace between attributes
    // @ts-ignore
    xml = replaceInTags(xml, /\s*=\s*/, replacer("="), {
      ...options,
      lookbehind: /\s+[^=\s>]+/,
    }); // remove leading / tailing whitespace around attribute equal signs
    // @ts-ignore
    xml = replaceInTags(xml, /\s+(?=[/?]?>)/, emptyReplacer, options); // remove whitespace before closing > /> ?> of tags
    return xml;
  }

  // remove any xsi:schemaLocation / xsi:noNamespaceSchemaLocation attributes <anyTag xsi:schemaLocation="/schema/" />
  if (options.removeSchemaLocationAttributes) {
    xml = replaceInTags(
      xml,
      /\s+xsi:(?:noNamespaceS|s)chemaLocation\s*=\s*(?:"[^"]*"|'[^']*')/,
      // @ts-ignore
      replacer(" "),
    );
  }

  // remove / collapse whitespace in tags <anyTag  attributeA  =  "..."  attributeB  =  "..."> ... </anyTag  >
  if (options.collapseWhitespaceInTags) {
    xml = collapseWhitespaceInTags(xml);
  }

  // collapse elements with start / end tags and no content to empty element tags <anyTag anyAttribute = "..." ></anyTag >
  if (options.collapseEmptyElements) {
    // @ts-ignore
    xml = xml.replace(/<([^\s\/>]+)([^<]*?)(?<!\/)><\/\1\s*>/g, replacer("<$1$2/>"));
  }

  // remove / trim whitespace in texts like <anyTag>  foo  </anyTag>
  if (options.trimWhitespaceFromTexts) {
    // note, to avoid zero-length matches use two replaceBetween here (a zero-length match causes an endless loop in replacestream)
    // @ts-ignore
    xml = replaceBetween(xml, /\s+/, emptyReplacer, {
      lookbehindPattern: options.considerPreserveWhitespace ? preservePattern : null,
      lookaheadPattern: noTagPattern,
      ...strictOption(options.trimWhitespaceFromTexts),
    });
    // @ts-ignore
    xml = replaceBetween(xml, /\s+/, emptyReplacer, {
      lookbehindPattern:
        (options.considerPreserveWhitespace ? preservePattern : String()) + noTagPattern,
      ...strictOption(options.trimWhitespaceFromTexts),
    });
  }

  // collapse whitespace in texts like <anyTag>foo    bar   baz</anyTag>
  if (options.collapseWhitespaceInTexts) {
    // @ts-ignore
    xml = replaceBetween(xml, /\s+/, replacer(" "), {
      lookbehindPattern:
        (options.considerPreserveWhitespace ? preservePattern : emptyPattern) +
        noTagPattern,
      lookaheadPattern: noTagPattern,
      ...strictOption(options.collapseWhitespaceInTexts),
    });
  }

  // remove remove unnecessary standalone declaration in prolog <?xml standalone = "yes" ?>
  // the standalone declaration has "no meaning" according to the W3C definition, in case neither the external subset of the DocType declaration
  // contains any markup declarations (<!ELEMENT, <!ATTLIST, <!ENTITY, <!NOTATION) or a parameter entity (<!ENTITY %) is defined in the any subset
  // (because we do not read the external subset definition file e.g. schema.dtd, we assume as soon as either a SYSTEM/PUBLIC subset is defined, the standalone attribute must stay)
  if (options.removeUnnecessaryStandaloneDeclaration) {
    const docType = xml.match(new RegExp(docTypePattern));
    if (!docType || (!docType[2] && !(docType[5] && /<!ENTITY\s+%/.test(docType[5])))) {
      xml = replaceInTags(
        xml,
        /\s+standalone\s*=\s*(?:"yes"|'yes'|yes|"no"|'no'|no)/,
        emptyReplacer,
        // @ts-ignore
        { tagPattern: prologPattern },
      );
    }
  }

  // remove / collapse whitespace in the xml prolog <?xml version = "1.0" ?>
  if (options.collapseWhitespaceInProlog) {
    xml = collapseWhitespaceInTags(xml, { tagPattern: prologPattern });
  }

  // remove / collapse whitespace in the xml document type declaration <!DOCTYPE   DocType   >
  if (options.collapseWhitespaceInDocType) {
    xml = xml.replace(
      new RegExp(docTypePattern),
      replacer(
        // @ts-ignore
        (
          /**
           * @type {any}
           */
          // @ts-ignore
          match,
          /**
           * @type {any}
           */ name,
          /**
           * @type {any}
           */ type,
          /**
           * @type {any}
           */ literal1,
          /**
           * @type {any}
           */ literal2,
          /**
           * @type {any}
           */ subset,
        ) =>
          `<!DOCTYPE ${name}${[type, literal1, literal2]
            .map((token) => token && " " + token)
            .join(String())}${
            subset
              ? `[${((xml) => {
                  // use a simplified minify xml for the internal subset declaration of the document type
                  xml = removeComments(xml); // remove comments
                  xml = xml.replace(/\s+/g, " "); // collapse whitespace
                  xml = xml.replace(/>\s+</g, "><"); // remove any whitespace between declarations (assuming that > cannot appear in the declarations themselves)
                  return xml.trim ? xml.trim() : trim(xml);
                })(subset)}]`
              : String()
          }>`,
      ),
    );
  }

  // remove unused namespaces and shorten the remaining ones to a minimum length
  if (options.removeUnusedNamespaces || options.shortenNamespaces) {
    // the search for all xml namespaces in tags could result in some "fake" namespaces if a xmlns:... string is found inside of CDATA
    // tags. this however comes with no major drawback as we the replace only inside of tags and thus it simplifies the search
    let all = [
      // @ts-ignore
      ...new Set(findAllMatchesInTags(xml, /\s+xmlns:([^\s=]+)\s*=/g, { group: 1 })),
    ];

    // remove namespace declarations which are not used anywhere in the document (limitation: the approach taken here will not consider the structure of the XML document
    // thus namespaces which might be only used in a certain sub-tree of elements might not be removed, even though they are not used in that sub-tree)
    if (options.removeUnusedNamespaces) {
      let used = [
          ...new Set([
            ...findAllMatches(xml, /<([^\s\/>:]+):/g, 1), // look for all tags with namespaces (limitation: might also include tags inside of CData, we ignore that for now)
            // @ts-ignore
            ...findAllMatchesInTags(xml, /([^\s=:]+):/, { lookbehind: /\s+/, group: 1 }), // look for all attributes with namespaces
          ]),
        ].filter((ns) => ns !== "xmlns"),
        unused = all.filter((ns) => !used.includes(ns));

      if (unused.length) {
        xml = replaceInTags(
          xml,
          new RegExp(
            // @ts-ignore
            `\\s+xmlns:(?:${unused.map(escapeRegExp).join("|")})\\s*=\\s*(?:"[^"]*"|'[^']*')`,
          ),
          emptyReplacer,
        );
        all = used; // only used namespaces still present in the file
      }
    }

    // special case: remove unused default namespace declaration if no tags with no namespace declaration are present
    // (it's impossible for attributes with namespaces to refer back to the default namespace, so we can omit searching for them)
    if (options.removeUnusedDefaultNamespace && !/<([^\s\/>:]+)[\s\/>]/.test(xml)) {
      xml = replaceInTags(xml, /\s+xmlns\s*=\s*(?:"[^"]*"|'[^']*')/, emptyReplacer);
    }

    // shorten existing (non already one character namespaces) to a shorter equivalent
    if (options.shortenNamespaces) {
      const startCharset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_",
        charset = startCharset.substring(0, 52) + "0123456789-_.";
      /**
       * @param {string} [prefix]
       * @param {number} [length]
       */
      // @ts-ignore
      function firstUnusedNamespace(prefix, length) {
        if (!arguments.length) {
          for (length = 1; !(prefix = firstUnusedNamespace(String(), length)); length++);
          return prefix;
        } else if (!length) {
          return prefix;
        }

        const chars = prefix ? charset : startCharset;
        for (let char = 0; char < chars.length; char++) {
          // @ts-ignore
          let ns = firstUnusedNamespace(prefix + chars[char], length - 1);
          if (ns && !all.includes(ns)) {
            return ns;
          }
        }

        return false; // for this length / prefix there is no unused namespace to choose from
      }

      all.forEach((ns, idx) => {
        // never shorten the special "xsi" namespace or if already at absolute minimal length
        if (ns === "xsi" || ns.length === 1) {
          return;
        }

        // try to shorten the existing namespace to one character first, if it is occupied already, find the first unused one by brute force
        let newNs = !all.includes(ns[0]) ? ns[0] : firstUnusedNamespace();
        if (ns.length <= newNs.length) {
          return; // already at minimal length
        }

        // replace all occurrences of the namespace in the document and mark it as "used"
        xml = xml.replace(
          new RegExp(`<(/)?${ns}:`, regExpGlobal),
          // @ts-ignore
          replacer(`<$1${newNs}:`),
        ); // tags with namespaces
        // @ts-ignore
        xml = replaceInTags(xml, new RegExp(`${ns}:`), replacer(`${newNs}:`), {
          lookbehind: /\s+/,
        }); // attributes with namespaces
        xml = replaceInTags(
          xml,
          new RegExp(`xmlns:${ns}(?=[\\s=])`),
          // @ts-ignore
          replacer(`xmlns:${newNs}`),
          // @ts-ignore
          { lookbehind: /\s+/ },
        ); // namespace declaration

        all[idx] = newNs;
      });
    }
  }

  return xml.trim ? xml.trim() : trim(xml);
}
