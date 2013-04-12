define(function(){
  return {
    count: 0,
    picViews : 5,
    refresh: function () {
      this.count++;
      if(this.count % this.picViews === 0){
        placeAd2(commercialNode, 'leaderboard', '', '');
        placeAd2(commercialNode, 'bigbox', '', '');
      }
    }
  };
});