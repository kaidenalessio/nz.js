(() => { for (const i of ['xxl', 'xl', 'l', 'm', 'sm', 's']) { Font[i].family = 'Grandstander, cursive'; } })();
Font.lb = Font.generate(Font.l.size, Font.bold, Font.l.family);

let PLAYER_ID;
let SUBS;
let MOVES;
let UI_SUB_H = 300;