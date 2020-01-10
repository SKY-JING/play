let domBuf = {};

function initDomBuf () {
  domBuf = {
    a: [],
    attention: [],
    b: [],
    change: [],
    head: [],
    i: [],
    image: [],
    linePre: [],
    ol: [],
    pre: [],
    tr: [],
    td: [],
    ul: []
  };
}

function getCharNum (str, char) {
  return str.match(new RegExp(`${char}`, 'g')).length;
}

// ```content```
function initPre (data) {
  const regExp = /`{3}((?!`{3})[\s\S])*`{3}/gi;
  return data.replace(regExp, content => {
    domBuf.pre.push(`<pre>${content.replace(/^\s*`{3}/, '').replace(/`{3}\s*$/, '')}</pre>`);
    return '${pre}';
  })
}

// \content
function initChange (data) {
  const regExp = /\\.{1}/gi;
  return data.replace(regExp, content => {
    domBuf.change.push(content.replace(/^\\/, ''));
    return '${change}';
  });
}

// `content`
function initLinePre (data) {
  const regExp = /`((?!`)[\s\S])*`/gi;
  return data.replace(regExp, content => {
    domBuf.linePre.push(`<pre class="lineCode">${content.replace(/`/gi, '')}</pre>`);
    return '${linePre}';
  });
}

// **content**
function initB (data) {
  const regExp = /\*{2}((?!(\*{2})|\n)[\s\S])*\*{2}/gi;
  return data.replace(regExp, content => {
    domBuf.b.push(`<b>${content.replace(/^\s*\*{2}/, '').replace(/\*{2}\s*$/, '')}</b>`);
    return '${b}';
  });
}

// *content*
function initI (data) {
  const regExp = /\*((?!(\*)|\n)[\s\S])*\*/gi;
  return data.replace(regExp, content => {
    domBuf.i.push(`<i>${content.replace(/^\s*\*/, '').replace(/\*\s*$/, '')}</i>`);
    return '${i}';
  });
}

// #{num}content
function initHead (data) {
  const regExp = /#{1,}[\s|\n]*.+\n{1}/gi;
  return data.replace(regExp, content => {
    let num = getCharNum(content, '#');
    domBuf.head.push(`<h${num}>${content.replace(/#|\n/gi, '')}</h${num}>`);
    return '${head}';
  });
}

// ![image desc]('content')
function initImage (data) {
  const regExp = /\!\[((?!\])[\s\S])*\]\('((?!\))[\s\S])*'\)/gi;
  return data.replace(regExp, content => {
    let url = content.replace(/^\!\[/, '').replace(/\]\('/, '|').replace(/'\)$/, '').split('|');
    domBuf.image.push(`<image src="${url[1]}" desc="${url[0]}" \>`);
    return '${image}';
  });
}

// [content](link url)
function initLink (data) {
  const regExp = /\[((?!\])[\s\S])*\]\(((?!\))[\s\S])*\)/gi;
  return data.replace(regExp, content => {
    let url = content.replace(/^\[/, '').replace(/\]\(/, '|').replace(/\)$/, '').split('|');
    domBuf.a.push(`<a href="${url[1]}" target="_blank">${url[0]}</a>`);
    return '${a}';
  });
}

// > content
function initAttention (data) {
  const regExp = /[^-]>\s+.+\n{1}/gi;
  return data.replace(regExp, content => {
    domBuf.attention.push(`<div class="attention">${content.replace(/>\s*/, '').replace(/\n$/, '')}</div>`);
    return '${attention}';
  });
}

// * content
function initUl (data) {
  const regExp = /\*\s+.+\n{1}/gi;
  return data.replace(regExp, content => {
    domBuf.ul.push(`<li>${content.replace(/\*\s+/, '').replace(/\n$/, '')}</li>`);
    return '${ul}';
  }).replace(/(\$\{ul\})+/g, content => {
    return `<ul>${content}</ul>`;
  });
}

// 1. content
function initOl (data) {
  const regExp = /[0-9]+\.\s+.+\n{1}/gi;
  return data.replace(regExp, content => {
    domBuf.ol.push(`<li>${content.replace(/\n$/, '')}</li>`);
    return '${ol}';
  }).replace(/(\$\{ol\})+/g, content => {
    return `<ol>${content}</ol>`;
  });
}

// |****|****|
function initTable (data) {
  const regExp = /\|.+\n{1}/g;
  data = data.replace(regExp, content => {
    content = content.replace(/\s+/g, '').replace(/^\|/, '').replace(/\|$/, '').split('|');
    let buf = '';
    content.forEach(item => {
      buf += `<td>${item}</td>`
    });
    domBuf.td.push(buf);
    return '${td}';
  });
  
  return data.replace(/\$\{td\}/g, content => {
    domBuf.tr.push(`<tr>${content}</tr>`);
    return '${tr}';
  }).replace(/(\$\{tr\})+/g, content => {
    return `<table>${content}</table>`;
  });
}

function dealN (data) {
  const regExp = /\n/g;
  return data.replace(regExp, '<br>');
}

function md2html (data) {
  initDomBuf();
  data = initPre(data);
  data = initChange(data);
  data = initLinePre(data);
  data = initB(data);
  data = initI(data);
  data = initHead(data);
  data = initImage(data);
  data = initLink(data);
  data = initAttention(data);
  data = initUl(data);
  data = initOl(data);
  data = initTable(data);
  data = dealN(data);
  // unknow LaTeX

  for (key in domBuf) {
    domBuf[key].forEach(item => {
      data = data.replace(new RegExp(`\\$\\{${key}\\}`), item);
    });
  }
  return data;
}

module.exports = {
  md2html
};