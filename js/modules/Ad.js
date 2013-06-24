/*global googletag*/

/**
 * wpAd Ad object. Builds an individual ad
 */
define(['utils'], function(utils){

  /**
   * Constructor
   * @param {Object} config Object of settings
   */
  function Ad(config){
    this.config = utils.extend({
      'dfpSite': '/701/wpni.',
      'where': undefined,
      'size': null,
      'what': null,
      'pos': false,
      'posOverride': false,
      'interstitial': false,
      'onTheFly': false
    }, config, true);

    //interstitial logic is slightly different
    //if the type of ad is an interstitial, and the ad call hasn't already been made:
    if(this.config.what === 'interstitial' && !this.config.interstitial){
      this.config.interstitial = true;
      this.addInterstitialDiv();
    }

    //if not hardcode, generate the keyvalues
    if(!config.hardcode){
      this.keyvalues = this.buildKeyvalues();
    }

    // Nothing else happens for now in this script. "this.render" will be called after overrides,
    // custom keyvalues, etc, have been added via the placeAd2 call.

    return this;
  }

  Ad.prototype = {
    constructor: Ad,

    /**
     * Object of functions that generate keyvalues that are unique to each ad on the page
     */
    keyvaluesConfig: {
      pos: [
        function(){
          return [this.config.pos];
        }
      ],
      dfpcomp: [
        function(){
          return window.dfpcomp ? [window.dfpcomp] : false;
        }
      ],
      onTheFly: [
        function(){
          var rv = {},
            kvs, kv, len;
          if(this.config.onTheFly){
            kvs = this.config.onTheFly.split(';');
            len = kvs.length;
            while(len--){
              kv = kvs[len].split('=');
              if(kv[0] && kv[1]){
                rv[kv[0]] = rv[kv[0]] || [];
                rv[kv[0]].push(kv[1]);
              }
            }
          }
          return rv;
        }
      ]
    },

    /**
     * Extended in "[site_script]/overrides.js"
     */
    overrides: {
      //placeholder
    },

    /**
     * Loops through "this.overrides" functions, and calls each in the scope of "this"
     */
    overridesExec: function(){
      var key, check, r;
      for(key in this.overrides){
        if(this.overrides.hasOwnProperty(key) && this.config[key] && this.overrides[key][this.config[key]]){
          this.overrides[key][this.config[key]].call(this);
        }
      }
    },

    /**
     * Gets wrapping div/s for this ad
     */
    findSlugs: function(){
      this.config.slug = document.getElementById('slug_' + this.config.pos);
      this.config.wpni_adi = document.getElementById('wpni_adi_' + this.config.pos);
    },

    /**
     * Attempts to return the inner-most container for this ad to append itself to
     * @return {DOMElement} the container to append the ad to
     */
    getContainer: function(){
      this.findSlugs();
      return this.config.wpni_adi || this.config.slug;
    },

    /**
     * Uses configuration in "this.keyvaluesConfig" to build the keyvalues
     * @return {Object} key/value pairs for this ad to pass to GPT for the keyvalues
     */
    buildKeyvalues: function(){
      return utils.keyvalueIterator(this.keyvaluesConfig, this);
    },

    /**
     * Gets this ad's keyvalues
     * @return {Object} key:String pairs for this ad
     */
    getKeyvalues: function(){
      return this.keyvalues;
    },

    /**
     * Adds functions to "this.keyvaluesConfig". Needs to be called BEFORE keyvalues are generated via
     * keyvaluesConfig functions. This gives us a chance to insert any last minute keyvalue functions.
     * @param {Object} obj Object of functions or array of functions to pass to this.keyvaluesConfig
     */
    addKeyvaluesConfig: function(obj){
      utils.merge(this.keyvaluesConfig, obj);
    },

    /**
     * Adds keyvalue pairs AFTER keyvaluesConfig functions have executed and before the ad call has
     * been made.
     * @param {Object} obj Object of key:String or key:[Strings] pairs
     */
    addKeyvalues: function(obj){
      utils.merge(this.keyvalues, obj);
    },

    /**
     * Generates hardcoded ad call
     */
    hardcode: function(){
      googletag.content().setContent(this.slot, this.hardcode);
    },

    /**
     * Adds a container for an interatitial/out of page ad slot to the page. Legacy DFP had different
     * logic, so we need to add this container to the page, since it doesn't already exist. This is
     * given an ID in the standard format of "slug_" + pos value. Some extra CSS is added to attempt
     * to hide the div to prevent it pushing the page content down.
     */
    addInterstitialDiv: function(){
      var s = document.createElement('div');
      s.id = 'slug_' + this.config.pos;
      s.style.display = 'none';
      s.style.lineHeight = '0px';
      s.style.width = '0px';
      s.style.height = '0px';
      document.body.insertBefore(s, document.body.firstChild);
    },

    /**
     * Builds the GPT slot for this ad
     * @return {Object} GPT Slot
     */
    buildGPTSlot: function(){
      this.fullGPTSite = this.config.dfpSite + this.config.where;
      return (!this.config.interstitial ?
        googletag.defineSlot(this.fullGPTSite, this.config.size, this.container.id) :
        googletag.defineOutOfPageSlot(this.fullGPTSite, this.container.id))
          .addService(googletag.pubads());
    },

    /**
     * Returns this ad's GPT Slot
     * @return {Object} GPT Slot
     */
    getSlot: function(){
      return this.slot;
    },

    /**
     * Displays (or optionally, hides) the container for the ad (via display block/none)
     * @param {Boolean} opt_display Setting to true displays the container, false hides it
     */
    slugDisplay: function(opt_display){
      var display = opt_display !== false ? 'block' : 'none';
      if(this.config.slug){
        this.config.slug.style.display = display;
      }
      if(this.config.wpni_adi){
        this.config.wpni_adi.style.display = display;
      }
    },

    /**
     * After all keyvalues are generated, overrides are extended, etc., are generated, this renders
     * the ad via GPT, or refreshes it if the ad has already been rendered
     * (!this.slot === ad hasn't been rendered yet).
     */
    render: function(){
      if(!this.slot){
        this.container = this.getContainer();
        if(this.container){
          if(this.config.pos !== 'interstitial'){
            this.slugDisplay(true);
          }
          if(!this.config.hardcode){
            this.overridesExec();
            this.slot = this.buildGPTSlot();
            utils.setTargeting(this.keyvalues, this.slot);
            googletag.display(this.container.id);
          } else {
            this.container.innerHTML = this.config.hardcode;
          }
        }
      } else {
        this.refresh();
      }
    },

    /**
     * Refreshes this ad slot via GPT ('AJAX' ad calls in our old script)
     */
    refresh: function(){
      googletag.pubads().refresh([this.slot]);
    }

  };

  return Ad;

});