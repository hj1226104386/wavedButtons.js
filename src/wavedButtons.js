/**
 * author: huangjin
 * description: waved buttons
 * date: 2017-11-09
 * last-modified：2017-11-09 16:18
 */
;
(function(window, document, undefined) {
    "use strict"

    function Waves(opt) {
        // 默认配置
        var defaults = {
            opacity: .8,
            bgColor: '#fff',
            speed: '.6s'
        };
        // 判断参数是否传入及是否是对象
        if (opt !== void 666 && opt.constructor === Object) {
            // 拿到最新的配置
            this.options = this.extend(defaults, opt);
        } else {
            this.options = defaults;
        }
        // 执行初始化
        this.init();
    }
    Waves.prototype = {
            constructor: Waves,
            // 初始化操作
            init: function() {
                this.renderDOM();
                this.bindEvents();
                this.loadCss();
            },
            // DOM渲染
            renderDOM: function() {
                this.getBtns = document.querySelectorAll('[data-waves="waves"]');
            },
            // 绑定事件
            bindEvents: function() {
                var that = this;
                // 动态添加子元素
                var newSpan = document.createElement('span');
                newSpan.className = '_wave';
                for (var i = 0; i < that.getBtns.length; i++) {
                    var btn = that.getBtns[i];
                    btn.addEventListener('mousedown', function(e) {
                        e.stopPropagation();
                        // 在每个按钮中动态生成子元素
                        this.appendChild(newSpan)
                        var children = this.querySelector('._wave');
                        // 给子元素添加样式
                        that.calcPosition(this, children, e);
                        // 添加动画执行结束事件，只执行一次
                        if (children.addEventListener) {
                            children.addEventListener("webkitAnimationEnd", removeChild, false);
                        }

                        function removeChild(e) {
                            if (children.removeEventListener) {
                                // 动画执行结束后移除子元素
                                if (children.parentNode) {
                                    children.parentNode.removeChild(children);
                                }
                                children.removeEventListener("webkitAnimationEnd", removeChild, false);
                            }
                        }
                    });
                }
            },
            // 计算位置,设置样式
            calcPosition: function(btn, wave, e) {
                // 计算点击的按钮宽度
                var btnWidth = btn.offsetWidth;
                var btnHeight = btn.offsetHeight;
                var maxDist = Math.max(btnWidth, btnHeight);
                // 计算点击的位置在按钮中的坐标
                var left = e.offsetX;
                var top = e.offsetY;
                wave.style.width = maxDist + 'px';
                wave.style.height = maxDist + 'px';
                wave.style.top = top - maxDist / 2 + 'px';
                wave.style.left = left - maxDist / 2 + 'px';
                wave.style.backgroundColor = this.options.bgColor;
                wave.style.opacity = this.options.opacity;
                wave.style.animation = 'ripple ' + this.options.speed + ' linear';
            },
            // js动态加载css
            loadCss: function() {
                var heads = document.getElementsByTagName("head");
                var link = document.createElement('link');
                var cssUrl = './wavedButtons.css';
                link.setAttribute("rel", "stylesheet");
                link.setAttribute("type", "text/css");
                link.setAttribute("href", cssUrl);
                if (heads.length) {
                    heads[0].appendChild(link);
                } else {
                    document.documentElement.appendChild(link);
                }
            },
            // 对象继承
            extend: function(defaults, opt) {
                var that = this;
                var lastedOpts = Object.assign({}, defaults); // 深拷贝
                for (var i in opt) {
                    lastedOpts[i] = opt[i]
                }
                return lastedOpts;
            },
        }
        // 对外暴露一个接口
    window.wave = {};
    wave.init = function(options) {
        new Waves(options)
    };
    // 增加commonjs规范接口支持
    module.exports.wave = wave;
})(window, document)