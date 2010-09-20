
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
 * Shortcut for the lazy
 */
var Fe = Ferro;