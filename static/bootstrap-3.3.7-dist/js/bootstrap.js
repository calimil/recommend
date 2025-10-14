/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.');
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.7
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


// 模块一：Transition（过渡动画支持）

// + 确保函数被正确解析为表达式
// $ 参数接收 jQuery 对象，避免全局依赖
+function ($) {
  'use strict';// 使用严格模式，提高代码质量，避免一些常见的JavaScript陷阱

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  // 1. transitionEnd() 函数
  // 功能：检测浏览器支持的CSS过渡结束事件名称
  function transitionEnd() {
    // 创建一个虚拟DOM元素用于检测样式支持
    var el = document.createElement('bootstrap');

     // 不同浏览器对transitionend事件的不同命名
    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',     // Webkit内核浏览器（Chrome, Safari）
      MozTransition    : 'transitionend',           // Firefox
      OTransition      : 'oTransitionEnd otransitionend',// Opera
      transition       : 'transitionend'            // 标准
    };

    // 遍历所有浏览器前缀，检测哪个样式属性存在
    for (var name in transEndEventNames) {
      // 检查该样式属性是否在浏览器中支持
      if (el.style[name] !== undefined) {
        // 返回对应的事件名称
        return { end: transEndEventNames[name] }
      }
    }

    return false // 明确返回false，表示IE8等不支持transition的浏览器
  }

  // http://blog.alexmaccaw.com/css-transitions
  
  // 2. emulateTransitionEnd() 方法
  // 功能：模拟transition结束事件，确保在指定时间后触发
  // 参数：duration - 过渡动画的持续时间（毫秒）
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false;     // 标记事件是否已被调用
    var $el = this;         // 保存当前jQuery对象
    
    // 监听过渡结束事件
    $(this).one('bsTransitionEnd', function () { called = true });      // 当事件触发时，标记为已调用
    
    // 超时回调函数：如果transitionend事件没有触发，则手动触发
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) };     // 手动触发浏览器支持的transition结束事件
    
    //设置超时，确保过渡结束事件总会触发
    setTimeout(callback, duration);

    return this     // 返回this以支持链式调用
  };

  // 3. 初始化代码 - 事件系统设置
  // 文档加载完成后执行
  $(function () {
    // 将transition检测结果保存到jQuery.support中
    $.support.transition = transitionEnd();

    // 如果浏览器不支持CSS过渡，直接返回
    if (!$.support.transition) return;

    // 定义自定义事件bsTransitionEnd，代理到实际的transitionend事件
    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,       // 绑定原生事件
      delegateType: $.support.transition.end,   // 委托事件类型
      handle: function (e) {
        // 确保事件目标匹配当前元素时才执行处理函数
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);    // 立即执行函数，传入jQuery参数
// 模块一（32行开始）是Bootstrap框架中处理CSS动画过渡的核心组件，确保了在各种浏览器环境下动画事件的可靠触发。

/* ========================================================================
 * Bootstrap: alert.js v3.3.7
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

// 模块二：Alert（警告框）
+function ($) {
  'use strict';   // 严格模式

  // ALERT CLASS DEFINITION
  // ======================

  // 1. Alert构造函数
  // 功能：初始化警告框的事件监听。
  var dismiss = '[data-dismiss="alert"]';     // 定义关闭按钮的选择器 
  var Alert   = function (el) {
    // 在元素上绑定点击事件，点击关闭按钮时调用close方法
    // 使用事件委托，处理动态添加的元素
    $(el).on('click', dismiss, this.close)    
  };

  Alert.VERSION = '3.3.7';      // 组件版本号
  Alert.TRANSITION_DURATION = 150;    // 过渡动画持续时间(毫秒)

  // 2. 原型方法 - close（核心关闭逻辑）
  Alert.prototype.close = function (e) {
    var $this    = $(this);      // 当前点击的元素(关闭按钮)
    var selector = $this.attr('data-target');     // 获取目标警告框的选择器

    // 如果没有data-target属性，尝试从href获取
    if (!selector) {
      selector = $this.attr('href');      // 获取href
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }// 使用正则表达式去除IE7不兼容的部分

    // 根据选择器找到要关闭的警告框父元素，如果是"#"则获取空jQuery对象
    var $parent = $(selector === '#' ? [] : selector);

    // （总结）选择器解析逻辑：
    //      优先使用 data-target 属性
    //      备用使用 href 属性（兼容旧版本）
    //      正则表达式清理href中不必要的部分

    if (e) e.preventDefault();      // 阻止默认行为（如链接跳转）

    // 如果没找到指定父元素，查找最近的.alert元素
    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    // 触发关闭前事件，允许阻止默认关闭行为
    $parent.trigger(e = $.Event('close.bs.alert'));     //close.bs.alert - 关闭前触发，可取消

    // 如果事件被阻止，停止执行
    if (e.isDefaultPrevented()) return;

     // 移除'in'类，开始隐藏动画
    $parent.removeClass('in');

    // 内部函数：完全移除元素
    function removeElement() {
      // 从DOM分离，触发关闭后事件，清理数据
      $parent.detach().trigger('closed.bs.alert').remove()      //closed.bs.alert - 关闭后触发
    }

    // 判断是否支持过渡动画且元素有fade类
    $.support.transition && $parent.hasClass('fade') ?
    // 支持过渡：等待过渡动画结束后移除元素  
    $parent
        .one('bsTransitionEnd', removeElement)      // 监听过渡结束
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :      // 设置超时保障
      removeElement()     // 无动画直接移除
  };
    //（总结）动画处理逻辑：
    // 有动画：等待过渡动画完成后再移除元素
    // 无动画：立即移除元素
    // emulateTransitionEnd 确保即使动画异常也能执行移除

  // ALERT PLUGIN DEFINITION
  // =======================

  // 3. jQuery插件定义（插件主函数）
  //插件模式：支持链式调用和多个元素初始化
  function Plugin(option) {
    // 遍历每个匹配的元素
    return this.each(function () {
      var $this = $(this);      // 当前元素
      var data  = $this.data('bs.alert');     // 获取已存储的实例

      // 如果没有初始化过，创建并存储
      if (!data) $this.data('bs.alert', (data = new Alert(this)));
      // 如果传入方法名，调用对应方法
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert;     // 保存原有alert方法（防冲突）

  $.fn.alert             = Plugin;      // 定义jQuery插件
  $.fn.alert.Constructor = Alert;       // 暴露构造函数，便于扩展


  // ALERT NO CONFLICT
  // =================

  // 防冲突方法
  $.fn.alert.noConflict = function () {
    $.fn.alert = old;     // 恢复原有alert方法
    return this           // 返回当前插件实例
  };


  // ALERT DATA-API
  // ==============

  // 4. 数据API（自动初始化）
  // 功能： 通过数据属性自动初始化：在文档上委托点击事件
  // 为所有data-dismiss="alert"的元素自动绑定关闭功能
  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.7
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


// 模块三：Button（按钮）
+function ($) {
  'use strict';     // 严格模式

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  //1. 按钮类定义
  // Button构造函数：初始化按钮实例，合并默认配置。
  var Button = function (element, options) {
    this.$element  = $(element);      // 缓存jQuery元素对象
    this.options   = $.extend({}, Button.DEFAULTS, options);      // 合并默认选项和用户选项
    this.isLoading = false      // 初始化加载状态为false
  };

  // 版本信息
  Button.VERSION  = '3.3.7';

  // 默认配置
  Button.DEFAULTS = {
    loadingText: 'loading...'     // 加载时显示的文本
  };

  // 2. 核心方法 - setState（状态管理）
  // 设置按钮状态的方法
  Button.prototype.setState = function (state) {
    var d    = 'disabled';      // 禁用状态的类名和属性名
    var $el  = this.$element;   // 按钮元素
    var val  = $el.is('input') ? 'val' : 'html';      // 判断是input元素还是button元素，选择设置值的方法
    var data = $el.data();      // 元素数据

    // 构建状态文本的属性名，如 'loadingText'
    state += 'Text';

    // 如果没有保存原始文本，先保存当前文本内容
    if (data.resetText == null) $el.data('resetText', $el[val]());

    // 使用setTimeout推到事件循环的下一个tick执行，确保表单能够正常提交
    setTimeout($.proxy(function () {
      // 设置按钮文本：优先使用data属性中的文本，其次使用options中的文本，最后使用默认值
      $el[val](data[state] == null ? this.options[state] : data[state]);

      // 如果是设置为加载状态
      if (state == 'loadingText') {
        this.isLoading = true;      // 标记为加载中
        // 添加禁用类、属性和属性
        $el.addClass(d).attr(d, d).prop(d, true)
      } else if (this.isLoading) {
        // 如果之前是加载状态，现在要恢复正常状态
        this.isLoading = false;     // 取消加载标记
        // 移除禁用类、属性和属性
        $el.removeClass(d).removeAttr(d).prop(d, false)
      }
    }, this), 0)      // 延迟0毫秒，实际上就是推到下一个事件循环
  };

  // （总结）三重禁用机制：
  //              addClass('disabled') - 视觉样式
  //              attr('disabled', 'disabled') - HTML属性
  //              prop('disabled', true) - DOM属性（最可靠）

  // 3. 核心方法 - toggle（切换状态）
  // 按钮组同步：保持视觉状态与表单元素状态一致。
  Button.prototype.toggle = function () {
    var changed = true;     // 标记状态是否改变
    // 查找最近的按钮组父元素
    var $parent = this.$element.closest('[data-toggle="buttons"]');

    // 如果存在按钮组
    if ($parent.length) {
      // 查找按钮内的input元素
      var $input = this.$element.find('input');
      
        // 如果是单选按钮
      if ($input.prop('type') == 'radio') {
        // 如果已经是选中状态，则状态没有改变
        if ($input.prop('checked')) changed = false;
        // 移除按钮组中所有激活状态
        $parent.find('.active').removeClass('active');
        // 当前按钮添加激活状态
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        // 如果是复选框
        // 检查input的checked状态和按钮的active类是否一致
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false;
        // 切换按钮的激活状态
        this.$element.toggleClass('active')
      }
      // 同步input的checked属性和按钮的active类
      $input.prop('checked', this.$element.hasClass('active'));
      // 如果状态改变，触发change事件
      if (changed) $input.trigger('change')
    } else {
      // 独立按钮（不在按钮组中）
      // 更新ARIA accessibility属性
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'));      //无障碍支持：aria-pressed属性帮助屏幕阅读器识别按钮状态
      this.$element.toggleClass('active')     // 切换激活状态
    }
  };


  // BUTTON PLUGIN DEFINITION
  // ========================

  // 4. jQuery插件定义
  // 插件主函数，插件接口支持toggle和状态设置两种操作。
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);      // 当前元素
      var data    = $this.data('bs.button');      // 从数据缓存获取button实例
      var options = typeof option == 'object' && option;       // 如果option是对象，作为配置选项

      // 如果没有初始化过，创建新的Button实例并缓存（单列模式）
      if (!data) $this.data('bs.button', (data = new Button(this, options)));

      // 根据option参数执行相应操作
      if (option == 'toggle') data.toggle();      // 切换状态
      else if (option) data.setState(option)      // 设置状态：loading, reset等
    })
  }

  // 保存旧的$.fn.button引用
  var old = $.fn.button;

  // 注册jQuery插件
  $.fn.button             = Plugin;     // 定义jQuery插件
  $.fn.button.Constructor = Button;     // 暴露构造函数


  // BUTTON NO CONFLICT
  // ==================

  // 解决命名冲突
  $.fn.button.noConflict = function () {
    $.fn.button = old;      // 恢复原来的$.fn.button
    return this     // 返回当前插件
  };


  // BUTTON DATA-API
  // ===============

  //5. 数据API（自动初始化与事件处理）
  // 点击事件处理：自动为具有data-toggle属性的元素添加切换功能。
  $(document)
    // 点击事件委托：处理所有以"button"开头的data-toggle属性
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target).closest('.btn');     // 查找最近的.btn元素
      
      Plugin.call($btn, 'toggle'); // 触发切换
      
      // 如果点击的不是radio或checkbox input元素（防止重复触发和异常选择）
      if (!($(e.target).is('input[type="radio"], input[type="checkbox"]'))) {
        // 阻止默认行为，防止radio的双重点击和checkbox的双重选择
        e.preventDefault();
        
        // 焦点管理：确保目标组件获得焦点
        if ($btn.is('input,button')) $btn.trigger('focus');     // 如果是input或button元素，直接触发focus
        else $btn.find('input:visible,button:visible').first().trigger('focus')     // 否则查找内部第一个可见的input或button并触发focus
      }
    })

    //焦点样式管理：通过CSS类实现焦点状态的视觉反馈。
    // 焦点和模糊事件委托：处理按钮的focus样式
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      // 切换focus类：根据事件类型是focusin还是focusout
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);
//模块三，展示了Bootstrap如何处理复杂的UI状态管理和用户交互

/* ========================================================================
 * Bootstrap: carousel.js v3.3.7
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


//模块四：Carousel（轮播图）
+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  //1. 轮播类定义与初始化
  var Carousel = function (element, options) {
    this.$element    = $(element);      // 轮播容器
    this.$indicators = this.$element.find('.carousel-indicators');      // 指示器
    this.options     = options;     // 配置选项
    this.paused      = null;        // 暂停状态
    this.sliding     = null;        // 滑动进行中标志
    this.interval    = null;        // 自动轮播计时器
    this.$active     = null;        // 当前活动幻灯片
    this.$items      = null;        // 所有幻灯片

    // 键盘事件支持
    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this));

    // 鼠标悬停暂停（排除触摸设备）
    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))      // 鼠标进入暂停
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))      // 鼠标离开继续
  };

  Carousel.VERSION  = '3.3.7';      // 组件版本号

  Carousel.TRANSITION_DURATION = 600;     // 过渡动画持续时间

  Carousel.DEFAULTS = {
    interval: 5000,     // 自动轮播间隔
    pause: 'hover',     // 悬停暂停
    wrap: true,         // 循环播放
    keyboard: true      // 键盘支持
  };

  //2. 事件处理方法
  //键盘导航：支持左右箭头键切换幻灯片。
  Carousel.prototype.keydown = function (e) {
    // 如果在输入框中，不处理键盘事件
    if (/input|textarea/i.test(e.target.tagName)) return;
    switch (e.which) {
      case 37: this.prev(); break;      // 左箭头：上一张
      case 39: this.next(); break;      // 右箭头：下一张
      default: return     // 其他按键不处理
    }

    e.preventDefault()      // 阻止默认行为
  };

  //自动轮播控制：启动或恢复自动轮播。
  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false);     // 重置暂停状态

    this.interval && clearInterval(this.interval);      // 清除现有计时器

    // 设置新的自动轮播计时器
    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

    return this
  };

  //3. 幻灯片导航核心方法
  //索引计算：获取幻灯片在容器中的位置。
  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item');      // 获取所有幻灯片
    return this.$items.index(item || this.$active)      // 返回指定幻灯片的索引
  };

  //方向导航：根据方向计算下一张幻灯片，支持循环逻辑。
  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active);
    // 检查是否到达边界且不允许循环
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1));
    if (willWrap && !this.options.wrap) return active;      // 不循环则返回当前

    // 计算方向增量：上一张减1，下一张加1
    var delta = direction == 'prev' ? -1 : 1;
    var itemIndex = (activeIndex + delta) % this.$items.length;     // 计算新索引（支持循环）
    return this.$items.eq(itemIndex)
  };

  //跳转到指定位置：支持直接跳转到特定幻灯片。
  Carousel.prototype.to = function (pos) {
    var that        = this;     // 保存this引用
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));     // 当前激活索引

    if (pos > (this.$items.length - 1) || pos < 0) return;      // 索引越界检查

    // 如果正在滑动，等待完成后执行
    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }); // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle();      // 已经是目标位置

    // 根据位置关系决定滑动方向
    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  };

  //4. 暂停与导航控制方法
  Carousel.prototype.pause = function (e) {
    // 设置暂停状态：如果有事件参数，保持原状态；否则设置为true
    e || (this.paused = true);

    // 处理特殊情况：当有滑动动画正在进行时，需要立即完成过渡
    if (this.$element.find('.next, .prev').length && $.support.transition) {
      // 手动触发过渡结束事件，强制立即完成当前动画
      this.$element.trigger($.support.transition.end);
      // 重新启动轮播周期（参数true表示强制重置）
      this.cycle(true)
    }

    // 清除自动轮播的计时器
    this.interval = clearInterval(this.interval);

    return this     // 支持链式调用
  };

  Carousel.prototype.next = function () {
    // 安全检查：如果正在滑动中，忽略此次调用（防止重复触发）
    if (this.sliding) return;
    
    // 调用slide方法执行"下一张"滑动
    return this.slide('next')
  };

  Carousel.prototype.prev = function () {
    // 同样的防重复触发检查
    if (this.sliding) return;

    // 调用slide方法执行"上一张"滑动
    return this.slide('prev')
  };

  //5. 滑动动画核心逻辑
  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active');     // 当前活动幻灯片
    var $next     = next || this.getItemForDirection(type, $active);      // 下一张幻灯片
    var isCycling = this.interval;      // 是否正在自动轮播
    var direction = type == 'next' ? 'left' : 'right';      // 滑动方向
    var that      = this;

    if ($next.hasClass('active')) return (this.sliding = false);      // 已经是活动状态

    // 触发滑动前事件
    //滑动准备阶段：验证滑动条件，更新UI状态。
    var relatedTarget = $next[0];
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    });
    this.$element.trigger(slideEvent);
    if (slideEvent.isDefaultPrevented()) return;      // 事件被取消则停止

    this.sliding = true;      // 标记滑动开始

    isCycling && this.pause();      // 暂停自动轮播

    // 如果有指示器，更新指示器状态
    if (this.$indicators.length) {
      // 移除当前激活的指示器
      this.$indicators.find('.active').removeClass('active');
      // 获取对应位置的指示器并激活
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
      $nextIndicator && $nextIndicator.addClass('active')
    }

    // 触发滑动后事件
    //动画执行阶段：处理CSS过渡动画或直接切换。
    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
    // CSS过渡动画支持
    if ($.support.transition && this.$element.hasClass('slide')) {
      // 添加滑动方向类
      $next.addClass(type);
      $next[0].offsetWidth;       // 强制重排，触发CSS过渡
      // 添加滑动动画类
      $active.addClass(direction);
      $next.addClass(direction);
      
      // 绑定过渡结束事件
      $active
        .one('bsTransitionEnd', function () {
          // 动画完成后的清理工作
          $next.removeClass([type, direction].join(' ')).addClass('active');
           // 移除当前激活项的类
          $active.removeClass(['active', direction].join(' '));
          // 标记滑动结束
          that.sliding = false;

          // 异步触发滑动完成事件
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)     // 过渡结束保障
    } else {
      // 无动画版本的简单切换
      $active.removeClass('active');
      $next.addClass('active');
      this.sliding = false;
      // 触发滑动结束事件
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle();      // 恢复自动轮播

    return this
  };


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  //6. jQuery插件定义
  //插件接口：支持多种调用方式。
  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);      // 当前元素
      var data    = $this.data('bs.carousel');      // 从数据缓存获取实例
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option);     // 合并配置
      var action  = typeof option == 'string' ? option : options.slide;     // 判断操作类型

      // 如果没有初始化过，创建新实例并缓存
      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)));
      
      // 根据option类型执行相应操作
      if (typeof option == 'number') data.to(option);     // 跳转到指定索引
      else if (action) data[action]();      // 执行指定动作
      else if (options.interval) data.pause().cycle()     // 启动自动轮播
    })
  }

  // 保存旧的$.fn.carousel引用
  var old = $.fn.carousel;

  // 注册jQuery插件
  $.fn.carousel             = Plugin;
  $.fn.carousel.Constructor = Carousel;


  // CAROUSEL NO CONFLICT
  // ====================

  // 解决命名冲突
  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old;      // 恢复原来的$.fn.carousel
    return this     // 返回当前插件
  };


  // CAROUSEL DATA-API
  // =================

  //7. 数据API（自动初始化）
  //点击事件处理：处理导航按钮和指示器的点击。
  var clickHandler = function (e) {
    var href;
    var $this   = $(this);      // 点击的元素
    // 解析目标轮播容器
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // 处理IE7兼容
    // 如果不是轮播容器，直接返回
    if (!$target.hasClass('carousel')) return;
    
    // 合并配置选项
    var options = $.extend({}, $target.data(), $this.data());
    var slideIndex = $this.attr('data-slide-to');     // 获取目标幻灯片索引
    if (slideIndex) options.interval = false;     // 手动切换时暂停自动轮播

    // 初始化或调用轮播插件
    Plugin.call($target, options);

    // 如果指定了具体索引，跳转到该索引
    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)      // 跳转到指定幻灯片
    }

    e.preventDefault()      // 阻止默认行为
  };

  // 通过数据属性自动初始化
  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)     // 上一张/下一张
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler);     // 跳转到指定位置

  // 页面加载完成后自动初始化带有data-ride="carousel"的轮播
    $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this);
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.7
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

/* jshint latedef: false */

+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element);
    this.options       = $.extend({}, Collapse.DEFAULTS, options);
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]');
    this.transitioning = null;

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  };

  Collapse.VERSION  = '3.3.7';

  Collapse.TRANSITION_DURATION = 350;

  Collapse.DEFAULTS = {
    toggle: true
  };

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width');
    return hasWidth ? 'width' : 'height'
  };

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return;

    var activesData;
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing');

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse');
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    if (actives && actives.length) {
      Plugin.call(actives, 'hide');
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension();

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true);

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true);

    this.transitioning = 1;

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('');
      this.transitioning = 0;
      this.$element
        .trigger('shown.bs.collapse')
    };

    if (!$.support.transition) return complete.call(this);

    var scrollSize = $.camelCase(['scroll', dimension].join('-'));

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  };

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return;

    var startEvent = $.Event('hide.bs.collapse');
    this.$element.trigger(startEvent);
    if (startEvent.isDefaultPrevented()) return;

    var dimension = this.dimension();

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false);

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false);

    this.transitioning = 1;

    var complete = function () {
      this.transitioning = 0;
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    };

    if (!$.support.transition) return complete.call(this);

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  };

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  };

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element);
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  };

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in');

    $element.attr('aria-expanded', isOpen);
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  };

  function getTargetFromTrigger($trigger) {
    var href;
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('bs.collapse');
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false;
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)));
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse;

  $.fn.collapse             = Plugin;
  $.fn.collapse.Constructor = Collapse;


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old;
    return this
  };


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this);

    if (!$this.attr('data-target')) e.preventDefault();

    var $target = getTargetFromTrigger($this);
    var data    = $target.data('bs.collapse');
    var option  = data ? 'toggle' : $this.data();

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.7
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle   = '[data-toggle="dropdown"]';
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  };

  Dropdown.VERSION = '3.3.7';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return;
    $(backdrop).remove();
    $(toggle).each(function () {
      var $this         = $(this);
      var $parent       = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('open')) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent  = getParent($this);
    var isActive = $parent.hasClass('open');

    clearMenus();

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this };
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true');

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  };

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return;

    var $this = $(this);

    e.preventDefault();
    e.stopPropagation();

    if ($this.is('.disabled, :disabled')) return;

    var $parent  = getParent($this);
    var isActive = $parent.hasClass('open');

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus');
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a';
    var $items = $parent.find('.dropdown-menu' + desc);

    if (!$items.length) return;

    var index = $items.index(e.target);

    if (e.which == 38 && index > 0)                 index--;         // up
    if (e.which == 40 && index < $items.length - 1) index++;         // down
    if (!~index)                                    index = 0;

    $items.eq(index).trigger('focus')
  };


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data  = $this.data('bs.dropdown');

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)));
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown;

  $.fn.dropdown             = Plugin;
  $.fn.dropdown.Constructor = Dropdown;


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old;
    return this
  };


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.7
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options;
    this.$body               = $(document.body);
    this.$element            = $(element);
    this.$dialog             = this.$element.find('.modal-dialog');
    this.$backdrop           = null;
    this.isShown             = null;
    this.originalBodyPad     = null;
    this.scrollbarWidth      = 0;
    this.ignoreBackdropClick = false;

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  };

  Modal.VERSION  = '3.3.7';

  Modal.TRANSITION_DURATION = 300;
  Modal.BACKDROP_TRANSITION_DURATION = 150;

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  };

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  };

  Modal.prototype.show = function (_relatedTarget) {
    var that = this;
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget });

    this.$element.trigger(e);

    if (this.isShown || e.isDefaultPrevented()) return;

    this.isShown = true;

    this.checkScrollbar();
    this.setScrollbar();
    this.$body.addClass('modal-open');

    this.escape();
    this.resize();

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this));

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    });

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade');

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0);

      that.adjustDialog();

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in');

      that.enforceFocus();

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget });

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  };

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault();

    e = $.Event('hide.bs.modal');

    this.$element.trigger(e);

    if (!this.isShown || e.isDefaultPrevented()) return;

    this.isShown = false;

    this.escape();
    this.resize();

    $(document).off('focusin.bs.modal');

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal');

    this.$dialog.off('mousedown.dismiss.bs.modal');

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  };

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (document !== e.target &&
            this.$element[0] !== e.target &&
            !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  };

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  };

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  };

  Modal.prototype.hideModal = function () {
    var that = this;
    this.$element.hide();
    this.backdrop(function () {
      that.$body.removeClass('modal-open');
      that.resetAdjustments();
      that.resetScrollbar();
      that.$element.trigger('hidden.bs.modal')
    })
  };

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove();
    this.$backdrop = null
  };

  Modal.prototype.backdrop = function (callback) {
    var that = this;
    var animate = this.$element.hasClass('fade') ? 'fade' : '';

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate;

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body);

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false;
          return
        }
        if (e.target !== e.currentTarget) return;
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this));

      if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

      this.$backdrop.addClass('in');

      if (!callback) return;

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');

      var callbackRemove = function () {
        that.removeBackdrop();
        callback && callback()
      };
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  };

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  };

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight;

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  };

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  };

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect();
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth;
    this.scrollbarWidth = this.measureScrollbar()
  };

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
    this.originalBodyPad = document.body.style.paddingRight || '';
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  };

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  };

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    this.$body.append(scrollDiv);
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    this.$body[0].removeChild(scrollDiv);
    return scrollbarWidth
  };


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('bs.modal');
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)));
      if (typeof option == 'string') data[option](_relatedTarget);
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal;

  $.fn.modal             = Plugin;
  $.fn.modal.Constructor = Modal;


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old;
    return this
  };


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this);
    var href    = $this.attr('href');
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

    if ($this.is('a')) e.preventDefault();

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return; // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    });
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.7
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null;
    this.options    = null;
    this.enabled    = null;
    this.timeout    = null;
    this.hoverState = null;
    this.$element   = null;
    this.inState    = null;

    this.init('tooltip', element, options)
  };

  Tooltip.VERSION  = '3.3.7';

  Tooltip.TRANSITION_DURATION = 150;

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  };

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true;
    this.type      = type;
    this.$element  = $(element);
    this.options   = this.getOptions(options);
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport));
    this.inState   = { click: false, hover: false, focus: false };

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ');

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i];

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin';
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  };

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  };

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options);

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  };

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {};
    var defaults = this.getDefaults();

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    });

    return options
  };

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in';
      return
    }

    clearTimeout(self.timeout);

    self.hoverState = 'in';

    if (!self.options.delay || !self.options.delay.show) return self.show();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  };

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  };

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type);

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return;

    clearTimeout(self.timeout);

    self.hoverState = 'out';

    if (!self.options.delay || !self.options.delay.hide) return self.hide();

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  };

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type);

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e);

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
      if (e.isDefaultPrevented() || !inDom) return;
      var that = this;

      var $tip = this.tip();

      var tipId = this.getUID(this.type);

      this.setContent();
      $tip.attr('id', tipId);
      this.$element.attr('aria-describedby', tipId);

      if (this.options.animation) $tip.addClass('fade');

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement;

      var autoToken = /\s?auto?\s?/i;
      var autoPlace = autoToken.test(placement);
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top';

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this);

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
      this.$element.trigger('inserted.bs.' + this.type);

      var pos          = this.getPosition();
      var actualWidth  = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;

      if (autoPlace) {
        var orgPlacement = placement;
        var viewportDim = this.getPosition(this.$viewport);

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement;

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

      this.applyPlacement(calculatedOffset, placement);

      var complete = function () {
        var prevHoverState = that.hoverState;
        that.$element.trigger('shown.bs.' + that.type);
        that.hoverState = null;

        if (prevHoverState == 'out') that.leave(that)
      };

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  };

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip();
    var width  = $tip[0].offsetWidth;
    var height = $tip[0].offsetHeight;

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10);
    var marginLeft = parseInt($tip.css('margin-left'), 10);

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0;
    if (isNaN(marginLeft)) marginLeft = 0;

    offset.top  += marginTop;
    offset.left += marginLeft;

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0);

    $tip.addClass('in');

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth;
    var actualHeight = $tip[0].offsetHeight;

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

    if (delta.left) offset.left += delta.left;
    else offset.top += delta.top;

    var isVertical          = /top|bottom/.test(placement);
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

    $tip.offset(offset);
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  };

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  };

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip();
    var title = this.getTitle();

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
    $tip.removeClass('fade in top bottom left right')
  };

  Tooltip.prototype.hide = function (callback) {
    var that = this;
    var $tip = $(this.$tip);
    var e    = $.Event('hide.bs.' + this.type);

    function complete() {
      if (that.hoverState != 'in') $tip.detach();
      if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
        that.$element
          .removeAttr('aria-describedby')
          .trigger('hidden.bs.' + that.type)
      }
      callback && callback()
    }

    this.$element.trigger(e);

    if (e.isDefaultPrevented()) return;

    $tip.removeClass('in');

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete();

    this.hoverState = null;

    return this
  };

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element;
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  };

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  };

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element;

    var el     = $element[0];
    var isBody = el.tagName == 'BODY';

    var elRect    = el.getBoundingClientRect();
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var isSvg = window.SVGElement && el instanceof window.SVGElement;
    // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
    // See https://github.com/twbs/bootstrap/issues/20280
    var elOffset  = isBody ? { top: 0, left: 0 } : (isSvg ? null : $element.offset());
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() };
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null;

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  };

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  };

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 };
    if (!this.$viewport) return delta;

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
    var viewportDimensions = this.getPosition(this.$viewport);

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll;
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding;
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  };

  Tooltip.prototype.getTitle = function () {
    var title;
    var $e = this.$element;
    var o  = this.options;

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title);

    return title
  };

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000);
    while (document.getElementById(prefix));
    return prefix
  };

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template);
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  };

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  };

  Tooltip.prototype.enable = function () {
    this.enabled = true
  };

  Tooltip.prototype.disable = function () {
    this.enabled = false
  };

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  };

  Tooltip.prototype.toggle = function (e) {
    var self = this;
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type);
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click;
      if (self.isInStateTrue()) self.enter(self);
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  };

  Tooltip.prototype.destroy = function () {
    var that = this;
    clearTimeout(this.timeout);
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type);
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null;
      that.$arrow = null;
      that.$viewport = null;
      that.$element = null
    })
  };


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('bs.tooltip');
      var options = typeof option == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)));
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip;

  $.fn.tooltip             = Plugin;
  $.fn.tooltip.Constructor = Tooltip;


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old;
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.7
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  };

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

  Popover.VERSION  = '3.3.7';

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  });


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

  Popover.prototype.constructor = Popover;

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  };

  Popover.prototype.setContent = function () {
    var $tip    = this.tip();
    var title   = this.getTitle();
    var content = this.getContent();

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content);

    $tip.removeClass('fade top bottom left right in');

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  };

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  };

  Popover.prototype.getContent = function () {
    var $e = this.$element;
    var o  = this.options;

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  };

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  };


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('bs.popover');
      var options = typeof option == 'object' && option;

      if (!data && /destroy|hide/.test(option)) return;
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)));
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover;

  $.fn.popover             = Plugin;
  $.fn.popover.Constructor = Popover;


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old;
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.7
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body);
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element);
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector       = (this.options.target || '') + ' .nav li > a';
    this.offsets        = [];
    this.targets        = [];
    this.activeTarget   = null;
    this.scrollHeight   = 0;

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this));
    this.refresh();
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.7';

  ScrollSpy.DEFAULTS = {
    offset: 10
  };

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  };

  ScrollSpy.prototype.refresh = function () {
    var that          = this;
    var offsetMethod  = 'offset';
    var offsetBase    = 0;

    this.offsets      = [];
    this.targets      = [];
    this.scrollHeight = this.getScrollHeight();

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this);
        var href  = $el.data('target') || $el.attr('href');
        var $href = /^#./.test(href) && $(href);

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0]);
        that.targets.push(this[1])
      })
  };

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets      = this.offsets;
    var targets      = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null;
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  };

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    this.clear();

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]';

    var active = $(selector)
      .parents('li')
      .addClass('active');

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  };

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  };


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('bs.scrollspy');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)));
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy;

  $.fn.scrollspy             = Plugin;
  $.fn.scrollspy.Constructor = ScrollSpy;


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old;
    return this
  };


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.7
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  };

  Tab.VERSION = '3.3.7';

  Tab.TRANSITION_DURATION = 150;

  Tab.prototype.show = function () {
    var $this    = this.element;
    var $ul      = $this.closest('ul:not(.dropdown-menu)');
    var selector = $this.data('target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return;

    var $previous = $ul.find('.active:last a');
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    });
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    });

    $previous.trigger(hideEvent);
    $this.trigger(showEvent);

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return;

    var $target = $(selector);

    this.activate($this.closest('li'), $ul);
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      });
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  };

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active');
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length);

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false);

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true);

      if (transition) {
        element[0].offsetWidth; // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next();

    $active.removeClass('in')
  };


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data  = $this.data('bs.tab');

      if (!data) $this.data('bs.tab', (data = new Tab(this)));
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab;

  $.fn.tab             = Plugin;
  $.fn.tab.Constructor = Tab;


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old;
    return this
  };


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault();
    Plugin.call($(this), 'show')
  };

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.7
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options);

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this));

    this.$element     = $(element);
    this.affixed      = null;
    this.unpin        = null;
    this.pinnedOffset = null;

    this.checkPosition()
  };

  Affix.VERSION  = '3.3.7';

  Affix.RESET    = 'affix affix-top affix-bottom';

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  };

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop();
    var position     = this.$element.offset();
    var targetHeight = this.$target.height();

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false;

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom';
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null;
    var colliderTop    = initializing ? scrollTop : position.top;
    var colliderHeight = initializing ? targetHeight : height;

    if (offsetTop != null && scrollTop <= offsetTop) return 'top';
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom';

    return false
  };

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset;
    this.$element.removeClass(Affix.RESET).addClass('affix');
    var scrollTop = this.$target.scrollTop();
    var position  = this.$element.offset();
    return (this.pinnedOffset = position.top - scrollTop)
  };

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  };

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return;

    var height       = this.$element.height();
    var offset       = this.options.offset;
    var offsetTop    = offset.top;
    var offsetBottom = offset.bottom;
    var scrollHeight = Math.max($(document).height(), $(document.body).height());

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset;
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element);
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element);

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom);

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '');

      var affixType = 'affix' + (affix ? '-' + affix : '');
      var e         = $.Event(affixType + '.bs.affix');

      this.$element.trigger(e);

      if (e.isDefaultPrevented()) return;

      this.affixed = affix;
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null;

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  };


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('bs.affix');
      var options = typeof option == 'object' && option;

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)));
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix;

  $.fn.affix             = Plugin;
  $.fn.affix.Constructor = Affix;


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old;
    return this
  };


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this);
      var data = $spy.data();

      data.offset = data.offset || {};

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom;
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop;

      Plugin.call($spy, data)
    })
  })

}(jQuery);
