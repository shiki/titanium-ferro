
/**
 * Singleton
 */
Ferro = {

  _namespaceRoot: null,
  _includeRootPath: null,

  createObj: function(base, props) {
    function i() {};
    i.prototype = base;

    var instance = new i();
    if (typeof props != 'undefined') {
      for (var j in props)
        instance[j] = props[j];
    }
    return instance;
  },

  setRegisterNSRoot: function(obj) {
    this._namespaceRoot = obj;
  },

  /**
   * http://weblogs.asp.net/mschwarz/archive/2005/08/26/423699.aspx
   * Sample:
   *   Utils.setRegisterNSRoot(App).registerNS('UI.Login') creates the namespace: Piclyf.UI.Login
   * @param {String} ns
   */
  registerNS: function(ns) {
    var nsParts = ns.split(".");
    var root = this._namespaceRoot;
    for (var i = 0; i < nsParts.length; i++) {
      if (typeof root[nsParts[i]] == "undefined")
        root[nsParts[i]] = new Object();

      root = root[nsParts[i]];
    }
  },

  setIncludeRootPath: function(path) {
    this._includeRootPath = path;
    return this;
  },

  include: function(filePath) {
    Ti.include(this._includeRootPath + filePath);
    return this;
  },

  /**
   * http://stackoverflow.com/questions/929776/merging-associative-arrays-javascript/929791#929791
   */
  extend: function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  },

  /**
   * @path path String The path should NOT HAVE a leading slash.
   * @example Utils.getResourceFilePath('images/tabs/KS_nav_views.png')
   */
  getResourceFilePath: function(path) {
    var res;
    if (this.isIPhone() || this.isIPad())
      res = Ti.Filesystem.resourcesDirectory + '/' + path;
    else
      res = Ti.Filesystem.resourcesDirectory + path;
    return res;
  },

  isIPhone: function() {
    return Ti.Platform.osname.toLowerCase() == 'iphone';
  },

  isAndroid: function() {
    return Ti.Platform.osname.toLowerCase() == 'android';
  },

  isIPad: function() {
    return Ti.Platform.osname.toLowerCase() == 'ipad';
  },

  /**
   * @source http://www.thetruetribe.com/2008/05/truncating-text-with-javascript/
   */
  truncate: function(text, length, ellipsis) {
    if (!text)
      return '';

    // Set length and ellipsis to defaults if not defined
    if (typeof length == 'undefined') length = 100;
    if (typeof ellipsis == 'undefined') ellipsis = '...';

    // Return if the text is already lower than the cutoff
    if (text.length < length) return text;

    // Otherwise, check if the last character is a space.
    // If not, keep counting down from the last character
    // until we find a character that is a space
    for (var i = length-1; text.charAt(i) != ' '; i--) {
      length--;
    }

    // The for() loop ends when it finds a space, and the length var
    // has been updated so it doesn't cut in the middle of a word.
    return text.substr(0, length) + ellipsis;
  }
};


/**
 * Singleton
 */
Ferro.UI = {

  /**
   * @static
   */
  screenWidth: function() {
    return Ti.Platform.displayCaps.platformWidth;
  },

  /**
   * @static
   */
  screenHeight: function() {
    return Ti.Platform.displayCaps.platformHeight;
  },

  /**
   * @static
   */
  centerPos: function(width) {
    return this.screenWidth()/2 - width/2;
  },

  /**
   * Return screenWidth * pct
   * @param pct Number This should be in decimal form.
   * @static
   */
  percentOfWidth: function(pct) {
    return this.screenWidth() * pct;
  },

  /**
   * Returns the bottom coordinate of a control (top + height)
   * @return int
   */
  bottomOf: function(control) {
    return control.top + control.height;
  },

  rightOf: function(control) {
    return control.left + control.width;
  },

  createAlertDialog: function(options) {
    options = Fe.extend({
      //title: '',
      message: '',
      buttonNames: ['OK'],
      onClick: null
    }, options);
    var dialog = Ti.UI.createAlertDialog(options);
    if (typeof options.onClick == 'function')
      dialog.addEventListener('click', options.onClick);
    return dialog;
  }
};

/**
 * Meant to be used as a single request for the current location. This
 * will be useful in instances where you initiate a request while doing something
 * else. You can then attach a callback later which will be fired: immediately
 * if the request was already finished; or when the request is finished.
 */
Ferro.GeoLocationRequest = {

  NOT_STARTED: 0,
  STARTED: 1,
  FINISHED: 2,

  timedOut: false,

  _eventName: '',
  _purpose: '',
  _timeout: null,

  status: 0,
  resultEvent: null,

  setTimeout: function(ms) {
    this._timeout = ms;
    return this;
  },

  setPurpose: function(purpose) {
    this._purpose = purpose;
    return this;
  },

  start: function(callback) {
    if (typeof callback == 'function')
      this.attachCallback(callback);

    if (this.status != this.NOT_STARTED)
      return this;

    var c = this;
    this.timedOut = false;
    this.status = this.STARTED;

    if (!Ti.Geolocation.locationServicesEnabled) {
      c.status = c.FINISHED;
      Ti.App.fireEvent(c.getEventName(), null);
      return this;
    }

    Titanium.Geolocation.purpose = this._purpose;
    Titanium.Geolocation.getCurrentPosition(function(e) {          
      c.resultEvent = e; // replace eventdata if time out already occured      
      if (c.status != c.FINISHED) {
        c.status = c.FINISHED;
        Ti.App.fireEvent(c.getEventName(), c.resultEvent);
      }
    });

    if (this._timeout) {
      setTimeout(function() {        
        if (c.status == c.FINISHED) // don't replace eventdata if time out occured after getCurrentPosition
          return;
        c.timedOut = true;
        c.status = c.FINISHED;
        c.resultEvent = {error: 'Request timed out.'};
        Ti.App.fireEvent(c.getEventName(), c.resultEvent);
      }, this._timeout);
    }

    return this;
  },

  getEventName: function() {
    if (this._eventName.length == 0)
      this._eventName = 'Ferro.GeoLocationRequest.FINISHED.' + Math.random();
    return this._eventName;
  },

  attachCallback: function(callback) {
    if (this.status == this.FINISHED) {
      callback(this.resultEvent);
      return this;
    }

    Ti.App.addEventListener(this.getEventName(), callback);
    return this;
  }
};


/**
 * Shortcut for the lazy
 */
var Fe = Ferro;
