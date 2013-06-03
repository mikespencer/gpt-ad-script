define(['utils/urlCheck'], function(urlCheck){
  return urlCheck('reload', { type: 'variable' }) === 'true';
});