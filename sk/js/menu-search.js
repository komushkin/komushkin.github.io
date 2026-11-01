function normalizeMenuText(value){return String(value).toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/[^а-яa-z0-9]+/g,' ').trim();}
function oneEditApart(a,b){
  if(Math.abs(a.length-b.length)>1)return false;
  if(a===b)return true;
  if(a.length===b.length){const differences=[];for(let i=0;i<a.length;i++)if(a[i]!==b[i])differences.push(i);return differences.length===1||(differences.length===2&&differences[1]===differences[0]+1&&a[differences[0]]===b[differences[1]]&&a[differences[1]]===b[differences[0]]);}
  const short=a.length<b.length?a:b,long=a.length<b.length?b:a;let i=0,j=0,edits=0;while(i<short.length&&j<long.length){if(short[i]===long[j]){i++;j++;}else{if(++edits>1)return false;j++;}}return true;
}
function menuSearchMatches(item,query){
  const normalized=normalizeMenuText(query);if(!normalized)return true;
  const haystack=normalizeMenuText(item[0]+' '+item[2]);
  if(haystack.includes(normalized))return true;
  const words=haystack.split(' ');
  return normalized.split(' ').every(term=>words.some(word=>word.includes(term)||(term.length>=4&&[-1,0,1].some(extra=>{const length=term.length+extra;return length>0&&word.length>=length&&oneEditApart(term,word.slice(0,length));}))));
}
function filterMenuIndices(menu,state){
  // Only the pumpkin/blackcurrant smoothie is explicitly free of coffee,
  // cocoa and tea in the current published selection. Cocoa is not caffeine-free.
  return menu.map((_,index)=>index).filter(index=>{
    const item=menu[index];return(state.category==='all'||item[1]===state.category)&&(!state.cold||item[1]==='cold')&&(!state.caffeineFree||index===10)&&menuSearchMatches(item,state.query);
  });
}
