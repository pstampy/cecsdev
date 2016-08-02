(function ($) {

Drupal.behaviors.acton_responsive_table = {
  attach: function (context, settings) {
    $('table.responsive-scroll').once('responsive-scroll', function () {
      Drupal.acton_responsive_table('scroll', this);
    });
    $('table.responsive-split').once('responsive-split', function () {
      Drupal.acton_responsive_table('split', this);
    });
  }
};

/**
 * Responsive table registry.
 */
Drupal.acton_responsive_tables = [];

/**
 * Sets up a responsive table.
 */
Drupal.acton_responsive_table = function (mode, table, options) {
  var tableObject;
  switch (mode) {
    case 'split':
      tableObject = new Drupal.ActonSplitTable(table, options);
      break;

    case 'scroll':
      tableObject = new Drupal.ActonScrollTable(table, options);
      break;

    default:
      return;
  }

  Drupal.acton_responsive_tables[Drupal.acton_responsive_tables.length] = tableObject;
};

/**
 * Basic scrollable responsive table.
 */
Drupal.ActonScrollTable = function (table, options) {
  if (!options) {
    options = {};
  }

  this.table = $(table);
  this.options = $.extend({}, this.defaultOptions, Drupal.settings.acton_scroll_table, options);
  this.scrollState = false;
  this.init();
};
Drupal.settings.acton_scroll_table = Drupal.settings.acton_scroll_table || {};
Drupal.ActonScrollTable.prototype.defaultOptions = {
  /**
   * Window width below which to adapt responsive table.
   */
  breakpoint: 960,
  /**
   * Minimum width of the table, below which the table is fixed to this width.
   */
  tableMinWidth: 600
};
Drupal.ActonScrollTable.prototype.table = null;
Drupal.ActonScrollTable.prototype.wrapper = null;

/**
 * Sets up the scrollable table.
 */
Drupal.ActonScrollTable.prototype.init = function () {
  // Register event listeners.
  var self = this;
  $(window).load(function () {
    self.update();
  });
  $(window).bind('resize', function () {
    self.update();
  });
};

/**
 * Updates the table scrollable state.
 */
Drupal.ActonScrollTable.prototype.update = function () {
  // Adapt if window is below breakpoint and table is below threshold.
  var adapt = $(window).width() < this.options.breakpoint &&
    (!this.wrapper && this.table.width() < this.options.tableMinWidth ||
      this.wrapper && this.wrapper.width() < this.options.tableMinWidth);

  // Scroll if adapting.
  if (adapt) {
    if (!this.scrollState) {
      this.wrapper = $('<div class="responsive-scroll-wrapper"></div>')
        .replaceAll(this.table)
        .append($('<div></div>').append(this.table).width(this.options.tableMinWidth));
      this.scrollState = true;
    }
  }
  // Restore otherwise.
  else if (this.scrollState) {
    this.table.replaceAll(this.wrapper);
    this.wrapper = null;
    this.scrollState = false;
  }
};

/**
 * Split responsive table.
 *
 * Based on principles from <http://www.zurb.com/playground/responsive-tables>.
 */
Drupal.ActonSplitTable = function (table, options) {
  if (!options) {
    options = {};
  }

  this.table = $(table);
  this.options = $.extend({}, this.defaultOptions, Drupal.settings.acton_split_table, options);
  this.splitState = false;
  this.init();
};
Drupal.settings.acton_split_table = Drupal.settings.acton_split_table || {};
Drupal.ActonSplitTable.prototype.defaultOptions = {
  /**
   * Window width below which to adapt responsive table.
   */
  breakpoint: 960,
  /**
   * Minimum width of the table, below which the total width of the split tables
   * is fixed to this width.
   */
  tableMinWidth: 600,
  /**
   * Maximum percentage width of the pinned column(s).
   */
  pinnedMaxWidth: 0.4
};
Drupal.ActonSplitTable.prototype.table = null;
Drupal.ActonSplitTable.prototype.wrapper = null;
Drupal.ActonSplitTable.prototype.scrollable = null;
Drupal.ActonSplitTable.prototype.pinned = null;

/**
 * Sets up the split table.
 */
Drupal.ActonSplitTable.prototype.init = function () {
  // Check for pinned cells.
  if (!this.table.find('td.split-pinned, th.split-pinned').length) {
    this.initPinned();
  }

  // Register event listeners.
  var self = this;
  $(window).load(function () {
    self.update();
  });
  $(window).bind('resize', function () {
    self.update();
  });
};

/**
 * Sets up pin cells.
 */
Drupal.ActonSplitTable.prototype.initPinned = function () {
  // Pin first column.
  this.table.find('td:first-child, th:first-child').addClass('split-pinned');
};

/**
 * Updates the table split state.
 */
Drupal.ActonSplitTable.prototype.update = function () {
  // Adapt if window is below breakpoint and table is below threshold.
  var adapt = $(window).width() < this.options.breakpoint &&
    (!this.wrapper && this.table.width() < this.options.tableMinWidth ||
      this.wrapper && this.wrapper.width() < this.options.tableMinWidth);

  // Split if adapting.
  if (adapt) {
    if (!this.splitState) {
      this.split();
      this.splitState = true;
    }
  }
  // Restore otherwise.
  else if (this.splitState) {
    this.restore();
    this.splitState = false;
  }
  // Fit table.
  this.fitPinned();
};

/**
 * Splits the table.
 */
Drupal.ActonSplitTable.prototype.split = function () {
  if (!this.wrapper) {
    // Clone table as pinned columns.
    this.wrapper = $('<div class="responsive-split-wrapper"></div>')
      .replaceAll(this.table);
    this.table.appendTo(this.wrapper)
      .wrap('<div class="scrollable"></div>')
      .clone()
      .insertAfter(this.table.parent())
      .removeClass('responsive-split')
      .wrap('<div class="pinned"></div>');
    this.scrollable = $('.scrollable', this.wrapper);
    this.pinned = $('.pinned', this.wrapper);

    // Fix row heights.
    $('tr', this.wrapper).each(function () {
      var row = $(this);
      row.height(Math.ceil(row.outerHeight()));
    });

    // Scale pinned and scrollable table to widths less their respective columns
    // to hide.
    var pinnedWidth = 0;
    $('table tr:first', this.wrapper).find('th, td').filter('.split-pinned').each(function () {
      pinnedWidth += $(this).outerWidth();
    });
    $('table', this.pinned).wrap($('<div></div>').width(pinnedWidth));
    $('table', this.scrollable).wrap($('<div></div>').width(this.options.tableMinWidth - pinnedWidth));

    // Hide columns.
    $('th, td', this.pinned).not('.split-pinned').hide();
    $('th, td', this.scrollable).filter('.split-pinned').hide();
  }
};

/**
 * Fits the pinned column widths to beneath threshold.
 */
Drupal.ActonSplitTable.prototype.fitPinned = function () {
  if (this.wrapper) {
    var pinnedWidth = $('table', this.pinned).width() + 1;
    var pinnedMaxWidth = this.wrapper.width() * this.options.pinnedMaxWidth;
    // Use actual width if less than max width.
    if (pinnedWidth <= pinnedMaxWidth) {
      this.pinned.css('width', pinnedWidth);
      this.scrollable.css('margin-left', pinnedWidth);
    }
    // Use percentage width if wider than max.
    else {
      var percentage = (100 * this.options.pinnedMaxWidth) + '%';
      this.pinned.css('width', percentage);
      this.scrollable.css('margin-left', percentage);
    }
  }
};

/**
 * Restores the split table.
 */
Drupal.ActonSplitTable.prototype.restore = function () {
  if (this.wrapper) {
    // Unwrap and remove added elements.
    this.table.replaceAll(this.wrapper);
    this.table.css('width', '');
    $('th, td', this.table).filter('.split-pinned').show();
    this.wrapper = null;
  }
};

})(jQuery);
