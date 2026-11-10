const c=n=>`rgb(var(--${n}) / <alpha-value>)`;
module.exports={darkMode:'class',content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
theme:{extend:{colors:{paper:c('paper'),card:c('card'),ink:c('ink'),muted:c('muted'),line:c('line'),accent:c('accent'),danger:c('danger')}}},plugins:[]};
